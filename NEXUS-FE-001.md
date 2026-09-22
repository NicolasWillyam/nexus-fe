# BÁO CÁO TỔNG KẾT TÍNH NĂNG (FEATURE REPORT)
## Task: NEXUS-FE-001 — Loading & Skeleton Component Dùng Chung

---

### 📌 1. Thông Tin Chung (Task Metadata)
* **Mã Task:** `NEXUS-FE-001` (SV17 — Loading)
* **Dự án:** Nexus Terminal (Quantitative Finance & Portfolio Analytics)
* **Giai đoạn:** Sprint 1
* **Vị trí phụ trách:** Frontend Developer (SV17)
* **Trạng thái:** ✅ Đã hoàn thành (Completed)
* **File bàn giao:**
  * 📄 Component: [`components/LoadingState.tsx`](file:///d:/project/Nexus/nexus-fe/components/LoadingState.tsx)
  * 📄 Tài liệu: [`NEXUS-FE-001.md`](file:///d:/project/Nexus/nexus-fe/NEXUS-FE-001.md)

---

### 🎯 2. Bối Cảnh & Nghiệp Vụ (Business & UX Context)

#### 2.1. Vấn đề thực tế
Trong ứng dụng tài chính định lượng **Nexus Terminal**, hệ thống liên tục gọi các API backend phức tạp:
- Danh sách 100+ mã cổ phiếu Realtime (`GET /api/v1/stocks`)
- Lịch sử giá cổ phiếu, phân tích kỹ thuật (Technical Indicators)
- Tối ưu hóa danh mục đầu tư (Portfolio Optimization Engine)

Quá trình truy vấn dữ liệu từ PostgreSQL và tính toán định lượng thường mất từ **200ms đến 1.5s**. Nếu không có cơ chế phản hồi thị giác tốt:
1. Giao diện bị **Layout Shift (CLS - Cumulative Layout Shift)** khi dữ liệu nhảy đột ngột.
2. Người dùng không biết hệ thống đang xử lý hay bị treo.
3. Trải nghiệm người dùng (UX) bị gián đoạn, thiếu tính chuyên nghiệp của một phần mềm tài chính (Fintech/Terminal).

#### 2.2. Giải pháp triển khai
Xây dựng một **Reusable Component (`LoadingState.tsx`)** đa năng, cung cấp hai hình thức phản hồi trực quan chuẩn mực:
1. **Skeleton Loading (Khung xương):** Giả lập cấu trúc bố cục (Table, Card, Chart) với hiệu ứng sóng mờ (`animate-pulse`), giữ nguyên layout giúp người dùng hình dung trước nội dung sắp hiển thị.
2. **Spinner / Text Indicator:** Hiển thị biểu tượng xoay mượt mà kèm thông điệp rõ ràng cho các tác vụ tải toàn trang hoặc thao tác ngắn.

---

### 🏗️ 3. Thiết Kế Kỹ Thuật (Technical Design)

Component được viết bằng **TypeScript** và **Tailwind CSS**, hỗ trợ Dark/Light Theme tự động và tuân thủ các tiêu chuẩn Accessibility (`aria-live`, `role="status"`).

#### 3.1. Bảng thuộc tính (Props Definition)

| Tên Prop | Kiểu dữ liệu | Mặc định | Ý nghĩa & Mô tả |
| :--- | :--- | :--- | :--- |
| `variant` | `'spinner'` \| `'skeleton-table'` \| `'skeleton-cards'` \| `'skeleton-chart'` \| `'fullscreen'` \| `'skeleton-custom'` | `'spinner'` | Chế độ hiển thị loading mong muốn |
| `text` | `string` | `'Đang tải dữ liệu...'` | Thông điệp chữ hiển thị kèm theo |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Kích thước icon spinner |
| `rows` | `number` | `5` | Số dòng skeleton khi dùng `skeleton-table` |
| `columns` | `number` | `6` | Số cột skeleton khi dùng `skeleton-table` |
| `cards` | `number` | `4` | Số lượng thẻ skeleton khi dùng `skeleton-cards` |
| `className`| `string` | `undefined` | Lớp CSS tùy biến thêm từ bên ngoài |
| `children` | `React.ReactNode` | `undefined` | Nội dung custom skeleton |

---

### 💻 4. Hướng Dẫn Sử Dụng (Usage Examples)

Tất cả các thành viên trong team khi phát triển màn hình mới đều có thể import và sử dụng trực tiếp:

#### 4.1. Skeleton cho Bảng Dữ Liệu (Table Skeleton)
Áp dụng khi đang fetch danh sách cổ phiếu, bảng giao dịch:
```tsx
import LoadingState from "@/components/LoadingState";

export function StockTable({ loading, data }) {
  if (loading) {
    return <LoadingState variant="skeleton-table" rows={6} columns={6} />;
  }

  return <Table>...</Table>;
}
```

#### 4.2. Skeleton cho Lưới Thẻ Thống Kê (KPI Cards)
Áp dụng cho các ô thống kê tổng quan thị trường:
```tsx
import { SkeletonCards } from "@/components/LoadingState";

export function MarketOverview({ loading }) {
  if (loading) {
    return <SkeletonCards cards={4} />;
  }

  return <div className="grid grid-cols-4">...</div>;
}
```

#### 4.3. Skeleton cho Biểu Đồ (Chart Skeleton)
Áp dụng cho biểu đồ nến / biểu đồ phân tích kỹ thuật:
```tsx
import { SkeletonChart } from "@/components/LoadingState";

export function StockChart({ loading }) {
  if (loading) return <SkeletonChart />;
  return <ResponsiveContainer>...</ResponsiveContainer>;
}
```

#### 4.4. Loading Toàn Màn Hình (Fullscreen Overlay)
Áp dụng khi khởi tạo app hoặc đồng bộ dữ liệu lớn:
```tsx
import { FullscreenLoading } from "@/components/LoadingState";

if (isInitializing) {
  return <FullscreenLoading text="Đang khởi tạo Nexus Terminal..." />;
}
```

---

### 🔗 5. Tích Hợp Thực Tế Trong Dự Án (Actual Integration)

Đã tích hợp thành công component vào trang **Tổng quan Thị trường (`app/page.tsx`)**:
1. **Khối KPI Cards:** Khi `loading === true && stocks.length === 0`, render `<SkeletonCards cards={4} />` để tạo khung sẵn, tránh giật layout.
2. **Khối Bảng Cổ Phiếu:** Hiển thị 8 hàng Skeleton mượt mà tương ứng với các cột (Symbol, Tên, Sàn, Giá, Biến động %, Biến động $).
3. **Khi tìm kiếm không có kết quả:** Sử dụng `<LoadingSpinner size="sm" />` thông minh khi đang cập nhật dữ liệu.

---

### 📊 6. Đánh Giá Kết Quả (Evaluation & Deliverables)

* **Tính tái sử dụng (Reusability):** 100% độc lập, đóng gói hoàn chỉnh, dễ dàng cắm vào bất kỳ trang nào (`/`, `/dashboard`, `/analytics`).
* **Hiệu năng & Tương thích:** Tận dụng CSS Animation gốc (`animate-pulse`, `animate-spin`) nhẹ nhàng, không gây tụt FPS.
* **Giao diện & Thẩm mỹ:** Đồng bộ hoàn hảo với Dark Mode và Design System của Nexus.
