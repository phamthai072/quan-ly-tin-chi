-- ===============================================
-- TẠO DATABASE Quản lý tín chỉ
-- ===============================================
CREATE DATABASE QuanLyTinChi;
GO

-- Sử dụng database vừa tạo
USE QuanLyTinChi;
GO

-- ===============================================
-- 1. Bảng KHOA: Lưu thông tin các khoa trong trường
--    Ví dụ: CNTT, Kinh tế, Ngôn ngữ...
-- ===============================================
CREATE TABLE khoa (
    ma_khoa NVARCHAR(10) PRIMARY KEY,        -- Mã khoa, khóa chính
    ten_khoa NVARCHAR(100) NOT NULL      -- Tên khoa
);

-- ===============================================
-- 2. Bảng CHUYÊN NGÀNH: Lưu các chuyên ngành thuộc một khoa
--    Ví dụ: CNTT -> AI, Hệ thống thông tin...
-- ===============================================
CREATE TABLE chuyen_nganh (
    ma_chuyen_nganh NVARCHAR(10) PRIMARY KEY,       -- Mã chuyên ngành
    ten_chuyen_nganh NVARCHAR(100) NOT NULL,    -- Tên chuyên ngành
    ma_khoa NVARCHAR(10) NOT NULL,                  -- Khoa quản lý chuyên ngành
    FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa) -- Ràng buộc khóa ngoại
);

-- ===============================================
-- 3. Bảng KHÓA HỌC: Lưu các khóa học theo năm
--    Ví dụ: K18 (2018), K19 (2019)...
-- ===============================================
CREATE TABLE khoa_hoc (
    ma_khoa_hoc NVARCHAR(10) PRIMARY KEY,           -- Mã khóa học
    ten_khoa_hoc NVARCHAR(100) NOT NULL,        -- Tên khóa học (ví dụ: Khóa 2018-2022)
    nam_bat_dau INT NOT NULL                    -- Năm bắt đầu khóa học
);

-- ===============================================
-- 4. Bảng GIẢNG VIÊN: Lưu thông tin giảng viên
-- ===============================================
CREATE TABLE giang_vien (
    ma_gv NVARCHAR(10) PRIMARY KEY,                 -- Mã giảng viên
    ho_ten_gv NVARCHAR(100) NOT NULL,           -- Họ tên giảng viên
    ma_khoa NVARCHAR(10) NOT NULL,                  -- Giảng viên thuộc khoa nào
    don_gia DECIMAL(12,2) NOT NULL,             -- Đơn giá dạy (tính lương)
    FOREIGN KEY (ma_khoa) REFERENCES khoa(ma_khoa)
);

-- ===============================================
-- 5. Bảng PHÒNG HỌC: Lưu thông tin phòng học
-- ===============================================
CREATE TABLE phong_hoc (
    ma_phong NVARCHAR(10) PRIMARY KEY,              -- Mã phòng học
    ten_phong NVARCHAR(50) NOT NULL,            -- Tên phòng (ví dụ: A101)
    suc_chua INT NOT NULL CHECK (suc_chua > 0)  -- Sức chứa > 0
);

-- ===============================================
-- 6. Bảng HỌC KỲ: Lưu thông tin các học kỳ
-- ===============================================
CREATE TABLE hoc_ky (
    ma_hk NVARCHAR(10) PRIMARY KEY,                 -- Mã học kỳ
    ten_hk NVARCHAR(50) NOT NULL,               -- Tên học kỳ (Ví dụ: Học kỳ 1, Học kỳ 2)
    nam_hoc NVARCHAR(20) NOT NULL,              -- Năm học (Ví dụ: 2024, 2025)
    ngay_bat_dau DATE NOT NULL,                 -- Ngày bắt đầu học kỳ
    ngay_ket_thuc DATE NOT NULL                 -- Ngày kết thúc học kỳ
);

-- ===============================================
-- 7. Bảng MÔN HỌC: Lưu danh sách các môn học
-- ===============================================
CREATE TABLE mon_hoc (
    ma_mh NVARCHAR(20) PRIMARY KEY,                 -- Mã môn học
    ten_mh NVARCHAR(100) NOT NULL,              -- Tên môn học
    so_tin_chi INT NOT NULL CHECK (so_tin_chi > 0), -- Số tín chỉ > 0
    ma_chuyen_nganh NVARCHAR(10) NOT NULL,                  -- Môn học thuộc khoa nào
    loai NVARCHAR(20) NOT NULL CHECK (loai IN (N'cơ bản', N'chuyên ngành')), -- Loại môn học
    FOREIGN KEY (ma_chuyen_nganh) REFERENCES chuyen_nganh(ma_chuyen_nganh)
);

