1. Thông tin
Họ tên: Nguyễn Thị Như Ngọc

Nhóm: 03_Scoring and Portfolio

Task: 

2. Chức năng này dùng để làm gì?

Chức năng này dùng để hiển thị tóm tắt danh mục đầu tư

3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Mô tả nhu cầu của người dùng.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp người dùng...

## 3.3 Người dùng sử dụng như thế nào?

Ví dụ:

1. Người dùng mở Stock Analysis.
2. Nhập mã cổ phiếu.
3. Hệ thống tìm kiếm.
4. Hiển thị kết quả.



4. API sử dụng

API:

GET/api/v1/data-pipeline/portfolio-inputs

API dùng để lấy Lợi nhuận kỳ vọng (Expected Returns) và Ma trận rủi ro (Covariance Matrix).


# 5. Input

Ví dụ:

Search keyword:

NVDA

---

# 6. Output

Ví dụ:

NVDA - NVIDIA

---

# 7. Cách tôi thực hiện

Mô tả các bước thực hiện.

Ví dụ:

1. Gọi API lấy danh sách stock.
2. Lưu dữ liệu vào state.
3. Nhận keyword từ input.
4. Lọc danh sách.
5. Hiển thị kết quả.

---

# 8. Code chính

Liệt kê những file đã thay đổi.

Ví dụ:

StockSearch.vue

---

# 9. Test

| STT | Test case | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Nhập NVDA | Hiển thị NVDA | Hiển thị NVDA | PASS |
| 2 | Nhập AAPL | Hiển thị AAPL | Hiển thị AAPL | PASS |
| 3 | Nhập ABC | Không có kết quả | Không có kết quả | PASS |
| 4 | Search rỗng | Hiển thị tất cả | Hiển thị tất cả | PASS |

---

# 10. Screenshot

Thêm screenshot chức năng.

---

# 11. Khó khăn gặp phải

Ví dụ:

- API response khác với dự kiến.
- Chưa biết cách xử lý empty state.
- Chưa biết cách xử lý loading.

---

# 12. Tôi đã học được gì?

...

---

# 13. Git

Branch:

feature/NEXUS-STOCK-002-stock-search

Commit:

feat: add stock search

Merge Request:

[link MR]

