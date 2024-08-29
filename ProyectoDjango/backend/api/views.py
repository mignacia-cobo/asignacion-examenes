from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sala
from .serializers import SalaSerializer

class SalaList(APIView):
    def get(self, request):
        salas = Sala.objects.all()
        serializer = SalaSerializer(salas, many=True)
        return Response(serializer.data)
