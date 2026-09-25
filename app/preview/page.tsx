"use client";

import { AppSidebar } from "@/components/app-sidebar";
import PriceMatrixPreview from "@/components/PriceMatrixPreview";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function PreviewPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Price Matrix Preview
            </h1>

            <p className="mt-2 text-muted-foreground">
              Preview dữ liệu giá cổ phiếu
            </p>
          </div>

          <PriceMatrixPreview />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}