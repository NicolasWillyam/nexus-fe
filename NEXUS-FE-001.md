NEXUS-FE-001 – Loading State
1. Thông tin
Họ tên: Sầm Anh Quân
Nhóm: 5. Frontend & Visualization
Task: SV17 — Loading State
Ngày thực hiện: 22/09/2026
2. Chức năng này dùng để làm gì?
Chức năng Loading State được sử dụng để cung cấp phản hồi trực quan cho người dùng khi hệ thống đang trong quá trình tải hoặc xử lý dữ liệu từ API.
- Spinner / Text: Hiển thị biểu tượng xoay mượt mà kèm thông báo "Loading..." hoặc văn bản tùy chỉnh.
- Skeleton: Giả lập sẵn cấu trúc khung xương của giao diện (Table, Card, Chart) với hiệu ứng sóng mờ giúp tránh hiện tượng giật layout khi dữ liệu xuất hiện.
3. Nghiệp vụ
3.1 Người dùng muốn làm gì?
Người dùng truy cập vào Dashboard để theo dõi danh sách cổ phiếu và các chỉ số thị trường. Trong khoảng thời gian hệ thống đang gửi request và chờ server phản hồi dữ liệu, người dùng cần nhìn thấy trạng thái đang tải để biết ứng dụng vẫn đang hoạt động bình thường, không bị đơ hay treo trang.
3.2 Tại sao Nexus cần chức năng này?
- Giúp giảm thiểu tối đa hiện tượng giật khung hình (Cumulative Layout Shift - CLS) khi dữ liệu bất ngờ xuất hiện.
- Nâng cao trải nghiệm người dùng (UX), tạo cảm giác mượt mà và chuyên nghiệp chuẩn ứng dụng tài chính định lượng.
- Cho phép tái sử dụng thống nhất một chuẩn Loading trên toàn bộ các màn hình của dự án.
3.3 Người dùng sử dụng như thế nào?
- Người dùng mở trang Dashboard hoặc nhấn nút "Làm mới dữ liệu".
- Hệ thống bắt đầu gọi API lấy danh sách cổ phiếu.
- Giao diện chuyển sang trạng thái Loading (hiển thị Spinner hoặc Skeleton).
- Khi có kết quả từ Server:
  + Trường hợp thành công: Ẩn Loading State, hiển thị bảng giá và thẻ KPI đầy đủ.
  + Trường hợp lỗi: Ẩn Loading State, chuyển sang Error State.
4. API sử dụng
- API: GET /api/v1/stocks
- LoadingState không trực tiếp gọi API mà được component Dashboard render dựa trên trạng thái loading (true/false) trong vòng đời gọi API.
- API dùng để lấy danh sách toàn bộ các mã cổ phiếu (symbol, company_name, market, current_price, change_amount, change_percent).
5. Input
Nhận dữ liệu thông qua Props của component LoadingState:
- variant: Kiểu hiển thị ('spinner' | 'skeleton-table' | 'skeleton-cards' | 'skeleton-chart' | 'fullscreen' | 'skeleton-custom'). Mặc định là 'spinner'.
- text: Nội dung chữ hiển thị kèm spinner (mặc định: "Đang tải dữ liệu...").
- size: Kích thước spinner ('sm' | 'md' | 'lg'). Mặc định là 'md'.
- rows: Số hàng skeleton khi dùng kiểu 'skeleton-table' (mặc định: 5).
- columns: Số cột skeleton khi dùng kiểu 'skeleton-table' (mặc định: 6).
- cards: Số lượng thẻ skeleton khi dùng kiểu 'skeleton-cards' (mặc định: 4).
- className: Class CSS tùy biến bổ sung.
Điều kiện hiển thị:
- loading === true -> Render LoadingState.
6. Output
- Khi đang tải dữ liệu (Loading State): Hiển thị biểu tượng Spinner xoay tròn kèm thông báo "Đang tải dữ liệu cổ phiếu từ Server..." ở giữa bảng hoặc các khung Skeleton nhấp nháy.
- Khi tải xong dữ liệu: Ẩn Loading State và hiển thị nội dung thực tế.
7. Cách tôi thực hiện
Mô tả các bước thực hiện:
- Phân tích yêu cầu:
  + Xác định các kiểu loading cần có cho dự án (Spinner với Text, Skeleton Table, Skeleton Cards, Fullscreen).
