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