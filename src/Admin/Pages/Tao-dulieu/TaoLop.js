import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoLop.css';
import {
  House, UserRound, ScanFace, UserRoundPlus,
  ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus
} from 'lucide-react';

function TaoLop() {
  const [malop, setMaLop] = useState('');
  const [tenlop, setTenLop] = useState('');
  const [manganh, setMaNganh] = useState('');
  const [danhSachNganh, setDanhSachNganh] = useState([]);
  const [thongbao, setThongBao] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/object/danh-sach-nganh/')
      .then(res => {
        setDanhSachNganh(res.data);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách ngành:', err);
      });
  }, []);

  const handleTaoLop = () => {
    setThongBao('');
    axios.post('http://localhost:8000/tao-lop/', {
      malop: malop.trim(),
      tenlop: tenlop.trim(),
      manganh: manganh
    })
    .then(res => {
      setThongBao(res.data.message || 'Tạo lớp thành công!');
      setMaLop('');
      setTenLop('');
      setMaNganh('');
    })
    .catch(err => {
      const loi = err.response?.data?.error || 'Có lỗi xảy ra khi tạo lớp.';
      setThongBao(loi);
    });
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
            <MenuItem className="menu-item" href="/admin"><div className="icon"><House /><p className="title">Trang chủ</p></div></MenuItem>
            <MenuItem className="menu-item" href="/admin/trang-ca-nhan"><div className="icon"><UserRound /><p className="title">Thông tin cá nhân</p></div></MenuItem>
            <MenuItem className="menu-item" href="/admin/tai-khoan"><div className="icon"><ContactRound /><p className="title">Danh sách tài khoản</p></div></MenuItem>
            <SubMenu label={<p className="title">Tạo tài khoản</p>} icon={<div className="icon"><UsersRound /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-tk-gv"><div className="icon"><UserRoundPlus /><p className="title">Giáo viên</p></div></MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-tk-sv"><div className="icon"><UserRoundPlus /><p className="title">Sinh viên</p></div></MenuItem>
              </div>
            </SubMenu>
            <SubMenu label={<p className="title">Tạo</p>} icon={<div className="icon"><FolderPlus /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-khoa"><div className="icon"><CircleFadingPlus /><p className="title">Khoa</p></div></MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-nganh"><div className="icon"><CircleFadingPlus /><p className="title">Ngành</p></div></MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-lop"><div className="icon"><CircleFadingPlus /><p className="title-main">Lớp</p></div></MenuItem>
              </div>
            </SubMenu>
            <MenuItem className="menu-item" href="/admin/diem-danh"><div className="icon"><ScanFace /><p className="title">Điểm danh</p></div></MenuItem>
            <MenuItem className="menu-item" href="/dangnhap"><div className="icon"><LogOut /><p className="title">Đăng xuất</p></div></MenuItem>
          </Menu>
        </div>

        <div className="content">
          <h1>Tạo Lớp</h1>
          <div className="form-mot">
            <p className="chu">Mã lớp mới:</p>
            <input className="input-tao" type="text" value={malop} onChange={(e) => setMaLop(e.target.value)} />

            <p className="chu">Tên lớp mới:</p>
            <input className="input-tao" type="text" value={tenlop} onChange={(e) => setTenLop(e.target.value)} />

            <p className="chu">Thuộc ngành:</p>
            <select className="input-tao" value={manganh} onChange={(e) => setMaNganh(e.target.value)}>
              <option value="">-- Chọn ngành --</option>
              {danhSachNganh.map((nganh) => (
                <option key={nganh.manganh} value={nganh.manganh}>
                  {nganh.manganh}
                </option>
              ))}
            </select>
          </div>
          <div className="button-form-mot">
            <button className="button-tao" onClick={handleTaoLop}>Tạo</button>
          </div>
          {thongbao && <p className="thong-bao">{thongbao}</p>}
        </div>
      </div>
    </div>
  );
}

export default TaoLop;
