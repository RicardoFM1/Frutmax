from django.contrib import admin
from .models import Fruta, Categoria


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'descricao', 'criado_em']
    search_fields = ['nome']
    ordering = ['nome']


@admin.register(Fruta)
class FrutaAdmin(admin.ModelAdmin):
    list_display = [
        'nome', 'categoria', 'preco', 'quantidade',
        'unidade', 'data_validade', 'ativo'
    ]
    list_filter = ['categoria', 'ativo', 'unidade']
    search_fields = ['nome', 'fornecedor']
    ordering = ['nome']
    list_editable = ['quantidade', 'preco', 'ativo']
    date_hierarchy = 'data_validade'
