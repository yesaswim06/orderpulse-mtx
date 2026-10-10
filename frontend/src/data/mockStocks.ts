export interface BondItem {
  id: string;
  issuer: string;
  maturity: string;
  yieldPercent: string;
  tenure: string;
  rating: string;
  ratingColor: 'orange' | 'green';
  logoText: string;
}

export interface StockItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  logoBg: string;
  logoText: string;
}

export interface IndexTicker {
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export const INDEX_TICKERS: IndexTicker[] = [
  { name: 'NIFTY', price: '22,520.45', change: '+288.65', changePercent: '1.30%', isPositive: true },
  { name: 'SENSEX', price: '72,472.33', change: '+879.09', changePercent: '1.23%', isPositive: true },
  { name: 'BANKNIFTY', price: '55,256.65', change: '+741.60', changePercent: '1.36%', isPositive: true },
  { name: 'MIDCPNIFTY', price: '13,591.35', change: '+204.60', changePercent: '1.53%', isPositive: true },
  { name: 'FINNIFTY', price: '24,968.50', change: '+185.20', changePercent: '0.75%', isPositive: true },
];

export const POPULAR_BONDS: BondItem[] = [
  {
    id: 'bond-1',
    issuer: 'Akara Capital Advisors',
    maturity: "Jun '28",
    yieldPercent: '14.00%',
    tenure: '20 months',
    rating: 'BBB+',
    ratingColor: 'orange',
    logoText: 'AC',
  },
  {
    id: 'bond-2',
    issuer: 'Keertana Finserv Ltd.',
    maturity: "Dec '27",
    yieldPercent: '12.10%',
    tenure: '18 months',
    rating: 'A-',
    ratingColor: 'green',
    logoText: 'KF',
  },
  {
    id: 'bond-3',
    issuer: 'Profectus Capital Pvt Ltd',
    maturity: "Mar '29",
    yieldPercent: '10.45%',
    tenure: '36 months',
    rating: 'A+',
    ratingColor: 'green',
    logoText: 'PC',
  },
  {
    id: 'bond-4',
    issuer: 'Capri Global Capital Ltd',
    maturity: "Aug '28",
    yieldPercent: '9.20%',
    tenure: '24 months',
    rating: 'AA+',
    ratingColor: 'green',
    logoText: 'CG',
  },
];

export const MOST_BOUGHT_STOCKS: StockItem[] = [
  {
    id: 'stock-1',
    name: 'NSE Index Fund',
    symbol: 'NSE',
    price: '₹1,730.90',
    change: '+6.30',
    changePercent: '0.37%',
    isPositive: true,
    logoBg: 'bg-indigo-600',
    logoText: 'NSE',
  },
  {
    id: 'stock-2',
    name: 'Tata Steel',
    symbol: 'TATASTEEL',
    price: '₹173.80',
    change: '+1.84',
    changePercent: '1.07%',
    isPositive: true,
    logoBg: 'bg-blue-600',
    logoText: 'TS',
  },
  {
    id: 'stock-3',
    name: 'Cupid Ltd',
    symbol: 'CUPID',
    price: '₹366.10',
    change: '+9.45',
    changePercent: '2.65%',
    isPositive: true,
    logoBg: 'bg-rose-500',
    logoText: 'CP',
  },
  {
    id: 'stock-4',
    name: 'Union Bank of India',
    symbol: 'UNIONBANK',
    price: '₹173.06',
    change: '+1.55',
    changePercent: '0.90%',
    isPositive: true,
    logoBg: 'bg-red-600',
    logoText: 'UB',
  },
];

export const PRODUCTS_AND_TOOLS = [
  { id: 'p1', name: 'IPO', pill: '0 open', icon: 'FileText' },
  { id: 'p2', name: 'Bonds', icon: 'ShieldCheck' },
  { id: 'p3', name: 'ETFs', icon: 'Layers' },
  { id: 'p4', name: 'Intraday Screener', icon: 'Search' },
  { id: 'p5', name: 'Stock SIP', icon: 'Repeat' },
  { id: 'p6', name: 'MTF (Pay Later)', icon: 'Clock' },
];
