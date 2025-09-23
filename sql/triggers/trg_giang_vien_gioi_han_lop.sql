-- ## 5. Trigger: **Ngăn giảng viên dạy quá X lớp trong một học kỳ**

-- Trigger kiểm tra: Giảng viên không được dạy quá X lớp trong một học kỳ
CREATE TRIGGER trg_giang_vien_gioi_han_lop
ON lop_hoc_phan
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @X INT = 8;

    -- get X from cau_hinh table if needed
    SELECT @X = CAST(gia_tri AS INT) FROM cau_hinh WHERE ten = 'GV_ToiDa_Lop_HK';

    IF EXISTS (
        SELECT i.ma_gv, lhp.ma_hoc_ky, COUNT(*) AS so_lop
        FROM inserted i
        JOIN lop_hoc_phan lhp ON i.ma_gv = lhp.ma_gv AND i.ma_hoc_ky = lhp.ma_hoc_ky
        GROUP BY i.ma_gv, lhp.ma_hoc_ky
        HAVING COUNT(*) > @X
    )
    BEGIN
        RAISERROR(N'Mỗi giảng viên chỉ được dạy tối đa %d lớp trong một học kỳ.', 16, 1, @X);
        ROLLBACK TRANSACTION;
    END
END;