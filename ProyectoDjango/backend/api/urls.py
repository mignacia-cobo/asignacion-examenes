from django.urls import path
from .views import SalaList

urlpatterns = [
    path('salas/', SalaList.as_view(), name='sala-list'),
]
