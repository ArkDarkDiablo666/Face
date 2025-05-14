from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Khoa, Nganh, Lop, Sinhvien, Giangvien, Monhoc, Diemdanh
from .serializers import (
    KhoaSerializer, NganhSerializer, LopSerializer,
    SinhvienSerializer, GiangvienSerializer, MonhocSerializer, DiemdanhSerializer
)
import json
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import os
import cv2
import pickle
import face_recognition
import numpy as np
import base64
import unicodedata
import re
from datetime import datetime, date




class KhoaViewSet(viewsets.ModelViewSet):
    queryset = Khoa.objects.all()
    serializer_class = KhoaSerializer

class NganhViewSet(viewsets.ModelViewSet):
    queryset = Nganh.objects.all()
    serializer_class = NganhSerializer

class LopViewSet(viewsets.ModelViewSet):
    queryset = Lop.objects.all()
    serializer_class = LopSerializer

class SinhvienViewSet(viewsets.ModelViewSet):
    queryset = Sinhvien.objects.all()
    serializer_class = SinhvienSerializer

class GiangvienViewSet(viewsets.ModelViewSet):
    queryset = Giangvien.objects.all()
    serializer_class = GiangvienSerializer

class MonhocViewSet(viewsets.ModelViewSet):
    queryset = Monhoc.objects.all()
    serializer_class = MonhocSerializer

class DiemdanhViewSet(viewsets.ModelViewSet):
    queryset = Diemdanh.objects.all()
    serializer_class = DiemdanhSerializer

