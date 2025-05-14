import React, { useState, useEffect, useCallback } from 'react';
import '../../TrangCaNhan.css'; // Import the CSS file
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
      
      // Kiểm tra và ghi log phản hồi để xác minh cấu trúc dữ liệu
      console.log('API response:', response.data);
      
      setData(response.data.data || []); // Đảm bảo có dữ liệu, nếu không thì mảng rỗng
      
      // Kiểm tra và đặt tổng số trang, đảm bảo là một số
      const total = response.data.total_pages;
      setTotalPages(total && !isNaN(total) ? Number(total) : 1);
      
      // Kiểm tra nếu trang hiện tại lớn hơn tổng số trang, điều chỉnh lại
      if (page > total) {
        setCurrentPage(total > 0 ? total : 1);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sinh viên', error);
      // Xử lý lỗi bằng cách đặt giá trị mặc định
      setData([]);
      setTotalPages(1);
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
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-tk">
          <h1>Danh sách sinh viên</h1>
          <div className="search-bar">
            <input
              className='input-tim'
              type="text"
              placeholder="Tìm kiếm theo tên..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search />
          </div>
          {data.length > 0 ? (
            <div className='form-table'>
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
                    const khoaName = row.makhoa && row.makhoa.match(/\((.*?)\)/) ? row.makhoa.match(/\((.*?)\)/)[1] : row.makhoa;
                    const nganhName = row.manganh && row.manganh.match(/\((.*?)\)/) ? row.manganh.match(/\((.*?)\)/)[1] : row.manganh;
                    const lopName = row.malop && row.malop.match(/\((.*?)\)/) ? row.malop.match(/\((.*?)\)/)[1] : row.malop;
                    return (
                      <tr key={row.masinhvien || index}>
                        <td style={{width: '5px'}}>{index + 1}</td>
                        <td style={{width: '20px'}}>{row.masinhvien}</td>
                        <td style={{width: '300px'}}>{row.hoten}</td>
                        <td style={{width: '5px'}}>{row.gioitinh}</td>
                        <td style={{width: '200px'}}>{row.ngaysinh}</td>
                        <td style={{width: '50px'}}>{row.sdt}</td>
                        <td style={{width: '300px'}}>{row.email}</td>
                        <td style={{width: '20px'}}>{khoaName}</td>
                        <td style={{width: '20px'}}>{nganhName}</td>
                        <td style={{width: '20px'}}>{lopName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="back-next">
                <button
                  className='icon-button'
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}>
                  <div className='icon-table'>
                    <CircleChevronLeft />
                  </div>
                </button>
                <p className='text-button'>
                  Trang {currentPage} trên {totalPages || 1}
                </p>
                <button
                  className='icon-button'
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}>
                  <div className='icon-table'>
                    <CircleChevronRight />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-data">Không có dữ liệu sinh viên.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaiKhoanSv;