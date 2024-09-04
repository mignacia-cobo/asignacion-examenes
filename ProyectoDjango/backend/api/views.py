from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sala, Examen, Reserva
from .serializers import SalaSerializer, ExamenSerializer, ReservaSerializer

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

    def post(self, request):
        serializer = ExamenSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class SalaListCreate(APIView):
    def get(self, request):
        queryset = Sala.objects.all()
        codigo = request.GET.get('codigo')
        nombre = request.GET.get('nombre')
        edificio = request.GET.get('edificio')
        
        if codigo:
            queryset = queryset.filter(codigo_sala__icontains=codigo)
        if nombre:
            queryset = queryset.filter(nombre_sala__icontains=nombre)
        if edificio:
            queryset = queryset.filter(edificio__icontains=edificio)

        serializer = SalaSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SalaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ReservaListCreate(APIView):
    def get(self, request):
        fecha = request.GET.get('fecha')
        queryset = Reserva.objects.all()
        
        if fecha:
            queryset = queryset.filter(fecha=fecha)

        serializer = ReservaSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
