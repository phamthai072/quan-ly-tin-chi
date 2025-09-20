-- Danh sách Procedure (chạy khi đc gọi)
USE QuanLyTinChi;

GO
    -- 1. proc_dang_ky_lop – Thực hiện đăng ký lớp học phần cho sinh viên (gồm tất cả kiểm tra ràng buộc).
    -- =============================================
    -- Procedure: proc_dang_ky_lop
    -- Chức năng: Đăng ký lớp học phần cho sinh viên
    -- Kiểm tra các ràng buộc:
    --   1. Sinh viên chưa học môn này trong cùng học kỳ
    --   2. Không vượt quá 20 tín chỉ trong học kỳ
    --   3. Đã hoàn thành môn tiên quyết
    --   4. Không học quá 3 môn ngoài chuyên ngành (trừ môn cơ bản)
    --   5. Số sinh viên trong lớp không vượt quá sức chứa phòng học
    -- =============================================
    CREATE PROCEDURE proc_dang_ky_lop @ma_sv CHAR(15),
    @ma_lop_hp CHAR(10) AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

if not exists(
    select
        1
    from
        sinh_vien sv
    where
        sv.ma_sv = @ma_sv
) begin raiserror(N'Mã sinh viên không tồn tại: %s', 16, 1, @ma_sv);

return;

end -- Lấy thông tin lớp học phần
DECLARE @ma_hoc_ky CHAR(10),
@ma_mh CHAR(10),
@ma_phong CHAR(10);

SELECT
    @ma_hoc_ky = ma_hoc_ky,
    @ma_mh = ma_mh,
    @ma_phong = ma_phong
FROM
    lop_hoc_phan
WHERE
    ma_lop_hp = @ma_lop_hp;

IF @ma_mh IS NULL BEGIN RAISERROR(
    N'Lớp học phần không tồn tại: %s',
    16,
    1,
    @ma_lop_hp
);

RETURN;

END -- 1. Kiểm tra sinh viên chưa học môn này trong cùng học kỳ
IF EXISTS (
    SELECT
        1
    FROM
        ket_qua kq
        JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
    WHERE
        kq.ma_sv = @ma_sv
        AND lhp.ma_hoc_ky = @ma_hoc_ky
        AND lhp.ma_mh = @ma_mh
) BEGIN RAISERROR(
    N'Sinh viên đã đăng ký môn này trong học kỳ.',
    16,
    1
);

RETURN;

END -- 2. Kiểm tra tổng tín chỉ không vượt quá 20
DECLARE @tong_tin_chi INT;

SELECT
    @tong_tin_chi = ISNULL(SUM(mh.so_tin_chi), 0)
FROM
    ket_qua kq
    JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
    JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
WHERE
    kq.ma_sv = @ma_sv
    AND lhp.ma_hoc_ky = @ma_hoc_ky;

DECLARE @tin_chi_moi INT;

SELECT
    @tin_chi_moi = so_tin_chi
FROM
    mon_hoc
WHERE
    ma_mh = @ma_mh;

IF (@tong_tin_chi + @tin_chi_moi) > 20 BEGIN RAISERROR(
    N'Tổng số tín chỉ vượt quá 20 tín chỉ trong học kỳ: %s tín chỉ',
    16,
    1,
    @tong_tin_chi
);

RETURN;

END -- 3. Kiểm tra môn tiên quyết
DECLARE @ds_mon_tien_quyet NVARCHAR(MAX);

SELECT
    @ds_mon_tien_quyet = STRING_AGG(ten_mh, ', ')
FROM
    (
        SELECT
            DISTINCT mh.ten_mh
        FROM
            mon_tien_quyet mtq
            JOIN mon_hoc mh ON mh.ma_mh = mtq.ma_mh_tien_quyet
            JOIN lop_hoc_phan lhp_mtq ON lhp_mtq.ma_mh = mtq.ma_mh_tien_quyet
            LEFT JOIN ket_qua kq_mtq ON kq_mtq.ma_sv = @ma_sv
            AND kq_mtq.ma_lop_hp = lhp_mtq.ma_lop_hp
            AND kq_mtq.diem >= 5
        WHERE
            mtq.ma_mh = @ma_mh
            AND kq_mtq.ma_lop_hp IS NULL
    ) AS t;

