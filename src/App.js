import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './Loading'; // Nhập component Loading
import DauVao from './trangchu/DauVao';
import DangNhap from './trangchu/dangnhap/DangNhap';
import QuenMatKhau from './trangchu/dangnhap/QuenMatKhau';
import Guest from './Guest/Guest';
import DiemDanhU from './User/Pages/DiemDanhU';
import TrangCaNhanU from './User/Pages/TrangCaNhanU';
import TrangCaNhanA from './Admin/Pages/TrangCaNhanA';
import TrangCaNhanG from './Guest/Pages/TrangCaNhanG';
import DiemDanhA from './Admin/Pages/DiemDanhA';
import Camera from './Admin/Pages/Camera';
import ChonMon from './Admin/Pages/ChonMon';
import TaiKhoanSv from './Admin/Pages/TaiKhoanSv';
import TaiKhoanGv from './Admin/Pages/TaiKhoanGv';
import TaoTkGv from './Admin/Pages/TaoTk/TaoTkGv';
import TaoTkSv from './Admin/Pages/TaoTk/TaoTkSv';
import Xem from './Guest/Pages/Xem';
import TaoKhoa from './Admin/Pages/Tao-dulieu/TaoKhoa';
import TaoLop from './Admin/Pages/Tao-dulieu/TaoLop';
import TaoNganh from './Admin/Pages/Tao-dulieu/TaoNganh';
import TaoMon from './Admin/Pages/Tao-dulieu/TaoMon';
import CameraU from './User/Pages/CameraU';
import ChonMonU from './User/Pages/ChonMonU';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Giả lập việc tải dữ liệu
      setTimeout(() => {
        setIsLoading(false); // Đặt trạng thái loading thành false sau khi tải xong
      }, 500);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />; // Hiển thị loading khi đang tải
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DauVao />} />
        <Route path="/dangnhap" element={<DangNhap />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

        <Route path="/admin/diem-danh" element={<DiemDanhA />} />
        <Route path="/admin/camera" element={<Camera />} />
        <Route path="/admin/chon-mon" element={<ChonMon />} />
        <Route path="/admin" element={<TrangCaNhanA />} />
        <Route path="/admin/tai-khoan-sv" element={<TaiKhoanSv />} />
        <Route path="/admin/tai-khoan-gv" element={<TaiKhoanGv />} />
        <Route path="/admin/tao-tk-gv" element={<TaoTkGv />} />
        <Route path="/admin/tao-tk-sv" element={<TaoTkSv />} />
        <Route path="/admin/tao-khoa" element={<TaoKhoa />} />
        <Route path="/admin/tao-lop" element={<TaoLop />} />
        <Route path="/admin/tao-nganh" element={<TaoNganh />} />
        <Route path="/admin/tao-mon" element={<TaoMon />} />

        <Route path="/user/diem-danh" element={<DiemDanhU />} />
        <Route path="/user" element={<TrangCaNhanU />} />
        <Route path="/user/camera" element={<CameraU />} />
        <Route path="/user/chon-mon" element={<ChonMonU />} />

        <Route path="/guest" element={<Guest />} />
        <Route path="/guest/trang-ca-nhan" element={<TrangCaNhanG />} />
        <Route path="/guest/xem" element={<Xem />} />
      </Routes>
    </Router>
  );
}

export default App;