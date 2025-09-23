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