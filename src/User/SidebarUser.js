// src/trangchu/SidebarUser .js
import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { UserRound, ScanFace, LogOut } from 'lucide-react';
import './SidebarUser.css'; // Nhập tệp CSS nếu cần

function SidebarUser () {
  return (
    <div className="side-menu">
      <Menu>
        <div className="icon">
          <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label">Face ID</p>
        </div>
        <MenuItem className="menu-item" href="/user">
          <div className="icon">
            <UserRound />
            <p className="title-main">Thông tin cá nhân</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item" href="/user/chon-mon">
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
  );
}

export default SidebarUser ;