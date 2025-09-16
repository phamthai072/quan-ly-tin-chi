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


