from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    KhoaViewSet, NganhViewSet, LopViewSet,
    SinhvienViewSet, GiangvienViewSet, MonhocViewSet, DiemdanhViewSet,
    tao_khoa, tao_nganh, danh_sach_khoa,tao_lop,danh_sach_nganh,
    tao_giang_vien,tao_sinh_vien, danh_sach_nganh_theo_khoa, danh_sach_lop_theo_nganh,
    thong_tin_giang_vien, thong_tin_sinh_vien, danh_sach_giang_vien_theo_khoa,
    tao_mon_hoc, danh_sach_lop, chup_anh, ma_hoa_khuon_mat, nhan_dien_khuon_mat,
    danh_sach_giang_vien, danh_sach_sinh_vien, danh_sach_mon_theo_lop, lay_lai_mat_khau,
    danh_sach_mon_theo_lop, danh_sach_sinh_vien_theo_lop, luu_diem_danh, 
    danh_sach_mon_theo_giang_vien_theo_lop, danh_sach_diem_danh_sinh_vien
)

router = DefaultRouter()
router.register(r'khoa', KhoaViewSet)
router.register(r'nganh', NganhViewSet)
router.register(r'lop', LopViewSet)
router.register(r'sinhvien', SinhvienViewSet)
router.register(r'giangvien', GiangvienViewSet)
router.register(r'monhoc', MonhocViewSet)
router.register(r'diemdanh', DiemdanhViewSet)

urlpatterns = [
    path('', include(router.urls)),  
    path('tao-khoa/', tao_khoa, name='tao-khoa'), 
    path('tao-nganh/', tao_nganh, name='tao-nganh'),  
    path('danh-sach-khoa/', danh_sach_khoa, name='danh-sach-khoa'),
    path('tao-lop/', tao_lop, name='tao-lop'),
    path('danh-sach-nganh/', danh_sach_nganh, name='danh_sach_nganh'),
    path('danh-sach-lop/', danh_sach_lop, name='danh_sach_lop'),
    path('tao-giang-vien/', tao_giang_vien, name='tao-giang-vien'),
    path('tao-sinh-vien/', tao_sinh_vien, name='tao-sinh-vien'),
    path('tao-mon-hoc/', tao_mon_hoc, name='tao-mon-hoc'),
    path('danh-sach-nganh-theo-khoa/', danh_sach_nganh_theo_khoa, name='danh-sach-nganh-theo-khoa'),
    path('danh-sach-lop-theo-nganh/', danh_sach_lop_theo_nganh, name='danh-sach-lop-theo-nganh'),
    path('danh-sach-sinh-vien-theo-lop/', danh_sach_sinh_vien_theo_lop, name='danh-sach-sinh-vien-theo-lop'),
    path('danh-sach-mon-theo-lop/', danh_sach_mon_theo_lop, name='danh-sach-mon-theo-lop'),
    path('danh-sach-mon-theo-giang-vien-theo-lop/', danh_sach_mon_theo_giang_vien_theo_lop, name='danh-sach-mon-theo-giang-vien-theo-lop'),
    path('danh-sach-giang-vien-theo-khoa/', danh_sach_giang_vien_theo_khoa, name='danh-sach-giang-vien-theo-khoa'),
    path('thong-tin-giang-vien/<str:magiangvien>/', thong_tin_giang_vien, name='thong-tin-giang-vien'),
    path('thong-tin-sinh-vien/<str:masinhvien>/', thong_tin_sinh_vien, name='thong-tin-sinh-vien'),
    path('chup-anh/', chup_anh, name='chup-anh'),
    path('ma-hoa-khuon-mat/', ma_hoa_khuon_mat, name='ma-hoa-khuon-mat'),
    path('nhan-dien-khuon-mat/', nhan_dien_khuon_mat, name='nhan-dien-khuon-mat'),
    path('danh-sach-giang-vien/', danh_sach_giang_vien, name='danh-sach-giang-vien'),
    path('danh-sach-sinh-vien/', danh_sach_sinh_vien, name='danh-sach-sinh-vien'),
    path('danh-sach-mon-theo-lop/', danh_sach_mon_theo_lop, name='danh-sach-mon-theo-lop'),
    path('lay-lai-mat-khau/', lay_lai_mat_khau, name='lay-lai-mat-khau'),
    path('luu-diem-danh/', luu_diem_danh, name='luu-diem-danh'),
    path('danh-sach-diem-danh-sinh-vien/', danh_sach_diem_danh_sinh_vien, name='danh-sach-diem-danh-sinh-vien'),
]
