# NEXUS-STOCK-005 – Stock Ranking

## 1. Thông tin

**Họ tên:** Đào Việt Thịnh

**Nhóm:** 2

**Task:** SV09

**Ngày thực hiện:** 14/09/2026

---

# 2. Chức năng này dùng để làm gì?

Chức năng này cho phép người dùng xem bảng xếp hạng các cổ phiếu dựa trên
điểm phân tích tổng hợp (score). 

Hệ thống gọi API phân tích, tính toán điểm cho từng
cổ phiếu, sau đó sắp xếp và hiển thị bảng xếp hạng trực quan từ cao đến thấp.

Người dùng có thể linh hoạt chuyển đổi giữa các nhóm cổ phiếu theo nhu cầu
(Top 3, Magnificent 7, Top 10 Tech, Top 10 S&P 500) thông qua dropdown selector.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn so sánh và xếp hạng các cổ phiếu theo điểm phân tích kỹ thuật & cơ bản
để nhanh chóng nhận biết cổ phiếu nào đang có hiệu suất và tiềm năng tốt nhất
trong danh mục theo dõi.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp nhà đầu tư tiết kiệm thời gian tổng hợp số liệu, cung cấp góc nhìn
trực quan về sức mạnh tương đối giữa các mã cổ phiếu hàng đầu.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng mở trang Dashboard (`/dashboard`).
2. Khối **Stock Ranking** hiển thị ngay phía trên bảng danh sách cổ phiếu chi tiết.
3. Mặc định xếp theo nhóm **Top 3** (`APL, MSFT, NVDA`).
4. Người dùng có thể bấm vào dropdown ở góc phải để chọn nhóm khác:
   - Magnificent 7 (7 mã công nghệ dẫn đầu)
   - Top 10 Tech (10 mã công nghệ vốn hóa lớn)
   - Top 10 S&P 500 (10 mã hàng đầu chỉ số S&P 500)
5. Bảng xếp hạng tự động cập nhật danh sách với thứ hạng và podium,
   mã cổ phiếu kèm icon xu hướng lợi nhuận 1 năm, và Badge điểm số phân tích.

---

# 4. API sử dụng

API: `GET /api/v1/stocks/analysis`

API dùng để lấy dữ liệu phân tích chuyên sâu của các mã cổ phiếu, bao gồm:
- **score**: Điểm đánh giá tổng hợp của thuật toán backend (thang điểm 100).
- **metrics.performance**: Lợi nhuận 1 năm (`total_return_1y`) và chuỗi lợi nhuận tích lũy.
- **metrics.trend_indicators**: Các thông sô như SMA 20/50, RSI 14, MACD (bullish/bearish).
- **metrics.risk_metrics**: Các chỉ số rủi ro như Volatility, Max Drawdown, Sharpe Ratio, Beta.

Response mẫu từ backend:
```json
{
  "total_analyzed": 3,
  "stocks": {
    "AAPL": {
      "score": 86,
      "metrics": {
        "performance": { "total_return_1y": 0.3142, ... },
        "trend_indicators": { "rsi_status": "OVERSOLD", "macd": { "is_bullish": false }, ... },
        "risk_metrics": { "sharpe_ratio": 1.1, ... }
      }
    },
    "NVDA": {
      "score": 68.83,
      "metrics": { ... }
    },
    "MSFT": {
      "score": 19.92,
      "metrics": { ... }
    }
  }
}
```

---

# 5. Input

Query parameters truyền vào API theo định dạng (`symbols`):

Ví dụ nhóm Top 3:
```
GET /api/v1/stocks/analysis?symbols=AAPL&symbols=MSFT&symbols=NVDA
```
Các bộ preset được thêm sẵn để chọn:
- **Top 3**: `AAPL, MSFT, NVDA`
- **Magnificent 7**: `AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA`
- **Top 10 Tech**: `AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA, AVGO, ORCL, CRM`
- **Top 10 S&P 500**: `AAPL, MSFT, NVDA, AMZN, GOOGL, META, BRK-B, LLY, JPM, UNH`

