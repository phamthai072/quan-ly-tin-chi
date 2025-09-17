USE QuanLyTinChi;
CREATE USER backend FOR LOGIN backend;
ALTER ROLE db_datareader ADD MEMBER backend; -- SELECT
ALTER ROLE db_datawriter ADD MEMBER backend; -- INSERT, UPDATE, DELETE

GRANT EXECUTE TO backend;
