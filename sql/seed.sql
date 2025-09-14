-- ===============================================
-- SEED DATA cho Database Quản lý tín chỉ
-- ===============================================
USE QuanLyTinChi;
GO

-- ===============================================
-- 1. Bảng KHOA
-- ===============================================
INSERT INTO khoa (ma_khoa, ten_khoa) VALUES
('CNT', N'Công nghệ thông tin'),
('KTE', N'Kinh tế'),
('NNG', N'Ngôn ngữ'),
('TOA', N'Toán học'),
('VLY', N'Vật lý');

-- ===============================================
-- 2. Bảng CHUYÊN NGÀNH
-- ===============================================
INSERT INTO chuyen_nganh (ma_chuyen_nganh, ten_chuyen_nganh, ma_khoa) VALUES
-- Khoa CNTT
('AI', N'Trí tuệ nhân tạo', 'CNT'),
('HT', N'Hệ thống thông tin', 'CNT'),
('AT', N'An toàn thông tin', 'CNT'),
('PM', N'Phần mềm', 'CNT'),
-- Khoa Kinh tế
('QT', N'Quản trị kinh doanh', 'KTE'),
('TC', N'Tài chính ngân hàng', 'KTE'),
('KT', N'Kế toán', 'KTE'),
-- Khoa Ngôn ngữ
('TA', N'Tiếng Anh', 'NNG'),
('TH', N'Tiếng Hàn', 'NNG'),
('TN', N'Tiếng Nhật', 'NNG'),
-- Khoa Toán
('TU', N'Toán ứng dụng', 'TOA'),
('TT', N'Thống kê', 'TOA'),
-- Khoa Vật lý
('VL', N'Vật lý lý thuyết', 'VLY'),
('VU', N'Vật lý ứng dụng', 'VLY');

-- ===============================================
-- 3. Bảng KHÓA HỌC
-- ===============================================
INSERT INTO khoa_hoc (ma_khoa_hoc, ten_khoa_hoc, nam_bat_dau) VALUES
('K18', N'Khóa 2018-2022', 2018),
('K19', N'Khóa 2019-2023', 2019),
('K20', N'Khóa 2020-2024', 2020),
('K21', N'Khóa 2021-2025', 2021),
('K22', N'Khóa 2022-2026', 2022);

-- ===============================================
-- 4. Bảng GIẢNG VIÊN
-- ===============================================
INSERT INTO giang_vien (ma_gv, ho_ten_gv, ma_khoa, don_gia) VALUES
-- Khoa CNTT
('GV001', N'Nguyễn Văn Tuấn', 'CNT', 200000),
('GV002', N'Lê Thị Hoa', 'CNT', 220000),
('GV003', N'Phạm Minh Đức', 'CNT', 210000),
('GV004', N'Trần Thị Lan', 'CNT', 190000),
-- Khoa Kinh tế
('GV005', N'Hoàng Văn Nam', 'KTE', 180000),
('GV006', N'Nguyễn Thị Bình', 'KTE', 185000),
('GV007', N'Lê Minh Quang', 'KTE', 175000),
-- Khoa Ngôn ngữ
('GV008', N'Smith John', 'NNG', 170000),
('GV009', N'Nguyễn Thị Mai', 'NNG', 165000),
('GV010', N'Park Min Jun', 'NNG', 168000),
-- Khoa Toán
('GV011', N'Vũ Văn Bình', 'TOA', 195000),
('GV012', N'Đặng Thị Hương', 'TOA', 200000),
-- Khoa Vật lý
('GV013', N'Nguyễn Minh Tâm', 'VLY', 205000),
('GV014', N'Lê Văn Hùng', 'VLY', 190000);

-- ===============================================
-- 5. Bảng PHÒNG HỌC
-- ===============================================
INSERT INTO phong_hoc (ma_phong, ten_phong, suc_chua) VALUES
('A101', N'A101', 50),
('A102', N'A102', 45),
('A103', N'A103', 60),
('B201', N'B201', 40),
('B202', N'B202', 55),
('B203', N'B203', 35),
('C301', N'C301', 70),
('C302', N'C302', 65),
('D401', N'D401', 30),
('D402', N'D402', 40),
('LAB01', N'Lab máy tính 1', 25),
('LAB02', N'Lab máy tính 2', 30),
('LAB03', N'Lab vật lý', 20);

