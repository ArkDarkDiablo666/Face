import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoNganh.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut, CircleFadingPlus, FolderPlus } from 'lucide-react';

function TaoNganh() {
  const [manganh, setManganh] = useState('');
  const [tennganh, setTennganh] = useState('');
  const [khoaList, setKhoaList] = useState([]);
  const [selectedKhoa, setSelectedKhoa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Thêm state cho trạng thái loading

  useEffect(() => {
    // Gọi API để lấy danh sách khoa
    const fetchKhoaList = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/object/danh-sach-khoa/');
        const data = await response.json();
        setKhoaList(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khoa:', error);
      }
    };

    fetchKhoaList();
  }, []);

  const handleSubmit = async () => {
    // Kiểm tra thông tin nhập vào
    if (!manganh.trim() || !tennganh.trim() || !selectedKhoa) {
      setError('Vui lòng nhập đầy đủ thông tin và chọn khoa.');
      return;
    }

    // Kiểm tra mã ngành
    if (manganh.trim().startsWith(' ')) {
      setError('Mã ngành không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (/[\s]/.test(manganh.trim())) {
      setError('Mã ngành không chứa khoảng cách.');
      return;
    }
    if (/[^A-Za-z0-9]/.test(manganh.trim())) {
      setError('Mã ngành không chứa kí tự đặc biệt.');
      return;
    }

    // Kiểm tra tên ngành
    const tenNganhPattern = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    if (tennganh.trim().startsWith(' ')) {
      setError('Tên ngành không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (!tenNganhPattern.test(tennganh.trim())) {
      setError('Tên ngành không chứa kí tự đặc biệt ngoài các ký tự chữ, số và dấu cách.');
      return;
    }

    const data = {
      manganh: manganh.trim(),
      tennganh: tennganh.trim(),
      makhoa: selectedKhoa,  // Đây là mã khoa
    };
    console.log("Dữ liệu gửi đi:", data);

    setLoading(true); // Đặt trạng thái loading trước khi gửi dữ liệu
    try {
      const response = await fetch('http://127.0.0.1:8000/object/tao-nganh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Tạo ngành thành công!');
        setManganh('');
        setTennganh('');
        setSelectedKhoa('');
        setError('');
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tạo ngành');
      }
    } catch (error) {
      setError('Lỗi kết nối đến server');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Đặt trạng thái loading là false khi hoàn tất
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
                    <p className="title">Khoa</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-nganh">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title-main">Ngành</p>
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
          <h1>Tạo Ngành</h1>
          {/* Hiển thị thông báo lỗi ngay tại giao diện */}
          {error && <p className="error-message">{error}</p>} 

          <div className='form-mot'>
            <p className='chu'>Mã ngành mới:</p>
            <input
              className='input-tao'
              type='text'
              value={manganh}
              onChange={(e) => setManganh(e.target.value)}
            />
            <p className='chu'>Tên ngành mới:</p>
            <input
              className='input-tao'
              type='text'
              value={tennganh}
              onChange={(e) => setTennganh(e.target.value)}
            />
            <p className='chu'>Thuộc mã khoa:</p>
            <select
              className='input-tao'
              value={selectedKhoa}
              onChange={(e) => setSelectedKhoa(e.target.value)}
            >
              <option value="">-- Chọn khoa --</option>
              {khoaList.map((khoa) => (
                <option key={khoa.makhoa} value={khoa.makhoa}>
                  {khoa.makhoa}
                </option>
              ))}
            </select>
          </div>

          <div className='button-form-mot'>
            <button className='button-tao' onClick={handleSubmit} disabled={loading}>
              {loading ? 'Đang tạo ngành...' : 'Tạo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoNganh;
