import React from 'react';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { UserRound, ScanFace, LogOut } from 'lucide-react';
import './SidebarUser.css'; // Nhập tệp CSS nếu cần

function SidebarUser () {
  return (
    <div className="side-menu-u">
      <Menu>
        <div className="icon-u">
          <img src="../logo-final.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label-u">Face ID</p>
        </div>
        <MenuItem className="menu-item-u" href="/user" icon={<div className='icon-u'><UserRound /></div>}>
          <p className="title-u">Thông tin cá nhân</p>
        </MenuItem>
        <MenuItem className="menu-item-u" href="/user/chon-mon-u" icon={<div className='icon-u'><ScanFace /></div>}>
          <p className="title-u">Điểm danh</p>
        </MenuItem>
        <MenuItem className="menu-item-u" href="/" icon={<div className='icon-u'><LogOut /></div>}>
          <p className="title-u">Đăng xuất</p>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SidebarUser ;