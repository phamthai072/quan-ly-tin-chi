ALTER TABLE khoa ADD CONSTRAINT CK_khoa_ma_khoa_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_khoa))) > 0);

ALTER TABLE chuyen_nganh ADD CONSTRAINT CK_chuyen_nganh_ma_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_chuyen_nganh))) > 0);

ALTER TABLE khoa_hoc ADD CONSTRAINT CK_khoa_hoc_ma_khoa_hoc_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_khoa_hoc))) > 0);

ALTER TABLE giang_vien ADD CONSTRAINT CK_giang_vien_ma_gv_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_gv))) > 0);

ALTER TABLE phong_hoc ADD CONSTRAINT CK_phong_hoc_ma_phong_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_phong))) > 0);

ALTER TABLE hoc_ky ADD CONSTRAINT CK_hoc_ky_ma_hk_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_hk))) > 0);

ALTER TABLE mon_hoc ADD CONSTRAINT CK_mon_hoc_ma_mh_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_mh))) > 0);

ALTER TABLE lop_hoc_phan ADD CONSTRAINT CK_lop_hoc_phan_ma_lop_hp_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_lop_hp))) > 0);

ALTER TABLE sinh_vien ADD CONSTRAINT CK_sinh_vien_ma_sv_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_sv))) > 0);

-- lich_hoc
ALTER TABLE lich_hoc ADD CONSTRAINT CK_lich_hoc_ma_khong_rong CHECK (LEN (LTRIM (RTRIM (ma_lich_hoc))) > 0);

-- tiet_bat_dau <= tiet_ket_thuc
ALTER TABLE lich_hoc ADD CONSTRAINT CK_lich_hoc_tiet CHECK (tiet_bat_dau <= tiet_ket_thuc);

-- Không cho phép tồn tại 2 lớp học phần trùng cùng môn học, giảng viên, học kỳ và phòng học.
ALTER TABLE lop_hoc_phan ADD CONSTRAINT UQ_LopHocPhan UNIQUE (ma_mh, ma_gv, ma_hoc_ky, ma_phong);

-- mỗi sinh viên chỉ có thể đăng ký một lần duy nhất một lớp học phần.
ALTER TABLE ket_qua ADD CONSTRAINT UQ_ket_qua UNIQUE (ma_sv, ma_lop_hp);