CREATE TRIGGER trg_mon_hoc_gen_ma_mh
ON mon_hoc
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ma_khoa NVARCHAR(10);
    DECLARE @ma_chuyen_nganh NVARCHAR(10);
    DECLARE @stt INT;
    DECLARE @prefix NVARCHAR(50);
    DECLARE @new_ma_mh NVARCHAR(50);

    -- Lấy thông tin bản ghi được insert (giả định 1 row/lần)
    SELECT TOP 1 
        @ma_chuyen_nganh = i.ma_chuyen_nganh
    FROM inserted i;

    -- Lấy mã khoa từ chuyên ngành
    SELECT @ma_khoa = ma_khoa
    FROM chuyen_nganh
    WHERE ma_chuyen_nganh = @ma_chuyen_nganh;

    -- Lấy số thứ tự lớn nhất trong cùng chuyên ngành + khoa
    SELECT @stt = ISNULL(MAX(CAST(SUBSTRING(ma_mh, LEN(@ma_chuyen_nganh) + 1, 3) AS INT)), 0) + 1
    FROM mon_hoc
    WHERE ma_mh LIKE @ma_chuyen_nganh + '%' + @ma_khoa;

    -- Ghép mã môn học: VD "HTTT001CNTT"
    SET @new_ma_mh = @ma_chuyen_nganh 
                     + RIGHT('000' + CAST(@stt AS NVARCHAR(3)), 3) 
                     + @ma_khoa;

    -- Thực hiện insert
    INSERT INTO mon_hoc(ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai)
    SELECT @new_ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai
    FROM inserted;
END;