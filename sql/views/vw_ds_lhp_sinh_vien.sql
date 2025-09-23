-- dbo.vw_ds_lhp_sinh_vien source

CREATE   VIEW vw_ds_lhp_sinh_vien
AS
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
FROM lop_hoc_phan lhp
INNER JOIN mon_hoc mh 
    ON lhp.ma_mh = mh.ma_mh
INNER JOIN giang_vien gv 
    ON lhp.ma_gv = gv.ma_gv
LEFT JOIN ket_qua kq 
    ON lhp.ma_lop_hp = kq.ma_lop_hp
LEFT JOIN lich_hoc lh 
    ON lhp.ma_lop_hp = lh.ma_lop_hp;