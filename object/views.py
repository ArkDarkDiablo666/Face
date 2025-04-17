from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import re
from datetime import datetime, date
from .models import Khoa, Nganh, Lop, Sinhvien, Giaovien, Monhoc, Diemdanh
from .serializers import (
    KhoaSerializer, NganhSerializer, LopSerializer,
    SinhvienSerializer, GiaovienSerializer, MonhocSerializer, DiemdanhSerializer
)
import json
from datetime import date

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
    username = request.data.get('tendangnhap')
    password = request.data.get('matkhau')
    
    if not username or not password:
        return Response({'error': 'Thiếu tên đăng nhập hoặc mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra bằng mã giáo viên
    try:
        gv = Giaovien.objects.get(magiaovien=username, matkhau=password)
        if gv.quyen.strip().lower() == 'admin':
            return Response({'role': 'admin'}, status=status.HTTP_200_OK)
        elif gv.quyen.strip().lower() == 'user':
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
def tao_nganh_view(request):
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
def tao_lop_view(request):
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
        
@api_view(['POST'])
def tao_giao_vien_view(request):
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
    if Giaovien.objects.filter(sdt=sdt).exists():
        return Response({'error': 'Số điện thoại đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

    # Email phải có đuôi @gmail.edu.vn và duy nhất
    if not email.endswith('@edu.vn'):
        return Response({'error': 'Email phải có đuôi @edu.vn'}, status=status.HTTP_400_BAD_REQUEST)
    if Giaovien.objects.filter(email=email).exists():
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
    magiaovien = tao_ma_giao_vien(makhoa)  # Truyền mã khoa thay vì tên khoa

    # Tạo giáo viên mới 
    try:
        gv = Giaovien.objects.create(
            magiaovien=magiaovien,
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
                'magiaovien': gv.magiaovien,
                'hoten': gv.hoten,
                'email': gv.email,
                'makhoa': gv.makhoa.makhoa
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Lỗi khi tạo tài khoản: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def tao_sinh_vien_view(request):
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

        if not email.endswith('@ctuet.edu.vn'):
            return Response({'error': 'Email phải có đuôi @ctuet.edu.vn'}, status=status.HTTP_400_BAD_REQUEST)
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
            'data': {
                'masinhvien': sv.masinhvien,
                'hoten': sv.hoten,
                'email': sv.email,
                'malop': sv.malop.malop
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Lỗi khi tạo sinh viên: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def tao_ma_giao_vien(ma_khoa):
    from .models import Giaovien, Khoa
    
    try:
        # Tìm đối tượng khoa theo mã khoa thay vì tên khoa
        khoa = Khoa.objects.get(makhoa=ma_khoa)
    except Khoa.DoesNotExist:
        raise ValueError("Mã khoa không hợp lệ")

    # Đếm số lượng giáo viên hiện có trong khoa này
    count = Giaovien.objects.filter(makhoa=khoa).count()
    
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
        data = [{'makhoa': k.makhoa} for k in khoas]
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
