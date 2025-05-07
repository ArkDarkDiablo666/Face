from django.db import models
from django.utils import timezone

class Khoa(models.Model):
    makhoa = models.CharField(primary_key=True, max_length=10)
    tenkhoa = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'KHOA'


class Nganh(models.Model):
    manganh = models.CharField(primary_key=True, max_length=10)
    tennganh = models.CharField(max_length=100)
    makhoa = models.ForeignKey(Khoa, models.DO_NOTHING, db_column='makhoa')

    class Meta:
        managed = False
        db_table = 'NGANH'


class Lop(models.Model):
    malop = models.CharField(primary_key=True, max_length=10)
    tenlop = models.CharField(max_length=100)
    manganh = models.ForeignKey(Nganh, models.DO_NOTHING, db_column='manganh')

    class Meta:
        managed = False
        db_table = 'LOP'


class Sinhvien(models.Model):
    masinhvien = models.CharField(primary_key=True, max_length=11)
    hoten = models.CharField(max_length=100)
    gioitinh = models.CharField(max_length=3)
    ngaysinh = models.DateField()
    sdt = models.CharField(unique=True, max_length=10)
    ngaydangky = models.DateTimeField()
    matkhau = models.CharField(max_length=50)
    email = models.CharField(unique=True, max_length=255)
    quyen = models.CharField(max_length=100)
    manganh = models.ForeignKey(Nganh, models.DO_NOTHING, db_column='manganh')
    malop = models.ForeignKey(Lop, models.DO_NOTHING, db_column='malop')
    makhoa = models.ForeignKey(Khoa, models.DO_NOTHING, db_column='makhoa')

    class Meta:
        managed = False
        db_table = 'SINHVIEN'


class Giangvien(models.Model):
    magiangvien = models.CharField(primary_key=True, max_length=10)
    hoten = models.CharField(max_length=100)
    gioitinh = models.CharField(max_length=3)
    ngaysinh = models.DateField(null=True, blank=True)
    sdt = models.CharField(unique=True, max_length=10)
    matkhau = models.CharField(max_length=64)
    email = models.CharField(unique=True, max_length=255)
    quyen = models.CharField(max_length=100)
    makhoa = models.ForeignKey(Khoa, models.DO_NOTHING, db_column='makhoa')

    class Meta:
        managed = False
        db_table = 'GIANGVIEN'


class Monhoc(models.Model):
    mamon = models.CharField(primary_key=True, max_length=50)
    tenmon = models.CharField(max_length=100)
    malop = models.ForeignKey('Lop', models.DO_NOTHING, db_column='malop')
    magiangvien = models.ForeignKey('Giangvien', models.DO_NOTHING, db_column='magiangvien')

    class Meta:
        managed = False  
        db_table = 'MONHOC'
        unique_together = (('mamon', 'malop', 'magiangvien'),)

class Diemdanh(models.Model):
    madiemdanh = models.CharField(primary_key=True, max_length=50)
    masinhvien = models.ForeignKey(
        'Sinhvien', 
        models.DO_NOTHING, 
        db_column='masinhvien'
    )
    thoigiandiemdanh = models.DateTimeField(default=timezone.now)
    trangthai = models.CharField(
        max_length=100,
        choices=[('Có mặt', 'Có mặt'), ('Vắng mặt', 'Vắng mặt')]
    )
    mamon = models.ForeignKey(
        'Monhoc', 
        models.DO_NOTHING,
        to_field='mamon',
        db_column='mamon'
    )
    magiangvien = models.ForeignKey(
        'Giangvien',
        models.DO_NOTHING,
        db_column='magiangvien'
    )
    malop = models.ForeignKey(
        'Lop',
        models.DO_NOTHING,
        db_column='malop'
    )

    class Meta:
        managed = False
        db_table = 'DIEMDANH'
