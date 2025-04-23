import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './TaoNganh.css'; // Import the CSS file


function TaoNganh() {
  const [manganh, setManganh] = useState('');
  const [tennganh, setTennganh] = useState('');
  const [khoaList, setKhoaList] = useState([]);
  const [selectedKhoa, setSelectedKhoa] = useState('');
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
      alert('Vui lòng nhập đầy đủ thông tin và chọn khoa.');
      return;
    }

    // Kiểm tra mã ngành
    if (manganh.trim().startsWith(' ')) {
      alert('Mã ngành không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (/[\s]/.test(manganh.trim())) {
      alert('Mã ngành không chứa khoảng cách.');
      return;
    }
    if (/[^A-Za-z0-9]/.test(manganh.trim())) {
      alert('Mã ngành không chứa kí tự đặc biệt.');
      return;
    }

    // Kiểm tra tên ngành
    const tenNganhPattern = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    if (tennganh.trim().startsWith(' ')) {
      alert('Tên ngành không được bắt đầu bằng khoảng trắng.');
      return;
    }
    if (!tenNganhPattern.test(tennganh.trim())) {
      alert('Tên ngành không chứa kí tự đặc biệt ngoài các ký tự chữ, số và dấu cách.');
      return;
    }

    const data = {
      manganh: manganh.trim(),
      tennganh: tennganh.trim().replace(/\s{2,}/g, ' '),
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
      } else {
        alert(result.error || 'Có lỗi xảy ra khi tạo ngành');
      }
    } catch (error) {
      alert('Lỗi kết nối đến server');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Đặt trạng thái loading là false khi hoàn tất
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content">
          <h1>Tạo Ngành</h1>
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
            <p className='chu'>Mã khoa:</p>
            <select
              className='input-tao'
              value={selectedKhoa}
              onChange={(e) => setSelectedKhoa(e.target.value)}
            >
              <option className='input-tao-' value="">-- Chọn khoa --</option>
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
