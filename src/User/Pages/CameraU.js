import React, { useEffect, useRef, useState } from 'react';
import './CameraU.css';

function CameraU() {
  const videoRef = useRef(null);
  const [timer, setTimer] = useState(null); // State để lưu timer

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    getCamera();

    // Dọn dẹp khi component unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]); // Chỉ chạy lại khi timer thay đổi

  const handleButtonClick = () => {
    // Bắt đầu đếm ngược 15 giây
    const newTimer = setTimeout(() => {
      window.location.href = '/user/diem-danh';
    }, 10000); 

    setTimer(newTimer); // Lưu timer vào state
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden' 
    }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ 
          width: '100%', 
          height: '85%', 
          objectFit: 'cover' 
        }} 
      />
      <div className='button-form-mot' style={{ 
        position: 'absolute', 
        bottom: '10%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10 
      }}>
      </div>
      <div className='button-form-cam'>
        <button className="button-cam" onClick={handleButtonClick}>
          Điểm danh
        </button>
      </div>
    </div>
  );
}

export default CameraU;