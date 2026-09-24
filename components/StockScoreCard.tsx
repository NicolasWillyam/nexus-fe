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
 * Matches the real response of:
 * GET /api/v1/stocks/analysis?symbols={symbol}
 *
 * IMPORTANT (documented in NEXUS-PORT-001.md, section 7 & 11):
 * The API only returns one overall `score` plus raw metrics
 * (performance / trend_indicators / risk_metrics). It does NOT
 * provide ready-made Quality/Momentum/Value/Risk sub-scores like
 * the assignment example, and it does NOT provide valuation data
 * (P/E, P/B...) needed to compute a real "Value" score.
 *
 * Therefore the 4 sub-scores below are self-derived proxies built
 * from the available raw fields:
 *   - Quality  <- sharpe_ratio   (risk-adjusted return quality)
 *   - Momentum <- rsi_14 + macd.is_bullish
 *   - Value    <- total_return_1y (temporary proxy — NOT a real
 *                 valuation score like low P/E, since the system
 *                 has no company valuation data)
 *   - Risk     <- annual_volatility + max_drawdown
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
  quality: number;
  momentum: number;
  value: number;
  risk: number;
}

interface StockScoreCardProps {
  symbol: string;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts raw metrics into 4 sub-scores on a 0-100 scale.
 * Custom formulas — full rationale documented in NEXUS-PORT-001.md.
 */
function deriveScores(
  symbol: string,
  raw: StockAnalysisResponse["stocks"][string]
): DerivedScores {
  const { performance, trend_indicators, risk_metrics } = raw.metrics;

  // Quality: based on Sharpe Ratio (risk-adjusted return).
  // Sharpe usually ranges roughly -2 to 3, rescaled around 50.
  const quality = clamp(50 + risk_metrics.sharpe_ratio * 20);

  // Momentum: RSI (already 0-100 scale) + bonus/penalty from MACD trend
  const momentum = clamp(
    trend_indicators.rsi_14 + (trend_indicators.macd.is_bullish ? 10 : -10)
  );

  // Value (proxy): 1-year return, rescaled around 50 = break-even.
  // NOT a true valuation score (no P/E, P/B available from the API) —
  // used here as a temporary substitute, documented as an assumption.
  const value = clamp(50 + performance.total_return_1y * 100);

  // Risk (higher = safer): penalize by volatility and max drawdown
  const risk = clamp(
    100 -
      risk_metrics.annual_volatility * 100 -
      Math.abs(risk_metrics.max_drawdown) * 100
  );

  return {
    symbol,
    overallScore: raw.score,
    quality: Math.round(quality),
    momentum: Math.round(momentum),
    value: Math.round(value),
    risk: Math.round(risk),
  };
}

/** Color tiers so scores are readable at a glance. */
function getScoreColor(value: number) {
  if (value >= 70) return { bar: "bg-emerald-500", text: "text-emerald-600" };
  if (value >= 40) return { bar: "bg-amber-500", text: "text-amber-600" };
  return { bar: "bg-rose-500", text: "text-rose-600" };
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
          setError("No data found for this symbol.");
          setData(null);
          return;
        }

        setData(deriveScores(symbol.toUpperCase(), raw));
      } catch (err) {
        console.error("Error fetching stock score:", err);
        setError("Failed to load score data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, [symbol]);

  const overallColor = data ? getScoreColor(data.overallScore) : null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Stock Score Card
        </CardTitle>
        <Activity className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="py-6 text-sm text-muted-foreground">
            Loading score...
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-sm text-rose-600">{error}</div>
        )}

        {!loading && !error && data && (
          <>
            <div className="mb-5">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {data.symbol}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${overallColor?.text}`}>
                  {data.overallScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Overall Score
              </div>
            </div>

            <div className="space-y-4">
          
              <ScoreRow label="Quality" value={data.quality} />
              <ScoreRow label="Momentum" value={data.momentum} />
              <ScoreRow label="Value" value={data.value} />
              <ScoreRow label="Risk" value={data.risk} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className={`font-semibold ${color.text}`}>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-2 rounded-full ${color.bar} transition-all`}
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}