import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './TaoTkGv.css';


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
        <SidebarAdmin />
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