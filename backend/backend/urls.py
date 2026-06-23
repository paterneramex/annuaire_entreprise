#backend>backend>urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import(
    TokenObtainPairView,
    TokenRefreshView,
    )
from employes.views import EmployeViewSet

# Création du routeur pour gérer les urls automatiquement
router = DefaultRouter()
router.register(r'employes', EmployeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
