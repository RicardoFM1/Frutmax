"""
URL configuration for frutmax_project.
"""
from django.contrib import admin
from django.urls import path, include


def trigger_error(request):
    """Endpoint para testar a integração com o Sentry."""
    division_by_zero = 1 / 0  # noqa: F841
    return division_by_zero


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('estoque.urls')),
    path('sentry-debug/', trigger_error),
]
