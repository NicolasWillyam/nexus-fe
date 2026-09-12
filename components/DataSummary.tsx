import React, { useEffect, useState } from 'react';

interface SummaryData {
  stocks: number;
  tradingDays: number;
  latestData: string;
  status: string;
}

export default function DataSummary() {
  const [data, setData] = useState<SummaryData>({
    stocks: 20,
    tradingDays: 250,
    latestData: '06/09/2026',
    status: 'Healthy',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/summary')
      .then((res) => res.json())
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch((err) => console.log('Using default mock data', err));
  }, []);

  return (
    <div className="max-w-sm rounded-2xl bg-gray-100 p-6 shadow-md dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        None
      </div>
      <div className="text-xl font-bold tracking-tight mb-6">Nexus Data</div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Stocks</div>
          <div className="text-lg font-semibold">{data.stocks}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Trading Days</div>
          <div className="text-lg font-semibold">{data.tradingDays}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Latest Data</div>
          <div className="text-lg font-semibold">{data.latestData}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {data.status}
          </div>
        </div>
      </div>
    </div>
  );
}