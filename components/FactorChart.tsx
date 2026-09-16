"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface FactorScore {
  factor: string;
  score: number;
}

interface FactorChartResponse {
  portfolio_id: string;
  factors: FactorScore[];
}

export default function FactorChart({ portfolioId = "1" }: { portfolioId?: string }) {
  const [factors, setFactors] = useState<FactorScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactorData = async () => {
      try {
        setLoading(true);
        // Gọi API Backend 
        const response = await axios.get<FactorChartResponse>(
          `http://127.0.0.1:8000/api/v1/portfolio/${portfolioId}/factors`
        );
        setFactors(response.data.factors);
      } catch (err) {
        console.error("Lỗi khi tải Factor Chart:", err);
        setError("Không thể tải dữ liệu chỉ số Factor");
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) {
      fetchFactorData();
    }
  }, [portfolioId]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Đang tải biểu đồ Factor...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm max-w-md">
      <h3 className="text-lg font-bold mb-4">Factor Chart (SV11)</h3>
      <div className="space-y-3">
        {factors.map((item) => (
          <div key={item.factor} className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>{item.factor}</span>
              <span className="text-muted-foreground">{item.score} điểm</span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}