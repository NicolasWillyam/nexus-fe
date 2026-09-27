# NEXUS-QA-002 — BÁO CÁO KIỂM THỬ TOÀN BỘ HỆ THỐNG NEXUS

**Mã Task:** SV22  
**Họ tên:** Lâm Thảo Nguyên  
**Mục tiêu:** Kiểm thử tích hợp E2E toàn bộ luồng tính năng hệ thống Nexus  
**Người thực hiện:** QA   
**Ngày thực hiện:** 27/09/2026  
**Môi trường:** Local (Windows Command Prompt) | BE: FastAPI (Port 8000) | FE: Next.js 16 (Port 3000)  

---

## 1. Sơ Đồ & Luồng Kiểm Thử Hệ Thống (Test Workflow)

Kiểm thử được tiến hành tuần tự theo đúng luồng dữ liệu nghiệp vụ:

Dashboard ---> Stock ---> Analysis ---> Score ---> Portfolio ---> AI

---

## 2. Quy Trình Thực Hiện Kiểm Thử Chi Tiết (Step-by-Step Execution)

### Bước 1: Khởi Động Môi Trường Backend & Frontend
* **Thao tác:** 
  1. **Khởi động Backend:** Mở Terminal CMD tại thư mục `nexus-be`, kích hoạt môi trường ảo `venv\Scripts\activate` và chạy lệnh server: `uvicorn app.main:app --reload`.
  2. **Khởi động Frontend:** Mở thêm một cửa sổ Terminal CMD tại thư mục `nexus-fe` và chạy lệnh: `npm run dev`.
  3. **Kiểm tra kết nối:** Truy cập Swagger UI tại `http://127.0.0.1:8000/docs` và giao diện web tại `http://localhost:3000`.
* **Kết quả:** 
  * Server FastAPI Backend khởi động ổn định trên port 8000, kết nối thành công PostgreSQL database và kích hoạt APScheduler ngầm.
  * Server Next.js Frontend biên dịch thành công và lắng nghe ở port 3000, sẵn sàng phục vụ giao diện người dùng.

### Bước 2: Kiểm Thử Mô-đun 1 — Dashboard
* **Thao tác:** Mở trình duyệt truy cập `http://localhost:3000`, quan sát các chỉ số tổng quan, biểu đồ VN-Index và trạng thái kết nối Backend.
* **Kết quả:** Màn hình Dashboard hiển thị đầy đủ thẻ tổng quan, nút làm mới dữ liệu và trạng thái hệ thống báo đã kết nối.

### Bước 3: Kiểm Thử Mô-đun 2 — Stock List & Search
* **Thao tác:** 
  1. Chuyển sang bảng danh sách cổ phiếu chi tiết.
  2. Bấm thử các tab bộ lọc: `Tất cả`, `Tăng giá`, `Giảm giá` và bộ lọc `Sector`.
  3. Nhập từ khóa vào ô tìm kiếm (Search) mã symbol hoặc tên công ty.
* **Kết quả:** Bảng render mượt mà, bộ lọc và tính năng tìm kiếm phản hồi chính xác theo thời gian thực.

### Bước 4: Kiểm Thử Mô-đun 3 — Stock Analysis 
* **Thao tác:** Chọn một mã cổ phiếu bất kỳ trong danh sách để xem trang phân tích chi tiết (giá lịch sử, biến động Intraday, chỉ số tài chính).
* **Kết quả:** Dữ liệu phân tích hiển thị chính xác, biểu đồ biến động load đầy đủ dữ liệu từ API Backend.API Backend (`/api/v1/analytics/stock-summary`) đã được xây dựng, trả về dữ liệu định dạng JSON chuẩn trên Swagger UI. Tuy nhiên, giao diện Bảng chỉ số phân tích cổ phiếu trên Frontend chưa được xây dựng và chưa được tích hợp kết nối với API Backend

