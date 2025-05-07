import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './Camera.css';

function DiemDanhCameraA({ onClose, onFacesDetected, students }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [streamRef, setStreamRef] = useState(null); // Lưu trữ stream để tái sử dụng

  // Hàm khởi tạo camera
  const initCamera = async () => {
    try {
      // Nếu đã có stream từ trước, dừng tất cả các track
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      setStreamRef(stream); // Lưu stream để tái sử dụng sau này
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Lỗi truy cập camera:', error);
      setErrorMessage('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.');
    }
  };

  useEffect(() => {
    // Khởi tạo camera khi component mount
    initCamera();

    // Cleanup khi component unmount
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      setErrorMessage('Không thể khởi tạo camera');
      return;
    }
    
    const context = canvas.getContext('2d');
    
    // Đảm bảo canvas có kích thước phù hợp với video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageBase64 = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageBase64);
    setDetectedFaces([]); // Reset kết quả nhận diện khi chụp ảnh mới
    setStatusMessage('Đã chụp ảnh. Vui lòng nhấn "Nhận diện" để xử lý.');
    showNotificationMessage('Đã chụp ảnh thành công!', 'success');
  };

  const showNotificationMessage = (message, type) => {
    setStatusMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Hàm xử lý khi chụp lại ảnh
  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedFaces([]);
    setErrorMessage('');
    // Khởi động lại camera
    initCamera();
    setStatusMessage('Đã sẵn sàng chụp ảnh mới');
    showNotificationMessage('Camera đã sẵn sàng', 'success');
  };

  const sendToRecognition = async () => {
    if (!capturedImage) {
      setErrorMessage('Vui lòng chụp ảnh trước khi nhận diện');
      showNotificationMessage('Vui lòng chụp ảnh trước khi nhận diện', 'error');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Đang xử lý nhận diện khuôn mặt...');
    
    try {
      // Lấy CSRF token nếu sử dụng Django (nếu cần)
      const csrfToken = getCookie('csrftoken');
      
      // Gửi ảnh đến API nhận diện khuôn mặt với đúng tên trường là video_source
      const response = await axios.post('http://127.0.0.1:8000/object/nhan-dien-khuon-mat/', {
        video_source: capturedImage // Gửi cả chuỗi base64 đầy đủ (bao gồm phần header)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || ''
        }
      });
      
      console.log('Kết quả nhận diện:', response.data);
      
      if (response.data) {
        if (response.data.detected_faces && response.data.detected_faces.length > 0) {
          setDetectedFaces(response.data.detected_faces);
          
          // Chuyển đổi danh sách tên thành danh sách mã sinh viên (nếu cần)
          const msvList = response.data.detected_faces.filter(face => face !== 'UNKNOWN');
          onFacesDetected(msvList);
          
          setStatusMessage(`Đã nhận diện ${msvList.length} sinh viên!`);
          showNotificationMessage(`Đã nhận diện ${msvList.length} sinh viên!`, 'success');
          
          // Chỉ đóng modal khi có ít nhất một khuôn mặt được nhận diện thành công
          if (msvList.length > 0) {
            setTimeout(() => onClose(), 2000); // Đóng sau 2 giây để người dùng thấy kết quả
          }
        } else if (response.data.message) {
          setErrorMessage(response.data.message);
          showNotificationMessage(response.data.message, 'error');
        } else {
          setErrorMessage('Không nhận diện được khuôn mặt');
          showNotificationMessage('Không nhận diện được khuôn mặt', 'error');
        }
      } else {
        setErrorMessage('Phản hồi không hợp lệ từ máy chủ');
        showNotificationMessage('Phản hồi không hợp lệ từ máy chủ', 'error');
      }
    } catch (error) {
      console.error('Lỗi khi nhận diện khuôn mặt:', error);
      const errorMsg = 'Lỗi xử lý: ' + (error.response?.data?.message || error.response?.data?.error || error.message);
      setErrorMessage(errorMsg);
      showNotificationMessage(errorMsg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Hàm lấy cookie (cho CSRF token nếu cần)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <div className="camera-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '15px 20px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f8f8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Nhận diện khuôn mặt</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            &times;
          </button>
        </div>
        
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          overflow: 'hidden', 
          backgroundColor: '#000' 
        }}>
          {!capturedImage ? (
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
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        
        {showNotification && (
          <div className={`camera-notification ${notificationType}`}>
            {statusMessage}
          </div>
        )}
        
        <div style={{ 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}>
          {detectedFaces.length > 0 && (
            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>Kết quả nhận diện:</h3>
              <ul style={{ 
                margin: 0, 
                padding: 0, 
                listStyleType: 'none', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px' 
              }}>
                {detectedFaces.map((face, index) => (
                  <li 
                    key={index}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '15px',
                      backgroundColor: face === 'UNKNOWN' ? '#ffebee' : '#e8f5e9',
                      color: face === 'UNKNOWN' ? '#c62828' : '#2e7d32',
                      border: `1px solid ${face === 'UNKNOWN' ? '#ef9a9a' : '#a5d6a7'}`,
                      fontSize: '14px'
                    }}
                  >
                    {face}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {errorMessage && (
            <div style={{
              padding: '10px 15px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              {errorMessage}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: '10px', 
            marginTop: '10px' 
          }}>
            <div className="button-form-cam">
              {!capturedImage ? (
                <button 
                  className="button-cam" 
                  onClick={captureImage}
                >
                  Chụp ảnh
                </button>
              ) : (
                <>
                  <button 
                    className="button-cam" 
                    onClick={handleRetake}
                    style={{ width: '170px' }}
                  >
                    Chụp lại
                  </button>
                  
                  <button 
                    className="button-cam"
                    onClick={sendToRecognition}
                    disabled={isProcessing}
                    style={{ width: '170px' }}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Nhận diện'}
                  </button>
                </>
              )}
              
              <button 
                className="button-cam" 
                onClick={onClose}
                style={{ 
                  backgroundColor: '#f44336', 
                  width: !capturedImage ? '170px' : 'auto'
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiemDanhCameraA;