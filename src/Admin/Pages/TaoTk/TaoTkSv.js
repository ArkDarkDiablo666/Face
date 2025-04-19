import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaoTkSv.css';
import {
  House, UserRound, ScanFace, UserRoundPlus, ContactRound,
  UsersRound, LogOut, CircleFadingPlus, FolderPlus
} from 'lucide-react';

function TaoTkSv() {
  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [khoaList, setKhoaList] = useState([]);
  const [nganhList, setNganhList] = useState([]);
  const [lopList, setLopList] = useState([]);
  const [nganh, setNganh] = useState('');
  const [lop, setLop] = useState('');

  // Lấy danh sách khoa
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

  // Khi chọn khoa → lấy ngành tương ứng và reset ngành + lớp
  useEffect(() => {
    if (facultyCode) {
      const fetchNganhList = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-nganh-theo-khoa/?makhoa=${facultyCode}`);
          const data = await response.json();
          setNganhList(data);
          setNganh('');
          setLopList([]);
          setLop('');
        } catch (error) {
          console.error('Lỗi khi lấy danh sách ngành:', error);
        }
      };
      fetchNganhList();
    } else {
      setNganhList([]);
      setNganh('');
      setLopList([]);
      setLop('');
    }
  }, [facultyCode]);

  // Khi chọn ngành → lấy lớp tương ứng và reset lớp
  useEffect(() => {
    if (nganh) {
      const fetchClassList = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-lop-theo-nganh/?manganh=${nganh}`);
          const data = await response.json();
          setLopList(data);
          setLop('');
        } catch (error) {
          console.error('Lỗi khi lấy danh sách lớp:', error);
        }
      };
      fetchClassList();
    } else {
      setLopList([]);
      setLop('');
    }
  }, [nganh]);

  const handleSubmit = async () => {
    if (!fullName || !gender || !dob || !phone || !facultyCode || !email || !password || !nganh || !lop) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
  
    const nameRegex = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    if (!nameRegex.test(fullName)) {
      alert('Họ tên sinh viên không hợp lệ.');
      return;
    }
  
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      alert('Sinh viên phải đủ 22 tuổi');
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
  
    // Chỉnh sửa thứ tự dữ liệu trước khi gửi
    const formData = {
      hoten: fullName,
      gioitinh: gender,
      ngaysinh: dob,
      sdt: phone,
      email: email,
      matkhau: password,
      makhoa: facultyCode,
      manganh: nganh,
      malop: lop
    };
    console.log("FormData trước khi gửi:", JSON.stringify(formData));
  
    try {
      const response = await fetch("http://127.0.0.1:8000/object/tao-sinh-vien/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Thông tin sinh viên:', formData);
        console.error('Lỗi từ server:', errorData);
        alert(`Lỗi: ${errorData.error}`);
      }
  
      if (response.status === 201) {
        alert("Tạo tài khoản sinh viên thành công!");
        setFullName('');
        setGender('');
        setDob('');
        setPhone('');
        setFacultyCode('');
        setEmail('');
        setPassword('');
        setNganh('');
        setLop('');
      } else {
        alert("Tạo tài khoản sinh viên thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API tạo sinh viên:", err);
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
                  <div className="icon"><UserRoundPlus /><p className="title">Giáo viên</p></div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-tk-sv">
                  <div className="icon"><UserRoundPlus /><p className="title-main">Sinh viên</p></div>
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
          <h1>Tạo tài khoản sinh viên</h1>
          <div className='form-tao-tk'>
            <div className='form-trai'>
              <p className='chu'>Họ tên sinh viên: </p>
              <input className='input-tao' type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="new-password"/>
              <p className='chu'>Giới tính: </p>
              <div className='radio-group'>
                <label><input type='radio' value='Nam' checked={gender === 'Nam'} onChange={(e) => setGender(e.target.value)} /> Nam</label>
                <label><input type='radio' value='Nữ' checked={gender === 'Nữ'} onChange={(e) => setGender(e.target.value)} /> Nữ</label>
              </div>
              <p className='chu'>Ngày sinh: </p>
              <input className='input-tao' type='date' value={dob} onChange={(e) => setDob(e.target.value)} />
              <p className='chu'>Số điện thoại: </p>
              <input className='input-tao' type='text' value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="new-password"/>
            </div>

            <div className='form-phai'>
              <p className='chu'>Mã khoa: </p>
              <select className="input-tao" value={facultyCode} onChange={(e) => setFacultyCode(e.target.value)}>
                <option value="">-- Chọn khoa --</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.makhoa} value={khoa.makhoa}>{khoa.makhoa}</option>
                ))}
              </select>
              <p className='chu'>Ngành: </p>
              <select className="input-tao" value={nganh} onChange={(e) => setNganh(e.target.value)}>
                <option value="">-- Chọn ngành --</option>
                {nganhList.map((nganh) => (
                  <option key={nganh.manganh} value={nganh.manganh}>{nganh.manganh}</option>
                ))}
              </select>
              <p className='chu'>Lớp: </p>
              <select className="input-tao" value={lop} onChange={(e) => setLop(e.target.value)}>
                <option value="">-- Chọn lớp --</option>
                {lopList.map((lop) => (
                  <option key={lop.malop} value={lop.malop}>{lop.malop}</option>
                ))}
              </select>
              <p className='chu'>Email: </p>
              <input className='input-tao' type='email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="new-password"/>
              <p className='chu'>Mật khẩu: </p>
              <input className='input-tao' type='password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"/>
            </div>
          </div>
          <div className='button-form'>
            <button className='button-tao' onClick={handleSubmit}>Tạo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoTkSv;
