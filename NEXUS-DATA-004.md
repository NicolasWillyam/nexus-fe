# NEXUS-DATA-004 – Data Summary

## 1. Thông tin
* **Họ tên:** Hoàng Hải Nam
* **Nhóm:** Nhóm 1 (Data & Backend)
* **Task:** SV04 — Data Summary
* **Ngày thực hiện:** 12/09/2026

---

## 2. Chức năng này dùng để làm gì?
Chức năng này dùng để hiển thị thẻ tóm tắt nhanh các dữ liệu tổng quan của hệ thống Nexus như số lượng mã cổ phiếu, số ngày giao dịch, ngày cập nhật dữ liệu mới nhất và trạng thái hệ thống.

---

## 3. Nghiệp vụ
### 3.1 Người dùng muốn làm gì?
Người dùng muốn nắm bắt nhanh các thông tin tổng quan và trạng thái hoạt động của hệ thống ngay khi truy cập.

### 3.2 Tại sao Nexus cần chức năng này?
Giúp cung cấp cái nhìn tổng quát về khối lượng dữ liệu đang được quản lý trong hệ thống một cách trực quan nhất.

### 3.3 Người dùng sử dụng như thế nào?
1. Người dùng mở giao diện hệ thống.
2. Quan sát thẻ "Nexus Data" để nắm bắt số liệu Stocks, Trading Days, Latest Data và Status.

---

## 4. API sử dụng
* API: `GET /api/v1/summary`

---

## 5. Input
* Dữ liệu thống kê tổng quan từ hệ thống Backend (FastAPI).

---

## 6. Output
* Card hiển thị các thông tin: Stocks (20), Trading Days (250), Latest Data (06/09/2026), Status (Healthy).

---

## 7. Cách tôi thực hiện
1. Tạo component `DataSummary.tsx` trong thư mục `components/`.
2. Định nghĩa cấu trúc giao diện Card sử dụng Tailwind CSS.
3. Thiết lập state và cơ chế fetch dữ liệu từ API.

---

## 8. Code chính
* `components/DataSummary.tsx`

---

## 9. Test
| STT | Test case | Expected | Actual | Result |
|---|---|---|---|---|
| 1 | Hiển thị số lượng Stocks | Hiển thị 20 | Hiển thị 20 | PASS |
| 2 | Hiển thị Trading Days | Hiển thị 250 | Hiển thị 250 | PASS |
| 3 | Hiển thị trạng thái Status | Hiển thị Healthy | Hiển thị Healthy | PASS |

---

## 10. Screenshot
*(Đính kèm ảnh chụp màn hình card DataSummary tại đây)*

---

## 11. Khó khăn gặp phải
* Không có khó khăn lớn trong quá trình xây dựng component giao diện.

---

## 12. Tôi đã học được gì?
* Hiểu rõ cách xây dựng các component thống kê tổng quan trong Next.js theo tiêu chuẩn của dự án Nexus.

---

## 13. Git
* **Branch:** `feature/NEXUS-DATA-004-data-summary`
* **Commit:** `feat: add data summary component`
* **Merge Request:** `[Cập nhật link MR của bạn sau khi tạo]`