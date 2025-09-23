CREATE PROCEDURE proc_them_sinh_vien @ho_ten NVARCHAR(100),
@he_dao_tao NVARCHAR(20), -- 'DH' hoặc 'CD'
@ma_chuyen_nganh CHAR(5),
@ma_khoa_hoc CHAR(4) AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Lấy mã khoa từ chuyên ngành
DECLARE @ma_khoa CHAR(3);

SELECT
    @ma_khoa = ma_khoa
FROM
    chuyen_nganh
WHERE
    ma_chuyen_nganh = @ma_chuyen_nganh;

IF @ma_khoa IS NULL BEGIN RAISERROR(
    N'Mã chuyên ngành không tồn tại: %s',
    16,
    1,
    @ma_chuyen_nganh
);

RETURN;

END -- Sinh số thứ tự tiếp theo trong khóa, khoa, loại hình
DECLARE @so_thu_tu INT;

SELECT
    @so_thu_tu = ISNULL(MAX(CAST(RIGHT(ma_sv, 4) AS INT)), 0) + 1
FROM
    sinh_vien
WHERE
    ma_khoa_hoc = @ma_khoa_hoc
    AND he_dao_tao = @he_dao_tao
    AND ma_sv LIKE @he_dao_tao + RIGHT(@ma_khoa_hoc, 2) + @ma_khoa + '%';

-- Tạo mã SV
DECLARE @ma_sv CHAR(15);

SET
    @ma_sv = @he_dao_tao + RIGHT(@ma_khoa_hoc, 2) + @ma_khoa + RIGHT('0000' + CAST(@so_thu_tu AS NVARCHAR(4)), 4);

-- Thêm sinh viên
INSERT INTO
    sinh_vien(
        ma_sv,
        ma_chuyen_nganh,
        ma_khoa_hoc,
        ho_ten_sv,
        he_dao_tao
    )
VALUES
    (
        @ma_sv,
        @ma_chuyen_nganh,
        @ma_khoa_hoc,
        @ho_ten,
        @he_dao_tao
    );

COMMIT TRANSACTION;

SELECT
    @ma_sv AS ma_sv_tao_moi;

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