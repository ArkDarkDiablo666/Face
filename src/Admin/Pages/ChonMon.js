import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../SidebarAdmin';
import '../../TrangCaNhan.css'; 

function ChonMon() {
  const navigate = useNavigate();
  const [makhoa, setMaKhoa] = useState('');
  const [manganh, setMaNganh] = useState('');
  const [malop, setMaLop] = useState('');
  const [mamon, setMaMon] = useState('');
  const [danhSachKhoa, setDanhSachKhoa] = useState([]);
  const [danhSachNganh, setDanhSachNganh] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDanhSach, setLoadingDanhSach] = useState(false);
  const [maGiangVien, setMaGiangVien] = useState('');
  const [ngayDiemDanh, setNgayDiemDanh] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    // Lấy thông tin giảng viên đăng nhập từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setMaGiangVien(userInfo.magiangvien || '');
    
    const fetchKhoaList = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/object/danh-sach-khoa/');
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        setDanhSachKhoa(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khoa:', error);
        alert('Không thể tải danh sách khoa!');
      } finally {
        setLoading(false);
      }
    };
    fetchKhoaList();
  }, []);

  useEffect(() => {
    const fetchNganhList = async () => {
      if (!makhoa) {
        setDanhSachNganh([]);
        setMaNganh('');
        setDanhSachLop([]);
        setMaLop('');
        setDanhSachMon([]);
        setMaMon('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-nganh-theo-khoa/?makhoa=${makhoa}`);
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        setDanhSachNganh(data);
        setMaNganh('');
        setDanhSachLop([]);
        setMaLop('');
        setDanhSachMon([]);
        setMaMon('');
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ngành:', error);
        alert('Không thể tải danh sách ngành!');
      } finally {
        setLoading(false);
      }
    };
    fetchNganhList();
  }, [makhoa]);

  useEffect(() => {
    const fetchLopList = async () => {
      if (!manganh) {
        setDanhSachLop([]);
        setMaLop('');
        setDanhSachMon([]);
        setMaMon('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-lop-theo-nganh/?manganh=${manganh}`);
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        setDanhSachLop(data);
        setMaLop('');
        setDanhSachMon([]);
        setMaMon('');
      } catch (error) {
        console.error('Lỗi khi lấy danh sách lớp:', error);
        alert('Không thể tải danh sách lớp!');
      } finally {
        setLoading(false);
      }
    };
    fetchLopList();
  }, [manganh]);

  useEffect(() => {
    const fetchMonList = async () => {
      if (!malop) {
        setDanhSachMon([]);
        setMaMon('');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-mon-theo-lop/?malop=${malop}`);
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        setDanhSachMon(data.data || []);
        setMaMon('');
      } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
        alert('Không thể tải danh sách môn học!');
      } finally {
        setLoading(false);
      }
    };
    fetchMonList();
  }, [malop]);

  const handleDiemDanh = async () => {
    if (!makhoa || !manganh || !malop || !mamon) {
      alert('Vui lòng chọn đầy đủ thông tin trước khi tiếp tục!');
      return;
    }
    setLoadingDanhSach(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-sinh-vien-theo-lop/?malop=${malop}`);
      if (!response.ok) throw new Error('Không thể kết nối tới server!');
      const data = await response.json();
      
      // Tìm thông tin môn học được chọn
      const selectedMon = danhSachMon.find(mon => mon.mamon === mamon);
      
      const thongTinDiemDanh = {
        danhSachSinhVien: data.data || data,
        tenLop: danhSachLop.find(lop => lop.malop === malop)?.tenlop || malop,
        maMon: mamon,
        tenMon: selectedMon?.tenmon || mamon,
        ngayDiemDanh: ngayDiemDanh,
        maLop: malop,
        maGiangVien: maGiangVien || selectedMon?.magiangvien
      };

      sessionStorage.setItem("malop", malop);  // Lưu mã
      sessionStorage.setItem('thongTinDiemDanh', JSON.stringify(thongTinDiemDanh));
      navigate('/admin/diem-danh-a');
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      alert('Không thể tải danh sách sinh viên!');
    } finally {
      setLoadingDanhSach(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-tk">
          <h1>Điểm danh lớp học</h1>
          <div className="form-combobox">
            <div>
              <p className='chu-ca-nhan'>Khoa:</p>
              <select className="combobox" value={makhoa} onChange={(e) => setMaKhoa(e.target.value)} disabled={loading}>
                <option value="">-- Chọn khoa --</option>
                {danhSachKhoa.map((khoa) => (
                  <option key={khoa.makhoa} value={khoa.makhoa}>
                    {khoa.tenkhoa || khoa.makhoa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className='chu-ca-nhan'>Ngành:</p>
              <select className="combobox" value={manganh} onChange={(e) => setMaNganh(e.target.value)} disabled={loading || !makhoa}>
                <option value="">-- Chọn ngành --</option>
                {danhSachNganh.map((nganh) => (
                  <option key={nganh.manganh} value={nganh.manganh}>
                    {nganh.tennganh || nganh.manganh}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className='chu-ca-nhan'>Lớp:</p>
              <select className="combobox" value={malop} onChange={(e) => setMaLop(e.target.value)} disabled={loading || !manganh}>
                <option value="">-- Chọn lớp --</option>
                {danhSachLop.map((lop) => (
                  <option key={lop.malop} value={lop.malop}>
                    {lop.tenlop || lop.malop}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="chu-ca-nhan">Môn học:</p>
              <select className="combobox" value={mamon} onChange={(e) => setMaMon(e.target.value)} disabled={loading || !malop}>
                <option value="">-- Chọn môn --</option>
                {danhSachMon.map((mon) => (
                  <option key={mon.mamon} value={mon.mamon}>
                    {mon.tenmon} ({mon.magiangvien ? `GV: ${mon.magiangvien}` : ''})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="chu-ca-nhan">Ngày điểm danh:</p>
              <input
                type="date"
                className="combobox"
                value={ngayDiemDanh}
                onChange={(e) => setNgayDiemDanh(e.target.value)}
              />
            </div>
          </div>
            <button className="button" onClick={handleDiemDanh} 
            disabled={loading || !makhoa || !manganh || !malop || !mamon}
            style={{width : '200px'}}>
              <span>{loadingDanhSach ? 'Đang tải...' : 'Điểm Danh'}</span>
            </button>
        </div>
      </div>
    </div>
  );
}

export default ChonMon;