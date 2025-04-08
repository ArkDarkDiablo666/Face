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
        <div className='content'>
          <h1>Guest</h1>
        </div>
    </div>
  );
};

export default TrangCaNhanG;