import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DangNhap.css';

function DangNhap() {
  const [tendangnhap, setTenDangNhap] = useState('');
  const [matkhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/dangnhap/', {
        tendangnhap,
        matkhau,
      });
      console.log("Dữ liệu từ server trả về:", res.data);  // Xem toàn bộ response
      
      // Kiểm tra và lưu vào sessionStorage nếu có mã
      if (res.data.tendangnhap) {
        console.log("Đang lưu mã vào sessionStorage:", res.data.tendangnhap);
        sessionStorage.setItem("tendangnhap", res.data.tendangnhap);  // Lưu mã
      } else {
        console.log("Không có 'tendangnhap' trong dữ liệu trả về");
      }
      
      const role = res.data.role;
      if (role === 'admin') {
        navigate('/admin/trang-ca-nhan');
      } else if (role === 'user') {
        navigate('/user/trang-ca-nhan');
      } else if (role === 'guest') {
        navigate('/guest/trang-ca-nhan');
      }
    } catch (err) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-dn">
      <div className='logo-container'>
        <img className='img' src="/meme.png" alt="Logo" />
      </div>
      <div className='form-container-dn'>
        <h1 className='title-container'>Đăng Nhập</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Input ẩn để "đánh lừa" tính năng tự động điền */}
          <input type="text" style={{display: 'none'}} />
          <input type="password" style={{display: 'none'}} />
          
          <div className='input-group'>
            <label>Tên đăng nhập:</label>
            <input
              className='input'
              type="text"
              value={tendangnhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className='input-group'>
            <label>Mật khẩu:</label>
            <input
              className='input'
              type="password"
              value={matkhau}
              onChange={(e) => setMatKhau(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button className="button" type="submit" disabled={loading}>
            <span className="button-content">
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </span>
          </button>
          <a href='/quen-mat-khau' style={{ color: 'black' }}>
            <h4>Quên mật khẩu</h4>
          </a>
        </form>
      </div>
    </div>
  );
}

export default DangNhap;