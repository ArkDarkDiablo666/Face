import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../SidebarUser';
import '../../TrangCaNhan.css'; 

function ChonMon() {
  const navigate = useNavigate();
  const [malop, setMaLop] = useState('');
  const [mamon, setMaMon] = useState('');
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDanhSach, setLoadingDanhSach] = useState(false);
  const [maGiangVien, setMaGiangVien] = useState('');
  const [ngayDiemDanh, setNgayDiemDanh] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    // Lấy thông tin giảng viên đăng nhập từ sessionStorage
    const tendangnhap = sessionStorage.getItem('tendangnhap');
    setMaGiangVien(tendangnhap);
    
    if (!tendangnhap) {
      alert('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại!');
      navigate('/dangnhap');
      return;
    }
  }, [navigate]);

  // Fetch danh sách lớp khi maGiangVien thay đổi
  useEffect(() => {
    const fetchLopList = async () => {
      if (!maGiangVien) return;
      
      setLoading(true);
      try {
        // Lấy danh sách lớp mà giảng viên dạy thông qua API môn học theo giảng viên
        const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-mon-theo-giang-vien-theo-lop/?magiangvien=${maGiangVien}`);
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        
        if (data.success) {
          // Lọc ra các mã lớp duy nhất từ danh sách môn học
          const uniqueClasses = [];
          const uniqueClassIds = new Set();
          
          // Chỉ lấy mã lớp, không lấy tên lớp
          data.data.forEach(mon => {
            if (mon.malop && !uniqueClassIds.has(mon.malop)) {
              uniqueClassIds.add(mon.malop);
              uniqueClasses.push({
                malop: mon.malop
              });
            }
          });
          
          setDanhSachLop(uniqueClasses);
        } else {
          alert(data.message || 'Không thể tải danh sách lớp!');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách lớp:', error);
        alert('Không thể tải danh sách lớp!');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLopList();
  }, [maGiangVien]);

  // Lấy danh sách môn học khi chọn lớp
  useEffect(() => {
    const fetchMonList = async () => {
      if (!malop || !maGiangVien) {
        setDanhSachMon([]);
        setMaMon('');
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/object/danh-sach-mon-theo-giang-vien-theo-lop/?magiangvien=${maGiangVien}&malop=${malop}`);
        if (!response.ok) throw new Error('Không thể kết nối tới server!');
        const data = await response.json();
        
        if (data.success) {
          setDanhSachMon(data.data || []);
        } else {
          alert(data.message || 'Không thể tải danh sách môn học!');
        }
        setMaMon('');
      } catch (error) {
        console.error('Lỗi khi lấy danh sách môn học:', error);
        alert('Không thể tải danh sách môn học!');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonList();
  }, [malop, maGiangVien]);

  const handleDiemDanh = async () => {
    if (!malop || !mamon) {
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
        danhSachSinhVien: data.success ? data.data : data,
        tenLop: malop, // Chỉ sử dụng mã lớp
        maMon: mamon,
        tenMon: selectedMon?.tenmon || mamon,
        ngayDiemDanh: ngayDiemDanh,
        maLop: malop,
        maGiangVien: maGiangVien
      };

      sessionStorage.setItem("malop", malop);
      sessionStorage.setItem('thongTinDiemDanh', JSON.stringify(thongTinDiemDanh));
      navigate('/user/diem-danh-u');
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
              <p className='chu-thong-tin'>Lớp:</p>
              <select 
                className="combobox" 
                value={malop} 
                onChange={(e) => setMaLop(e.target.value)} 
                disabled={loading}
              >
                <option value="">-- Chọn lớp --</option>
                {danhSachLop.map((lop) => (
                  <option key={lop.malop} value={lop.malop}>
                    {lop.malop}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <p className='chu-thong-tin'>Môn học:</p>
              <select 
                className="combobox" 
                value={mamon} 
                onChange={(e) => setMaMon(e.target.value)} 
                disabled={loading || !malop}
              >
                <option value="">-- Chọn môn --</option>
                {danhSachMon.map((mon) => (
                  <option key={mon.mamon} value={mon.mamon}>
                    {mon.tenmon || mon.mamon}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <p className='chu-thong-tin'>Ngày điểm danh:</p>
              <input
                type="date"
                className="combobox"
                value={ngayDiemDanh}
                onChange={(e) => setNgayDiemDanh(e.target.value)}
              />
            </div>
          </div>
          
          <div className="button-form">
            <button 
              className="button" 
              onClick={handleDiemDanh} 
              disabled={loading || !malop || !mamon}
            >
              <span>{loadingDanhSach ? 'Đang tải...' : 'Điểm Danh'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChonMon;