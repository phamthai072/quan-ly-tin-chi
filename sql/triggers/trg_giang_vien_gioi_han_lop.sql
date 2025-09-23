-- ## 5. Trigger: **Ngăn giảng viên dạy quá X lớp trong một học kỳ**

-- Trigger kiểm tra: Giảng viên không được dạy quá X lớp trong một học kỳ
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