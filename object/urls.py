from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KhoaViewSet, NganhViewSet, LopViewSet,
    SinhvienViewSet, GiaovienViewSet, MonhocViewSet, DiemdanhViewSet
)

router = DefaultRouter()
router.register(r'khoa', KhoaViewSet)
router.register(r'nganh', NganhViewSet)
router.register(r'lop', LopViewSet)
router.register(r'sinhvien', SinhvienViewSet)
router.register(r'giaovien', GiaovienViewSet)
router.register(r'monhoc', MonhocViewSet)
router.register(r'diemdanh', DiemdanhViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