---

# 6. Output

Bảng xếp hạng hiển thị như sau:

| Rank | Stock | Score |
|:---:|:---|:---:|
| 🥇 | AAPL ↗ | 86 |
| 🥈 | NVDA ↗ | 69 |
| 🥉 | MSFT ↘ | 20 |

- **Rank**: Huy chương 🥇 🥈 🥉 cho Top 3 Podium; số thứ tự thông thường cho các vị trí tiếp theo.
- **Stock**: Mã cổ phiếu kèm icon xu hướng lợi nhuận 1 năm.
- **Score**: Badge điểm số có màu tương ứng (xanh đậm cho điểm cao `>= 80`, xám cho điểm `>= 50`, đỏ cho điểm `< 50`).

---

# 7. Cách tôi thực hiện

1. **Khảo sát cấu trúc API**: Đọc `api-response.txt` để nắm rõ cấu trúc dữ liệu trả về từ endpoint `GET /api/v1/stocks/analysis`.
2. **Khai báo Type/Interface TypeScript**: Định nghĩa `StockAnalysis`, `AnalysisResponse`, `RankedStock` trước tiên.
3. **Xây dựng danh sách Preset nhóm**: Tạo đối tượng `STOCK_PRESETS` chứa các nhóm mã cổ phiếu phổ biến (Top 3, Mag 7, Top 10 Tech, Top 10 S&P 500).
4. **Gọi API bằng `apiClient` (Axios)**:
   - Dùng `URLSearchParams` để gắn danh sách `symbols` lặp lại theo đúng định dạng backend yêu cầu.
   - Thêm dependency `selectedPreset` vào `useEffect` để component tự động re-fetch khi đổi nhóm.
5. **Transform và Sort số liệu**:
   - Dùng `Object.entries(data.stocks)` biến đổi dictionary sang mảng.
   - Làm tròn điểm số `Math.round(analysis.score)`.
   - Sắp xếp mảng giảm dần theo `score` (`b.score - a.score`).
   - Gán `rank = index + 1`.
6. **Xây dựng giao diện đồng bộ với Dashboard**:
   - Dùng các UI component chuẩn của dự án: `Card`, `Table`, `Select` và `Badge`.
   - Bổ sung Select Dropdown ở phần Header của Card để chọn nhóm.
7. **Tích hợp vào Dashboard (`app/page.tsx`, `app/dashboard/page.tsx`)**: Import `<StockRanking />` và đặt trực tiếp phía trên card "Danh Sách Cổ Phiếu Chi Tiết".
8. **Chạy ESLint**: `$ npx eslint components/StockRanking.tsx`

---

# 8. Code chính

1. **`components/StockRanking.tsx`**:
   - Chứa logic gọi API, tính toán rank, chuyển đổi preset và hiển thị bảng xếp hạng.
2. **`app/page.tsx` và `app/dashboard/page.tsx`**:
   - Import và tích hợp component `StockRanking` vào vị trí.
3. **`NEXUS-STOCK-005.md`**
   - Tài liệu này.
---

# 9. Test

