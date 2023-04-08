from rest_framework import serializers

from .models import BuyOrder, Prosumer, SellOrder, Trade


class BuyOrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BuyOrder
        fields = (
            "url",
            "prosumer",
            "energy",
            "status",
            "category",
            "duration",
        )
        read_only_fields = (
            "prosumer",
            "status",
        )


class ProsumerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Prosumer
        fields = (
            "url",
            "billing_account",
            "name",
            "description",
        )
        read_only_fields = ("billing_account",)


class SellOrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SellOrder
        fields = (
            "url",
            "prosumer",
        )


class TradeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trade
        fields = (
            "url",
            "buy_order",
            "sell_order",
            "price",
            "transmission_losses",
            "total_energy",
        )
