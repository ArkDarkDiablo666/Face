import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './TaoLop.css';


function TaoLop() {
  const [malop, setMaLop] = useState('');
  const [tenlop, setTenLop] = useState('');
  const [manganh, setMaNganh] = useState('');
  const [danhSachNganh, setDanhSachNganh] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/object/danh-sach-nganh/')
      .then(res => res.json())
      .then(data => {
        setDanhSachNganh(data);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách ngành:', err);
        alert('Không thể tải danh sách ngành.');
      });
  }, []);

  const validateInput = () => {
    const regexMa = /^[A-Za-z0-9]+$/;
    const regexTen = /^[^\s][\p{L}\p{N}\s]+$/u;

    if (!malop || !regexMa.test(malop)) {
      alert('Mã lớp không hợp lệ. Không được chứa ký tự đặc biệt hoặc để trống.');
      return false;
    }
    if (!tenlop || !regexTen.test(tenlop)) {
      alert('Tên lớp không hợp lệ. Không được để trống hoặc bắt đầu bằng khoảng trắng.');
      return false;
    }
    if (!manganh) {
      alert('Vui lòng chọn ngành.');
      return false;
    }
    return true;
  };

  const handleTaoLop = () => {
    if (!validateInput()) return;

    setLoading(true);

    fetch('http://127.0.0.1:8000/object/tao-lop/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        malop: malop.trim(),
        tenlop: tenlop.trim(),
        manganh: manganh,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi khi tạo lớp.');
        alert(data.message || 'Tạo lớp thành công!');
        // reset form
        setMaLop('');
        setTenLop('');
        setMaNganh('');
      })
      .catch(err => {
        alert(err.message || 'Có lỗi xảy ra khi tạo lớp.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
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
            <button className="button-tao" onClick={handleTaoLop} disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoLop;
