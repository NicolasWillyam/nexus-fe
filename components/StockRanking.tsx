"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

// main api response json structure
interface StockAnalysis {
  score: number;
  metrics: {
    performance: {
      total_return_1y: number;
      cumulative_returns: Record<string, number>;
    };
    trend_indicators: {
      sma_20: number;
      sma_50: number;
      rsi_14: number;
      rsi_status: string;
      macd: {
        macd_line: number;
        signal_line: number;
        histogram: number;
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

interface AnalysisResponse {
  total_analyzed: number;
  stocks: Record<string, StockAnalysis>;
}

interface RankedStock {
  rank: number;
  symbol: string;
  score: number;
  totalReturn1y: number;
  rsiStatus: string;
  isBullish: boolean;
}

// some presets
const STOCK_PRESETS: Record<string, { label: string; symbols: string[] }> = {
  "top-3": {
    label: "Top 3",
    symbols: ["AAPL", "MSFT", "NVDA"],
  },
  "mag-7": {
    label: "Magnificent 7",
    symbols: ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"],
  },
  "top-10-tech": {
    label: "Top 10 Tech",
    symbols: [
      "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN",
      "META", "TSLA", "AVGO", "ORCL", "CRM",
    ],
  },
  "top-10-sp500": {
    label: "Top 10 S&P 500",
    symbols: [
      "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL",
      "META", "BRK-B", "LLY", "JPM", "UNH",
    ],
  },
};
// chon preset (lay tu mau js)
const PRESET_ITEMS = Object.entries(STOCK_PRESETS).map(([value, { label }]) => ({
  label,
  value,
}));

export function StockRanking() {
  const [selectedPreset, setSelectedPreset] = useState("top-3");  //default value
  const [rankedStocks, setRankedStocks] = useState<RankedStock[]>([]);
  const [loading, setLoading] = useState(true);

  const currentSymbols = STOCK_PRESETS[selectedPreset].symbols;

  useEffect(() => {
    fetchStockAnalysis();
    const interval = setInterval(fetchStockAnalysis, 3e6); // Tự động làm mới mỗi 300s
    return () => clearInterval(interval);
    // apply cho preset
  }, [selectedPreset])

  const fetchStockAnalysis = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      currentSymbols.forEach((symbol) => params.append("symbols", symbol));

      const response = await apiClient.get<AnalysisResponse>(
        `/stocks/analysis?${params.toString()}`
      );

      const data = response.data;

      // Main logic: Bien doi roi sap xep
      const ranked: RankedStock[] = Object.entries(data.stocks)
        .map(([symbol, analysis]) => ({
          rank: 0,
          symbol,
          score: Math.round(analysis.score),
          totalReturn1y: analysis.metrics.performance.total_return_1y,
          rsiStatus: analysis.metrics.trend_indicators.rsi_status,
          isBullish: analysis.metrics.trend_indicators.macd.is_bullish,
        }))
        .sort((a, b) => b.score - a.score)
        .map((stock, index) => ({
          ...stock,
          rank: index + 1,
        }));

      setRankedStocks(ranked);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phân tích cổ phiếu:", err)
      setRankedStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // j4f: emoji huy chuong cho podium
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  // Score color based on value
  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default" as const;
    if (score >= 50) return "secondary" as const;
    return "destructive" as const
  }

  // Return icon (reused from page.tsx)
  const getReturnIcon = (returnValue: number) => {
    if (returnValue > 0) return <TrendingUp className="size-4 text-green-500" />
    if (returnValue < 0) return <TrendingDown className="size-4 text-red-500" />;
    return <Minus className="size-4 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="size-5" />
              Stock Ranking
            </CardTitle>
            <CardDescription>
              Xếp hạng cổ phiếu theo điểm phân tích
            </CardDescription>
          </div>
          {/* Dropdown chọn nhóm cổ phiếu */}
          <Select
            value={selectedPreset}
            onValueChange={(value) => {
              if (value) setSelectedPreset(value);
            }}
            items={PRESET_ITEMS}
          >
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Chọn nhóm cổ phiếu</SelectLabel>
                {Object.entries(STOCK_PRESETS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead className="w-[80px] font-bold">Rank</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="text-right font-bold">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedStocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {loading
                      ? "Đang tải dữ liệu từ Server..."
                      : "Không tìm thấy dữ liệu phân tích phù hợp."}
                  </TableCell>
                </TableRow>
              ) : (
                rankedStocks.map((stock) => (
                  <TableRow
                    key={stock.symbol}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <TableCell className="text-center text-lg">
                      {getRankDisplay(stock.rank)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {stock.symbol}
                        </span>
                        {getReturnIcon(stock.totalReturn1y)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getScoreBadgeVariant(stock.score)}>
                        {stock.score}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}