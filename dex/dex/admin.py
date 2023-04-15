from django.contrib import admin

from .models import Prosumer, Order, Trade


class ProsumerAdmin(admin.ModelAdmin):
    model = Prosumer
    # list_display = ["billing_account", "name"]
    # search_fields = ["billing_account", "name"]
    # list_select_related = True


class OrderAdmin(admin.ModelAdmin):
    model = Order


class TradeAdmin(admin.ModelAdmin):
    model = Trade
    # list_display = ["buy_order", "price", "transmission_losses", "total_energy"]
    # list_select_related = True


admin.site.register(Prosumer, ProsumerAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Trade, TradeAdmin)
