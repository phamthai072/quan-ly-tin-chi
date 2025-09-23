-- View thống kê sinh viên -> https://quan-ly-tin-chi.vercel.app/results
-- • Danh sách thống kê về điểm trung bình của mỗi sinh viên của từng lớp hoặc từng khoa, hoặc từng khóa, theo từng học kỳ và điểm trung bình tích lũy đến thời điểm hiện tại. Sắp xếp danh sách thống kê sinh viên theo thứ tự giảm dần về tổng số môn học đã học (không tính số lần học lại), và tổng số tín chỉ nợ môn. 
-- -> bộ lọc: khoa, khóa học, học kỳ, lớp học phần
-- -> bảng: khoa, khóa, lhp, sv, điểm, gpa, tổng môn đã học (đếm theo môn học unique), tổng tín chỉ nợ (là môn học chưa học qua, nếu đã học lại qua thì không tính)

CREATE VIEW vw_thong_ke_sv
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
    lhp.ma_lop_hp,
    mh.ma_mh,
    mh.ten_mh,
    kq.diem AS diem_lop_hp,
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
    -- Tổng số tín chỉ nợ (môn chưa qua, và chưa có lần học lại qua)
    (
        SELECT SUM(mh4.so_tin_chi)
        FROM mon_hoc mh4
        WHERE EXISTS (
            SELECT 1
            FROM ket_qua kq4
            INNER JOIN lop_hoc_phan lhp4 ON kq4.ma_lop_hp = lhp4.ma_lop_hp
            WHERE kq4.ma_sv = sv.ma_sv 
              AND lhp4.ma_mh = mh4.ma_mh
              AND kq4.diem < (
                  SELECT CAST(gia_tri AS DECIMAL(5,2)) 
                  FROM cau_hinh 
                  WHERE ten = N'DiemQuaMon'
              )
        )
        AND NOT EXISTS (
            SELECT 1
            FROM ket_qua kq5
            INNER JOIN lop_hoc_phan lhp5 ON kq5.ma_lop_hp = lhp5.ma_lop_hp
            WHERE kq5.ma_sv = sv.ma_sv 
              AND lhp5.ma_mh = mh4.ma_mh
              AND kq5.diem >= (
                  SELECT CAST(gia_tri AS DECIMAL(5,2)) 
                  FROM cau_hinh 
                  WHERE ten = N'DiemQuaMon'
              )
        )
    ) AS tong_tc_no
FROM sinh_vien sv
INNER JOIN ket_qua kq ON sv.ma_sv = kq.ma_sv
INNER JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
INNER JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
INNER JOIN chuyen_nganh cn ON sv.ma_chuyen_nganh = cn.ma_chuyen_nganh
INNER JOIN khoa k ON cn.ma_khoa = k.ma_khoa
INNER JOIN khoa_hoc kh ON sv.ma_khoa_hoc = kh.ma_khoa_hoc;
