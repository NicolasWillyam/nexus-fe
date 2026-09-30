# NEXUS-STOCK-003: Nhiệm Vụ SV07 — Bộ Lọc Cổ Phiếu Theo Ngành (Filter Stock)

## 1. Tổng Quan Nhiệm Vụ

- **Mã nhiệm vụ:** `SV07`
- **Tên tính năng:** Filter Stock (Bộ lọc cổ phiếu theo Sector / Industry)
- **Phạm vi tác động:** Chỉ can thiệp **Frontend (FE)**, không chỉnh sửa Backend (BE).
- **Trạng thái:** Hoàn thành

---

## 2. Yêu Cầu & Đặc Tả

### 2.1. Yêu cầu tính năng
1. Thêm bộ lọc đơn giản theo nhóm ngành (**Sector / Industry**) cho danh sách cổ phiếu trên Dashboard.
2. Các nhóm ngành chính hỗ trợ mở rộng:
   - **Technology** (Công nghệ)
   - **Healthcare** (Y tế / Chăm sóc sức khỏe)
   - **Finance** (Tài chính / Ngân hàng)
   - **Energy** (Năng lượng)
   - Hỗ trợ thêm tùy chọn **Tất cả ngành (All)**.
   - Tự động trích xuất thêm các nhóm ngành mới có trong dữ liệu API (`industry` field) mà không cần cập nhật mã nguồn cứng.
3. Tương thích hoàn toàn với các bộ lọc hiện tại trên Dashboard:
   - Lọc theo biến động giá: Tất cả, Tăng giá (Gainers), Giảm giá (Losers).
   - Tìm kiếm từ khóa theo mã Symbol hoặc Tên công ty.
4. Tương tác mượt mà, hỗ trợ Dark Mode & Light Mode, responsive trên các kích thước màn hình.

### 2.2. Output Yêu Cầu
- `StockFilter.tsx`: Component giao diện và logic bộ lọc nhóm ngành.
- `NEXUS-STOCK-003.md`: Tài liệu kỹ thuật chi tiết của nhiệm vụ SV07.

---

## 3. Kiến Trúc & Thiết Kế Kỹ Thuật

### 3.1. Dữ liệu từ Backend (Không can thiệp BE)
API `GET /api/v1/stocks` đã cung cấp sẵn trường `industry` trong đối tượng `StockResponse`:
```typescript
interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  market: string;
  industry: string;
  current_price: number;
  change_amount: number;
  change_percent: number;
}
```

### 3.2. Cấu trúc Component `StockFilter.tsx`
Component `StockFilter` được tách biệt hoàn toàn tại `components/StockFilter.tsx`:

- **Props:**
  ```typescript
  export interface StockFilterProps {
    selectedSector: string;
    onSectorChange: (sector: string) => void;
    availableSectors?: string[];
    className?: string;
  }
  ```
- **Hằng số mặc định:**
  ```typescript
  export const DEFAULT_SECTORS = [
    "Technology",
    "Healthcare",
    "Finance",
    "Energy",
  ];
  ```
- **Logic xử lý Sector:**
  Hợp nhất danh sách `DEFAULT_SECTORS` với bất kỳ nhóm ngành nào được truyền vào qua `availableSectors` từ dữ liệu thực tế, đảm bảo không trùng lặp và loại bỏ các giá trị rỗng/null.
- **Tích hợp UI:**
  - Dùng component `Select` tối ưu dựa trên `@base-ui/react` và theme shadcn/ui.
  - Hiển thị nhãn `Sector:` với icon `Filter`.
  - Nút "Xóa lọc" nhanh xuất hiện khi đang chọn một ngành cụ thể.

---

## 4. Tích Hợp Vào Dashboard (`app/dashboard/page.tsx`)

1. **State quản lý ngành được chọn:**
   ```typescript
   const [selectedSector, setSelectedSector] = useState<string>("all");
   ```

2. **Trích xuất danh sách ngành động từ API:**
   ```typescript
   const dynamicSectors = useMemo(() => {
     const set = new Set(stocks.map((s) => s.industry).filter(Boolean));
     return Array.from(set).sort();
   }, [stocks]);
   ```

3. **Áp dụng điều kiện lọc đa tầng (Multi-criteria Filter):**
   ```typescript
   const filteredStocks = useMemo(() => {
     return stocks.filter((s) => {
       const matchesSearch =
         s.symbol.toLowerCase().includes(search.toLowerCase()) ||
         s.company_name.toLowerCase().includes(search.toLowerCase());

       const matchesSector =
         selectedSector === "all" ||
         (s.industry && s.industry.toLowerCase() === selectedSector.toLowerCase());

       if (filterType === "gainers")
         return matchesSearch && matchesSector && s.change_percent > 0;
       if (filterType === "losers")
         return matchesSearch && matchesSector && s.change_percent < 0;
       return matchesSearch && matchesSector;
     });
   }, [stocks, search, filterType, selectedSector]);
   ```

4. **Hiển thị cột Nhóm Ngành (Sector) trong bảng dữ liệu:**
   Bổ sung cột `Nhóm Ngành` với badge màu sắc trang nhã để người dùng trực quan hóa dữ liệu sau khi lọc.

---

## 5. Danh Sách Tệp Thay Đổi / Bổ Sung

| Tệp | Trạng thái | Mô tả |
|---|---|---|
| `nexus-fe/components/StockFilter.tsx` | MỚI | Component lọc cổ phiếu theo Sector |
| `nexus-fe/app/page.tsx` | CẬP NHẬT | Nhúng `StockFilter`, xử lý filter đa tầng và thêm cột Nhóm Ngành tại trang chủ (/) |
| `nexus-fe/app/dashboard/page.tsx` | CẬP NHẬT | Nhúng `StockFilter`, xử lý filter đa tầng và thêm cột Nhóm Ngành tại trang Dashboard |
| `NEXUS-STOCK-003.md` | MỚI | Tài liệu đặc tả kỹ thuật nhiệm vụ SV07 |

---

## 6. Hướng Dẫn Kiểm Thử & Nghiệm Thu

1. **Khởi chạy Frontend:**
   ```bash
   cd nexus-fe
   npm run dev
   ```
2. **Kiểm tra giao diện:**
   - Mở trình duyệt tại `http://localhost:3000/dashboard`.
   - Quan sát thanh công cụ bảng danh sách cổ phiếu: xuất hiện khối `Sector: [ Tất cả ngành (All) ▼ ]`.
3. **Thao tác kiểm thử lọc:**
   - Chọn `Technology` -> Danh sách chỉ hiển thị các mã thuộc ngành Technology (ví dụ AAPL).
   - Bấm nút "Xóa lọc" hoặc chọn `Tất cả ngành (All)` -> Danh sách hiển thị lại toàn bộ.
   - Kết hợp: Chọn `Technology` + chọn tab `Tăng giá` + nhập ô tìm kiếm `AAPL` -> Bộ lọc hoạt động chính xác đồng thời cả 3 điều kiện.
