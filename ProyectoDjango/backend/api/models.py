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