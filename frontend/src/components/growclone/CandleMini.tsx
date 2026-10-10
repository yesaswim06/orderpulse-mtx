import React from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  isUp: boolean;
}

interface CandleMiniProps {
  candles: Candle[];
  height?: number;
  width?: number;
}

export const CandleMini: React.FC<CandleMiniProps> = ({
  candles,
  height = 54,
  width = 120,
}) => {
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const range = maxPrice - minPrice || 1;

  const scaleY = (val: number) => {
    return height - ((val - minPrice) / range) * (height - 8) - 4;
  };

  const candleWidth = Math.max(3, Math.floor((width - candles.length * 3) / candles.length));

  return (
    <svg width={width} height={height} className="overflow-visible">
      {candles.map((c, i) => {
        const x = i * (candleWidth + 3) + 2;
        const yOpen = scaleY(c.open);
        const yClose = scaleY(c.close);
        const yHigh = scaleY(c.high);
        const yLow = scaleY(c.low);

        const bodyY = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        const color = c.isUp ? '#00B386' : '#EB5B3C';

        return (
          <g key={i}>
            {/* Upper and lower wick */}
            <line
              x1={x + candleWidth / 2}
              y1={yHigh}
              x2={x + candleWidth / 2}
              y2={yLow}
              stroke={color}
              strokeWidth={1}
            />
            {/* Candle body */}
            <rect
              x={x}
              y={bodyY}
              width={candleWidth}
              height={bodyH}
              fill={color}
              rx={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
};
