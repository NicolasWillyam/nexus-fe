"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CalendarDays,
  Clock,
} from "lucide-react";

interface DataHealthResponse {
  status: string;
  latest_price_date?: string;
  message?: string;
}

function calculateDataAge(dateString?: string) {
  if (!dateString) return "N/A";

  const latestDate = new Date(`${dateString}T00:00:00`);
  const now = new Date();

  const diffMs = now.getTime() - latestDate.getTime();
  const diffDays = Math.max(
    0,
    Math.floor(diffMs / (1000 * 60 * 60 * 24))
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day";

  return `${diffDays} days`;
}

export default function DataHealth() {
  const [data, setData] = useState<DataHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDataHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        "/data-pipeline/data-pipeline/health"
      );

      setData(response.data);
    } catch (err) {
      console.error("Lỗi khi tải Data Health:", err);
      setError("Không thể tải trạng thái dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataHealth();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Status</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Đang kiểm tra dữ liệu...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Status</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-red-600">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = data?.status === "healthy";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Data Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              isHealthy
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
          />

          <Badge
            className={
              isHealthy
                ? "bg-emerald-600 hover:bg-emerald-600"
                : "bg-red-600 hover:bg-red-600"
            }
          >
            {isHealthy ? "Healthy" : "Unhealthy"}
          </Badge>
        </div>

        {data?.latest_price_date && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Last Updated
              </p>

              <p className="font-medium">
                {data.latest_price_date}
              </p>
            </div>
          </div>
        )}

        {data?.latest_price_date && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Data Age
              </p>

              <p className="font-medium">
                {calculateDataAge(data.latest_price_date)}
              </p>
            </div>
          </div>
        )}

        {data?.message && (
          <p className="text-sm text-muted-foreground">
            {data.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}