-- ===============================================
-- 6. Bảng HỌC KỲ
-- ===============================================
INSERT INTO hoc_ky (ma_hk, ten_hk, nam_hoc, ngay_bat_dau, ngay_ket_thuc) VALUES
('HK1_2324', N'Học kỳ 1', N'2023-2024', '2023-09-04', '2024-01-12'),
('HK2_2324', N'Học kỳ 2', N'2023-2024', '2024-02-19', '2024-06-21'),
('HK1_2425', N'Học kỳ 1', N'2024-2025', '2024-09-02', '2025-01-10'),
('HK2_2425', N'Học kỳ 2', N'2024-2025', '2025-02-17', '2025-06-20'),
('HK1_2526', N'Học kỳ 1', N'2025-2026', '2025-09-16', '2026-01-24'),
('HK2_2526', N'Học kỳ 2', N'2025-2026', '2026-03-02', '2026-07-03');

-- ===============================================
-- 7. Bảng MÔN HỌC
-- Quy tắc mã: [Mã khoa - 3 chữ][Mã chuyên ngành - 2 chữ][Loại môn - 2 chữ][Số thứ tự - 4 số]
-- Loại môn: CB = Cơ bản, CN = Chuyên ngành
-- ===============================================
INSERT INTO mon_hoc (ma_mh, ten_mh, so_tin_chi, ma_khoa, loai) VALUES
-- Môn cơ bản chung
('CNTAICB0001', N'Toán cao cấp A1', 3, 'CNT', N'cơ bản'),
('CNTAICB0002', N'Toán cao cấp A2', 3, 'CNT', N'cơ bản'),
('CNTAICB0003', N'Toán rời rạc', 3, 'CNT', N'cơ bản'),
('CNTAICB0004', N'Cấu trúc dữ liệu và giải thuật', 4, 'CNT', N'cơ bản'),
('CNTAICB0005', N'Lập trình hướng đối tượng', 3, 'CNT', N'cơ bản'),
('CNTAICB0006', N'Cơ sở dữ liệu', 3, 'CNT', N'cơ bản'),
('CNTAICB0007', N'Mạng máy tính', 3, 'CNT', N'cơ bản'),
('CNTAICB0008', N'Hệ điều hành', 3, 'CNT', N'cơ bản'),

-- Môn chuyên ngành AI
('CNTAICN0001', N'Nhập môn trí tuệ nhân tạo', 3, 'CNT', N'chuyên ngành'),
('CNTAICN0002', N'Học máy', 4, 'CNT', N'chuyên ngành'),
('CNTAICN0003', N'Học sâu', 4, 'CNT', N'chuyên ngành'),
('CNTAICN0004', N'Xử lý ngôn ngữ tự nhiên', 3, 'CNT', N'chuyên ngành'),
('CNTAICN0005', N'Thị giác máy tính', 4, 'CNT', N'chuyên ngành'),

-- Môn chuyên ngành Hệ thống thông tin
('CNTHTCN0001', N'Phân tích thiết kế hệ thống', 3, 'CNT', N'chuyên ngành'),
('CNTHTCN0002', N'Quản trị cơ sở dữ liệu', 3, 'CNT', N'chuyên ngành'),
('CNTHTCN0003', N'Phát triển ứng dụng web', 4, 'CNT', N'chuyên ngành'),

-- Môn chuyên ngành An toàn thông tin
('CNTATCN0001', N'Mật mã học', 3, 'CNT', N'chuyên ngành'),
('CNTATCN0002', N'An toàn mạng', 3, 'CNT', N'chuyên ngành'),

-- Môn Kinh tế
('KTEQTCB0001', N'Kinh tế vi mô', 3, 'KTE', N'cơ bản'),
('KTEQTCB0002', N'Kinh tế vĩ mô', 3, 'KTE', N'cơ bản'),
('KTEQTCB0003', N'Toán kinh tế', 3, 'KTE', N'cơ bản'),
('KTEQTCN0001', N'Quản trị chiến lược', 3, 'KTE', N'chuyên ngành'),
('KTEQTCN0002', N'Marketing căn bản', 3, 'KTE', N'chuyên ngành'),

-- Môn Tiếng Anh
('NNGTACB0001', N'Tiếng Anh cơ bản 1', 3, 'NNG', N'cơ bản'),
('NNGTACB0002', N'Tiếng Anh cơ bản 2', 3, 'NNG', N'cơ bản'),
('NNGTACN0001', N'Ngữ pháp tiếng Anh', 3, 'NNG', N'chuyên ngành'),
('NNGTACN0002', N'Tiếng Anh thương mại', 3, 'NNG', N'chuyên ngành');

