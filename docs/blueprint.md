# **App Name**: CreditFlow

## Core Features:

- Quản lý Khoa: Thêm, xóa, sửa đổi và tìm kiếm thông tin khoa (ma_khoa, ten_khoa). Database sử dụng MSSQL.
- Quản lý Chuyên ngành: Thêm, xóa, sửa đổi và tìm kiếm thông tin chuyên ngành (ma_chuyen_nganh, ten_chuyen_nganh, ma_khoa). Database sử dụng MSSQL.
- Quản lý Khóa học: Thêm, xóa, sửa đổi và tìm kiếm thông tin khóa học (ma_khoa_hoc, ten_khoa_hoc, nam_bat_dau). Database sử dụng MSSQL.
- Quản lý Giảng viên: Thêm, xóa, sửa đổi và tìm kiếm thông tin giảng viên (ma_gv, ho_ten_gv, ma_khoa, don_gia). Database sử dụng MSSQL.
- Quản lý Phòng học: Thêm, xóa, sửa đổi và tìm kiếm thông tin phòng học (ma_phong, ten_phong, suc_chua). Database sử dụng MSSQL.
- Quản lý Học kỳ: Thêm, xóa, sửa đổi và tìm kiếm thông tin học kỳ (ma_hk, ten_hk, nam_hoc, ngay_bat_dau, ngay_ket_thuc). Database sử dụng MSSQL.
- Quản lý Môn học: Thêm, xóa, sửa đổi và tìm kiếm thông tin môn học (ma_mh, ten_mh, so_tin_chi, ma_khoa, loai). Database sử dụng MSSQL.
- Quản lý Môn Tiên Quyết: Quản lý thông tin môn tiên quyết (ma_mh, ma_mh_tien_quyet). Database sử dụng MSSQL.
- Quản lý Lớp học phần: Thêm, xóa, sửa đổi và tìm kiếm thông tin lớp học phần (ma_lop_hp, ma_mh, ma_gv, ma_hoc_ky, ma_phong). Database sử dụng MSSQL.
- Quản lý Lịch học: Quản lý thông tin lịch học (ma_lop_hp, thu, tiet_bat_dau, tiet_ket_thuc, ma_phong). Database sử dụng MSSQL.
- Quản lý Sinh viên: Thêm, xóa, sửa đổi và tìm kiếm hồ sơ sinh viên (ma_sv, ma_chuyen_nganh, ma_khoa_hoc, ho_ten_sv, he_dao_tao). Database sử dụng MSSQL.
- Quản lý Kết quả: Quản lý thông tin kết quả học tập (ma_lop_hp, ma_sv, diem). Database sử dụng MSSQL.
- Phân tích Hiệu suất: Công cụ sử dụng thông tin điểm và GPA của sinh viên, tính toán GPA học kỳ và tích lũy dựa trên trọng số tín chỉ, xếp hạng sinh viên theo GPA, lọc theo lớp/khoa/khóa và trực quan hóa kết quả học tập cho mỗi lớp và cảnh báo người dùng về kết quả học tập không đáp ứng yêu cầu. Cũng phát hiện GPA thấp hoặc số lần trượt môn quá nhiều của sinh viên dựa trên các ngưỡng do quản trị viên cấu hình. Các ngưỡng cho cảnh báo nên được tùy chỉnh. Database sử dụng MSSQL.
- Phân tích Sử dụng Phòng: Hiển thị tần suất sử dụng phòng cho mỗi phòng trong một học kỳ. Sắp xếp các phòng theo tần suất sử dụng giảm dần. Database sử dụng MSSQL.

## Style Guidelines:

- Màu chính: Đỏ (#FF0000) để thể hiện sự năng động và quan trọng, tương tự như màu của PTIT.
- Màu nền: Trắng (#FFFFFF) cho giao diện sạch sẽ và chuyên nghiệp.
- Màu nhấn: Sử dụng các sắc thái khác nhau của đỏ để làm nổi bật các yếu tố quan trọng và tạo sự tương phản.
- Phông chữ thân văn bản và tiêu đề: Sử dụng phông chữ rõ ràng, dễ đọc như 'Arial' hoặc 'Roboto' để đảm bảo trải nghiệm người dùng tốt.
- Sử dụng các biểu tượng đơn giản, dễ nhận biết và phù hợp với chủ đề học tập và quản lý.
- Bố cục rõ ràng, có cấu trúc với các phần được phân chia rõ ràng để dễ dàng điều hướng và tìm kiếm thông tin.
- Sử dụng các hiệu ứng chuyển động nhẹ nhàng để tạo sự tương tác và phản hồi cho người dùng.