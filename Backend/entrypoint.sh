#!/bin/bash

echo "Aguardando o PostgreSQL..."

while ! python -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.connect(('db', 5432))
    s.close()
    exit(0)
except:
    exit(1)
" 2>/dev/null; do
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