-- ===============================================
-- 8. Bảng MÔN TIÊN QUYẾT
-- ===============================================
INSERT INTO mon_tien_quyet (ma_mh, ma_mh_tien_quyet) VALUES
-- Toán cao cấp A2 cần học A1 trước
('CNTAICB0002', 'CNTAICB0001'),
-- Cấu trúc dữ liệu cần toán rời rạc
('CNTAICB0004', 'CNTAICB0003'),
-- Lập trình OOP cần cấu trúc dữ liệu
('CNTAICB0005', 'CNTAICB0004'),
-- Cơ sở dữ liệu cần lập trình OOP
('CNTAICB0006', 'CNTAICB0005'),
-- Học máy cần nhập môn AI
('CNTAICN0002', 'CNTAICN0001'),
-- Học sâu cần học máy
('CNTAICN0003', 'CNTAICN0002'),
-- NLP cần học máy
('CNTAICN0004', 'CNTAICN0002'),
-- Computer Vision cần học sâu
('CNTAICN0005', 'CNTAICN0003'),
-- Quản trị CSDL cần CSDL cơ bản
('CNTHTCN0002', 'CNTAICB0006'),
-- Phát triển web cần CSDL
('CNTHTCN0003', 'CNTAICB0006'),
-- Kinh tế vĩ mô cần vi mô
('KTEQTCB0002', 'KTEQTCB0001'),
-- Marketing cần kinh tế vi mô
('KTEQTCN0002', 'KTEQTCB0001'),
-- Tiếng Anh cơ bản 2 cần cơ bản 1
('NNGTACB0002', 'NNGTACB0001'),
-- Ngữ pháp cần tiếng Anh cơ bản 2
('NNGTACN0001', 'NNGTACB0002'),
-- Tiếng Anh thương mại cần ngữ pháp
('NNGTACN0002', 'NNGTACN0001');

-- ===============================================
-- 9. Bảng LỚP HỌC PHẦN
-- ===============================================
INSERT INTO lop_hoc_phan (ma_lop_hp, ma_mh, ma_gv, ma_hoc_ky, ma_phong) VALUES
-- Học kỳ 1 năm 2025-2026 (học kỳ hiện tại)
('LHP001', 'CNTAICB0001', 'GV001', 'HK1_2526', 'A101'),
('LHP002', 'CNTAICB0003', 'GV002', 'HK1_2526', 'A102'),
('LHP003', 'CNTAICB0004', 'GV003', 'HK1_2526', 'LAB01'),
('LHP004', 'CNTAICB0005', 'GV004', 'HK1_2526', 'LAB02'),
('LHP005', 'CNTAICN0001', 'GV001', 'HK1_2526', 'B201'),
('LHP006', 'KTEQTCB0001', 'GV005', 'HK1_2526', 'C301'),
('LHP007', 'KTEQTCB0003', 'GV006', 'HK1_2526', 'C302'),
('LHP008', 'NNGTACB0001', 'GV008', 'HK1_2526', 'B202'),
('LHP009', 'NNGTACB0002', 'GV009', 'HK1_2526', 'B203'),

-- Học kỳ 2 năm 2024-2025 (vừa kết thúc)
('LHP010', 'CNTAICB0002', 'GV001', 'HK2_2425', 'A101'),
('LHP011', 'CNTAICB0006', 'GV002', 'HK2_2425', 'LAB01'),
('LHP012', 'CNTAICB0007', 'GV003', 'HK2_2425', 'A103'),
('LHP013', 'CNTAICN0002', 'GV001', 'HK2_2425', 'LAB02'),
('LHP014', 'CNTHTCN0001', 'GV004', 'HK2_2425', 'B201'),
('LHP015', 'KTEQTCB0002', 'GV005', 'HK2_2425', 'C301'),
('LHP016', 'KTEQTCN0001', 'GV007', 'HK2_2425', 'C302'),
('LHP017', 'NNGTACN0001', 'GV008', 'HK2_2425', 'B202'),

-- Học kỳ 1 năm 2024-2025
('LHP018', 'CNTAICB0001', 'GV002', 'HK1_2425', 'A102'),
('LHP019', 'CNTAICB0004', 'GV003', 'HK1_2425', 'LAB01'),
('LHP020', 'KTEQTCB0001', 'GV006', 'HK1_2425', 'C301'),

-- Học kỳ 1 năm 2023-2024 (cho học lại)
('LHP021', 'CNTAICB0001', 'GV002', 'HK1_2324', 'A102'),
('LHP022', 'CNTAICB0004', 'GV003', 'HK1_2324', 'LAB01'),
('LHP023', 'KTEQTCB0001', 'GV006', 'HK1_2324', 'C301');

