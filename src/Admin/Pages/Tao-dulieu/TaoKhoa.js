import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoKhoa.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus } from 'lucide-react';

function TaoKhoa() {
  const [makhoa, setMakhoa] = useState('');  // Declare state for 'makhoa'
  const [tenkhoa, setTenkhoa] = useState('');  // Declare state for 'tenkhoa'

  const handleSubmit = async () => {
    // Kiểm tra nếu ô nhập trống
    if (!makhoa.trim() || !tenkhoa.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin Mã khoa và Tên khoa.');
      return;
    }

    // Kiểm tra mã khoa
    if (makhoa.trim().startsWith(' ')) {
      alert('Mã khoa không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (/[\s]/.test(makhoa.trim())) {
      alert('Mã khoa không chứa khoảng cách.');
      return;
    }
    if (/[^A-Za-z0-9]/.test(makhoa.trim())) {
      alert('Mã khoa không chứa kí tự đặc biệt.');
      return;
    }

    // Kiểm tra tên khoa
    const tenKhoaPattern = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    if (tenkhoa.trim().startsWith(' ')) {
      alert('Tên khoa không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (!tenKhoaPattern.test(tenkhoa.trim())) {
      alert('Tên khoa không chứa kí tự đặc biệt ngoài các ký tự chữ, số và dấu cách.');
      return;
    }

    const data = {
      makhoa: makhoa.trim(),
      tenkhoa: tenkhoa.trim().replace(/\s{2,}/g, ' ')
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/object/tao-khoa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Tạo khoa thành công!');
        setMakhoa('');
        setTenkhoa('');
        // Xử lý thêm nếu cần
      } else {
        alert(result.error || 'Có lỗi xảy ra khi tạo khoa');
      }
    } catch (error) {
      alert('Lỗi kết nối tới server');
      console.error('Error:', error);
    }
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
                    <p className="title-main">Khoa</p>
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
        <div className="content">
          <h1>Tạo Khoa</h1>
          <div className="form-mot">
            <p className="chu">Mã khoa mới:</p>
            <input
              className="input-tao"
              type="text"
              value={makhoa}
              onChange={(e) => setMakhoa(e.target.value)} // Liên kết giá trị nhập với state
            />
            <p className="chu">Tên khoa mới:</p>
            <input
              className="input-tao"
              type="text"
              value={tenkhoa}
              onChange={(e) => setTenkhoa(e.target.value)} // Liên kết giá trị nhập với state
            />
          </div>
          <div className="button-form-mot">
            <button className="button-tao" onClick={handleSubmit}>  {/* Gọi handleSubmit khi người dùng nhấn nút */}
              Tạo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoKhoa;
