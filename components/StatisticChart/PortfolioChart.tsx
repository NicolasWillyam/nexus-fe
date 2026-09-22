"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sparkles, SlidersHorizontal, RefreshCw, FileCode, CheckCircle2 } from "lucide-react"


export interface PortfolioItem {
  symbol: string
  name: string
  percentage: number
  value?: number
  color?: string
}

export interface StockData {
  id?: number
  symbol: string
  company_name?: string
  current_price?: number
  change_percent?: number
  market?: string
}

export interface PortfolioChartProps {
  data?: PortfolioItem[]
  title?: string
  description?: string
  availableStocks?: StockData[]
  interactive?: boolean
  showLegend?: boolean
  donut?: boolean
  className?: string
}

export const DEFAULT_TEXT_INPUT = `AAPL 30%
MSFT 25%
NVDA 20%
GOOG 25%`

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { symbol: "AAPL", name: "Apple Inc.", percentage: 30, value: 30000, color: "#3b82f6" },
  { symbol: "MSFT", name: "Microsoft Corp.", percentage: 25, value: 25000, color: "#10b981" },
  { symbol: "NVDA", name: "NVIDIA Corp.", percentage: 20, value: 20000, color: "#f59e0b" },
  { symbol: "GOOG", name: "Alphabet Inc.", percentage: 25, value: 25000, color: "#8b5cf6" },
]

const PALETTE = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
]

export function parsePortfolioText(text: string): PortfolioItem[] {
  if (!text || !text.trim()) return []

  const lines = text.split("\n")
  const items: PortfolioItem[] = []

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return

    const match = trimmed.match(/^([A-Za-z0-9._-]+)\s*[:=\s]\s*([\d.]+)\s*%?$/)
    if (match) {
      const symbol = match[1].toUpperCase()
      const percentage = parseFloat(match[2])
      if (!isNaN(percentage) && percentage >= 0) {
        items.push({
          symbol,
          name: `${symbol} Stock`,
          percentage,
          color: PALETTE[items.length % PALETTE.length],
        })
      }
    } else {
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 2) {
        const symbol = parts[0].toUpperCase()
        const rawPct = parts[1].replace("%", "")
        const percentage = parseFloat(rawPct)
        if (!isNaN(percentage) && percentage >= 0) {
          items.push({
            symbol,
            name: `${symbol} Stock`,
            percentage,
            color: PALETTE[items.length % PALETTE.length],
          })
        }
      }
    }
  })

  return items
}

export function aggregateFromStocks(stocks: StockData[], limit = 5): PortfolioItem[] {
  if (!stocks || stocks.length === 0) return DEFAULT_PORTFOLIO

  const topStocks = [...stocks]
    .sort((a, b) => (b.current_price || 0) - (a.current_price || 0))
    .slice(0, limit)

  const totalPriceSum = topStocks.reduce((sum, s) => sum + (s.current_price || 1), 0)

  return topStocks.map((stock, idx) => {
    const pct = Math.round(((stock.current_price || 1) / totalPriceSum) * 100)
    return {
      symbol: stock.symbol,
      name: stock.company_name || `${stock.symbol} Inc.`,
      percentage: pct,
      value: stock.current_price,
      color: PALETTE[idx % PALETTE.length],
    }
  })
}