-- ===============================================
-- 10. Bảng LỊCH HỌC
-- ===============================================
INSERT INTO lich_hoc (ma_lop_hp, thu, tiet_bat_dau, tiet_ket_thuc, ma_phong) VALUES
-- Lịch học kỳ 1 năm 2025-2026 (học kỳ hiện tại)
('LHP001', 2, 1, 3, 'A101'),    -- Thứ 2, tiết 1-3
('LHP001', 5, 4, 6, 'A101'),    -- Thứ 6, tiết 4-6
('LHP002', 3, 1, 3, 'A102'),    -- Thứ 4, tiết 1-3
('LHP002', 6, 7, 9, 'A102'),    -- Thứ 7, tiết 7-9
('LHP003', 2, 7, 10, 'LAB01'),  -- Thứ 2, tiết 7-10
('LHP004', 4, 7, 9, 'LAB02'),   -- Thứ 5, tiết 7-9
('LHP005', 3, 4, 6, 'B201'),    -- Thứ 4, tiết 4-6
('LHP006', 2, 4, 6, 'C301'),    -- Thứ 2, tiết 4-6
('LHP007', 5, 1, 3, 'C302'),    -- Thứ 6, tiết 1-3
('LHP008', 4, 1, 3, 'B202'),    -- Thứ 5, tiết 1-3
('LHP009', 6, 1, 3, 'B203'),    -- Thứ 7, tiết 1-3

-- Lịch học kỳ 2 năm 2024-2025 (đã kết thúc)
('LHP010', 2, 1, 3, 'A101'),    -- Thứ 2, tiết 1-3
('LHP010', 5, 4, 6, 'A101'),    -- Thứ 6, tiết 4-6
('LHP011', 3, 7, 9, 'LAB01'),   -- Thứ 4, tiết 7-9
('LHP012', 4, 4, 6, 'A103'),    -- Thứ 5, tiết 4-6
('LHP013', 2, 7, 10, 'LAB02'),  -- Thứ 2, tiết 7-10
('LHP014', 3, 1, 3, 'B201'),    -- Thứ 4, tiết 1-3
('LHP015', 5, 1, 3, 'C301'),    -- Thứ 6, tiết 1-3
('LHP016', 6, 4, 6, 'C302'),    -- Thứ 7, tiết 4-6
('LHP017', 4, 1, 3, 'B202'),    -- Thứ 5, tiết 1-3

-- Lịch học kỳ 1 năm 2024-2025
('LHP018', 2, 4, 6, 'A102'),    -- Thứ 2, tiết 4-6
('LHP019', 4, 7, 10, 'LAB01'),  -- Thứ 5, tiết 7-10
('LHP020', 3, 4, 6, 'C301'),    -- Thứ 4, tiết 4-6

-- Lịch học kỳ 1 năm 2023-2024
('LHP021', 2, 4, 6, 'A102'),    -- Thứ 2, tiết 4-6
('LHP022', 4, 7, 10, 'LAB01'),  -- Thứ 5, tiết 7-10
('LHP023', 3, 4, 6, 'C301');    -- Thứ 4, tiết 4-6

-- ===============================================
-- 11. Bảng SINH VIÊN
-- Quy tắc mã: [Loại hình - 2 chữ][Khóa học - 2 số][Mã khoa - 3 chữ][Số thứ tự - 4 số]
-- Loại hình: ĐH = Đại học, CĐ = Cao đẳng
-- ===============================================
INSERT INTO sinh_vien (ma_sv, ma_chuyen_nganh, ma_khoa_hoc, ho_ten_sv, he_dao_tao) VALUES
-- Sinh viên khóa 20 - Đại học
('DH20CNT0001', 'AI', 'K20', N'Nguyễn Văn An', N'đại học'),
('DH20CNT0002', 'AI', 'K20', N'Lê Thị Bình', N'đại học'),
('DH20CNT0003', 'HT', 'K20', N'Phạm Minh Cường', N'đại học'),
('DH20CNT0004', 'AT', 'K20', N'Trần Thị Dung', N'đại học'),
('DH20CNT0005', 'AI', 'K20', N'Hoàng Văn Em', N'đại học'),
('DH20KTE0001', 'QT', 'K20', N'Vũ Thị Phương', N'đại học'),
('DH20KTE0002', 'TC', 'K20', N'Đặng Văn Giang', N'đại học'),
('DH20NNG0001', 'TA', 'K20', N'Nguyễn Thị Hạnh', N'đại học'),

