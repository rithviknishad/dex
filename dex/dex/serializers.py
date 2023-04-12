from rest_framework import serializers

from .models import BuyOrder, Prosumer, SellOrder, Trade
from utils import BASE_READ_ONLY_FIELDS


class ProsumerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prosumer
        fields = (
            "billing_account",
            "name",
            "description",
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
        )
        read_only_fields = fields
