import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DangNhap.css';
import { Eye, EyeOff } from 'lucide-react';

function DangNhap() {
  const [tendangnhap, setTenDangNhap] = useState('');
  const [matkhau, setMatKhau] = useState('');
  const [hienMatKhau, setHienMatKhau] = useState(false);
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

      if (res.data.tendangnhap) {
        sessionStorage.setItem("tendangnhap", res.data.tendangnhap);
      }

      const role = res.data.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'user') {
        navigate('/user');
      } else if (role === 'guest') {
        navigate('/guest');
      }
    } catch (err) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-signin">
      <div className='form-background'>
        <div className='form-logo'>
          <img src="./logo-final.png" alt="Logo" className='logo-dn' />
          <form className='form-text-logo'>
            <h1>NHẬN DIỆN FID</h1>
          </form>
        </div>
        <div className='form-signin'>
          <h1 className='text-ultra'>ĐĂNG NHẬP</h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input type="text" style={{display: 'none'}} />
            <input type="password" style={{display: 'none'}} />

            <div className='form-dn'>
              <input
                className='input-dn'
                type="text"
                value={tendangnhap}
                placeholder='Vui lòng hãy nhập mã tài khoản'
                onChange={(e) => setTenDangNhap(e.target.value)}
                autoComplete="new-password"
              />
              <div className="input-password input">
                <input
                  type={hienMatKhau ? 'text' : 'password'}
                  value={matkhau}
                  placeholder='Vui lòng hãy nhập mật khẩu'
                  onChange={(e) => setMatKhau(e.target.value)}
                  autoComplete="new-password"
                />
                <span className="icon-eye" onClick={() => setHienMatKhau(!hienMatKhau)}>
                  {hienMatKhau ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className='form-button'>
              <button className='button-dn' type="submit" disabled={loading}>
                <span>
                  {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </span>
              </button>
              <a href='/quen-mat-khau'>Quên mật khẩu?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DangNhap;
