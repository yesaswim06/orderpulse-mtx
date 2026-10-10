import React from 'react';
import { CandleData } from '../../data/mockFnO';

interface CandleMiniProps {
  candles: CandleData[];
  width?: number;
  height?: number;
}

export const CandleMini: React.FC<CandleMiniProps> = ({
  candles,
  width = 120,
  height = 50,
}) => {
  const minVal = Math.min(...candles.map((c) => c.low));
  const maxVal = Math.max(...candles.map((c) => c.high));
  const range = maxVal - minVal || 1;

  const scaleY = (val: number) => {
    return height - ((val - minVal) / range) * (height - 8) - 4;
  };

  const candleWidth = Math.max(width / candles.length - 3, 4);

  return (
    <svg width={width} height={height} className="overflow-visible">
      {candles.map((c, i) => {
        const isUp = c.close >= c.open;
        const color = isUp ? '#00B386' : '#EB5B3C';
        const x = i * (width / candles.length) + (width / candles.length - candleWidth) / 2;
        const yTop = scaleY(Math.max(c.open, c.close));
        const yBottom = scaleY(Math.min(c.open, c.close));
        const bodyHeight = Math.max(yBottom - yTop, 2);
        const wickX = x + candleWidth / 2;
        const wickHighY = scaleY(c.high);
        const wickLowY = scaleY(c.low);

        return (
          <g key={i}>
            {/* High/Low Wick */}
            <line
              x1={wickX}
              y1={wickHighY}
              x2={wickX}
              y2={wickLowY}
              stroke={color}
              strokeWidth="1.2"
            />
            {/* Candle Body */}
            <rect
              x={x}
              y={yTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              rx="1"
            />
          </g>
        );
      })}
    </svg>
  );
};