- Tạo component LoadingState.tsx:
  + Xây dựng component nhận các props: variant, text, size, rows, columns, cards, className.
  + Xây dựng component con LoadingSpinner sử dụng icon Loader2 của Lucide kèm hiệu ứng xoay (animate-spin).
  + Xây dựng các component con SkeletonTable, SkeletonCards, SkeletonChart mô phỏng layout tương ứng với hiệu ứng sóng mờ (animate-pulse).
  + Đảm bảo component hỗ trợ cả Light Mode và Dark Mode thông qua Tailwind CSS.
- Tích hợp vào page.tsx:
  + Import component LoadingState vào file app/page.tsx.
  + Áp dụng LoadingState variant="spinner" vào phần TableBody khi cờ loading có giá trị true.
  + Áp dụng SkeletonCards cho khối thống kê KPI.
- Kiểm thử và hoàn thiện:
  + Kiểm tra hoạt động trên trình duyệt tại http://localhost:3000.
  + Chạy kiểm tra kiểu dữ liệu với TypeScript (npx tsc --noEmit) để đảm bảo không có lỗi type.
8. Code chính
- NEXUS-FE-001.md
- components/LoadingState.tsx
- app/page.tsx
- app/dashboard/page.tsx
9. Test
| STT | Test case | Expected | Actual | Result |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Mở trang Dashboard lần đầu | Hiển thị LoadingState trong thời gian chờ API phản hồi | Hiển thị LoadingState đúng vị trí | PASS |
| 2 | Nhận dữ liệu API thành công | Ẩn LoadingState, hiển thị danh sách cổ phiếu và thẻ KPI | Ẩn LoadingState, hiển thị dữ liệu đầy đủ | PASS |
| 3 | Nhấn nút "Làm mới dữ liệu" | Nút xoay và bảng hiển thị LoadingState | Nút xoay và bảng hiển thị LoadingState | PASS |
| 4 | Tìm kiếm mã không tồn tại | Không gọi lại loading bảng, hiển thị thông báo rỗng | Hiển thị thông báo không tìm thấy dữ liệu | PASS |
| 5 | Kiểm tra giao diện Dark Mode | LoadingState hiển thị màu sắc tương thích với nền tối | Giao diện hiển thị chuẩn theme tối | PASS |
10. Screenshot
[View Screenshot](https://github.com/NicolasWillyam/nexus-fe/blob/feature/NEXUS-FE-001-loading-state/public/Screenshot/Test_1.png)
[View Screenshot](https://github.com/NicolasWillyam/nexus-fe/blob/feature/NEXUS-FE-001-loading-state/public/Screenshot/Test_2.png)
[View Screenshot](https://github.com/NicolasWillyam/nexus-fe/blob/feature/NEXUS-FE-001-loading-state/public/Screenshot/Test_3.png)
11. Khó khăn gặp phải
- Cấu hình ban đầu của PostgreSQL bị sai cổng kết nối (port 70126 thay vì 5432) dẫn đến service bị dừng ngay khi bật.
- Quên mật khẩu tài khoản postgres local và pgAdmin 4 bị lưu sai cổng kết nối tương tự.
- Cần tối ưu điều kiện hiển thị loading sao cho phù hợp cả khi tải lần đầu và khi người dùng chủ động nhấn làm mới dữ liệu.
12. Tôi đã học được gì?
- Cách thiết kế và xây dựng Reusable Component linh hoạt với TypeScript và Tailwind CSS.
- Hiểu sâu hơn về nghiệp vụ UX, tầm quan trọng của việc phản hồi thị giác trong ứng dụng Web tài chính.
- Cách thiết lập, sửa lỗi cấu hình và quản lý cơ sở dữ liệu PostgreSQL cùng Backend FastAPI.
- Quy trình làm việc nhóm với Git, tạo nhánh feature và chuẩn bị Pull Request cho Sprint.
13. Git
Branch: feature/NEXUS-FE-001-loading-state
Commit: feat(NEXUS-FE-001): implement reusable LoadingState component and sprint report
Merge Request: https://github.com/NicolasWillyam/nexus-fe/pull/new/feature/NEXUS-FE-001-loading-state