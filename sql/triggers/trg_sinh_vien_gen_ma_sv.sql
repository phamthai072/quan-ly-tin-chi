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