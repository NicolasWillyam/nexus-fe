# NEXUS-DATA-002 – Price Matrix Preview

## 1. Thông tin

**Họ tên:** Nguyễn Duy Nam

**Nhóm:** 1 - Data Backend

**Task:** SV02 – Price Matrix Preview

**Ngày thực hiện:** 25/09/2026

---

# 2. Chức năng này dùng để làm gì?

Chức năng Price Matrix Preview cho phép người dùng xem trước một phần
dữ liệu giá cổ phiếu trên hệ thống Nexus.

Thay vì hiển thị toàn bộ dữ liệu Price Matrix, hệ thống chỉ hiển thị
15 dòng dữ liệu đầu tiên để người dùng có thể kiểm tra nhanh dữ liệu.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn xem nhanh một phần dữ liệu giá cổ phiếu mà hệ thống
đã xử lý.

Người dùng có thể truy cập mục **Preview** trên sidebar để xem dữ liệu.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng Preview giúp người dùng kiểm tra nhanh dữ liệu Price Matrix
trước khi sử dụng các chức năng phân tích hoặc xử lý dữ liệu khác.

Việc chỉ hiển thị một số dòng dữ liệu giúp giao diện dễ quan sát và
không phải tải toàn bộ dữ liệu lên màn hình.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng truy cập Nexus.
2. Chọn **Preview** trong mục Documents.
3. Hệ thống mở trang **Price Matrix Preview**.
4. Frontend gọi API lấy dữ liệu Price Matrix.
5. Hệ thống hiển thị 15 dòng dữ liệu đầu tiên.
6. Người dùng có thể xem ngày và giá của các mã cổ phiếu.

---

# 4. API sử dụng

API:

GET /api/v1/data-pipeline/cleaned-price-matrix

API được sử dụng để lấy dữ liệu Price Matrix đã được xử lý từ backend.

Frontend gọi API thông qua Axios API client được cấu hình trong:

lib/api.ts

---

# 5. Input

Chức năng Preview không yêu cầu người dùng nhập dữ liệu.

Khi người dùng truy cập trang Preview, frontend tự động gọi API:

GET /api/v1/data-pipeline/cleaned-price-matrix

---

# 6. Output

Hệ thống hiển thị bảng Price Matrix Preview.

Các cột dữ liệu gồm:

- Date
- AAPL
- AMZN
- GOOGL
- MSFT
- NVDA

Chức năng giới hạn số lượng dữ liệu hiển thị ở:

15 dòng.

Ví dụ:

| Date | AAPL | AMZN | GOOGL | MSFT | NVDA |
|---|---:|---:|---:|---:|---:|
| 2025-12-11 | 278.03 | 230.28 | 312.43 | 483.47 | 180.93 |
| ... | ... | ... | ... | ... | ... |

---

# 7. Cách tôi thực hiện

## Bước 1 – Tạo trang Preview

Tạo route:

app/preview/page.tsx

Trang này chịu trách nhiệm hiển thị giao diện Price Matrix Preview.

## Bước 2 – Thêm mục Preview vào Sidebar

Thêm mục:

Preview

vào phần Documents của sidebar.

Khi người dùng click vào Preview, hệ thống chuyển đến:

/preview

## Bước 3 – Tạo component Price Matrix Preview

Tạo file:

components/PriceMatrixPreview.tsx

Component này chịu trách nhiệm:

- Gọi API.
- Nhận dữ liệu.
- Xử lý dữ liệu trả về.
- Chỉ lấy 15 dòng đầu tiên.
- Hiển thị dữ liệu dưới dạng bảng.
- Hiển thị trạng thái loading.
- Hiển thị thông báo lỗi khi API không thể truy cập.

## Bước 4 – Gọi API

Frontend sử dụng Axios thông qua:

lib/api.ts

API được gọi:

GET /data-pipeline/cleaned-price-matrix

## Bước 5 – Giới hạn dữ liệu

Sau khi nhận dữ liệu từ API, frontend lấy 15 dòng đầu tiên để hiển thị.

Ví dụ:

```tsx
setData(result.slice(0, 15));
```
# 8. Code chính

Các file được tạo và thay đổi:

- `app/preview/page.tsx`
  - Tạo trang Preview tại `/preview`.

- `components/PriceMatrixPreview.tsx`
  - Gọi API Price Matrix.
  - Hiển thị dữ liệu giá cổ phiếu dạng bảng.
  - Chỉ hiển thị 15 dòng dữ liệu đầu tiên.
  - Xử lý trạng thái loading và error.

- `components/app-sidebar.tsx`
  - Thêm mục Preview vào Sidebar.
  - Cập nhật đường dẫn Dashboard thành `/dashboard`.

- `components/nav-main.tsx`
  - Xử lý điều hướng các mục trong Sidebar bằng Next.js Link.

---

# 9. Test

| STT | Test case | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Truy cập `/preview` | Hiển thị trang Price Matrix Preview | Trang Preview hiển thị | PASS |
| 2 | Load dữ liệu Price Matrix | Hiển thị dữ liệu từ API | Dữ liệu được hiển thị | PASS |
| 3 | Kiểm tra số lượng dòng | Chỉ hiển thị 15 dòng dữ liệu | Hiển thị 15 dòng | PASS |
| 4 | Kiểm tra các cột dữ liệu | Hiển thị Date, AAPL, AMZN, GOOGL, MSFT, NVDA | Các cột được hiển thị | PASS |
| 5 | Kiểm tra Dashboard | Click Dashboard chuyển đến `/dashboard` | Chuyển đến Dashboard | PASS |
| 6 | Kiểm tra Preview trên Sidebar | Click Preview chuyển đến `/preview` | Chuyển đến Preview | PASS |
| 7 | API không trả về dữ liệu hợp lệ | Hiển thị thông báo lỗi | Hiển thị thông báo lỗi | PASS |

---

# 10. Screenshot



---

# 11. Khó khăn gặp phải

- API Price Matrix có thể trả về dữ liệu dưới các dạng khác nhau nên cần kiểm tra cấu trúc response trước khi hiển thị.
- Cần giới hạn dữ liệu preview còn 15 dòng thay vì hiển thị toàn bộ dữ liệu.
- Cần xử lý trạng thái loading trong quá trình gọi API.
- Cần xử lý trường hợp API lỗi hoặc dữ liệu không đúng định dạng.
- Cần thêm điều hướng từ Sidebar đến trang `/preview`.
# 12. Tôi đã học được gì?

Qua task này, tôi học được cách gọi API từ frontend bằng Axios, xử lý dữ liệu trả về và hiển thị dữ liệu dạng bảng. Tôi cũng hiểu cách giới hạn số lượng dữ liệu preview và xử lý trạng thái loading, error. Ngoài ra, tôi học được cách tạo branch, commit và push code lên GitHub để tạo Pull Request.

---

# 13. Git

**Branch:**

`feature/NEXUS-DATA-002-price-matrix-preview`

**Commit:**

`feat: add price matrix preview`

**Pull Request:**

[Link PR]
