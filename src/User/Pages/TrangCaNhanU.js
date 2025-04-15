// src/trangchu/DashboardGuest.js
import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import './TrangCaNhanU.css'; // Nhập tệp CSS
import { House, UserRound, ScanFace, LogOut } from 'lucide-react';

function TrangCaNhanU() {
  return (
    <div className="container">
        <div className="side-menu">
          <Menu>
            <div className="icon">
              <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
              <p className="label">Face ID</p>
            </div>
            <MenuItem className="menu-item" href="/user">
              <div className="icon">
                <House />
                <p className="title">Trang chủ</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/user/trang-ca-nhan">
              <div className="icon">
                <UserRound />
                <p className="title-main">Thông tin cá nhân</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/user/diem-danh">
              <div className="icon">
                <ScanFace />
                <p className="title">Điểm danh</p>
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
          <h1>TrangCaNhanU</h1>
          <div className='line'></div>
          <div className='form-ca-nhan'>
            <div className='form-thong-tin'>
              <img src="/tighnari.png" alt="Logo" className='avatar' />
            </div>
            <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Mã giáo viên: </p>
                  <p className='chu-thong-tin'>KHDL000001</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Khoa: </p>
                  <p className='chu-thong-tin'>Công nghệ thông tin</p>
                </div>
              </div>
              <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Họ tên: </p>
                  <p className='chu-thong-tin'>Tighnari</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Giới tính: </p>
                  <p className='chu-thong-tin'>Nam</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Ngày sinh: </p>
                  <p className='chu-thong-tin'>29 tháng 12 năm 2002</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Số điện thoại: </p>
                  <p className='chu-thong-tin'>0987654321</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Email: </p>
                  <p className='chu-thong-tin'>tighnari@teacher.ctuet.edu.vn</p>
                </div>
              </div>
          </div>
        </div>
    </div>
  );
};

export default TrangCaNhanU;