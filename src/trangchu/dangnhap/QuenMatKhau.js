import React from 'react';
import './QuenMatKhau.css';


const QuenMatKhau = () => {
  return (
    <div className='container-mk'>
      <div className="form-container-mk">
        <h1 className='title-container'>Quên Mật Khẩu</h1>
        <form>
            <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input className='input' type="text" id="email" name="email" required />
            </div>
          <button className="button" >
            <span className="button-content">Gửi</span>
          </button>
          <a href='/dangnhap' style={{color: 'black'}}><h4>Đăng nhập</h4></a>
        </form>
      </div>
    </div>
  );
}

export default QuenMatKhau;