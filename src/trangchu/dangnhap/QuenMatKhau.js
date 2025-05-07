import React, { useState } from 'react';
import './QuenMatKhau.css';
import axios from 'axios';

const QuenMatKhau = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/object/lay-lai-mat-khau/', { email });
      setMessage(response.data.message);
      setEmail(''); // Xóa email sau khi gửi thành công
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-mk'>
      <div className="form-container-mk">
        <h1 className='title-container'>Quên Mật Khẩu</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input 
              className='input' 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="Nhập email của bạn"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <button 
            className="button" 
            type="submit"
            disabled={loading}
          >
            <span className="button-content">
              {loading ? 'Đang gửi...' : 'Gửi'}
            </span>
          </button>
          
          <a href='/dangnhap' style={{color: 'black'}}><h4>Đăng nhập</h4></a>
        </form>
      </div>
    </div>
  );
}

export default QuenMatKhau;