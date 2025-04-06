// src/DauVao.js
import React, { useState, useEffect} from 'react';
import styled from 'styled-components';

function DauVao() {

  const [isMoving, setIsMoving] = useState(false);

  const handleLoginClick = () => {
    setIsMoving(true);
  };

  useEffect (() => {
    if (isMoving) {
      const timer = setTimeout(() => {
        window.location.href ='/dangnhap';
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  return (
    <div>
      <Container>
        <LogoContainer className={isMoving ? 'move' : ''}>
        <img src="meme.png" alt="Logo" />
        </LogoContainer>
        <ButtonStyled>
          <button className="button" onClick={handleLoginClick} >
            <span className="button-content">Đăng Nhập </span>
          </button>
        </ButtonStyled>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #E3FDFD;
  padding: 10px 20px; // Thêm padding để tạo khoảng cách
  position: relative;
  
`;
const LogoContainer = styled.div`
  margin-right: 20px; // Khoảng cách giữa logo và form
  padding : 50px; // Thêm padding để tạo khoảng cách

  &.move{
    transform: translateX(-200px);
    transition: transform 1s ease;
  }
  img {
    width: 400px; // Kích thước logo
    box-shadow: 0 2px 10px rgb(5, 5, 5);
  }
`;

const ButtonStyled = styled.div`
  .button {
    background: #71C9CE;
    font-family: inherit;
    padding: 0.6em 1.3em;
    font-weight: 900;
    font-size: 18px;
    border: 3px solid black;
    border-radius: 0.4em;
    box-shadow: 0.1em 0.1em;
    padding: auto 15px 15px auto;
    margin-right: 20px;
    width: 400px;
    height: 50px;
  }

  .button:hover {
    transform: translate(-0.05em, -0.05em);
    box-shadow: 0.15em 0.15em;
  }

  .button:active {
    transform: translate(0.05em, 0.05em);
    box-shadow: 0.05em 0.05em;
  }`;

export default DauVao;