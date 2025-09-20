-- ======================
-- 1. Bảng CHUYÊN NGÀNH
-- ======================
-- Tìm chuyên ngành theo khoa
CREATE INDEX IX_chuyen_nganh_ma_khoa ON chuyen_nganh(ma_khoa);

-- ======================
-- 2. Bảng GIẢNG VIÊN
-- ======================
-- Tìm giảng viên theo khoa
CREATE INDEX IX_giang_vien_ma_khoa ON giang_vien(ma_khoa);

-- ======================
-- 3. Bảng MÔN HỌC
-- ======================
-- Tìm môn học theo chuyên ngành
CREATE INDEX IX_mon_hoc_ma_chuyen_nganh ON mon_hoc(ma_chuyen_nganh);

-- Loại môn học (cơ bản/chuyên ngành) thường dùng để lọc
CREATE INDEX IX_mon_hoc_loai ON mon_hoc(loai);

-- ======================
-- 4. Bảng MÔN TIÊN QUYẾT
-- ======================
-- Nhanh cho việc kiểm tra điều kiện học
CREATE INDEX IX_mon_tien_quyet_ma_mh ON mon_tien_quyet(ma_mh);

CREATE INDEX IX_mon_tien_quyet_ma_mh_tien_quyet ON mon_tien_quyet(ma_mh_tien_quyet);

-- ======================
-- 5. Bảng LỚP HỌC PHẦN
-- ======================
-- Join theo môn học
CREATE INDEX IX_lop_hoc_phan_ma_mh ON lop_hoc_phan(ma_mh);

-- Join theo giảng viên
CREATE INDEX IX_lop_hoc_phan_ma_gv ON lop_hoc_phan(ma_gv);

-- Join theo học kỳ
CREATE INDEX IX_lop_hoc_phan_ma_hoc_ky ON lop_hoc_phan(ma_hoc_ky);

-- Join theo phòng học (phân tích trùng giờ, tần suất sử dụng)
CREATE INDEX IX_lop_hoc_phan_ma_phong ON lop_hoc_phan(ma_phong);

-- ======================
-- 6. Bảng LỊCH HỌC
-- ======================
-- Tìm lịch học theo lớp học phần
CREATE INDEX IX_lich_hoc_ma_lop_hp ON lich_hoc(ma_lop_hp);

-- ======================
-- 7. Bảng SINH VIÊN
-- ======================
-- Join theo chuyên ngành
CREATE INDEX IX_sinh_vien_ma_chuyen_nganh ON sinh_vien(ma_chuyen_nganh);

-- Join theo khóa học
CREATE INDEX IX_sinh_vien_ma_khoa_hoc ON sinh_vien(ma_khoa_hoc);

-- ======================
-- 8. Bảng KẾT QUẢ
-- ======================
-- Thống kê điểm theo sinh viên
CREATE INDEX IX_ket_qua_ma_sv ON ket_qua(ma_sv);

-- Thống kê điểm theo lớp học phần
CREATE INDEX IX_ket_qua_ma_lop_hp ON ket_qua(ma_lop_hp);