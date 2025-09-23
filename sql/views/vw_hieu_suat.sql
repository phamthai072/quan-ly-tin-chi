-- dbo.vw_hieu_suat source

CREATE VIEW vw_hieu_suat
AS
WITH gpa_sv AS (
    SELECT 
        sv.ma_sv,
        lhp.ma_hoc_ky,
        CAST(SUM(kq.diem * mh.so_tin_chi * 1.0) / NULLIF(SUM(mh.so_tin_chi),0) AS DECIMAL(5,2)) AS gpa
    FROM sinh_vien sv
    INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
    INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
    INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    GROUP BY sv.ma_sv, lhp.ma_hoc_ky
),
tong_hop AS (
    SELECT 
        ma_hoc_ky,
        COUNT(DISTINCT ma_sv) AS tong_sv,
        CAST(AVG(gpa) AS DECIMAL(5,2)) AS gpa_tb,
        SUM(CASE WHEN gpa >= 3.2 THEN 1 ELSE 0 END) AS sv_xuat_sac,
        SUM(CASE WHEN gpa < 2.0 THEN 1 ELSE 0 END) AS sv_canh_bao
    FROM gpa_sv
    GROUP BY ma_hoc_ky
)
SELECT * 
FROM tong_hop;