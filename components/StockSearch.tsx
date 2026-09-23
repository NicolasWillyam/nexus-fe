"use client";

import React, { useState, useMemo } from "react";

export interface StockItem {
  symbol?: string;
  ticker?: string;
  company_name?: string;
  name?: string;
  current_price?: number;
  price?: number;
  change_percent?: number;
  change?: string;
}

interface StockSearchProps {
  stocks?: StockItem[];
}

export default function StockSearch({ stocks = [] }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Lọc dữ liệu CHỈ THEO MÃ CỔ PHIẾU (Symbol / Ticker)
  const filteredStocks = useMemo(() => {
    // Nếu search rỗng -> Trả về toàn bộ danh sách cổ phiếu
    if (!searchTerm.trim()) return stocks;
    
    const query = searchTerm.toLowerCase().trim();

    return stocks.filter((stock) => {
      const ticker = (stock.symbol || stock.ticker || "").toLowerCase();
      // CHỈ KIỂM TRA MÃ CỔ PHIẾU
      return ticker.includes(query);
    });
  }, [searchTerm, stocks]);

  return (
    <div className="w-full max-w-md space-y-2 relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search stock..."
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {(isFocused || searchTerm.trim() !== "") && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg overflow-hidden z-50">
          {filteredStocks.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
              {filteredStocks.map((stock, index) => {
                const ticker = stock.symbol || stock.ticker || "";
                const name = stock.company_name || stock.name || "";
                const price = stock.current_price ?? stock.price;

                return (
                  <li
                    key={ticker || index}
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      setSearchTerm(ticker);
                      setIsFocused(false);
                    }}
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 mr-2">
                        {ticker}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        — {name}
                      </span>
                    </div>
                    {price !== undefined && (
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        ${price.toFixed(2)}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              Không tìm thấy dữ liệu
            </div>
          )}
        </div>
      )}
    </div>
  );
}