-- chặn đăng ký vào học kỳ cũ hoặc mới
-- tạo mã sv
-- tạo mã mh

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


-------------------------------------------------
-- 3. Trigger chống xóa Lớp
--    - Không cho xóa nếu còn Sinh viên trong lớp
-------------------------------------------------
IF OBJECT_ID('trg_no_delete_lop', 'TR') IS NOT NULL
    DROP TRIGGER trg_no_delete_lop;
GO

CREATE TRIGGER trg_no_delete_lop
ON lop
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu còn sinh viên thuộc lớp
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN sinh_vien sv ON d.ma_lop = sv.ma_lop
    )
    BEGIN
        RAISERROR (N'Không thể xóa Lớp vì còn Sinh viên trong lớp.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE FROM lop
    WHERE ma_lop IN (SELECT ma_lop FROM deleted);
END;
GO


-------------------------------------------------
-- 4. Trigger chống xóa Môn học
--    - Không cho xóa nếu còn Kết quả học tập hoặc Sinh viên đã đăng ký
-------------------------------------------------
IF OBJECT_ID('trg_no_delete_mon_hoc', 'TR') IS NOT NULL
    DROP TRIGGER trg_no_delete_mon_hoc;
GO

CREATE TRIGGER trg_no_delete_mon_hoc
ON mon_hoc
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu còn kết quả học tập liên quan đến môn học
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN ket_qua kq ON d.ma_mh = kq.ma_mh
    )
    BEGIN
        RAISERROR (N'Không thể xóa Môn học vì còn Kết quả học tập liên quan.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Nếu còn đăng ký học của sinh viên
    IF EXISTS (
        SELECT 1
        FROM deleted d
        JOIN dang_ky_hoc dk ON d.ma_mh = dk.ma_mh
    )
    BEGIN
        RAISERROR (N'Không thể xóa Môn học vì còn Sinh viên đang đăng ký.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE FROM mon_hoc
    WHERE ma_mh IN (SELECT ma_mh FROM deleted);
END;
GO
