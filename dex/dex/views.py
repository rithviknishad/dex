from django.db.models import Sum
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


from . import permissions
from .models import Prosumer, Order, Trade
from .serializers import (
    ProsumerSerializer,
    OrderSerialzier,
    TradeSerializer,
    ExchangeWebhookSerializer,
)


class ProsumerViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = Prosumer.objects.filter(deleted=False)
    serializer_class = ProsumerSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Prosumer,
    )

    def perform_create(self, serializer):
        serializer.save(billing_account=self.request.user)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return self.queryset.filter(billing_account=self.request.user)


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    lookup_field = "id"
    queryset = Order.objects.filter(deleted=False)
    serializer_class = OrderSerialzier
    permission_classes = (
        IsAuthenticated,
        permissions.Order,
    )

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()

        prosumer_id = self.kwargs.get("prosumer_id")
        if prosumer_id:
            return super().get_queryset().filter(prosumer__id=prosumer_id)

        return (
            super().get_queryset().filter(prosumer__billing_account=self.request.user)
        )

    def perform_create(self, serializer):
        prosumer_id = self.kwargs.get("prosumer_id")
        if not prosumer_id:
            raise MethodNotAllowed(
                "POST",
                "To create an order, use the API that specifies the prosumer ID in the URL.",
            )
        prosumer = Prosumer.objects.get(id=prosumer_id)
        serializer.save(prosumer=prosumer)


class TradeViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    lookup_field = "id"
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Trade,
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset

        prosumer_id = self.kwargs.get("prosumer_id")
        if prosumer_id:
            return queryset.filter(
                Q(buy__prosumer__id=prosumer_id) | Q(sell__prosumer__id=prosumer_id)
            )

        return queryset.filter(
            Q(buy__prosumer__billing_account=self.request.user)
            | Q(sell__prosumer__billing_account=self.request.user)
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="webhooks/exchange",
        serializer_class=ExchangeWebhookSerializer,
    )
    def exchange_webhook(self, request, *args, **kwargs):
        if not self.request.headers.get("X-Exchange-Signature"):
            return Response(
                {
                    "error": "Missing X-Exchange-Signature header",
                    "reason": "This webhook is only for the exchange to call",
                },
                status=400,
            )

        open_buy_orders = BuyOrder.objects.filter(status__lte=OrderStatus.OPEN)
        open_sell_orders = SellOrder.objects.filter(status__lte=OrderStatus.OPEN)

        generation_sum = open_buy_orders.aggregate(Sum("energy"))["energy__sum"]
        consumption_sum = open_sell_orders.aggregate(Sum("energy"))["energy__sum"]

        transmission_losses = generation_sum - consumption_sum
        if transmission_losses < 0:
            return Response(
                {"error": f"Transmission Losses={transmission_losses}"},
                status=400,
            )

        serializer = ExchangeWebhookSerializer(
            data={
                "trades": [],
                "efficiency": consumption_sum / generation_sum,
            }
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
