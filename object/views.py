from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import re
from .models import Khoa, Nganh, Lop, Sinhvien, Giaovien, Monhoc, Diemdanh
from .serializers import (
    KhoaSerializer, NganhSerializer, LopSerializer,
    SinhvienSerializer, GiaovienSerializer, MonhocSerializer, DiemdanhSerializer
)

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

class GiaovienViewSet(viewsets.ModelViewSet):
    queryset = Giaovien.objects.all()
    serializer_class = GiaovienSerializer

class MonhocViewSet(viewsets.ModelViewSet):
    queryset = Monhoc.objects.all()
    serializer_class = MonhocSerializer

class DiemdanhViewSet(viewsets.ModelViewSet):
    queryset = Diemdanh.objects.all()
    serializer_class = DiemdanhSerializer

@api_view(['POST'])
def login_view(request):
    # In ra dữ liệu nhận được
    print("Received data:", request.data)
    
    username = request.data.get('tendangnhap')
    password = request.data.get('matkhau')
    
    if not username or not password:
        return Response({'error': 'Thiếu tên đăng nhập hoặc mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra bằng mã giáo viên
    try:
        gv = Giaovien.objects.get(magiaovien=username, matkhau=password)
        print(f"Giáo viên quyền: {gv.quyen}")  # In ra quyền giáo viên
        if gv.quyen.strip().lower() == 'admin'.lower():
            return Response({'role': 'admin'}, status=status.HTTP_200_OK)
        elif gv.quyen.strip().lower() == 'user'.lower():
            return Response({'role': 'user'}, status=status.HTTP_200_OK)
    except Giaovien.DoesNotExist:
        pass
    
    # Kiểm tra bằng mã sinh viên
    try:
        sv = Sinhvien.objects.get(masinhvien=username, matkhau=password)
        return Response({'role': 'guest'}, status=status.HTTP_200_OK)
    except Sinhvien.DoesNotExist:
        pass
    
    return Response({'error': 'Tài khoản hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def tao_khoa_view(request):
    ma_khoa = request.data.get('makhoa', '').strip()
    ten_khoa = request.data.get('tenkhoa', '').strip()
    
    if not ma_khoa or not ten_khoa:
        return Response({'error': 'Mã khoa và tên khoa không được để trống'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Regex cho mã khoa: chỉ chấp nhận chữ và số
    ma_khoa_pattern = r'^[A-Za-z0-9]+$'
    
    # Regex đầy đủ cho tiếng Việt: liệt kê tất cả các ký tự tiếng Việt
    ten_khoa_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    
    if not re.match(ma_khoa_pattern, ma_khoa):
        return Response({'error': 'Mã khoa không hợp lệ, chỉ chấp nhận chữ và số'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not re.match(ten_khoa_pattern, ten_khoa):
        return Response({'error': 'Tên khoa không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Kiểm tra mã khoa đã tồn tại
    if Khoa.objects.filter(makhoa=ma_khoa).exists():
        return Response({'error': 'Mã khoa đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        khoa = Khoa.objects.create(makhoa=ma_khoa, tenkhoa=ten_khoa)
        return Response({
            'message': 'Tạo khoa thành công!', 
            'data': {'makhoa': khoa.makhoa, 'tenkhoa': khoa.tenkhoa}
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo khoa: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def tao_nganh_view(request):
    print("Dữ liệu nhận được:", request.data)
    ma_nganh = request.data.get('manganh', '').strip()
    ten_nganh = request.data.get('tennganh', '').strip()
    ma_khoa = request.data.get('makhoa', '').strip()  # Mã khoa được chọn từ danh sách

    if not ma_nganh or not ten_nganh or not ma_khoa:
        return Response({'error': 'Vui lòng điền đầy đủ mã ngành, tên ngành và mã khoa'}, status=status.HTTP_400_BAD_REQUEST)

    # Ràng buộc mã ngành: chữ và số
    ma_nganh_pattern = r'^[A-Za-z0-9]+$'
    if not re.match(ma_nganh_pattern, ma_nganh):
        return Response({'error': 'Mã ngành không hợp lệ, chỉ chấp nhận chữ và số'}, status=status.HTTP_400_BAD_REQUEST)

    # Ràng buộc tên ngành: chữ cái, số và tiếng Việt có dấu
    ten_nganh_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    if not re.match(ten_nganh_pattern, ten_nganh):
        return Response({'error': 'Tên ngành không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra tồn tại
    if Nganh.objects.filter(manganh=ma_nganh).exists():
        return Response({'error': 'Mã ngành đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    if not Khoa.objects.filter(makhoa=ma_khoa).exists():
        return Response({'error': 'Mã khoa không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        nganh = Nganh.objects.create(manganh=ma_nganh, tennganh=ten_nganh, makhoa_id=ma_khoa)
        return Response({
            'message': 'Tạo ngành thành công!',
            'data': {'manganh': nganh.manganh, 'tennganh': nganh.tennganh, 'makhoa': nganh.makhoa_id}
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_khoa(request):
    try:
        khoas = Khoa.objects.all()
        # Chỉ lấy mã khoa
        data = [{'makhoa': k.makhoa} for k in khoas]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách khoa: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def tao_lop_view(request):
    print("Dữ liệu nhận được:", request.data)
    ma_lop = request.data.get('malop', '').strip()
    ten_lop = request.data.get('tenlop', '').strip()
    ma_nganh = request.data.get('manganh', '').strip()  # mã ngành từ danh sách dropdown

    if not ma_lop or not ten_lop or not ma_nganh:
        return Response({'error': 'Vui lòng điền đầy đủ mã lớp, tên lớp và mã ngành'}, status=status.HTTP_400_BAD_REQUEST)

    # Ràng buộc mã lớp: chỉ gồm chữ và số, không khoảng trắng
    ma_lop_pattern = r'^[A-Za-z0-9]+$'
    if not re.match(ma_lop_pattern, ma_lop):
        return Response({'error': 'Mã lớp không hợp lệ, chỉ chấp nhận chữ và số, không có khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    # Ràng buộc tên lớp: chữ cái, số và tiếng Việt có dấu
    ten_lop_pattern = r'^[a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]+$'
    if not re.match(ten_lop_pattern, ten_lop):
        return Response({'error': 'Tên lớp không hợp lệ, chỉ chấp nhận chữ, số và khoảng trắng'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra lớp đã tồn tại chưa
    if Lop.objects.filter(malop=ma_lop).exists():
        return Response({'error': 'Mã lớp đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra ngành tồn tại
    try:
        nganh = Nganh.objects.get(manganh=ma_nganh)
    except Nganh.DoesNotExist:
        return Response({'error': 'Mã ngành không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lop = Lop.objects.create(malop=ma_lop, tenlop=ten_lop, manganh=nganh)
        return Response({
            'message': 'Tạo lớp thành công!',
            'data': {'malop': lop.malop, 'tenlop': lop.tenlop, 'manganh': lop.manganh.manganh}
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Có lỗi xảy ra khi tạo lớp: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def danh_sach_nganh(request):
    try:
        nganh_list = Nganh.objects.all()
        data = [{'manganh': n.manganh} for n in nganh_list]
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Không thể lấy danh sách ngành: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



