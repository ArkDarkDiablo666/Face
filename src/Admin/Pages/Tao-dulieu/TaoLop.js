import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import '../../../TrangCaNhan.css'; 

function TaoTkLop() {
  const [lopCode, setLopCode] = useState('');
  const [lopName, setLopName] = useState('');
  const [facultyCode, setFacultyCode] = useState('');
  const [nganhCode, setNganhCode] = useState('');
  const [khoaList, setKhoaList] = useState([]);
  const [nganhList, setNganhList] = useState([]);

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

  // Khi chọn khoa → lấy ngành tương ứng
  useEffect(() => {
    if (facultyCode) {
      const fetchNganhList = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-nganh-theo-khoa/?makhoa=${facultyCode}`);
          const data = await response.json();
          setNganhList(data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách ngành:', error);
        }
      };
      fetchNganhList();
    } else {
      setNganhList([]);
    }
  }, [facultyCode]);

  const handleSubmit = async () => {
    if (!lopCode || !lopName || !nganhCode) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const formData = {
      malop: lopCode,
      tenlop: lopName,
      manganh: nganhCode
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/object/tao-lop/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Thông tin lớp:', formData);
        console.error('Lỗi từ server:', errorData);
        alert(`Lỗi: ${errorData.error}`);
      }

      if (response.status === 201) {
        alert("Tạo lớp thành công!");
        setLopCode('');
        setLopName('');
        setFacultyCode('');
        setNganhCode('');
      } else {
        alert("Tạo lớp thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API tạo lớp:", err);
      alert("Lỗi kết nối đến server.");
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-tk">
          <h1>Tạo lớp</h1>
          <div className="form-tao-tk">
            <div className="form-trai">
              <p className="chu">Mã lớp: </p>
              <input className="input-tao" type="text" value={lopCode} onChange={(e) => setLopCode(e.target.value)} />
              <p className="chu">Tên lớp: </p>
              <input className="input-tao" type="text" value={lopName} onChange={(e) => setLopName(e.target.value)} />
              <p className="chu">Mã khoa: </p>
              <select className="input-tao" value={facultyCode} onChange={(e) => setFacultyCode(e.target.value)}>
                <option value="">-- Chọn khoa --</option>
                {khoaList.map((khoa) => (
                  <option key={khoa.makhoa} value={khoa.makhoa}>{khoa.makhoa}</option>
                ))}
              </select>
              <p className="chu">Mã ngành: </p>
              <select className="input-tao" value={nganhCode} onChange={(e) => setNganhCode(e.target.value)}>
                <option value="">-- Chọn ngành --</option>
                {nganhList.map((nganh) => (
                  <option key={nganh.manganh} value={nganh.manganh}>{nganh.manganh}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="button-form">
            <button className="button" onClick={handleSubmit}>
              <span>Tạo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoTkLop;
