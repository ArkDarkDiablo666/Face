// Sidebar.js
import React from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus } from 'lucide-react';
import './SidebarAdmin.css'; // Import the CSS file

function SidebarAdmin() {
  return (
    <div className="side-menu-ad">
      <Menu>
        <div className="icon-ad">
          <img src="../logo-final.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label-ad">Face ID</p>
        </div>
        <MenuItem className="menu-item-ad" href="/admin" icon={<div className='icon-ad'><UserRound /></div>}>
          <p className="title-ad">Thông tin cá nhân</p>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/admin/tai-khoan-sv" icon={<div className='icon-ad'><ContactRound /></div>}>
          <p className="title-ad">Tài khoản sinh viên</p>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/admin/tai-khoan-gv" icon={<div className='icon-ad'><ContactRound /></div>}>
          <p className="title-ad">Tài khoản giảng viên</p>
        </MenuItem>
        <SubMenu label={<p className="title-ad">Tạo tài khoản</p>} icon={<div className="icon-ad"><UsersRound /></div>}>
          <div className="sub-menu-bar-ad">
            <MenuItem className="menu-item-ad" href="/admin/tao-tk-gv" icon={<div className='icon-ad'><UserRoundPlus /></div>}>
              <p className="title-ad">Giảng viên</p>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-tk-sv" icon={<div className='icon-ad'><UserRoundPlus /></div>}>
              <p className="title-ad">Sinh viên</p>
            </MenuItem>
          </div>
        </SubMenu>
        <SubMenu label={<p className="title-ad">Tạo</p>} icon={<div className="icon-ad"><FolderPlus /></div>}>
          <div className="sub-menu-bar-ad">
            <MenuItem className="menu-item-ad" href="/admin/tao-khoa" icon={<div className='icon-ad'><CircleFadingPlus /></div>}>
              <p className="title-ad">Khoa</p>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-nganh" icon={<div className='icon-ad'><CircleFadingPlus /></div>}>
              <p className="title-ad">Ngành</p>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-lop" icon={<div className='icon-ad'><CircleFadingPlus /></div>}>
              <p className="title-ad">Lớp</p>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-mon" icon={<div className='icon-ad'><CircleFadingPlus /></div>}>
              <p className="title-ad">Môn</p>
            </MenuItem>
          </div>
        </SubMenu>
        <MenuItem className="menu-item-ad" href="/admin/chon-mon" icon={<div className='icon-ad'><ScanFace /></div>}>
          <p className="title-ad">Điểm danh</p>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/" icon={<div className='icon-ad'><LogOut /></div>}>
          <p className="title-ad">Đăng xuất</p>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SidebarAdmin;