### Bước 5: Kiểm Thử Mô-đun 4 — Score (Đánh Giá & Xếp Hạng)
* **Thao tác:** Kiểm tra mô-đun chấm điểm kỹ thuật và định giá cổ phiếu (Factor Scoring Model).
* **Kết quả:** Hệ thống tính toán và hiển thị thang điểm kỹ thuật / cơ bản chuẩn xác theo công thức backend cung cấp. Tuy nhiên chưa triển khai giao diện Bảng xếp hạng điểm cổ phiếu trên Frontend để người dùng theo dõi trực quan.

### Bước 6: Kiểm Thử Mô-đun 5 — Portfolio (Danh Mục Đầu Tư)
* **Thao tác:** Kiểm tra tính năng quản lý danh mục, thêm/sửa/xóa mã cổ phiếu theo dõi và xem tổng tỷ trọng lời/lỗ.
* **Kết quả:** Luồng CRUD danh mục đầu tư hoạt động ổn định, dữ liệu đồng bộ chính xác với cơ sở dữ liệu. Tuy nhiên, Khi chuyển sang khung thời gian `30 ngày`, hệ thống chưa truy xuất được dữ liệu, làm biểu đồ bị rỗng và báo lỗi *"Không có dữ liệu chuỗi thời gian"*. Ngoài ra chưa xử lý sự kiện tương tác click chọn/bỏ chọn các badge mã cổ phiếu (các nút badge bị đơ, hardcode state).

### Bước 7: Kiểm Thử Mô-đun 6 — AI (Trợ Lý Phân Tích Thông Minh)
* **Thao tác:** 
  1. Thao tác trực tiếp trên giao diện Dashboard/Portfolio: nhập câu hỏi và yêu cầu phân tích/tối ưu danh mục đầu tư với Trợ lý AI.
  2. Kiểm thử API Backend trên Swagger UI (`/api/v1/portfolio/optimize-with-ai`).
* **Kết quả:** 
    * Giao diện Trợ lý AI phân tích đã được tích hợp đầy đủ, phản hồi nhanh chóng và render mượt mà trực tiếp trên trang web.
    * API Backend (`/api/v1/portfolio/optimize-with-ai`) đã cấu hình đầy đủ API Key, thuật toán tối ưu phân bổ vốn và mô hình AI hoạt động chính xác ($200\text{ OK}$), trả về văn bản nhận định chuyên sâu theo thời gian thực mà không bị rơi vào chế độ Fallback. Tính năng AI đã hoàn thiện toàn diện cả Frontend và Backend.

---

## 3. Tổng Hợp Trạng Thái Các Mô-đun (Test Status)

* **[PASS] Dashboard** — Hiển thị thẻ KPI và thông tin tổng quan hệ thống ổn định.
* **[PASS] Stock List** — Hiển thị danh sách cổ phiếu mượt mà, cập nhật dữ liệu từ API.
* **[PASS] Search** — Bộ lọc và ô tìm kiếm cổ phiếu hoạt động chính xác.
* **[FAIL] Stock Analysis** — Chưa xây dựng giao diện bảng chỉ số phân tích cổ phiếu.
* **[FAIL] Score** — Chưa triển khai bảng xếp hạng điểm đánh giá cổ phiếu.
* **[FAIL] Portfolio** — Lỗi tương tác chọn nút Badge mã cổ phiếu & rỗng dữ liệu khung thời gian 30 ngày trên biểu đồ.
* **[PASS] AI** — Tính năng trợ lý AI phân tích đã hoàn thiện và hoạt động ổn định.

---

## 4. Nhật Ký Lỗi Phát Hiện & Khắc Phục (Bug Resolution Log)