IF @ds_mon_tien_quyet IS NOT NULL BEGIN RAISERROR(
    N'Sinh viên chưa đạt các môn tiên quyết sau: %s',
    16,
    1,
    @ds_mon_tien_quyet
);

RETURN;

END -- 4. Kiểm tra số môn ngoài chuyên ngành
DECLARE @so_mon_ngoai_nganh INT;

SELECT
    @so_mon_ngoai_nganh = COUNT(*)
FROM
    ket_qua kq
    JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
    JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
    JOIN sinh_vien sv ON sv.ma_sv = kq.ma_sv
    JOIN chuyen_nganh cn ON cn.ma_chuyen_nganh = sv.ma_chuyen_nganh
WHERE
    kq.ma_sv = @ma_sv
    AND lhp.ma_hoc_ky = @ma_hoc_ky
    AND mh.loai = N'chuyên ngành'
    AND mh.ma_khoa <> cn.ma_khoa;

SELECT
    @so_mon_ngoai_nganh = ISNULL(@so_mon_ngoai_nganh, 0);

-- Kiểm tra môn sắp đăng ký cũng ngoài ngành
DECLARE @ma_khoa_sv CHAR(10),
@loai_mon NVARCHAR(20);

SELECT
    @ma_khoa_sv = cn.ma_khoa
FROM
    sinh_vien sv
    JOIN chuyen_nganh cn ON cn.ma_chuyen_nganh = sv.ma_chuyen_nganh
WHERE
    sv.ma_sv = @ma_sv;

SELECT
    @loai_mon = loai
FROM
    mon_hoc
WHERE
    ma_mh = @ma_mh;

DECLARE @ma_khoa_mh CHAR(10);

SELECT
    @ma_khoa_mh = ma_khoa
FROM
    mon_hoc
WHERE
    ma_mh = @ma_mh;

IF (
    @loai_mon = N'chuyên ngành'
    AND @ma_khoa_mh <> @ma_khoa_sv
    AND @so_mon_ngoai_nganh >= 3
) BEGIN RAISERROR(
    N'Sinh viên đã đăng ký đủ 3 môn ngoài chuyên ngành.',
    16,
    1
);

RETURN;

END -- 5. Kiểm tra số sinh viên trong lớp <= sức chứa
DECLARE @so_sv_lop INT,
@suc_chua INT;

SELECT
    @so_sv_lop = COUNT(*)
FROM
    ket_qua
WHERE
    ma_lop_hp = @ma_lop_hp;

SELECT
    @suc_chua = suc_chua
FROM
    phong_hoc
WHERE
    ma_phong = @ma_phong;

IF @so_sv_lop >= @suc_chua BEGIN RAISERROR(N'Lớp học phần đã đủ số sinh viên tối đa.', 16, 1);

RETURN;

END -- Nếu qua hết kiểm tra -> thêm bản ghi vào ket_qua
INSERT INTO
    ket_qua(ma_lop_hp, ma_sv, diem)
VALUES
(@ma_lop_hp, @ma_sv, NULL);

COMMIT TRANSACTION;

END TRY BEGIN CATCH IF @ @TRANCOUNT > 0 ROLLBACK TRANSACTION;

DECLARE @ErrorMessage NVARCHAR(4000),
@ErrorSeverity INT,
@ErrorState INT;

SELECT
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH
END;

-- 1. proc_huy_dang_ky – Hủy đăng ký lớp học phần của sinh viên.
-- =============================================
-- Procedure: proc_huy_dang_ky
-- Chức năng: Hủy đăng ký lớp học phần của sinh viên
-- Kiểm tra:
--   1. Sinh viên đã đăng ký lớp học phần hay chưa
-- =============================================
CREATE PROCEDURE proc_huy_dang_ky @ma_sv CHAR(15),
@ma_lop_hp CHAR(10) AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Kiểm tra sinh viên tồn tại
IF NOT EXISTS (
    SELECT
        1
    FROM
        sinh_vien
    WHERE
        ma_sv = @ma_sv
) BEGIN RAISERROR(N'Mã sinh viên không tồn tại: %s', 16, 1, @ma_sv);

