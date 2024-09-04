from django.urls import path
from .views import ExamenListCreate, SalaListCreate, ReservaListCreate

urlpatterns = [
    path('examenes/', ExamenListCreate.as_view(), name='examenes-list-create'),
    path('salas/', SalaListCreate.as_view(), name='salas-list-create'),
    path('reservas/', ReservaListCreate.as_view(), name='reservas-list-create'),
]
