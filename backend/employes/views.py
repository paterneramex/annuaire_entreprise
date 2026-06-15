from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Employe
from .serializers import EmployeSerializer

class EmployeViewSet(viewsets.ModelViewSet):
	#Récupère tous les employés
	queryset = Employe.objects.all()
	#Utiliser le serializer pour convertir les données
	serializer_class = EmployeSerializer
	# C'est ici qu'on gère la sécurité :
    # Tout le monde peut lire (GET), mais seul l'admin peut modifier (POST, PUT, DELETE)
	permission_classes = [IsAuthenticatedOrReadOnly]