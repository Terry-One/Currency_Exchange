from django.views import View
from django.http import JsonResponse
import requests
from .models import CurrencyRate
from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CurrencyRateSerializer
from django.http import JsonResponse


def get_rates(request):
    base_currency = request.GET.get('base', 'CAD')  # Default to USD if not provided
    target_currency = request.GET.get('target', 'USD')  # Default to EUR if not provided

    # Assume CurrencyRate has a method to fetch rates, or you can query the model directly
    try:
        rates = CurrencyRate.objects.filter(
            base_currency=base_currency,
            target_currency=target_currency
        ).order_by('-date')  # Assuming you have a date field and you want the most recent first
        data = [{
                'base_currency': base_currency,
                'target_currency': target_currency,
                "date": rate.date, 
                 "rate": rate.rate} for rate in rates]  # Adjust as per your model fields
        return JsonResponse({"data": data}, safe=False)
    except CurrencyRate.DoesNotExist:
        return JsonResponse({"error": "No rates found for the selected currencies"}, status=404)

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

        # Fetch today's rate separately to ensure it's returned in the response
        today_rate = CurrencyRate.objects.filter(
            date=datetime.now().date(),
            base_currency=base_currency,
            target_currency=target_currency
        ).first()

        today_rate_data = {
            "base_currency": base_currency,
            "target_currency": target_currency,
            "date": datetime.now().date().strftime("%Y-%m-%d"),
            "rate": today_rate.rate if today_rate else "No rate found for today"
        }

        return JsonResponse({"status": "success",
                             "message": "Data fetched successfully for {} to {}".format(base_currency,target_currency),
                             "today_rate": today_rate_data
        })

