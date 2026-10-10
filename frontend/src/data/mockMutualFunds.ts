export interface FundItem {
  id: string;
  name: string;
  category: string;
  returns3Y: string;
  risk: string;
  rating: number;
  logoBg: string;
  logoText: string;
}

export const POPULAR_FUNDS: FundItem[] = [
  {
    id: 'fund-1',
    name: 'SBI Gold Direct Plan-Growth',
    category: 'Commodities · Gold',
    returns3Y: '+35.75%',
    risk: 'Moderate',
    rating: 5,
    logoBg: 'bg-blue-600',
    logoText: 'SBI',
  },
  {
    id: 'fund-2',
    name: 'Bandhan Small Cap Fund',
    category: 'Equity · Small Cap',
    returns3Y: '+22.06%',
    risk: 'Very High',
    rating: 4,
    logoBg: 'bg-emerald-600',
    logoText: 'BF',
  },
  {
    id: 'fund-3',
    name: 'Motilal Oswal Midcap Fund',
    category: 'Equity · Mid Cap',
    returns3Y: '+17.30%',
    risk: 'High',
    rating: 5,
    logoBg: 'bg-amber-600',
    logoText: 'MO',
  },
  {
    id: 'fund-4',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Equity · Flexi Cap',
    returns3Y: '+11.75%',
    risk: 'Moderate High',
    rating: 5,
    logoBg: 'bg-purple-600',
    logoText: 'PP',
  },
];

export const FUND_COLLECTIONS = [
  { id: 'c1', title: 'High return', icon: 'TrendingUp', color: 'text-emerald-500 bg-emerald-50' },
  { id: 'c2', title: 'SIP with ₹100', icon: 'Coins', color: 'text-blue-500 bg-blue-50' },
  { id: 'c3', title: 'Gold & Silver', icon: 'Sparkles', color: 'text-amber-500 bg-amber-50' },
  { id: 'c4', title: 'Large Cap', icon: 'Building2', color: 'text-indigo-500 bg-indigo-50' },
  { id: 'c5', title: 'Mid Cap', icon: 'BarChart2', color: 'text-teal-500 bg-teal-50' },
  { id: 'c6', title: 'Small Cap', icon: 'Rocket', color: 'text-rose-500 bg-rose-50' },
];

export const FUNDS_BY_GROWCLONE: FundItem[] = [
  {
    id: 'g-fund-1',
    name: 'GrowClone Nifty 50 Index Fund',
    category: 'Index · Large Cap',
    returns3Y: '+15.20%',
    risk: 'Moderate',
    rating: 5,
    logoBg: 'bg-emerald-500',
    logoText: 'GC',
  },
  {
    id: 'g-fund-2',
    name: 'GrowClone Total Market Fund',
    category: 'Equity · Multi Cap',
    returns3Y: '+18.45%',
    risk: 'High',
    rating: 4,
    logoBg: 'bg-teal-600',
    logoText: 'TM',
  },
  {
    id: 'g-fund-3',
    name: 'GrowClone Gold ETF FoF',
    category: 'Commodities · Gold',
    returns3Y: '+24.10%',
    risk: 'Moderate',
    rating: 5,
    logoBg: 'bg-amber-500',
    logoText: 'GL',
  },
  {
    id: 'g-fund-4',
    name: 'GrowClone Overnight Liquid Fund',
    category: 'Debt · Overnight',
    returns3Y: '+6.80%',
    risk: 'Low',
    rating: 5,
    logoBg: 'bg-indigo-500',
    logoText: 'LQ',
  },
];

export const MF_PRODUCTS = [
  { id: 'mf-1', name: 'NFO Live', pill: '8 open', icon: 'Radio' },
  { id: 'mf-2', name: 'Import External Funds', icon: 'Download' },
  { id: 'mf-3', name: 'File Tax (ITR 2 & 3)', icon: 'FileSpreadsheet' },
  { id: 'mf-4', name: 'Compare Funds', icon: 'GitCompare' },
];
