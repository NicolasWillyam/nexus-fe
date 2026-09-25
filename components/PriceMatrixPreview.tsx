"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface PriceRow {
  date: string;
  AAPL?: number;
  AMZN?: number;
  GOOGL?: number;
  MSFT?: number;
  NVDA?: number;
}

export default function PriceMatrixPreview() {
  const [data, setData] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiClient.get(
          "data-pipeline/cleaned-price-matrix"
        );

        console.log("Price Matrix:", response.data);

        console.log("Price Matrix:", response.data);

const result = response.data;

if (Array.isArray(result)) {
  setData(result.slice(0, 15));
} else if (Array.isArray(result?.data)) {
  setData(result.data.slice(0, 15));
} else if (Array.isArray(result?.rows)) {
  setData(result.rows.slice(0, 15));
} else {
  console.error("API không trả về danh sách:", result);
  setError("Dữ liệu API không đúng định dạng.");
}
      } catch (err) {
        console.error("Lỗi API:", err);
        setError("Không thể tải dữ liệu price matrix.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          Price Matrix Preview
        </h2>

        <p className="mt-4 text-muted-foreground">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          Price Matrix Preview
        </h2>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Price Matrix Preview
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">AAPL</th>
              <th className="px-4 py-3 text-right">AMZN</th>
              <th className="px-4 py-3 text-right">GOOGL</th>
              <th className="px-4 py-3 text-right">MSFT</th>
              <th className="px-4 py-3 text-right">NVDA</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={`${row.date}-${index}`}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {row.date}
                </td>

                <td className="px-4 py-3 text-right">
                  {row.AAPL?.toFixed(2) ?? "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  {row.AMZN?.toFixed(2) ?? "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  {row.GOOGL?.toFixed(2) ?? "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  {row.MSFT?.toFixed(2) ?? "-"}
                </td>

                <td className="px-4 py-3 text-right">
                  {row.NVDA?.toFixed(2) ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">
          Không có dữ liệu.
        </p>
      )}
    </div>
  );
}