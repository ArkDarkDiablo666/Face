import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { House, UserRound as User, CalendarCheck, LogOut } from 'lucide-react';
import './TrangCaNhanG.css';

function TrangCaNhanG() {
  const [masinhvien, setMaSinhVien] = useState('');
  const [hoten, setHoTen] = useState('');
  const [gioitinh, setGioiTinh] = useState('');
  const [ngaysinh, setNgaySinh] = useState('');
  const [sdt, setSDT] = useState('');
  const [email, setEmail] = useState('');
  const [tenkhoa, setTenKhoa] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const masinhvien = sessionStorage.getItem("tendangnhap");

    if (masinhvien) {
      setMaSinhVien(masinhvien);

      const apiUrl = `http://127.0.0.1:8000/object/thong-tin-sinh-vien/${masinhvien}/`;
      axios.get(apiUrl)
        .then(res => {
          const data = res.data;
          setHoTen(data.hoten || '');
          setGioiTinh(data.gioitinh || '');
          setNgaySinh(data.ngaysinh || '');
          setSDT(data.sdt || '');
          setEmail(data.email || '');
          setTenKhoa(data.tenkhoa || '');
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.error || "Không thể kết nối đến server");
          setLoading(false);
        });
    } else {
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container">
      <div className="side-menu">
        <Menu>
          <div className="icon">
            <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
            <p className="label">Face ID</p>
          </div>
          <MenuItem className="menu-item" href="/guest">
            <div className="icon">
              <House />
              <p className="title">Trang chủ</p>
            </div>
          </MenuItem>
          <MenuItem className="menu-item" href="/guest/trang-ca-nhan">
            <div className="icon">
              <User />
              <p className="title-main">Thông tin cá nhân</p>
            </div>
          </MenuItem>
          <MenuItem className="menu-item" href="/guest/xem">
            <div className="icon">
              <CalendarCheck />
              <p className="title">Thống kê điểm danh</p>
            </div>
          </MenuItem>
          <MenuItem className="menu-item" href="/dangnhap">
            <div className="icon">
              <LogOut />
              <p className="title">Đăng xuất</p>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div className="content-thong-tin">
        <h1>Thông tin cá nhân</h1>
        <div className='line'></div>

        {loading ? (
          <p>Đang tải thông tin...</p>
        ) : error ? (
          <div className="error-message">
            <p>Lỗi: {error}</p>
          </div>
        ) : (
          <div className='form-ca-nhan'>
            <div className='form-thong-tin'>
              <img src="/tighnari.png" alt="Avatar" className='avatar' />
            </div>
            <div className='form-thong-tin'>
              <div className='form-chu'>
                <p className='chu-ca-nhan'>Mã sinh viên: </p>
                <p className='chu-thong-tin'>{masinhvien}</p>
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
        )}
      </div>
    </div>
  );
}

export default TrangCaNhanG;
