"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  market: string;
  industry?: string;
  current_price: number;
  change_amount: number;
  change_percent: number;
}

interface StockListProps {
  stocks?: Stock[];
  loading?: boolean;
}

export function StockList({ stocks: propStocks, loading: propLoading }: StockListProps) {
  const [stocksData, setStocksData] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isControlled = propStocks !== undefined;
  const stocks = isControlled ? propStocks : stocksData;
  const loading = propLoading !== undefined ? propLoading : isLoading;

  useEffect(() => {
    if (!isControlled) {
      const fetchStocks = async () => {
        setIsLoading(true);
        try {
          const res = await apiClient.get("/stocks");
          setStocksData(res.data || []);
        } catch (err) {
          console.error("Lỗi khi tải danh sách cổ phiếu:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStocks();
    }
  }, [isControlled]);

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900">
          <TableRow>
            <TableHead className="w-[200px] font-bold">Mã Symbol</TableHead>
            <TableHead className="font-bold">Tên Công Ty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-12 text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Đang tải dữ liệu từ Server...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : stocks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-12 text-muted-foreground">
                Không tìm thấy dữ liệu phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            stocks.map((stock) => (
              <TableRow
                key={stock.id || stock.symbol}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <TableCell className="font-bold text-blue-600 dark:text-blue-400">
                  {stock.symbol}
                </TableCell>
                <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                  {stock.company_name}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default StockList;
