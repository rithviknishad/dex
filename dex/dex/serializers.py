from rest_framework import serializers
from django.contrib.gis.geos import Point

from .models import BuyOrder, Prosumer, SellOrder, Trade
from utils import BASE_READ_ONLY_FIELDS


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


class OrderSerialzierBase:
    FIELDS = ("prosumer", "energy", "status") + BASE_READ_ONLY_FIELDS
    READ_ONLY_FIELDS = ("prosumer", "status") + BASE_READ_ONLY_FIELDS


class BuyOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyOrder
        fields = OrderSerialzierBase.FIELDS + ("category",)
        read_only_fields = OrderSerialzierBase.READ_ONLY_FIELDS


class SellOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellOrder
        fields = OrderSerialzierBase.FIELDS + ("category", "price")
        read_only_fields = OrderSerialzierBase.READ_ONLY_FIELDS


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = BASE_READ_ONLY_FIELDS + (
            "buy",
            "sell",
            "price",
            "transmission_losses",
            "total_energy",
            "cashflow_status",
            "trade_distance",
        )
        read_only_fields = fields
