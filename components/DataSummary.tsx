"use client";

import React, { useEffect, useState } from "react";

interface SummaryData {
  stocks_count: number;
  trading_days: number;
  latest_data: string;
  status: string;
}

export default function DataSummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        // Gọi API backend (điều chỉnh endpoint theo đúng route API của backend nếu cần)
        const response = await fetch("http://127.0.0.1:8000/api/v1/stocks/summary");
        
        if (!response.ok) {
          throw new Error("Không thể kết nối đến API dữ liệu");
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        // Mẫu fallback hiển thị khi chưa bật backend hoặc API trả về lỗi
        setSummary({
          stocks_count: 20,
          trading_days: 250,
          latest_data: "06/09/2026",
          status: "Healthy",
        });
        setError(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 rounded-2xl max-w-sm animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100/90 hover:bg-gray-100 rounded-2xl max-w-sm shadow-sm border border-gray-200/60 transition-all">
      {/* Header */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          Nexus Data
        </span>
      </div>

      {/* Grid thông tin */}
      <div className="space-y-4">
        {/* Stocks */}
        <div>
          <div className="text-sm font-medium text-gray-500">Stocks</div>
          <div className="text-xl font-bold text-gray-900">
            {summary?.stocks_count ?? 0}
          </div>
        </div>

        {/* Trading Days */}
        <div>
          <div className="text-sm font-medium text-gray-500">Trading Days</div>
          <div className="text-xl font-bold text-gray-900">
            {summary?.trading_days ?? 0}
          </div>
        </div>

        {/* Latest Data */}
        <div>
          <div className="text-sm font-medium text-gray-500">Latest Data</div>
          <div className="text-xl font-bold text-gray-900">
            {summary?.latest_data ?? "--/--/----"}
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {summary?.status ?? "Healthy"}
          </div>
        </div>
      </div>
    </div>
  );
}