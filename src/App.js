// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DauVao from './trangchu/DauVao';
import DangNhap from './trangchu/dangnhap/DangNhap';
import QuenMatKhau from './trangchu/dangnhap/QuenMatKhau';
import Admin from './Admin/Admin';
import User from './User/User';
import Guest from './Guest/Guest';
import DiemDanhU from './User/Pages/DiemDanhU';
import TrangCaNhanU from './User/Pages/TrangCaNhanU';
import TrangCaNhanA from './Admin/Pages/TrangCaNhanA';
import TrangCaNhanG from './Guest/Pages/TrangCaNhanG';
import DiemDanhA from './Admin/Pages/DiemDanhA';
import TaiKhoan from './Admin/Pages/TaiKhoan';
import TaoTkGv from './Admin/Pages/TaoTk/TaoTkGv';
import TaoTkSv from './Admin/Pages/TaoTk/TaoTkSv';
import Xem from './Guest/Pages/Xem';
import TaoKhoa from './Admin/Pages/Tao-dulieu/TaoKhoa';
import TaoLop from './Admin/Pages/Tao-dulieu/TaoLop';
import TaoNganh from './Admin/Pages/Tao-dulieu/TaoNganh';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DauVao />} />
        <Route path="/dangnhap" element={<DangNhap />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/diem-danh" element={<DiemDanhA />} />
        <Route path="/admin/trang-ca-nhan" element={<TrangCaNhanA />} />
        <Route path="/admin/tai-khoan" element={<TaiKhoan />} />
        <Route path="/admin/tao-tk-gv" element={<TaoTkGv />} />
        <Route path="/admin/tao-tk-sv" element={<TaoTkSv />} />
        <Route path="/admin/tao-khoa" element={<TaoKhoa />} />
        <Route path="/admin/tao-lop" element={<TaoLop />} />
        <Route path="/admin/tao-nganh" element={<TaoNganh />} />

        <Route path="/user" element={<User />} />
        <Route path="/user/diem-danh" element={<DiemDanhU />} />
        <Route path="/user/trang-ca-nhan" element={<TrangCaNhanU />} />

        <Route path="/guest" element={<Guest />} />
        <Route path="/guest/trang-ca-nhan" element={<TrangCaNhanG />} />
        <Route path="/guest/xem" element={<Xem />} />
      </Routes>
    </Router>
  );
}

export default App; 