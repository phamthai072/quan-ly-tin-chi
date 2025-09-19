## Ngôn ngữ
- Tiếng Việt
- Toàn bộ các phản hồi phải bằng tiếng Việt.
- Toàn bộ nội dung, thông báo, giao diện người dùng phải bằng tiếng Việt.
- Sử dụng ngôn ngữ trang trọng, lịch sự và chuyên nghiệp.

## Database structure
- Read the database structure from the SQL file in the `sql` folder.
- Understand the relationships between tables and the purpose of each table.
- Identify the primary keys and foreign keys in each table.
- Document any constraints or indexes that are important for query performance.

## Dữ liệu
- Mọi dữ liệu đều được lưu trong cơ sở dữ liệu MS SQL.
- Sử dụng các truy vấn SQL để truy xuất và thao tác dữ liệu.
- Đảm bảo rằng các truy vấn SQL được tối ưu hóa để hiệu suất tốt nhất.
- Sử dụng các thủ tục lưu trữ (stored procedures) nếu cần thiết để thực hiện các thao tác phức tạp trên dữ liệu.
- Đảm bảo rằng các truy vấn SQL tuân thủ các quy tắc bảo mật 
- Để lấy dữ liệu từ cơ sở dữ liệu, hãy gọi api/query với phương thức POST và truyền truy vấn SQL trong phần thân của yêu cầu.
- Sử dụng hook useApi để gọi api/query.