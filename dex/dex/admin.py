from django.contrib import admin

from .models import BuyOrder, Prosumer, SellOrder, Trade


class BuyOrderAdmin(admin.ModelAdmin):
    model = BuyOrder
    list_display = ["prosumer", "energy", "status", "category", "duration"]
    list_select_related = True


class ProsumerAdmin(admin.ModelAdmin):
    model = Prosumer
    list_display = ["billing_account", "name"]
    search_fields = ["billing_account", "name"]
    list_select_related = True


class SellOrderAdmin(admin.ModelAdmin):
    model = SellOrder


class TradeAdmin(admin.ModelAdmin):
    model = Trade
    list_display = ["buy_order", "price", "transmission_losses", "total_energy"]
    list_select_related = True


admin.site.register(BuyOrder, BuyOrderAdmin)
admin.site.register(Prosumer, ProsumerAdmin)
admin.site.register(SellOrder, SellOrderAdmin)
admin.site.register(Trade, TradeAdmin)
