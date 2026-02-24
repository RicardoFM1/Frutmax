from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Sum, F, Q
from django.utils import timezone
from datetime import timedelta

from .models import Fruta, Categoria, Fornecedor
from .serializers import (
    FrutaSerializer,
    FrutaResumoSerializer,
    CategoriaSerializer,
    FornecedorSerializer,
    DashboardSerializer,
)


class CategoriaViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de categorias."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    search_fields = ['nome']
    ordering_fields = ['nome', 'criado_em']


class FornecedorViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de fornecedores."""
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    search_fields = ['nome', 'email', 'telefone']
    filterset_fields = ['ativo']
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

    # Estoque por unidade
    estoque_por_unidade = {}
    unidades = frutas_ativas.values('unidade').annotate(total=Sum('quantidade'))
    for u in unidades:
        estoque_por_unidade[u['unidade']] = u['total']

    data = {
        'total_frutas': total_frutas,
        'total_categorias': total_categorias,
        'estoque_total': estoque_total,
        'frutas_vencidas': frutas_vencidas,
        'frutas_vencendo': frutas_vencendo,
        'estoque_baixo': estoque_baixo_count,
        'valor_total_estoque': valor_total,
        'estoque_por_unidade': estoque_por_unidade,
    }

    serializer = DashboardSerializer(data)
    return Response(serializer.data)

from django.views.generic import ListView, CreateView, UpdateView, DetailView, TemplateView
from django.urls import reverse_lazy
from .models import Fruta, Categoria, MovimentacaoEstoque


class DashboardView(TemplateView):
    template_name = 'estoque/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        hoje = timezone.now().date()
        limite_vencimento = hoje + timedelta(days=7)
        frutas_ativas = Fruta.objects.filter(ativo=True)

        context['total_frutas'] = frutas_ativas.count()
        context['total_categorias'] = Categoria.objects.count()
        context['estoque_total'] = frutas_ativas.aggregate(total=Sum('quantidade'))['total'] or 0
        context['frutas_vencidas'] = frutas_ativas.filter(data_validade__lt=hoje).count()
        context['frutas_vencendo'] = frutas_ativas.filter(
            data_validade__gte=hoje,
            data_validade__lte=limite_vencimento
        ).count()
        context['estoque_baixo'] = frutas_ativas.filter(
            quantidade__lte=F('estoque_minimo')
        ).count()
        context['valor_total_estoque'] = frutas_ativas.aggregate(
            total=Sum(F('preco') * F('quantidade'))
        )['total'] or 0
        
        context['recent_movimentacoes'] = MovimentacaoEstoque.objects.all()[:5]
        context['frutas_estoque_baixo'] = frutas_ativas.filter(
            quantidade__lte=F('estoque_minimo')
        ).order_by('quantidade')[:5]

        return context


class FrutaListView(ListView):
    model = Fruta
    template_name = 'estoque/fruta_list.html'
    context_object_name = 'frutas'
    paginate_by = 10

    def get_queryset(self):
        queryset = Fruta.objects.filter(ativo=True).select_related('categoria')
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(nome__icontains=search) | 
                Q(fornecedor__icontains=search)
            )
        return queryset


class FrutaCreateView(CreateView):
    model = Fruta
    template_name = 'estoque/fruta_form.html'
    fields = [
        'nome', 'categoria', 'descricao', 'preco', 
        'quantidade', 'unidade', 'data_validade', 
        'fornecedor', 'estoque_minimo', 'ativo'
    ]
    success_url = reverse_lazy('fruta-list')


class FrutaUpdateView(UpdateView):
    model = Fruta
    template_name = 'estoque/fruta_form.html'
    fields = [
        'nome', 'categoria', 'descricao', 'preco', 
        'quantidade', 'unidade', 'data_validade', 
        'fornecedor', 'estoque_minimo', 'ativo'
    ]
    success_url = reverse_lazy('fruta-list')


class MovimentacaoCreateView(CreateView):
    model = MovimentacaoEstoque
    template_name = 'estoque/movimentacao_form.html'
    fields = ['fruta', 'tipo', 'quantidade', 'observacao']
    success_url = reverse_lazy('dashboard')
