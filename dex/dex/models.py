from django.db import models


class BuyOrder(models.Model):
    """
    A buy order raised on behalf of the prosumer
    """

    STATUS_OPEN = "OPEN"
    STATUS_PARTIAL = "PARTIAL"
    STATUS_COMPLETE = "COMPLETE"
    STATUS_OPEN_PENDING = "OPEN_PENDING"
    STATUS_PARTIAL_COMPLETE = "PARTIAL_COMPLETE"
    STATUS_ORDER_REQ_RECEIVED = "ORDER_REQ_RECEIVED"
    STATUS_VALIDATION_PENDING = "VALIDATION_PENDING"
    STATUS_CHOICES = [
        (STATUS_OPEN, "Open"),
        (STATUS_PARTIAL, "Partial"),
        (STATUS_COMPLETE, "Complete"),
        (STATUS_OPEN_PENDING, "Open Pending"),
        (STATUS_PARTIAL_COMPLETE, "Partial Complete"),
        (STATUS_ORDER_REQ_RECEIVED, "Order Req Received"),
        (STATUS_VALIDATION_PENDING, "Validation Pending"),
    ]

    CATEGORY_DOMESTIC_LOAD = "DOMESTIC_LOAD"
    CATEGORY_MUNICIPAL_LOAD = "MUNICIPAL_LOAD"
    CATEGORY_STORAGE_CHARGE = "STORAGE_CHARGE"
    CATEGORY_COMMERCIAL_LOAD = "COMMERCIAL_LOAD"
    CATEGORY_INDUSTRIAL_LOAD = "INDUSTRIAL_LOAD"
    CATEGORY_AGRICULTURAL_LOAD = "AGRICULTURAL_LOAD"
    CATEGORY_CHOICES = [
        (CATEGORY_DOMESTIC_LOAD, "Domestic Load"),
        (CATEGORY_MUNICIPAL_LOAD, "Municipal Load"),
        (CATEGORY_STORAGE_CHARGE, "Storage Charge"),
        (CATEGORY_COMMERCIAL_LOAD, "Commercial Load"),
        (CATEGORY_INDUSTRIAL_LOAD, "Industrial Load"),
        (CATEGORY_AGRICULTURAL_LOAD, "Agricultural Load"),
    ]

    category = models.CharField(
        max_length=255,
        blank=False,
        choices=CATEGORY_CHOICES,
        verbose_name="Category",
        help_text="Load Category",
    )
    duration = models.IntegerField(
        blank=False,
        null=False,
        verbose_name="Duration",
        help_text="Time interval of this trade",
    )
    energy = models.IntegerField(
        blank=False,
        null=False,
        verbose_name="Energy/Volume",
        help_text="Amount of energy consumed in the specified interval (between created_on - duration and created_on)",
    )
    prosumer = models.ForeignKey(
        "dex.Prosumer",
        related_name="buy_orders",
        null=False,
        on_delete=models.PROTECT,
        editable=False,
        verbose_name="Buyer",
        help_text="Prosumer that created the buy order",
    )
    status = models.CharField(
        max_length=255,
        blank=False,
        choices=STATUS_CHOICES,
        default=STATUS_ORDER_REQ_RECEIVED,
        editable=False,
        verbose_name="Status",
        help_text="Status of the placed order",
    )

    def __str__(self):
        return str(self.status)


class Prosumer(models.Model):
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
    description = models.TextField(
        max_length=255,
        blank=True,
        verbose_name="Descriptin",
        help_text="A short brief about the prosumer",
    )
    name = models.CharField(
        max_length=255,
        blank=False,
        verbose_name="Name",
        help_text="An identifiable name of the prosumer",
    )

    def __str__(self):
        return str(self.name)


class SellOrder(models.Model):
    """
    A sell order raised on behalf of the prosumer
    """

    prosumer = models.ForeignKey(
        "dex.Prosumer",
        related_name="sell_orders",
        null=False,
        on_delete=models.PROTECT,
        verbose_name="prosumer",
    )


class Trade(models.Model):
    """
    A trade between a buyer and seller
    """

    buy_order = models.ForeignKey(
        "dex.BuyOrder",
        related_name="trades",
        null=False,
        on_delete=models.PROTECT,
        verbose_name="Buy Order",
        help_text="The buy order of this trade.",
    )
    price = models.DecimalField(
        max_digits=16,
        decimal_places=8,
        blank=False,
        null=False,
        unique=True,
        verbose_name="Avg. Price",
        help_text="The average price of this trade.",
    )
    sell_order = models.ForeignKey(
        "dex.SellOrder",
        related_name="trades",
        null=False,
        on_delete=models.PROTECT,
        verbose_name="Sell Order",
        help_text="The sell order related to this trade",
    )
    total_energy = models.DecimalField(
        max_digits=32,
        decimal_places=16,
        blank=False,
        null=False,
        verbose_name="Total Energy",
        help_text="Total amount of energy traded in this trade (inclusive of transmission losses).",
    )
    transmission_losses = models.DecimalField(
        max_digits=32,
        decimal_places=16,
        blank=False,
        null=False,
        verbose_name="Transmission Losses",
        help_text="Estimated energy lost in transmission between the buyer and seller",
    )
