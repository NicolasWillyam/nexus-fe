# NEXUS-STOCK-001 – Stock List

## 1. Thông tin

**Họ tên:** Đặng Trần Nam

**Nhóm:** 2

**Task:** HSV05 — Stock List

**Ngày thực hiện:** 19/09/2026

---

# 2. Chức năng này dùng để làm gì?

Chức năng này dùng để hiển thị danh sách các mã cổ phiếu trong hệ thống theo dạng bảng, lấy dữ liệu từ API và hiển thị mã cổ phiếu (Symbol), tên công ty (Name), giá hiện tại và các thông tin biến động thị trường.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn xem danh sách các mã cổ phiếu đang được theo dõi trên hệ thống, biết được mã chứng khoán (Symbol) và tên doanh nghiệp (Company Name), cùng với giá và mức tăng giảm trong phiên giao dịch.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp người dùng nắm bắt nhanh danh sách các mã cổ phiếu trên thị trường để tiện theo dõi, tìm kiếm và đưa vào danh mục đầu tư.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng mở trang Dashboard (`http://localhost:3000`).
2. Hệ thống tự động gọi API lấy danh sách cổ phiếu.
3. Bảng dữ liệu hiển thị danh sách các mã cổ phiếu.
4. Người dùng có thể tìm kiếm mã cổ phiếu hoặc lọc theo trạng thái tăng/giảm giá.

---

# 4. API sử dụng

API:

`GET /api/v1/stocks`

API dùng để lấy danh sách các mã cổ phiếu trong cơ sở dữ liệu.

Response mẫu:

```json
[
  {
    "id": 1,
    "symbol": "AAPL",
    "company_name": "Apple Inc.",
    "market": "NASDAQ (United States)",
    "industry": "Common Stock",
    "current_price": 311.3,
    "change_amount": -5.53,
    "change_percent": -1.75
  },
  {
    "id": 2,
    "symbol": "MSFT",
    "company_name": "Microsoft Corporation",
    "market": "NASDAQ (United States)",
    "industry": "Common Stock",
    "current_price": 420.5,
    "change_amount": 3.25,
    "change_percent": 0.78
  },
  {
    "id": 3,
    "symbol": "NVDA",
    "company_name": "NVIDIA Corporation",
    "market": "NASDAQ (United States)",
    "industry": "Common Stock",
    "current_price": 118.2,
    "change_amount": 4.6,
    "change_percent": 4.05
  }
]
```

---

# 5. Input

- Gọi API `GET /api/v1/stocks` (không có tham số bắt buộc).
- Nhận dữ liệu tìm kiếm hoặc lọc từ người dùng.

---

# 6. Output

Hiển thị danh sách cổ phiếu gồm mã Symbol và Tên công ty (Name):

| Symbol | Name |
|---|---|
| AAPL | Apple Inc. |
| MSFT | Microsoft Corporation |
| NVDA | NVIDIA Corporation |
| JPM | JPMorgan Chase & Co. |
| LLY | Eli Lilly and Company |

Bảng hiển thị trên giao diện gồm 2 cột:
- Mã Symbol
- Tên Công Ty

---

# 7. Cách tôi thực hiện

1. Tạo file component `StockList.tsx` trong thư mục `components/`.
2. Định nghĩa interface `Stock` để quản lý kiểu dữ liệu cho từng mã cổ phiếu.
3. Viết hàm gọi API `GET /api/v1/stocks` bằng Axios và lưu vào state `stocks`.
4. Xử lý trạng thái loading khi đang tải dữ liệu và empty state khi không có dữ liệu phù hợp.
5. Render bảng dữ liệu với 2 cột: Mã Symbol và Tên Công Ty.
6. Nhúng component `StockList` vào `app/page.tsx`.

---

# 8. Code chính

- `components/StockList.tsx`
- `app/page.tsx`

---

# 9. Test

| STT | Test case | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Mở trang khi Backend đã chạy | Hiển thị danh sách các mã cổ phiếu (AAPL, MSFT, NVDA...) | Hiển thị đầy đủ danh sách cổ phiếu | PASS |
| 2 | Đang tải dữ liệu | Hiển thị thông báo "Đang tải dữ liệu từ Server..." | Hiển thị trạng thái loading | PASS |
| 3 | Nhập tìm kiếm "NVDA" | Chỉ hiển thị mã NVDA | Hiển thị mã NVDA | PASS |
| 4 | Nhập tìm kiếm "ABCXYZ" | Hiển thị "Không tìm thấy dữ liệu phù hợp." | Hiển thị "Không tìm thấy dữ liệu phù hợp." | PASS |

---

# 10. Screenshot

*(Đính kèm hình ảnh chụp màn hình chức năng hoạt động trên localhost:3000)*

---

# 11. Khó khăn gặp phải

- Ban đầu chạy `npm run dev` bị lỗi `Network Error` do quên chưa khởi động Backend FastAPI (port 8000). Sau khi kích hoạt môi trường ảo và chạy `uvicorn app.main:app --reload` thì kết nối bình thường.
- Cần xử lý trạng thái loading và khi không tìm thấy kết quả để giao diện không bị trống hoặc lỗi.

---

# 12. Tôi đã học được gì?

- Biết cách tạo và tách component trong React/Next.js.
- Biết cách gọi API bằng Axios và quản lý dữ liệu với `useState`, `useEffect`.
- Hiểu được quy trình làm việc với Git: tạo branch, commit và push lên GitHub.

---

# 13. Git

Branch:

feature/NEXUS-STOCK-001-stock-list

Commit:

feat: add stock list

Merge Request:

[NEXUS-STOCK-001] Implement stock list
