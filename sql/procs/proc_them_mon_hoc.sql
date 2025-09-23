CREATE PROCEDURE proc_them_mon_hoc @ten_mh NVARCHAR(100),
@so_tin_chi INT,
@ma_khoa CHAR(3),
@ma_chuyen_nganh CHAR(2),
@loai NVARCHAR(20) -- 'cơ bản' hoặc 'chuyên ngành'
AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Xác định mã loại môn: CB hoặc CN
DECLARE @loai_mon CHAR(2);

SET
    @loai_mon = CASE
        WHEN @loai = N'cơ bản' THEN 'CB'
        WHEN @loai = N'chuyên ngành' THEN 'CN'
        ELSE NULL
    END;

IF @loai_mon IS NULL BEGIN RAISERROR(N'Loại môn học không hợp lệ: %s', 16, 1, @loai);

RETURN;

END -- Sinh số thứ tự tiếp theo
DECLARE @so_thu_tu INT;

SELECT
    @so_thu_tu = ISNULL(MAX(CAST(RIGHT(ma_mh, 4) AS INT)), 0) + 1
FROM
    mon_hoc
WHERE
    ma_mh LIKE @ma_khoa + @ma_chuyen_nganh + @loai_mon + '%';

-- Tạo mã môn học
DECLARE @ma_mh CHAR(10);

SET
    @ma_mh = @ma_khoa + @ma_chuyen_nganh + @loai_mon + RIGHT('0000' + CAST(@so_thu_tu AS NVARCHAR(4)), 4);

-- Thêm môn học
INSERT INTO
    mon_hoc(ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai)
VALUES
    (
        @ma_mh,
        @ten_mh,
        @so_tin_chi,
        @ma_chuyen_nganh,
        @loai
    );

COMMIT TRANSACTION;

SELECT
    @ma_mh AS ma_mh_tao_moi;

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