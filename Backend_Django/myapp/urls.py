from django.urls import path
from .views import PopulationProportionsView

urlpatterns = [
    path('population-proportions/', PopulationProportionsView.as_view(), name='Proportions'),
]