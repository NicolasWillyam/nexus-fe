"use client";
 
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
/**
 * Cấu trúc này khớp với response thật của:
 * GET /api/v1/stocks/analysis?symbols={symbol}
 *
 * Lưu ý: API chỉ trả về 1 điểm tổng (`score`) và dữ liệu thô
 * (performance / trend_indicators / risk_metrics), KHÔNG có sẵn
 * Quality/Momentum/Value/Risk như ví dụ minh họa trong đề bài.
 * Vì vậy Momentum, Risk, Performance bên dưới là điểm do TÔI tự
 * tính từ dữ liệu thô — công thức và lý do được giải thích trong
 * NEXUS-PORT-001.md, mục 7.
 */
interface StockAnalysisResponse {
  total_analyzed: number;
  stocks: Record<
    string,
    {
      score: number;
      metrics: {
        performance: {
          total_return_1y: number;
        };
        trend_indicators: {
          rsi_14: number;
          rsi_status: string;
          macd: {
            is_bullish: boolean;
          };
        };
        risk_metrics: {
          annual_volatility: number;
          max_drawdown: number;
          sharpe_ratio: number;
          beta: number;
        };
      };
    }
  >;
}
 
interface DerivedScores {
  symbol: string;
  overallScore: number;
  performance: number;
  momentum: number;
  risk: number;
}
 
interface StockScoreCardProps {
  symbol: string;
}
 
function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}
 
/**
 * Quy đổi dữ liệu thô sang các điểm thành phần 0-100.
 * Đây là công thức đơn giản, tự thiết kế — cần ghi rõ lý do trong tài liệu.
 */
function deriveScores(
  symbol: string,
  raw: StockAnalysisResponse["stocks"][string]
): DerivedScores {
  const { performance, trend_indicators, risk_metrics } = raw.metrics;
 
  // Momentum: dựa trên RSI (đã là thang 0-100) + thưởng/phạt theo MACD
  const momentum = clamp(
    trend_indicators.rsi_14 + (trend_indicators.macd.is_bullish ? 10 : -10)
  );
 
  // Risk (điểm càng cao = càng an toàn): trừ điểm theo biến động và mức sụt giảm tối đa
  const risk = clamp(
    100 -
      risk_metrics.annual_volatility * 100 -
      Math.abs(risk_metrics.max_drawdown) * 100
  );
 
  // Performance: lợi nhuận 1 năm, quy đổi quanh mốc 50 điểm = hoà vốn
  const perf = clamp(50 + performance.total_return_1y * 100);
 
  return {
    symbol,
    overallScore: raw.score,
    performance: Math.round(perf),
    momentum: Math.round(momentum),
    risk: Math.round(risk),
  };
}
 
export default function StockScoreCard({ symbol }: StockScoreCardProps) {
  const [data, setData] = useState<DerivedScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (!symbol) return;
 
    async function fetchScore() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<StockAnalysisResponse>(
          "/stocks/analysis",
          { params: { symbols: symbol } }
        );
 
        const raw = response.data.stocks[symbol.toUpperCase()];
 
        if (!raw) {
          setError("Không tìm thấy dữ liệu cho mã này.");
          setData(null);
          return;
        }
 
        setData(deriveScores(symbol.toUpperCase(), raw));
      } catch (err) {
        console.error("Lỗi khi tải điểm số cổ phiếu:", err);
        setError("Không thể tải dữ liệu điểm số. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
 
    fetchScore();
  }, [symbol]);
 
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Thẻ Điểm Cổ Phiếu
        </CardTitle>
        <Activity className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="py-6 text-sm text-muted-foreground">
            Đang tải điểm số...
          </div>
        )}
 
        {!loading && error && (
          <div className="py-6 text-sm text-rose-600">{error}</div>
        )}
 
        {!loading && !error && data && (
          <>
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {data.symbol}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {data.overallScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Điểm Tổng
              </div>
            </div>
 
            <div className="space-y-3">
              <ScoreRow label="Hiệu Suất" value={data.performance} />
              <ScoreRow label="Động Lượng" value={data.momentum} />
              <ScoreRow label="Rủi Ro" value={data.risk} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
 
function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-blue-500"
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}
 