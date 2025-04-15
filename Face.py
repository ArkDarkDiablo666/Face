import os
import cv2
import pickle
import face_recognition
import numpy as np

# Cấu hình đường dẫn
IMAGE_DIR = r"F:\Image"
ENCODING_DIR = r"F:\encodings"
FINAL_ENCODING_FILE = os.path.join(ENCODING_DIR, "encodings.pkl")
TEMP_ENCODING_FILE = os.path.join(ENCODING_DIR, "temp.pkl")
CACHED_LABELS_FILE = os.path.join(ENCODING_DIR, "cached_labels.pkl")

# Tạo thư mục encodings nếu chưa tồn tại 
os.makedirs(ENCODING_DIR, exist_ok=True)

def load_images_from_folder(folder):
    images = []
    labels = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(folder, filename)
            img = cv2.imread(path)
            if img is not None:
                images.append(img)
                labels.append(os.path.basename(folder))
    return images, labels

def encode_faces(images, labels):
    encode_list = []
    encode_labels = []
    for img, label in zip(images, labels):
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        faces = face_recognition.face_locations(rgb_img)
        encodes = face_recognition.face_encodings(rgb_img, faces)
        for encode in encodes:
            encode_list.append(encode)
            encode_labels.append(label)
    return encode_list, encode_labels

def save_pickle(data, path):
    with open(path, "wb") as f:
        pickle.dump(data, f)

def load_pickle(path):
    with open(path, "rb") as f:
        return pickle.load(f)

def merge_encodings(base_file, new_encodings, new_labels):
    if os.path.exists(base_file):
        old_encodings, old_labels = load_pickle(base_file)
    else:
        old_encodings, old_labels = [], []

    merged_encodings = old_encodings + new_encodings
    merged_labels = old_labels + new_labels

    save_pickle((merged_encodings, merged_labels), base_file)
    print(f"[+] Gộp {len(new_labels)} khuôn mặt vào {base_file}")

# Đọc danh sách nhãn đã xử lý trước đó
processed_labels = []
if os.path.exists(CACHED_LABELS_FILE):
    processed_labels = load_pickle(CACHED_LABELS_FILE)

# Danh sách nhãn hiện tại
current_labels = os.listdir(IMAGE_DIR)
new_labels = [label for label in current_labels if label not in processed_labels]

if not new_labels:
    print("✅ Không có nhãn mới.")
else:
    print(f"🔍 Phát hiện nhãn mới: {new_labels}")

    all_new_encodings = []
    all_new_labels = []

    for person in new_labels:
        person_folder = os.path.join(IMAGE_DIR, person)
        images, labels = load_images_from_folder(person_folder)
        encodings, labels = encode_faces(images, labels)

        all_new_encodings.extend(encodings)
        all_new_labels.extend(labels)

    # Nếu có dữ liệu mới
    if all_new_encodings:
        # Lưu tạm vào temp.pkl
        save_pickle((all_new_encodings, all_new_labels), TEMP_ENCODING_FILE)
        print(f"💾 Đã lưu tạm {len(all_new_labels)} khuôn mặt vào temp.pkl")

        # Gộp vào encodings.pkl chính
        merge_encodings(FINAL_ENCODING_FILE, all_new_encodings, all_new_labels)

        # Xoá file tạm
        if os.path.exists(TEMP_ENCODING_FILE):
            os.remove(TEMP_ENCODING_FILE)
            print("🗑️ Đã xoá temp.pkl sau khi gộp")

        # Cập nhật nhãn đã xử lý
        processed_labels += new_labels
        save_pickle(processed_labels, CACHED_LABELS_FILE)
        print(f"✅ Đã cập nhật cached_labels.pkl")
    else:
        print("⚠️ Không phát hiện được khuôn mặt hợp lệ trong ảnh mới.")

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
        
        for encodeFace, faceLoc in zip(encode_current_frame, face_locations):
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
with open(FINAL_ENCODING_FILE, "rb") as f:
    encodeListKnown, labelList = pickle.load(f)

recognize_faces_from_video(encodeListKnown, labelList)
