# NEXUS-AI-002: AI Explanation UI & Data Contract Integration

## Tổng quan
Tài liệu này định nghĩa cấu trúc giao diện và quy tắc tích hợp backend cho module **SV15 — AI Explanation UI**. Mục tiêu là trình bày các phân tích đầu tư của AI thành các khối thông tin ngắn gọn, dễ nắm bắt thay vì dạng đoạn văn dài[cite: 3].

---

## Cấu trúc Thành phần UI (`AIExplanationSections.tsx`)

Giao diện được chia thành các phần rõ rệt:
1. **Header**: Tiêu đề kèm icon AI Sparkles nhận diện ngữ cảnh.
2. **Key Metrics (`Expected Return` & `Risk`)**: Hiển thị song song với màu sắc phân biệt (xanh lục cho lợi nhuận, vàng cho rủi ro).
3. **Core Rationale (`Why this portfolio?`)**: Tóm tắt lý do cốt lõi trong khung chứa riêng biệt.
4. **Bullet Breakdown (`Main Reasons`)**: Danh sách các điểm nhấn định lượng và chiến lược chính.
5. **Caveats (`Important Notes`)**: Chân trang hiển thị lưu ý pháp lý và cảnh báo rủi ro.

---

## Quy tắc Tích hợp Backend & Hợp đồng Dữ liệu

> **QUY TRỌNG:** Tuyệt đối **không tự ý sửa code Backend (BE)** nếu payload trả về từ API hiện tại chưa khớp với các trường định nghĩa (`whyThisPortfolio`, `expectedReturn`, `risk`, `mainReasons`, `importantNotes`)[cite: 3].

### Các bước xử lý khi lệch dữ liệu:
1. Kiểm tra response thực tế từ API AI explanation.
2. Nếu thiếu trường hoặc sai định nghĩa, giữ nguyên code BE và **báo ngay cho mentor** để thống nhất lại contract API[cite: 3].