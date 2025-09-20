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

-- Danh sách thống kê về điểm trung bình của mỗi sinh viên của từng lớp hoặc từng khoa, hoặc từng khóa, theo từng học kỳ và điểm trung bình tích lũy đến thời điểm hiện tại. Sắp xếp danh sách thống kê sinh viên theo thứ tự giảm dần về tổng số môn học đã học (không tính số lần học lại), và tổng số tín chỉ nợ môn. 
CREATE
OR ALTER VIEW vw_thong_ke_sv AS
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
    CAST(
        SUM(kq.diem * mh.so_tin_chi * 1.0) / NULLIF(SUM(mh.so_tin_chi), 0) AS DECIMAL(5, 2)
    ) AS diem_tb_hk,
    -- Điểm trung bình tích lũy
    CAST(
        (
            SELECT
                SUM(kq2.diem * mh2.so_tin_chi * 1.0) / NULLIF(SUM(mh2.so_tin_chi), 0)
            FROM
                ket_qua kq2
                INNER JOIN lop_hoc_phan lhp2 ON kq2.ma_lop_hp = lhp2.ma_lop_hp
                INNER JOIN mon_hoc mh2 ON lhp2.ma_mh = mh2.ma_mh
            WHERE
                kq2.ma_sv = sv.ma_sv
        ) AS DECIMAL(5, 2)
    ) AS diem_tb_tich_luy,
    -- Tổng số môn đã học (distinct môn)
    (
        SELECT
            COUNT(DISTINCT mh3.ma_mh)
        FROM
            ket_qua kq3
            INNER JOIN lop_hoc_phan lhp3 ON kq3.ma_lop_hp = lhp3.ma_lop_hp
            INNER JOIN mon_hoc mh3 ON lhp3.ma_mh = mh3.ma_mh
        WHERE
            kq3.ma_sv = sv.ma_sv
    ) AS tong_mon_hoc,
    -- Tổng số tín chỉ nợ
    (
        SELECT
            SUM(mh4.so_tin_chi)
        FROM
            ket_qua kq4
            INNER JOIN lop_hoc_phan lhp4 ON kq4.ma_lop_hp = lhp4.ma_lop_hp
            INNER JOIN mon_hoc mh4 ON lhp4.ma_mh = mh4.ma_mh
        WHERE
            kq4.ma_sv = sv.ma_sv
            AND kq4.diem < 5
    ) AS tong_tc_no
FROM
    sinh_vien sv
    INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
    INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
    INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
    INNER JOIN khoa k ON cn.ma_khoa = k.ma_khoa
    INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc
GROUP BY
    sv.ma_sv,
    sv.ho_ten_sv,
    sv.ma_chuyen_nganh,
    cn.ten_chuyen_nganh,
    k.ten_khoa,
    sv.ma_khoa_hoc,
    kh.ten_khoa_hoc,
    lhp.ma_hoc_ky;

-- thống kê tổng hợp hiệu suất học tập của sinh viên theo từng học kỳ
CREATE
OR ALTER VIEW vw_hieu_suat AS WITH gpa_sv AS (
    SELECT
        sv.ma_sv,
        lhp.ma_hoc_ky,
        CAST(
            SUM(kq.diem * mh.so_tin_chi * 1.0) / NULLIF(SUM(mh.so_tin_chi), 0) AS DECIMAL(5, 2)
        ) AS gpa
    FROM
        sinh_vien sv
        INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
        INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
        INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    GROUP BY
        sv.ma_sv,
        lhp.ma_hoc_ky
),
tong_hop AS (
    SELECT
        ma_hoc_ky,
        COUNT(DISTINCT ma_sv) AS tong_sv,
        CAST(AVG(gpa) AS DECIMAL(5, 2)) AS gpa_tb,
        SUM(
            CASE
                WHEN gpa >= 3.2 THEN 1
                ELSE 0
            END
        ) AS sv_xuat_sac,
        SUM(
            CASE
                WHEN gpa < 2.0 THEN 1
                ELSE 0
            END
        ) AS sv_canh_bao
    FROM
        gpa_sv
    GROUP BY
        ma_hoc_ky
)
SELECT
    *
FROM
    tong_hop;

-- ds lớp học phần của sv
CREATE
OR ALTER VIEW vw_ds_lhp_sinh_vien AS
SELECT
    lhp.ma_lop_hp,
    mh.ten_mh,
    mh.so_tin_chi,
    kq.diem,
    gv.ma_gv,
    gv.ho_ten_gv,
    lh.thu,
    lh.tiet_bat_dau,
    lh.tiet_ket_thuc,
    lhp.ma_hoc_ky,
    kq.ma_sv
FROM
    lop_hoc_phan lhp
    INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    INNER JOIN giang_vien gv ON lhp.ma_gv = gv.ma_gv
    LEFT JOIN ket_qua kq ON lhp.ma_lop_hp = kq.ma_lop_hp
    LEFT JOIN lich_hoc lh ON lhp.ma_lop_hp = lh.ma_lop_hp;