@api_view(['POST'])
def dang_nhap(request):
    username = request.data.get('tendangnhap')
    password = request.data.get('matkhau')
    
    if not username or not password:
        return Response({'error': 'Thiếu tên đăng nhập hoặc mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra bằng mã giáo viên
    try:
        gv = Giangvien.objects.get(magiangvien=username, matkhau=password)
        if gv.quyen.strip().lower() == 'admin':
            return Response({'role': 'admin','tendangnhap': gv.magiangvien}, status=status.HTTP_200_OK)
        elif gv.quyen.strip().lower() == 'user':
            return Response({'role': 'user','tendangnhap': gv.magiangvien}, status=status.HTTP_200_OK)
    except Giangvien.DoesNotExist:
        pass

    # Kiểm tra bằng mã sinh viên
    try:
        sv = Sinhvien.objects.get(masinhvien=username, matkhau=password)
        return Response({'role': 'guest','tendangnhap': sv.masinhvien}, status=status.HTTP_200_OK)
    except Sinhvien.DoesNotExist:
        pass
    
    return Response({'error': 'Tài khoản hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def tao_khoa(request):
    ma_khoa = request.data.get('makhoa', '').strip()
    ten_khoa = request.data.get('tenkhoa', '').strip()
    
    if not ma_khoa or not ten_khoa:
        return Response({'error': 'Mã khoa và tên khoa không được để trống'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Kiểm tra mã khoa hợp lệ
    ma_khoa_pattern = r'^[A-Za-z0-9]+$'
    ten_khoa_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    
    if not re.match(ma_khoa_pattern, ma_khoa):
        return Response({'error': 'Mã khoa không hợp lệ, chỉ chấp nhận chữ và số'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not re.match(ten_khoa_pattern, ten_khoa):
        return Response({'error': 'Tên khoa không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)
    
    if Khoa.objects.filter(makhoa=ma_khoa).exists():
        return Response({'error': 'Mã khoa đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        khoa = Khoa.objects.create(makhoa=ma_khoa, tenkhoa=ten_khoa)
        return Response({'message': 'Tạo khoa thành công!', 'data': {'makhoa': khoa.makhoa, 'tenkhoa': khoa.tenkhoa}}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo khoa: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)                               

@api_view(['POST'])
def tao_nganh(request):
    ma_nganh = request.data.get('manganh', '').strip()
    ten_nganh = request.data.get('tennganh', '').strip()
    ma_khoa = request.data.get('makhoa', '').strip()

    if not ma_nganh or not ten_nganh or not ma_khoa:
        return Response({'error': 'Vui lòng điền đầy đủ mã ngành, tên ngành và mã khoa'}, status=status.HTTP_400_BAD_REQUEST)

    ma_nganh_pattern = r'^[A-Za-z0-9]+$'
    ten_nganh_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    
    if not re.match(ma_nganh_pattern, ma_nganh):
        return Response({'error': 'Mã ngành không hợp lệ, chỉ chấp nhận chữ và số'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not re.match(ten_nganh_pattern, ten_nganh):
        return Response({'error': 'Tên ngành không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    if Nganh.objects.filter(manganh=ma_nganh).exists():
        return Response({'error': 'Mã ngành đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    if not Khoa.objects.filter(makhoa=ma_khoa).exists():
        return Response({'error': 'Mã khoa không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        nganh = Nganh.objects.create(manganh=ma_nganh, tennganh=ten_nganh, makhoa_id=ma_khoa)
        return Response({'message': 'Tạo ngành thành công!', 'data': {'manganh': nganh.manganh, 'tennganh': nganh.tennganh, 'makhoa': nganh.makhoa_id}}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def tao_lop(request):
    ma_lop = request.data.get('malop', '').strip()
    ten_lop = request.data.get('tenlop', '').strip()
    ma_nganh = request.data.get('manganh', '').strip()

    if not ma_lop or not ten_lop or not ma_nganh:
        return Response({'error': 'Vui lòng điền đầy đủ mã lớp, tên lớp và mã ngành'}, status=status.HTTP_400_BAD_REQUEST)

    ma_lop_pattern = r'^[A-Za-z0-9]+$'
    ten_lop_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    
    if not re.match(ma_lop_pattern, ma_lop):
        return Response({'error': 'Mã lớp không hợp lệ, chỉ chấp nhận chữ và số, không có khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not re.match(ten_lop_pattern, ten_lop):
        return Response({'error': 'Tên lớp không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    if Lop.objects.filter(malop=ma_lop).exists():
        return Response({'error': 'Mã lớp đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        nganh = Nganh.objects.get(manganh=ma_nganh)
    except Nganh.DoesNotExist:
        return Response({'error': 'Mã ngành không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lop = Lop.objects.create(malop=ma_lop, tenlop=ten_lop, manganh=nganh)
        return Response({'message': 'Tạo lớp thành công!', 'data': {'malop': lop.malop, 'tenlop': lop.tenlop, 'manganh': lop.manganh.manganh}}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo lớp: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_nganh(request):
    try:
        nganh_list = Nganh.objects.all()
        data = [{'manganh': ng.manganh, 'tennganh': ng.tennganh, 'makhoa': ng.makhoa.makhoa} for ng in nganh_list]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_lop(request):
    try:
        lop_list = Lop.objects.all()
        data = [{'malop':l.malop , 'tenlop': l.tenlop, 'manganh': lop.manganh.manganh} for lop in lop_list]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
def tao_giang_vien(request):
    print("Dữ liệu nhận được:", request.data)

    hoten = request.data.get('hoten', '').strip()
    gioitinh = request.data.get('gioitinh', '').strip()
    ngaysinh_str = request.data.get('ngaysinh', '').strip()
    # Hỗ trợ cả sdt và sodienthoai
    sdt = request.data.get('sdt', request.data.get('sodienthoai', '')).strip()
    email = request.data.get('email', '').strip()
    matkhau = request.data.get('matkhau', '').strip()
    quyen = request.data.get('quyen', '').strip()
    
    # Xử lý makhoa dù là chuỗi hay mảng
    makhoa_data = request.data.get('makhoa', '')
    if isinstance(makhoa_data, list) and makhoa_data:
        makhoa = makhoa_data[0]
    else:
        makhoa = makhoa_data

    # Kiểm tra bắt buộc
    if not all([hoten, gioitinh, ngaysinh_str, sdt, email, matkhau, quyen, makhoa]):
        return Response({'error': 'Vui lòng điền đầy đủ thông tin'}, status=status.HTTP_400_BAD_REQUEST)

    # Ràng buộc họ tên: không bắt đầu bằng khoảng trắng và không chứa ký tự đặc biệt
    if hoten.startswith(" ") or not re.match(r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$', hoten):
        return Response({'error': 'Họ tên không hợp lệ, không bắt đầu bằng khoảng trắng và không chứa ký tự đặc biệt'}, status=status.HTTP_400_BAD_REQUEST)

    # Giới tính
    if gioitinh not in ['Nam', 'Nữ']:
        return Response({'error': 'Giới tính chỉ được chọn Nam hoặc Nữ'}, status=status.HTTP_400_BAD_REQUEST)

    # Ngày sinh hợp lệ và đủ 22 tuổi vào 17/9/2024
    try:
        ngaysinh = datetime.strptime(ngaysinh_str, "%Y-%m-%d").date()
        target_date = date(2024, 9, 17)
        age = target_date.year - ngaysinh.year - ((target_date.month, target_date.day) < (ngaysinh.month, ngaysinh.day))
        if age < 22:
            return Response({'error': 'Giáo viên phải đủ 22 tuổi tính đến ngày 17/09/2024'}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({'error': 'Ngày sinh không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

    # Số điện thoại: 10 số và duy nhất
    if not re.fullmatch(r'\d{10}', sdt):
        return Response({'error': 'Số điện thoại phải gồm đúng 10 chữ số'}, status=status.HTTP_400_BAD_REQUEST)
    if Giangvien.objects.filter(sdt=sdt).exists():
        return Response({'error': 'Số điện thoại đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    # Email phải duy nhất
    if Giangvien.objects.filter(email=email).exists():
        return Response({'error': 'Email đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    # Mật khẩu không chứa khoảng trắng
    if ' ' in matkhau:
        return Response({'error': 'Mật khẩu không được chứa khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra mã khoa có tồn tại
    try:
        khoa = Khoa.objects.get(makhoa=makhoa)
    except Khoa.DoesNotExist:
        return Response({'error': 'Mã khoa không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    # Tạo mã giáo viên tự động
    magiangvien = tao_ma_giang_vien(makhoa)  # Truyền mã khoa thay vì tên khoa

    # Tạo giáo viên mới 
    try:
        gv = Giangvien.objects.create(
            magiangvien=magiangvien,
            hoten=hoten,
            gioitinh=gioitinh,
            ngaysinh=ngaysinh,
            sdt=sdt,
            email=email,
            matkhau=matkhau,
            quyen=quyen,
            makhoa=khoa
        )
        return Response({
            'message': 'Tạo tài khoản giáo viên thành công!',
            'data': {
                'magiangvien': gv.magiangvien,
                'hoten': gv.hoten,
                'email': gv.email,
                'makhoa': gv.makhoa.makhoa
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Lỗi khi tạo tài khoản: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def tao_sinh_vien(request):
    data = request.data
    print("Dữ liệu nhận được:")
    print(json.dumps(data, indent=2, ensure_ascii=False)) 
    try:
        hoten = request.data.get('hoten', '').strip()
        gioitinh = request.data.get('gioitinh', '').strip()
        ngaysinh_str = request.data.get('ngaysinh', '').strip()
        sdt = request.data.get('sdt', '').strip()
        email = request.data.get('email', '').strip()
        matkhau = request.data.get('matkhau', '').strip()
        makhoa = request.data.get('makhoa', '').strip()
        manganh = request.data.get('manganh', '').strip()
        malop = request.data.get('malop', '').strip()

        # Kiểm tra các trường bắt buộc
        if not all([hoten, gioitinh, ngaysinh_str, sdt, email, matkhau, makhoa, manganh, malop]):
            return Response({'error': 'Vui lòng nhập đầy đủ thông tin'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra họ tên
        if hoten.startswith(" ") or not re.match(r'^[\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$', hoten):
            return Response({'error': 'Họ tên không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

        if gioitinh not in ['Nam', 'Nữ']:
            return Response({'error': 'Giới tính chỉ được chọn Nam hoặc Nữ'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ngaysinh = datetime.strptime(ngaysinh_str, "%Y-%m-%d").date()
            target_date = date(2024, 9, 17)
            age = target_date.year - ngaysinh.year - ((target_date.month, target_date.day) < (ngaysinh.month, ngaysinh.day))
            if age < 18:
                return Response({'error': 'Sinh viên phải đủ 18 tuổi tính đến ngày 17/09/2024'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Ngày sinh không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

        if not re.fullmatch(r'\d{10}', sdt):
            return Response({'error': 'Số điện thoại phải đúng 10 số'}, status=status.HTTP_400_BAD_REQUEST)
        if Sinhvien.objects.filter(sdt=sdt).exists():
            return Response({'error': 'Số điện thoại đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        if Sinhvien.objects.filter(email=email).exists():
            return Response({'error': 'Email đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        if ' ' in matkhau:
            return Response({'error': 'Mật khẩu không được chứa khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            khoa = Khoa.objects.get(makhoa=makhoa)
        except Khoa.DoesNotExist:
            return Response({'error': 'Mã khoa không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            nganh = Nganh.objects.get(manganh=manganh, makhoa=makhoa)
        except Nganh.DoesNotExist:
            return Response({'error': 'Ngành không thuộc khoa này hoặc không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lop = Lop.objects.get(malop=malop, manganh=manganh)
        except Lop.DoesNotExist:
            return Response({'error': 'Lớp không thuộc ngành này hoặc không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo mã sinh viên
        masinhvien = tao_ma_sinh_vien(malop)
        ngaydangky = date.today()

        # Tạo sinh viên
        sv = Sinhvien.objects.create(
            masinhvien=masinhvien,
            hoten=hoten,
            gioitinh=gioitinh,
            ngaysinh=ngaysinh,
            sdt=sdt,
            ngaydangky=ngaydangky,
            email=email,
            quyen="Guest",
            matkhau=matkhau,
            makhoa=khoa,
            manganh=nganh,
            malop=lop
        )

        return Response({
        'message': 'Tạo sinh viên thành công',
        'masinhvien': sv.masinhvien,   # <- Đẩy masv ra ngoài luôn
        'data': {
            'hoten': sv.hoten,
            'email': sv.email,
            'malop': sv.malop.malop
        }
}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Lỗi khi tạo sinh viên: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def tao_ma_giang_vien(ma_khoa):
    from .models import Giangvien, Khoa
    
    try:
        # Tìm đối tượng khoa theo mã khoa thay vì tên khoa
        khoa = Khoa.objects.get(makhoa=ma_khoa)
    except Khoa.DoesNotExist:
        raise ValueError("Mã khoa không hợp lệ")

    # Đếm số lượng giáo viên hiện có trong khoa này
    count = Giangvien.objects.filter(makhoa=khoa).count()
    
    # Mã giáo viên = TênKhoa + (số lượng hiện tại + 1)
    return f"{khoa.makhoa}{count + 1}"

def tao_ma_sinh_vien(ma_lop):
    from .models import Sinhvien, Lop

    try:
        lop = Lop.objects.get(malop=ma_lop)
    except Lop.DoesNotExist:
        raise ValueError("Mã lớp không hợp lệ")

    # Đếm số lượng sinh viên hiện có trong lớp này
    count = Sinhvien.objects.filter(malop=lop).count()

    # Mã sinh viên = mã lớp + (số lượng hiện tại + 1)
    return f"{lop.malop}{count + 1}"

@api_view(['GET'])
def danh_sach_khoa(request):
    try:
        khoas = Khoa.objects.all()
        data = [{'makhoa': k.makhoa, 'tenkhoa': k.tenkhoa} for k in khoas]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách khoa: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_nganh_theo_khoa(request):
    makhoa = request.GET.get('makhoa')
    if not makhoa:
        return Response({'error': 'Thiếu mã khoa'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        nganhs = Nganh.objects.filter(makhoa=makhoa)
        data = [{'manganh': n.manganh} for n in nganhs]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_lop_theo_nganh(request):
    manganh = request.GET.get('manganh')
    if not manganh:
        return Response({'error': 'Thiếu mã ngành'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        lops = Lop.objects.filter(manganh=manganh)
        data = [{'malop': l.malop} for l in lops]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách lớp: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_giang_vien_theo_khoa(request):
    makhoa = request.GET.get('makhoa')
    if not makhoa:
        return Response({'error': 'Thiếu mã khoa'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        giangviens = Giangvien.objects.filter(makhoa=makhoa)
        data = [{'magiangvien': gv.magiangvien} for gv in giangviens]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách giảng viên: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def thong_tin_giang_vien(request, magiangvien):
    try:
        gv = Giangvien.objects.get(magiangvien=magiangvien)
        serializer = GiangvienSerializer(gv)
        full_data = serializer.data

        selected_fields = {
            'magiangvien': full_data.get('magiangvien'),
            'hoten': full_data.get('hoten'),
            'sdt': full_data.get('sdt'),
            'ngaysinh': full_data.get('ngaysinh'),
            'gioitinh': full_data.get('gioitinh'),
            'email': full_data.get('email'),
            'tenkhoa': gv.makhoa.tenkhoa  
        }

        return Response(selected_fields, status=status.HTTP_200_OK)
    except Giangvien.DoesNotExist:
        return Response({'error': 'Không tìm thấy giảng viên'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def thong_tin_sinh_vien(request, masinhvien):
    try:
        sv = Sinhvien.objects.get(masinhvien=masinhvien)
        serializer = SinhvienSerializer(sv)
        full_data = serializer.data

        selected_fields = {
            'masinhvien': full_data.get('masinhvien'),
            'hoten': full_data.get('hoten'),
            'sdt': full_data.get('sdt'),
            'ngaysinh': full_data.get('ngaysinh'),
            'gioitinh': full_data.get('gioitinh'),
            'email': full_data.get('email'),
            'tenkhoa': sv.malop.manganh.makhoa.tenkhoa
        }

        return Response(selected_fields, status=status.HTTP_200_OK)
    except Sinhvien.DoesNotExist:
        return Response({'error': 'Không tìm thấy sinh viên'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def lay_lai_mat_khau(request):
    email = request.data.get('email', '').strip()
    
    if not email:
        return Response({'error': 'Vui lòng nhập email'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Kiểm tra định dạng email hợp lệ
    if not re.match(r'^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$', email):
        return Response({'error': 'Định dạng email không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Kiểm tra email trong bảng giáo viên
        if email.endswith('@gmail.com'):  # Email giáo viên
            try:
                gv = Giangvien.objects.get(email=email)
                
                # Gửi email với mật khẩu
                send_mail(
                    'Thông tin đăng nhập hệ thống',
                    f'Xin chào {gv.hoten},\n\nBạn vừa yêu cầu lấy lại thông tin đăng nhập.\n\nTên đăng nhập: {gv.magiangvien}\nMật khẩu: {gv.matkhau}\n\nTrân trọng,\nQuản trị viên',
                    'tranm3717@gmail.com',  # Email gửi đi cố định
                    [email],
                    fail_silently=False,
                )
                
                return Response({'message': 'Mật khẩu đã được gửi tới email của bạn'}, status=status.HTTP_200_OK)
                
            except Giangvien.DoesNotExist:
                # Nếu không tìm thấy trong bảng giảng viên, kiểm tra trong bảng sinh viên
                try:
                    sv = Sinhvien.objects.get(email=email)
                    
                    # Gửi email với mật khẩu
                    send_mail(
                        'Thông tin đăng nhập hệ thống',
                        f'Xin chào {sv.hoten},\n\nBạn vừa yêu cầu lấy lại thông tin đăng nhập.\n\nTên đăng nhập: {sv.masinhvien}\nMật khẩu: {sv.matkhau}\n\nTrân trọng,\nQuản trị viên',
                        'tranm3717@gmail.com',  # Email gửi đi cố định
                        [email],
                        fail_silently=False,
                    )
                    
                    return Response({'message': 'Mật khẩu đã được gửi tới email của bạn'}, status=status.HTTP_200_OK)
                    
                except Sinhvien.DoesNotExist:
                    return Response({'error': 'Email này không tồn tại trong hệ thống'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Email không thuộc hệ thống trường'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi gửi email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def chuyen_viet_sang_anh(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])

@api_view(['POST'])
def tao_mon_hoc(request):
    ten_mon = request.data.get('tenmon', '').strip()
    ma_lop = request.data.get('malop', '').strip()
    ma_giang_vien = request.data.get('magiangvien', '').strip()
    
    # Kiểm tra các trường bắt buộc
    if not ten_mon or not ma_lop or not ma_giang_vien:
        return Response({'error': 'Vui lòng điền đầy đủ tên môn, mã lớp và mã giảng viên'}, status=status.HTTP_400_BAD_REQUEST)
    
    ten_mon_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈÍỌÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    
    if not re.match(ten_mon_pattern, ten_mon):
        return Response({'error': 'Tên môn không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra mã lớp và mã giảng viên có tồn tại
    try:
        lop = Lop.objects.get(malop=ma_lop)
    except Lop.DoesNotExist:
        return Response({'error': 'Mã lớp không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        giang_vien = Giangvien.objects.get(magiangvien=ma_giang_vien)
    except Giangvien.DoesNotExist:
        return Response({'error': 'Mã giảng viên không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Tạo mã môn tự động
    ten_mon_khong_dau = chuyen_viet_sang_anh(ten_mon).replace(" ", "").upper()
    ma_mon = f"{ten_mon_khong_dau}{ma_lop}{ma_giang_vien}".upper()
    
    # Kiểm tra mã môn đã tồn tại chưa
    if Monhoc.objects.filter(mamon=ma_mon).exists():
        return Response({'error': 'Môn học với mã môn này đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Tạo môn học
        mon_hoc = Monhoc.objects.create(
            mamon=ma_mon,
            tenmon=ten_mon,
            malop=lop,
            magiangvien=giang_vien
        )
        
        return Response({
            'message': 'Tạo môn học thành công!',
            'data': {
                'mamon': mon_hoc.mamon,
                'tenmon': mon_hoc.tenmon,
                'malop': mon_hoc.malop.malop,
                'tenlop': mon_hoc.malop.tenlop,
                'magiangvien': mon_hoc.magiangvien.magiangvien,
                'tengiangvien': mon_hoc.magiangvien.hoten
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo môn học: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Đường dẫn thư mục
IMAGE_DIR = r"F:\Face_project\Image"
ENCODING_DIR = r"F:\Face_project\encodings"
FINAL_ENCODING_FILE = os.path.join(ENCODING_DIR, "encodings.pkl")
TEMP_ENCODING_FILE = os.path.join(ENCODING_DIR, "temp.pkl")
CACHED_LABELS_FILE = os.path.join(ENCODING_DIR, "cached_labels.pkl")

# Tạo thư mục nếu chưa tồn tại
os.makedirs(ENCODING_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Hàm lưu pickle
def save_pickle(data, path):
    with open(path, "wb") as f:
        pickle.dump(data, f)

# Hàm load pickle
def load_pickle(path):
    with open(path, "rb") as f:
        return pickle.load(f)

# Hàm tải ảnh từ thư mục
def load_images_from_folder(folder):
    images = []
    labels = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(folder, filename)
            img = cv2.imread(path)
            if img is not None:
                images.append(img)
                labels.append(os.path.basename(folder))
    return images, labels

# Hàm mã hóa khuôn mặt
def encode_faces(images, labels):
    encode_list = []
    encode_labels = []
    for img, label in zip(images, labels):
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        faces = face_recognition.face_locations(rgb_img)
        encodes = face_recognition.face_encodings(rgb_img, faces)
        for encode in encodes:
            encode_list.append(encode)
            encode_labels.append(label)
    return encode_list, encode_labels

def merge_encodings(base_file, new_encodings, new_labels):
    if os.path.exists(base_file):
        old_encodings, old_labels = load_pickle(base_file)
    else:
        old_encodings, old_labels = [], []

    merged_encodings = old_encodings + new_encodings
    merged_labels = old_labels + new_labels

    save_pickle((merged_encodings, merged_labels), base_file)
    print(f"[+] Gộp {len(new_labels)} khuôn mặt vào {base_file}")

@api_view(['POST'])
def chup_anh(request):
    masinhvien = request.data.get('masinhvien')
    image_data = request.data.get('image')  # Nhận dữ liệu ảnh từ frontend
    index = request.data.get('index', 0)
    
    if not masinhvien:
        return Response({"error": "Thiếu mã sinh viên."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Tạo đường dẫn thư mục dựa trên mã sinh viên
    folder_path = os.path.join(IMAGE_DIR, masinhvien)
    
    # Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Xử lý ảnh từ base64 string
    if image_data:
        try:
            # Chuyển đổi base64 thành ảnh
            image_bytes = base64.b64decode(image_data)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is None:
                return Response({"error": "Không thể giải mã dữ liệu ảnh."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Lưu ảnh
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            file_name = f"image_{int(index):03d}_{timestamp}.jpg"
            file_path = os.path.join(folder_path, file_name)
            cv2.imwrite(file_path, img)
            
            return Response({
                "message": f"Đã lưu ảnh {file_name}"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Lỗi khi xử lý ảnh: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": "Không có dữ liệu ảnh."}, status=status.HTTP_400_BAD_REQUEST)

# API 2: Mã hóa khuôn mặt và lưu vào file
@api_view(['POST'])
def ma_hoa_khuon_mat(request):
    print(f"Bắt đầu quá trình mã hóa khuôn mặt")
    print(f"Thư mục encodings tồn tại: {os.path.exists(ENCODING_DIR)}")
    print(f"Đường dẫn file mã hóa cuối cùng: {FINAL_ENCODING_FILE}")
    
    processed_labels = []
    if os.path.exists(CACHED_LABELS_FILE):
        processed_labels = load_pickle(CACHED_LABELS_FILE)
        print(f"Đã tải nhãn đã xử lý: {processed_labels}")
    else:
        print(f"Không tìm thấy file nhãn đã xử lý: {CACHED_LABELS_FILE}")

    current_labels = os.listdir(IMAGE_DIR)
    print(f"Các nhãn hiện có trong thư mục hình ảnh: {current_labels}")
    
    new_labels = [label for label in current_labels if label not in processed_labels]
    print(f"Các nhãn mới cần xử lý: {new_labels}")

    if not new_labels:
        print("Không có nhãn mới để xử lý")
        return Response({"message": "Không có nhãn mới."}, status=status.HTTP_200_OK)

    all_new_encodings = []
    all_new_labels = []

    for person in new_labels:
        person_folder = os.path.join(IMAGE_DIR, person)
        print(f"Đang xử lý thư mục: {person_folder}")
        
        images, labels = load_images_from_folder(person_folder)
        print(f"Đã tải {len(images)} hình ảnh cho nhãn {person}")
        
        encodings, labels = encode_faces(images, labels)
        print(f"Đã mã hóa được {len(encodings)} khuôn mặt cho nhãn {person}")
        
        all_new_encodings.extend(encodings)
        all_new_labels.extend(labels)

    if all_new_encodings:
        try:
            print(f"Tổng số mã hóa mới: {len(all_new_encodings)}")
            print(f"Lưu file tạm thời tại: {TEMP_ENCODING_FILE}")
            save_pickle((all_new_encodings, all_new_labels), TEMP_ENCODING_FILE)
            
            print(f"Bắt đầu gộp mã hóa vào file chính: {FINAL_ENCODING_FILE}")
            
            # Kiểm tra file chính đã tồn tại chưa
            if not os.path.exists(FINAL_ENCODING_FILE):
                print(f"File mã hóa chính chưa tồn tại, tạo file mới")
                save_pickle((all_new_encodings, all_new_labels), FINAL_ENCODING_FILE)
            else:
                print(f"File mã hóa chính đã tồn tại, tiến hành gộp dữ liệu")
                merge_encodings(FINAL_ENCODING_FILE, all_new_encodings, all_new_labels)
            
            if os.path.exists(TEMP_ENCODING_FILE):
                os.remove(TEMP_ENCODING_FILE)
                print(f"Đã xóa file tạm thời")
            
            processed_labels += new_labels
            save_pickle(processed_labels, CACHED_LABELS_FILE)
            print(f"Đã cập nhật danh sách nhãn đã xử lý: {processed_labels}")
            
            print(f"Kiểm tra file mã hóa cuối cùng tồn tại: {os.path.exists(FINAL_ENCODING_FILE)}")
            if os.path.exists(FINAL_ENCODING_FILE):
                file_size = os.path.getsize(FINAL_ENCODING_FILE)
                print(f"Kích thước file mã hóa: {file_size} bytes")
            
            return Response({
                "message": f"Đã encode {len(all_new_labels)} khuôn mặt mới.",
                "file_path": FINAL_ENCODING_FILE,
                "file_exists": os.path.exists(FINAL_ENCODING_FILE),
                "encoded_faces": len(all_new_labels)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Lỗi trong quá trình lưu file mã hóa: {str(e)}")
            return Response({
                "message": f"Lỗi khi mã hóa: {str(e)}",
                "error_details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print("Không phát hiện khuôn mặt hợp lệ trong các hình ảnh")
        return Response({"message": "Không phát hiện khuôn mặt hợp lệ."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def nhan_dien_khuon_mat(request):
    try:
        with open(FINAL_ENCODING_FILE, "rb") as f:
            encodeListKnown, labelList = pickle.load(f)

        # Lấy dữ liệu ảnh từ frontend
        image_source = request.data.get('video_source')  # Giữ tên trường để tương thích với frontend hiện tại
        
        # Kiểm tra xem dữ liệu ảnh có tồn tại hay không
        if not image_source:
            # Thử các trường khác có thể chứa dữ liệu ảnh
            image_source = request.data.get('image_source') or request.data.get('image') or request.data.get('file')
            
        if not image_source:
            return Response({
                "message": "Dữ liệu ảnh không được cung cấp hoặc không hợp lệ.",
                "error": "image source is None",
                "received_fields": list(request.data.keys())  # Trả về danh sách các trường nhận được để debug
            }, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra xem dữ liệu có phải là chuỗi base64 hay không
        if isinstance(image_source, str):
            # Nếu chuỗi bắt đầu với "data:image" (định dạng data URL), cắt phần header
            if image_source.startswith('data:image'):
                # Tách lấy phần base64 sau dấu phẩy
                image_source = image_source.split(',', 1)[1] if ',' in image_source else image_source
                
            try:
                # Chuyển đổi base64 thành ảnh
                image_bytes = base64.b64decode(image_source)
                np_arr = np.frombuffer(image_bytes, np.uint8)
                frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            except Exception as e:
                return Response({
                    "message": "Không thể giải mã dữ liệu ảnh base64.",
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        elif hasattr(image_source, 'read'):  # Kiểm tra nếu là file object
            try:
                # Đọc dữ liệu từ file
                image_bytes = image_source.read()
                np_arr = np.frombuffer(image_bytes, np.uint8)
                frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            except Exception as e:
                return Response({
                    "message": "Không thể đọc dữ liệu từ file.",
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "message": "Định dạng dữ liệu ảnh không được hỗ trợ.",
                "error": f"Received type: {type(image_source)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        if frame is None:
            return Response({
                "message": "Không thể giải mã hình ảnh từ dữ liệu video.",
                "error": "image decoding failed"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Xử lý nhận diện khuôn mặt
        face_locations = face_recognition.face_locations(frame, model="cnn")
        
        if not face_locations:
            return Response({
                "message": "Không phát hiện khuôn mặt trong hình ảnh.",
            }, status=status.HTTP_200_OK)
            
        encode_current_frame = face_recognition.face_encodings(frame, face_locations)

        detected_faces = []

        for encodeFace, faceLoc in zip(encode_current_frame, face_locations):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            matchIndex = np.argmin(faceDis) if len(faceDis) > 0 else None

            if matchIndex is not None and matches[matchIndex] and faceDis[matchIndex] < 0.50:
                name = labelList[matchIndex].upper()
            else:
                name = "UNKNOWN"

            detected_faces.append(name)

        return Response({
            "message": f"Đã nhận diện khuôn mặt: {', '.join(detected_faces)}",
            "detected_faces": detected_faces
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "message": "Đã xảy ra lỗi khi xử lý nhận diện khuôn mặt.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_giang_vien(request):
    try:
        # Lọc theo tên giảng viên nếu có từ khóa tìm kiếm
        search = request.GET.get('search', '')
        giang_vien_queryset = Giangvien.objects.filter(hoten__icontains=search).select_related('makhoa').order_by('magiangvien')

        # Serialize data
        serializer = GiangvienSerializer(giang_vien_queryset, many=True)

        # Trả về toàn bộ dữ liệu mà không phân trang
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_sinh_vien(request):
    try:
        # Lọc theo tên sinh viên nếu có từ khóa tìm kiếm
        search = request.GET.get('search', '')
        sinh_vien_queryset = Sinhvien.objects.filter(hoten__icontains=search).select_related('malop').order_by('masinhvien')

        # Serialize data
        serializer = SinhvienSerializer(sinh_vien_queryset, many=True)

        # Trả về toàn bộ dữ liệu mà không phân trang
        return Response({
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_sinh_vien_theo_lop(request):
    malop = request.GET.get('malop')
    if not malop:
        return Response({'error': 'Thiếu mã lớp'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Kiểm tra xem lớp có tồn tại không
        try:
            lop = Lop.objects.get(pk=malop)
        except Lop.DoesNotExist:
            return Response({'error': 'Mã lớp không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
            
        # Lấy danh sách sinh viên theo lớp
        sinh_viens = Sinhvien.objects.filter(malop=malop).order_by('masinhvien')
        
        # Tạo dữ liệu trả về phù hợp với cấu trúc model
        data = [
            {
                'masinhvien': sv.masinhvien,
                'hoten': sv.hoten,
                'ngaysinh': sv.ngaysinh.strftime('%d/%m/%Y') if sv.ngaysinh else None,
                'gioitinh': sv.gioitinh,
                'sdt': sv.sdt,
                'email': sv.email,
                'quyen': sv.quyen,
                'manganh': sv.manganh.pk if sv.manganh else None,
                'makhoa': sv.makhoa.pk if sv.makhoa else None
            }
            for sv in sinh_viens
        ]
        
        return Response({
            'success': True,
            'message': f'Lấy danh sách sinh viên lớp {lop.tenlop if hasattr(lop, "tenlop") else malop} thành công',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Không thể lấy danh sách sinh viên: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API lấy danh sách môn học theo lớp
@api_view(['GET'])
def danh_sach_mon_theo_lop(request):
    malop = request.GET.get('malop')
    if not malop:
        return Response({'success': False, 'message': 'Thiếu mã lớp'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Kiểm tra xem lớp có tồn tại không
        try:
            lop = Lop.objects.get(pk=malop)
        except Lop.DoesNotExist:
            return Response({
                'success': False, 
                'message': 'Mã lớp không tồn tại'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Lấy danh sách môn học theo lớp
        mon_hocs = Monhoc.objects.filter(malop=malop).order_by('mamon')
        
        data = []
        for mh in mon_hocs:
            mon_data = {
                'mamon': mh.mamon,
                'tenmon': mh.tenmon,
                'magiangvien': mh.magiangvien.pk if mh.magiangvien else None,
            }
                
            data.append(mon_data)
        
        return Response({
            'success': True,
            'message': f'Lấy danh sách môn học của lớp {getattr(lop, "tenlop", malop)} thành công',
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Lỗi chi tiết: {error_traceback}")
        
        return Response({
            'success': False,
            'message': f'Không thể lấy danh sách môn học: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_mon_theo_giang_vien_theo_lop(request):
    magiangvien = request.GET.get('magiangvien')
    malop = request.GET.get('malop')
    
    if not magiangvien:
        return Response({
            'success': False, 
            'message': 'Thiếu mã giảng viên'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Kiểm tra xem giảng viên có tồn tại không
        try:
            giangvien = Giangvien.objects.get(pk=magiangvien)
        except Giangvien.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Mã giảng viên không tồn tại'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Lấy danh sách môn học theo giảng viên
        query = Monhoc.objects.filter(magiangvien=magiangvien)
        
        # Nếu có mã lớp, tiếp tục lọc theo lớp
        if malop:
            try:
                lop = Lop.objects.get(pk=malop)
                query = query.filter(malop=malop)
            except Lop.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Mã lớp không tồn tại'
                }, status=status.HTTP_404_NOT_FOUND)
                
        # Sắp xếp kết quả theo mã môn
        mon_hocs = query.order_by('mamon')
        
        data = []
        for mh in mon_hocs:
            mon_data = {
                'mamon': mh.mamon,
                'tenmon': mh.tenmon,
                'malop': mh.malop.pk if hasattr(mh, 'malop') and mh.malop else None,
                'tenlop': mh.malop.tenlop if hasattr(mh, 'malop') and mh.malop else None,
            }
            data.append(mon_data)
            
        ten_giangvien = getattr(giangvien, 'tengiangvien', magiangvien)
        message = f'Lấy danh sách môn học của giảng viên {ten_giangvien}'
        
        if malop:
            ten_lop = getattr(lop, 'tenlop', malop)
            message += f' thuộc lớp {ten_lop}'
            
        message += ' thành công'
        
        return Response({
            'success': True,
            'message': message,
            'data': data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Lỗi chi tiết: {error_traceback}")
        return Response({
            'success': False,
            'message': f'Không thể lấy danh sách môn học: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def luu_diem_danh(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            ma_lop = data.get('maLop')
            thoi_gian_diem_danh = data.get('thoiGianDiemDanh')  # Thời gian đầy đủ dạng "YYYY-MM-DD HH:MM:SS"
            danh_sach_sinh_vien = data.get('danhSachSinhVien', [])
            ma_mon = data.get('maMon')
            ma_giang_vien = data.get('maGiangVien')
            all_students = data.get('allStudents', [])
            
            # Kiểm tra các giá trị bắt buộc
            if not ma_lop or not ma_mon or not ma_giang_vien or not thoi_gian_diem_danh:
                return JsonResponse({
                    'error': 'Thiếu thông tin bắt buộc (mã lớp, mã môn, mã giảng viên hoặc thời gian)'
                }, status=400)
            
            # Chuyển đổi thời gian điểm danh thành đối tượng datetime
            try:
                dt_obj = datetime.strptime(thoi_gian_diem_danh, '%Y-%m-%d %H:%M:%S')
                ngay_format = dt_obj.strftime('%Y%m%d_%H%M%S')  # Định dạng YYYYMMDD_HHMMSS
            except ValueError:
                return JsonResponse({'error': 'Định dạng thời gian không hợp lệ'}, status=400)
            
            # Tạo mã điểm danh cơ sở: mã môn + thời gian
            ma_diem_danh_base = f"{ma_mon}_{ngay_format}"
            
            # Tìm đối tượng lớp, môn học và giảng viên
            try:
                lop = Lop.objects.get(malop=ma_lop)
                mon_hoc = Monhoc.objects.get(mamon=ma_mon)
                giang_vien = Giangvien.objects.get(magiangvien=ma_giang_vien)
            except Lop.DoesNotExist:
                return JsonResponse({'error': f'Không tìm thấy lớp với mã {ma_lop}'}, status=404)
            except Monhoc.DoesNotExist:
                return JsonResponse({'error': f'Không tìm thấy môn học với mã {ma_mon}'}, status=404)
            except Giangvien.DoesNotExist:
                return JsonResponse({'error': f'Không tìm thấy giảng viên với mã {ma_giang_vien}'}, status=404)
            
            # Lưu điểm danh cho từng sinh viên
            success_count = 0
            error_messages = []
            
            for msv in all_students:
                try:
                    sinh_vien = Sinhvien.objects.get(masinhvien=msv)
                    
                    # Tạo mã điểm danh duy nhất cho mỗi sinh viên
                    ma_diem_danh = f"{ma_diem_danh_base}_{msv}"
                    
                    # Xác định trạng thái điểm danh
                    trang_thai = "Có mặt" if msv in danh_sach_sinh_vien else "Vắng mặt"
                    
                    # Kiểm tra xem điểm danh đã tồn tại chưa
                    diem_danh, created = Diemdanh.objects.update_or_create(
                        madiemdanh=ma_diem_danh,
                        defaults={
                            'masinhvien': sinh_vien,
                            'thoigiandiemdanh': dt_obj,  # Sử dụng thời gian đầy đủ
                            'trangthai': trang_thai,
                            'mamon': mon_hoc,
                            'magiangvien': giang_vien,
                            'malop': lop
                        }
                    )
                    success_count += 1
                except Sinhvien.DoesNotExist:
                    error_messages.append(f'Không tìm thấy sinh viên với mã {msv}')
                except Exception as e:
                    error_messages.append(f'Lỗi với sinh viên {msv}: {str(e)}')
            
            response_data = {
                'success': True,
                'message': f'Đã lưu điểm danh cho {success_count} sinh viên'
            }
            
            if error_messages:
                response_data['warnings'] = error_messages
                
            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Phương thức không được hỗ trợ'}, status=405)

@api_view(['GET'])
def danh_sach_diem_danh_sinh_vien(request):
    if request.method == 'GET':
        try:
            # Lấy mã sinh viên từ tham số URL
            ma_sinh_vien = request.GET.get('masinhvien')
            if not ma_sinh_vien:
                return JsonResponse({'error': 'Thiếu mã sinh viên'}, status=400)
            
            # Tìm sinh viên
            try:
                sinh_vien = Sinhvien.objects.get(masinhvien=ma_sinh_vien)
            except Sinhvien.DoesNotExist:
                return JsonResponse({'error': f'Không tìm thấy sinh viên với mã {ma_sinh_vien}'}, status=404)
            
            # Lấy danh sách điểm danh của sinh viên
            danh_sach_diem_danh = Diemdanh.objects.filter(masinhvien=sinh_vien)
            
            # Format dữ liệu trả về
            result = []
            for diem_danh in danh_sach_diem_danh:
                result.append({
                    'id': diem_danh.madiemdanh,
                    'thoiGianDiemDanh': diem_danh.thoigiandiemdanh.strftime('%Y-%m-%d %H:%M:%S'),
                    'trangThai': diem_danh.trangthai,
                    'tenGiangVien': diem_danh.magiangvien.tengiangvien if hasattr(diem_danh.magiangvien, 'tengiangvien') else diem_danh.magiangvien.magiangvien,
                    'tenMon': diem_danh.mamon.tenmon if hasattr(diem_danh.mamon, 'tenmon') else diem_danh.mamon.mamon,
                    'maLop': diem_danh.malop.malop
                })
            
            return JsonResponse({
                'success': True,
                'data': result
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Phương thức không được hỗ trợ'}, status=405)