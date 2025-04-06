import cv2
import face_recognition
import os
import numpy as np
import pickle

def load_images_from_folders(root_path):
    images = []
    labels = []
    
    for person_name in os.listdir(root_path):
        person_path = os.path.join(root_path, person_name)
        if not os.path.isdir(person_path):
            continue  # Bỏ qua nếu không phải thư mục
        
        for image_name in os.listdir(person_path):
            image_path = os.path.join(person_path, image_name)
            image = cv2.imread(image_path)
            if image is None:
                print(f"Lỗi: Không thể đọc ảnh {image_name} trong thư mục {person_name}")
                continue
            images.append(image)
            labels.append(person_name)  # Gán nhãn là tên thư mục
    
    return images, labels

def encode_faces(images, labels):
    encodeList = []
    labelList = []
    
    for idx, img in enumerate(images):
        if img is None or img.size == 0:
            print(f"Lỗi: Ảnh thứ {idx} không hợp lệ hoặc bị trống.")
            continue
        try:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encodings = face_recognition.face_encodings(img)
            if len(encodings) > 0:
                encodeList.append(encodings[0])
                labelList.append(labels[idx])
            else:
                print(f"Lỗi: Không tìm thấy khuôn mặt trong ảnh thứ {idx}. Bỏ qua ảnh này.")
        except Exception as e:
            print(f"Lỗi xử lý ảnh thứ {idx}: {e}")
    
    return encodeList, labelList

# Đoạn 1: Mã hóa và lưu dữ liệu nếu có thay đổi
root_path = r"F:\Image"
cached_file = r"F:\encodings.pkl"
cached_labels_file = r"F:\labels.pkl"

needs_update = True
if os.path.exists(cached_labels_file):
    with open(cached_labels_file, "rb") as f:
        old_labels = pickle.load(f)
    
    current_labels = set(os.listdir(root_path))
    if current_labels == set(old_labels):
        needs_update = False

if needs_update:
    images, labels = load_images_from_folders(root_path)
    print(f"Đã tải {len(images)} ảnh từ {len(set(labels))} thư mục.")
    encodeListKnown, labelList = encode_faces(images, labels)
    
    with open(cached_file, "wb") as f:
        pickle.dump((encodeListKnown, labelList), f)
    with open(cached_labels_file, "wb") as f:
        pickle.dump(labels, f)
    print("Mã hóa và lưu khuôn mặt thành công!")
else:
    print("Không có thay đổi, sử dụng dữ liệu đã mã hóa.")

# Đoạn 2: Nhận diện từ video

def recognize_faces_from_video(encodeListKnown, labelList, video_source=0):
    cap = cv2.VideoCapture(video_source)
    if not cap.isOpened():
        print("Lỗi: Không thể mở nguồn video.")
        return
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Lỗi: Không thể đọc khung hình từ video.")
            break
        
        frameS = cv2.resize(frame, (0, 0), None, fx=0.5, fy=0.5)
        frameS = cv2.cvtColor(frameS, cv2.COLOR_BGR2RGB)
        
        face_locations = face_recognition.face_locations(frameS)
        encode_current_frame = face_recognition.face_encodings(frameS, face_locations)
        
        for encodeFace, faceLoc in zip(encode_curfrent_frame, face_locations):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            matchIndex = np.argmin(faceDis) if len(faceDis) > 0 else None
            
            if matchIndex is not None and matches[matchIndex] and faceDis[matchIndex] < 0.50:
                name = labelList[matchIndex].upper()
            else:
                name = "UNKNOWN"
            
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 2, x2 * 2, y2 * 2, x1 * 2
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
        
        cv2.imshow('Face Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

# Load dữ liệu đã mã hóa từ file
with open(cached_file, "rb") as f:
    encodeListKnown, labelList = pickle.load(f)

recognize_faces_from_video(encodeListKnown, labelList)
