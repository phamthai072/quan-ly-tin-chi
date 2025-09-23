-- ===============================================
-- Trigger sinh mã lớp học phần tự động
-- ===============================================
CREATE TRIGGER trg_lop_hoc_phan_gen_ma
ON lop_hoc_phan
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Chèn nhiều bản ghi cũng được
    INSERT INTO lop_hoc_phan(ma_lop_hp, ma_mh, ma_gv, ma_hoc_ky, ma_phong)
    SELECT 
        -- Sinh mã LHP với số thứ tự tự tăng
        'LHP' + RIGHT('000' + CAST(
            ISNULL((
                SELECT MAX(CAST(SUBSTRING(ma_lop_hp, 4, LEN(ma_lop_hp)) AS INT))
                FROM lop_hoc_phan
            ), 0) 
            + ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) 
            AS NVARCHAR(10)), 3),
        i.ma_mh,
        i.ma_gv,
        i.ma_hoc_ky,
        i.ma_phong
    FROM inserted i;
END;