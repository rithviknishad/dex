from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from dex.views import ProsumerViewSet, OrderViewSet, TradeViewSet
from users.views import UserViewSet

schema_view = get_schema_view(
    openapi.Info(
        title="Decentralized Energy Exchange API Server",
        default_version="v1",
        description="""
        DEX API is a REST API for peer-to-peer decentralized energy exchange that allows prosumers to buy and sell energy from each other.

        **NOT FOR PRODUCTION USE**

        Currently the API supports prosumers to create normal buy and sell orders. Futures & Options trading is not yet supported.

        Project maintained by [Rithvik Nishad](https://rithviknishad.dev) at https://github.com/rithviknishad/dex.
        Licensed under [GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
        """,
        contact=openapi.Contact(email="dex@rithviknishad.dev"),
        license=openapi.License(name="GNU GPLv3"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = routers.DefaultRouter()
router.register(r"prosumers/(?P<prosumer_id>[0-9a-f-]+)/orders", OrderViewSet)
router.register(r"prosumers/(?P<prosumer_id>[0-9a-f-]+)/trades", TradeViewSet)
router.register(r"prosumers", ProsumerViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"trades", TradeViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin.site.urls),
    # path("api/docs/auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(
        "api/v1/auth/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/v1/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/auth/register/", include("dj_rest_auth.registration.urls")),
    path("api/v1/", include("openapi.urls")),
    path("api/v1/", include(router.urls)),
    # Swagger, Redoc and OpenAPI
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
