// src/trangchu/dangnhap/DangNhap.js
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
      const res = await axios.post('http://localhost:8000/login/', {
        tendangnhap,
        matkhau,
      });

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
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label>Tên đăng nhập:</label>
            <input
              className='input'
              type="text"
              value={tendangnhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
            />
          </div>
          <div className='input-group'>
            <label>Mật khẩu:</label>
            <input
              className='input'
              type="password"
              value={matkhau}
              onChange={(e) => setMatKhau(e.target.value)}
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
