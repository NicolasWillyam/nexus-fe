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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
};

interface AnalysisResponse {
  total_analyzed: number;
  stocks: Record<string, StockAnalysis>
};

interface RankedStock {
  rank: number;
  symbol: string;
  score: number;
  totalReturn1y: number;
  rsiStatus: string;
  isBullish: boolean;
};

// default symbols tu docs:
// todo: lam cai bang chon or sth
const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'NVDA']

// fixme: test default func
export default function StockRanking() {
  const [rankedStocks, setRankedStocks] = useState<RankedStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStockAnalysis();
    const interval = setInterval(fetchStockAnalysis, 3e6); // Tự động làm mới mỗi 300s
    return () => clearInterval(interval);
  }, []);

  const fetchStockAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      DEFAULT_SYMBOLS.forEach((symbol) => params.append("symbols", symbol));

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
    } catch (err) {
      console.error("Err: Failed to fetch stock analysis:", err);
      setError("Can not load stock analysis.");
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
    if (score >= 80) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  }

  // Return icon (reused from page.tsx)
  const getReturnIcon = (returnValue: number) => {
    if (returnValue > 0) return <TrendingUp className="size-4 text-green-500" />;
    if (returnValue < 0) return <TrendingDown className="size-4 text-red-500" />;
    return <Minus className="size-4 text-muted-foreground" />;
  };
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5" />
            Stock Ranking
          </CardTitle>
          <CardDescription>Đang tải dữ liệu phân tích...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5" />
            Stock Ranking
          </CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="size-5" />
          Stock Ranking
        </CardTitle>
        <CardDescription>
          Xếp hạng {rankedStocks.length} cổ phiếu theo điểm phân tích
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedStocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="text-center text-lg">
                  {getRankDisplay(stock.rank)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stock.symbol}</span>
                    {getReturnIcon(stock.totalReturn1y)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getScoreBadgeVariant(stock.score)}>
                    {stock.score}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}