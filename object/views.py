from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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
        if gv.quyen.strip().lower() == 'Admin'.lower():
            return Response({'role': 'admin'}, status=status.HTTP_200_OK)
        elif gv.quyen.strip().lower() == 'User'.lower():
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
