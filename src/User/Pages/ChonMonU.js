import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate
import './DiemDanhU.css'; // Nhập file CSS
import SidebarAdmin from '../SidebarUser';

function ChonMon() {
  const [selectedMon, setSelectedMon] = useState('');
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleChange = (event) => {
    setSelectedMon(event.target.value);
  };

  const handleButtonClick = () => {
    if (selectedMon) { // Kiểm tra nếu có môn được chọn
      navigate('/user/diem-danh'); 
    } else {
      alert('Vui lòng chọn môn trước khi tiếp tục!'); // Thông báo nếu chưa chọn môn
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content">
          <h1>Chọn Môn</h1>
          <div className='form-combobox'>
            <select value={selectedMon} onChange={handleChange} className="combobox">
              <option value="">Chọn môn</option>
              <option value="toan">Toán</option>
              <option value="ly">Lý</option>
              <option value="hoa">Hóa</option>
              <option value="van">Văn</option>
              <option value="anh">Tiếng Anh</option>
            </select>
          </div>
          <button className='button-tao' onClick={handleButtonClick}>Chọn</button>
        </div>
      </div>
    </div>
  );
}

export default ChonMon;