from celery import shared_task
from django.test import RequestFactory
from .views import FetchHistoricalDataView


@shared_task
def fetch_currency_data_for_all_pairs():
    currency_codes = ['USD', 'EUR', 'JPY', 'CAD', 'AUD', 'CNY']
    currency_pairs = [(base, target) for base in currency_codes for target in currency_codes if base != target]

    factory = RequestFactory()

    for base, target in currency_pairs:
        # Create a request object with currency parameters
        request = factory.get('/fake-path', {'base': base, 'target': target})
        view = FetchHistoricalDataView()
        # Manually call the view with the request
        view.get(request)
