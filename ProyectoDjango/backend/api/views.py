from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sala, Examen
from .serializers import SalaSerializer, ExamenSerializer

class SalaList(APIView):
    def get(self, request):
        salas = Sala.objects.all()
        serializer = SalaSerializer(salas, many=True)
        return Response(serializer.data)
# Para buscar exámenes
class ExamenListCreate(APIView):
    def get(self, request):
        queryset = Examen.objects.all()
        evento = request.GET.get('evento')
        seccion = request.GET.get('seccion')
        asignatura = request.GET.get('asignatura')
        
        if evento:
            queryset = queryset.filter(evento__icontains=evento)
        if seccion:
            queryset = queryset.filter(seccion__icontains=seccion)
        if asignatura:
            queryset = queryset.filter(asignatura__icontains=asignatura)

        serializer = ExamenSerializer(queryset, many=True)
        return Response(serializer.data)

# Para buscar salas
class SalaListCreate(APIView):
    def get(self, request):
        queryset = Sala.objects.all()
        codigo = request.GET.get('codigo')
        nombre = request.GET.get('nombre')
        edificio = request.GET.get('edificio')
        
        if codigo:
            queryset = queryset.filter(id__icontains=codigo)
        if nombre:
            queryset = queryset.filter(nombre_sala__icontains=nombre)
        if edificio:
            queryset = queryset.filter(edificio__icontains=edificio)

        serializer = SalaSerializer(queryset, many=True)
        return Response(serializer.data)