RETURN;

END -- Kiểm tra lớp học phần tồn tại
IF NOT EXISTS (
    SELECT
        1
    FROM
        lop_hoc_phan
    WHERE
        ma_lop_hp = @ma_lop_hp
) BEGIN RAISERROR(
    N'Lớp học phần không tồn tại: %s',
    16,
    1,
    @ma_lop_hp
);

RETURN;

END -- Kiểm tra sinh viên đã đăng ký lớp chưa
IF NOT EXISTS (
    SELECT
        1
    FROM
        ket_qua
    WHERE
        ma_sv = @ma_sv
        AND ma_lop_hp = @ma_lop_hp
) BEGIN RAISERROR(
    N'Sinh viên chưa đăng ký lớp học phần này: %s',
    16,
    1,
    @ma_lop_hp
);

RETURN;

END -- Xóa bản ghi đăng ký
DELETE FROM
    ket_qua
WHERE
    ma_sv = @ma_sv
    AND ma_lop_hp = @ma_lop_hp;

COMMIT TRANSACTION;

END TRY BEGIN CATCH IF @ @TRANCOUNT > 0 ROLLBACK TRANSACTION;

DECLARE @ErrorMessage NVARCHAR(4000),
@ErrorSeverity INT,
@ErrorState INT;

SELECT
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH
END;

-- 1. proc_them_sinh_vien – Thêm sinh viên mới, tự sinh mã SV theo quy tắc.
-- -> mã sv: [Loại hình - 2 chữ][Khóa học - 2 số][Mã khoa - 3 chữ][Số thứ tự - 4 số] -> ĐH18CNT0001 → SV hệ đại học, khóa 2018, khoa CNTT, số thứ tự 0001.
-- =============================================
-- Procedure: proc_them_sinh_vien
-- Chức năng: Thêm sinh viên mới, tự sinh mã SV theo quy tắc
-- Quy tắc mã SV: [Loại hình - 2 chữ][Khóa học - 2 số][Mã khoa - 3 chữ][Số thứ tự - 4 số]
-- Ví dụ: ĐH18CNT0001 -> hệ đại học, khóa 2018, khoa CNTT, thứ tự 0001
-- =============================================
CREATE PROCEDURE proc_them_sinh_vien @ho_ten NVARCHAR(100),
@he_dao_tao NVARCHAR(20),
-- 'ĐH' hoặc 'CĐ'
@ma_chuyen_nganh CHAR(5),
@ma_khoa_hoc CHAR(4) AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Lấy mã khoa từ chuyên ngành
DECLARE @ma_khoa CHAR(3);

SELECT
    @ma_khoa = ma_khoa
FROM
    chuyen_nganh
WHERE
    ma_chuyen_nganh = @ma_chuyen_nganh;

IF @ma_khoa IS NULL BEGIN RAISERROR(
    N'Mã chuyên ngành không tồn tại: %s',
    16,
    1,
    @ma_chuyen_nganh
);

RETURN;

END -- Sinh số thứ tự tiếp theo trong khóa, khoa, loại hình
DECLARE @so_thu_tu INT;

SELECT
    @so_thu_tu = ISNULL(MAX(CAST(RIGHT(ma_sv, 4) AS INT)), 0) + 1
FROM
    sinh_vien
WHERE
    ma_khoa_hoc = @ma_khoa_hoc
    AND he_dao_tao = @he_dao_tao
    AND ma_sv LIKE @he_dao_tao + RIGHT(@ma_khoa_hoc, 2) + @ma_khoa + '%';

-- Tạo mã SV
DECLARE @ma_sv CHAR(15);

SET
    @ma_sv = @he_dao_tao + RIGHT(@ma_khoa_hoc, 2) + @ma_khoa + RIGHT('0000' + CAST(@so_thu_tu AS NVARCHAR(4)), 4);

