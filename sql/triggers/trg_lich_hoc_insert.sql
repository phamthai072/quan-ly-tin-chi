CREATE TRIGGER trg_lich_hoc_insert
ON lich_hoc
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ma_lop_hp NVARCHAR(10);
    DECLARE @thu TINYINT;
    DECLARE @tiet_bat_dau INT;
    DECLARE @tiet_ket_thuc INT;
    DECLARE @ma_hoc_ky NVARCHAR(10);
    DECLARE @ma_lich_hoc NVARCHAR(20);
    DECLARE @stt INT;

    -- Lấy dữ liệu từ inserted (giả định 1 row/lần insert)
    SELECT TOP 1
        @ma_lop_hp = i.ma_lop_hp,
        @thu = i.thu,
        @tiet_bat_dau = i.tiet_bat_dau,
        @tiet_ket_thuc = i.tiet_ket_thuc
    FROM inserted i;

    -- Lấy học kỳ từ lớp học phần
    SELECT @ma_hoc_ky = ma_hoc_ky
    FROM lop_hoc_phan
    WHERE ma_lop_hp = @ma_lop_hp;

    -- Kiểm tra trùng giờ tại cùng phòng học
    IF EXISTS (
        SELECT 1
        FROM lich_hoc lh
        JOIN lop_hoc_phan lhp ON lh.ma_lop_hp = lhp.ma_lop_hp
        JOIN lop_hoc_phan lhp_new ON lhp_new.ma_lop_hp = @ma_lop_hp
        WHERE lh.thu = @thu
          AND lhp.ma_phong = lhp_new.ma_phong
          AND (
                (@tiet_bat_dau BETWEEN lh.tiet_bat_dau AND lh.tiet_ket_thuc)
             OR (@tiet_ket_thuc BETWEEN lh.tiet_bat_dau AND lh.tiet_ket_thuc)
             OR (lh.tiet_bat_dau BETWEEN @tiet_bat_dau AND @tiet_ket_thuc)
             OR (lh.tiet_ket_thuc BETWEEN @tiet_bat_dau AND @tiet_ket_thuc)
          )
    )
    BEGIN
        RAISERROR(N'Lỗi: Phòng học đã có lớp khác trong khung giờ này.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Sinh mã lịch học mới
    SELECT @stt = ISNULL(MAX(CAST(RIGHT(ma_lich_hoc, 3) AS INT)), 0) + 1
    FROM lich_hoc
    WHERE LEFT(ma_lich_hoc, LEN(@ma_hoc_ky)) = @ma_hoc_ky;

    SET @ma_lich_hoc = @ma_hoc_ky + RIGHT('000' + CAST(@stt AS NVARCHAR(3)), 3);

    -- Insert vào bảng chính thức
    INSERT INTO lich_hoc (ma_lich_hoc, ma_lop_hp, thu, tiet_bat_dau, tiet_ket_thuc)
    SELECT @ma_lich_hoc, @ma_lop_hp, @thu, @tiet_bat_dau, @tiet_ket_thuc;
END;