import dlib

print("Dlib dùng CUDA:", dlib.DLIB_USE_CUDA)
print("Số GPU khả dụng:", dlib.cuda.get_num_devices())