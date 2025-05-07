// src/trangchu/SidebarUser .js
import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { UserRound, ScanFace, LogOut } from 'lucide-react';
import './SidebarUser.css'; // Nhập tệp CSS nếu cần

function SidebarUser () {
  return (
    <div className="side-menu-u">
      <Menu>
        <div className="icon-u">
          <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label-u">Face ID</p>
        </div>
        <MenuItem className="menu-item-u" href="/user">
          <div className="icon-u">
            <UserRound />
            <p className="title-u">Thông tin cá nhân</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item-u" href="/user/chon-mon-u">
          <div className="icon-u">
            <ScanFace />
            <p className="title-u">Điểm danh</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item-u" href="/dangnhap">
          <div className="icon-u">
            <LogOut />
            <p className="title-u">Đăng xuất</p>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SidebarUser ;