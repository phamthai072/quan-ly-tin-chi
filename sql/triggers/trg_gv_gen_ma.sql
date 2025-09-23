-- tạo mã gv
CREATE TRIGGER trg_gv_gen_ma
ON giang_vien
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @stt INT;
    DECLARE @new_ma_gv NVARCHAR(20);

    -- Lấy số thứ tự tiếp theo
    SELECT @stt = ISNULL(MAX(CAST(RIGHT(ma_gv, LEN(ma_gv)-2) AS INT)), 0) + 1
    FROM giang_vien;

    -- Tạo mã giảng viên
    SET @new_ma_gv = 'GV' + RIGHT('000' + CAST(@stt AS NVARCHAR(4)), 4);

    -- Chèn bản ghi
    INSERT INTO giang_vien(ma_gv, ho_ten_gv, ma_khoa, don_gia)
    SELECT @new_ma_gv, ho_ten_gv, ma_khoa, don_gia FROM inserted;
END;