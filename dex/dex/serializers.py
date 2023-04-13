from rest_framework import serializers
from django.contrib.gis.geos import Point

from .models import (
    BuyOrder,
    Prosumer,
    SellOrder,
    Trade,
    OrderStatusChoices,
    TradeCashflowStatusChoices,
)
from utils import BASE_READ_ONLY_FIELDS
from utils.serializers import ChoiceField


class PointFieldSerializer(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return None
        return {"latitude": value.y, "longitude": value.x}

    def to_internal_value(self, data):
        try:
            latitude = float(data.get("latitude"))
            longitude = float(data.get("longitude"))
            return Point(longitude, latitude)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Invalid point data")


class ProsumerSerializer(serializers.ModelSerializer):
    location = PointFieldSerializer()

    class Meta:
        model = Prosumer
        fields = (
            "billing_account",
            "name",
            "description",
            "location",
        ) + BASE_READ_ONLY_FIELDS
        read_only_fields = BASE_READ_ONLY_FIELDS + ("billing_account",)


class OrderSerialzier(serializers.ModelSerializer):
    status = ChoiceField(
        choices=OrderStatusChoices.choices,
        read_only=True,
    )

    FIELDS = ("prosumer", "energy", "status") + BASE_READ_ONLY_FIELDS
    READ_ONLY_FIELDS = ("prosumer", "status") + BASE_READ_ONLY_FIELDS


class BuyOrderSerializer(OrderSerialzier):
    class Meta:
        model = BuyOrder
        fields = OrderSerialzier.FIELDS + ("category",)
        read_only_fields = OrderSerialzier.READ_ONLY_FIELDS


class SellOrderSerializer(OrderSerialzier):
    class Meta:
        model = SellOrder
        fields = OrderSerialzier.FIELDS + ("category", "price")
        read_only_fields = OrderSerialzier.READ_ONLY_FIELDS


class TradeSerializer(serializers.ModelSerializer):
    cashflow_status = ChoiceField(
        choices=TradeCashflowStatusChoices.choices,
        read_only=True,
    )

    class Meta:
        model = Trade
        fields = BASE_READ_ONLY_FIELDS + (
            "buy",
            "sell",
            "price",
            "trade_distance",
            "transmission_losses",
            "total_energy",
            "cashflow_status",
        )
        read_only_fields = fields
