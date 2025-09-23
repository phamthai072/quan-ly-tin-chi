-- Mỗi học kỳ, một giảng viên chỉ được dạy tối đa 8 lớp. Mỗi lớp dạy 1 môn nào đó cho nhiều 
-- sinh viên. Mỗi học kỳ kéo dài trong 16 tuần. Lương tháng của giảng viên dựa trên tổng số tiết trong mỗi học kỳ, nhân với đơn giá mỗi tiết, chia cho 4 tháng. 
CREATE PROCEDURE proc_tinh_luong_gv @ma_gv NVARCHAR(20),
@ma_hoc_ky NVARCHAR(20) AS BEGIN
SET
    NOCOUNT ON;

SELECT
    gv.ma_gv,
    gv.ho_ten_gv,
    @ma_hoc_ky AS ma_hoc_ky,
    COUNT(DISTINCT lhp.ma_lop_hp) AS so_lop,
    SUM((lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 16) AS tong_tiet,
    gv.don_gia,
    CAST(
        SUM((lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 16) * gv.don_gia / 4.0 AS DECIMAL(18, 2)
    ) AS luong_thang
FROM
    giang_vien gv
    INNER JOIN lop_hoc_phan lhp ON lhp.ma_gv = gv.ma_gv
    INNER JOIN lich_hoc lh ON lh.ma_lop_hp = lhp.ma_lop_hp
WHERE
    gv.ma_gv = @ma_gv
    AND lhp.ma_hoc_ky = @ma_hoc_ky
GROUP BY
    gv.ma_gv,
    gv.ho_ten_gv,
    gv.don_gia;

END