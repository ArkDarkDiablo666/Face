from rest_framework import serializers
from .models import Khoa, Nganh, Lop, Sinhvien, Giaovien, Monhoc, Diemdanh

class KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoa
        fields = '__all__'

class NganhSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nganh
        fields = '__all__'

class LopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lop
        fields = '__all__'

class SinhvienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sinhvien
        fields = '__all__'

class GiaovienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Giaovien
        fields = '__all__'

class MonhocSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monhoc
        fields = '__all__'

class DiemdanhSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diemdanh
        fields = '__all__'
