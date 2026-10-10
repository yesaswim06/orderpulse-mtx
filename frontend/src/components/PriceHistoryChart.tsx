import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Trade, BreakerStatus } from '../types';

interface PriceHistoryChartProps {
  trades: Trade[];
  breaker: BreakerStatus | null;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ trades, breaker }) => {
  const refPrice = breaker ? breaker.referencePriceTicks / 100 : 100.00;
  const lowerBand = breaker ? breaker.lowerBandTicks / 100 : 95.00;
  const upperBand = breaker ? breaker.upperBandTicks / 100 : 105.00;

  // Transform trades into time series [timeStr, price]
  const dataPoints = trades.slice(0, 40).reverse().map((t, idx) => {
    const d = new Date(t.timestampNs / 1_000_000);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`;
    return [timeStr, t.priceTicks / 100, t.quantity];
  });

  // If no trades yet, add an anchor point at reference
  if (dataPoints.length === 0) {
    dataPoints.push(['Anchor', refPrice, 0]);
  }

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 45,
      right: 50,
      top: 30,
      bottom: 25,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#111827',
      borderColor: '#374151',
      textStyle: { color: '#f3f4f6', fontSize: 11 },
      formatter: (params: any) => {
        if (!params || !params.length) return '';
        const item = params[0];
        return `Time: ${item.name}<br/>Price: ₹${item.value[1].toFixed(2)}<br/>Quantity: ${item.value[2]} shares`;
      },
    },
    xAxis: {
      type: 'category',
      data: dataPoints.map(p => p[0]),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: Math.floor(lowerBand - 2),
      max: Math.ceil(upperBand + 2),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: (val: number) => `₹${val.toFixed(0)}`,
      },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        name: 'Execution Price',
        type: 'line',
        data: dataPoints,
        lineStyle: { color: '#38bdf8', width: 2.5 },
        itemStyle: { color: '#38bdf8' },
        showSymbol: true,
        symbolSize: 6,
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              yAxis: upperBand,
              lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
              label: {
                formatter: `Upper Band: ₹${upperBand.toFixed(2)}`,
                position: 'end',
                color: '#f87171',
                fontSize: 10,
              },
            },
            {
              yAxis: refPrice,
              lineStyle: { color: '#94a3b8', type: 'solid', width: 1 },
              label: {
                formatter: `Ref: ₹${refPrice.toFixed(2)}`,
                position: 'end',
                color: '#cbd5e1',
                fontSize: 10,
              },
            },
            {
              yAxis: lowerBand,
              lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
              label: {
                formatter: `Lower Band: ₹${lowerBand.toFixed(2)}`,
                position: 'end',
                color: '#f87171',
                fontSize: 10,
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl p-4 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Price Execution Chart with Volatility Band (Apache ECharts)
        </h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-cyan-400">Trade Prints</span>
          <span className="text-rose-400">±5% Circuit Breakers</span>
        </div>
      </div>
      <div className="h-56 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
      </div>
    </div>
  );
};
