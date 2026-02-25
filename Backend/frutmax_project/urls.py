"""
URL configuration for frutmax_project.
"""
from django.contrib import admin
from django.urls import path, include


def trigger_error(request):
    """Endpoint para testar a integração com o Sentry."""
    


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('estoque.urls')),
    path('sentry-debug/', trigger_error),
]
