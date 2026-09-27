"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { apiClient } from "@/lib/api";

interface PortfolioInputsResponse {
  status: string;
  symbols: string[];
  trading_days: number;
  expected_returns_annual: Record<string, number>;
  volatility_annual: Record<string, number>;
  covariance_matrix: Record<string, Record<string, number>>;
}

interface AllocationResponse {
  total_investment: number;
  applied_cap_percent: number;
  weights_percent: Record<string, number>;
  amount_allocated: Record<string, number>;
}

interface PortfolioOptimizeResponse {
  status: string;
  scores: Record<string, number>;
  allocation: AllocationResponse;
}

interface PortfolioSummaryProps {
  selectedSymbols: string[];
}

// ======================================================
// Tính Expected Return của toàn bộ Portfolio
// ======================================================
function calculatePortfolioExpectedReturn(
  symbols: string[],
  expectedReturns: Record<string, number>,
  weightsPercent: Record<string, number>,
): number {
  return symbols.reduce((total, symbol) => {
    const expectedReturn = expectedReturns[symbol] ?? 0;
    const weight = (weightsPercent[symbol] ?? 0) / 100;

    return total + expectedReturn * weight;
  }, 0);
}

// ======================================================
// Tính Risk của toàn bộ Portfolio
// Risk = sqrt(w^T * Covariance * w)
// ======================================================
function calculatePortfolioRisk(
  symbols: string[],
  covarianceMatrix: Record<string, Record<string, number>>,
  weightsPercent: Record<string, number>,
): number {
  if (symbols.length === 0) {
    return 0;
  }

  let variance = 0;

  for (const rowSymbol of symbols) {
    for (const columnSymbol of symbols) {
      const rowWeight =
        (weightsPercent[rowSymbol] ?? 0) / 100;

      const columnWeight =
        (weightsPercent[columnSymbol] ?? 0) / 100;

      const covariance =
        covarianceMatrix[rowSymbol]?.[columnSymbol] ?? 0;

      variance +=
        rowWeight *
        columnWeight *
        covariance;
    }
  }

  return Math.sqrt(Math.max(variance, 0)) * 100;
}

export default function PortfolioSummary({
  selectedSymbols,
}: PortfolioSummaryProps) {
  // ======================================================
  // State
  // ======================================================
  const [expectedReturn, setExpectedReturn] = useState(0);
  const [risk, setRisk] = useState(0);

  // Danh sách mã cổ phiếu thực tế lấy từ Portfolio API
  const [portfolioSymbols, setPortfolioSymbols] = useState<
    string[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ======================================================
  // Load Portfolio Summary
  // ======================================================
  useEffect(() => {
    async function loadPortfolioSummary() {
      // Nếu chưa có mã cổ phiếu
      if (selectedSymbols.length === 0) {
        setExpectedReturn(0);
        setRisk(0);
        setPortfolioSymbols([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ==================================================
        // 1. Lấy dữ liệu Portfolio Inputs
        // ==================================================
        const portfolioResponse =
          await apiClient.get<PortfolioInputsResponse>(
            "data-pipeline/portfolio-inputs",
            {
              params: {
                symbols: selectedSymbols,
                days: 252,
              },
            },
          );

        // Lấy danh sách mã thực tế từ API
        const symbols =
          portfolioResponse.data.symbols || [];

        // Lưu danh sách mã để hiển thị trên UI
        setPortfolioSymbols(symbols);

        // Nếu API không trả về mã cổ phiếu
        if (symbols.length === 0) {
          setExpectedReturn(0);
          setRisk(0);
          return;
        }

        // ==================================================
        // 2. Gọi API Portfolio Optimize - SV12
        // ==================================================
        const allocationResponse =
          await apiClient.post<PortfolioOptimizeResponse>(
            "portfolio/portfolio/optimize",
            {
              symbols,
              total_investment: 10000,
            },
          );

        const allocation =
          allocationResponse.data.allocation;

        // ==================================================
        // 3. Tính Expected Return
        // ==================================================
        const calculatedExpectedReturn =
          calculatePortfolioExpectedReturn(
            symbols,
            portfolioResponse.data
              .expected_returns_annual,
            allocation.weights_percent,
          );

        // ==================================================
        // 4. Tính Risk
        // ==================================================
        const calculatedRisk =
          calculatePortfolioRisk(
            symbols,
            portfolioResponse.data.covariance_matrix,
            allocation.weights_percent,
          );

        // ==================================================
        // 5. Cập nhật kết quả lên UI
        // ==================================================
        setExpectedReturn(
          calculatedExpectedReturn,
        );

        setRisk(calculatedRisk);
      } catch (err) {
        console.error(
          "Lỗi khi tải Portfolio Summary:",
          err,
        );

        setExpectedReturn(0);
        setRisk(0);
        setPortfolioSymbols([]);

        setError(
          "Không thể tải thông tin tổng quan danh mục đầu tư.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioSummary();
  }, [selectedSymbols]);

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="space-y-4">

      {/* ==================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ==================================================
          3 SUMMARY CARDS
      ================================================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* ==================================================
            EXPECTED RETURN
        ================================================== */}
        <Card className="border-emerald-200 bg-emerald-50 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900">
              Expected Return
            </CardTitle>
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 shadow-sm">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-700">
              {expectedReturn.toFixed(2)}%
            </div>

            <p className="mt-1 text-xs text-emerald-800/80">
              Lợi nhuận kỳ vọng của danh mục
            </p>
          </CardContent>
        </Card>

        {/* ==================================================
            RISK
        ================================================== */}
        <Card className="border-amber-200 bg-amber-50 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900">
              Risk
            </CardTitle>

            <div className="rounded-full bg-amber-100 p-2 text-amber-600 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-amber-700">
              {loading
                ? "..."
                : `${risk.toFixed(2)}%`}
            </div>

            <p className="mt-1 text-xs text-amber-800/80">
              Độ biến động rủi ro của danh mục
            </p>
          </CardContent>
        </Card>

        {/* ==================================================
            STOCKS
        ================================================== */}
        <Card className="border-sky-200 bg-sky-50 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-sky-900">
              Stocks
            </CardTitle>

            <div className="rounded-full bg-sky-100 p-2 text-sky-600 shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent>

            {/* SỐ LƯỢNG CỔ PHIẾU */}
            <div className="text-2xl font-bold tracking-tight text-sky-800">
              {loading
                ? "..."
                : portfolioSymbols.length}
            </div>

            <p className="mt-1 text-xs text-sky-800/80">
              Mã cổ phiếu trong danh mục
            </p>

            {/* DANH SÁCH MÃ CỔ PHIẾU */}
            <div className="mt-3 flex flex-wrap gap-2">

              {loading ? (
                <span className="text-sm text-muted-foreground">
                  Đang tải...
                </span>
              ) : portfolioSymbols.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Chưa có dữ liệu cổ phiếu
                </span>
              ) : (
                portfolioSymbols.map((symbol) => (
                  <span
                    key={symbol}
                    className="rounded-full border border-sky-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-sky-700 shadow-sm"
                  >
                    {symbol}
                  </span>
                ))
              )}

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}