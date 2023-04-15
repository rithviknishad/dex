from django.db import models
from django.contrib.gis.db.models import PointField
from utils.models import BaseModel, UUIDModel
from sparks.models import SparksField


class EnergyField(models.BigIntegerField):
    """
    Energy field in Wh.

    Choosing Wh as the unit of energy because it is the smallest unit of energy
    that can be traded in the market. Fractional energy is not allowed.
    """


class Prosumer(BaseModel, UUIDModel):
    """
    Trading account of an entity that is associated to a billing account
    """

    billing_account = models.ForeignKey(
        "users.User",
        related_name="prosumers",
        null=False,
        on_delete=models.PROTECT,
        editable=False,
        verbose_name="Billing Account",
        help_text="Billing account associated to the prosumer",
    )
    name = models.CharField(
        max_length=255,
        blank=False,
        verbose_name="Name",
        help_text="An identifiable name of the prosumer",
    )
    description = models.TextField(
        max_length=255,
        blank=True,
        verbose_name="Description",
        help_text="A short brief about the prosumer",
    )
    location = PointField(
        geography=True,
        blank=False,
        null=False,
        verbose_name="Location",
        help_text="Location of the prosumer",
    )

    def __str__(self):
        return str(self.name)


class OrderStatus(models.IntegerChoices):
    ORDER_REQ_RECEIVED = 0, "ORDER_REQ_RECEIVED"
    VALIDATION_PENDING = 10, "VALIDATION_PENDING"
    VALIDATION_ACCEPTED = 20, "VALIDATION_ACCEPTED"
    VALIDATION_REJECTED = 25, "VALIDATION_REJECTED"
    OPEN = 30, "OPEN"
    PROCESSING = 40, "PROCESSING"
    REJECTED = 45, "REJECTED"  # Reserved for future use
    COMPLETED = 50, "COMPLETED"


class OrderCategory(models.TextChoices):
    DOMESTIC = "DOMESTIC", "DOMESTIC"
    MUNICIPAL = "MUNICIPAL", "MUNICIPAL"
    COMMERCIAL = "COMMERCIAL", "COMMERCIAL"
    INDUSTRIAL = "INDUSTRIAL", "INDUSTRIAL"
    AGRICULTURAL = "AGRICULTURAL", "AGRICULTURAL"

    STORAGE = "STORAGE", "STORAGE"

    SOALR = "SOLAR", "SOALR"
    WIND = "WIND", "WIND"
    HYDRO = "HYDRO", "HYDRO"
    GEOTHERMAL = "GEOTHERMAL", "GEOTHERMAL"
    NUCLEAR = "NUCLEAR", "NUCLEAR"
    BIOMASS = "BIOMASS", "BIOMASS"


class Order(BaseModel, UUIDModel):
    """
    A buy/sell order raised behalf of the prosumer
    """

    prosumer = models.ForeignKey(
        Prosumer,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
        verbose_name="Buyer",
        help_text="Prosumer that created the buy order",
    )
    energy = EnergyField(
        blank=False,
        null=False,
        verbose_name="Energy (Wh)",
        help_text="Net export energy in Wh.",
    )
    price = SparksField(
        blank=True,
        null=True,
        verbose_name="Price (SPARKS)",
        help_text="Price of the energy in SPARKS",
    )
    status = models.SmallIntegerField(
        blank=False,
        choices=OrderStatus.choices,
        default=OrderStatus.ORDER_REQ_RECEIVED,
        editable=False,
        verbose_name="Status",
        help_text="Status of the placed order",
    )
    category = models.CharField(
        max_length=255,
        blank=False,
        choices=OrderCategory.choices,
        verbose_name="Category",
        help_text="Generation/Storage/Consumption category of the energy associated to the order",
    )


class TradeSettlementStatus(models.IntegerChoices):
    PAYMENT_PENDING = 0, "PAYMENT_PENDING"
    PAYMENT_PROCESSING = 50, "PAYMENT_PROCESSING"
    PAYMENT_PROCESSED = 100, "PAYMENT_PROCESSED"


class Trade(BaseModel, UUIDModel):
    """
    A trade associated to an order
    """

    order = models.OneToOneField(
        Order,
        null=False,
        editable=False,
        on_delete=models.PROTECT,
        verbose_name="Order",
        help_text="Order that was traded",
    )
    price = SparksField(
        blank=False,
        null=False,
        editable=False,
        verbose_name="Avg. Price (SPARKS)",
        help_text="The average price of this trade in SPARKS",
    )
    transmission_losses = EnergyField(
        blank=False,
        null=False,
        editable=False,
        verbose_name="Transmission Losses",
        help_text="Estimated energy lost in transmission",
    )
    settlement_status = models.SmallIntegerField(
        blank=False,
        choices=TradeSettlementStatus.choices,
        default=TradeSettlementStatus.PAYMENT_PENDING,
        editable=False,
        verbose_name="Settlement Status",
        help_text="Status of the settlement of the order",
    )
