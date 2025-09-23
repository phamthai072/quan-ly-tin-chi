-- dbo.vw_ds_lop_hoc_phan source

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