-- ===============================================
-- 8. Bảng MÔN TIÊN QUYẾT: Lưu quan hệ tiên quyết giữa các môn
-- ===============================================
CREATE TABLE mon_tien_quyet (
    ma_mh NVARCHAR(20) NOT NULL,                    -- Môn học hiện tại
    ma_mh_tien_quyet NVARCHAR(20) NOT NULL,         -- Môn học tiên quyết
    PRIMARY KEY (ma_mh, ma_mh_tien_quyet),      -- Khóa chính (kết hợp 2 cột)
    FOREIGN KEY (ma_mh) REFERENCES mon_hoc(ma_mh),
    FOREIGN KEY (ma_mh_tien_quyet) REFERENCES mon_hoc(ma_mh)
);

-- ===============================================
-- 9. Bảng LỚP HỌC PHẦN: Mỗi lớp học phần thuộc một môn, một giảng viên, học kỳ và phòng học
-- ===============================================
CREATE TABLE lop_hoc_phan (
    ma_lop_hp NVARCHAR(10) PRIMARY KEY,             -- Mã lớp học phần
    ma_mh NVARCHAR(20) NOT NULL,                    -- Môn học
    ma_gv NVARCHAR(10) NOT NULL,                    -- Giảng viên phụ trách
    ma_hoc_ky NVARCHAR(10) NOT NULL,                -- Học kỳ mở lớp
    ma_phong NVARCHAR(10) NOT NULL,                 -- Phòng học
    FOREIGN KEY (ma_mh) REFERENCES mon_hoc(ma_mh),
    FOREIGN KEY (ma_gv) REFERENCES giang_vien(ma_gv),
    FOREIGN KEY (ma_hoc_ky) REFERENCES hoc_ky(ma_hk),
    FOREIGN KEY (ma_phong) REFERENCES phong_hoc(ma_phong)
);

-- ===============================================
-- 10. Bảng LỊCH HỌC: Lưu lịch học chi tiết của từng lớp học phần
-- ===============================================
CREATE TABLE lich_hoc (
    id INT IDENTITY(1,1) PRIMARY KEY,           -- ID tự tăng
    ma_lop_hp NVARCHAR(10) NOT NULL,                -- Lớp học phần
    thu TINYINT NOT NULL CHECK (thu BETWEEN 2 AND 8), -- Thứ trong tuần (2=Thứ 2 ... 8=Chủ nhật)
    tiet_bat_dau INT NOT NULL,                  -- Tiết bắt đầu
    tiet_ket_thuc INT NOT NULL,                 -- Tiết kết thúc
    ma_phong NVARCHAR(10) NOT NULL,                 -- Phòng học
    FOREIGN KEY (ma_lop_hp) REFERENCES lop_hoc_phan(ma_lop_hp),
    FOREIGN KEY (ma_phong) REFERENCES phong_hoc(ma_phong),
    CHECK (tiet_bat_dau < tiet_ket_thuc)        -- Tiết bắt đầu phải nhỏ hơn tiết kết thúc
);

-- ===============================================
-- 11. Bảng SINH VIÊN: Lưu thông tin sinh viên
-- ===============================================
CREATE TABLE sinh_vien (
    ma_sv NVARCHAR(15) PRIMARY KEY,                 -- Mã sinh viên
    ma_chuyen_nganh NVARCHAR(10) NOT NULL,          -- Chuyên ngành
    ma_khoa_hoc NVARCHAR(10) NOT NULL,              -- Khóa học
    ho_ten_sv NVARCHAR(100) NOT NULL,           -- Họ tên sinh viên
    he_dao_tao NVARCHAR(20) NOT NULL CHECK (he_dao_tao IN (N'cao đẳng', N'đại học')), -- Hệ đào tạo
    FOREIGN KEY (ma_chuyen_nganh) REFERENCES chuyen_nganh(ma_chuyen_nganh),
    FOREIGN KEY (ma_khoa_hoc) REFERENCES khoa_hoc(ma_khoa_hoc)
);

-- ===============================================
-- 12. Bảng KẾT QUẢ: Lưu điểm của sinh viên theo từng lớp học phần
-- ===============================================
CREATE TABLE ket_qua (
    ma_lop_hp NVARCHAR(10) NOT NULL,                -- Lớp học phần
    ma_sv NVARCHAR(15) NOT NULL,                    -- Sinh viên
    diem DECIMAL(4,2) NULL CHECK (diem BETWEEN 0 AND 10), -- Điểm (0-10), cho phép NULL nếu chưa có
    PRIMARY KEY (ma_lop_hp, ma_sv),             -- Khóa chính kép (mỗi SV chỉ có 1 kết quả trong lớp)
    FOREIGN KEY (ma_lop_hp) REFERENCES lop_hoc_phan(ma_lop_hp),
    FOREIGN KEY (ma_sv) REFERENCES sinh_vien(ma_sv)
);
GO



