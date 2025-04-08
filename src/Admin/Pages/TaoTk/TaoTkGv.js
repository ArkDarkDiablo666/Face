import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoTkGv.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut } from 'lucide-react';

function TaoTkGv() {
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

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
                    <p className="title-main">Giáo viên</p>
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
        <div className="content">
          <h1>TaoTkGv</h1>
          <div className='form-tao-tk'>
            <div className='form-trai'>
            <p className='chu'>Mã giáo viên: </p><input className='input-tao' type='text'></input>
              <p className='chu'>Giới tính: </p>
              <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  value='male'
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                />
                Nam
              </label>
              <label>
                <input
                  type='radio'
                  value='female'
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                />
                Nữ
              </label>
              </div>
              <p className='chu'>Ngày sinh: </p><input className='input-tao' type='date'></input>
              <p className='chu'>Số điện thoại: </p><input className='input-tao' type='text'></input>
              <p>Quyền: </p>
                <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    value='admin'
                    checked={role === 'admin'}
                    onChange={handleRoleChange}
                  />
                  Admin
                </label>
                <label>
                  <input
                    type='radio'
                    value='user'
                    checked={role === 'user'}
                    onChange={handleRoleChange}
                  />
                  User
                </label>
                </div>
            </div>
            <div className='content'>
              <p className='chu'>Họ tên giáo viên: </p><input className='input-tao' type='text'></input>
              <p>Mã khoa: </p><input className='input-tao' type='text'></input>
              <p>Email: </p><input className='input-tao' type='email'></input>
              <p>Mật khẩu: </p><input className='input-tao' type='password'></input>
            </div>
          </div>
          <div className='button-form'>
            <button className='button-tao'>Tạo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoTkGv;