import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../SidebarAdmin';
import './Tao-dulieu.css';

function TaoMon() {
  const [tenmon, setTenMon] = useState('');
  const [makhoa, setMaKhoa] = useState('');  // Khoa của giảng viên
  const [makhoaLop, setMaKhoaLop] = useState('');  // Khoa của lớp
  const [manganh, setMaNganh] = useState('');
  const [malop, setMaLop] = useState('');
  const [magiangvien, setMaGiangVien] = useState('');
  const [danhSachKhoa, setDanhSachKhoa] = useState([]);
  const [danhSachNganh, setDanhSachNganh] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachGiangVien, setDanhSachGiangVien] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách khoa
  useEffect(() => {
    fetch('http://127.0.0.1:8000/object/danh-sach-khoa/')
      .then(res => res.json())
      .then(data => setDanhSachKhoa(data))
      .catch(err => {
        console.error('Lỗi khi lấy danh sách khoa:', err);
        alert('Không thể tải danh sách khoa.');
      });
  }, []);

  // Khi chọn khoa giảng viên, lấy danh sách ngành và giảng viên
  useEffect(() => {
    if (makhoa) {
      fetch(`http://127.0.0.1:8000/object/danh-sach-nganh-theo-khoa/?makhoa=${makhoa}`)
        .then(res => res.json())
        .then(data => setDanhSachNganh(data))
        .catch(err => console.error('Lỗi khi lấy danh sách ngành:', err));

      fetch(`http://127.0.0.1:8000/object/danh-sach-giang-vien-theo-khoa/?makhoa=${makhoa}`)
        .then(res => res.json())
        .then(data => setDanhSachGiangVien(data))
        .catch(err => {
          console.error('Lỗi khi lấy danh sách giảng viên:', err);
          setDanhSachGiangVien([]);
        });
    } else {
      setDanhSachNganh([]);
      setDanhSachGiangVien([]);
    }
  }, [makhoa]);

  // Khi chọn ngành, lấy danh sách lớp
  useEffect(() => {
    if (manganh) {
      fetch(`http://127.0.0.1:8000/object/danh-sach-lop-theo-nganh/?manganh=${manganh}`)
        .then(res => res.json())
        .then(data => setDanhSachLop(data))
        .catch(err => console.error('Lỗi khi lấy danh sách lớp:', err));
    } else {
      setDanhSachLop([]);
    }
  }, [manganh]); 

  // Kiểm tra dữ liệu nhập
  const validateInput = () => {
    const regexTen = /^[A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;


    if (!tenmon || !regexTen.test(tenmon)) {
      alert('Tên môn không hợp lệ. Không được để trống hoặc bắt đầu bằng khoảng trắng.');
      return false;
    }
    if (!makhoa) {
      alert('Vui lòng chọn khoa của giảng viên.');
      return false;
    }
    if (!magiangvien) {
      alert('Vui lòng chọn giảng viên.');
      return false;
    }
    if (!makhoaLop) {
      alert('Vui lòng chọn khoa của lớp.');
      return false;
    }
    if (!manganh) {
      alert('Vui lòng chọn ngành.');
      return false;
    }
    if (!malop) {
      alert('Vui lòng chọn lớp.');
      return false;
    }
    return true;
  };

  const handleTaoMon = () => {
    if (!validateInput()) return;

    setLoading(true);

    fetch('http://127.0.0.1:8000/object/tao-mon-hoc/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenmon: tenmon.trim(),
        malop: malop,
        magiangvien: magiangvien,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi khi tạo môn học.');
        alert(data.message || 'Tạo môn học thành công!');
        setTenMon('');
        setMaLop('');
        setMaGiangVien('');
        setMaKhoa('');
        setMaKhoaLop('');
        setMaNganh('');
      })
      .catch(err => {
        alert(err.message || 'Có lỗi xảy ra khi tạo môn học.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content">
          <h1>Tạo Môn Học</h1>
          <div className="form-tao">
            <div className="form-trai">
              <p className="chu">Tên môn học:</p>
              <input
                className="input-tao"
                type="text"
                value={tenmon}
                onChange={(e) => setTenMon(e.target.value)}
              />

              <p className="chu">Khoa của Giảng viên:</p>
              <select
                className="input-tao"
                value={makhoa}
                onChange={(e) => setMaKhoa(e.target.value)}
              >
                <option value="">-- Chọn khoa --</option>
                {danhSachKhoa.map((khoa) => (
                  <option key={khoa.makhoa} value={khoa.makhoa}>
                    {khoa.makhoa}
                  </option>
                ))}
              </select>

              <p className="chu">Giảng viên phụ trách:</p>
              <select
                className="input-tao"
                value={magiangvien}
                onChange={(e) => setMaGiangVien(e.target.value)}
              >
                <option value="">-- Chọn giảng viên --</option>
                {danhSachGiangVien.map((gv) => (
                  <option key={gv.magiangvien} value={gv.magiangvien}>
                    {gv.tengv} {gv.magiangvien}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-phai">
              <p className="chu">Khoa của lớp:</p>
              <select
                className="input-tao"
                value={makhoaLop}
                onChange={(e) => setMaKhoaLop(e.target.value)}
              >
                <option value="">-- Chọn khoa --</option>
                {danhSachKhoa.map((khoa) => (
                  <option key={khoa.makhoa} value={khoa.makhoa}>
                    {khoa.makhoa}
                  </option>
                ))}
              </select>

              <p className="chu">Ngành học:</p>
              <select
                className="input-tao"
                value={manganh}
                onChange={(e) => setMaNganh(e.target.value)}
              >
                <option value="">-- Chọn ngành --</option>
                {danhSachNganh.map((nganh) => (
                  <option key={nganh.manganh} value={nganh.manganh}>
                    {nganh.manganh}
                  </option>
                ))}
              </select>

              <p className="chu">Mã lớp:</p>
              <select
                className="input-tao"
                value={malop}
                onChange={(e) => setMaLop(e.target.value)}
              >
                <option value="">-- Chọn lớp --</option>
                {danhSachLop.map((lop) => (
                  <option key={lop.malop} value={lop.malop}>
                    {lop.malop}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-form">
            <button className="button-tao" onClick={handleTaoMon} disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaoMon;