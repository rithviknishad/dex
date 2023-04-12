from django.db import models
from utils.models import BaseModel, UUIDModel
from users.models import User


class SparksField(models.BigIntegerField):
    """
    BigIntegerField to store sparks currency.
    """


class SparksUserWallet(BaseModel, UUIDModel):
    """
    Model to store sparks currency for users.
    """

    user = models.OneToOneField(
        User,
        related_name="sparks_wallet",
        on_delete=models.PROTECT,
    )
    sparks = SparksField(
        default=0,
        null=False,
        blank=False,
    )

    class Meta:
        verbose_name = "Sparks User Wallet"
        verbose_name_plural = "Sparks User Wallets"

    def __unicode__(self):
        return "%s" % self.user
