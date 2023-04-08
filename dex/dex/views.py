from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from . import permissions
from .models import BuyOrder, Prosumer, SellOrder, Trade
from .serializers import (
    BuyOrderSerializer,
    ProsumerSerializer,
    SellOrderSerializer,
    TradeSerializer,
)


class BuyOrderViewSet(viewsets.ModelViewSet):
    queryset = BuyOrder.objects.all()
    serializer_class = BuyOrderSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.BuyOrder,
    )


class ProsumerViewSet(viewsets.ModelViewSet):
    queryset = Prosumer.objects.all()
    serializer_class = ProsumerSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Prosumer,
    )

    def perform_create(self, serializer):
        serializer.save(billing_account=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(billing_account=self.request.user)


class SellOrderViewSet(viewsets.ModelViewSet):
    queryset = SellOrder.objects.all()
    serializer_class = SellOrderSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.SellOrder,
    )


class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = (
        IsAuthenticated,
        permissions.Trade,
    )
