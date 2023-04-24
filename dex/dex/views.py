from django.db.models import Q, Sum, F, FloatField, Case, When
from django.db.models.functions import Abs
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status


from . import permissions
from .models import Prosumer, Order, OrderStatus, TradeSettlementStatus, Trade
from .serializers import (
    SummarySerializer,
    ProsumerSerializer,
    OrderSerialzier,
    TradeSerializer,
)


class SummaryViewSet(GenericViewSet):

    permission_classes = (IsAuthenticated,)
    serializer_class = SummarySerializer

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        prosumers = Prosumer.objects.filter(deleted=False)
        user_prosumers = prosumers.filter(billing_account=request.user)

        orders = Order.objects.filter(deleted=False)
        user_orders = orders.filter(prosumer__billing_account=request.user)

        trades = Trade.objects.filter(deleted=False)
        user_trades = trades.filter(order__prosumer__billing_account=request.user)

        total_generation = (
            orders.filter(energy__gt=0).aggregate(Sum("energy"))["energy__sum"] or 0
        )
        total_demand = -(
            orders.filter(energy__lt=0).aggregate(Sum("energy"))["energy__sum"] or 0
        )

        user_total_generation = (
            user_orders.filter(energy__gt=0).aggregate(Sum("energy"))["energy__sum"]
            or 0
        )
        user_total_demand = -(
            user_orders.filter(energy__lt=0).aggregate(Sum("energy"))["energy__sum"]
            or 0
        )

        return Response(
            {
                "global_prosumers_count": prosumers.count(),
                "user_prosumers_count": user_prosumers.count(),
                "global_orders_count": orders.count(),
                "user_orders_count": user_orders.count(),
                "users_open_orders_count": user_orders.filter(
                    status__lte=OrderStatus.OPEN
                ).count(),
                "global_trades_count": trades.count(),
                "user_trades_count": user_trades.count(),
                "user_unsettled_trades_count": user_trades.filter(
                    settlement_status__lte=TradeSettlementStatus.PAYMENT_PENDING,
                ).count(),
                "energy_flow": total_generation + total_demand,
                "user_energy_flow": user_total_generation + user_total_demand,
            }
        )


class ProsumerViewSet(viewsets.ModelViewSet):
    lookup_field = "id"
    queryset = Prosumer.objects.filter(deleted=False).order_by("-updated_on")
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
    queryset = Order.objects.filter(deleted=False).order_by("-updated_on")
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

        if serializer.validated_data["energy"] > 0:
            if not serializer.validated_data.get("price"):
                raise ValidationError("Price is required for positive energy orders")

        prosumer = Prosumer.objects.get(id=prosumer_id)
        serializer.save(prosumer=prosumer)


class TradeViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    lookup_field = "id"
    queryset = Trade.objects.all().order_by("-updated_on")
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
            return queryset.filter(order__prosumer__id=prosumer_id)

        return queryset.filter(order__prosumer__billing_account=self.request.user)

    @action(
        detail=False,
        methods=["post"],
        url_path="webhooks/exchange",
        serializer_class=TradeSerializer,
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

        # Craft QuerySet of all open orders
        open_orders = Order.objects.filter(status__lte=OrderStatus.OPEN)

        # Segregate sell and buy orders based on energy sign
        sell_orders = open_orders.filter(energy__gt=0)
        buy_orders = open_orders.filter(energy__lt=0)

        # Reject if there are no sell orders
        if not sell_orders.exists():
            return Response({"error": "No sell orders exist"}, status=400)

        # Reject if there are no buy orders
        if not buy_orders.exists():
            return Response({"error": "No buy orders exist"}, status=400)

        # Aggregate total generation and demand
        total_generation = sell_orders.aggregate(Sum("energy"))["energy__sum"] or 0
        total_demand = -(buy_orders.aggregate(Sum("energy"))["energy__sum"] or 0)
        # Aggregate total generation and demand
        # generation_demand = (
        #     Order.objects.filter(status__lte=OrderStatus.OPEN)
        #     .annotate(abs_energy=Abs("energy"))
        #     .annotate(
        #         total_generation=Sum(
        #             Case(
        #                 When(energy__gt=0, then=F("energy")), output_field=FloatField()
        #             )
        #         )
        #     )
        #     .annotate(
        #         total_demand=Sum(
        #             Case(
        #                 When(energy__lt=0, then=F("energy")), output_field=FloatField()
        #             )
        #         )
        #     )
        #     .values("total_generation", "total_demand")
        #     .first()
        # )
        # total_generation = generation_demand["total_generation"]
        # total_demand = generation_demand["total_demand"]
        efficiency = total_demand / total_generation

        # Reject unrealistic efficiency
        if efficiency > 1:
            return Response(
                {"error": f"Unrealistic efficiency: {efficiency}"}, status=400
            )

        # Update all open orders to PROCESSING status
        open_orders.update(status=OrderStatus.PROCESSING)
        processing_orders = Order.objects.filter(status=OrderStatus.PROCESSING)

        weighted_sum = (
            processing_orders.filter(energy__gt=0)
            .annotate(weighted_price=F("energy") * F("price"))
            .aggregate(
                total_weight=Sum("energy", output_field=FloatField()),
                total_weighted_price=Sum("weighted_price", output_field=FloatField()),
            )
        )

        market_price = (
            weighted_sum["total_weighted_price"] / weighted_sum["total_weight"]
        )

        def get_sell_trade(order):
            return Trade(order=order, price=order.price, transmission_losses=0)

        def get_buy_trade(order):
            # Estimated Losses = E[receiving] * (1 / efficiency - 1)
            losses = -order.energy * (1 / efficiency - 1)
            expected_cash_inflow = (-order.energy + losses) * market_price
            price = expected_cash_inflow / -order.energy
            return Trade(
                order=order, price=round(price), transmission_losses=round(losses)
            )

        trades = Trade.objects.bulk_create(
            [
                get_sell_trade(order) if order.energy > 0 else get_buy_trade(order)
                for order in processing_orders
            ]
        )

        processing_orders.update(status=OrderStatus.COMPLETED)

        return Response(
            TradeSerializer(trades, many=True).data, status=status.HTTP_201_CREATED
        )
