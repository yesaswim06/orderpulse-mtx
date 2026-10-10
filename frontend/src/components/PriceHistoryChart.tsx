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

  const dataPoints = trades.slice(0, 40).reverse().map((t) => {
    const d = new Date(t.timestampNs / 1_000_000);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`;
    return [timeStr, t.priceTicks / 100, t.quantity];
  });

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
      backgroundColor: 'rgba(11, 17, 32, 0.85)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      textStyle: { color: '#f8fafc', fontSize: 11 },
      extraCssText: 'backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);',
      formatter: (params: any) => {
        if (!params || !params.length) return '';
        const item = params[0];
        return `Time: ${item.name}<br/>Execution Price: <strong>₹${item.value[1].toFixed(2)}</strong><br/>Quantity: <strong>${item.value[2]} shares</strong>`;
      },
    },
    xAxis: {
      type: 'category',
      data: dataPoints.map(p => p[0]),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: Math.floor(lowerBand - 2),
      max: Math.ceil(upperBand + 2),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        formatter: (val: number) => `₹${val.toFixed(0)}`,
      },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
    },
    series: [
      {
        name: 'Execution Price',
        type: 'line',
        data: dataPoints,
        lineStyle: { color: '#38bdf8', width: 2.5, shadowColor: 'rgba(56, 189, 248, 0.5)', shadowBlur: 8 },
        itemStyle: { color: '#38bdf8' },
        showSymbol: true,
        symbolSize: 6,
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              yAxis: upperBand,
              lineStyle: { color: '#f43f5e', type: 'dashed', width: 1.5 },
              label: {
                formatter: `Upper Band: ₹${upperBand.toFixed(2)}`,
                position: 'end',
                color: '#fb7185',
                fontSize: 10,
              },
            },
            {
              yAxis: refPrice,
              lineStyle: { color: 'rgba(255, 255, 255, 0.4)', type: 'solid', width: 1 },
              label: {
                formatter: `Ref: ₹${refPrice.toFixed(2)}`,
                position: 'end',
                color: '#cbd5e1',
                fontSize: 10,
              },
            },
            {
              yAxis: lowerBand,
              lineStyle: { color: '#f43f5e', type: 'dashed', width: 1.5 },
              label: {
                formatter: `Lower Band: ₹${lowerBand.toFixed(2)}`,
                position: 'end',
                color: '#fb7185',
                fontSize: 10,
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Price Execution vs Volatility Bands
        </h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-cyan-400 font-medium">Trade Prints</span>
          <span className="text-rose-400 font-medium">±5% Circuit Breakers</span>
        </div>
      </div>
      <div className="h-56 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
      </div>
    </div>
  );
};
