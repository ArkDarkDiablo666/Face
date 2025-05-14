import React, { useState, useEffect } from 'react';
import { CircleChevronLeft, CircleChevronRight, Search } from 'lucide-react';
import '../../TrangCaNhan.css'; 
import SidebarGuest from '../SidebarGuest';
import axios from 'axios';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function Xem() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;

  // Lấy mã sinh viên từ sessionStorage theo tên đăng nhập
  const [maSinhVien, setMaSinhVien] = useState('');
  
  useEffect(() => {
    const tendangnhap = sessionStorage.getItem('tendangnhap');
    setMaSinhVien(tendangnhap || '');
  }, []);

  useEffect(() => {
    // Hàm fetch dữ liệu điểm danh
    const fetchAttendanceData = async () => {
      if (!maSinhVien) {
        // Không fetch dữ liệu nếu chưa có mã sinh viên
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/object/danh-sach-diem-danh-sinh-vien/?masinhvien=${maSinhVien}`);
        
        if (response.data.success) {
          setAttendanceData(response.data.data);
        } else {
          setError(response.data.error || 'Có lỗi xảy ra khi tải dữ liệu');
        }
      } catch (err) {
        setError('Không thể kết nối đến máy chủ');
        console.error('Error fetching attendance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [maSinhVien]); // Sẽ gọi lại API khi maSinhVien thay đổi

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredItems = attendanceData.filter(item =>
    (item.tenGiangVien && item.tenGiangVien.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.tenMon && item.tenMon.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.maLop && item.maLop.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.trangThai && item.trangThai.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Tính toán số trang
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm debounce cho tìm kiếm
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  }, 300);

  return (
    <div className="container">
      <SidebarGuest />
      <div className='content-tk'>
        <h1>Lịch sử điểm danh</h1>
        <div className="search-bar">
          <input
            className='input-tim'
            type="text"
            placeholder="Tìm kiếm theo giáo viên, môn học, trạng thái hoặc mã lớp..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search className="icon" />
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className='form-table'>
            <table>
              <thead>
                <tr>
                  <th>Mã điểm danh</th>
                  <th>Thời gian điểm danh</th>
                  <th>Trạng thái</th>
                  <th>Giảng viên</th>
                  <th>Tên môn</th>
                  <th>Lớp</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((row) => (
                    <tr key={row.id}>
                      <td style={{ width: '300px' }}>{row.id}</td>
                      <td style={{ width:'200px' }}>{row.thoiGianDiemDanh}</td>
                      <td style={{ width: '50px' }}>{row.trangThai}</td>
                      <td style={{ width: '50px' }}>{row.tenGiangVien}</td>
                      <td style={{ width: '50px' }}>{row.tenMon}</td>
                      <td style={{ width: '50px' }}>{row.maLop}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Không có kết quả nào được tìm thấy</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="back-next">
              <button 
                className='icon-button' 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
              >
                <div className='icon-table'>
                  <CircleChevronLeft />
                </div>
              </button>
              <p className='text-button'>Trang {currentPage} trên {totalPages || 1}</p>
              <button 
                className='icon-button' 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <div className='icon-table'>
                  <CircleChevronRight />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Xem;