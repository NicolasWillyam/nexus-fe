NEXUS-PORT-002 – Factor Chart (SV11)

1.Thông tin

**Họ tên:** Nguyễn Thị Phương Mai

**Nhóm:** 3

**Task:** SV11 — Factor Chart

**Ngày thực hiện:** 11/09/2026

---

2. Chức năng này dùng làm gì?
Chức năng này hiển thị biểu đồ phân tích các chỉ số nhân tố (Factor Chart) đánh giá chất lượng và mức độ rủi ro của danh mục đầu tư bao gồm 4 chỉ số chính: Quality (Chất lượng), Momentum (Đà tăng trưởng), Value (Giá trị), và Risk (Mức độ rủi ro).

---

3.Nghiệp vụ

## 3.1 Người dùng muốn làm gì?

Người dùng muốn xem góc nhìn tổng quan và đánh giá định lượng về danh mục cổ phiếu của mình thông qua các chỉ số nhân tố phân tích tài chính.

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp người dùng Nexus nhanh chóng nhận biết thế mạnh, xu hướng đà tăng và mức độ rủi ro trong danh mục đầu tư mà không cần tự tính toán các chỉ số phức tạp.

## 3.3 Người dùng sử dụng như thế nào?

1. Người dùng truy cập vào trang tổng quan thị trường / danh mục đầu tư (Dashboard).
2. Hệ thống tự động gọi API để lấy điểm số các nhân tố của danh mục.
3. Màn hình hiển thị thẻ khối Factor Chart (SV11) với các thanh biểu đồ biểu diễn điểm số từ 0 - 100 cho từng nhân tố.

---

4.API sử dụng

API:

`GET /api/v1/portfolios/{portfolio_id}/factors`

API dùng để lấy dữ liệu điểm số thực tế của 4 nhân tố (Quality, Momentum, Value, Risk) từ hệ thống Backend.

---

5.Input

`portfolio_id`: `1` (hoặc ID của danh mục đầu tư tương ứng)

6.Output

Dữ liệu JSON nhận từ Backend:
```json
{
  "quality": 95,
  "momentum": 90,
  "value": 80,
  "risk": 75
}
7.Cách thực hiện
Tạo file component FactorChart.tsx trong thư mục components/.
Khai báo các trạng thái factors, loading, và error bằng useState.
Sử dụng useEffect cùng với apiClient (Axios) để thực hiện gửi request lấy dữ liệu từ API /portfolios/{portfolio_id}/factors.
Xử lý các trạng thái giao diện: Loading Spinner khi đang tải dữ liệu và Thông báo lỗi khi API thất bại.
Khi có dữ liệu thành công, render danh sách các nhân tố kèm thanh tiến trình phần trăm bằng Tailwind CSS.
Import và nhúng component FactorChart vào trang chính app/page.tsx.
8. Code chính
Liệt kê những file đã thay đổi:
Backend (BE):
app/api/v1/endpoints/portfolios.py : Khai báo Route/Controller cho endpoint GET /portfolios/{portfolio_id}/factors.
app/schemas/portfolio.py : Thêm Schema/Model định nghĩa cấu trúc dữ liệu trả về cho Factor Chart (quality, momentum, value, risk).
Frontend (FE):
components/FactorChart.tsx: Component mới tạo chịu trách nhiệm gọi API và render giao diện biểu đồ nhân tố.
app/page.tsx: Nhúng component FactorChart vào giao diện Overview Dashboard.
NEXUS-PORT-002.md: File tài liệu báo cáo chi tiết task.

9. Test
STT
Test case
Expected
Actual
Result
1
Mở trang Dashboard có API hoạt động
Hiển thị đầy đủ 4 chỉ số Quality (95), Momentum (90), Value (80), Risk (75)
Hiển thị đúng 4 chỉ số và độ dài thanh biểu đồ
PASS
2
Đang tải dữ liệu (Loading)
Hiển thị thông báo/skeleton "Đang tải dữ liệu biểu đồ..."
Hiển thị thông báo đang tải
PASS
3
Mất kết nối API / Backend lỗi
Hiển thị thông báo lỗi "Không thể tải dữ liệu chỉ số Factor"
Hiển thị khung màu đỏ báo lỗi
PASS
4
Dữ liệu trả về bị rỗng/null
Không bị crash ứng dụng, hiển thị giao diện báo lỗi an toàn
Màn hình hiển thị thông báo lỗi an toàn
PASS

10. Screenshot
Màn hình chạy thành công:


11. Khó khăn gặp phải
Thiếu API từ Backend: Hệ thống Backend ban đầu chưa có sẵn endpoint cung cấp dữ liệu điểm số các nhân tố (/portfolios/{portfolio_id}/factors), bắt buộc phải can thiệp điều chỉnh/tạo mới API ở Backend để phục vụ riêng cho chức năng này trên Frontend.
Định dạng dữ liệu: Phải định nghĩa lại cấu trúc JSON trả về từ Backend sao cho khớp hoàn toàn với props và kiểu dữ liệu TypeScript ở Frontend.
12. Tôi đã học được gì?
Biết cách xây dựng một Component React có kết nối API theo chuẩn Client Component trong Next.js.
Nắm rõ cách quản lý các trạng thái bất đồng bộ (Loading, Error, Success) khi làm việc với API.
Hiểu rõ hơn về ý nghĩa của 4 chỉ số Factor trong phân tích tài chính/đầu tư cổ phiếu.
Đã hiểu rõ hơn về API và biết cách chúng làm việc từ đó hoàn thành được task của mình là gọi ra API để làm việc .
13. Git
Branch:
feature/NEXUS-PORT-002-factor-chart
Commit:
feat: add FactorChart component and documentation NEXUS-PORT-002
Merge Request:
https://github.com/NicolasWillyam/nexus-fe/pull/4
https://github.com/NicolasWillyam/nexus-be/pull/2 


