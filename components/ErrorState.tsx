"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorState {
  onRetry?: () => void;
  message?: string;
  label?: string;
}

export default function ErrorState ({
  onRetry, message = "Cannot load data.",
  label = "Retry"}: ErrorState) 
{
  const handleRetry = onRetry ?? (() => window.location.reload());

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <p className="text-sm text-red-600">{message}</p>
      <Button
        variant="destructive"
        onClick={handleRetry}>
        {label}
      </Button>
    </div>
  );
}