### BUG-001: Không Thể Chọn/Bỏ Chọn Mã Phân Tích Trong Portfolio Chart
* **Bug ID:** BUG-001
* **Mô tả:** Tại thanh lựa chọn "Mã phân tích" (AAPL, MSFT, NVDA, AMZN), khi người dùng click vào các badge mã cổ phiếu thì hệ thống không thực hiện bất kỳ phản hồi nào (không thể xóa bỏ hoặc thêm mới mã để so sánh).
* **Các bước tái hiện:**
  1. Truy cập giao diện có chứa biểu đồ so sánh lợi nhuận tích lũy.
  2. Click chuột vào các chip/badge mã cổ phiếu (`AAPL`, `MSFT`, `NVDA`, `AMZN`).
* **Kỳ vọng:** Cho phép chọn/bỏ chọn linh hoạt các mã cổ phiếu để cập nhật biểu đồ tương ứng.
* **Thực tế:** Các nút badge bị đơ/hardcode, không toggle được trạng thái chọn.
* **Screenshot:** ![](Screenshots/bug-001.png)
* **Trạng thái:** **[OPEN]** Cần cập nhật state handler (`onClick`) phía Frontend.

---

### BUG-002: Biểu Đồ So Sánh Lợi Nhuận Tích Lũy Rỗng Khi Chọn Khung Thời Gian 30 Ngày
* **Bug ID:** BUG-002
* **Mô tả:** Khi chọn mốc khung thời gian **"30 ngày"**, biểu đồ *"So Sánh Lợi Nhuận Tích Lũy Cumulative Returns (%)"* không render được dữ liệu và báo lỗi *"Không có dữ liệu chuỗi thời gian"*.
* **Các bước tái hiện:**
  1. Chọn mốc thời gian **30 ngày** trên thanh công cụ của biểu đồ.
  2. Quan sát khung hiển thị biểu đồ.
* **Kỳ vọng:** Hiển thị biểu đồ lợi nhuận tích lũy của các mã trong 30 ngày gần nhất.
* **Thực tế:** Báo *"Không có dữ liệu chuỗi thời gian"*.
* **Screenshot:** ![](Screenshots/bug-002.png)
* **Trạng thái:** **[OPEN]** Cần kiểm tra lại API Backend endpoint trả về chuỗi thời gian 30 ngày hoặc logic filter date ở FE.

---

### BUG-003: Chưa Triển Khai Tính Năng Bảng Chỉ Số Cổ Phiếu — Stock Analytics Table (Task SV08)
* **Bug ID:** BUG-003
* **Mô tả:** Tính năng hiển thị bảng các chỉ số phân tích cổ phiếu (Return, Risk, PE, ROE,...) từ API `GET /api/v1/analytics/stock-summary` theo yêu cầu Task SV08 chưa được xây dựng trên giao diện.
* **Trạng thái:** **[OPEN - UNFINISHED TASK]** 

---

### BUG-004: Chưa Triển Khai Tính Năng Xếp Hạng Cổ Phiếu — Stock Ranking (Task SV09)
* **Bug ID:** BUG-004
* **Mô tả:** Tính năng hiển thị bảng xếp hạng điểm cổ phiếu (Rank, Stock, Score) lấy dữ liệu từ API `GET /api/v1/stocks/analysis` theo yêu cầu Task SV09 chưa được hoàn thiện trên hệ thống.
* **Trạng thái:** **[OPEN - UNFINISHED TASK]**

---

## 5. Kết Luận & Kiến Nghị

* **Tỷ lệ hoàn thành/đạt yêu cầu:** **57.1%** (4/7 mục cốt lõi đạt yêu cầu: `Dashboard`, `Stock List`, `Search`, `AI`).
* Các tính năng cơ bản về hiển thị dữ liệu, tìm kiếm cổ phiếu và trợ lý AI vận hành tốt.
* **Các vấn đề tồn đọng cần ưu tiên khắc phục:**
  1. **Khắc phục lỗi tại mục Portfolio (BUG-001 & BUG-002):** Cập nhật sự kiện click chọn mã cổ phiếu trên biểu đồ và sửa lỗi thiếu dữ liệu lịch sử cho mốc thời gian 30 ngày.
  2. **Hoàn thiện các hạng mục chưa triển khai (BUG-003 & BUG-004)** 