
# NEXUS-QA-001 – API Testing Report

# 1. Thông tin
Họ tên: Trần Thị Diệu Linh

**Task: SV21 — API Test

**Ngày thực hiện: 17/09/2026

---

# 2. Chức năng này dùng để làm gì?

Chức năng này dùng để kiểm thử (Test) các API chính của hệ thống Backend (Nexus Backend) nhằm đảm bảo các endpoint hoạt động ổn định, trả về đúng mã trạng thái và cấu trúc dữ liệu hợp lệ.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?
Kiểm tra trạng thái và khả năng phản hồi của các API chính trong hệ thống.

## 3.2 Tại sao Nexus cần chức năng này?
Giúp phát hiện sớm các lỗi kết nối hoặc lỗi logic từ backend trước khi tích hợp vào giao diện Frontend.

## 3.3 Người dùng sử dụng như thế nào?
1. Khởi động Backend server (FastAPI).
2. Truy cập giao diện Swagger UI (`/docs`).
3. Gửi request đến các API cần kiểm tra và đánh giá kết quả trả về.

---

# 4. API sử dụng

- `GET /api/v1/stocks`
- `GET /api/v1/stocks/analysis`
- `GET /api/v1/analytics/stock-summary`
- `GET /api/v1/data-pipeline/data-pipeline/health`
- `POST /api/v1/portfolio/portfolio/optimize`

---

# 5. Input

- Các request chuẩn theo cấu trúc yêu cầu của từng API (Normal/Valid/Empty).

---

# 6. Output

- Trả về dữ liệu dạng JSON kèm theo mã trạng thái HTTP tương ứng (ví dụ: `200 OK`).

---

# 7. Cách tôi thực hiện

1. Kích hoạt môi trường ảo (`.venv`) và chạy lệnh `uvicorn app.main:app --reload`.
2. Mở trình duyệt truy cập `http://127.0.0.1:8000/docs`.
3. Lần lượt bấm “Try it out” và “Execute” cho từng API trong danh sách.
4. Ghi nhận mã phản hồi (Response Code) và so sánh với kết quả kỳ vọng.

---

# 8. Code chính
Không có gì thay đổi

---

# 9. Test


STT
API Endpoint
Test Case
Expected
Actual
Result
1
/api/v1/stocks
Normal 
200
200
PASS
2
/api/v1/stocks 
Empty 
200
200
PASS
3
/api/v1/stocks/analysis 
Normal 
200
200
PASS
4
/api/v1/analytics/stock-summary 
Normal 
200
200
PASS
5
/api/v1/data-pipeline/data-pipeline/health 
Normal 
200
200
PASS
6
/api/v1/portfolio/portfolio/optimize 
Valid 
200
200
PASS



---







# 10. Screenshot

**Ảnh api/v1/stocks 



** Ảnh api/v1/stocks/analysis 





** Ảnh api/v1/analytics/stock-summary 



** Ảnh /api/v1/portfolio/portfolio/optimize



# 11. Khó khăn gặp phải

- Cần chú ý khởi động đúng môi trường ảo Python (`venv`) và cài đặt đủ các gói thư viện trước khi chạy server.
- Đẩy file lên gib

---

# 12. Tôi đã học được gì?
- Biết cách chạy 1 chương trình nhanh hơ
- Hiểu cách thức hoạt động của các API Backend trong dự án Nexus.
- Biết cách sử dụng Swagger UI để test nhanh các endpoint RESTful API.

---

# 13. Git

**Branch:** `feature/NEXUS-QA--api-test`

**Commit:** `test: complete API testing report for Nexus backend`

**Merge Request:** [Đường dẫn link Merge Request của bạn]






