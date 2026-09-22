import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type LoadingVariant =
  | "spinner"
  | "skeleton-table"
  | "skeleton-cards"
  | "skeleton-chart"
  | "skeleton-custom"
  | "fullscreen";

export interface LoadingStateProps {
  /**
   * Kiểu hiển thị của trạng thái loading
   * @default "spinner"
   */
  variant?: LoadingVariant;
  /**
   * Nội dung chữ hiển thị kèm spinner
   * @default "Đang tải dữ liệu..."
   */
  text?: string;
  /**
   * Số lượng hàng skeleton khi dùng kiểu "skeleton-table"
   * @default 5
   */
  rows?: number;
  /**
   * Số lượng cột skeleton khi dùng kiểu "skeleton-table"
   * @default 6
   */
  columns?: number;
  /**
   * Số lượng thẻ skeleton khi dùng kiểu "skeleton-cards"
   * @default 4
   */
  cards?: number;
  /**
   * Kích thước của spinner (sm | md | lg)
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className bổ sung
   */
  className?: string;
  /**
   * Custom children (khi muốn bọc custom skeleton)
   */
  children?: React.ReactNode;
}

/**
 * Component Spinner cơ bản kèm text
 */
export function LoadingSpinner({
  text = "Đang tải dữ liệu...",
  size = "md",
  className,
}: Pick<LoadingStateProps, "text" | "size" | "className">) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size])}
        aria-hidden="true"
      />
      {text && (
        <p className={cn("font-medium animate-pulse", textSizeClasses[size])}>
          {text}
        </p>
      )}
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}

/**
 * Skeleton dạng Lưới thẻ KPI (Cards)
 */
export function SkeletonCards({
  cards = 4,
  className,
}: Pick<LoadingStateProps, "cards" | "className">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
      aria-label="Đang tải danh sách thẻ thống kê"
    >
      {Array.from({ length: cards }).map((_, idx) => (
        <Card key={idx} className="shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton dạng Bảng dữ liệu (Table)
 */
export function SkeletonTable({
  rows = 5,
  columns = 6,
  className,
}: Pick<LoadingStateProps, "rows" | "columns" | "className">) {
  return (
    <div
      className={cn("rounded-lg border overflow-hidden bg-card", className)}
      aria-label="Đang tải dữ liệu bảng"
    >
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
          <TableRow>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <TableHead key={colIdx}>
                <Skeleton className="h-4 w-20 my-1" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className="hover:bg-transparent">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx} className="py-4">
                  <Skeleton
                    className={cn(
                      "h-5",
                      colIdx === 0
                        ? "w-16 font-bold"
                        : colIdx === 1
                        ? "w-36"
                        : colIdx === columns - 1
                        ? "w-20 ml-auto"
                        : "w-24"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Skeleton dạng Khung biểu đồ (Chart)
 */
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <Card className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="h-[280px] w-full flex items-end gap-2 pt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${Math.max(20, Math.sin(i + 1) * 60 + 35)}%`,
            }}
          />
        ))}
      </div>
    </Card>
  );
}

/**
 * Loading toàn màn hình (Full screen overlay)
 */
export function FullscreenLoading({
  text = "Đang khởi tạo Nexus Terminal...",
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border bg-card/90 shadow-2xl">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-4 border-primary/20 animate-ping" />
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-lg tracking-tight">Nexus Terminal</h3>
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Component LoadingState tổng hợp đa năng dùng chung cho toàn bộ dự án
 */
export default function LoadingState({
  variant = "spinner",
  text = "Đang tải dữ liệu...",
  rows = 5,
  columns = 6,
  cards = 4,
  size = "md",
  className,
  children,
}: LoadingStateProps) {
  switch (variant) {
    case "spinner":
      return <LoadingSpinner text={text} size={size} className={className} />;

    case "skeleton-cards":
      return <SkeletonCards cards={cards} className={className} />;

    case "skeleton-table":
      return (
        <SkeletonTable rows={rows} columns={columns} className={className} />
      );

    case "skeleton-chart":
      return <SkeletonChart className={className} />;

    case "fullscreen":
      return <FullscreenLoading text={text} />;

    case "skeleton-custom":
      return <div className={cn("animate-pulse", className)}>{children}</div>;

    default:
      return <LoadingSpinner text={text} size={size} className={className} />;
  }
}
