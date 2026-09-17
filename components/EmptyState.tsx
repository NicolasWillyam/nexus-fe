"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyState {
  onRetry?: () => void;
  message?: string;
  label?: string;
}

export default function EmptyState ({
  onRetry, message = "No data available.",
  label = "Try again"}: EmptyState) 
{
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <p className="text-sm text-gray-500">{message}</p>
      <Button
        variant="outline"
        onClick={handleRetry}>
        {label}
      </Button>
    </div>
  );
}