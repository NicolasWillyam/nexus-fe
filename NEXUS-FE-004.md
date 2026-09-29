# NEXUS-FE-004 — Risk vs Return Chart

## Mục tiêu

Hiển thị nhanh mối quan hệ giữa mức sinh lời và rủi ro của từng cổ phiếu trên cùng một biểu đồ:

- Trục ngang `Risk`: annualized volatility (%).
- Trục dọc `Return`: lợi nhuận của khoảng thời gian đang được chọn trong trang Analytics (%).
- Mỗi điểm đại diện cho một mã và hiển thị symbol ngay cạnh điểm.
- Hover vào điểm để xem risk, return và Sharpe Ratio.

## Component

File triển khai: `components/RiskReturnChart.tsx`.

```tsx
import {
  RiskReturnChart,
  type RiskReturnPoint,
} from "@/components/RiskReturnChart";

const data: RiskReturnPoint[] = [
  { symbol: "AAPL", risk: 22.4, return: 18.6, sharpeRatio: 0.82 },
  { symbol: "MSFT", risk: 19.8, return: 24.1, sharpeRatio: 1.04 },
  { symbol: "NVDA", risk: 42.7, return: 68.3, sharpeRatio: 1.31 },
];

<RiskReturnChart data={data} />;
```

Trang `/analytics` đã chuyển đổi dữ liệu từ endpoint `/analytics/stock-summary` sang contract trên và render component sau cumulative-return chart.

## Quy ước dữ liệu

Backend trả `total_return_1y` và `annual_volatility` ở dạng số thập phân, vì vậy trang Analytics nhân `100` trước khi truyền vào component. Component chỉ nhận phần trăm để format thống nhất trên trục và tooltip.

