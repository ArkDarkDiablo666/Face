from rest_framework import serializers
from .models import Khoa, Nganh, Lop, Sinhvien, Giaovien, Monhoc, Diemdanh

class KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoa
        fields = '__all__'

class NganhSerializer(serializers.ModelSerializer):
    makhoa = serializers.CharField()

    class Meta:
        model = Nganh
        fields = '__all__'

    def create(self, validated_data):
        ma_khoa = validated_data.pop('makhoa')
        khoa = Khoa.objects.get(makhoa=ma_khoa)
        return Nganh.objects.create(makhoa=khoa, **validated_data)

    def update(self, instance, validated_data):
        ma_khoa = validated_data.pop('makhoa', None)
        if ma_khoa:
            instance.makhoa = Khoa.objects.get(makhoa=ma_khoa)
        instance.tennganh = validated_data.get('tennganh', instance.tennganh)
        instance.manganh = validated_data.get('manganh', instance.manganh)
        instance.save()
        return instance

class LopSerializer(serializers.ModelSerializer):
    manganh = serializers.CharField()

    class Meta:
        model = Lop
        fields = '__all__'

    def create(self, validated_data):
        ma_nganh = validated_data.pop('manganh')
        nganh = Nganh.objects.get(manganh=ma_nganh)
        return Lop.objects.create(manganh=nganh, **validated_data)

    def update(self, instance, validated_data):
        ma_nganh = validated_data.pop('manganh', None)
        if ma_nganh:
            instance.manganh = Nganh.objects.get(manganh=ma_nganh)
        instance.tenlop = validated_data.get('tenlop', instance.tenlop)
        instance.malop = validated_data.get('malop', instance.malop)
        instance.save()
        return instance

class SinhvienSerializer(serializers.ModelSerializer):
    manganh = serializers.CharField()
    makhoa = serializers.CharField()
    malop = serializers.CharField()

    class Meta:
        model = Sinhvien
        fields = '__all__'

    def create(self, validated_data):
        makhoa = validated_data.pop('makhoa')
        manganh = validated_data.pop('manganh')
        malop = validated_data.pop('malop')

        khoa = Khoa.objects.get(makhoa=makhoa)
        nganh = Nganh.objects.get(manganh=manganh)
        lop = Lop.objects.get(malop=malop)

        return Sinhvien.objects.create(makhoa=khoa, manganh=nganh, malop=lop, **validated_data)

    def update(self, instance, validated_data):
        for field in ['makhoa', 'manganh', 'malop']:
            value = validated_data.pop(field, None)
            if value:
                related_model = {'makhoa': Khoa, 'manganh': Nganh, 'malop': Lop}[field]
                setattr(instance, field, related_model.objects.get(**{field: value}))
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class GiaovienSerializer(serializers.ModelSerializer):
    makhoa = serializers.CharField()

    class Meta:
        model = Giaovien
        fields = '__all__'

    def create(self, validated_data):
        makhoa = validated_data.pop('makhoa')
        khoa = Khoa.objects.get(makhoa=makhoa)
        return Giaovien.objects.create(makhoa=khoa, **validated_data)

    def update(self, instance, validated_data):
        makhoa = validated_data.pop('makhoa', None)
        if makhoa:
            instance.makhoa = Khoa.objects.get(makhoa=makhoa)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class MonhocSerializer(serializers.ModelSerializer):
    makhoa = serializers.CharField()
    magiaovien = serializers.CharField()

    class Meta:
        model = Monhoc
        fields = '__all__'

    def create(self, validated_data):
        makhoa = validated_data.pop('makhoa')
        magiaovien = validated_data.pop('magiaovien')

        khoa = Khoa.objects.get(makhoa=makhoa)
        giaovien = Giaovien.objects.get(magiaovien=magiaovien)

        return Monhoc.objects.create(makhoa=khoa, magiaovien=giaovien, **validated_data)

    def update(self, instance, validated_data):
        for field in ['makhoa', 'magiaovien']:
            value = validated_data.pop(field, None)
            if value:
                related_model = {'makhoa': Khoa, 'magiaovien': Giaovien}[field]
                setattr(instance, field, related_model.objects.get(**{field: value}))
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class DiemdanhSerializer(serializers.ModelSerializer):
    masinhvien = serializers.CharField()
    mamon = serializers.CharField()
    magiaovien = serializers.CharField()
    malop = serializers.CharField()

    class Meta:
        model = Diemdanh
        fields = '__all__'

    def create(self, validated_data):
        masinhvien = validated_data.pop('masinhvien')
        mamon = validated_data.pop('mamon')
        magiaovien = validated_data.pop('magiaovien')
        malop = validated_data.pop('malop')

        sv = Sinhvien.objects.get(masinhvien=masinhvien)
        mh = Monhoc.objects.get(mamon=mamon)
        gv = Giaovien.objects.get(magiaovien=magiaovien)
        lop = Lop.objects.get(malop=malop)

        return Diemdanh.objects.create(
            masinhvien=sv, mamon=mh, magiaovien=gv, malop=lop, **validated_data
        )

    def update(self, instance, validated_data):
        for field in ['masinhvien', 'mamon', 'magiaovien', 'malop']:
            value = validated_data.pop(field, None)
            if value:
                model_map = {
                    'masinhvien': Sinhvien,
                    'mamon': Monhoc,
                    'magiaovien': Giaovien,
                    'malop': Lop,
                }
                setattr(instance, field, model_map[field].objects.get(**{field: value}))
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
