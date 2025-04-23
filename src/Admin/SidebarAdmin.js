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
          <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
          <p className="label-ad">Face ID</p>
        </div>
        <MenuItem className="menu-item-ad" href="/admin">
          <div className="icon-ad">
            <UserRound />
            <p className="title-ad">Thông tin cá nhân</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/admin/tai-khoan-sv">
          <div className="icon-ad">
            <ContactRound />
            <p className="title-ad">Tài khoản sinh viên</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/admin/tai-khoan-gv">
          <div className="icon-ad">
            <ContactRound />
            <p className="title-ad">Tài khoản giảng viên</p>
          </div>
        </MenuItem>
        <SubMenu label={<p className="title-ad">Tạo tài khoản</p>} icon={<div className="icon"><UsersRound /></div>}>
          <div className="sub-menu-bar-ad">
            <MenuItem className="menu-item-ad" href="/admin/tao-tk-gv">
              <div className="icon-ad">
                <UserRoundPlus />
                <p className="title-ad">Giảng viên</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-tk-sv">
              <div className="icon-ad">
                <UserRoundPlus />
                <p className="title-ad">Sinh viên</p>
              </div>
            </MenuItem>
          </div>
        </SubMenu>
        <SubMenu label={<p className="title-ad">Tạo</p>} icon={<div className="icon"><FolderPlus /></div>}>
          <div className="sub-menu-bar-ad">
            <MenuItem className="menu-item-ad" href="/admin/tao-khoa">
              <div className="icon-ad">
                <CircleFadingPlus />
                <p className="title-ad">Khoa</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-nganh">
              <div className="icon-ad">
                <CircleFadingPlus />
                <p className="title-ad">Ngành</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-lop">
              <div className="icon-ad">
                <CircleFadingPlus />
                <p className="title-ad">Lớp</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item-ad" href="/admin/tao-mon">
              <div className="icon-ad">
                <CircleFadingPlus />
                <p className="title-ad">Môn</p>
              </div>
            </MenuItem>
          </div>
        </SubMenu>
        <MenuItem className="menu-item-ad" href="/admin/chon-mon">
          <div className="icon-ad">
            <ScanFace />
            <p className="title-ad">Điểm danh</p>
          </div>
        </MenuItem>
        <MenuItem className="menu-item-ad" href="/dangnhap">
          <div className="icon-ad">
            <LogOut />
            <p className="title-ad">Đăng xuất</p>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SidebarAdmin;