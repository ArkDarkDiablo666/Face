import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DangNhap() {
  const [tendangnhap, setTenDangNhap] = useState('');
  const [matkhau, setMatKhau] = useState('');
  const [loading, setLoading] = useState(false); // Để theo dõi trạng thái tải
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu tải
    try {
      const res = await axios.post('http://localhost:8000/login/', {
        tendangnhap,
        matkhau,
      });

      const role = res.data.role;
      if (role === 'admin') {
        navigate('/admin/trang-ca-nhan');
      } else if (role === 'user') {
        navigate('/user/trang-ca-nhan');
      } else if (role === 'guest') {
        navigate('/guest/trang-ca-nhan');
      }
    } catch (err) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  return (
    <Container>
      <LogoContainer>
        <img src="meme.png" alt="Logo" />
      </LogoContainer>
      <FormContainer>
        <TitleContainer>
          <h2>Đăng Nhập</h2>
        </TitleContainer>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Tên đăng nhập:</label>
            <Input
              type="text"
              value={tendangnhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Mật khẩu:</label>
            <Input
              type="password"
              value={matkhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
          </InputGroup>
          <ButtonStyled>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </ButtonStyled>
          <a href='/quen-mat-khau' style={{ color: 'black' }}>
            <h4>Quên mật khẩu rồi chứ gì?</h4>
          </a>
        </form>
      </FormContainer>
    </Container>
  );
}

// ===================== CSS styled-components ===================== //

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  height: 100vh;
  background-color: #E3FDFD;
  padding: 0 20px; 
  position: relative;
`;

const LogoContainer = styled.div`
  margin-right: 20px;
  margin-bottom: 70px;
  display: flex;
  align-items: center;

  img {
    width: 400px;
    box-shadow: 0 2px 10px rgb(5, 5, 5);
  }
`;

const TitleContainer = styled.div`
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: -20px;
`;

const FormContainer = styled.div`
  padding: 20px;
  margin-bottom: 60px;
  background-color: #A6E3E9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(5, 5, 5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 370px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  margin-right: 20px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonStyled = styled.div`
  margin-top: 10px;

  .button {
    background: #71C9CE;
    font-family: inherit;
    padding: 0.6em 1.3em;
    font-weight: 900;
    font-size: 18px;
    border: 3px solid black;
    border-radius: 0.4em;
    box-shadow: 0.1em 0.1em;
    width: 100%;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .button:disabled {
    background-color: #A6E3E9;
    cursor: not-allowed;
  }

  .button:hover:not(:disabled) {
    transform: translate(-0.05em, -0.05em);
    box-shadow: 0.15em 0.15em;
  }

  .button:active:not(:disabled) {
    transform: translate(0.05em, 0.05em);
    box-shadow: 0.05em 0.05em;
  }
`;

export default DangNhap;
