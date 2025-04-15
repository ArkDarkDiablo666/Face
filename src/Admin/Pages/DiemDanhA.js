import React from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './DiemDanhA.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus } from 'lucide-react';

function DiemDanhA() {
  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <div className="side-menu">
          <Menu>
            <div className="icon">
              <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
              <p className="label">Face ID</p>
            </div>
            <MenuItem className="menu-item" href="/admin">
              <div className="icon">
                <House />
                <p className="title">Trang chủ</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/trang-ca-nhan">
              <div className="icon">
                <UserRound />
                <p className="title">Thông tin cá nhân</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/tai-khoan">
              <div className="icon">
                <ContactRound />
                <p className="title">Danh sách tài khoản</p>
              </div>
            </MenuItem>
            <SubMenu label={<p className="title">Tạo tài khoản</p>} icon={<div className="icon"><UsersRound /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-tk-gv">
                  <div className="icon">
                    <UserRoundPlus />
                    <p className="title">Giáo viên</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-tk-sv">
                  <div className="icon">
                    <UserRoundPlus />
                    <p className="title">Sinh viên</p>
                  </div>
                </MenuItem>
              </div>
            </SubMenu>
            <SubMenu label={<p className="title">Tạo</p>} icon={<div className="icon"><FolderPlus /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-khoa">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Khoa</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-nganh">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Ngành</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-lop">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Lớp</p>
                  </div>
                </MenuItem>
              </div>
            </SubMenu>
            <MenuItem className="menu-item" href="/admin/diem-danh">
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
          <h1>DiemDanhA</h1>
        </div>
      </div>
    </div>
  );
}

export default DiemDanhA;