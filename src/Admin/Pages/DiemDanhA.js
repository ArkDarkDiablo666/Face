import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../SidebarAdmin';
import DiemDanhCameraA from './DiemDanhCameraA';
import './DiemDanhA.css';
import { format } from 'date-fns'; // Make sure date-fns is installed

function DiemDanhA() {
  const navigate = useNavigate();
  const [danhSachSinhVien, setDanhSachSinhVien] = useState([]);
  const [tenLop, setTenLop] = useState('');
  const [tenMon, setTenMon] = useState('');
  const [ngay, setNgay] = useState('');
  const [gio, setGio] = useState('');
  const [thoiGianDiemDanh, setThoiGianDiemDanh] = useState(''); // This is used in API call
  const [maLop, setMaLop] = useState('');
  const [maMon, setMaMon] = useState('');
  const [maGiangVien, setMaGiangVien] = useState('');
  const [diemDanh, setDiemDanh] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Lấy thông tin điểm danh từ sessionStorage
    const thongTin = sessionStorage.getItem('thongTinDiemDanh');
    if (thongTin) {
      try {
        const parsedData = JSON.parse(thongTin);
        console.log("Dữ liệu lấy từ sessionStorage:", parsedData);
        
        // Xử lý mã lớp
        const maLopValue = parsedData.maLop || '';
        setMaLop(maLopValue);
        
        // Các trường dữ liệu khác
        setTenLop(parsedData.tenLop || '');
        setTenMon(parsedData.tenMon || '');
        
        // Xử lý ngày và giờ
        const ngayDiemDanh = parsedData.ngayDiemDanh || '';
        setNgay(ngayDiemDanh);
        
        // Tạo thời gian hiện tại cho giờ điểm danh
        const now = new Date();
        const gioHienTai = format(now, 'HH:mm:ss');
        setGio(gioHienTai);
        
        // Tạo chuỗi thời gian đầy đủ cho điểm danh
        const thoiGianDayDu = ngayDiemDanh ? `${ngayDiemDanh} ${gioHienTai}` : '';
        setThoiGianDiemDanh(thoiGianDayDu);
        
        setMaMon(parsedData.maMon || '');
        
        // Lấy mã giảng viên từ sessionStorage hoặc từ dữ liệu đã có
        const maGV = sessionStorage.getItem("tendangnhap") || '';
        setMaGiangVien(maGV || parsedData.maGiangVien || '');
        
        // Log kiểm tra các thông tin quan trọng
        console.log("Thông tin điểm danh đã load:", {
          maLop: maLopValue,
          maMon: parsedData.maMon || '',
          maGiangVien: maGV || parsedData.maGiangVien || '',
          thoiGianDiemDanh: thoiGianDayDu
        });
        
        // Thiết lập danh sách sinh viên và khởi tạo trạng thái điểm danh
        const sinhVienList = parsedData.danhSachSinhVien || [];
        setDanhSachSinhVien(sinhVienList);

        const initialState = {};
        sinhVienList.forEach(sv => {
          initialState[sv.masinhvien] = false;
        });
        setDiemDanh(initialState);
      } catch (error) {
        console.error("Lỗi khi xử lý thông tin điểm danh:", error);
        hienThiThongBao('Lỗi khi xử lý dữ liệu điểm danh. Vui lòng thử lại!', 'error');
        navigate('/admin/chon-mon');
      }
    } else {
      console.warn("Không tìm thấy thông tin điểm danh trong sessionStorage");
      hienThiThongBao('Không có dữ liệu điểm danh. Vui lòng chọn môn học trước!', 'error');
      navigate('/admin/chon-mon');
    }
  }, [navigate]);

  // Hàm hiển thị thông báo tự động ẩn
  const hienThiThongBao = (message, type, redirectAfter = false) => {
    setThongBao(message);
    setLoaiThongBao(type);
    
    setTimeout(() => {
      setThongBao('');
      setLoaiThongBao('');
      
      // Nếu redirectAfter là true và type là success, chuyển hướng sau khi hiển thị thông báo
      if (redirectAfter && type === 'success') {
        navigate('/admin/chon-mon');
      }
    }, 2000); // Giảm thời gian chờ để người dùng không phải đợi quá lâu
  };

  // Cập nhật trạng thái điểm danh khi checkbox thay đổi
  const handleCheckboxChange = (masinhvien) => {
    setDiemDanh(prev => ({
      ...prev,
      [masinhvien]: !prev[masinhvien]
    }));
  };

  // Xử lý lưu điểm danh
  const handleLuuDiemDanh = async () => {
    setIsLoading(true);
    try {
      // Kiểm tra các trường bắt buộc
      if (!maLop || maLop.trim() === '') {
        throw new Error("Mã lớp không được để trống! Vui lòng làm mới trang và thử lại.");
      }
      
      if (!maMon || maMon.trim() === '') {
        throw new Error("Mã môn không được để trống! Vui lòng làm mới trang và thử lại.");
      }
      
      if (!maGiangVien || maGiangVien.trim() === '') {
        throw new Error("Mã giảng viên không được để trống! Vui lòng đăng nhập lại.");
      }
      
      if (!ngay) {
        throw new Error("Ngày điểm danh không được để trống!");
      }

      // Cập nhật thời gian điểm danh hiện tại
      const now = new Date();
      const gioHienTai = format(now, 'HH:mm:ss');
      setGio(gioHienTai);
      
      // Cập nhật thời gian đầy đủ
      const thoiGianDayDu = `${ngay} ${gioHienTai}`;
      setThoiGianDiemDanh(thoiGianDayDu);
      
      // Log thông tin để kiểm tra trước khi gửi
      console.log("Thông tin điểm danh sẽ gửi:", {
        maLop, maMon, maGiangVien, thoiGianDiemDanh: thoiGianDayDu
      });
      
      // Lấy danh sách sinh viên có mặt (đã được điểm danh)
      const danhSachDaDiemDanh = Object.entries(diemDanh)
        .filter(([_, coMat]) => coMat)
        .map(([masinhvien]) => masinhvien);

      // Lấy danh sách tất cả sinh viên
      const allStudents = danhSachSinhVien.map(sv => sv.masinhvien);
      
      // Gửi request lưu điểm danh
      const response = await fetch('http://127.0.0.1:8000/object/luu-diem-danh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maLop,
          maMon,
          maGiangVien,
          thoiGianDiemDanh: thoiGianDayDu,
          danhSachSinhVien: danhSachDaDiemDanh,
          allStudents
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Hiển thị thông báo thành công và redirect sau đó
        hienThiThongBao(data.message || 'Điểm danh thành công!', 'success', true);
      } else {
        throw new Error(data.error || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Lỗi khi lưu điểm danh:', error);
      hienThiThongBao('Lỗi khi lưu điểm danh: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Điều khiển hiển thị camera
  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  const handleCloseCameraModal = () => {
    setShowCamera(false);
  };

  // Xử lý kết quả nhận diện khuôn mặt
  const handleFacesDetected = (msvList) => {
    if (!msvList || msvList.length === 0) {
      hienThiThongBao('Không nhận diện được sinh viên nào!', 'warning');
      return;
    }

    // Tạo bản sao của trạng thái điểm danh hiện tại
    const newDiemDanh = { ...diemDanh };
    let countMatched = 0;

    // Đánh dấu các sinh viên được nhận diện
    msvList.forEach(msv => {
      // Lọc ra các sinh viên "UNKNOWN"
      if (msv !== "UNKNOWN" && newDiemDanh.hasOwnProperty(msv)) {
        newDiemDanh[msv] = true;
        countMatched++;
      }
    });

    // Cập nhật trạng thái điểm danh
    setDiemDanh(newDiemDanh);

    // Hiển thị thông báo kết quả
    if (countMatched > 0) {
      hienThiThongBao(`Đã điểm danh thành công cho ${countMatched} sinh viên!`, 'success');
    } else {
      hienThiThongBao('Không tìm thấy sinh viên nào trong danh sách lớp!', 'warning');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-dd-ad">
          <h1>Điểm Danh</h1>
          <h2>{tenMon} - {tenLop}</h2>
          <div className="thoi-gian-info">
            <p><strong>Ngày điểm danh:</strong> {ngay}</p>
            <p><strong>Giờ hiện tại:</strong> {gio}</p>
            {/* Add this line to use thoiGianDiemDanh in render if needed */}
            <p className="hidden-info" style={{ display: 'none' }}>Thời gian đầy đủ: {thoiGianDiemDanh}</p>
          </div>

          {thongBao && (
            <div className={`thong-bao ${loaiThongBao}`}>
              {thongBao}
            </div>
          )}

          <table className="bang-diem-danh">
            <thead>
              <tr>
                <th>STT</th>
                <th>MSSV</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {danhSachSinhVien.map((sv, index) => (
                <tr key={sv.masinhvien} className={diemDanh[sv.masinhvien] ? 'co-mat' : ''}>
                  <td>{index + 1}</td>
                  <td>{sv.masinhvien}</td>
                  <td>{sv.hoten}</td>
                  <td>{sv.gioitinh}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={diemDanh[sv.masinhvien] || false}
                      onChange={() => handleCheckboxChange(sv.masinhvien)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="button-group" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
            <button 
              className="button-tao" 
              onClick={toggleCamera}
              disabled={isLoading}
            >
              Điểm Danh
            </button>
            
            <button 
              className="button-tao" 
              onClick={handleLuuDiemDanh}
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>

      {showCamera && (
        <DiemDanhCameraA
          onClose={handleCloseCameraModal}
          onFacesDetected={handleFacesDetected}
          students={danhSachSinhVien}
        />
      )}
    </div>
  );
}

export default DiemDanhA;