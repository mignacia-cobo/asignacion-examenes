from django.db import models

class Examen(models.Model):
    evento = models.CharField(max_length=20)
    seccion = models.CharField(max_length=50)
    asignatura = models.CharField(max_length=100)
    modulos = models.IntegerField()
    docente = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.asignatura} - {self.seccion}"
    
class Sala(models.Model):
    codigo_sala = models.CharField(max_length=20)
    nombre_sala = models.CharField(max_length=100)
    capacidad = models.IntegerField()
    edificio = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre_sala} - {self.codigo_sala}"

from django.utils import timezone

class Reserva(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    examen = models.ForeignKey(Examen, on_delete=models.CASCADE)
    modulos = models.IntegerField()  # Representa la cantidad de módulos seleccionados para la reserva
    fecha = models.DateField(default=timezone.now)  # Campo de fecha con valor predeterminado

    def __str__(self):
        return f"Reserva en {self.sala.nombre_sala} para {self.examen.asignatura} - {self.examen.evento} ({self.examen.seccion})"

