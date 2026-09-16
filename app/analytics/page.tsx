"use client";

import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, RefreshCw, LineChart as LineChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// 1. Interfaces chuẩn hóa theo đúng cấu trúc JSON Backend
interface StockPerformance {
  total_return_1y?: number;
  cumulative_returns?: Record<string, number>;
}

interface MacdInfo {
  macd_line?: number;
  signal_line?: number;
  histogram?: number;
  is_bullish?: boolean;
}

interface TrendIndicators {
  sma_20?: number;
  sma_50?: number;
  rsi_14?: number;
  rsi_status?: string;
  macd?: MacdInfo;
}

interface RiskMetrics {
  annual_volatility?: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
  beta?: number;
}

interface StockMetrics {
  performance?: StockPerformance;
  trend_indicators?: TrendIndicators;
  risk_metrics?: RiskMetrics;
}

interface ApiResponse {
  status: string;
  benchmark_used: string;
  analyzed_stocks_count: number;
  data: Record<string, StockMetrics>;
}

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN"];
const DEFAULT_BENCHMARK = "AAPL";
const STROKE_COLORS = ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#9333ea"];

export default function StockAnalyticsPage() {
  const [selectedSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [benchmark] = useState<string>(DEFAULT_BENCHMARK);
  const [days, setDays] = useState<number>(252);

  // Fix lỗi TypeScript: Dùng null thay vì None
  const [rawResponse, setRawResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Fetch dữ liệu API
  const fetchAnalytics = async () => {
    if (selectedSymbols.length === 0) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      selectedSymbols.forEach((s) => params.append("symbols", s));
      params.append("benchmark_symbol", benchmark);
      params.append("days", days.toString());

      const response = await apiClient.get<ApiResponse>(
        `/analytics/stock-summary?${params.toString()}`,
      );

      setRawResponse(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  // 3. Biến đổi dữ liệu cumulative_returns cho Recharts
  const chartData = useMemo(() => {
    if (!rawResponse?.data) return [];

    const stockDataMap = rawResponse.data;
    const datesSet = new Set<string>();

    Object.values(stockDataMap).forEach((stockObj) => {
      const cumReturns = stockObj?.performance?.cumulative_returns;
      if (cumReturns) {
        Object.keys(cumReturns).forEach((d) => datesSet.add(d));
      }
    });

    const sortedDates = Array.from(datesSet).sort();

    return sortedDates.map((date) => {
      const row: Record<string, any> = { date };
      Object.keys(stockDataMap).forEach((symbol) => {
        const val =
          stockDataMap[symbol]?.performance?.cumulative_returns?.[date];
        row[symbol] = val !== undefined ? +(val * 100).toFixed(2) : null;
      });
      return row;
    });
  }, [rawResponse]);

  // 4. Danh sách mã cổ phiếu và chỉ số
  const stocksList = useMemo(() => {
    if (!rawResponse?.data) return [];
    return Object.entries(rawResponse.data).map(([symbol, metrics]) => ({
      symbol,
      ...metrics,
    }));
  }, [rawResponse]);

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Phân Tích Tài Chính & Lợi Nhuận Tích Lũy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mã Benchmark:{" "}
            <span className="font-bold text-slate-900">
              {rawResponse?.benchmark_used || benchmark}
            </span>
          </p>
        </div>
        <Button onClick={fetchAnalytics} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Phân Tích Lại
        </Button>
      </div>

      {/* FILTER CẤU HÌNH */}
      <Card className="shadow-sm">
        <CardContent className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Mã phân tích:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSymbols.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="px-2.5 py-1 font-bold"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              Khung thời gian:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
              {[
                { label: "30 ngày", value: 30 },
                { label: "90 ngày", value: 90 },
                { label: "252 ngày (1Y)", value: 252 },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDays(item.value)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    days === item.value
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📈 BIỂU ĐỒ LỢI NHUẬN TÍCH LŨY */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-blue-600" />
            Biểu Đồ So Sánh Lợi Nhuận Tích Lũy Cumulative Returns (%)
          </CardTitle>
          <CardDescription>
            Tỉ lệ tăng trưởng (%) dựa trên mốc khởi đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Đang tải biểu đồ...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Không có dữ liệu chuỗi thời gian
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(val) => `${val}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      `${value}%`,
                      "Lợi nhuận tích lũy",
                    ]}
                  />
                  <Legend />
                  {Object.keys(rawResponse?.data || {}).map((symbol, idx) => (
                    <Line
                      key={symbol}
                      type="monotone"
                      dataKey={symbol}
                      name={symbol}
                      stroke={STROKE_COLORS[idx % STROKE_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📋 BẢNG THỐNG KÊ CHI TIẾT & CHỈ SỐ KỸ THUẬT */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Tổng Kết Hiệu Suất & Chỉ Số Kỹ Thuật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Mã Symbol</TableHead>
                  <TableHead className="text-right font-bold">
                    Tổng Lợi Nhuận (%)
                  </TableHead>
                  <TableHead className="text-right font-bold">Beta</TableHead>
                  <TableHead className="text-right font-bold">
                    Sharpe Ratio
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Volatility (%)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    RSI (14)
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    Xung Lực MACD
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksList.map((item) => {
                  const totalReturn = item.performance?.total_return_1y
                    ? item.performance.total_return_1y * 100
                    : 0;
                  const isPositive = totalReturn >= 0;

                  const volatility = item.risk_metrics?.annual_volatility
                    ? item.risk_metrics.annual_volatility * 100
                    : null;

                  const rsi = item.trend_indicators?.rsi_14;
                  const rsiStatus = item.trend_indicators?.rsi_status;
                  const isMacdBullish = item.trend_indicators?.macd?.is_bullish;

                  return (
                    <TableRow key={item.symbol} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-blue-600">
                        {item.symbol}
                      </TableCell>

                      {/* Lợi nhuận 1Y */}
                      <TableCell className="text-right font-bold">
                        <Badge
                          className={
                            isPositive
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-rose-100 text-rose-800 hover:bg-rose-100"
                          }
                        >
                          {isPositive
                            ? `+${totalReturn.toFixed(2)}%`
                            : `${totalReturn.toFixed(2)}%`}
                        </Badge>
                      </TableCell>

                      {/* Beta */}
                      <TableCell className="text-right font-medium">
                        {item.risk_metrics?.beta !== undefined
                          ? item.risk_metrics.beta.toFixed(2)
                          : "N/A"}
                      </TableCell>

                      {/* Sharpe Ratio */}
                      <TableCell className="text-right font-medium">
                        {item.risk_metrics?.sharpe_ratio !== undefined
                          ? item.risk_metrics.sharpe_ratio.toFixed(2)
                          : "N/A"}
                      </TableCell>

                      {/* Volatility */}
                      <TableCell className="text-right font-medium">
                        {volatility !== null
                          ? `${volatility.toFixed(2)}%`
                          : "N/A"}
                      </TableCell>

                      {/* RSI 14 */}
                      <TableCell className="text-right font-medium">
                        {rsi !== undefined ? (
                          <span
                            className={
                              rsi > 70
                                ? "text-rose-600 font-bold"
                                : rsi < 30
                                  ? "text-emerald-600 font-bold"
                                  : "text-slate-700"
                            }
                          >
                            {rsi.toFixed(2)} {rsiStatus ? `(${rsiStatus})` : ""}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>

                      {/* MACD Status */}
                      <TableCell className="text-right font-medium">
                        {isMacdBullish !== undefined ? (
                          <Badge
                            variant="outline"
                            className={
                              isMacdBullish
                                ? "border-emerald-500 text-emerald-600"
                                : "border-rose-500 text-rose-600"
                            }
                          >
                            {isMacdBullish ? "Bullish" : "Bearish"}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
