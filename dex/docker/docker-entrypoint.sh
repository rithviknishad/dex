#!/usr/bin/env bash
set -euxo pipefail

echo "running migrations"
python manage.py migrate
echo "All migrations have been made successfully"

echo "running collectstatic"
python manage.py collectstatic --noinput

python manage.py runserver 0.0.0.0:9000
