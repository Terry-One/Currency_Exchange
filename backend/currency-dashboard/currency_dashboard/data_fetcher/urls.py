from django.urls import path
from . import views

urlpatterns = [
    path('fetch-historical/', views.FetchHistoricalDataView.as_view(), name='fetch-historical'),
    path('rates/', views.CurrencyRateListView.as_view(), name='currency-rates-list'),
]
