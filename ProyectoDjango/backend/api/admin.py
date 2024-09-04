from django.contrib import admin
from .models import Sala, Examen, Reserva  # Importa tus modelos

# Registra tus modelos en el admin
admin.site.register(Sala)
admin.site.register(Examen)
admin.site.register(Reserva)
