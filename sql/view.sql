IF OBJECT_ID('vw_thong_ke_su_dung_phong', 'V') IS NOT NULL DROP VIEW vw_thong_ke_su_dung_phong;

CREATE VIEW vw_thong_ke_su_dung_phong AS WITH RoomUsageStats AS (
    SELECT
        ph.ma_phong,
        ph.ten_phong,
        ph.suc_chua,
        lhp.ma_hoc_ky,
        COUNT(DISTINCT lhp.ma_lop_hp) AS so_lop_hoc_phan,
        SUM(
            CASE
                WHEN lh.tiet_ket_thuc > lh.tiet_bat_dau THEN (lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 0.75
                ELSE 0
            END
        ) AS so_gio_su_dung
    FROM
        phong_hoc ph
        LEFT JOIN lich_hoc lh ON ph.ma_phong = lh.ma_phong
        LEFT JOIN lop_hoc_phan lhp ON lh.ma_lop_hp = lhp.ma_lop_hp
    GROUP BY
        ph.ma_phong,
        ph.ten_phong,
        ph.suc_chua,
        lhp.ma_hoc_ky
)
SELECT
    ma_phong,
    ten_phong,
    suc_chua,
    ma_hoc_ky,
    ISNULL(so_lop_hoc_phan, 0) AS so_lop_hoc_phan,
    ISNULL(so_gio_su_dung, 0) AS so_gio_su_dung,
    CASE
        WHEN ISNULL(so_gio_su_dung, 0) > 0 THEN ROUND(
            (ISNULL(so_gio_su_dung, 0) / (7 * 12 * 0.75 * 16)) * 100,
            2
        )
        ELSE 0
    END AS ti_le_su_dung
FROM
    RoomUsageStats;

-- danh_sach_lop_hoc_phan – Danh sách lớp học phần với thông tin giảng viên, môn học, phòng học và lịch học.
CREATE VIEW vw_ds_lop_hoc_phan AS
SELECT
    lhp.ma_lop_hp,
    lhp.ma_hoc_ky,
    lhp.ma_gv,
    gv.ho_ten_gv,
    lhp.ma_mh,
    mh.ten_mh,
    lhp.ma_phong,
    ph.ten_phong,
    lh.ma_lich_hoc,
    lh.thu,
    lh.tiet_bat_dau,
    lh.tiet_ket_thuc
FROM
    lop_hoc_phan lhp
    LEFT JOIN lich_hoc lh ON lh.ma_lop_hp = lhp.ma_lop_hp
    LEFT JOIN giang_vien gv ON gv.ma_gv = lhp.ma_gv
    LEFT JOIN phong_hoc ph ON ph.ma_phong = lhp.ma_phong
    LEFT JOIN mon_hoc mh ON mh.ma_mh = lhp.ma_mh;

-- danh sách lớp học phần có thể đăng ký và đã đăng ký của sinh viên ở 1 học kỳ
CREATE
OR ALTER VIEW vw_ds_lhp_sinh_vien AS
SELECT
    sv.ma_sv,
    sv.ho_ten_sv,
    lhp.ma_lop_hp,
    gv.ma_gv,
    gv.ho_ten_gv,
    mh.ma_mh,
    mh.ten_mh,
    mh.so_tin_chi,
    lhp.ma_hoc_ky,
    CASE
        WHEN kq.ma_sv IS NOT NULL THEN 1
        ELSE 0
    END AS trang_thai
FROM
    sinh_vien sv
    CROSS JOIN lop_hoc_phan lhp
    INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    LEFT JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
    AND lhp.ma_lop_hp = kq.ma_lop_hp
    left join giang_vien gv on gv.ma_gv = lhp.ma_gv;