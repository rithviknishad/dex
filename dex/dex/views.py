from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from django.db.models import Q

from . import permissions
from .models import BuyOrder, Prosumer, SellOrder, Trade
from .serializers import (
    BuyOrderSerializer,
    ProsumerSerializer,
    SellOrderSerializer,
    TradeSerializer,
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


class OrderBaseViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    lookup_field = "id"

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

    class Meta:
        abstract = True


class BuyOrderViewSet(OrderBaseViewSet):
    queryset = BuyOrder.objects.all()
    serializer_class = BuyOrderSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Order,
    )


class SellOrderViewSet(OrderBaseViewSet):
    queryset = SellOrder.objects.all()
    serializer_class = SellOrderSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Order,
    )


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
