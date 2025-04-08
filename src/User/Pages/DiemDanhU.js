// src/trangchu/DashboardGuest.js
import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import './DiemDanhU.css'; // Nhập tệp CSS
import { House, UserRound, ScanFace, LogOut } from 'lucide-react';

function DiemDanhU() {
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
                <p className="title">Thông tin cá nhân</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/user/diem-danh">
              <div className="icon">
                <ScanFace />
                <p className="title-main">Điểm danh</p>
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
        <div className="content">
          <h1>User</h1>
        </div>
    </div>
  );
};

export default DiemDanhU;