| STT | Test Case | Bước thực hiện | Kết quả mong đợi | Thực tế | Đánh giá |
|:---:|---|---|---|---|:---:|
| 1 | Tải mặc định (Top 3) | Mở trang `/dashboard` | Hiển thị bảng xếp hạng 3 mã AAPL, MSFT, NVDA với rank 1, 2, 3 | Bảng hiển thị đúng 3 mã, xếp hạng theo điểm | PASS |
| 2 | Sắp xếp điểm số | Kiểm tra thứ tự bảng | Mã có điểm cao nhất đứng đầu, điểm thấp hơn đứng sau | AAPL (86) hạng 1, NVDA (69) hạng 2, MSFT (20) hạng 3 | PASS |
| 3 | Hiển thị Podium Top 3 | Kiểm tra cột Rank | Hạng 1, 2, 3 hiển thị icon huy chương 🥇, 🥈, 🥉 | Hiển thị đúng emoji huy chương | PASS |
| 4 | Đổi preset sang Mag 7 | Chọn "Magnificent 7" ở dropdown | Gọi API với 7 mã mới và render bảng 7 hàng | Bảng cập nhật danh sách 7 mã cổ phiếu | PASS |
| 5 | Đổi preset sang Top 10 | Chọn "Top 10 Tech" ở dropdown | Gọi API với 10 mã và render bảng 10 hàng | Bảng cập nhật danh sách 10 mã cổ phiếu | PASS |
| 6 | Khi Backend chưa chạy / Lỗi API | Tắt backend hoặc giả lập lỗi mạng | Khung bảng vẫn giữ nguyên cấu trúc header; hiển thị thông báo "Không tìm thấy dữ liệu phù hợp." | Giao diện không bị vỡ, đồng nhất với card bên dưới | PASS |
| 7 | Trạng thái Loading | Trong lúc API đang phản hồi | Hiển thị thông báo "Đang tải dữ liệu từ Server..." trong bảng | Hiển thị đúng text loading | PASS |

---

# 10. Screenshot

[Screenshot 01: Stock Ranking trên Dashboard](public/Screenshots/SV09/01.png)

[Screenshot 02: Lỗi API / Backend](public/Screenshots/SV09/02.png)

[Screenshot 03: Loading](public/Screenshots/SV09/03-loading.png)

[Screenshot 04: Mag-07](public/Screenshots/SV09/04-mag7.png)

[Screenshot 05: Console log](public/Screenshots/SV09/05-console.png)

---

# 11. Khó khăn gặp phải

1. **Cấu trúc dữ liệu API trả về dạng Dictionary**:
   - Trường `stocks` trong response trả về kiểu `Record<string, StockAnalysis>` (Key-Value) chứ không phải Array. Phải sử dụng `Object.entries()` kết hợp `.map()` và `.sort()` để chuyển đổi về danh sách xếp hạng.
2. **Định dạng Query Param lặp lại**:
   - Backend yêu cầu nhận tham số `symbols` dạng multi-key (`?symbols=AAPL&symbols=MSFT`) thay vì nối chuỗi phẩy thông thường. Giải quyết bằng cách dùng `URLSearchParams.append()`.

---

# 12. Tôi đã học được gì?

- **Xử lý dữ liệu RESTful**: Kỹ thuật chuyển đổi từ dữ liệu dạng từ điển (object map) sang mảng được sắp xếp theo tiêu chí nghiệp vụ (score ranking).
- **Tái sử dụng Component Design System**: Vận dụng hiệu quả hệ thống component của dự án (Card, Table, Badge, Select từ shadcn/base-ui) để tạo ra tính năng mới với giao diện chuẩn chỉ, hiện đại.
- **Làm việc với multi-value query string**: Biết cách cấu hình và truyền các mảng tham số qua URLSearchParams tương thích với API FastAPI/Python backend.& 
- **Workload với Git & GitHub**: Các command CLI, ký các commit, tạo bản Fork của repo.
- **Triển khai cơ sở dữ liệu trên Docker & Docker-Compose**: CSDL PostgreSQL và các công cụ trên HĐH Linux.
---

# 13. Git

**Branch:**
```bash
feature/NEXUS-STOCK-005-stock-ranking
```

**Commits:**
```bash
#HASH## feat: stock ranking feature and docs
6cfb068 changes: added presets, remade output
86473cb changes: base components/StockRanking.tsx
b0e53a4 init: stock ranking feature
```

**Fork Repository:**

[thinhd08/nexus-fe](https://github.com/thinhd08/nexus-fe)

**Merge Request:**

[feat: stock ranking #13](https://github.com/NicolasWillyam/nexus-fe/pull/13)