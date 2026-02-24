#!/bin/bash

echo "Aguardando o PostgreSQL em $POSTGRES_HOST (usuário: $POSTGRES_USER)..."

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
    echo "PostgreSQL não está pronto ainda ou dados de acesso incorretos. Aguardando..."
    sleep 2
done

echo "PostgreSQL iniciado com sucesso!"

echo "Aplicando migrations..."
python manage.py migrate --noinput

echo "Criando superuser padrao (se nao existir)..."
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@frutmax.com', 'admin123')
    print('Superuser criado: admin / admin123')
else:
    print('Superuser ja existe')
"

echo "Iniciando servidor..."
exec "$@"
