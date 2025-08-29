from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import signup, logout, CustomTokenObtainPairView

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]