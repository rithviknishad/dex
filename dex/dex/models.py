from django.db import models
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

    def __str__(self):
        return str(self.name)


class OrderStatusChoices(models.IntegerChoices):
    ORDER_REQ_RECEIVED = 0, "ORDER_REQ_RECEIVED"
    VALIDATION_PENDING = 10, "VALIDATION_PENDING"
    VALIDATION_REJECTED = -10, "VALIDATION_REJECTED"
    OPEN_PENDING = 20, "OPEN_PENDING"
    OPEN = 30, "OPEN"
    PARTIAL = 40, "PARTIAL"
    PARTIAL_COMPLETE = 50, "PARTIAL_COMPLETE"
    COMPLETED = 60, "COMPLETED"
    REJECTED = -20, "REJECTED"


class OrderBaseModel(BaseModel, UUIDModel):
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
        help_text="Energy to be bought/sold in Wh",
    )
    status = models.SmallIntegerField(
        blank=False,
        choices=OrderStatusChoices.choices,
        default=OrderStatusChoices.ORDER_REQ_RECEIVED,
        editable=False,
        verbose_name="Status",
        help_text="Status of the placed order",
    )

    class Meta:
        abstract = True


class BuyOrder(OrderBaseModel):
    """
    A buy order raised on behalf of the prosumer
    """

    class CategoryChoices(models.TextChoices):
        DOMESTIC = "DOMESTIC", "DOMESTIC"
        MUNICIPAL = "MUNICIPAL", "MUNICIPAL"
        COMMERCIAL = "COMMERCIAL", "COMMERCIAL"
        INDUSTRIAL = "INDUSTRIAL", "INDUSTRIAL"
        AGRICULTURAL = "AGRICULTURAL", "AGRICULTURAL"
        STORAGE = "STORAGE", "STORAGE"

    category = models.CharField(
        max_length=255,
        blank=False,
        choices=CategoryChoices.choices,
        verbose_name="Category",
        help_text="Load Category",
    )

    def __str__(self):
        return str(self.status)


class SellOrder(OrderBaseModel):
    """
    A sell order raised on behalf of the prosumer
    """

    class CategoryChoices(models.TextChoices):
        SOALR = "SOLAR", "SOALR"
        WIND = "WIND", "WIND"
        HYDRO = "HYDRO", "HYDRO"
        GEOTHERMAL = "GEOTHERMAL", "GEOTHERMAL"
        NUCLEAR = "NUCLEAR", "NUCLEAR"
        BIOMASS = "BIOMASS", "BIOMASS"
        STORAGE = "STORAGE", "STORAGE"

    category = models.CharField(
        max_length=255,
        blank=False,
        choices=CategoryChoices.choices,
        verbose_name="Category",
        help_text="Generation Category",
    )

    price = SparksField(
        blank=False,
        null=False,
        verbose_name="Price (SPARKS)",
        help_text="Price of the energy in SPARKS",
    )


class TradeCashflowStatusChoices(models.IntegerChoices):
    PAYMENT_PENDING = 0, "PAYMENT_PENDING"
    PAYMENT_RECEIVED = 30, "PAYMENT_RECEIVED"
    DISBURSEMENT_COMPLETE = 60, "DISBURSEMENT_COMPLETE"


class Trade(BaseModel, UUIDModel):
    """
    A trade between a buy order and a sell order
    """

    buy = models.ForeignKey(
        BuyOrder,
        related_name="trades",
        null=False,
        on_delete=models.PROTECT,
        verbose_name="Buy Order",
        help_text="The buy order of this trade.",
    )
    sell = models.ForeignKey(
        SellOrder,
        related_name="trades",
        null=False,
        on_delete=models.PROTECT,
        verbose_name="Sell Order",
        help_text="The sell order related to this trade",
    )
    price = SparksField(
        blank=False,
        null=False,
        verbose_name="Avg. Price (SPARKS)",
        help_text="The average price of this trade in SPARKS",
    )
    transmission_losses = EnergyField(
        blank=False,
        null=False,
        verbose_name="Transmission Losses",
        help_text="Estimated energy lost in transmission between the buyer and seller",
    )
    total_energy = EnergyField(
        blank=False,
        null=False,
        verbose_name="Total Energy",
        help_text="Total amount of energy traded in this trade (inclusive of transmission losses).",
    )
    cashflow_status = models.SmallIntegerField(
        blank=False,
        choices=TradeCashflowStatusChoices.choices,
        default=TradeCashflowStatusChoices.PAYMENT_PENDING,
        editable=False,
        verbose_name="Payment Status",
        help_text="Status of the payment for this trade",
    )
