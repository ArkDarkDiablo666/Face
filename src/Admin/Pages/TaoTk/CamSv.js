import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../../TrangCaNhan.css'; 


function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [timer, setTimer] = useState(null);
  const masinhvien = sessionStorage.getItem("masinhvien");
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const captureCount = useRef(0);
  const totalCaptures = 150;
  const captureIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
        setStatusMessage("Không thể truy cập camera");
      }
    };

    getCamera();

    // Lưu tham chiếu hiện tại của video element để sử dụng trong cleanup
    const videoElement = videoRef.current;

    // Cleanup function
    return () => {
      // Clear all intervals/timeouts
      if (timer) clearTimeout(timer);
      if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      // Stop all media tracks sử dụng tham chiếu đã lưu
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [timer]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Trả về dữ liệu base64 của ảnh
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const sendImage = async (imageBase64) => {
    try {
      // Cắt bỏ phần header của chuỗi base64 (data:image/jpeg;base64,)
      const base64Data = imageBase64.split(',')[1];
      
      const response = await axios.post('http://127.0.0.1:8000/object/chup-anh/', {
        image: base64Data,
        masinhvien: masinhvien,
        index: captureCount.current
      });
      
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gửi ảnh:", error);
      return null;
    }
  };

  const captureMultipleImages = async () => {
    if (!masinhvien) {
      setStatusMessage("Thiếu mã sinh viên!");
      return false;
    }

    setIsCapturing(true);
    captureCount.current = 0;
    setProgress(0);
    setStatusMessage("Đang ghi nhận khuôn mặt... Vui lòng giữ nguyên trong 150 giây.");

    const startTime = Date.now();
    const endTime = startTime + 150000; // 150 giây

    // Hàm chụp ảnh theo chu kỳ
    captureIntervalRef.current = setInterval(async () => {
      if (Date.now() >= endTime || captureCount.current >= totalCaptures) {
        clearInterval(captureIntervalRef.current);
        clearInterval(progressIntervalRef.current);
        
        
        setProgress(100);
        setStatusMessage("Hoàn thành ghi nhận khuôn mặt. Đang xử lý...");
        
        // Gọi mã hóa khuôn mặt sau khi hoàn thành
        await encodeFace();
        return;
      }

      try {
        const imageBase64 = captureImage();
        if (imageBase64) {
          captureCount.current++;
          await sendImage(imageBase64);
          
          // Cập nhật trạng thái
          const captureProgress = (captureCount.current / totalCaptures) * 100;
          setProgress(Math.min(captureProgress, 100));
        }
      } catch (error) {
        console.error("Lỗi khi chụp hoặc gửi ảnh:", error);
      }
    }, 1000); // Chụp mỗi 1 giây

    // Cập nhật thanh tiến độ based on time
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min((elapsed / 150000) * 100, 100);
      // Lấy giá trị lớn hơn giữa tiến độ theo thời gian và tiến độ theo số ảnh
      const captureProgress = (captureCount.current / totalCaptures) * 100;
      setProgress(Math.max(timeProgress, captureProgress));
    }, 500);

    return true;
  };

  const encodeFace = async () => {
    try {
      setStatusMessage("Đang mã hóa khuôn mặt...");
      const response = await axios.post('http://127.0.0.1:8000/object/ma-hoa-khuon-mat/', {
        masinhvien: masinhvien
      });
      
      console.log("Mã hóa khuôn mặt thành công:", response.data);
      setStatusMessage("Mã hóa khuôn mặt thành công! Chuyển hướng sau 3 giây...");

      // Chuyển hướng sau 3 giây
      const newTimer = setTimeout(() => {
        window.location.href = '/admin/tao-tk-sv';
      }, 3000);
      setTimer(newTimer);
      
      return response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình mã hóa khuôn mặt:", error.response?.data || error.message);
      setStatusMessage(`Lỗi mã hóa khuôn mặt: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  const handleButtonClick = async () => {
    if (isCapturing) return;
    captureMultipleImages();
  };

  return (
    <div style={{ height: '100vh'}}>
      <div style={{
        flex: '1',
        position: 'relative',
        width: '100%',
        height: '85vh',
        overflow: 'hidden'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div style={{
        padding: '10px',
        height:'12vh',
        backgroundColor: '#F8F3EA'
      }}>
        {/* Hiển thị trạng thái */}
        {statusMessage && (
          <div className='label' style={{
            textAlign: 'center',
            color: '#333',
            fontSize: '14px',
            marginBottom: '10px',
          }}>
            {statusMessage} {isCapturing && `(${Math.round(progress)}%)`}
          </div>
        )}

        {/* Thanh tiến độ - hiển thị khi isCapturing = true */}
        {isCapturing && (
          <div style={{
            width: '100%',
            backgroundColor: '#f8f3ea',
            height: '10px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#9ECCFA',
              transition: 'width 0.3s'
            }}></div>
          </div>
        )}

        <div className='button-form' style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button 
            className="button" 
            onClick={handleButtonClick} 
            disabled={isCapturing}
          >
            <span>
              {isCapturing ? 'Đang ghi nhận...' : 'Ghi nhận khuôn mặt'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Camera;