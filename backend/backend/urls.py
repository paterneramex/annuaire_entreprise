# backend > backend > urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from employes.views import EmployeViewSet

# Création du routeur pour gérer les urls automatiquement
router = DefaultRouter()
router.register(r'employes', EmployeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls), # Attention, c'est bien admin.site.urls avec un "s"
    path('api/', include(router.urls)),
    
    # =========================================================================
    # SÉCURITÉ : POURQUOI JWT PLUTÔT QUE SESSION OU TOKEN CLASSIQUE ?
    # =========================================================================
    # - SessionAuth : Nécessite le partage de cookies (bloqué en cross-domain React/Django).
    # - TokenAuth : Stocke un token unique permanent en BDD (pas d'expiration automatique).
    # - JWT (Choix retenu) : 100% Stateless (idéal API), sécurisé par expiration rapide
    #   (Access Token) et renouvellement transparent (Refresh Token) sans requêter la BDD.
    # =========================================================================
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]