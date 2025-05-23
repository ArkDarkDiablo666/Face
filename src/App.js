import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DangNhap from './trangchu/DangNhap';
import QuenMatKhau from './trangchu/QuenMatKhau';
import DiemDanhU from './User/Pages/DiemDanhU';
import TrangCaNhanU from './User/Pages/TrangCaNhanU';
import TrangCaNhanA from './Admin/Pages/TrangCaNhanA';
import TrangCaNhanG from './Guest/Pages/TrangCaNhanG';
import DiemDanhA from './Admin/Pages/DiemDanhA';
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
import ChonMonU from './User/Pages/ChonMonU';
import CamSv from './Admin/Pages/TaoTk/CamSv';
import DiemDanhCameraA from './Admin/Pages/DiemDanhCameraA';
import DiemDanhCameraU from './User/Pages/DiemDanhCameraU';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DangNhap />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />

        <Route path="/admin" element={<TrangCaNhanA />} />
        <Route path="/admin/diem-danh-a" element={<DiemDanhA />} />
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
        <Route path="/admin/diem-danh-camera-a" element={<DiemDanhCameraA />} />
        <Route path="/admin/cam-sv" element={<CamSv />} />


        <Route path="/user" element={<TrangCaNhanU />} />
        <Route path="/user/diem-danh-u" element={<DiemDanhU />} />                                                                                                                                                                                                                                              
        <Route path="/user/diem-danh-camera-u" element={<DiemDanhCameraU />} />
        <Route path="/user/chon-mon-u" element={<ChonMonU />} />


        <Route path="/guest" element={<TrangCaNhanG />} />
        <Route path="/guest/xem" element={<Xem />} />
      </Routes>
    </Router>
  );
}

export default App;