-- Sinh viên khóa 21 - Đại học
('DH21CNT0001', 'AI', 'K21', N'Lê Văn Tuấn', N'đại học'),
('DH21CNT0002', 'HT', 'K21', N'Phạm Thị Lan', N'đại học'),
('DH21CNT0003', 'PM', 'K21', N'Trần Văn Nam', N'đại học'),
('DH21KTE0001', 'QT', 'K21', N'Hoàng Thị Oanh', N'đại học'),
('DH21NNG0001', 'TA', 'K21', N'Vũ Văn Phúc', N'đại học'),

-- Sinh viên khóa 22 - Đại học và Cao đẳng
('DH22CNT0001', 'AI', 'K22', N'Đặng Thị Quỳnh', N'đại học'),
('DH22CNT0002', 'HT', 'K22', N'Nguyễn Văn Sơn', N'đại học'),
('CĐ22CNT0001', 'PM', 'K22', N'Lê Thị Tâm', N'cao đẳng'),
('CĐ22KTE0001', 'KT', 'K22', N'Phạm Văn Ước', N'cao đẳng'),
('CĐ22NNG0001', 'TA', 'K22', N'Trần Thị Vân', N'cao đẳng'),

-- Sinh viên khóa 19 (đã tốt nghiệp)
('DH19CNT0001', 'AI', 'K19', N'Hoàng Văn Xuân', N'đại học'),
('DH19CNT0002', 'HT', 'K19', N'Vũ Thị Yến', N'đại học'),
('DH19KTE0001', 'QT', 'K19', N'Đặng Văn Zun', N'đại học');

-- ===============================================
-- 12. Bảng KẾT QUẢ
-- ===============================================
INSERT INTO ket_qua (ma_lop_hp, ma_sv, diem) VALUES
-- Kết quả học kỳ 1 năm 2025-2026 (học kỳ hiện tại - chưa có điểm cuối kỳ)
('LHP001', 'DH20CNT0001', NULL), -- Chưa có điểm
('LHP001', 'DH21CNT0001', NULL),
('LHP001', 'DH22CNT0001', NULL),
('LHP002', 'DH20CNT0001', NULL),
('LHP003', 'DH21CNT0002', NULL),
('LHP005', 'DH20CNT0001', NULL),
('LHP005', 'DH21CNT0001', NULL),

-- Kết quả học kỳ 2 năm 2024-2025 (đã hoàn thành)
('LHP010', 'DH20CNT0001', 8.0),
('LHP010', 'DH20CNT0002', 7.5),
('LHP010', 'DH21CNT0001', 9.0),

('LHP011', 'DH20CNT0001', 8.5),
('LHP011', 'DH20CNT0003', 7.0),
('LHP011', 'DH21CNT0002', 6.0),

('LHP012', 'DH20CNT0001', 7.5),
('LHP012', 'DH20CNT0002', 8.0),
('LHP012', 'DH20CNT0003', 7.5),

('LHP013', 'DH20CNT0001', 9.5), -- Xuất sắc môn AI
('LHP013', 'DH20CNT0005', 8.5),
('LHP013', 'DH21CNT0001', 8.0),

('LHP014', 'DH20CNT0003', 8.0),
('LHP014', 'DH21CNT0002', 7.5),

('LHP015', 'DH20KTE0001', 6.5),
('LHP015', 'DH20KTE0002', 8.0),
('LHP015', 'DH21KTE0001', 7.0),

('LHP016', 'DH20KTE0001', 7.5),
('LHP016', 'DH20KTE0002', 8.5),

('LHP017', 'DH20NNG0001', 9.0),
('LHP017', 'DH21NNG0001', 8.5),

-- Kết quả học kỳ 1 năm 2024-2025
('LHP018', 'DH20CNT0001', 8.5),
('LHP018', 'DH20CNT0002', 7.0),
('LHP018', 'DH20CNT0003', 6.5),
('LHP018', 'DH21CNT0001', 9.0),
('LHP018', 'DH22CNT0001', 5.5), -- Điểm yếu

('LHP019', 'DH20CNT0001', 9.0),
('LHP019', 'DH20CNT0002', 6.0), -- Học lại, cải thiện từ 5.5
('LHP019', 'DH21CNT0002', 7.5),

('LHP020', 'DH20KTE0001', 7.0),
('LHP020', 'DH20KTE0002', 8.5),
('LHP020', 'DH21KTE0001', 6.5),

-- Kết quả học lại (học kỳ 1 năm 2023-2024)
('LHP021', 'DH22CNT0001', 6.0), -- Học lại, điểm vẫn yếu
('LHP022', 'DH20CNT0002', 7.0), -- Học lại, cải thiện
('LHP023', 'DH21KTE0001', 7.5); -- Học lại, cải thiện

GO
