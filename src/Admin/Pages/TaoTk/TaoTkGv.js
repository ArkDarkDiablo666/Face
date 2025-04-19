import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoTkGv.css';
import {
  House, UserRound, ScanFace, UserRoundPlus, ContactRound,
  UsersRound, LogOut, CircleFadingPlus, FolderPlus
} from 'lucide-react';

function TaoTkGv() {
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [khoaList, setKhoaList] = useState([]);

  useEffect(() => {
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
    if (!fullName || !gender || !dob || !phone || !facultyCode || !email || !password || !role) {
      alert('Vui lòng điền đầy đủ tất cả các thông tin.');
      return;
    }
    console.log('Email nhập vào:', email); 

    const nameRegex = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    if (!nameRegex.test(fullName)) {
      alert('Họ tên giáo viên không hợp lệ.');
      return;
    }

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 22) {
      alert('Giáo viên phải đủ 22 tuổi');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại phải có 10 chữ số');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert('Email phải có đuôi @gmail.com');
      return;
    }

    if (password.includes(' ')) {
      alert('Mật khẩu không được chứa khoảng trắng');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/object/tao-giao-vien/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hoten: fullName,
          gioitinh: gender,
          ngaysinh: dob,
          sdt: phone,
          email: email,
          matkhau: password,
          quyen: role,
          makhoa: facultyCode,
        })
      });

      if (response.ok) {
        alert("Tạo tài khoản thành công!");
        setFullName('');
        setGender('');
        setDob('');
        setPhone('');
        setRole('');
        setFacultyCode('');
        setEmail('');
        setPassword('');
      } else {
        const errorText = await response.text();  // Lấy nội dung lỗi từ server
        console.error("Lỗi chi tiết từ server:", errorText);
        alert(`Tạo tài khoản thất bại: ${errorText}`);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API tạo tài khoản:", err);
      alert("Lỗi kết nối đến server.");
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
              <div className="icon"><House /><p className="title">Trang chủ</p></div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/trang-ca-nhan">
              <div className="icon"><UserRound /><p className="title">Thông tin cá nhân</p></div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/tai-khoan">
              <div className="icon"><ContactRound /><p className="title">Danh sách tài khoản</p></div>
            </MenuItem>
            <SubMenu label={<p className="title">Tạo tài khoản</p>} icon={<div className="icon"><UsersRound /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-tk-gv">
                  <div className="icon"><UserRoundPlus /><p className="title-main">Giáo viên</p></div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-tk-sv">
                  <div className="icon"><UserRoundPlus /><p className="title">Sinh viên</p></div>
                </MenuItem>
              </div>
            </SubMenu>
            <SubMenu label={<p className="title">Tạo</p>} icon={<div className="icon"><FolderPlus /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-khoa">
                  <div className="icon"><CircleFadingPlus /><p className="title">Khoa</p></div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-nganh">
                  <div className="icon"><CircleFadingPlus /><p className="title">Ngành</p></div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-lop">
                  <div className="icon"><CircleFadingPlus /><p className="title">Lớp</p></div>
                </MenuItem>
              </div>
            </SubMenu>
            <MenuItem className="menu-item" href="/admin/diem-danh">
              <div className="icon"><ScanFace /><p className="title">Điểm danh</p></div>
            </MenuItem>
            <MenuItem className="menu-item" href="/dangnhap">
              <div className="icon"><LogOut /><p className="title">Đăng xuất</p></div>
            </MenuItem>
          </Menu>
        </div>

        <div className="content">
          <h1>Tạo tài khoản giáo viên</h1>
          {/* Input ẩn để ngăn tự động điền trên cả form */}
          <input type="text" style={{display: 'none'}} />
          <input type="password" style={{display: 'none'}} />
          <form autoComplete="off">
            <div className='form-tao-tk'>
              <div className='form-trai'>
                <p className='chu'>Họ tên giáo viên: </p>
                <div>
                  <input type="text" style={{display: 'none'}} />
                  <input 
                    className='input-tao' 
                    type='text' 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    autoComplete="new-password" 
                  />
                </div>
                <p className='chu'>Giới tính: </p>
                <div className='radio-group'>
                  <label><input type='radio' value='Nam' checked={gender === 'Nam'} onChange={(e) => setGender(e.target.value)} /> Nam</label>
                  <label><input type='radio' value='Nữ' checked={gender === 'Nữ'} onChange={(e) => setGender(e.target.value)} /> Nữ</label>
                </div>
                <p className='chu'>Ngày sinh: </p>
                <div>
                  <input type="date" style={{display: 'none'}} />
                  <input 
                    className='input-tao' 
                    type='date' 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    autoComplete="new-password" 
                  />
                </div>
                <p className='chu'>Số điện thoại: </p>
                <div>
                  <input type="tel" style={{display: 'none'}} />
                  <input 
                    className='input-tao' 
                    type='text' 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    autoComplete="new-password" 
                  />
                </div>
                <p>Quyền: </p>
                <div className='radio-group'>
                  <label><input type='radio' value='admin' checked={role === 'admin'} onChange={(e) => setRole(e.target.value)} /> Admin</label>
                  <label><input type='radio' value='user' checked={role === 'user'} onChange={(e) => setRole(e.target.value)} /> User</label>
                </div>
              </div>

              <div className='form-phai'>
                <p className='chu'>Mã khoa: </p>
                <div>
                  <select 
                    className="input-tao" 
                    value={facultyCode} 
                    onChange={(e) => setFacultyCode(e.target.value)}
                    autoComplete="new-password"
                  >
                    <option value="">-- Chọn khoa --</option>
                    {khoaList.map((khoa) => (
                      <option key={khoa.makhoa} value={khoa.makhoa}>
                        {khoa.makhoa}
                      </option>
                    ))}
                  </select>
                </div>
                <p className='chu'>Email: </p>
                <div>
                  <input type="email" style={{display: 'none'}} />
                  <input 
                    className='input-tao' 
                    type='email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    autoComplete="new-password" 
                  />
                </div>
                <p className='chu'>Mật khẩu: </p>
                <div>
                  <input type="password" style={{display: 'none'}} />
                  <input 
                    className='input-tao' 
                    type='password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    autoComplete="new-password" 
                  />
                </div>
              </div>
            </div>
          </form>
          <div className='button-form'>
            <button className='button-tao' onClick={handleSubmit}>Tạo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoTkGv;