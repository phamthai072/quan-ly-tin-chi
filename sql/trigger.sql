-- chặn đăng ký vào học kỳ cũ hoặc mới

-- tạo mã gv
CREATE TRIGGER trg_gv_gen_ma
ON giang_vien
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @stt INT;
    DECLARE @new_ma_gv NVARCHAR(20);

    -- Lấy số thứ tự tiếp theo
    SELECT @stt = ISNULL(MAX(CAST(RIGHT(ma_gv, LEN(ma_gv)-2) AS INT)), 0) + 1
    FROM giang_vien;

    -- Tạo mã giảng viên
    SET @new_ma_gv = 'GV' + RIGHT('000' + CAST(@stt AS NVARCHAR(4)), 4);

    -- Chèn bản ghi
    INSERT INTO giang_vien(ma_gv, ho_ten_gv, ma_khoa, don_gia)
    SELECT @new_ma_gv, ho_ten_gv, ma_khoa, don_gia FROM inserted;
END;



-- tạo mã sv
-- Mã sinh viên phải thể hiện được thông tin về khóa đào tạo, khoa đào tạo, loại hình đào tạo. 
-- CD D25 CN 001 - Cao Dang = CD
-- DH D26 CN 001 - Dai Hoc = DH


IF OBJECT_ID('trg_sinh_vien_gen_ma_sv', 'TR') IS NOT NULL
    DROP TRIGGER trg_sinh_vien_gen_ma_sv;
GO


CREATE TRIGGER trg_sinh_vien_gen_ma_sv
ON sinh_vien
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ma_chuyen_nganh NVARCHAR(10);
    DECLARE @ma_khoa NVARCHAR(10);
    DECLARE @ma_khoa_hoc NVARCHAR(10);
    DECLARE @he_dao_tao NVARCHAR(20);
    DECLARE @prefix NVARCHAR(50);
    DECLARE @stt INT;
    DECLARE @new_ma_sv NVARCHAR(50);

    -- Lấy thông tin bản ghi (giả định insert 1 row)
    SELECT TOP 1 
        @ma_chuyen_nganh = i.ma_chuyen_nganh,
        @ma_khoa_hoc = i.ma_khoa_hoc,
        @he_dao_tao = i.he_dao_tao
    FROM inserted i;

    -- Lấy mã khoa từ chuyên ngành
    SELECT @ma_khoa = ma_khoa
    FROM chuyen_nganh
    WHERE ma_chuyen_nganh = @ma_chuyen_nganh;

    -- Mapping hệ đào tạo
    DECLARE @ma_he NVARCHAR(5);
    SET @ma_he = CASE 
                    WHEN @he_dao_tao = N'cao đẳng' THEN 'CD'
                    WHEN @he_dao_tao = N'đại học' THEN 'DH'
                    ELSE 'KH' -- fallback
                 END

    -- Tạo prefix: CD + D25 + CNTT
    SET @prefix = @ma_he + @ma_khoa_hoc + @ma_khoa

    -- Lấy số thứ tự max
    SELECT @stt = ISNULL(MAX(CAST(RIGHT(ma_sv, 3) AS INT)), 0) + 1
    FROM sinh_vien
    WHERE ma_sv LIKE @prefix + '%'

    -- Ghép mã SV: VD "DH D26 CNTT 001" -> "DHD26CNTT001"
    SET @new_ma_sv = @prefix + RIGHT('000' + CAST(@stt AS NVARCHAR(3)), 3)

    -- Thực hiện insert
    INSERT INTO sinh_vien(ma_sv, ma_chuyen_nganh, ma_khoa_hoc, ho_ten_sv, he_dao_tao)
    SELECT @new_ma_sv, ma_chuyen_nganh, ma_khoa_hoc, ho_ten_sv, he_dao_tao
    FROM inserted
END;
GO




-- tạo mã mh
-- Mã của môn học phải thể hiện được thông tin về chuyên ngành và khoa quản lý. 
-- mã mh = mã chuyên nganh + sst (001 to 999) + mã khoa 

IF OBJECT_ID('trg_mon_hoc_gen_ma_mh', 'TR') IS NOT NULL
    DROP TRIGGER trg_mon_hoc_gen_ma_mh;
GO

CREATE TRIGGER trg_mon_hoc_gen_ma_mh
ON mon_hoc
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ma_khoa NVARCHAR(10);
    DECLARE @ma_chuyen_nganh NVARCHAR(10);
    DECLARE @stt INT;
    DECLARE @prefix NVARCHAR(50);
    DECLARE @new_ma_mh NVARCHAR(50);

    -- Lấy thông tin bản ghi được insert (giả định 1 row/lần)
    SELECT TOP 1 
        @ma_chuyen_nganh = i.ma_chuyen_nganh
    FROM inserted i;

    -- Lấy mã khoa từ chuyên ngành
    SELECT @ma_khoa = ma_khoa
    FROM chuyen_nganh
    WHERE ma_chuyen_nganh = @ma_chuyen_nganh;

    -- Lấy số thứ tự lớn nhất trong cùng chuyên ngành + khoa
    SELECT @stt = ISNULL(MAX(CAST(SUBSTRING(ma_mh, LEN(@ma_chuyen_nganh) + 1, 3) AS INT)), 0) + 1
    FROM mon_hoc
    WHERE ma_mh LIKE @ma_chuyen_nganh + '%' + @ma_khoa;

    -- Ghép mã môn học: VD "HTTT001CNTT"
    SET @new_ma_mh = @ma_chuyen_nganh 
                     + RIGHT('000' + CAST(@stt AS NVARCHAR(3)), 3) 
                     + @ma_khoa;

    -- Thực hiện insert
    INSERT INTO mon_hoc(ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai)
    SELECT @new_ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai
    FROM inserted;
END;
GO





USE QuanLyTinChi;
GO

-- ## 5. Trigger: **Ngăn giảng viên dạy quá 8 lớp trong một học kỳ**

-- Trigger kiểm tra: Giảng viên không được dạy quá 8 lớp trong một học kỳ
CREATE TRIGGER trg_giang_vien_gioi_han_8_lop
ON lop_hoc_phan
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT i.ma_gv, lhp.ma_hoc_ky, COUNT(*) AS so_lop
        FROM inserted i
        JOIN lop_hoc_phan lhp ON i.ma_gv = lhp.ma_gv AND i.ma_hoc_ky = lhp.ma_hoc_ky
        GROUP BY i.ma_gv, lhp.ma_hoc_ky
        HAVING COUNT(*) > 8
    )
    BEGIN
        RAISERROR(N'Mỗi giảng viên chỉ được dạy tối đa 8 lớp trong một học kỳ.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;


-- ## 7. Trigger: **Ngăn hai lớp học trùng giờ tại cùng một phòng**

-- Trigger kiểm tra: Hai lớp không được trùng giờ trong cùng một phòng
CREATE TRIGGER trg_lich_khong_trung_phong
ON lich_hoc
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN lich_hoc lh
          ON i.ma_phong = lh.ma_phong
         AND i.thu = lh.thu
         AND (
                (i.tiet_bat_dau BETWEEN lh.tiet_bat_dau AND lh.tiet_ket_thuc)
             OR (i.tiet_ket_thuc BETWEEN lh.tiet_bat_dau AND lh.tiet_ket_thuc)
             OR (lh.tiet_bat_dau BETWEEN i.tiet_bat_dau AND i.tiet_ket_thuc)
             )
         AND i.ma_lop_hp <> lh.ma_lop_hp
    )
    BEGIN
        RAISERROR(N'Phòng học đã bị trùng giờ với lớp khác.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;


/* ===============================================
   File: trg_no_delete_constraints.sql
   Mục đích: Định nghĩa các trigger chống xóa dữ liệu
   Áp dụng cho các bảng: khoa, chuyen_nganh, lop, mon_hoc
   Phương án: Chặn xóa nếu còn dữ liệu liên quan
   =============================================== */

-------------------------------------------------
-- 1. Trigger chống xóa Khoa
--    - Không cho xóa Khoa nếu còn Chuyên ngành
-------------------------------------------------
IF OBJECT_ID('trg_no_delete_khoa', 'TR') IS NOT NULL
    DROP TRIGGER trg_no_delete_khoa;
GO

CREATE TRIGGER trg_no_delete_khoa
ON khoa
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu còn chuyên ngành thuộc khoa đang bị xóa → báo lỗi
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN chuyen_nganh c ON d.ma_khoa = c.ma_khoa
    )
    BEGIN
        RAISERROR (N'Không thể xóa Khoa vì còn Chuyên ngành thuộc khoa này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Nếu không vướng ràng buộc → thực hiện xóa
    DELETE FROM khoa
    WHERE ma_khoa IN (SELECT ma_khoa FROM deleted);
END;
GO


-------------------------------------------------
-- 2. Trigger chống xóa Chuyên ngành
--    - Không cho xóa nếu còn Lớp hoặc Môn học
-------------------------------------------------
IF OBJECT_ID('trg_no_delete_chuyen_nganh', 'TR') IS NOT NULL
    DROP TRIGGER trg_no_delete_chuyen_nganh;
GO

CREATE TRIGGER trg_no_delete_chuyen_nganh
ON chuyen_nganh
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu còn lớp thuộc chuyên ngành
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN lop l ON d.ma_chuyen_nganh = l.ma_chuyen_nganh
    )
    BEGIN
        RAISERROR (N'Không thể xóa Chuyên ngành vì còn Lớp thuộc chuyên ngành này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Nếu còn môn học thuộc chuyên ngành
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN mon_hoc m ON d.ma_chuyen_nganh = m.ma_chuyen_nganh
    )
    BEGIN
        RAISERROR (N'Không thể xóa Chuyên ngành vì còn Môn học thuộc chuyên ngành này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE FROM chuyen_nganh
    WHERE ma_chuyen_nganh IN (SELECT ma_chuyen_nganh FROM deleted);
END;
GO




-- ===============================================
-- Trigger sinh mã lớp học phần tự động
-- ===============================================
CREATE TRIGGER trg_lop_hoc_phan_gen_ma
ON lop_hoc_phan
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Chèn nhiều bản ghi cũng được
    INSERT INTO lop_hoc_phan(ma_lop_hp, ma_mh, ma_gv, ma_hoc_ky, ma_phong)
    SELECT 
        -- Sinh mã LHP với số thứ tự tự tăng
        'LHP' + RIGHT('000' + CAST(
            ISNULL((
                SELECT MAX(CAST(SUBSTRING(ma_lop_hp, 4, LEN(ma_lop_hp)) AS INT))
                FROM lop_hoc_phan
            ), 0) 
            + ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) 
            AS NVARCHAR(10)), 3),
        i.ma_mh,
        i.ma_gv,
        i.ma_hoc_ky,
        i.ma_phong
    FROM inserted i;
END;
GO


