"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

interface AIExplanationData {
  whyThisPortfolio?: string;
  expectedReturn?: string;
  risk?: string;
  mainReasons?: string[];
  importantNotes?: string[];
}

export function AIExplanationSections() {
  const [data, setData] = useState<AIExplanationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi tới API backend động đã được tích hợp AI Service
      const response = await apiClient.get("/portfolio/ai-explanation");
      const payload = response.data?.data || response.data;

      setData({
        whyThisPortfolio: payload?.whyThisPortfolio?.replace(/###|\*\*/g, '').trim() || "Chưa có nội dung tổng quan.",
        expectedReturn: payload?.expectedReturn || "Đang cập nhật...",
        risk: payload?.risk || "Đang đánh giá...",
        mainReasons: payload?.mainReasons || ["Đang tổng hợp các chỉ số kỹ thuật gốc."],
        importantNotes: payload?.importantNotes || ["Tuân thủ nguyên tắc quản trị rủi ro hệ thống."]
      });
    } catch (err: any) {
      console.error("Lỗi khi tải AI explanation:", err);
      setError("Không thể kết nối tới dịch vụ phân tích AI từ Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIExplanation();
  }, []);

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <div>
            <CardTitle className="text-lg">AI Portfolio Insights</CardTitle>
            <CardDescription>Phân tích chi tiết danh mục đầu tư dựa trên dữ liệu thời gian thực</CardDescription>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAIExplanation} disabled={loading} className="gap-2">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Hệ thống đang trích xuất dữ liệu gốc và tổng hợp phân tích...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-6 text-sm">
            {/* 1. Why this portfolio? */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                📌 Why this portfolio?
              </h4>
              <div className="text-muted-foreground leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-lg border">
                {data?.whyThisPortfolio}
              </div>
            </div>

            {/* 2 & 3. Expected Return & Risk Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100">
                <h5 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-1">📈 Expected Return</h5>
                <p className="text-muted-foreground">{data?.expectedReturn}</p>
              </div>
              <div className="p-3.5 rounded-lg border bg-amber-50/30 dark:bg-amber-950/10 border-amber-100">
                <h5 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">⚠️ Risk Level</h5>
                <p className="text-muted-foreground">{data?.risk}</p>
              </div>
            </div>

            {/* 4. Main Reasons */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">💡 Main Reasons</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                {data?.mainReasons?.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            {/* 5. Important Notes */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">⚠️ Important Notes</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                {data?.importantNotes?.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}