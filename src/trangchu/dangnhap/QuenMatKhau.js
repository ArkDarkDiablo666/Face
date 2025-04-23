import React, { useState} from 'react';
import './QuenMatKhau.css';
import axios from 'axios';

const QuenMatKhau = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/lay-lai-mat-khau/', { email });
      setMessage(response.data.message);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };
  
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