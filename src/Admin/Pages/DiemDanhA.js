import React, { useState } from 'react';
import './DiemDanhA.css'; // Nhập file CSS
import { CircleChevronLeft, CircleChevronRight, Search } from 'lucide-react';
import SidebarAdmin from '../SidebarAdmin';

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

function DiemDanhA() {
  const initialData = [
    { id: 1, name: 'Nguyễn Văn A', description: 'Sinh viên năm 1', createdAt: '2023-01-01', isAbsent: false },
    { id: 2, name: 'Trần Thị B', description: 'Sinh viên năm 2', createdAt: '2023-01-02', isAbsent: false },
    { id: 3, name: 'Lê Văn C', description: 'Sinh viên năm 3', createdAt: '2023-01-03', isAbsent: false },
    { id: 4, name: 'Nguyễn Văn D', description: 'Sinh viên năm 4', createdAt: '2023-01-04', isAbsent: false },
    { id: 5, name: 'Trần Thị E', description: 'Sinh viên năm 5', createdAt: '2023-01-05', isAbsent: false },
    { id: 6, name: 'Lê Văn F', description: 'Sinh viên năm 6', createdAt: '2023-01-06', isAbsent: false },
    { id: 7, name: 'Nguyễn Văn G', description: 'Sinh viên năm 7', createdAt: '2023-01-07', isAbsent: false },
    { id: 8, name: 'Trần Thị H', description: 'Sinh viên năm 8', createdAt: '2023-01-08', isAbsent: false },
    { id: 9, name: 'Lê Văn I', description: 'Sinh viên năm 9', createdAt: '2023-01-09', isAbsent: false },
    { id: 10, name: 'Nguyễn Văn J', description: 'Sinh viên năm 10', createdAt: '2023-01-10', isAbsent: false },
    { id: 11, name: 'Trần Thị K', description: 'Sinh viên năm 11', createdAt: '2023-01-11', isAbsent: false },
    { id: 12, name: 'Lê Văn L', description: 'Sinh viên năm 12', createdAt: '2023-01-12', isAbsent: false },
    { id: 13, name: 'Nguyễn Văn M', description: 'Sinh viên năm 13', createdAt: '2023-01-13', isAbsent: false },
    { id: 14, name: 'Trần Thị N', description: 'Sinh viên năm 14', createdAt: '2023-01-14', isAbsent: false },
    { id: 15, name: 'Lê Văn O', description: 'Sinh viên năm 15', createdAt: '2023-01-15', isAbsent: false },
    { id: 16, name: 'Nguyễn Văn P', description: 'Sinh viên năm 16', createdAt: '2023-01-16', isAbsent: false },
    { id: 17, name: 'Trần Thị Q', description: 'Sinh viên năm 17', createdAt: '2023-01-17', isAbsent: false },
    { id: 18, name: 'Lê Văn R', description: 'Sinh viên năm 18', createdAt: '2023-01-18', isAbsent: false },
    { id: 19, name: 'Nguyễn Văn S', description: 'Sinh viên năm 19', createdAt: '2023-01-19', isAbsent: false },
    { id: 20, name: 'Trần Thị T', description: 'Sinh viên năm 20', createdAt: '2023-01-20', isAbsent: false },
  ];

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const itemsPerPage = 7;

  const filteredItems = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleCheckboxChange = (id) => {
    const updatedData = data.map(item => 
      item.id === id ? { ...item, isAbsent: !item.isAbsent } : item
    );
    setData(updatedData);
  };

  const handleButtonClick1 = () => {
    window.location.href = '/admin/camera';
  };

  const handleSave = () => {
    // Logic to save data goes here
    setIsButtonDisabled(true); // Disable the "Điểm danh" button after saving
  };

  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <SidebarAdmin />
        <div className="content-dd-ad">
          <h1>DiemDanhA</h1>
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
                <th>Trạng thái</th>
                <th>MSGV</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                  <td>{row.createdAt}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.isAbsent} 
                      onChange={() => handleCheckboxChange(row.id)} 
                    />
                    <span> Vắng</span>
                  </td>
                  <td>{row.status}</td>
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
          <div className='form-hai-button'>
            <button className='button-tao' onClick={handleButtonClick1} disabled={isButtonDisabled}>Điểm danh</button>
            <button className='button-tao' onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiemDanhA;