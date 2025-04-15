from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KhoaViewSet, NganhViewSet, LopViewSet,
    SinhvienViewSet, GiaovienViewSet, MonhocViewSet, DiemdanhViewSet,
    tao_khoa_view, tao_nganh_view, danh_sach_khoa,tao_lop_view,danh_sach_nganh
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
    path('tao-khoa/', tao_khoa_view, name='tao_khoa'), 
    path('tao-nganh/', tao_nganh_view, name='tao_nganh'),  
    path('danh-sach-khoa/', danh_sach_khoa, name='danh_sach_khoa'),
    path('tao-lop/', tao_lop_view, name='tao_lop'),
    path('danh-sach-nganh/', danh_sach_nganh, name='danh_sach_nganh'),
]
