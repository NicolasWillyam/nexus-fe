3. Mẫu file Documentation bắt buộc
NEXUS-[TASK 12] – [Portfolio Allocation]

1. Thông tin

Họ tên: Nguyễn Thị Khánh Ngọc

Nhóm: 3

Task: Portfolio Allocation

Ngày thực hiện: 14/09/2026

---

2. Chức năng này dùng để làm gì?
Portfolio Allocation: là quá trình phân bổ vốn đầu tư vào các loại tài sản khác nhau để cân bằng giữa rủi ro và lợi nhuận kỳ vọng. 


3. Nghiệp vụ
3.1 Người dùng muốn làm gì?
Người dùng muốn xem gợi ý tỷ trọng phân bổ vốn tối ưu (%) giữa các mã cổ phiếu trong danh mục đầu tư (mặc định gồm AAPL, MSFT, NVDA, GOOGL) dựa trên dữ liệu thị trường hiện tại.
Người dùng muốn có khả năng bấm làm mới (hoặc thử lại khi gặp lỗi) để hệ thống tính toán lại tỷ lệ phân bổ theo dữ liệu cập nhật mới nhất.

3.2 Tại sao Nexus cần chức năng này?
Tối ưu hóa danh mục đầu tư: Chức năng giúp người dùng ra quyết định quản lý rủi ro và phân bổ nguồn vốn một cách khoa học 
Tăng trải nghiệm trực quan: Giúp người dùng dễ dàng theo dõi tỷ lệ phần trăm phân bổ thông qua các thanh biểu đồ (progress bar) trực quan, sắp xếp theo thứ tự ưu tiên từ cao xuống thấp.
Đảm bảo tính linh hoạt: Cho phép chủ động làm mới dữ liệu (Refresh) khi thị trường biến động mà không cần tải lại toàn bộ trang web.

3.3 Người dùng sử dụng như thế nào?
Người dùng truy cập vào trang quản lý hoặc phân tích danh mục trên ứng dụng Nexus.
Thẻ Portfolio Allocation tự động gọi dịch vụ phân tích thị trường với số vốn định mức (10,000 USD) và các mã cổ phiếu mặc định.
Trong lúc hệ thống xử lý, người dùng nhìn thấy thông báo "Đang tính toán phân bổ...".
Sau khi có kết quả, hệ thống hiển thị danh sách các mã cổ phiếu cùng tỷ trọng phần trăm tương ứng dạng thanh phần trăm (đã xếp thứ tự giảm dần).
(Refresh) Người dùng bấm nút Làm mới (biểu tượng xoay) ở góc trên bên phải để cập nhật lại dữ liệu phân bổ.
(Falsei) Nếu kết nối thất bại, màn hình hiển thị thông báo lỗi kèm nút Thử lại để người dùng bấm khôi phục luồng dữ liệu.

4. API sử dụng
API:  POST /api/v1/portfolio/portfolio/optimize

API dùng để lấy kiểm thử thành công API: `POST /api/v1/portfolio/portfolio/optimize`

- Payload: `{}`
- HTTP status: `200 OK`
- Kết quả: `status: "success"`
- Phân tích 5 mã mặc định: `AAPL`, `AMZN`, `GOOGL`, `MSFT`, `NVDA`
- Tổng phân bổ: `$10,000`
- Cap mỗi mã: `35%`
- Tổng tiền phân bổ: `$10,000.00`
Endpoint được định nghĩa tại portfolio.py.

5. Input
Hiển thị:
Portfolio Allocation

AAPL       30%
MSFT       25%
NVDA       20%
GOOG       25%

6. Output
PortfolioAllocation.tsx
NEXUS-PORT-003.md

7. Cách tôi thực hiện

