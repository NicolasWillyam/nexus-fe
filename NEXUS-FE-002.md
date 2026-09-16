# NEXUS-FE-002 – Empty/Error State

## 1. Thông tin

**Họ tên: Nguyễn Thị Minh Thư**

**Nhóm: 5. Frontend & Visualization**

**Task: SV18 — Empty/Error State**

**Ngày thực hiện: 13/09/2026**

---

# 2. Chức năng này dùng để làm gì?

Chức năng Empty/Error State được sử dụng để thông báo cho người dùng khi hệ thông không có dữ liệu trả về hoặc không thể tải dữ liệu.
    - Empty State: Không có dữ liệu người dùng cần để hiển thị.
    - Error State: Không thể tải dữ liệu do xảy ra lỗi trong quá trình gọi API.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng truy cập trang web để xem danh sách cổ phiếu. Trong trường hợp không có dữ liệu cần tìm hoặc hệ thống không thể tải dữ liệu, người dùng cần nhận được thông báo để có thể thực hiện lại thao tác.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp người dùng biết được hệ thống có đang hoạt động bình thường hay không khi được thông báo rõ tình trạng hiện tại thông qua việc phân biệt trường hợp không có dữ liệu và trường hợp tải dữ liệu thất bại.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng mở Dashboard.
2. Nhập mã cổ phiếu.
3. Hệ thống tìm kiếm.
4. Hiển thị kết quả (3 trường hợp):
    - Trường hợp 1: Có dữ liệu cần tìm -> Hiển thị thông tin
    - Trường hợp 2: Không có dữ liệu 
        -> Màn hình xuất hiện thông báo "No data available."    
        -> Người dùng nhấn nút "Try again" phía dưới để nhập lại mã cổ phiếu khác.
    - Trường hợp 3: Không thể tải dữ liệu
        -> Màn hình xuất hiện thông báo "Cannot load data."
        -> Người dùng nhấn nút "Retry" phía dưới để tải lại dữ liệu cho Dashboard.

---

# 4. API sử dụng

API: GET /api/v1/stocks

EmptyState và ErrorState không trực tiếp gọi API, mà được Dashboard render dựa trên kết quả gọi API.

API dùng để lấy toàn bộ danh sách cổ phiếu (symbol, tên công ty, sàn giao dịch, giá hiện tại, mức thay đổi, phần trăm biến động) hiển thị trong bảng Danh sách Cổ phiếu chi tiết.

---

# 5. Input

Nhận dữ liệu thông qua Props:
    - onRetry: Hàm gọi lại khi bấm nút (fetchStocks, setSearch).
    - message: Nội dung thông báo ("No data available.", "Cannot load data.").
    - label: Tên nút ("Try again", "Retry").

Điều kiện hiển thị:
    - error === true -> ErrorState
    - filteredStocks.length === 0 (Không lỗi, không loading) -> EmptyState

---

# 6. Output

Khi không có dữ liệu (Empty State):
    No data available.
       [Try again]

Khi API xảy ra lỗi (Error State):
    Cannot load data.
        [Retry]

---

# 7. Cách tôi thực hiện

Mô tả các bước thực hiện.

Ví dụ:

1. Phân tích yêu cầu
    - Không có dữ liệu → Empty State.
    - Không thể tải dữ liệu → Error State.
2. Tạo component EmptyState.tsx
    - Nhận props onRetry, message, label (đều optional, có giá trị mặc định)
    - Hiển thị thông báo + nút "Try again"
    - Sử dụng Button component có sẵn trong Project để giao diện được đồng nhất.
    - Sử dụng onRetry={() => setSearch("")} để tự động xoá thanh tìm kiếm -> trở về danh sách ban đầu nhập lại mã phổ phiếu khi nhấn "Try again".
3. Tạo component ErrorState.tsx (Tương tự EmptyState)
    - Sử dụng onRetry={fetchStocks} để gọi lại API khi nhấn "Retry".
4. Import 2 components vào page.tsx + xử lý UI.

---

# 8. Code chính

NEXUS-FE-002.md
app/page.tsx
components/EmptyState.tsx
components/ErrorState.tsx
public/Screenshot/Test_1.png
public/Screenshot/Test_2.png
public/Screenshot/Test_3.png
public/Screenshot/Test_4.png
public/Screenshot/Test_5.png

---

# 9. Test

| STT | Test case | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Mở Dashboard | Hiển thị danh sách cổ phiếu | Hiển thị danh sách cổ phiếu | PASS |
| 2 | Nhập mã không khớp (ZZZZ) | Hiển thị EmptyState + nút "Try again" | Hiển thị EmptyState + nút "Try again" | PASS |
| 3 | Nhấn "Try again" + Nhập AAPL | Hiển thị AAPL | Hiển thị AAPL | PASS |
| 4 | Tạm dừng backend | Hiển thị ErrorState + nút "Retry" | Hiển thị ErrorState + nút "Retry" | PASS |
| 5 | Chạy lại backend + nhấn "Retry" | Hiển thị danh sách cổ phiếu | Hiển thị danh sách cổ phiếu | PASS |

---

# 10. Screenshot

[View Screenshot](./public/Screenshot/Test_1.png)

[View Screenshot](./public/Screenshot/Test_2.png)

[View Screenshot](./public/Screenshot/Test_3.png)

[View Screenshot](./public/Screenshot/Test_4.png)

[View Screenshot](./public/Screenshot/Test_5.png)

---

# 11. Khó khăn gặp phải

Ví dụ:

- Chưa nắm chắc cách dùng thư viện React + TypeScript.
- Chưa nắm chắc cách xử lý UI sau khi tạo component EmptyState + ErrorState.
- chưa biết sử dụng postgreSQL để import dữ liệu.
---

# 12. Tôi đã học được gì?
- Cách cài đặt môi trường, chạy backend + frontend.
- Cách sử dụng Props trong React.
- Hiểu nghiệp vụ + testing.

---

# 13. Git

Branch:

feature/NEXUS-FE-002-empty-error-state

Commit:

feat: add empty and error states

Merge Request: [link MR]