CREATE DATABASE sushiX;
GO
USE sushiX;
GO

CREATE TABLE TAIKHOAN (
    MaTaiKhoan INT IDENTITY (1, 1) PRIMARY KEY,
    Username NVARCHAR (50) NOT NULL UNIQUE,
    Password NVARCHAR (256) NOT NULL,
    VaiTro NVARCHAR (20) NOT NULL CHECK (
        VaiTro IN (
            N'KhachHang',
            N'NhanVien',
            N'QuanLy'
        )
    ),
    MaKhachHang INT NULL,
    MaNhanVien INT NULL
);
GO

CREATE TABLE KHUVUC (
    MaKhuVuc INT IDENTITY (1, 1),
    TenKhuVuc NVARCHAR (100) NOT NULL
);
GO

CREATE TABLE CHINHANH (
    MaChiNhanh INT IDENTITY (1, 1),
    MaKhuVuc INT NOT NULL,
    QuanLyChiNhanh INT NULL,
    TenChiNhanh NVARCHAR (100) NOT NULL,
    DiaChi NVARCHAR (255) NOT NULL,
    ThoiGianMoCua TIME NOT NULL,
    ThoiGianDongCua TIME NOT NULL,
    SoDienThoaiChiNhanh NVARCHAR (20) NOT NULL,
    CoBaiDoXeMay BIT NOT NULL,
    CoBaiDoOto BIT NOT NULL
);
GO

CREATE TABLE BOPHAN (
    MaBoPhan INT IDENTITY (1, 1),
    TenBoPhan NVARCHAR (100) NOT NULL,
    Luong DECIMAL(15, 2) NOT NULL
);
GO