export function PortfolioChart({
  data,
  title = "Portfolio Allocation",
  description = "Tỉ lệ phân bổ danh mục cổ phiếu",
  availableStocks = [],
  interactive = true,
  showLegend = true,
  donut = true,
  className,
}: PortfolioChartProps) {
  const [sourceMode, setSourceMode] = React.useState<"text" | "website" | "manual">("text")
  const [inputText, setInputText] = React.useState<string>(DEFAULT_TEXT_INPUT)
  const [chartTitle, setChartTitle] = React.useState<string>(title)
  const [manualItems, setManualItems] = React.useState<PortfolioItem[]>(data || DEFAULT_PORTFOLIO)
  const [donutMode, setDonutMode] = React.useState<boolean>(donut)

  const parsedItems = React.useMemo(() => {
    return parsePortfolioText(inputText)
  }, [inputText])

  const activeItems = React.useMemo(() => {
    if (sourceMode === "text") {
      return parsedItems.length > 0 ? parsedItems : (data || DEFAULT_PORTFOLIO)
    }
    return manualItems
  }, [sourceMode, parsedItems, manualItems, data])

  const chartData = React.useMemo(() => {
    return activeItems.map((item, index) => ({
      ...item,
      color: item.color || PALETTE[index % PALETTE.length],
      fill: item.color || PALETTE[index % PALETTE.length],
    }))
  }, [activeItems])

  const totalPercentage = React.useMemo(() => {
    return activeItems.reduce((acc, curr) => acc + curr.percentage, 0)
  }, [activeItems])

  const totalValue = React.useMemo(() => {
    return activeItems.reduce((acc, curr) => acc + (curr.value ?? 0), 0)
  }, [activeItems])

  const handleLoadFromWebsite = React.useCallback(() => {
    setSourceMode("website")
    if (availableStocks.length > 0) {
      const aggregated = aggregateFromStocks(availableStocks)
      setManualItems(aggregated)
      const textFormatted = aggregated.map((i) => `${i.symbol} ${i.percentage}%`).join("\n")
      setInputText(textFormatted)
    }
  }, [availableStocks])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      percentage: { label: "Allocation %" },
    }
    chartData.forEach((item) => {
      config[item.symbol] = {
        label: `${item.symbol} (${item.name})`,
        color: item.color,
      }
    })
    return config
  }, [chartData])

  return (
    <div className={cn("space-y-6 w-full max-w-2xl mx-auto", className)}>
      {/* 🛠️ BẢNG ĐIỀU KHIỂN BẢN TƯƠNG TÁC (INTERACTIVE INPUT CONTROLS) */}
      {interactive && (
        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">

                </CardTitle>
                <CardDescription className="text-xs">
                  Nhập thông số tùy chỉnh hoặc tự động tổng hợp từ website
                </CardDescription>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSourceMode("text")}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                    sourceMode === "text"
                      ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                  )}
                >
                  Tùy chỉnh
                </button>
                <button
                  type="button"
                  onClick={handleLoadFromWebsite}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1",
                    sourceMode === "website" || sourceMode === "manual"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                  )}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Từ Website
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Input 1: Tạo biểu đồ (Title) */}
            <div className="space-y-1">
              <Label htmlFor="chart-title-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tạo biểu đồ:
              </Label>
              <Input
                id="chart-title-input"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Portfolio Allocation"
                className="bg-white dark:bg-slate-950 text-xs font-mono"
              />
            </div>

            {/* Input 2: Dynamic Input Area (Ví dụ Pie Chart) */}
            {sourceMode === "text" ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="chart-data-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ví dụ Pie Chart:
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setInputText(DEFAULT_TEXT_INPUT)}
                    className="text-[11px] text-muted-foreground hover:text-foreground h-5 px-1.5"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Mẫu ban đầu
                  </Button>
                </div>
                <textarea
                  id="chart-data-input"
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`AAPL 30%\nMSFT 25%\nNVDA 20%\nGOOG 25%`}
                  className="w-full rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono shadow-2xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Đã tổng hợp tỷ trọng từ dữ liệu Website ({availableStocks.length || 4} Mã cổ phiếu)
                  </span>
                  {availableStocks.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={handleLoadFromWebsite}
                      className="text-xs border-emerald-300 h-6"
                    >
                      Làm mới
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chartData.map((item) => (
                    <Badge key={item.symbol} variant="outline" className="bg-white dark:bg-slate-900 text-xs font-mono">
                      {item.symbol}: <strong className="ml-1 text-emerald-600">{item.percentage}%</strong>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Options bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[11px]">Kiểu biểu đồ:</span>
                <Button
                  type="button"
                  size="xs"
                  variant={donutMode ? "default" : "outline"}
                  onClick={() => setDonutMode(true)}
                  className="h-6 text-[11px]"
                >
                  Donut
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={!donutMode ? "default" : "outline"}
                  onClick={() => setDonutMode(false)}
                  className="h-6 text-[11px]"
                >
                  Pie
                </Button>
              </div>

              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                <span>Tổng phần trăm:</span>
                <span
                  className={cn(
                    "font-bold px-1.5 py-0.5 rounded-sm",
                    totalPercentage === 100
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {totalPercentage}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BIỂU ĐỒ HIỂN THỊ (OUTPUT DISPLAY) */}
      <Card className="flex flex-col shadow-xs border-slate-200 dark:border-slate-800">
        <CardHeader className="items-center pb-2 text-center">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {chartTitle || title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[290px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const item = payload[0].payload as (PortfolioItem & { color: string })
                    return (
                      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl text-xs space-y-1">
                        <div className="flex items-center gap-2 font-semibold">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.symbol}</span>
                          <span className="text-muted-foreground font-normal">
                            ({item.name})
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 text-muted-foreground">
                          <span>Tỷ lệ phân bổ:</span>
                          <span className="font-bold text-foreground">
                            {item.percentage}%
                          </span>
                        </div>
                        {item.value !== undefined && (
                          <div className="flex justify-between items-center gap-4 text-muted-foreground">
                            <span>Giá trị:</span>
                            <span className="font-mono font-medium text-foreground">
                              ${item.value.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="percentage"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  innerRadius={donutMode ? 65 : 0}
                  outerRadius={95}
                  paddingAngle={donutMode ? 3 : 0}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.symbol} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend Items */}
          {showLegend && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 pt-4 border-t border-border/50">
              {chartData.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold truncate text-foreground">
                      {item.symbol}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalValue > 0 && (
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Tổng giá trị:{" "}
              <span className="font-bold font-mono text-foreground">
                ${totalValue.toLocaleString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PortfolioChart
