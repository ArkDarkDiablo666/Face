import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../SidebarAdmin';
import '../../TrangCaNhan.css'; 
import axios from 'axios';

function TrangCaNhanA() {
  const [thongTin, setThongTin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Khai báo các biến trạng thái riêng cho từng trường thông tin
  const [magiangvien, setMaGiangVien] = useState('');
  const [hoten, setHoTen] = useState('');
  const [gioitinh, setGioiTinh] = useState('');
  const [ngaysinh, setNgaySinh] = useState('');
  const [sdt, setSDT] = useState('');
  const [email, setEmail] = useState('');
  const [tenkhoa, setTenKhoa] = useState('');
  
  useEffect(() => {
    // Lấy mã giáo viên từ localStorage
    const magiangvien = sessionStorage.getItem("tendangnhap");
    
    if (magiangvien) {
      setMaGiangVien(magiangvien);
      
      // Hiển thị URL sẽ gọi API để dễ debug
      const apiUrl = `http://127.0.0.1:8000/object/thong-tin-giang-vien/${magiangvien}/`;
      console.log("Gọi API:", apiUrl);
      
      setLoading(true);
      axios.get(apiUrl)
        .then(res => {
          console.log("Dữ liệu API trả về:", res.data);
          setThongTin(res.data);
          
          // Gán các giá trị vào state tương ứng
          setMaGiangVien(res.data.magiangvien || magiangvien);
          setHoTen(res.data.hoten || '');
          setGioiTinh(res.data.gioitinh || '');
          setNgaySinh(res.data.ngaysinh || '');
          setSDT(res.data.sdt || '');
          setEmail(res.data.email || '');
          setTenKhoa(res.data.tenkhoa || '');
          
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi khi lấy thông tin giáo viên:", err);
          console.error("Thông tin chi tiết:", err.response?.data || err.message);
          setError(err.response?.data?.error || "Không thể kết nối đến server");
          setLoading(false);
        });
    } else {
      console.error("Không tìm thấy mã giáo viên trong localStorage");
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
    }
  }, []);

  // Debug các giá trị state để kiểm tra
  useEffect(() => {
    console.log("State đã cập nhật:");
    console.log("magiaovien:", magiangvien);
    console.log("hoten:", hoten);
    console.log("gioitinh:", gioitinh);
    console.log("ngaysinh:", ngaysinh);
    console.log("sdt:", sdt);
    console.log("email:", email);
    console.log("tenkhoa:", tenkhoa);
  }, [magiangvien, hoten, gioitinh, ngaysinh, sdt, email, tenkhoa]);

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
      <SidebarAdmin />
        <div className="content-tk">
          <h1>Thông tin cá nhân</h1>
          <div className='line'></div>
          {loading ? (
            <p>Đang tải thông tin...</p>
          ) : error ? (
            <div className="error-message">
              <p>Đã xảy ra lỗi: {error}</p>
              <p>Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
          ) : thongTin ? (
            <div className='form-ca-nhan'>
              <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Mã giảng viên: </p>
                  <p className='chu-thong-tin'>{magiangvien}</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Khoa: </p>
                  <p className='chu-thong-tin'>{tenkhoa}</p>
                </div>
              </div>
              <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Họ tên: </p>
                  <p className='chu-thong-tin'>{hoten}</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Giới tính: </p>
                  <p className='chu-thong-tin'>{gioitinh}</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Ngày sinh: </p>
                  <p className='chu-thong-tin'>
                    {ngaysinh ? new Date(ngaysinh).toLocaleDateString('vi-VN') : ''}
                  </p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Số điện thoại: </p>
                  <p className='chu-thong-tin'>{sdt}</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Email: </p>
                  <p className='chu-thong-tin'>{email}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Không có thông tin để hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrangCaNhanA;