from rest_framework import serializers
from .models import Fruta, Categoria, Fornecedor


class CategoriaSerializer(serializers.ModelSerializer):
    quantidade_frutas = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'descricao', 'quantidade_frutas', 'criado_em', 'atualizado_em']
        read_only_fields = ['criado_em', 'atualizado_em']

    def get_quantidade_frutas(self, obj):
        return obj.frutas.filter(ativo=True).count()


class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'email', 'telefone', 'endereco', 'ativo', 'criado_em', 'atualizado_em']
        read_only_fields = ['criado_em', 'atualizado_em']


class FrutaSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)
    esta_vencida = serializers.BooleanField(read_only=True)
    dias_para_vencer = serializers.IntegerField(read_only=True)
    estoque_baixo = serializers.BooleanField(read_only=True)
    status_validade = serializers.CharField(read_only=True)

    class Meta:
        model = Fruta
        fields = [
            'id', 'nome', 'categoria', 'categoria_nome', 'descricao',
            'preco', 'quantidade', 'unidade', 'data_validade',
            'fornecedor', 'fornecedor_nome', 'estoque_minimo', 'ativo',
            'esta_vencida', 'dias_para_vencer', 'estoque_baixo',
            'status_validade', 'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['criado_em', 'atualizado_em']

    def validate_data_validade(self, value):
        """Permite cadastrar frutas com qualquer data de validade."""
        return value


class FrutaResumoSerializer(serializers.ModelSerializer):
    """Serializer resumido para listagens."""
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    status_validade = serializers.CharField(read_only=True)
    estoque_baixo = serializers.BooleanField(read_only=True)

    class Meta:
        model = Fruta
        fields = [
            'id', 'nome', 'categoria_nome', 'preco', 'quantidade',
            'unidade', 'data_validade', 'status_validade', 'estoque_baixo'
        ]


class DashboardSerializer(serializers.Serializer):
    """Serializer para dados do dashboard."""
    total_frutas = serializers.IntegerField()
    total_categorias = serializers.IntegerField()
    estoque_total = serializers.IntegerField()
    frutas_vencidas = serializers.IntegerField()
    frutas_vencendo = serializers.IntegerField()
    estoque_baixo = serializers.IntegerField()
    valor_total_estoque = serializers.DecimalField(max_digits=12, decimal_places=2)
    estoque_por_unidade = serializers.DictField(child=serializers.IntegerField(), read_only=True)
