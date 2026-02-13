from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'frutas', views.FrutaViewSet)
router.register(r'categorias', views.CategoriaViewSet)


urlpatterns = [
    # API URLs
    path('api/', include(router.urls)),
    path('api/dashboard/', views.dashboard, name='api-dashboard'),
    
    # Template URLs
    path('', views.DashboardView.as_view(), name='dashboard'),
    path('frutas/', views.FrutaListView.as_view(), name='fruta-list'),
    path('frutas/nova/', views.FrutaCreateView.as_view(), name='fruta-create'),
    path('frutas/<int:pk>/editar/', views.FrutaUpdateView.as_view(), name='fruta-update'),
    path('movimentacao/nova/', views.MovimentacaoCreateView.as_view(), name='movimentacao-create'),
]
