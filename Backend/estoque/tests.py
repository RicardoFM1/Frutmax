from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta
from .models import Fruta, Categoria


class CategoriaModelTest(TestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(
            nome='Citricas',
            descricao='Frutas citricas como laranja e limao'
        )

    def test_criacao_categoria(self):
        self.assertEqual(self.categoria.nome, 'Citricas')
        self.assertEqual(str(self.categoria), 'Citricas')


class FrutaModelTest(TestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(nome='Tropicais')
        self.fruta = Fruta.objects.create(
            nome='Banana',
            categoria=self.categoria,
            preco=5.99,
            quantidade=100,
            unidade='kg',
            data_validade=date.today() + timedelta(days=10),
            estoque_minimo=20
        )

    def test_criacao_fruta(self):
        self.assertEqual(self.fruta.nome, 'Banana')
        self.assertFalse(self.fruta.esta_vencida)
        self.assertEqual(self.fruta.dias_para_vencer, 10)
        self.assertFalse(self.fruta.estoque_baixo)
        self.assertEqual(self.fruta.status_validade, 'ok')

    def test_fruta_vencida(self):
        self.fruta.data_validade = date.today() - timedelta(days=1)
        self.fruta.save()
        self.assertTrue(self.fruta.esta_vencida)
        self.assertEqual(self.fruta.status_validade, 'vencido')

    def test_fruta_estoque_baixo(self):
        self.fruta.quantidade = 5
        self.fruta.save()
        self.assertTrue(self.fruta.estoque_baixo)


class FrutaAPITest(APITestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(nome='Vermelhas')
        self.fruta_data = {
            'nome': 'Morango',
            'categoria': self.categoria.id,
            'preco': '12.50',
            'quantidade': 50,
            'unidade': 'cx',
            'data_validade': (date.today() + timedelta(days=5)).isoformat(),
            'estoque_minimo': 10,
        }

    def test_criar_fruta(self):
        response = self.client.post('/api/frutas/', self.fruta_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fruta.objects.count(), 1)

    def test_listar_frutas(self):
        Fruta.objects.create(
            nome='Morango',
            categoria=self.categoria,
            preco=12.50,
            quantidade=50,
            unidade='cx',
            data_validade=date.today() + timedelta(days=5),
        )
        response = self.client.get('/api/frutas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dashboard(self):
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_frutas', response.data)
