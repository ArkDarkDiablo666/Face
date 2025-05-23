"""
URL configuration for face_detect project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse 
from object.views import dang_nhap, lay_lai_mat_khau
def home(request):
    return HttpResponse("Trang chủ Django!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('object/', include('object.urls')),
    path('dangnhap/', dang_nhap),
    path('lay-lai-mat-khau/', lay_lai_mat_khau),
    path("", home),
]
