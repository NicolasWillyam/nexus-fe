# NEXUS-AI-002: AI Explanation UI & Data Contract Integration

## 1. Thông tin

Họ tên: Hà Thùy Linh

Nhóm 4: AI Assistant

Task: AI Explanation UI

## 2. Chức năng này dùng để làm gì?

Chức năng này dùng để hiển thị các phân tích đầu tư và giải thích chiến lược phân bổ danh mục do AI (Gemini) thực hiện, kết hợp với các chỉ số định lượng thực tế từ Backend

Chức năng hiển thị các thông tin chính:

Header & AI Sparkles: Nhận diện ngữ cảnh phân tích thông minh từ AI

Expected Return & Risk: Các chỉ số định lượng cốt lõi được tính toán động từ dữ liệu thị trường và phân loại mức độ rủi ro (High/Moderate/Low).

Core Rationale (Why this portfolio?): Tóm tắt lý do cốt lõi từ văn bản giải thích của AI.

Main Reasons & Caveats: Danh sách các điểm nhấn chiến lược và lưu ý/guardrails an toàn đầu tư.

Mục đích là giúp người dùng nắm bắt nhanh chóng lý do tại sao danh mục được phân bổ như vậy thông qua góc nhìn chuyên gia AI mà vẫn đảm bảo tính chính xác tuyệt đối về mặt số liệu toán học.

## 3. Nghiệp vụ
## 3.1 Người dùng muốn làm gì?
Người dùng muốn xem bản phân tích chi tiết bằng văn bản kết hợp với các chỉ số rủi ro và lợi nhuận mang tính cá nhân hóa cao cho danh mục đầu tư của mình

## 3.2 Tại sao Nexus cần chức năng này?

Chức năng này giúp cầu nối giữa các con số định lượng khô khan và góc nhìn diễn giải trực quan:

Giúp người dùng hiểu rõ cơ sở phân bổ vốn

Tránh việc AI tự ý bịa số liệu (hallucination) nhờ cơ chế tách biệt rõ ràng giữa toán học (Python) và diễn giải (Gemini)

Đưa ra cảnh báo rủi ro trực quan theo thời gian thực (Volatility).

## 3.3 Người dùng sử dụng như thế nào?
Thông tin được trình bày dưới dạng các khối UI component gọn gàng (AIExplanationSections.tsx) trên Dashboard, cho phép người dùng quan sát và làm mới kết quả theo các mã cổ phiếu tùy chọn.

## 4. API sử dụng
API chính
GET /api/v1/portfolio/ai-explanation

API dùng để lấy kết quả phân tích AI và thông tin tổng hợp danh mục, bao gồm:

whyThisPortfolio: Nội dung Markdown do AI giải thích.

expectedReturn: Khoảng lợi nhuận kỳ vọng tính toán động.

risk: Nhãn phân loại rủi ro (High/Moderate/Low) dựa trên độ biến động thực tế (annual_volatility).

mainReasons: Các điểm nhấn về tổng vốn và số lượng mã.

importantNotes: Trạng thái kiểm duyệt Guardrails và lưu ý đầu tư.

## 5. Input
Danh sách mã cổ phiếu (symbols).

Tổng số tiền đầu tư (investment_amount).

## 6. Output
Giao diện hiển thị khung phân tích AI với các nhãn rủi ro động (Risk Label), lợi nhuận kỳ vọng (Expected Return), lý do cốt lõi (Why this portfolio?) và các điểm lưu ý (Important Notes).

## 7. Cách tôi thực hiện
Xây dựng component giao diện AIExplanationSections.tsx chia các khối rõ rệt (Header, Metrics, Rationale, Main Reasons, Caveats).

Tích hợp và cập nhật logic tại endpoint Backend (/api/v1/portfolio/ai-explanation) để trả về dữ liệu động thay vì dữ liệu cứng.

Viết thuật toán tính toán độ biến động (annual_volatility) và lợi nhuận trung bình trực tiếp từ dữ liệu lịch sử (Cluster 1, 2, 3).

Ánh xạ nhãn rủi ro tự động (High Risk / Low Risk / Moderate Risk) dựa trên mức độ dao động thực tế của danh mục.

Kết hợp kết quả phân tích từ Gemini Service (Cluster 4) vào trường whyThisPortfolio.

Xử lý các vấn đề về Git workflow, cấu hình remote repository và đồng bộ nhánh code làm việc nhóm.

## 8. Code chính
Frontend File: components/AIExplanationSections.tsx

Backend File: app/routers/portfolio.py (hoặc file router tương ứng xử lý /ai-explanation)

Các thành phần kỹ thuật chính:

Tích hợp gọi API /portfolio/ai-explanation với các query parameters động.

Xử lý logic phân loại mức rủi ro động từ annual_volatility.

Kết nối kết quả trả về giữa dữ liệu định lượng Python và diễn giải AI.

## 9. Test
Kiểm thử bằng cách thay đổi các nhóm mã cổ phiếu khác nhau trên Swagger UI (/docs) từ nhóm rủi ro cao (TSLA, COIN, NVDA) sang nhóm phòng thủ (JNJ, PG, KO) để kiểm chứng nhãn risk và expectedReturn tự động biến đổi linh hoạt.

## 10. Screenshot

![alt text](c:\Users\Admin\Pictures\Screenshots\Screenshot 2026-09-26 211412.png)
## 11. Khó khăn gặp phải
Ban đầu em bị chững ở các trường dữ liệu như risk bị gán cứng ở phía backend nên dù đổi nhóm cổ phiếu sang dạng rủi ro cao hay thấp thì phân tích của AI cũng không thay đổi
Sau đó em tìm được giải pháp là xây dựng đoạn logic tính toán động annual_volatility ở tầng backend để phân loại nhãn rủi ro linh hoạt khớp với số liệu thực tế

## 12. Tôi đã học được gì?
Hiểu sâu sắc mô hình kiến trúc phân công rõ rệt giữa toán học định lượng (Python) và phân tích ngôn ngữ (AI/Gemini) để chống hiện tượng ảo giác số liệu tài chính.

Nắm vững cách xây dựng dynamic response contract từ API xuống giao diện React/TypeScript.

Thành thạo hơn trong việc xử lý các tình huống xung đột và phân quyền Git khi phối hợp làm việc nhóm trên repository chung.

## 13. Git
Branch:

feature/NEXUS-AI-002

Commit:

feat: AI explanation vào API portfolio

Merge Request:https://github.com/NicolasWillyam/nexus-fe/compare/main...feature/NEXUS-AI-002