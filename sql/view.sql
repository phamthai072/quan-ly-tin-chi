-- vw_canh_bao_sinh_vien – Danh sách sinh viên bị cảnh báo (TB < ngưỡng hoặc nợ tín chỉ > ngưỡng).

-- vw_ket_qua_sinh_vien – Kết quả học tập chi tiết (môn, điểm, học kỳ, qua/rớt).

-- vw_dtb_sinh_vien_hoc_ky – Điểm trung bình từng học kỳ của sinh viên.

-- vw_dtb_sinh_vien_tich_luy – Điểm trung bình tích lũy của sinh viên.

-- vw_thong_ke_sinh_vien_khoa – Thống kê điểm TB + số tín chỉ nợ theo khoa.

-- vw_lich_day_giang_vien – Lịch dạy của giảng viên (môn, lớp, phòng, thời gian).

-- vw_luong_giang_vien – Danh sách giảng viên, lương và cảnh báo giờ dạy.


IF OBJECT_ID('vw_thong_ke_su_dung_phong', 'V') IS NOT NULL
    DROP VIEW vw_thong_ke_su_dung_phong;
GO

CREATE VIEW vw_thong_ke_su_dung_phong
AS
    WITH RoomUsageStats AS (
        SELECT 
            ph.ma_phong,
            ph.ten_phong,
            ph.suc_chua,
            lhp.ma_hoc_ky,
            COUNT(DISTINCT lhp.ma_lop_hp) AS so_lop_hoc_phan,
            SUM(CASE 
                WHEN lh.tiet_ket_thuc > lh.tiet_bat_dau 
                THEN (lh.tiet_ket_thuc - lh.tiet_bat_dau + 1) * 0.75
                ELSE 0 
            END) AS so_gio_su_dung
        FROM phong_hoc ph
        LEFT JOIN lich_hoc lh ON ph.ma_phong = lh.ma_phong
        LEFT JOIN lop_hoc_phan lhp ON lh.ma_lop_hp = lhp.ma_lop_hp
        GROUP BY ph.ma_phong, ph.ten_phong, ph.suc_chua, lhp.ma_hoc_ky
    )
    SELECT 
        ma_phong,
        ten_phong,
        suc_chua,
        ma_hoc_ky,
        ISNULL(so_lop_hoc_phan, 0) AS so_lop_hoc_phan,
        ISNULL(so_gio_su_dung, 0) AS so_gio_su_dung,
        CASE 
            WHEN ISNULL(so_gio_su_dung, 0) > 0 
            THEN ROUND((ISNULL(so_gio_su_dung, 0) / (7 * 12 * 0.75 * 16)) * 100, 2)
            ELSE 0 
        END AS ti_le_su_dung
    FROM RoomUsageStats;
GO