Gọi API lấy danh sách Portfolio Allocation.
Xây dựng UI Component: Sử dụng bộ UI component của Tailwind CSS & Shadcn UI (Card, CardHeader, CardTitle, CardContent, Button) kết hợp với biểu tượng từ lucide-react để tối ưu trải nghiệm người dùng.
Quản lý State: Sử dụng useState cho allocation, loading, và error để theo dõi chính xác các trạng thái hiển thị của component.
Call API Tối ưu: Dùng useCallback bọc hàm fetchAllocation và đưa vào useEffect để tránh re-render không cần thiết. Đưa các tham số symbols và totalInvestment vào payload gửi tới endpoint /portfolio/portfolio/optimize.
Tính toán dữ liệu hiển thị: Tính tổng tỷ trọng bằng reduce trên mảng allocationRows và phân bổ mảng màu symbolColors để vẽ thanh tiến trình (progress bar) trực quan cho từng mã chứng khoán.


8. Code chính
Liệt kê những file đã thay đổi:

PATH:nexus-fe-main\app\page.tsx


PATH: nexus-fe-main\components\ui\PortfolioAllocation.tsx
Phần import khai báo tên,...: 
"use client";


import { useCallback, useEffect, useState } from "react";
import { DollarSign, PieChart, RefreshCw } from "lucide-react";


import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


interface PortfolioAllocationResponse {
    status: string;
    allocation?: {
        weights_percent?: Record<string, number>;
    };
}


interface PortfolioAllocationProps {
    symbols?: string[];
    totalInvestment?: number;
}


const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA", "GOOGL"];

Phần code chức năng
export default function PortfolioAllocation({
    symbols = DEFAULT_SYMBOLS,
    totalInvestment = 10000,
}: PortfolioAllocationProps) {
    const [allocation, setAllocation] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchAllocation = useCallback(async () => {
        setLoading(true);
        setError(null);


        try {
            const response = await apiClient.post<PortfolioAllocationResponse>(
                "/portfolio/portfolio/optimize",
                {
                    symbols,
                    total_investment: totalInvestment,
                },
            );


            setAllocation(response.data.allocation?.weights_percent ?? {});
        } catch {
            setAllocation({});
            setError("Không thể tải dữ liệu phân bổ vốn.");
        } finally {
            setLoading(false);
        }
    }, [symbols, totalInvestment]);


    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchAllocation();
        }, 0);


        return () => window.clearTimeout(timer);
    }, [fetchAllocation]);


    const allocationRows = Object.entries(allocation);
    const totalAllocated = allocationRows.reduce(
        (total, [, weight]) => total + weight,
        0,
    );
    const symbolColors = [
        "bg-sky-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-rose-500",
        "bg-violet-500",
    ];


