"use client";

import { useEffect, useState } from "react";

type PortfolioData = {
    status: string;
    symbols: string[];
    trading_days: number;
    expected_returns_annual: Record<string, number>;
    volatility_annual: Record<string, number>;
    covariance_matrix: Record<string, Record<string, number>>;
    correlation_matrix: Record<string, Record<string, number>>;
};

export default function PortfolioDataCheck() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(
            "http://127.0.0.1:8000/api/v1/data-pipeline/portfolio-inputs"
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                return response.json();
            })
            .then((result: PortfolioData) => {
                setData(result);
            })
            .catch((err) => {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Không thể kết nối đến API."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
                    <p>Loading portfolio data...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
                    <h1 className="text-2xl font-bold text-red-700">
                        Portfolio Data
                    </h1>
                    <p className="mt-3 text-red-600">{error}</p>
                </div>
            </main>
        );
    }

    if (!data) {
        return null;
    }

    const validSymbols =
        Array.isArray(data.symbols) &&
        data.symbols.length > 0 &&
        data.symbols.every(
            (symbol) =>
                typeof symbol === "string" && symbol.trim().length > 0
        );

    const validReturns =
        validSymbols &&
        data.symbols.every(
            (symbol) =>
                typeof data.expected_returns_annual?.[symbol] === "number" &&
                Number.isFinite(data.expected_returns_annual[symbol])
        );

    const validRisk =
        validSymbols &&
        data.symbols.every(
            (symbol) =>
                typeof data.volatility_annual?.[symbol] === "number" &&
                Number.isFinite(data.volatility_annual[symbol]) &&
                data.volatility_annual[symbol] >= 0
        );

    const validTradingDays =
        typeof data.trading_days === "number" &&
        Number.isInteger(data.trading_days) &&
        data.trading_days > 0;

    const isValid =
        data.status === "success" &&
        validSymbols &&
        validReturns &&
        validRisk &&
        validTradingDays;

    const expectedReturn = validReturns
        ? data.symbols.reduce(
            (total, symbol) =>
                total + data.expected_returns_annual[symbol],
            0
        ) / data.symbols.length
        : 0;

    const risk = validRisk
        ? data.symbols.reduce(
            (total, symbol) =>
                total + data.volatility_annual[symbol],
            0
        ) / data.symbols.length
        : 0;

    return (
        <main className="min-h-screen bg-zinc-50 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl bg-white p-8 shadow">

                    <a
                        href="/"
                        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Quay lại Dashboard
                    </a>

                    <h1 className="text-3xl font-bold text-zinc-900">
                        Portfolio Data
                    </h1>

                    <p className="mt-2 text-zinc-500">
                        Portfolio input data validation
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-zinc-100 p-5">
                            <p className="text-sm text-zinc-500">
                                Number of stocks
                            </p>

                            <p className="mt-2 text-3xl font-bold text-zinc-900">
                                {validSymbols ? data.symbols.length : 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-100 p-5">
                            <p className="text-sm text-zinc-500">
                                Expected Return
                            </p>

                            <p className="mt-2 text-3xl font-bold text-zinc-900">
                                {validReturns ? `${expectedReturn.toFixed(2)}%` : "N/A"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-100 p-5">
                            <p className="text-sm text-zinc-500">
                                Risk
                            </p>

                            <p className="mt-2 text-3xl font-bold text-zinc-900">
                                {validRisk ? `${risk.toFixed(2)}%` : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`mt-6 rounded-xl border p-5 ${isValid
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }`}
                    >
                        <p className="text-sm text-zinc-500">
                            Data status
                        </p>

                        <p
                            className={`mt-1 text-xl font-bold ${isValid
                                    ? "text-green-700"
                                    : "text-red-700"
                                }`}
                        >
                            {isValid ? "Valid" : "Invalid"}
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-zinc-900">
                                Stock Data
                            </h2>

                            <span className="text-sm text-zinc-500">
                                {validTradingDays
                                    ? `${data.trading_days} trading days`
                                    : "Invalid trading days"}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-zinc-200">
                            <table className="w-full">
                                <thead className="bg-zinc-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Symbol
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Expected Return
                                        </th>

                                        <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Risk
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {validSymbols &&
                                        data.symbols.map((symbol) => {
                                            const stockReturn =
                                                data.expected_returns_annual?.[symbol];

                                            const stockRisk =
                                                data.volatility_annual?.[symbol];

                                            return (
                                                <tr
                                                    key={symbol}
                                                    className="border-t border-zinc-200"
                                                >
                                                    <td className="px-4 py-3 font-medium text-zinc-900">
                                                        {symbol}
                                                    </td>

                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {typeof stockReturn === "number" &&
                                                            Number.isFinite(stockReturn)
                                                            ? `${stockReturn.toFixed(2)}%`
                                                            : "Invalid"}
                                                    </td>

                                                    <td className="px-4 py-3 text-zinc-700">
                                                        {typeof stockRisk === "number" &&
                                                            Number.isFinite(stockRisk)
                                                            ? `${stockRisk.toFixed(2)}%`
                                                            : "Invalid"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}