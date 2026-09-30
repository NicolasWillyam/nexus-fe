"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Danh sách Sector mặc định theo đặc tả nhiệm vụ SV07:
 * Technology, Healthcare, Finance, Energy
 */
export const DEFAULT_SECTORS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
];

export interface StockFilterProps {
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  availableSectors?: string[];
  className?: string;
}

export function StockFilter({
  selectedSector,
  onSectorChange,
  availableSectors = [],
  className,
}: StockFilterProps) {
  // Kết hợp các sector mặc định và sector động từ dữ liệu API
  const allSectors = React.useMemo(() => {
    const set = new Set([...DEFAULT_SECTORS, ...availableSectors]);
    return Array.from(set).filter(Boolean);
  }, [availableSectors]);

  // Cấu trúc items cho Select (tương thích Base UI Select)
  const items = React.useMemo(() => {
    return [
      { label: "Tất cả ngành (All)", value: "all" },
      ...allSectors.map((sector) => ({
        label: sector,
        value: sector,
      })),
    ];
  }, [allSectors]);

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground whitespace-nowrap">
        <Filter className="h-3.5 w-3.5 text-primary" />
        <span>Sector:</span>
      </div>

      <Select
        value={selectedSector}
        onValueChange={(val) => {
          if (val) {
            onSectorChange(val);
          }
        }}
        items={items}
      >
        <SelectTrigger size="sm" className="h-9 min-w-[170px] bg-background">
          <SelectValue placeholder="Chọn ngành..." />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            <SelectItem value="all">Tất cả ngành (All)</SelectItem>
            {allSectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedSector !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSectorChange("all")}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          title="Xóa lọc ngành"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Xóa lọc
        </Button>
      )}
    </div>
  );
}

export default StockFilter;
