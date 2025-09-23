-- DROP SCHEMA dbo;

-- CREATE SCHEMA dbo;
-- QuanLyTinChi.dbo.cau_hinh definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.cau_hinh;

CREATE TABLE QuanLyTinChi.dbo.cau_hinh (
	ten nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	gia_tri nvarchar(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__cau_hinh__DC107AB09C200B87 PRIMARY KEY (ten)
);


-- QuanLyTinChi.dbo.hoc_ky definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.hoc_ky;

CREATE TABLE QuanLyTinChi.dbo.hoc_ky (
	ma_hk nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_hk nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	nam_hoc nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ngay_bat_dau date NOT NULL,
	ngay_ket_thuc date NOT NULL,
	CONSTRAINT PK__hoc_ky__0FE16EBF035DEF2E PRIMARY KEY (ma_hk)
);
ALTER TABLE QuanLyTinChi.dbo.hoc_ky WITH NOCHECK ADD CONSTRAINT CK_hoc_ky_ma_hk_khong_rong CHECK ((len(ltrim(rtrim([ma_hk])))>(0)));


-- QuanLyTinChi.dbo.khoa definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.khoa;

CREATE TABLE QuanLyTinChi.dbo.khoa (
	ma_khoa nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_khoa nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__khoa__B2C5324EE7AFC768 PRIMARY KEY (ma_khoa)
);
ALTER TABLE QuanLyTinChi.dbo.khoa WITH NOCHECK ADD CONSTRAINT CK_khoa_ma_khoa_khong_rong CHECK ((len(ltrim(rtrim([ma_khoa])))>(0)));


-- QuanLyTinChi.dbo.khoa_hoc definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.khoa_hoc;

CREATE TABLE QuanLyTinChi.dbo.khoa_hoc (
	ma_khoa_hoc nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_khoa_hoc nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	nam_bat_dau int NOT NULL,
	CONSTRAINT PK__khoa_hoc__50BFE165D47D1D85 PRIMARY KEY (ma_khoa_hoc)
);
ALTER TABLE QuanLyTinChi.dbo.khoa_hoc WITH NOCHECK ADD CONSTRAINT CK_khoa_hoc_ma_khoa_hoc_khong_rong CHECK ((len(ltrim(rtrim([ma_khoa_hoc])))>(0)));


-- QuanLyTinChi.dbo.phong_hoc definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.phong_hoc;

CREATE TABLE QuanLyTinChi.dbo.phong_hoc (
	ma_phong nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_phong nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	suc_chua int NOT NULL,
	CONSTRAINT PK__phong_ho__1BD319C9CC9CF261 PRIMARY KEY (ma_phong)
);
ALTER TABLE QuanLyTinChi.dbo.phong_hoc WITH NOCHECK ADD CONSTRAINT CK__phong_hoc__suc_c__412EB0B6 CHECK (([suc_chua]>(0)));
ALTER TABLE QuanLyTinChi.dbo.phong_hoc WITH NOCHECK ADD CONSTRAINT CK_phong_hoc_ma_phong_khong_rong CHECK ((len(ltrim(rtrim([ma_phong])))>(0)));


-- QuanLyTinChi.dbo.chuyen_nganh definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.chuyen_nganh;

CREATE TABLE QuanLyTinChi.dbo.chuyen_nganh (
	ma_chuyen_nganh nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_chuyen_nganh nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_khoa nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__chuyen_n__ECDF72A0F3969CE8 PRIMARY KEY (ma_chuyen_nganh),
	CONSTRAINT FK__chuyen_ng__ma_kh__398D8EEE FOREIGN KEY (ma_khoa) REFERENCES QuanLyTinChi.dbo.khoa(ma_khoa)
);
 CREATE NONCLUSTERED INDEX IX_chuyen_nganh_ma_khoa ON dbo.chuyen_nganh (  ma_khoa ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.chuyen_nganh WITH NOCHECK ADD CONSTRAINT CK_chuyen_nganh_ma_khong_rong CHECK ((len(ltrim(rtrim([ma_chuyen_nganh])))>(0)));


-- QuanLyTinChi.dbo.giang_vien definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.giang_vien;

CREATE TABLE QuanLyTinChi.dbo.giang_vien (
	ma_gv nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ho_ten_gv nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_khoa nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	don_gia decimal(12,2) NOT NULL,
	CONSTRAINT PK__giang_vi__0FE11613B05ADE96 PRIMARY KEY (ma_gv),
	CONSTRAINT FK__giang_vie__ma_kh__3E52440B FOREIGN KEY (ma_khoa) REFERENCES QuanLyTinChi.dbo.khoa(ma_khoa)
);
 CREATE NONCLUSTERED INDEX IX_giang_vien_ma_khoa ON dbo.giang_vien (  ma_khoa ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.giang_vien WITH NOCHECK ADD CONSTRAINT CK_giang_vien_ma_gv_khong_rong CHECK ((len(ltrim(rtrim([ma_gv])))>(0)));


-- QuanLyTinChi.dbo.mon_hoc definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.mon_hoc;

CREATE TABLE QuanLyTinChi.dbo.mon_hoc (
	ma_mh nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ten_mh nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	so_tin_chi int NOT NULL,
	ma_chuyen_nganh nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	loai nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__mon_hoc__0FE0842CF464AAC5 PRIMARY KEY (ma_mh),
	CONSTRAINT FK__mon_hoc__ma_chuy__47DBAE45 FOREIGN KEY (ma_chuyen_nganh) REFERENCES QuanLyTinChi.dbo.chuyen_nganh(ma_chuyen_nganh)
);
 CREATE NONCLUSTERED INDEX IX_mon_hoc_loai ON dbo.mon_hoc (  loai ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_mon_hoc_ma_chuyen_nganh ON dbo.mon_hoc (  ma_chuyen_nganh ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.mon_hoc WITH NOCHECK ADD CONSTRAINT CK__mon_hoc__so_tin___45F365D3 CHECK (([so_tin_chi]>(0)));
ALTER TABLE QuanLyTinChi.dbo.mon_hoc WITH NOCHECK ADD CONSTRAINT CK__mon_hoc__loai__46E78A0C CHECK (([loai]=N'chuyên ngành' OR [loai]=N'cơ bản'));
ALTER TABLE QuanLyTinChi.dbo.mon_hoc WITH NOCHECK ADD CONSTRAINT CK_mon_hoc_ma_mh_khong_rong CHECK ((len(ltrim(rtrim([ma_mh])))>(0)));


-- QuanLyTinChi.dbo.mon_tien_quyet definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.mon_tien_quyet;

CREATE TABLE QuanLyTinChi.dbo.mon_tien_quyet (
	ma_mh nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_mh_tien_quyet nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__mon_tien__4EBA05A4731B9AB0 PRIMARY KEY (ma_mh,ma_mh_tien_quyet),
	CONSTRAINT FK__mon_tien___ma_mh__4AB81AF0 FOREIGN KEY (ma_mh) REFERENCES QuanLyTinChi.dbo.mon_hoc(ma_mh),
	CONSTRAINT FK__mon_tien___ma_mh__4BAC3F29 FOREIGN KEY (ma_mh_tien_quyet) REFERENCES QuanLyTinChi.dbo.mon_hoc(ma_mh)
);
 CREATE NONCLUSTERED INDEX IX_mon_tien_quyet_ma_mh ON dbo.mon_tien_quyet (  ma_mh ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_mon_tien_quyet_ma_mh_tien_quyet ON dbo.mon_tien_quyet (  ma_mh_tien_quyet ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- QuanLyTinChi.dbo.sinh_vien definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.sinh_vien;

CREATE TABLE QuanLyTinChi.dbo.sinh_vien (
	ma_sv nvarchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_chuyen_nganh nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_khoa_hoc nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ho_ten_sv nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	he_dao_tao nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__sinh_vie__0FE0F4825EE94A39 PRIMARY KEY (ma_sv),
	CONSTRAINT FK__sinh_vien__ma_ch__5AEE82B9 FOREIGN KEY (ma_chuyen_nganh) REFERENCES QuanLyTinChi.dbo.chuyen_nganh(ma_chuyen_nganh),
	CONSTRAINT FK__sinh_vien__ma_kh__5BE2A6F2 FOREIGN KEY (ma_khoa_hoc) REFERENCES QuanLyTinChi.dbo.khoa_hoc(ma_khoa_hoc)
);
 CREATE NONCLUSTERED INDEX IX_sinh_vien_ma_chuyen_nganh ON dbo.sinh_vien (  ma_chuyen_nganh ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_sinh_vien_ma_khoa_hoc ON dbo.sinh_vien (  ma_khoa_hoc ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.sinh_vien WITH NOCHECK ADD CONSTRAINT CK__sinh_vien__he_da__59FA5E80 CHECK (([he_dao_tao]=N'đại học' OR [he_dao_tao]=N'cao đẳng'));
ALTER TABLE QuanLyTinChi.dbo.sinh_vien WITH NOCHECK ADD CONSTRAINT CK_sinh_vien_ma_sv_khong_rong CHECK ((len(ltrim(rtrim([ma_sv])))>(0)));


-- QuanLyTinChi.dbo.lop_hoc_phan definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.lop_hoc_phan;

CREATE TABLE QuanLyTinChi.dbo.lop_hoc_phan (
	ma_lop_hp nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_mh nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_gv nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_hoc_ky nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_phong nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__lop_hoc___E9DE33CBC132A813 PRIMARY KEY (ma_lop_hp),
	CONSTRAINT UQ_LopHocPhan UNIQUE (ma_mh,ma_gv,ma_hoc_ky,ma_phong),
	CONSTRAINT FK__lop_hoc_p__ma_gv__4F7CD00D FOREIGN KEY (ma_gv) REFERENCES QuanLyTinChi.dbo.giang_vien(ma_gv),
	CONSTRAINT FK__lop_hoc_p__ma_ho__5070F446 FOREIGN KEY (ma_hoc_ky) REFERENCES QuanLyTinChi.dbo.hoc_ky(ma_hk),
	CONSTRAINT FK__lop_hoc_p__ma_mh__4E88ABD4 FOREIGN KEY (ma_mh) REFERENCES QuanLyTinChi.dbo.mon_hoc(ma_mh),
	CONSTRAINT FK__lop_hoc_p__ma_ph__5165187F FOREIGN KEY (ma_phong) REFERENCES QuanLyTinChi.dbo.phong_hoc(ma_phong)
);
 CREATE NONCLUSTERED INDEX IX_lop_hoc_phan_ma_gv ON dbo.lop_hoc_phan (  ma_gv ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_lop_hoc_phan_ma_hoc_ky ON dbo.lop_hoc_phan (  ma_hoc_ky ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_lop_hoc_phan_ma_mh ON dbo.lop_hoc_phan (  ma_mh ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_lop_hoc_phan_ma_phong ON dbo.lop_hoc_phan (  ma_phong ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.lop_hoc_phan WITH NOCHECK ADD CONSTRAINT CK_lop_hoc_phan_ma_lop_hp_khong_rong CHECK ((len(ltrim(rtrim([ma_lop_hp])))>(0)));


-- QuanLyTinChi.dbo.ket_qua definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.ket_qua;

CREATE TABLE QuanLyTinChi.dbo.ket_qua (
	ma_lop_hp nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_sv nvarchar(15) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	diem decimal(4,2) NULL,
	CONSTRAINT PK__ket_qua__D9203C8359BEDB32 PRIMARY KEY (ma_lop_hp,ma_sv),
	CONSTRAINT UQ_ket_qua UNIQUE (ma_sv,ma_lop_hp),
	CONSTRAINT FK__ket_qua__ma_lop___5FB337D6 FOREIGN KEY (ma_lop_hp) REFERENCES QuanLyTinChi.dbo.lop_hoc_phan(ma_lop_hp),
	CONSTRAINT FK__ket_qua__ma_sv__60A75C0F FOREIGN KEY (ma_sv) REFERENCES QuanLyTinChi.dbo.sinh_vien(ma_sv)
);
 CREATE NONCLUSTERED INDEX IX_ket_qua_ma_lop_hp ON dbo.ket_qua (  ma_lop_hp ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
 CREATE NONCLUSTERED INDEX IX_ket_qua_ma_sv ON dbo.ket_qua (  ma_sv ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.ket_qua WITH NOCHECK ADD CONSTRAINT CK__ket_qua__diem__5EBF139D CHECK (([diem]>=(0) AND [diem]<=(10)));


-- QuanLyTinChi.dbo.lich_hoc definition

-- Drop table

-- DROP TABLE QuanLyTinChi.dbo.lich_hoc;

CREATE TABLE QuanLyTinChi.dbo.lich_hoc (
	ma_lich_hoc nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ma_lop_hp nvarchar(10) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	thu tinyint NOT NULL,
	tiet_bat_dau int NOT NULL,
	tiet_ket_thuc int NOT NULL,
	CONSTRAINT PK__lich_hoc__2318C3C0F9656508 PRIMARY KEY (ma_lich_hoc),
	CONSTRAINT FK__lich_hoc__ma_lop__797309D9 FOREIGN KEY (ma_lop_hp) REFERENCES QuanLyTinChi.dbo.lop_hoc_phan(ma_lop_hp)
);
 CREATE NONCLUSTERED INDEX IX_lich_hoc_ma_lop_hp ON dbo.lich_hoc (  ma_lop_hp ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;
ALTER TABLE QuanLyTinChi.dbo.lich_hoc WITH NOCHECK ADD CONSTRAINT CK__lich_hoc__thu__787EE5A0 CHECK (([thu]>=(2) AND [thu]<=(8)));
ALTER TABLE QuanLyTinChi.dbo.lich_hoc WITH NOCHECK ADD CONSTRAINT CK_lich_hoc_ma_khong_rong CHECK ((len(ltrim(rtrim([ma_lich_hoc])))>(0)));
ALTER TABLE QuanLyTinChi.dbo.lich_hoc WITH NOCHECK ADD CONSTRAINT CK_lich_hoc_tiet CHECK (([tiet_bat_dau]<=[tiet_ket_thuc]));


-- dbo.vw_ds_lhp_sinh_vien source

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


-- dbo.vw_ds_lop_hoc_phan source

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


-- dbo.vw_hieu_suat source

-- dbo.vw_hieu_suat source

CREATE   VIEW vw_hieu_suat
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


-- dbo.vw_thong_ke_su_dung_phong source

-- dbo.vw_thong_ke_su_dung_phong source

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
        LEFT JOIN lop_hoc_phan lhp ON ph.ma_phong = lhp.ma_phong
        LEFT JOIN lich_hoc lh ON lhp.ma_lop_hp = lh.ma_lop_hp
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


-- dbo.vw_thong_ke_sv source

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