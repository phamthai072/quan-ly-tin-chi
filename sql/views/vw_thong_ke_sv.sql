-- dbo.vw_thong_ke_sv source

CREATE   VIEW vw_thong_ke_sv
AS
SELECT 
    sv.ma_sv,
    sv.ho_ten_sv,
    sv.ma_chuyen_nganh,
    cn.ten_chuyen_nganh,
    k.ten_khoa,
    sv.ma_khoa_hoc,
    kh.ten_khoa_hoc,
    lhp.ma_hoc_ky,
    -- Điểm trung bình học kỳ
    CAST(SUM(kq.diem * mh.so_tin_chi * 1.0) / NULLIF(SUM(mh.so_tin_chi), 0) AS DECIMAL(5,2)) AS diem_tb_hk,
    -- Điểm trung bình tích lũy
    CAST((
        SELECT SUM(kq2.diem * mh2.so_tin_chi * 1.0) / NULLIF(SUM(mh2.so_tin_chi), 0)
        FROM ket_qua kq2
        INNER JOIN lop_hoc_phan lhp2 ON kq2.ma_lop_hp = lhp2.ma_lop_hp
        INNER JOIN mon_hoc mh2 ON lhp2.ma_mh = mh2.ma_mh
        WHERE kq2.ma_sv = sv.ma_sv
    ) AS DECIMAL(5,2)) AS diem_tb_tich_luy,
    -- Tổng số môn đã học (distinct môn)
    (
        SELECT COUNT(DISTINCT mh3.ma_mh)
        FROM ket_qua kq3
        INNER JOIN lop_hoc_phan lhp3 ON kq3.ma_lop_hp = lhp3.ma_lop_hp
        INNER JOIN mon_hoc mh3 ON lhp3.ma_mh = mh3.ma_mh
        WHERE kq3.ma_sv = sv.ma_sv
    ) AS tong_mon_hoc,
    -- Tổng số tín chỉ nợ
    (
        SELECT SUM(mh4.so_tin_chi)
        FROM ket_qua kq4
        INNER JOIN lop_hoc_phan lhp4 ON kq4.ma_lop_hp = lhp4.ma_lop_hp
        INNER JOIN mon_hoc mh4 ON lhp4.ma_mh = mh4.ma_mh
        WHERE kq4.ma_sv = sv.ma_sv AND kq4.diem < 5
    ) AS tong_tc_no
FROM sinh_vien sv
INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
INNER JOIN khoa k ON cn.ma_khoa = k.ma_khoa
INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc
GROUP BY sv.ma_sv, sv.ho_ten_sv, sv.ma_chuyen_nganh, cn.ten_chuyen_nganh,
         k.ten_khoa, sv.ma_khoa_hoc, kh.ten_khoa_hoc, lhp.ma_hoc_ky;