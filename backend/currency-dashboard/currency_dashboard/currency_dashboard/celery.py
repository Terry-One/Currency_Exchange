from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'currency_dashboard.settings')

app = Celery('currency_dashboard')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'fetch_currency_data_every_month': {
        'task': 'data_fetcher.tasks.fetch_currency_data_for_all_pairs',
        'schedule': crontab(day_of_month='1', hour=0, minute=0),
        'args': (),
    },
}
