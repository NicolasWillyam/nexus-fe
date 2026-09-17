"use client";

import { useEffect, useState, useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api";
import { StockRanking } from "@/components/StockRanking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Minus,
  DollarSign,
  Activity,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  market: string;
  industry: string;
  current_price: number;
  change_amount: number;
  change_percent: number;
}

export default function Page() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "gainers" | "losers">(
    "all",
  );
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/stocks");
      setStocks(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cổ phiếu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    if (!stocks.length)
      return {
        total: 0,
        gainers: 0,
        losers: 0,
        unchanged: 0,
        topGainer: null,
        topLoser: null,
      };

    let gainers = 0;
    let losers = 0;
    let unchanged = 0;

    let topGainer = stocks[0];
    let topLoser = stocks[0];

    stocks.forEach((s) => {
      if (s.change_percent > 0) gainers++;
      else if (s.change_percent < 0) losers++;
      else unchanged++;

      if (s.change_percent > (topGainer?.change_percent ?? -Infinity))
        topGainer = s;
      if (s.change_percent < (topLoser?.change_percent ?? Infinity))
        topLoser = s;
    });

    return {
      total: stocks.length,
      gainers,
      losers,
      unchanged,
      topGainer,
      topLoser,
    };
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      const matchesSearch =
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.company_name.toLowerCase().includes(search.toLowerCase());

      if (filterType === "gainers")
        return matchesSearch && s.change_percent > 0;
      if (filterType === "losers") return matchesSearch && s.change_percent < 0;
      return matchesSearch;
    });
  }, [stocks, search, filterType]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 p-4 lg:p-6">
              {/* HEADER TỔNG QUAN */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    Thị Trường Cổ Phiếu Mỹ
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tổng quan dữ liệu Realtime & Biến động Top 100 Mã Cổ Phiếu
                    Hàng Đầu
                  </p>
                </div>
                <Button
                  onClick={fetchStocks}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2 shadow-sm"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Làm mới dữ liệu
                </Button>
              </div>

              {/* KHỐI KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tổng Số Mã Theo Dõi
                    </CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.total} Mã</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sàn NASDAQ & NYSE
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Cân Bằng Thị Trường
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> {metrics.gainers}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-lg font-bold text-rose-600 flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" /> {metrics.losers}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-sm font-medium text-slate-500 flex items-center gap-0.5">
                        <Minus className="h-3 w-3" /> {metrics.unchanged}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mã Tăng / Mã Giảm / Đi Ngang
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-emerald-100 bg-emerald-50/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-800">
                      Tăng Mạnh Nhất
                    </CardTitle>
                    <Flame className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    {metrics.topGainer ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-slate-900">
                            {metrics.topGainer.symbol}
                          </span>
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                            +{metrics.topGainer.change_percent?.toFixed(2)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {metrics.topGainer.company_name}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-rose-100 bg-rose-50/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-800">
                      Giảm Mạnh Nhất
                    </CardTitle>
                    <ArrowDownRight className="h-4 w-4 text-rose-600" />
                  </CardHeader>
                  <CardContent>
                    {metrics.topLoser ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-slate-900">
                            {metrics.topLoser.symbol}
                          </span>
                          <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                            {metrics.topLoser.change_percent?.toFixed(2)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {metrics.topLoser.company_name}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* BẢO LƯU CHART TỪ CODE CŨ */}
              <ChartAreaInteractive />

              {/* 🏆 KHỐI: STOCK RANKING */}
              <StockRanking />

              {/* BẢNG DỮ LIỆU BẢN MỚI */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Danh Sách Cổ Phiếu Chi Tiết
                      </CardTitle>
                      <CardDescription>
                        Cập nhật giá đóng cửa gần nhất và biến động trong ngày
                      </CardDescription>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
                        <button
                          onClick={() => setFilterType("all")}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            filterType === "all"
                              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Tất cả ({metrics.total})
                        </button>
                        <button
                          onClick={() => setFilterType("gainers")}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            filterType === "gainers"
                              ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Tăng giá ({metrics.gainers})
                        </button>
                        <button
                          onClick={() => setFilterType("losers")}
                          className={`px-3 py-1.5 rounded-md transition-all ${
                            filterType === "losers"
                              ? "bg-white dark:bg-slate-900 text-rose-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Giảm giá ({metrics.losers})
                        </button>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm symbol, tên công ty..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-8 h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900">
                        <TableRow>
                          <TableHead className="w-[120px] font-bold">
                            Mã Symbol
                          </TableHead>
                          <TableHead className="font-bold">
                            Tên Công Ty
                          </TableHead>
                          <TableHead className="font-bold">
                            Sàn Giao Dịch
                          </TableHead>
                          <TableHead className="text-right font-bold">
                            Giá Hiện Tại
                          </TableHead>
                          <TableHead className="text-right font-bold">
                            Thay Đổi ($)
                          </TableHead>
                          <TableHead className="text-right font-bold">
                            Biến Động (%)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStocks.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-12 text-muted-foreground"
                            >
                              {loading
                                ? "Đang tải dữ liệu từ Server..."
                                : "Không tìm thấy dữ liệu phù hợp."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStocks.map((stock) => {
                            const isPositive = stock.change_amount > 0;
                            const isZero = stock.change_amount === 0;

                            return (
                              <TableRow
                                key={stock.id}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                              >
                                <TableCell className="font-bold text-blue-600 dark:text-blue-400">
                                  {stock.symbol}
                                </TableCell>
                                <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                                  {stock.company_name}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className="font-normal text-xs"
                                  >
                                    {stock.market || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                                  ${stock.current_price?.toFixed(2)}
                                </TableCell>
                                <TableCell
                                  className={`text-right font-semibold ${
                                    isZero
                                      ? "text-slate-500"
                                      : isPositive
                                        ? "text-emerald-600"
                                        : "text-rose-600"
                                  }`}
                                >
                                  {isZero
                                    ? "0.00"
                                    : isPositive
                                      ? `+${stock.change_amount?.toFixed(2)}`
                                      : stock.change_amount?.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    className={`gap-1 font-semibold ${
                                      isZero
                                        ? "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                        : isPositive
                                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100"
                                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100"
                                    }`}
                                  >
                                    {isZero ? (
                                      <Minus className="h-3 w-3" />
                                    ) : isPositive ? (
                                      <ArrowUpRight className="h-3.5 w-3.5" />
                                    ) : (
                                      <ArrowDownRight className="h-3.5 w-3.5" />
                                    )}
                                    {isZero
                                      ? "0.00%"
                                      : isPositive
                                        ? `+${stock.change_percent?.toFixed(2)}%`
                                        : `${stock.change_percent?.toFixed(2)}%`}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
