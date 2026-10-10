import React from 'react';
import ReactECharts from 'echarts-for-react';
import { OrderBookSnapshot } from '../types';

interface DepthChartProps {
  snapshot: OrderBookSnapshot | null;
}

export const DepthChart: React.FC<DepthChartProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-center h-64 text-slate-500">
        Waiting for depth data...
      </div>
    );
  }

  // Calculate cumulative bid depth (starting from highest bid descending)
  const bidsSorted = [...snapshot.bids].sort((a, b) => b.priceTicks - a.priceTicks);
  let cumBid = 0;
  const bidPoints: [number, number][] = [];
  for (const b of bidsSorted) {
    cumBid += b.totalQuantity;
    bidPoints.push([b.priceTicks / 100, cumBid]);
  }
  bidPoints.reverse();

  // Calculate cumulative ask depth (starting from lowest ask ascending)
  const asksSorted = [...snapshot.asks].sort((a, b) => a.priceTicks - b.priceTicks);
  let cumAsk = 0;
  const askPoints: [number, number][] = [];
  for (const a of asksSorted) {
    cumAsk += a.totalQuantity;
    askPoints.push([a.priceTicks / 100, cumAsk]);
  }

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 45,
      right: 20,
      top: 30,
      bottom: 25,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 17, 32, 0.85)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      textStyle: { color: '#f8fafc', fontSize: 11 },
      extraCssText: 'backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);',
      formatter: (params: any) => {
        if (!params || !params.length) return '';
        const item = params[0];
        return `Price: <strong>₹${item.value[0].toFixed(2)}</strong><br/>Cumulative Volume: <strong>${item.value[1].toLocaleString()} shares</strong>`;
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: (val: number) => `₹${val.toFixed(1)}`,
      },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
    },
    series: [
      {
        name: 'Bids (Cumulative)',
        type: 'line',
        step: 'end',
        data: bidPoints,
        lineStyle: { color: '#10b981', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.5)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
            ]
          }
        },
        symbol: 'none',
      },
      {
        name: 'Asks (Cumulative)',
        type: 'line',
        step: 'start',
        data: askPoints,
        lineStyle: { color: '#f43f5e', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(244, 63, 94, 0.5)' },
              { offset: 1, color: 'rgba(244, 63, 94, 0.02)' }
            ]
          }
        },
        symbol: 'none',
      },
    ],
  };

  return (
    <div className="glass-panel p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.06]">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>Market Depth Liquidity Curve</span>
        </h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-1 bg-emerald-400 inline-block rounded-full"></span> Bids Depth
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="w-2 h-1 bg-rose-400 inline-block rounded-full"></span> Asks Depth
          </span>
        </div>
      </div>
      <div className="h-56 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
      </div>
    </div>
  );
};
