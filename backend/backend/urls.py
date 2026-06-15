#backend>backend>urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from employes.views import EmployeViewSet

# Création du routeur pour gérer les urls automatiquement
router = DefaultRouter()
router.register(r'employes', EmployeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
