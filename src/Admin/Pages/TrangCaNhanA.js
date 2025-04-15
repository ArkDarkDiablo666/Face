import React from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TrangCaNhanA.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus } from 'lucide-react';

function TrangCaNhanA() {
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
                <p className="title-main">Thông tin cá nhân</p>
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
          <h1>TrangCaNhanA</h1>
          <div className='line'></div>
          <div className='form-ca-nhan'>
            <div className='form-thong-tin'>
              <img src="/ayato.png" alt="Logo" className='avatar' />
            </div>
            <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Mã giáo viên: </p>
                  <p className='chu-thong-tin'>CNTT000001</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Khoa: </p>
                  <p className='chu-thong-tin'>Công nghệ thông tin</p>
                </div>
              </div>
              <div className='form-thong-tin'>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Họ tên: </p>
                  <p className='chu-thong-tin'>Ayato Kamisato</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Giới tính: </p>
                  <p className='chu-thong-tin'>Nam</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Ngày sinh: </p>
                  <p className='chu-thong-tin'>26 tháng 3 năm 1998</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Số điện thoại: </p>
                  <p className='chu-thong-tin'>0123456789</p>
                </div>
                <div className='form-chu'>
                  <p className='chu-ca-nhan'>Email: </p>
                  <p className='chu-thong-tin'>ayatokamisato@teacher.ctuet.edu.vn</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrangCaNhanA;