"use client";

import { useCallback, useEffect, useState } from "react";
import { DollarSign, PieChart, RefreshCw } from "lucide-react";

import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Card, 
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface PortfolioAllocationResponse {
	status: string;
	allocation?: {
		weights_percent?: Record<string, number>;
	};
}

interface PortfolioAllocationProps {
	symbols?: string[];
	totalInvestment?: number;
}

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA", "GOOGL"];

export default function PortfolioAllocation({
	symbols = DEFAULT_SYMBOLS,
	totalInvestment = 10000,
}: PortfolioAllocationProps) {
	const [allocation, setAllocation] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAllocation = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await apiClient.post<PortfolioAllocationResponse>(
				"/portfolio/portfolio/optimize",
				{
					symbols,
					total_investment: totalInvestment,
				},
			);

			setAllocation(response.data.allocation?.weights_percent ?? {});
		} catch {
			setAllocation({});
			setError("Không thể tải dữ liệu phân bổ vốn.");
		} finally {
			setLoading(false);
		}
	}, [symbols, totalInvestment]);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			void fetchAllocation();
		}, 0);

		return () => window.clearTimeout(timer);
	}, [fetchAllocation]);

	const allocationRows = Object.entries(allocation);
	const totalAllocated = allocationRows.reduce(
		(total, [, weight]) => total + weight,
		0,
	);
	const symbolColors = [
		"bg-sky-500",
		"bg-emerald-500",
		"bg-amber-500",
		"bg-rose-500",
		"bg-violet-500",
	];

	return (
		<Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
			<CardHeader className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-5 text-white">
				<div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-2xl" />
				<div className="relative flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/25">
							<PieChart className="h-5 w-5" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold tracking-tight">
								Portfolio Allocation
							</CardTitle>
							<p className="mt-1 text-xs text-slate-300">
								Phân bổ vốn theo điểm số và mức rủi ro
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={fetchAllocation}
						disabled={loading}
						aria-label="Làm mới phân bổ vốn"
						title="Làm mới phân bổ vốn"
						className="text-slate-300 hover:bg-white/10 hover:text-white"
					>
						<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
					</Button>
				</div>
				<div className="relative mt-5 flex items-end justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.16em] text-slate-400">
							Tổng vốn đầu tư
						</p>
						<div className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
							<DollarSign className="h-5 w-5 text-cyan-300" />
							{totalInvestment.toLocaleString("en-US")}
						</div>
					</div>
					{!loading && allocationRows.length > 0 && (
						<div className="text-right">
							<p className="text-xs text-slate-400">Đã phân bổ</p>
							<p className="mt-1 text-lg font-semibold text-cyan-300">
								{totalAllocated.toFixed(2)}%
							</p>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-0">
				{loading ? (
					<div className="space-y-4 p-6">
						{[1, 2, 3, 4].map((item) => (
							<div key={item} className="space-y-2">
								<div className="flex justify-between">
									<div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
									<div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
								</div>
								<div className="h-2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="flex items-center justify-between gap-4 p-6">
						<p className="text-sm text-destructive">{error}</p>
						<Button variant="outline" size="sm" onClick={fetchAllocation}>
							Thử lại
						</Button>
					</div>
				) : allocationRows.length === 0 ? (
					<p className="p-6 text-sm text-muted-foreground">
						Chưa có dữ liệu phân bổ vốn.
					</p>
				) : (
					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						{allocationRows.map(([symbol, weight], index) => (
							<div
								key={symbol}
								className="group px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
							>
								<div className="flex items-center justify-between gap-4">
									<div className="flex min-w-0 items-center gap-3">
										<div
											className={`h-9 w-1.5 rounded-full ${symbolColors[index % symbolColors.length]}`}
										/>
										<div>
											<p className="font-bold text-slate-900 dark:text-slate-100">
												{symbol}
											</p>
											<p className="text-xs text-muted-foreground">
												Phân bổ mục tiêu
											</p>
										</div>
									</div>
									<span className="text-lg font-bold text-slate-900 dark:text-white">
										{weight.toFixed(2)}%
									</span>
								</div>
								<div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
									<div
										className={`h-full rounded-full transition-all duration-700 ${symbolColors[index % symbolColors.length]}`}
										style={{ width: `${Math.min(weight, 100)}%` }}
									/>
								</div>
							</div>  
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}