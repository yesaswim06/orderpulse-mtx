import React from 'react';

interface CandleMiniProps {
  candles: { open: number; close: number; high: number; low: number }[];
  width?: number;
  height?: number;
}

export const CandleMini: React.FC<CandleMiniProps> = ({
  candles,
  width = 110,
  height = 42,
}) => {
  const minVal = Math.min(...candles.map((c) => c.low)) * 0.95;
  const maxVal = Math.max(...candles.map((c) => c.high)) * 1.05;
  const range = maxVal - minVal || 1;

  const candleWidth = (width / candles.length) * 0.6;
  const step = width / candles.length;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {candles.map((c, i) => {
        const isUp = c.close >= c.open;
        const color = isUp ? '#00B386' : '#EB5B3C';

        const yHigh = height - ((c.high - minVal) / range) * height;
        const yLow = height - ((c.low - minVal) / range) * height;
        const yOpen = height - ((c.open - minVal) / range) * height;
        const yClose = height - ((c.close - minVal) / range) * height;

        const bodyY = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1.5);
        const xCenter = i * step + step / 2;

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={xCenter}
              y1={yHigh}
              x2={xCenter}
              y2={yLow}
              stroke={color}
              strokeWidth="1.2"
            />
            {/* Real Body */}
            <rect
              x={xCenter - candleWidth / 2}
              y={bodyY}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              rx={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
};
