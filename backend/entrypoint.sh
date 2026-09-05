#!/bin/sh
python manage.py migrate --noinput
python manage.py seed_data
gunicorn core.wsgi:application --bind 0.0.0.0:8000
