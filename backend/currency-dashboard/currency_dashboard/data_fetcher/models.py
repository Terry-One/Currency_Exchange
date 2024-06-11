from django.db import models

# Create your models here.
class CurrencyRate(models.Model):
    date = models.DateField()
    base_currency = models.CharField(max_length=3)
    target_currency = models.CharField(max_length=3)
    rate = models.FloatField()

    def __str__(self):
        return f"{self.base_currency} to {self.target_currency} on {self.date}: {self.rate}"