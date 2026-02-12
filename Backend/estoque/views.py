from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Sum, F, Q
from django.utils import timezone
from datetime import timedelta

from .models import Fruta, Categoria
from .serializers import (
    FrutaSerializer,
    FrutaResumoSerializer,
    CategoriaSerializer,
    DashboardSerializer,
)


class CategoriaViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de categorias."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    search_fields = ['nome']
    ordering_fields = ['nome', 'criado_em']


class FrutaViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de frutas no estoque."""
    queryset = Fruta.objects.select_related('categoria').all()
    serializer_class = FrutaSerializer
    filterset_fields = ['categoria', 'ativo', 'unidade']
    search_fields = ['nome', 'fornecedor', 'descricao']
    ordering_fields = ['nome', 'preco', 'quantidade', 'data_validade', 'criado_em']

    def get_serializer_class(self):
        if self.action == 'list':
            return FrutaResumoSerializer
        return FrutaSerializer

    @action(detail=False, methods=['get'])
    def vencidas(self, request):
        """Lista frutas vencidas."""
        hoje = timezone.now().date()
        frutas = self.queryset.filter(data_validade__lt=hoje, ativo=True)
        serializer = FrutaResumoSerializer(frutas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def vencendo(self, request):
        """Lista frutas proximas do vencimento (7 dias)."""
        hoje = timezone.now().date()
        limite = hoje + timedelta(days=7)
        frutas = self.queryset.filter(
            data_validade__gte=hoje,
            data_validade__lte=limite,
            ativo=True
        )
        serializer = FrutaResumoSerializer(frutas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estoque_baixo(self, request):
        """Lista frutas com estoque abaixo do minimo."""
        frutas = self.queryset.filter(
            quantidade__lte=F('estoque_minimo'),
            ativo=True
        )
        serializer = FrutaResumoSerializer(frutas, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def dashboard(request):
    """Retorna dados resumidos para o dashboard."""
    hoje = timezone.now().date()
    limite_vencimento = hoje + timedelta(days=7)

    frutas_ativas = Fruta.objects.filter(ativo=True)

    total_frutas = frutas_ativas.count()
    total_categorias = Categoria.objects.count()
    estoque_total = frutas_ativas.aggregate(total=Sum('quantidade'))['total'] or 0
    frutas_vencidas = frutas_ativas.filter(data_validade__lt=hoje).count()
    frutas_vencendo = frutas_ativas.filter(
        data_validade__gte=hoje,
        data_validade__lte=limite_vencimento
    ).count()
    estoque_baixo_count = frutas_ativas.filter(
        quantidade__lte=F('estoque_minimo')
    ).count()

    valor_total = frutas_ativas.aggregate(
        total=Sum(F('preco') * F('quantidade'))
    )['total'] or 0

    data = {
        'total_frutas': total_frutas,
        'total_categorias': total_categorias,
        'estoque_total': estoque_total,
        'frutas_vencidas': frutas_vencidas,
        'frutas_vencendo': frutas_vencendo,
        'estoque_baixo': estoque_baixo_count,
        'valor_total_estoque': valor_total,
    }

    serializer = DashboardSerializer(data)
    return Response(serializer.data)
