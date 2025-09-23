CREATE PROCEDURE proc_huy_dang_ky  @ma_sv CHAR(15),
    @ma_lop_hp CHAR(10)
AS BEGIN
    SET NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Kiểm tra sinh viên tồn tại
IF NOT EXISTS (
    SELECT
        1
    FROM
        sinh_vien
    WHERE
        ma_sv = @ma_sv
) BEGIN RAISERROR(N'Mã sinh viên không tồn tại: %s', 16, 1, @ma_sv);

RETURN;

END -- Kiểm tra lớp học phần tồn tại
IF NOT EXISTS (
    SELECT
        1
    FROM
        lop_hoc_phan
    WHERE
        ma_lop_hp = @ma_lop_hp
) BEGIN RAISERROR(
    N'Lớp học phần không tồn tại: %s',
    16,
    1,
    @ma_lop_hp
);

RETURN;

END -- Kiểm tra sinh viên đã đăng ký lớp chưa
IF NOT EXISTS (
    SELECT
        1
    FROM
        ket_qua
    WHERE
        ma_sv = @ma_sv
        AND ma_lop_hp = @ma_lop_hp
) BEGIN RAISERROR(
    N'Sinh viên chưa đăng ký lớp học phần này: %s',
    16,
    1,
    @ma_lop_hp
);

RETURN;

END -- Xóa bản ghi đăng ký
DELETE FROM
    ket_qua
WHERE
    ma_sv = @ma_sv
    AND ma_lop_hp = @ma_lop_hp;

COMMIT TRANSACTION;

END TRY BEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

DECLARE @ErrorMessage NVARCHAR(4000),
@ErrorSeverity INT,
@ErrorState INT;

SELECT
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH
END;