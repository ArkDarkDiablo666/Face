import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { House, UserRound as User, CalendarCheck, LogOut } from 'lucide-react';
import './TrangCaNhanG.css';

function TrangCaNhanG() {
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
                <User  />
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
          <h1>TrangCaNhanG</h1>
          <div className='line'></div>
          <div className='form-ca-nhan'>
            <div className='form-thong-tin'>
              <img src="/venti.png" alt="Logo" className='avatar' />
            </div>
            <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Mã sinh viên: </p>
                  <p className='chu-thong-tin'>KHDL2211058</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Khoa: </p>
                  <p className='chu-thong-tin'>Công nghệ thông tin</p>
                </div>
              </div>
              <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Họ tên: </p>
                  <p className='chu-thong-tin'>Venti</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Giới tính: </p>
                  <p className='chu-thong-tin'>Nam</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Ngày sinh: </p>
                  <p className='chu-thong-tin'>16 tháng 6 năm 2004</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Số điện thoại: </p>
                  <p className='chu-thong-tin'>0907633146</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Email: </p>
                  <p className='chu-thong-tin'>venti@student.ctuet.edu.vn</p>
                </div>
              </div>
          </div>
        </div>
    </div>
  );
};

export default TrangCaNhanG;