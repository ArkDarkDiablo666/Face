from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KhoaViewSet, NganhViewSet, LopViewSet,
    SinhvienViewSet, GiaovienViewSet, MonhocViewSet, DiemdanhViewSet,
    tao_khoa, tao_nganh, danh_sach_khoa,tao_lop,danh_sach_nganh,
    tao_giao_vien,tao_sinh_vien, danh_sach_nganh_theo_khoa,danh_sach_lop_theo_nganh,
    thong_tin_giao_vien, thong_tin_sinh_vien
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
    path('tao-khoa/', tao_khoa, name='tao-khoa'), 
    path('tao-nganh/', tao_nganh, name='tao-nganh'),  
    path('danh-sach-khoa/', danh_sach_khoa, name='danh-sach-khoa'),
    path('tao-lop/', tao_lop, name='tao-lop'),
    path('danh-sach-nganh/', danh_sach_nganh, name='danh_sach_nganh'),
    path('tao-giao-vien/', tao_giao_vien, name='tao-giao-vien'),
    path('tao-sinh-vien/', tao_sinh_vien, name='tao-sinh-vien'),
    path('danh-sach-nganh-theo-khoa/', danh_sach_nganh_theo_khoa, name='danh-sach-nganh-theo-khoa'),
    path('danh-sach-lop-theo-nganh/', danh_sach_lop_theo_nganh, name='danh-sach-lop-theo-nganh'),
    path('thong-tin-giao-vien/<str:magiaovien>/', thong_tin_giao_vien, name='thong-tin-giao-vien'),
    path('thong-tin-sinh-vien/<str:masinhvien>/', thong_tin_sinh_vien, name='thong-tin-sinh-vien'),
]
