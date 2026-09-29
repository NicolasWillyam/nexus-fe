"use client";

import { useMemo } from "react";
import { ChartScatter } from "lucide-react";
import type { TooltipContentProps } from "recharts";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export interface RiskReturnPoint {
  symbol: string;
  /** Annualized volatility expressed as a percentage. */
  risk: number;
  /** Return for the selected analysis period expressed as a percentage. */
  return: number;
  sharpeRatio?: number;
  beta?: number;
}

export interface RiskReturnChartProps {
  data?: RiskReturnPoint[];
  className?: string;
}

const chartConfig = {
  risk: {
    label: "Risk (Annual Volatility)",
    color: "#2563eb",
  },
  return: {
    label: "Return",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const formatPercent = (value: number) =>
  `${Number.isInteger(value) ? value : value.toFixed(1)}%`;

const createRoundedTicks = (min: number, max: number, step = 10) => {
  const ticks: number[] = [];

  for (let value = min; value <= max; value += step) {
    ticks.push(value);
  }

  return ticks;
};

function RiskReturnTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload as RiskReturnPoint | undefined;

  if (!point) {
    return null;
  }

  return (
    <div className="min-w-36 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-foreground">{point.symbol}</p>
      <div className="grid gap-1 text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <span>Risk</span>
          <span className="font-mono font-medium text-foreground">
            {formatPercent(point.risk)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Return</span>
          <span className="font-mono font-medium text-foreground">
            {formatPercent(point.return)}
          </span>
        </div>
        {point.sharpeRatio !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span>Sharpe</span>
            <span className="font-mono font-medium text-foreground">
              {point.sharpeRatio.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function RiskReturnChart({
  data = [],
  className,
}: RiskReturnChartProps) {
  const validData = useMemo(
    () =>
      data.filter(
        (point) =>
          point.symbol.trim().length > 0 &&
          Number.isFinite(point.risk) &&
          Number.isFinite(point.return),
      ),
    [data],
  );

  const xDomain = useMemo<[number, number]>(() => {
    const maxRisk = Math.max(0, ...validData.map((point) => point.risk));
    const upperBound = Math.max(maxRisk * 1.12, 1);

    return [0, Math.ceil(upperBound / 10) * 10];
  }, [validData]);

  const yDomain = useMemo<[number, number]>(() => {
    const returns = validData.map((point) => point.return);
    const minReturn = Math.min(0, ...returns);
    const maxReturn = Math.max(0, ...returns);
    const range = Math.max(maxReturn - minReturn, 1);
    const padding = Math.max(range * 0.12, 1);

    return [
      Math.floor((minReturn - padding) / 10) * 10,
      Math.ceil((maxReturn + padding) / 10) * 10,
    ];
  }, [validData]);

  const xTicks = useMemo(
    () => createRoundedTicks(xDomain[0], xDomain[1]),
    [xDomain],
  );
  const yTicks = useMemo(
    () => createRoundedTicks(yDomain[0], yDomain[1]),
    [yDomain],
  );

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChartScatter className="h-5 w-5 text-blue-600" />
          Risk vs Return
        </CardTitle>
        <CardDescription>
          Nhìn nhanh mối quan hệ giữa mức sinh lời và rủi ro của từng mã cổ phiếu
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {validData.length === 0 ? (
          <div
            className="flex h-[360px] items-center justify-center text-sm text-muted-foreground"
            role="status"
          >
            Chưa có đủ dữ liệu risk và return để hiển thị biểu đồ.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[360px] w-full min-w-0 text-foreground"
          >
            <ScatterChart
              accessibilityLayer
              margin={{ top: 28, right: 24, bottom: 32, left: 18 }}
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 3"
                vertical
              />
              <XAxis
                type="number"
                dataKey="risk"
                name="Risk"
                unit="%"
                domain={xDomain}
                ticks={xTicks}
                tickFormatter={formatPercent}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                label={{
                  value: "Risk",
                  position: "insideBottomRight",
                  offset: -18,
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="return"
                name="Return"
                unit="%"
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={formatPercent}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                label={{
                  value: "Return",
                  angle: -90,
                  position: "insideLeft",
                  offset: 2,
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                x={0}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeOpacity={0.65}
              />
              <ReferenceLine
                y={0}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeOpacity={0.65}
              />
              <Tooltip
                cursor={{
                  stroke: "var(--muted-foreground)",
                  strokeDasharray: "4 4",
                }}
                content={RiskReturnTooltip}
              />
              <Scatter
                name="Stocks"
                data={validData}
                fill="var(--color-risk)"
                isAnimationActive={false}
                label={{
                  dataKey: "symbol",
                  position: "top",
                  offset: 8,
                  fill: "var(--foreground)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />
            </ScatterChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
