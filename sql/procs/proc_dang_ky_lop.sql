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


CREATE PROCEDURE proc_dang_ky_lop 
    @ma_sv NVARCHAR(15),
    @ma_lop_hp NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 0. Kiểm tra sinh viên tồn tại
        IF NOT EXISTS (SELECT 1 FROM sinh_vien WHERE ma_sv = @ma_sv)
        BEGIN
            RAISERROR(N'Mã sinh viên không tồn tại: %s', 16, 1, @ma_sv);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Lấy thông tin lớp học phần
        DECLARE @ma_hoc_ky NVARCHAR(10),
                @ma_mh NVARCHAR(20),
                @ma_phong NVARCHAR(10);

        SELECT @ma_hoc_ky = ma_hoc_ky,
               @ma_mh = ma_mh,
               @ma_phong = ma_phong
        FROM lop_hoc_phan
        WHERE ma_lop_hp = @ma_lop_hp;

        IF @ma_mh IS NULL
        BEGIN
            RAISERROR(N'Lớp học phần không tồn tại: %s', 16, 1, @ma_lop_hp);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 1. Kiểm tra sinh viên chưa học môn này trong cùng học kỳ
        IF EXISTS (
            SELECT 1
            FROM ket_qua kq
            JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
            WHERE kq.ma_sv = @ma_sv
              AND lhp.ma_hoc_ky = @ma_hoc_ky
              AND lhp.ma_mh = @ma_mh
        )
        BEGIN
            RAISERROR(N'Sinh viên đã đăng ký môn này trong học kỳ.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Kiểm tra tổng tín chỉ không vượt quá 20
        DECLARE @tong_tin_chi INT;

        SELECT @tong_tin_chi = ISNULL(SUM(mh.so_tin_chi), 0)
        FROM ket_qua kq
        JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
        JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
        WHERE kq.ma_sv = @ma_sv
          AND lhp.ma_hoc_ky = @ma_hoc_ky;

        DECLARE @tin_chi_moi INT;
        SELECT @tin_chi_moi = so_tin_chi FROM mon_hoc WHERE ma_mh = @ma_mh;

        IF (@tong_tin_chi + @tin_chi_moi) > 20
        BEGIN
            RAISERROR(N'Tổng số tín chỉ vượt quá 20 trong học kỳ.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 3. Kiểm tra môn tiên quyết
        DECLARE @ds_mon_tien_quyet NVARCHAR(MAX);

        SELECT @ds_mon_tien_quyet = STRING_AGG(mh.ten_mh, ', ')
        FROM mon_tien_quyet mtq
        JOIN mon_hoc mh ON mh.ma_mh = mtq.ma_mh_tien_quyet
        WHERE mtq.ma_mh = @ma_mh
          AND NOT EXISTS (
              SELECT 1
              FROM ket_qua kq
              JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
              WHERE kq.ma_sv = @ma_sv
                AND lhp.ma_mh = mtq.ma_mh_tien_quyet
                AND kq.diem >= 5
          );

        IF @ds_mon_tien_quyet IS NOT NULL
        BEGIN
            RAISERROR(N'Sinh viên chưa đạt các môn tiên quyết: %s', 16, 1, @ds_mon_tien_quyet);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 4. Kiểm tra số môn ngoài chuyên ngành
        DECLARE @so_mon_ngoai_nganh INT,
                @ma_chuyen_nganh_sv NVARCHAR(10),
                @loai_mon NVARCHAR(20),
                @ma_chuyen_nganh_mh NVARCHAR(10);

        SELECT @ma_chuyen_nganh_sv = ma_chuyen_nganh
        FROM sinh_vien
        WHERE ma_sv = @ma_sv;

        SELECT @loai_mon = loai, @ma_chuyen_nganh_mh = ma_chuyen_nganh
        FROM mon_hoc
        WHERE ma_mh = @ma_mh;

        SELECT @so_mon_ngoai_nganh = COUNT(*)
        FROM ket_qua kq
        JOIN lop_hoc_phan lhp ON kq.ma_lop_hp = lhp.ma_lop_hp
        JOIN mon_hoc mh ON lhp.ma_mh = mh.ma_mh
        WHERE kq.ma_sv = @ma_sv
          AND lhp.ma_hoc_ky = @ma_hoc_ky
          AND mh.loai = N'chuyên ngành'
          AND mh.ma_chuyen_nganh <> @ma_chuyen_nganh_sv;

        SET @so_mon_ngoai_nganh = ISNULL(@so_mon_ngoai_nganh, 0);

        IF (@loai_mon = N'chuyên ngành' 
            AND @ma_chuyen_nganh_mh <> @ma_chuyen_nganh_sv
            AND @so_mon_ngoai_nganh >= 3)
        BEGIN
            RAISERROR(N'Sinh viên đã đăng ký đủ 3 môn ngoài chuyên ngành.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 5. Kiểm tra sức chứa lớp học
        DECLARE @so_sv_lop INT, @suc_chua INT;

        SELECT @so_sv_lop = COUNT(*) FROM ket_qua WHERE ma_lop_hp = @ma_lop_hp;

        SELECT @suc_chua = suc_chua FROM phong_hoc WHERE ma_phong = @ma_phong;

        IF @so_sv_lop >= @suc_chua
        BEGIN
            RAISERROR(N'Lớp học phần đã đủ số sinh viên tối đa.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Nếu qua hết kiểm tra -> thêm bản ghi vào ket_qua
        INSERT INTO ket_qua(ma_lop_hp, ma_sv, diem)
        VALUES(@ma_lop_hp, @ma_sv, NULL);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000),
                @ErrorSeverity INT,
                @ErrorState INT;

        SELECT @ErrorMessage = ERROR_MESSAGE(),
               @ErrorSeverity = ERROR_SEVERITY(),
               @ErrorState = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;