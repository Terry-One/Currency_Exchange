from celery import shared_task
from django.test import RequestFactory
from .views import FetchHistoricalDataView


@shared_task
def fetch_currency_data_for_all_pairs():
    currency_pairs = [
        ('CAD', 'USD'), ('USD', 'EUR'), ('EUR', 'CAD'),
        ('CAD', 'EUR'), ('EUR', 'USD'), ('USD', 'CAD')
    ]
    factory = RequestFactory()

    for base, target in currency_pairs:
        # Create a request object with currency parameters
        request = factory.get('/fake-path', {'base': base, 'target': target})
        view = FetchHistoricalDataView()
        # Manually call the view with the request
        view.get(request)
