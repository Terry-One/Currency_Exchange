from django.views import View
from django.http import JsonResponse
import requests
from .models import CurrencyRate
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CurrencyRateSerializer

class CurrencyRateListView(APIView):
    def get(self, request):
        rates = CurrencyRate.objects.all()
        serializer = CurrencyRateSerializer(rates, many=True)
        return Response(serializer.data)


class FetchHistoricalDataView(View):
    def get(self, request):
        # Retrieve currency pairs from the query string
        base_currency = request.GET.get('base', 'CAD')  # Default to 'CAD' if not provided
        target_currency = request.GET.get('target', 'USD')  # Default to 'USD' if not provided

        start_date = datetime.now() - timedelta(days=730)  # Last two years
        end_date = datetime.now()

        current_date = start_date
        while current_date <= end_date:
            if not CurrencyRate.objects.filter(date=current_date, base_currency=base_currency,
                                               target_currency=target_currency).exists():
                url = f'https://api.frankfurter.app/{current_date.strftime("%Y-%m-%d")}?from={base_currency}&to={target_currency}'
                response = requests.get(url)
                data = response.json()
                if target_currency in data['rates']:
                    CurrencyRate.objects.update_or_create(
                        date=current_date,
                        base_currency=base_currency,
                        target_currency=target_currency,
                        defaults={'rate': data['rates'][target_currency]}
                    )
            current_date += timedelta(days=1)

        return JsonResponse({"status": "success",
                             "message": "Data fetched successfully for {} to {}".format(base_currency,target_currency)})

