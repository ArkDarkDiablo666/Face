import React, { useState, useEffect, useCallback } from 'react';
import './TaiKhoan.css'; // Import the CSS file
import { CircleChevronLeft, CircleChevronRight, Search } from 'lucide-react';
import SidebarAdmin from '../SidebarAdmin';
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

function TaiKhoanSv() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]); // Dữ liệu sinh viên
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  // Hàm để lấy dữ liệu sinh viên
  const fetchSinhVienData = useCallback(async (page = 1, search = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/object/danh-sach-sinh-vien/?search=${search}&page=${page}`);
      setData(response.data.data); // Dữ liệu sinh viên
      setTotalPages(response.data.total_pages); // Tổng số trang
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sinh viên', error);
    }
  }, []); // Dùng useCallback để đảm bảo fetchSinhVienData không thay đổi khi render lại

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset trang khi tìm kiếm
    fetchSinhVienData(1, value); // Tìm kiếm khi thay đổi từ khóa
  }, 300);

  // Cập nhật dữ liệu khi thay đổi trang hoặc từ khóa tìm kiếm
  useEffect(() => {
    fetchSinhVienData(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchSinhVienData]);

  // Hàm để chuyển đến trang tiếp theo hoặc trước đó
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-tk-ad">
          <h1 className='chu-de'>Danh sách Sinh Viên</h1>
          <div className="search-bar">
            <input
              className='input-tim'
              type="text"
              placeholder="Tìm kiếm theo tên..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="icon" />
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>MSSV</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Khoa</th>
                <th>Ngành</th>
                <th>Lớp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                // Xử lý 'makhoa' để chỉ lấy tên khoa (bỏ phần còn lại)
                const khoaName = row.makhoa.match(/\((.*?)\)/) ? row.makhoa.match(/\((.*?)\)/)[1] : row.makhoa;
                const nganhName = row.manganh.match(/\((.*?)\)/) ? row.manganh.match(/\((.*?)\)/)[1] : row.manganh;
                const lopName = row.malop.match(/\((.*?)\)/) ? row.malop.match(/\((.*?)\)/)[1] : row.malop;
                return (
                  <tr key={row.masinhvien}>
                    <td>{index + 1}</td>
                    <td>{row.masinhvien}</td>
                    <td>{row.hoten}</td>
                    <td>{row.gioitinh}</td>
                    <td>{row.ngaysinh}</td>
                    <td>{row.sdt}</td>
                    <td>{row.email}</td>
                    <td>{khoaName}</td> {/* Hiển thị tên khoa đã xử lý */}
                    <td>{nganhName}</td> {/* Hiển thị tên ngành */}
                    <td>{lopName}</td> {/* Hiển thị tên lớp */}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="back-next">
            <button
              className='icon-button'
              onClick={() => changePage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}>
              <div className='icon-table'>
                <CircleChevronLeft />
              </div>
            </button>
            <p className='text-button'>Trang {currentPage} trên {totalPages}</p>
            <button
              className='icon-button'
              onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}>
              <div className='icon-table'>
                <CircleChevronRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaiKhoanSv;
