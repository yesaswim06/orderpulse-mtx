export interface Bond {
  id: string;
  issuer: string;
  logo: string;
  maturity: string;
  yieldPercent: string;
  tenure: string;
  rating: string;
  ratingColor: 'orange' | 'green';
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

export interface FOCard {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  candles: { open: number; close: number; high: number; low: number; isUp: boolean }[];
}

export interface MutualFundItem {
  id: string;
  name: string;
  logo: string;
  category: string;
  returns3Y: string;
  aum?: string;
  rating?: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  logo: string;
  maskedAccount: string;
  fullAccount: string;
  ifsc: string;
  branch: string;
  isPrimary: boolean;
  status: 'Verified' | 'Pending';
}

export interface SupportCategory {
  id: string;
  label: string;
  iconName: string;
  hasSubpage?: boolean;
}

export const TICKER_DATA = [
  { name: 'NIFTY 50', price: '22,520.45', change: '+288.65', percent: '+1.30%', isUp: true },
  { name: 'SENSEX', price: '72,472.33', change: '+879.09', percent: '+1.23%', isUp: true },
  { name: 'BANK NIFTY', price: '55,256.65', change: '+741.60', percent: '+1.36%', isUp: true },
  { name: 'MIDCPNIFTY', price: '13,591.35', change: '+204.60', percent: '+1.53%', isUp: true },
  { name: 'FINNIFTY', price: '24,968.50', change: '+182.20', percent: '+0.73%', isUp: true },
  { name: 'DEMO / INR (MTX)', price: '₹100.00', change: '+0.00', percent: '±5% Band', isUp: true },
];

export const POPULAR_BONDS: Bond[] = [
  {
    id: 'bond-1',
    issuer: 'Akara Capital Advisors',
    logo: 'AC',
    maturity: "Jun '28",
    yieldPercent: '14.00%',
    tenure: '20 months',
    rating: 'BBB+',
    ratingColor: 'orange',
  },
  {
    id: 'bond-2',
    issuer: 'Keertana Finserv Ltd.',
    logo: 'KF',
    maturity: "Dec '27",
    yieldPercent: '12.10%',
    tenure: '18 months',
    rating: 'A-',
    ratingColor: 'green',
  },
  {
    id: 'bond-3',
    issuer: 'Profectus Capital Pvt. Ltd.',
    logo: 'PC',
    maturity: "Mar '29",
    yieldPercent: '10.45%',
    tenure: '36 months',
    rating: 'A+',
    ratingColor: 'green',
  },
  {
    id: 'bond-4',
    issuer: 'Capri Global Capital Ltd.',
    logo: 'CG',
    maturity: "Nov '28",
    yieldPercent: '9.20%',
    tenure: '24 months',
    rating: 'AA+',
    ratingColor: 'green',
  },
];

export const MOST_BOUGHT_STOCKS: StockItem[] = [
  {
    id: 'stock-1',
    symbol: 'NSE',
    name: 'National Stock Exchange',
    logo: 'NSE',
    price: 1730.90,
    change: 6.30,
    changePercent: 0.37,
    isPositive: true,
  },
  {
    id: 'stock-2',
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    logo: 'TS',
    price: 173.80,
    change: 1.84,
    changePercent: 1.07,
    isPositive: true,
  },
  {
    id: 'stock-3',
    symbol: 'DEMO',
    name: 'OrderPulse Continuous Auction',
    logo: 'OP',
    price: 100.00,
    change: 2.10,
    changePercent: 2.14,
    isPositive: true,
  },
  {
    id: 'stock-4',
    symbol: 'CUPID',
    name: 'Cupid Limited',
    logo: 'CP',
    price: 366.10,
    change: 9.45,
    changePercent: 2.65,
    isPositive: true,
  },
  {
    id: 'stock-5',
    symbol: 'UNIONBANK',
    name: 'Union Bank of India',
    logo: 'UB',
    price: 173.06,
    change: 1.55,
    changePercent: 0.90,
    isPositive: true,
  },
];

export const PRODUCTS_AND_TOOLS = [
  { id: 'ipo', label: 'IPO', pill: '0 open', icon: 'Coins' },
  { id: 'bonds', label: 'Bonds', icon: 'Landmark' },
  { id: 'etfs', label: 'ETFs', icon: 'Layers' },
  { id: 'screener', label: 'Intraday Screener', icon: 'Search' },
  { id: 'terminal', label: 'OrderPulse Matching Terminal', pill: 'C++20 Engine', icon: 'Zap' },
];

export const FO_TOP_TRADED: FOCard[] = [
  {
    id: 'fo-1',
    symbol: 'NIFTY 50',
    name: 'NIFTY 50 Index',
    price: '22,520.45',
    change: '+288.65',
    changePercent: '+1.30%',
    isPositive: true,
    candles: [
      { open: 20, close: 26, high: 28, low: 18, isUp: true },
      { open: 26, close: 24, high: 27, low: 22, isUp: false },
      { open: 24, close: 30, high: 32, low: 23, isUp: true },
      { open: 30, close: 34, high: 36, low: 29, isUp: true },
      { open: 34, close: 31, high: 35, low: 28, isUp: false },
      { open: 31, close: 38, high: 40, low: 30, isUp: true },
      { open: 38, close: 42, high: 44, low: 37, isUp: true },
      { open: 42, close: 40, high: 43, low: 38, isUp: false },
      { open: 40, close: 48, high: 50, low: 39, isUp: true },
      { open: 48, close: 52, high: 55, low: 46, isUp: true },
    ],
  },
  {
    id: 'fo-2',
    symbol: 'SENSEX',
    name: 'BSE SENSEX',
    price: '72,472.33',
    change: '+879.09',
    changePercent: '+1.23%',
    isPositive: true,
    candles: [
      { open: 18, close: 22, high: 25, low: 15, isUp: true },
      { open: 22, close: 28, high: 30, low: 20, isUp: true },
      { open: 28, close: 25, high: 29, low: 23, isUp: false },
      { open: 25, close: 33, high: 35, low: 24, isUp: true },
      { open: 33, close: 39, high: 42, low: 31, isUp: true },
      { open: 39, close: 36, high: 40, low: 34, isUp: false },
      { open: 36, close: 45, high: 47, low: 35, isUp: true },
      { open: 45, close: 48, high: 51, low: 43, isUp: true },
      { open: 48, close: 54, high: 57, low: 47, isUp: true },
      { open: 54, close: 58, high: 60, low: 52, isUp: true },
    ],
  },
  {
    id: 'fo-3',
    symbol: 'BANK NIFTY',
    name: 'NIFTY Bank Index',
    price: '55,256.65',
    change: '+741.60',
    changePercent: '+1.36%',
    isPositive: true,
    candles: [
      { open: 15, close: 22, high: 24, low: 14, isUp: true },
      { open: 22, close: 20, high: 23, low: 18, isUp: false },
      { open: 20, close: 28, high: 30, low: 19, isUp: true },
      { open: 28, close: 35, high: 37, low: 27, isUp: true },
      { open: 35, close: 32, high: 36, low: 30, isUp: false },
      { open: 32, close: 40, high: 42, low: 31, isUp: true },
      { open: 40, close: 44, high: 46, low: 39, isUp: true },
      { open: 44, close: 49, high: 52, low: 42, isUp: true },
      { open: 49, close: 53, high: 56, low: 48, isUp: true },
      { open: 53, close: 57, high: 59, low: 51, isUp: true },
    ],
  },
  {
    id: 'fo-4',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: '₹2,156.00',
    change: '+80.00',
    changePercent: '+3.85%',
    isPositive: true,
    candles: [
      { open: 22, close: 26, high: 28, low: 20, isUp: true },
      { open: 26, close: 30, high: 32, low: 24, isUp: true },
      { open: 30, close: 28, high: 31, low: 27, isUp: false },
      { open: 28, close: 36, high: 38, low: 27, isUp: true },
      { open: 36, close: 42, high: 45, low: 35, isUp: true },
      { open: 42, close: 48, high: 50, low: 41, isUp: true },
      { open: 48, close: 46, high: 49, low: 44, isUp: false },
      { open: 46, close: 54, high: 56, low: 45, isUp: true },
      { open: 54, close: 58, high: 60, low: 52, isUp: true },
      { open: 58, close: 64, high: 66, low: 57, isUp: true },
    ],
  },
  {
    id: 'fo-5',
    symbol: 'HDFC BANK',
    name: 'HDFC Bank Ltd.',
    price: '₹707.25',
    change: '+15.00',
    changePercent: '+2.17%',
    isPositive: true,
    candles: [
      { open: 20, close: 24, high: 26, low: 18, isUp: true },
      { open: 24, close: 28, high: 30, low: 22, isUp: true },
      { open: 28, close: 26, high: 29, low: 24, isUp: false },
      { open: 26, close: 32, high: 34, low: 25, isUp: true },
      { open: 32, close: 38, high: 40, low: 30, isUp: true },
      { open: 38, close: 36, high: 39, low: 34, isUp: false },
      { open: 36, close: 42, high: 44, low: 35, isUp: true },
      { open: 42, close: 46, high: 48, low: 40, isUp: true },
      { open: 46, close: 50, high: 52, low: 44, isUp: true },
      { open: 50, close: 55, high: 58, low: 49, isUp: true },
    ],
  },
  {
    id: 'fo-6',
    symbol: 'DMART',
    name: 'Avenue Supermarts Ltd.',
    price: '₹3,516.80',
    change: '-68.20',
    changePercent: '-1.90%',
    isPositive: false,
    candles: [
      { open: 55, close: 50, high: 57, low: 48, isUp: false },
      { open: 50, close: 46, high: 52, low: 44, isUp: false },
      { open: 46, close: 48, high: 50, low: 45, isUp: true },
      { open: 48, close: 42, high: 49, low: 40, isUp: false },
      { open: 42, close: 38, high: 43, low: 36, isUp: false },
      { open: 38, close: 34, high: 39, low: 32, isUp: false },
      { open: 34, close: 36, high: 38, low: 33, isUp: true },
      { open: 36, close: 30, high: 37, low: 28, isUp: false },
      { open: 30, close: 26, high: 31, low: 24, isUp: false },
      { open: 26, close: 22, high: 28, low: 20, isUp: false },
    ],
  },
];

export const POPULAR_FUNDS: MutualFundItem[] = [
  {
    id: 'fund-1',
    name: 'SBI Gold Direct Plan-Growth',
    logo: 'SBI',
    category: 'Commodities · Gold',
    returns3Y: '+35.75%',
    aum: '₹4,820 Cr',
    rating: 5,
  },
  {
    id: 'fund-2',
    name: 'Bandhan Small Cap Fund Direct-Growth',
    logo: 'BD',
    category: 'Equity · Small Cap',
    returns3Y: '+22.06%',
    aum: '₹8,140 Cr',
    rating: 5,
  },
  {
    id: 'fund-3',
    name: 'Motilal Oswal Midcap Fund Direct-Growth',
    logo: 'MO',
    category: 'Equity · Mid Cap',
    returns3Y: '+17.30%',
    aum: '₹14,290 Cr',
    rating: 4,
  },
  {
    id: 'fund-4',
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    logo: 'PP',
    category: 'Equity · Flexi Cap',
    returns3Y: '+11.75%',
    aum: '₹62,400 Cr',
    rating: 5,
  },
];

export const FUND_COLLECTIONS = [
  { id: 'high-return', label: 'High return', icon: 'TrendingUp', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'sip-100', label: 'SIP with ₹100', icon: 'PiggyBank', color: 'bg-blue-50 text-blue-600' },
  { id: 'gold-silver', label: 'Gold & Silver', icon: 'Coins', color: 'bg-amber-50 text-amber-600' },
  { id: 'large-cap', label: 'Large Cap', icon: 'Building2', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'mid-cap', label: 'Mid Cap', icon: 'Building', color: 'bg-purple-50 text-purple-600' },
  { id: 'small-cap', label: 'Small Cap', icon: 'Home', color: 'bg-rose-50 text-rose-600' },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'INDUSIND BANK',
    logo: 'IB',
    maskedAccount: 'XXXX2231',
    fullAccount: 'XXXXXXXX2231',
    ifsc: 'INDB0000099',
    branch: 'ANDHERI (EAST), MUMBAI',
    isPrimary: true,
    status: 'Verified',
  },
  {
    id: 'bank-2',
    bankName: 'KOTAK MAHINDRA BANK',
    logo: 'KM',
    maskedAccount: 'XXXX4434',
    fullAccount: 'XXXXXXXX4434',
    ifsc: 'KKBK0000123',
    branch: 'NARIMAN POINT, MUMBAI',
    isPrimary: false,
    status: 'Verified',
  },
];

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  { id: 'most-asked', label: 'Most Asked', iconName: 'HelpCircle' },
  { id: 'my-account', label: 'My Account', iconName: 'User', hasSubpage: true },
  { id: 'stocks', label: 'Stocks & Trading', iconName: 'TrendingUp' },
  { id: 'fo', label: 'F&O Derivatives', iconName: 'BarChart2' },
  { id: 'matching-engine', label: 'OrderPulse Matching Engine & Breaker', iconName: 'Zap' },
  { id: 'payments', label: 'Payments & Withdrawals', iconName: 'CreditCard' },
  { id: 'mutual-funds', label: 'Mutual Funds', iconName: 'PieChart' },
  { id: 'loans', label: 'Loans & Margin', iconName: 'DollarSign' },
  { id: 'fds', label: 'Fixed Deposits', iconName: 'Lock' },
  { id: 'us-stocks', label: 'US Stocks', iconName: 'Globe' },
];

export const MY_ACCOUNT_SUBITEMS = [
  {
    id: 'kyc',
    title: 'KYC & Verification',
    subtitle: 'Documents - eSign - PAN status',
    iconName: 'Fingerprint',
  },
  {
    id: 'account',
    title: 'OrderPulse Account',
    subtitle: 'Login - Password - Mobile No.',
    iconName: 'UserCheck',
  },
  {
    id: 'bank-accounts',
    title: 'Bank Accounts & Autopay',
    subtitle: 'Primary Bank - NEFT - Bank verification',
    iconName: 'Landmark',
  },
  {
    id: 'matching-limits',
    title: 'Engine Risk Limits & Breakers',
    subtitle: '±5% Dynamic Collar - Cooldown Policy - API Keys',
    iconName: 'Shield',
  },
  {
    id: 'demat',
    title: 'Other Demat Accounts',
    subtitle: 'Demat account for HUF, Minor, Corporate & Partnership',
    iconName: 'Users',
  },
  {
    id: 'nri',
    title: 'NRI Accounts',
    subtitle: 'NRI Onboarding & FEMA compliance',
    iconName: 'Globe',
  },
];
