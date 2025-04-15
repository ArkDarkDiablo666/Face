import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './TaiKhoan.css'; // Import the CSS file
import { House, UserRound, ScanFace, UserRoundPlus, ContactRound, UsersRound, LogOut
  , CircleFadingPlus, FolderPlus, CircleChevronLeft, CircleChevronRight, Search 
} from 'lucide-react';


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

function TaiKhoan() {

  
  const data = [
    { id: 1, name: 'Nguyễn Văn A', description: 'Sinh viên năm 1', createdAt: '2023-01-01' },
    { id: 2, name: 'Trần Thị B', description: 'Sinh viên năm 2', createdAt: '2023-01-02' },
    { id: 3, name: 'Lê Văn C', description: 'Sinh viên năm 3', createdAt: '2023-01-03' },
    { id: 4, name: 'Nguyễn Văn D', description: 'Sinh viên năm 4', createdAt: '2023-01-04' },
    { id: 5, name: 'Trần Thị E', description: 'Sinh viên năm 5', createdAt: '2023-01-05' },
    { id: 6, name: 'Lê Văn F', description: 'Sinh viên năm 6', createdAt: '2023-01-06' },
    { id: 7, name: 'Nguyễn Văn G', description: 'Sinh viên năm 7', createdAt: '2023-01-07' },
    { id: 8, name: 'Trần Thị H', description: 'Sinh viên năm 8', createdAt: '2023-01-08' },
    { id: 9, name: 'Lê Văn I', description: 'Sinh viên năm 9', createdAt: '2023-01-09' },
    { id: 10, name: 'Nguyễn Văn J', description: 'Sinh viên năm 10', createdAt: '2023-01-10' },
    { id: 11, name: 'Trần Thị K', description: 'Sinh viên năm 11', createdAt: '2023-01-11' },
    { id: 12, name: 'Lê Văn L', description: 'Sinh viên năm 12', createdAt: '2023-01-12' },
    { id: 13, name: 'Nguyễn Văn M', description: 'Sinh viên năm 13', createdAt: '2023-01-13' },
    { id: 14, name: 'Trần Thị N', description: 'Sinh viên năm 14', createdAt: '2023-01-14' },
    { id: 15, name: 'Lê Văn O', description: 'Sinh viên năm 15', createdAt: '2023-01-15' },
    { id: 16, name: 'Nguyễn Văn P', description: 'Sinh viên năm 16', createdAt: '2023-01-16' },
    { id: 17, name: 'Trần Thị Q', description: 'Sinh viên năm 17', createdAt: '2023-01-17' },
    { id: 18, name: 'Lê Văn R', description: 'Sinh viên năm 18', createdAt: '2023-01-18' },
    { id: 19, name: 'Nguyễn Văn S', description: 'Sinh viên năm 19', createdAt: '2023-01-19' },
    { id: 20, name: 'Trần Thị T', description: 'Sinh viên năm 20', createdAt: '2023-01-20' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 7;

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredItems = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div style={{ display: 'flex' }}>
        <div className="side-menu">
          <Menu>
            <div className="icon">
              <img src="/meme.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
              <p className="label">Face ID</p>
            </div>
            <MenuItem className="menu-item" href="/admin">
              <div className="icon">
                <House />
                <p className="title">Trang chủ</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/trang-ca-nhan">
              <div className="icon">
                <UserRound />
                <p className="title">Thông tin cá nhân</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/admin/tai-khoan">
              <div className="icon">
                <ContactRound />
                <p className="title-main">Danh sách tài khoản</p>
              </div>
            </MenuItem>
            <SubMenu label={<p className="title">Tạo tài khoản</p>} icon={<div className="icon"><UsersRound /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-tk-gv">
                  <div className="icon">
                    <UserRoundPlus />
                    <p className="title">Giáo viên</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-tk-sv">
                  <div className="icon">
                    <UserRoundPlus />
                    <p className="title">Sinh viên</p>
                  </div>
                </MenuItem>
              </div>
            </SubMenu>
            <SubMenu label={<p className="title">Tạo</p>} icon={<div className="icon"><FolderPlus /></div>}>
              <div className="sub-menu-bar">
                <MenuItem className="menu-item" href="/admin/tao-khoa">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Khoa</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-nganh">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Ngành</p>
                  </div>
                </MenuItem>
                <MenuItem className="menu-item" href="/admin/tao-lop">
                  <div className="icon">
                    <CircleFadingPlus />
                    <p className="title">Lớp</p>
                  </div>
                </MenuItem>
              </div>
              </SubMenu>
            <MenuItem className="menu-item" href="/admin/diem-danh">
              <div className="icon">
                <ScanFace />
                <p className="title">Điểm danh</p>
              </div>
            </MenuItem>
            <MenuItem className="menu-item" href="/dangnhap">
              <div className="icon">
                <LogOut />
                <p className="title">Đăng xuất</p>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div className="content-tk-ad">
          <h1 className='chu-de'>TaiKhoan</h1>
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
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                  <td>{row.createdAt}</td>
                </tr>
              ))}
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
    </div>
  );
}

export default TaiKhoan;