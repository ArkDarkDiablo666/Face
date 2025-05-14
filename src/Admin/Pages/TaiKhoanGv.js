import React, { useState, useEffect, useCallback } from 'react';
import '../../TrangCaNhan.css';  // Import the CSS file
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

function TaiKhoanGv() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]); // Dữ liệu giảng viên
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  const fetchGiangVienData = useCallback(async (page = 1, search = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/object/danh-sach-giang-vien/?search=${search}&page=${page}`);
      console.log('API response:', response.data);
      setData(response.data.data);
      
      if (response.data.total_pages !== undefined) {
        setTotalPages(response.data.total_pages);
      } else if (response.data.totalPages !== undefined) {
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Không tìm thấy thông tin tổng số trang trong response');
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu giảng viên', error);
      setTotalPages(1);
    }
  }, []);

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset trang khi tìm kiếm
    fetchGiangVienData(1, value); // Tìm kiếm khi thay đổi từ khóa
  }, 300);

  useEffect(() => {
    fetchGiangVienData(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchGiangVienData]);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-tk">
          <h1 className='chu-de'>Danh sách giảng viên</h1>
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
                <th>MSGV</th>
                <th>Họ và tên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Khoa</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const khoaName = row.makhoa.match(/\((.*?)\)/) ? row.makhoa.match(/\((.*?)\)/)[1] : row.makhoa;

                return (
                  <tr key={row.magiangvien}>
                    <td style={{ width: '5px'}}>{index + 1}</td>
                    <td style={{ width: '20px'}}>{row.magiangvien}</td>
                    <td style={{ width: '300px'}}>{row.hoten}</td>
                    <td style={{ width: '5px'}}>{row.gioitinh}</td>
                    <td style={{ width: '200px'}}>{row.ngaysinh}</td>
                    <td style={{ width: '50px'}}>{row.sdt}</td>
                    <td style={{ width: '300 px'}}>{row.email}</td>
                    <td style={{ width: '20px'}}>{khoaName}</td>
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

export default TaiKhoanGv;