// src/DauVao.js
import React, { useState, useEffect } from 'react';
import './DauVao.css';

function DauVao() {
  const [isMoving, setIsMoving] = useState(false);

  const handleLoginClick = () => {
    setIsMoving(true);
  };

  useEffect(() => {
    if (isMoving) {
      const timer = setTimeout(() => {
        window.location.href = '/dangnhap';
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  return (
    <div className="container-dv">
      <div className={`logo-container ${isMoving ? 'move' : ''}`}>
        <img className='img' src="/meme.png" alt="Logo" />
      </div>
      <button className="button" onClick={handleLoginClick}>
        <span className="button-content">Đăng Nhập</span>
      </button>
    </div>
  );
}

export default DauVao;