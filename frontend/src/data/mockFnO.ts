export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FnOContract {
  id: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  candles: CandleData[];
}

export const TOP_TRADED_FNO: FnOContract[] = [
  {
    id: 'fno-1',
    name: 'NIFTY 50',
    price: '22,520.45',
    change: '+288.65',
    changePercent: '+1.30%',
    isPositive: true,
    candles: [
      { open: 20, high: 28, low: 18, close: 25 },
      { open: 25, high: 30, low: 22, close: 24 },
      { open: 24, high: 32, low: 23, close: 31 },
      { open: 31, high: 35, low: 29, close: 30 },
      { open: 30, high: 38, low: 28, close: 36 },
      { open: 36, high: 42, low: 34, close: 40 },
      { open: 40, high: 44, low: 38, close: 39 },
      { open: 39, high: 46, low: 37, close: 45 },
      { open: 45, high: 50, low: 43, close: 48 },
      { open: 48, high: 53, low: 46, close: 51 },
      { open: 51, high: 56, low: 49, close: 54 },
      { open: 54, high: 60, low: 52, close: 58 },
    ],
  },
  {
    id: 'fno-2',
    name: 'SENSEX',
    price: '72,472.33',
    change: '+879.09',
    changePercent: '+1.23%',
    isPositive: true,
    candles: [
      { open: 22, high: 29, low: 20, close: 27 },
      { open: 27, high: 31, low: 25, close: 29 },
      { open: 29, high: 35, low: 27, close: 33 },
      { open: 33, high: 36, low: 31, close: 32 },
      { open: 32, high: 40, low: 30, close: 38 },
      { open: 38, high: 43, low: 36, close: 42 },
      { open: 42, high: 45, low: 40, close: 41 },
      { open: 41, high: 47, low: 39, close: 46 },
      { open: 46, high: 52, low: 44, close: 49 },
      { open: 49, high: 54, low: 47, close: 53 },
      { open: 53, high: 58, low: 51, close: 56 },
      { open: 56, high: 62, low: 54, close: 60 },
    ],
  },
  {
    id: 'fno-3',
    name: 'BANK NIFTY',
    price: '55,256.65',
    change: '+741.60',
    changePercent: '+1.36%',
    isPositive: true,
    candles: [
      { open: 18, high: 26, low: 16, close: 24 },
      { open: 24, high: 30, low: 22, close: 28 },
      { open: 28, high: 34, low: 26, close: 32 },
      { open: 32, high: 37, low: 30, close: 35 },
      { open: 35, high: 42, low: 33, close: 40 },
      { open: 40, high: 44, low: 38, close: 41 },
      { open: 41, high: 48, low: 39, close: 47 },
      { open: 47, high: 52, low: 45, close: 50 },
      { open: 50, high: 55, low: 48, close: 53 },
      { open: 53, high: 58, low: 51, close: 57 },
      { open: 57, high: 62, low: 55, close: 59 },
      { open: 59, high: 66, low: 57, close: 64 },
    ],
  },
  {
    id: 'fno-4',
    name: 'TCS',
    price: '₹2,156.00',
    change: '+80.00',
    changePercent: '+3.85%',
    isPositive: true,
    candles: [
      { open: 20, high: 25, low: 18, close: 23 },
      { open: 23, high: 28, low: 21, close: 27 },
      { open: 27, high: 33, low: 25, close: 31 },
      { open: 31, high: 36, low: 29, close: 34 },
      { open: 34, high: 40, low: 32, close: 38 },
      { open: 38, high: 43, low: 36, close: 42 },
      { open: 42, high: 47, low: 40, close: 45 },
      { open: 45, high: 51, low: 43, close: 49 },
      { open: 49, high: 55, low: 47, close: 53 },
      { open: 53, high: 58, low: 51, close: 56 },
      { open: 56, high: 62, low: 54, close: 60 },
      { open: 60, high: 68, low: 58, close: 66 },
    ],
  },
  {
    id: 'fno-5',
    name: 'HDFC Bank',
    price: '₹707.25',
    change: '+15.00',
    changePercent: '+2.17%',
    isPositive: true,
    candles: [
      { open: 25, high: 30, low: 22, close: 28 },
      { open: 28, high: 32, low: 26, close: 30 },
      { open: 30, high: 36, low: 28, close: 34 },
      { open: 34, high: 38, low: 32, close: 36 },
      { open: 36, high: 41, low: 34, close: 39 },
      { open: 39, high: 44, low: 37, close: 42 },
      { open: 42, high: 46, low: 40, close: 44 },
      { open: 44, high: 48, low: 42, close: 47 },
      { open: 47, high: 52, low: 45, close: 50 },
      { open: 50, high: 54, low: 48, close: 52 },
      { open: 52, high: 57, low: 50, close: 55 },
      { open: 55, high: 60, low: 53, close: 58 },
    ],
  },
  {
    id: 'fno-6',
    name: 'Avenue Supermarts',
    price: '₹3,516.80',
    change: '-68.20',
    changePercent: '-1.90%',
    isPositive: false,
    candles: [
      { open: 58, high: 62, low: 54, close: 55 },
      { open: 55, high: 58, low: 50, close: 52 },
      { open: 52, high: 55, low: 48, close: 49 },
      { open: 49, high: 52, low: 45, close: 46 },
      { open: 46, high: 48, low: 42, close: 43 },
      { open: 43, high: 46, low: 39, close: 40 },
      { open: 40, high: 43, low: 36, close: 38 },
      { open: 38, high: 41, low: 34, close: 35 },
      { open: 35, high: 38, low: 30, close: 32 },
      { open: 32, high: 35, low: 28, close: 29 },
      { open: 29, high: 32, low: 25, close: 26 },
      { open: 26, high: 29, low: 22, close: 24 },
    ],
  },
];

export const FNO_PRODUCTS = [
  { id: 'fno-p1', name: 'GrowClone API', desc: 'Algo trading & webhooks', icon: 'Code' },
  { id: 'fno-p2', name: 'Commodities Expiry Calendar', desc: 'MCX contracts', icon: 'Calendar' },
  { id: 'fno-p3', name: 'Option Chain Analytics', desc: 'Greeks & OI matrix', icon: 'Layers' },
];
