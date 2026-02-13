from django.db import models
from django.core.validators import MinValueValidator
from datetime import date


class Categoria(models.Model):
    """Categoria de frutas (ex: Citricas, Tropicais, Vermelhas)."""
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, default='')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nome']
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'

    def __str__(self):
        return self.nome


class Fruta(models.Model):
    """Modelo principal de frutas no estoque."""
    nome = models.CharField(max_length=200)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='frutas'
    )
    descricao = models.TextField(blank=True, default='')
    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='Preco por kg/unidade em R$'
    )
    quantidade = models.PositiveIntegerField(
        default=0,
        help_text='Quantidade em estoque (kg ou unidades)'
    )
    unidade = models.CharField(
        max_length=10,
        choices=[
            ('kg', 'Quilograma'),
            ('un', 'Unidade'),
            ('cx', 'Caixa'),
        ],
        default='kg'
    )
    data_validade = models.DateField(
        help_text='Data de validade do lote'
    )
    fornecedor = models.CharField(max_length=200, blank=True, default='')
    estoque_minimo = models.PositiveIntegerField(
        default=10,
        help_text='Quantidade minima antes de alertar reposicao'
    )
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nome', 'data_validade']
        verbose_name = 'Fruta'
        verbose_name_plural = 'Frutas'

    def __str__(self):
        return f'{self.nome} - {self.quantidade}{self.unidade}'

    @property
    def esta_vencida(self):
        """Verifica se a fruta esta vencida."""
        return self.data_validade < date.today()

    @property
    def dias_para_vencer(self):
        """Retorna quantos dias faltam para vencer."""
        delta = self.data_validade - date.today()
        return delta.days

    @property
    def estoque_baixo(self):
        """Verifica se o estoque esta abaixo do minimo."""
        return self.quantidade <= self.estoque_minimo

    @property
    def status_validade(self):
        """Retorna o status da validade."""
        dias = self.dias_para_vencer
        if dias < 0:
            return 'vencido'
        elif dias <= 3:
            return 'critico'
        elif dias <= 7:
            return 'atencao'
        return 'ok'


class MovimentacaoEstoque(models.Model):
    """Registro de entradas e saidas de estoque."""
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]

    fruta = models.ForeignKey(
        Fruta,
        on_delete=models.CASCADE,
        related_name='movimentacoes'
    )
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    observacao = models.TextField(blank=True, default='')
    data_movimentacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data_movimentacao']
        verbose_name = 'Movimentação de Estoque'
        verbose_name_plural = 'Movimentações de Estoque'

    def __str__(self):
        return f'{self.tipo.capitalize()} - {self.fruta.nome} ({self.quantidade})'

    def save(self, *args, **kwargs):
        # Se for uma nova movimentacao, atualiza o estoque da fruta
        if not self.pk:
            if self.tipo == 'entrada':
                self.fruta.quantidade += self.quantidade
            elif self.tipo == 'saida':
                if self.fruta.quantidade >= self.quantidade:
                    self.fruta.quantidade -= self.quantidade
                else:
                    self.fruta.quantidade = 0
            self.fruta.save()
        super().save(*args, **kwargs)
