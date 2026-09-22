# NEXUS-FE-003 - Portfolio Chart

## 1. Thông tin

**Họ tên: Trịnh Mai Linh**

**Nhóm: 5. Frontend & Visualization**

**Task: SV19 - Portfolio Chart**

**Ngày thực hiện: 14/09/2026**

---

# 2. Chức năng này dùng để làm gì?

* Chức năng Portfolio Chart được sử dụng để hiển thị tỷ trọng phân bổ danh mục đầu tư dưới dạng pie chart, mỗi lát cắt là 1 mã cổ phiếu, kèm % tương ứng. Giúp nhìn nhanh cơ cấu danh mục, phát hiện việc dồn tỷ trọng quá nhiều vào 1 mã.

---

# 3. Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn xem trực quan cơ cấu danh mục đầu tư của mình: đang nắm giữ những mã nào, mỗi mã chiếm bao nhiêu % trong tổng danh mục.

---

## 3.2 Tại sao Nexus cần chức năng này?

Vì bảng số liệu thô (mã + %) khó nhìn ra ngay tỷ trọng ai lớn ai nhỏ — biểu đồ tròn giúp người dùng đánh giá nhanh mức độ tập trung/đa dạng hóa danh mục, phát hiện tình trạng phân bổ lệch quá nhiều vào một mã (rủi ro tập trung) mà không cần tự tính toán từ bảng dữ liệu.

---

## 3.3 Người dùng sử dụng như thế nào?

- Người dùng có thể đổi tiêu đề chart bằng ô input "Tạo biểu đồ", và chuyển kiểu hiển thị giữa Donut / Pie bằng 2 nút bấm.
- Biểu đồ cập nhật realtime ngay khi gõ hoặc chọn nguồn — không cần bấm nút submit riêng.
- Bên dưới biểu đồ hiện legend (mã + %) và tổng giá trị danh mục (nếu dữ liệu có value).
- Hover vào từng lát cắt để xem tooltip chi tiết: mã, tên công ty, tỷ lệ %, giá trị USD.
- Ô "Tổng phần trăm" ở góc phải bảng điều khiển tự động cảnh báo (chuyển màu vàng) nếu tổng % nhập vào khác 100%, giúp người dùng phát hiện lỗi nhập liệu ngay lập tức.

---

# 5. Input

| Prop | Kiểu | Mô tả |
|---|---|---|
| `data` | `PortfolioItem[]` | Danh mục khởi tạo (mã, tên, %, giá trị, màu) |
| `title` / `description` | `string` | Tiêu đề và mô tả mặc định của chart |
| `availableStocks` | `StockData[]` | Danh sách cổ phiếu từ website để tự tổng hợp tỷ trọng |
| `interactive` | `boolean` | Bật/tắt bảng điều khiển nhập liệu |
| `showLegend` | `boolean` | Hiện/ẩn phần chú thích bên dưới chart |
| `donut` | `boolean` | Chế độ Donut (mặc định) hay Pie |

---

# 6. Output

- **Biểu đồ Pie/Donut** vẽ bằng `recharts`, mỗi mã cổ phiếu là 1 lát cắt màu riêng (lấy từ palette 8 màu cố định, xoay vòng nếu vượt quá 8 mã).
- **Tooltip** khi hover: hiện mã, tên công ty, tỷ lệ %, và giá trị USD (nếu có).
- **Legend** dạng lưới 2–4 cột, mỗi ô hiện mã + %.
- **Chỉ báo tổng %**: đổi màu xanh (100%) hoặc vàng cảnh báo (khác 100%) — giúp người dùng biết dữ liệu nhập có hợp lệ không.
- **Tổng giá trị danh mục** (USD) hiện bên dưới nếu các item có `value`.

---

# 7. Cách tôi thực hiện



---

# 8. Code chính



---

# 9. Test

| Case | Input | Kỳ vọng | Kết quả |
|---|---|---|---|
| Nhập đúng format | `AAPL 30%` | Parse ra `{symbol: "AAPL", percentage: 30}` | ✅ |
| Nhập format `key: value` | `MSFT: 25` | Vẫn parse đúng nhờ regex `[:=\s]` | ✅ |
| Nhập sai / dòng rỗng | dòng trắng, ký tự lạ | Bỏ qua, không crash | ✅ |
| Tổng % ≠ 100 | `AAPL 30%\nMSFT 40%` | Badge tổng % chuyển màu vàng cảnh báo | ✅ |
| Chuyển "Từ Website" | `availableStocks` có 5 mã | Tự tính % theo giá, hiện badge từng mã | ✅ |
| Không có `availableStocks` | mảng rỗng | Fallback về `DEFAULT_PORTFOLIO` | ✅ |
| Toggle Donut/Pie | bấm nút | `innerRadius` đổi 0 ↔ 65 tức thì | ✅ |

---

# 10. Screenshot


---

# 11. Khó khăn gặp phải

- **Đồng bộ giữa 2 nguồn dữ liệu**: khi chuyển từ "Tùy chỉnh" sang "Từ Website" và ngược lại, phải đảm bảo `inputText` và `manualItems` không lệch nhau — giải quyết bằng cách format lại `aggregated` thành text và set ngược vào `inputText` trong `handleLoadFromWebsite`.
- **Regex parser đa dạng cú pháp**: người dùng có thể gõ `AAPL 30%`, `AAPL: 30`, `AAPL=30.5` — phải viết regex đủ tổng quát mà không match nhầm dòng rác.
- **Giới hạn palette màu**: chỉ có 8 màu cố định, khi danh mục > 8 mã phải dùng `% PALETTE.length` để xoay vòng, tránh lỗi `undefined`.
- **Tích hợp `ChartConfig` của shadcn**: cần build động object `chartConfig` theo từng mã cổ phiếu hiện có, không thể khai báo tĩnh vì danh mục thay đổi runtime.

---

# 12. Tôi đã học được gì?

- Cách dùng **`recharts`** (`PieChart`, `Cell`, custom `Tooltip` qua render-prop) để build biểu đồ tương tác trong React.
- Kỹ thuật **tách pure function** (parser, aggregator) ra khỏi component để dễ test và tái sử dụng.
- Dùng **`useMemo` theo tầng** (parsed → active → chartData → config) để tối ưu re-render khi có nhiều nguồn dữ liệu phụ thuộc nhau.
- Viết **regex linh hoạt** để parse input tự do của người dùng thay vì bắt buộc 1 format cứng.
- Cách tổ chức component **shadcn/ui** kết hợp state nội bộ để tạo bảng điều khiển tương tác (mode switcher, input, toggle).

---

# 13. Git


