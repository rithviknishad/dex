from rest_framework import serializers
from django.contrib.gis.geos import Point
from django.db.models import Sum

from .models import (
    Prosumer,
    Order,
    OrderStatus,
    OrderCategory,
    Trade,
    TradeSettlementStatus,
)
from utils import BASE_READ_ONLY_FIELDS
from utils.serializers import ChoiceField
from users.serializers import UserSerializer


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


class SummarySerializer(serializers.Serializer):
    global_prosumers_count = serializers.IntegerField()
    user_prosumers_count = serializers.IntegerField()

    global_orders_count = serializers.IntegerField()
    user_orders_count = serializers.IntegerField()
    users_open_orders_count = serializers.IntegerField()

    global_trades_count = serializers.IntegerField()
    user_trades_count = serializers.IntegerField()
    user_unsettled_trades_count = serializers.IntegerField()

    energy_flow = serializers.IntegerField()
    user_energy_flow = serializers.IntegerField()


class ProsumerSerializer(serializers.ModelSerializer):
    location = PointFieldSerializer()
    billing_account = UserSerializer(read_only=True)
    trades_count = serializers.SerializerMethodField()
    net_energy_exported = serializers.SerializerMethodField()

    def get_trades_count(self, obj):
        return Trade.objects.filter(order__prosumer=obj).count()

    def get_net_energy_exported(self, obj):
        return (
            Order.objects.filter(prosumer=obj).aggregate(Sum("energy"))["energy__sum"]
            or 0
        )

    class Meta:
        model = Prosumer
        fields = (
            "billing_account",
            "name",
            "description",
            "location",
            "trades_count",
            "net_energy_exported",
        ) + BASE_READ_ONLY_FIELDS
        read_only_fields = BASE_READ_ONLY_FIELDS + ("billing_account",)


class OrderSerialzier(serializers.ModelSerializer):
    prosumer = ProsumerSerializer(read_only=True)
    status = ChoiceField(choices=OrderStatus.choices, read_only=True)
    category = ChoiceField(choices=OrderCategory.choices)

    class Meta:
        model = Order
        fields = BASE_READ_ONLY_FIELDS + (
            "prosumer",
            "energy",
            "price",
            "status",
            "category",
        )
        read_only_fields = BASE_READ_ONLY_FIELDS + ("prosumer", "status")


class TradeSerializer(serializers.ModelSerializer):
    order = OrderSerialzier(read_only=True)
    settlement_status = ChoiceField(
        choices=TradeSettlementStatus.choices,
        read_only=True,
    )
    energy = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()

    def get_energy(self, obj):
        energy = obj.order.energy
        if energy < 0:
            return energy - obj.transmission_losses
        return energy

    def get_amount(self, obj):
        return obj.order.energy * obj.price

    class Meta:
        model = Trade
        fields = BASE_READ_ONLY_FIELDS + (
            "order",
            "price",
            "transmission_losses",
            "settlement_status",
            "energy",
            "amount",
        )
        read_only_fields = fields


# class ExchangeWebhookSerializer(serializers.Serializer):
#     trades = TradeSerializer(many=True)
#     efficiency = serializers.FloatField()

#     class Meta:
#         fields = ("trades", "efficiency")
#         read_only_fields = fields
