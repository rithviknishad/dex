from django.db import models
from uuid import uuid4


class BaseModel(models.Model):
    created_on = models.DateTimeField(
        blank=False,
        null=False,
        auto_now_add=True,
        editable=False,
    )
    updated_on = models.DateTimeField(
        blank=False,
        null=False,
        auto_now=True,
        editable=False,
    )

    deleted = models.BooleanField(
        blank=False,
        null=False,
        default=False,
        editable=False,
        help_text="Whether the record is deleted or not (soft-delete)",
    )

    def delete(self, *args, **kwargs):
        self.deleted = True
        self.save()

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract model with ID as UUID field.

    References:
    - https://stackoverflow.com/a/58737923/7887936
    """

    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid4, editable=False, unique=True)

    class Meta:
        abstract = True