CREATE TABLE NHANVIEN (
    MaNhanVien INT IDENTITY (1, 1),
    HoTen NVARCHAR (100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh NVARCHAR (10) NOT NULL,
    MaBoPhan INT NOT NULL,
    MaChiNhanh INT NOT NULL
);
GO

CREATE TABLE LICHSULAMVIEC (
    MaNhanVien INT NOT NULL,
    MaChiNhanh INT NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NULL
);
GO

CREATE TABLE KHACHHANG (
    MaKhachHang INT IDENTITY (1, 1),
    HoTen NVARCHAR (100) NOT NULL,
    SoDienThoai NVARCHAR (20) NOT NULL,
    Email NVARCHAR (100) NULL,
    SoCCCD NVARCHAR (50) NOT NULL,
    GioiTinh NVARCHAR (10) NOT NULL,
    KhachOnline BIT NOT NULL
);
GO

CREATE TABLE THETHANHVIEN (
    MaSoThe INT IDENTITY (1, 1),
    MaKhachHang INT NOT NULL,
    NgayLap DATE NOT NULL,
    LoaiThe NVARCHAR (20) NOT NULL,
    TinhTrangThe NVARCHAR (20) NOT NULL,
    DiemTichLuy INT NOT NULL
);
GO

CREATE TABLE LICHSUTRUYCAP (
    MaKhachHang INT NOT NULL,
    ThoiDiemTruyCap DATETIME NOT NULL,
    ThoiGianTruyCap INT NULL
);
GO

CREATE TABLE MUCTHUCDON (
    MaMucThucDon INT IDENTITY (1, 1),
    TenMucThucDon NVARCHAR (100) NOT NULL
);
GO

CREATE TABLE MONAN (
    MaMon INT IDENTITY (1, 1),
    MaMucThucDon INT NOT NULL,
    TenMon NVARCHAR (100) NOT NULL,
    GiaTien DECIMAL(15, 2) NOT NULL
);
GO

CREATE TABLE CHINHANH_MON (
    MaChiNhanh INT NOT NULL,
    MaMon INT NOT NULL,
    CoPhucVu BIT NOT NULL
);
GO

CREATE TABLE BAN (
    MaChiNhanh INT NOT NULL,
    STTBan INT NOT NULL,
    TrangThai NVARCHAR (50) NOT NULL
);
GO

CREATE TABLE DATBAN (
    MaDatBan INT IDENTITY (1, 1),
    MaKhachHang INT NOT NULL,
    MaChiNhanh INT NOT NULL,
    STTBan INT NOT NULL,
    NgayDat DATE NOT NULL,
    GioDen DATETIME NOT NULL,
    SoLuongKhach INT NOT NULL,
    GhiChu NVARCHAR (255) NULL
);
GO

CREATE TABLE THONGTINPHIEUDATMON (
    MaPhieu INT IDENTITY (1, 1),
    NgayLap DATETIME NOT NULL,
    MaChiNhanh INT NOT NULL,
    STTBan INT NOT NULL,
    MaNV INT,
    MaKH INT NULL
);
GO

CREATE TABLE CHITIETPHIEUDATMON (
    MaPhieu INT NOT NULL,
    STT INT NOT NULL,
    MaMon INT NOT NULL,
    SoLuong INT NOT NULL
);
GO

CREATE TABLE HOADON (
    MaHoaDon INT IDENTITY (1, 1),
    NgayLap DATETIME NOT NULL,
    TongTien DECIMAL(15, 2) NOT NULL,
    TienGiamGia DECIMAL(15, 2) NOT NULL,
    MaPhieu INT
);
GO

CREATE TABLE DANHGIA (
    MaHoaDon INT NOT NULL,
    DiemPhucVu INT,
    DiemViTri INT,
    DiemChatLuongMonAn INT,
    DiemGiaCa INT,
    DiemKhongGian INT,
    BinhLuan NVARCHAR (MAX) NULL
);
GO

-- Giả sử đang ở trong cơ sở dữ liệu SushiXDB
-- 1. KHUVUC
BULK
INSERT
    KHUVUC
FROM 'D:\ShuShiXDB\data\KHUVUC.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 2. BOPHAN
BULK
INSERT
    BOPHAN
FROM 'D:\ShuShiXDB\data\BOPHAN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 3. MUCTHUCDON
BULK
INSERT
    MUCTHUCDON
FROM 'D:\ShuShiXDB\data\MUCTHUCDON.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 4. CHINHANH
BULK
INSERT
    CHINHANH
FROM 'D:\ShuShiXDB\data\CHINHANH.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 5. NHANVIEN
BULK
INSERT
    NHANVIEN
FROM 'D:\ShuShiXDB\data\NHANVIEN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 6. LICHSULAMVIEC
BULK
INSERT
    LICHSULAMVIEC
FROM 'D:\ShuShiXDB\data\LICHSULAMVIEC.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 7. KHACHHANG
BULK
INSERT
    KHACHHANG
FROM 'D:\ShuShiXDB\data\KHACHHANG.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 8. MONAN
BULK
INSERT
    MONAN
FROM 'D:\ShuShiXDB\data\MONAN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 9. THETHANHVIEN
BULK
INSERT
    THETHANHVIEN
FROM 'D:\ShuShiXDB\data\THETHANHVIEN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 10. LICHSUTRUYCAP
BULK
INSERT
    LICHSUTRUYCAP
FROM 'D:\ShuShiXDB\data\LICHSUTRUYCAP.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 11. BAN
BULK
INSERT
    BAN
FROM 'D:\ShuShiXDB\data\BAN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 12. CHINHANH_MON
BULK
INSERT
    CHINHANH_MON
FROM 'D:\ShuShiXDB\data\CHINHANH_MON.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 13. DATBAN
BULK
INSERT
    DATBAN
FROM 'D:\ShuShiXDB\data\DATBAN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 14. THONGTINPHIEUDATMON
BULK
INSERT
    THONGTINPHIEUDATMON
FROM 'D:\ShuShiXDB\data\THONGTINPHIEUDATMON.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 15. CHITIETPHIEUDATMON
BULK
INSERT
    CHITIETPHIEUDATMON
FROM 'D:\ShuShiXDB\data\CHITIETPHIEUDATMON.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 16. HOADON
BULK
INSERT
    HOADON
FROM 'D:\ShuShiXDB\data\HOADON.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 17. DANHGIA
BULK
INSERT
    DANHGIA
FROM 'D:\ShuShiXDB\data\DANHGIA.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

-- 18. TAIKHOAN
BULK
INSERT
    TAIKHOAN
FROM 'D:\ShuShiXDB\data\TAIKHOAN.csv'
WITH (
        FIRSTROW = 2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\n',
        CODEPAGE = '65001',
        FORMAT = 'CSV'
    );

UPDATE BAN 
SET TrangThai = N'Trống'
UPDATE LICHSULAMVIEC
SET
    MaChiNhanh = nv.MaChiNhanh
FROM
    LICHSULAMVIEC lslv
    INNER JOIN NHANVIEN nv ON lslv.MaNhanVien = nv.MaNhanVien
WHERE
    lslv.NgayKetThuc IS NULL;

WITH
    DuplicateRecords AS (
        SELECT *, ROW_NUMBER() OVER (
                PARTITION BY
                    MaKhachHang
                ORDER BY MaSoThe DESC
            ) as RowNum
        FROM THETHANHVIEN
    )
DELETE FROM DuplicateRecords
WHERE
    RowNum > 1;
WITH
    DuplicateRecords AS (
        SELECT *, ROW_NUMBER() OVER (
                PARTITION BY
                    MaNhanVien
                ORDER BY NgayBatDau DESC
            ) as RowNum
        FROM LICHSULAMVIEC
    )
DELETE FROM DuplicateRecords
WHERE
    RowNum > 1;

--ADD CONSTRAINTS

-------------------
-- KHUVUC
-------------------
ALTER TABLE KHUVUC ADD CONSTRAINT PK_KHUVUC PRIMARY KEY (MaKhuVuc);

-------------------
-- CHINHANH
-------------------
ALTER TABLE CHINHANH
ADD CONSTRAINT PK_CHINHANH PRIMARY KEY (MaChiNhanh);

ALTER TABLE CHINHANH
ADD CONSTRAINT FK_CHINHANH_KHUVUC FOREIGN KEY (MaKhuVuc) REFERENCES KHUVUC (MaKhuVuc);

ALTER TABLE CHINHANH
ADD CONSTRAINT DF_CHINHANH_CoBaiDoXeMay DEFAULT(0) FOR CoBaiDoXeMay,
CONSTRAINT DF_CHINHANH_CoBaiDoOto DEFAULT(0) FOR CoBaiDoOto;

-------------------
-- BOPHAN
-------------------
ALTER TABLE BOPHAN ADD CONSTRAINT PK_BOPHAN PRIMARY KEY (MaBoPhan);

ALTER TABLE BOPHAN
ADD CONSTRAINT CHK_BOPHAN_LUONG CHECK (Luong >= 0);

-------------------
-- NHANVIEN
-------------------
ALTER TABLE NHANVIEN
ADD CONSTRAINT PK_NHANVIEN PRIMARY KEY (MaNhanVien);

ALTER TABLE NHANVIEN
ADD CONSTRAINT FK_NHANVIEN_BOPHAN FOREIGN KEY (MaBoPhan) REFERENCES BOPHAN (MaBoPhan),
CONSTRAINT FK_NHANVIEN_CHINHANH FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH (MaChiNhanh),
CONSTRAINT CHK_NHANVIEN_GioiTinh CHECK (
    GioiTinh IN (N'Nam', N'Nữ', N'Khác')
);

-------------------
-- LICHSULAMVIEC
-------------------
ALTER TABLE LICHSULAMVIEC
ADD CONSTRAINT PK_LICHSULAMVIEC PRIMARY KEY (
    MaNhanVien,
    MaChiNhanh,
    NgayBatDau
);

ALTER TABLE LICHSULAMVIEC
ADD CONSTRAINT FK_LICHSULAMVIEC_NHANVIEN FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN (MaNhanVien),
CONSTRAINT FK_LICHSULAMVIEC_CHINHANH FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH (MaChiNhanh);

-------------------
-- KHACHHANG
-------------------
ALTER TABLE KHACHHANG
ADD CONSTRAINT PK_KHACHHANG PRIMARY KEY (MaKhachHang),
CONSTRAINT UQ_KHACHHANG_SoCCCD UNIQUE (SoCCCD),
CONSTRAINT CHK_KHACHHANG_GioiTinh CHECK (
    GioiTinh IN (N'Nam', N'Nữ', N'Khác')
);

ALTER TABLE KHACHHANG
ADD CONSTRAINT DF_KHACHHANG_KhachOnline DEFAULT(0) FOR KhachOnline;

-------------------
-- THETHANHVIEN
-------------------
ALTER TABLE THETHANHVIEN
ADD CONSTRAINT PK_THETHANHVIEN PRIMARY KEY (MaSoThe),
CONSTRAINT FK_THETHANHVIEN_KHACHHANG FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG (MaKhachHang),
CONSTRAINT CHK_THETHANHVIEN_DiemTichLuy CHECK (DiemTichLuy >= 0),
CONSTRAINT CHK_THETHANHVIEN_LoaiThe CHECK (
    LoaiThe IN (N'Member', N'Silver', N'Gold')
),
CONSTRAINT CHK_THETHANHVIEN_TinhTrangThe CHECK (
    TinhTrangThe IN (N'Active', N'Inactive')
);

ALTER TABLE THETHANHVIEN
ADD CONSTRAINT DF_THETHANHVIEN_TinhTrangThe DEFAULT('Active') FOR TinhTrangThe,
CONSTRAINT DF_THETHANHVIEN_DiemTichLuy DEFAULT(0) FOR DiemTichLuy;

-------------------
-- LICHSUTRUYCAP
-------------------
ALTER TABLE LICHSUTRUYCAP
ADD CONSTRAINT FK_LICHSUTRUYCAP_KHACHHANG FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG (MaKhachHang),
CONSTRAINT CHK_LICHSUTRUYCAP_ThoiGian CHECK (ThoiGianTruyCap >= 0);

-------------------
-- MUCTHUCDON
-------------------
ALTER TABLE MUCTHUCDON
ADD CONSTRAINT PK_MUCTHUCDON PRIMARY KEY (MaMucThucDon);

-------------------
-- MONAN
-------------------
ALTER TABLE MONAN
ADD CONSTRAINT PK_MONAN PRIMARY KEY (MaMon),
CONSTRAINT FK_MONAN_MUCTHUCDON FOREIGN KEY (MaMucThucDon) REFERENCES MUCTHUCDON (MaMucThucDon),
CONSTRAINT CHK_MONAN_GiaTien CHECK (GiaTien >= 0);

-------------------
-- CHINHANH_MON
-------------------
ALTER TABLE CHINHANH_MON
ADD CONSTRAINT PK_CHINHANH_MON PRIMARY KEY (MaChiNhanh, MaMon),
CONSTRAINT FK_CHINHANH_MON_CHINHANH FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH (MaChiNhanh),
CONSTRAINT FK_CHINHANH_MON_MONAN FOREIGN KEY (MaMon) REFERENCES MONAN (MaMon);

ALTER TABLE CHINHANH_MON
ADD CONSTRAINT DF_CHINHANH_MON_CoPhucVu DEFAULT(0) FOR CoPhucVu;

-------------------
-- BAN
-------------------
ALTER TABLE BAN
ADD CONSTRAINT PK_BAN PRIMARY KEY (MaChiNhanh, STTBan),
CONSTRAINT FK_BAN_CHINHANH FOREIGN KEY (MaChiNhanh) REFERENCES CHINHANH (MaChiNhanh);

-------------------
-- DATBAN
-------------------
ALTER TABLE DATBAN
ADD CONSTRAINT PK_DATBAN PRIMARY KEY (MaDatBan),
CONSTRAINT FK_DATBAN_KHACHHANG FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG (MaKhachHang),
CONSTRAINT FK_DATBAN_BAN FOREIGN KEY (MaChiNhanh, STTBan) REFERENCES BAN (MaChiNhanh, STTBan),
CONSTRAINT CHK_DATBAN_SoLuongKhach CHECK (SoLuongKhach > 0);

-------------------
-- THONGTINPHIEUDATMON
-------------------
ALTER TABLE THONGTINPHIEUDATMON
ADD CONSTRAINT PK_THONGTINPHIEUDATMON PRIMARY KEY (MaPhieu),
CONSTRAINT FK_THONGTINPHIEUDATMON_BAN FOREIGN KEY (MaChiNhanh, STTBan) REFERENCES BAN (MaChiNhanh, STTBan),
CONSTRAINT FK_THONGTINPHIEUDATMON_NHANVIEN FOREIGN KEY (MaNV) REFERENCES NHANVIEN (MaNhanVien),
CONSTRAINT FK_THONGTINPHIEUDATMON_KHACHHANG FOREIGN KEY (MaKH) REFERENCES KHACHHANG (MaKhachHang);

-------------------
-- CHITIETPHIEUDATMON
-------------------
ALTER TABLE CHITIETPHIEUDATMON
ADD CONSTRAINT PK_CHITIETPHIEUDATMON PRIMARY KEY (MaPhieu, STT),
CONSTRAINT FK_CHITIETPHIEUDATMON_PHIEU FOREIGN KEY (MaPhieu) REFERENCES THONGTINPHIEUDATMON (MaPhieu),
CONSTRAINT FK_CHITIETPHIEUDATMON_MONAN FOREIGN KEY (MaMon) REFERENCES MONAN (MaMon),
CONSTRAINT CHK_CHITIETPHIEUDATMON_SoLuong CHECK (SoLuong > 0);

-------------------
-- HOADON
-------------------
ALTER TABLE HOADON
ADD CONSTRAINT PK_HOADON PRIMARY KEY (MaHoaDon),
CONSTRAINT FK_HOADON_THONGTINPHIEU FOREIGN KEY (MaPhieu) REFERENCES THONGTINPHIEUDATMON (MaPhieu),
CONSTRAINT CHK_HOADON_TongTien CHECK (TongTien >= 0),
CONSTRAINT CHK_HOADON_TienGiamGia CHECK (TienGiamGia >= 0);

ALTER TABLE HOADON
ADD CONSTRAINT DF_HOADON_TienGiamGia DEFAULT(0) FOR TienGiamGia;

-------------------
-- DANHGIA
-------------------
ALTER TABLE DANHGIA
ADD CONSTRAINT PK_DANHGIA PRIMARY KEY (MaHoaDon),
CONSTRAINT FK_DANHGIA_HOADON FOREIGN KEY (MaHoaDon) REFERENCES HOADON (MaHoaDon),
CONSTRAINT CHK_DANHGIA_DiemPhucVu CHECK (DiemPhucVu BETWEEN 0 AND 10),
CONSTRAINT CHK_DANHGIA_DiemViTri CHECK (DiemViTri BETWEEN 0 AND 10),
CONSTRAINT CHK_DANHGIA_DiemChatLuongMonAn CHECK (
    DiemChatLuongMonAn BETWEEN 0 AND 10
),
CONSTRAINT CHK_DANHGIA_DiemGiaCa CHECK (DiemGiaCa BETWEEN 0 AND 10),
CONSTRAINT CHK_DANHGIA_DiemKhongGian CHECK (
    DiemKhongGian BETWEEN 0 AND 10
);

ALTER TABLE TAIKHOAN
ADD CONSTRAINT FK_TAIKHOAN_KHACHHANG FOREIGN KEY (MaKhachHang) REFERENCES KHACHHANG (MaKhachHang),
CONSTRAINT FK_TAIKHOAN_NHANVIEN FOREIGN KEY (MaNhanVien) REFERENCES NHANVIEN (MaNhanVien);
GO

ALTER TABLE THONGTINPHIEUDATMON DROP CONSTRAINT FK_THONGTINPHIEUDATMON_NHANVIEN;
ALTER TABLE CHINHANH DROP CONSTRAINT IF EXISTS FK_CHINHANH_QUANLY;

ALTER TABLE THONGTINPHIEUDATMON 
ADD CONSTRAINT FK_THONGTINPHIEUDATMON_NHANVIEN 
FOREIGN KEY (MaNV) REFERENCES NHANVIEN (MaNhanVien)
ON DELETE SET NULL;


-- Add constraint for QuanLyChiNhanh if not exists
ALTER TABLE CHINHANH
ADD CONSTRAINT FK_CHINHANH_QUANLY 
FOREIGN KEY (QuanLyChiNhanh) REFERENCES NHANVIEN(MaNhanVien)
ON DELETE SET NULL;

--INDEX 
CREATE NONCLUSTERED INDEX IX_MONAN_NonClusteredIndex_TenMon ON MONAN (TenMon);

CREATE NONCLUSTERED INDEX IX_ThongTinPhieuDatMon_MaChiNhanh_STTBan
ON THONGTINPHIEUDATMON (MaChiNhanh, STTBan);

CREATE NONCLUSTERED INDEX IX_DATBAN_STTBan
ON DATBAN (STTBan);

CREATE NONCLUSTERED INDEX IX_DATBAN_NgayDat
ON DATBAN (NgayDat);

CREATE NONCLUSTERED INDEX IX_CHITIETPHIEUDATMON_MaMon
ON CHITIETPHIEUDATMON (MaMon);

CREATE NONCLUSTERED INDEX IX_HOADON_NgayLap
ON HOADON (NgayLap);

-- Create a non-clustered index on the MaPhieu column
CREATE NONCLUSTERED INDEX IX_HOADON_MaPhieu
ON HOADON (MaPhieu);