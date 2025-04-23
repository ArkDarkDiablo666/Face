import React, { useState } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './TaoKhoa.css'; // Import the CSS file

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
        <SidebarAdmin />
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
