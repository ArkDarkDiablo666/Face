import cv2
import os
import time
from datetime import datetime

def capture_images():
    # Yêu cầu người dùng nhập tên thư mục
    folder_name = input("Nhập tên thư mục để lưu ảnh: ")
    
    # Tạo đường dẫn đầy đủ
    base_path = "F:\\Image"
    folder_path = os.path.join(base_path, folder_name)
    
    # Kiểm tra và tạo thư mục nếu chưa tồn tại
    if not os.path.exists(base_path):
        os.makedirs(base_path)
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    else:
        print(f"Thư mục {folder_name} đã tồn tại. Ảnh mới sẽ được thêm vào thư mục này.")
    
    # Mở camera
    cap = cv2.VideoCapture(0)  # 0 là camera mặc định
    
    if not cap.isOpened():
        print("Không thể mở camera.")
        return
    
    print("Camera đã được mở. Chuẩn bị chụp 150 ảnh...")
    print("Nhấn 'q' để dừng chụp.")
    
    # Chụp 150 ảnh
    count = 0
    while count < 150:
        # Đọc frame từ camera
        ret, frame = cap.read()
        
        if not ret:
            print("Không thể đọc frame từ camera. Đang thoát...")
            break
        
        # Hiển thị frame
        cv2.imshow('Camera Capture', frame)
        
        # Tạo tên file với timestamp để đảm bảo tên duy nhất
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        file_name = f"image_{count+1:03d}_{timestamp}.jpg"
        file_path = os.path.join(folder_path, file_name)
        
        # Lưu ảnh
        cv2.imwrite(file_path, frame)
        count += 1
        print(f"Đã chụp ảnh {count}/150: {file_name}")
        
        # Đợi một chút giữa các lần chụp (khoảng 200ms)
        key = cv2.waitKey(200)
        if key == ord('q'):
            print("Người dùng đã dừng chụp.")
            break
    
    # Giải phóng tài nguyên
    cap.release()
    cv2.destroyAllWindows()
    
    print(f"Hoàn thành! Đã chụp {count} ảnh và lưu vào thư mục F:\\Image\\{folder_name}")

if __name__ == "__main__":
    capture_images()