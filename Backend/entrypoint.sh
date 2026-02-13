#!/bin/bash

echo "Aguardando o PostgreSQL..."

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
    echo "PostgreSQL nao esta pronto ainda. Aguardando..."
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
