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
      <form onSubmit={handleSubmit} className='form-background-mk'>
        <div className='form-signin-mk'>
          <h1 className='text-ultra'>QUÊN MẬT KHẨU</h1>
          <div className='form-mk'>
            <input className='input-mk' type="email" id="email" name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="Vui lòng hãy nhập email"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <div className='form-button'>
            <button className="button-dn" type="submit" disabled={loading}>
              <span>
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </span>
            </button>
            <a href='/'>Đăng nhập?</a>
          </div>
        </div>
        <div className='form-logo-mk'>
          <img src="./logo-final.png" alt="Logo" className='logo-dn' />
          <form className='form-text-logo-mk'>
            <h1>NHẬN DIỆN FID</h1>
          </form>
        </div>
      </form>
    </div>
  );
}

export default QuenMatKhau;