Phần html, tạo vàd điều chỉnh giao diện trên web:
    return (
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-5 text-white">
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
                            <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight">
                                Portfolio Allocation
                            </CardTitle>
                            <p className="mt-1 text-xs text-slate-300">
                                Phân bổ vốn theo điểm số và mức rủi ro
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchAllocation}
                        disabled={loading}
                        aria-label="Làm mới phân bổ vốn"
                        title="Làm mới phân bổ vốn"
                        className="text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
                <div className="relative mt-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                            Tổng vốn đầu tư
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
                            <DollarSign className="h-5 w-5 text-cyan-300" />
                            {totalInvestment.toLocaleString("en-US")}
                        </div>
                    </div>
                    {!loading && allocationRows.length > 0 && (
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Đã phân bổ</p>
                            <p className="mt-1 text-lg font-semibold text-cyan-300">
                                {totalAllocated.toFixed(2)}%
                            </p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="space-y-4 p-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="h-2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-between gap-4 p-6">
                        <p className="text-sm text-destructive">{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchAllocation}>
                            Thử lại
                        </Button>
                    </div>
                ) : allocationRows.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">
                        Chưa có dữ liệu phân bổ vốn.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allocationRows.map(([symbol, weight], index) => (
                            <div
                                key={symbol}
                                className="group px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className={`h-9 w-1.5 rounded-full ${symbolColors[index % symbolColors.length]}`}
                                        />
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">
                                                {symbol}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Phân bổ mục tiêu
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                                        {weight.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${symbolColors[index % symbolColors.length]}`}
                                        style={{ width: `${Math.min(weight, 100)}%` }}
                                    />
                                </div>
                            </div>  
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


9. Test

STT
Kịch bản Test
Mô tả Chi tiết
Kết quả Mong đợi
1
Loading State
Gọi API lần đầu hoặc bấm nút Refresh
Hiển thị 4 thanh Skeleton nhấp nháy (animate-pulse), nút Refresh xoay tròn (animate-spin).
2
Success (Có dữ liệu)
API trả về danh sách tỷ trọng (vd: AAPL: 40, MSFT: 30, ...)
Hiển thị danh sách mã cổ phiếu, tỷ lệ %, thanh phần trăm có màu tương ứng và tổng % đã phân bổ.
3
Default Props
Không truyền symbols và totalInvestment
Tự động lấy giá trị mặc định (AAPL, MSFT, NVDA, GOOGL và $10,000).
4
Custom Props
Truyền symbols = ["TSLA", "AMZN"] và totalInvestment = 50000
Gửi đúng dữ liệu tùy chỉnh trong payload API và hiển thị $50,000.
5
Empty Data
API trả về thành công nhưng weights_percent rỗng {}
Hiển thị thông báo "Chưa có dữ liệu phân bổ vốn."
6
API Error / 500
API bị sập, sai đường dẫn hoặc mất kết nối mạng
Hiển thị dòng chữ đỏ "Không thể tải dữ liệu phân bổ vốn." kèm nút "Thử lại".
7
Retry Mechanism
Người dùng bấm nút "Thử lại" hoặc biểu tượng Refresh ở Header
Kích hoạt lại hàm fetchAllocation(), chuyển về trạng thái Loading và gọi lại API.


 
10. Screenshot
'''
https://cdn.phototourl.com/free/2026-09-16-5724aa5a-231d-45a7-8922-1c53a4f0c836.png 

'''
11. Khó khăn gặp phải

Khác biệt cấu trúc dữ liệu từ API: Cấu trúc JSON phản hồi thực tế từ backend 
Xử lý phần tải các bản phần mềm yêu cầu( npm, git….)
Xử lý xung đột code (Git Merge Conflicts): Gặp khó khăn khi đồng bộ lịch sử Git (git pull origin main --allow-unrelated-histories) do gộp file app/page.tsx trùng với các bản cũ
Minh chứng :
 '''
 https://cdn.phototourl.com/free/2026-09-16-e4685040-443f-4128-b015-abc3fe551bda.png
 '''

12. Tôi đã học được gì?

Quản lý trạng thái: Nắm rõ bản chất ký hiệu U (Untracked) và M (Modified) trên VS Code để phân loại file mới/file sửa.
Tạo nhánh tính năng riêng (feat/khanhngoc-nhom3), commit đúng cú pháp chuẩn (feat(SV12): ...) và push lên remote an toàn, bảo vệ nhánh main.
Giải quyết sự cố: Khắc phục lỗi remote 404/URL, sử dụng --allow-unrelated-histories để đồng bộ lịch sử Git độc lập, xử lý trực tiếp Merge Conflict trên VS Code và tạo Pull Request (PR) hoàn chỉnh trên GitHub.
Thiết kế Component: Dùng Client Component ("use client"), định nghĩa interface chuẩn TypeScript cho Props và API Response.


Tối ưu hiệu năng: Kết hợp useCallback và useEffect hợp lý để quản lý luồng fetch API, tránh lỗi tràn bộ nhớ hoặc re-render vô tận.
Kết nối Backend: Sử dụng apiClient.post gửi payload tùy chỉnh (symbols, total_investment) và xử lý dữ liệu tỷ trọng (weights_percent).

13. Git

Branch:
feat/khanhngoc-nhom3 

Commit:
feat/SV12: Phan bo von dau tu

Merge Request:
https://github.com/NicolasWillyam/nexus-fe/pull/7




