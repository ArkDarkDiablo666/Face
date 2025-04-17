from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KhoaViewSet, NganhViewSet, LopViewSet,
    SinhvienViewSet, GiaovienViewSet, MonhocViewSet, DiemdanhViewSet,
    tao_khoa_view, tao_nganh_view, danh_sach_khoa,tao_lop_view,danh_sach_nganh,
    tao_giao_vien_view,tao_sinh_vien_view,danh_sach_nganh_theo_khoa,danh_sach_lop_theo_nganh
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
    path('tao-khoa/', tao_khoa_view, name='tao-khoa'), 
    path('tao-nganh/', tao_nganh_view, name='tao-nganh'),  
    path('danh-sach-khoa/', danh_sach_khoa, name='danh-sach-khoa'),
    path('tao-lop/', tao_lop_view, name='tao-lop'),
    path('danh-sach-nganh/', danh_sach_nganh, name='danh_sach_nganh'),
    path('tao-giao-vien/', tao_giao_vien_view, name='tao-giao-vien'),
    path('tao-sinh-vien/', tao_sinh_vien_view, name='tao-sinh-vien'),
    path('danh-sach-nganh-theo-khoa/', danh_sach_nganh_theo_khoa, name='danh-sach-nganh-theo-khoa'),
    path('danh-sach-lop-theo-nganh/', danh_sach_lop_theo_nganh, name='danh-sach-lop-theo-nganh'),
]
