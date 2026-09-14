# NEXUS-STOCK-005 – Stock Ranking

## 1. Thông tin

**Họ tên:** Đào Việt Thịnh

**Nhóm:** 2

**Task:** SV09

**Ngày thực hiện:** 14/09/2026

---

# 2. Chức năng này dùng để làm gì?

Chức năng này cho phép người dùng xem bảng xếp hạng các cổ phiếu dựa trên
điểm phân tích (score). Hệ thống gọi API phân tích, tính toán điểm cho từng
cổ phiếu, sau đó sắp xếp và hiển thị bảng xếp hạng từ cao đến thấp.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn so sánh và xếp hạng các cổ phiếu theo điểm phân tích tổng hợp
để nhanh chóng nhận biết cổ phiếu nào đang có hiệu suất tốt nhất.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp người dùng có cái nhìn tổng quan về hiệu suất các cổ phiếu
đang theo dõi, từ đó hỗ trợ ra quyết định đầu tư nhanh hơn thông qua bảng
xếp hạng trực quan.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng mở trang có chứa component Stock Ranking.
2. Hệ thống tự động gọi API phân tích cổ phiếu.
3. Dữ liệu được sắp xếp theo điểm (score) từ cao đến thấp.
4. Hiển thị bảng xếp hạng gồm: Rank, Stock, Score.

---

# 4. API sử dụng

API: `GET /api/v1/stocks/analysis?symbols=AAPL&symbols=MSFT&symbols=NVDA`

API dùng để lấy dữ liệu phân tích cổ phiếu bao gồm: score, performance,
trend indicators, và risk metrics cho từng mã cổ phiếu được truyền vào.

Response chính:
```json
{
  "total_analyzed": 3,
  "stocks": {
    "AAPL": { "score": 86, "metrics": { ... } },
    "MSFT": { "score": 19.92, "metrics": { ... } },
    "NVDA": { "score": 68.83, "metrics": { ... } }
  }
}
```

---

# 5. Input

Symbols (mã cổ phiếu) được truyền qua query params:

`symbols=AAPL&symbols=MSFT&symbols=NVDA`

---

# 6. Output

Bảng xếp hạng:

| Rank | Stock | Score |
|------|-------|-------|
| 1    | AAPL  | 86    |
| 2    | NVDA  | 69    |
| 3    | MSFT  | 20    |

---

# 7. Cách tôi thực hiện

---

# 8. Code chính

StockRanking.tsx

---

# 9. Test

---

# 10. Screenshot

// WIP: Thêm screenshot chức năng.

---

# 11. Khó khăn gặp phải

---

# 12. Tôi đã học được gì?

---

# 13. Git

Branch:

feature/NEXUS-STOCK-005-stock-ranking

Commit:

// WIP

Merge Request:

[link MR]