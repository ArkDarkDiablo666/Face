import React, { useState } from 'react';
import { CircleChevronLeft, CircleChevronRight, Search } from 'lucide-react';
import './Xem.css';
import SidebarGuest from '../SidebarGuest';

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
  const data = [

    // Thêm dữ liệu mẫu khác nếu cần
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 7;

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredItems = data.filter(item => 
    item.teachername.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.subjectname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.classCode.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, 300);

  return (
    <div className="container">
      <SidebarGuest />
      <div className='content'>
        <h1>Thống kê</h1>
        <div className="search-bar">
            <input 
            className='input-tim'
              type="text" 
              placeholder="Tìm kiếm theo giáo viên, môn học hoặc mã lớp..." 
              onChange={(e) => handleSearch(e.target.value)} 
            />
            <Search className="icon" />
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Thời gian điểm danh</th>
                <th>Trạng thái</th>
                <th>Giáo viên</th>
                <th>Tên môn</th>
                <th>Mã lớp</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.attendanceTime}</td>
                    <td>{row.status}</td>
                    <td>{row.teachername}</td>
                    <td>{row.subjectname}</td>
                    <td>{row.classCode}</td>
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
              disabled={currentPage === 1}>
              <div className='icon-table'>
                <CircleChevronLeft />
              </div>
            </button>
            <p className='text-button'>Page {currentPage} of {totalPages}</p>
            <button 
              className='icon-button'
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}>
              <div className='icon-table'>
                <CircleChevronRight />
              </div>
            </button>
          </div>
      </div>
    </div>
  );
}

export default Xem;