-- Thêm sinh viên
INSERT INTO
    sinh_vien(
        ma_sv,
        ma_chuyen_nganh,
        ma_khoa_hoc,
        ho_ten_sv,
        he_dao_tao
    )
VALUES
(
        @ma_sv,
        @ma_chuyen_nganh,
        @ma_khoa_hoc,
        @ho_ten,
        @he_dao_tao
    );

COMMIT TRANSACTION;

SELECT
    @ma_sv AS ma_sv_tao_moi;

END TRY BEGIN CATCH IF @ @TRANCOUNT > 0 ROLLBACK TRANSACTION;

DECLARE @ErrorMessage NVARCHAR(4000),
@ErrorSeverity INT,
@ErrorState INT;

SELECT
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH
END;

-- 1. proc_them_mon_hoc – Thêm môn học mới, tự sinh mã môn học theo quy tắc.
-- -> ma_mh [Mã khoa - 3 chữ][Mã chuyên ngành - 2 chữ][Loại môn - 2 chữ][Số thứ tự - 4 số] -> CNTAICB0001 → Khoa CNTT, chuyên ngành AI, môn cơ bản số 0001.
-- =============================================
-- Procedure: proc_them_mon_hoc
-- Chức năng: Thêm môn học mới, tự sinh mã môn học theo quy tắc
-- Quy tắc mã môn học: [Mã khoa - 3 chữ][Mã chuyên ngành - 2 chữ][Loại môn - 2 chữ][Số thứ tự - 4 số]
-- Ví dụ: CNTAICB0001 -> Khoa CNTT, chuyên ngành AI, môn cơ bản số 0001
-- =============================================
CREATE PROCEDURE proc_them_mon_hoc @ten_mh NVARCHAR(100),
@so_tin_chi INT,
@ma_khoa CHAR(3),
@ma_chuyen_nganh CHAR(2),
@loai NVARCHAR(20) -- 'cơ bản' hoặc 'chuyên ngành'
AS BEGIN
SET
    NOCOUNT ON;

BEGIN TRY BEGIN TRANSACTION;

-- Xác định mã loại môn: CB hoặc CN
DECLARE @loai_mon CHAR(2);

SET
    @loai_mon = CASE
        WHEN @loai = N'cơ bản' THEN 'CB'
        WHEN @loai = N'chuyên ngành' THEN 'CN'
        ELSE NULL
    END;

IF @loai_mon IS NULL BEGIN RAISERROR(N'Loại môn học không hợp lệ: %s', 16, 1, @loai);

RETURN;

END -- Sinh số thứ tự tiếp theo
DECLARE @so_thu_tu INT;

SELECT
    @so_thu_tu = ISNULL(MAX(CAST(RIGHT(ma_mh, 4) AS INT)), 0) + 1
FROM
    mon_hoc
WHERE
    ma_mh LIKE @ma_khoa + @ma_chuyen_nganh + @loai_mon + '%';

-- Tạo mã môn học
DECLARE @ma_mh CHAR(10);

SET
    @ma_mh = @ma_khoa + @ma_chuyen_nganh + @loai_mon + RIGHT('0000' + CAST(@so_thu_tu AS NVARCHAR(4)), 4);

-- Thêm môn học
INSERT INTO
    mon_hoc(ma_mh, ten_mh, so_tin_chi, ma_chuyen_nganh, loai)
VALUES
(
        @ma_mh,
        @ten_mh,
        @so_tin_chi,
        @ma_chuyen_nganh,
        @loai
    );

COMMIT TRANSACTION;

SELECT
    @ma_mh AS ma_mh_tao_moi;

END TRY BEGIN CATCH IF @ @TRANCOUNT > 0 ROLLBACK TRANSACTION;

DECLARE @ErrorMessage NVARCHAR(4000),
@ErrorSeverity INT,
@ErrorState INT;

SELECT
    @ErrorMessage = ERROR_MESSAGE(),
    @ErrorSeverity = ERROR_SEVERITY(),
    @ErrorState = ERROR_STATE();

RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

END CATCH
END;

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

END;