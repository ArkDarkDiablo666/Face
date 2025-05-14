import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { House, UserRound as User, CalendarCheck, LogOut } from 'lucide-react';
import './SidebarGuest.css'; // Nhập tệp CSS nếu cần

function SidebarGuest() {
  return (
    <div className="side-menu-g">
      <Menu>
        <div className="icon-g">
          <img src="/logo-final.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label-g">Face ID</p>
        </div>
        <MenuItem className="menu-item-g" href="/guest" icon={<div className='icon-g'><User  /></div>}>
          <p className="title-g">Thông tin cá nhân</p>
        </MenuItem>
        <MenuItem className="menu-item-g" href="/guest/xem" icon={<div className='icon-g'><CalendarCheck /></div>}>
          <p className="title-g">Thống kê điểm danh</p>
        </MenuItem>
        <MenuItem className="menu-item-g" href="/" icon={<div className='icon-g'><LogOut /></div>}>
          <p className="title-g">Đăng xuất</p>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SidebarGuest;