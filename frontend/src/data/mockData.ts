export interface IndexItem {
  symbol: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
}

export const TICKER_INDICES: IndexItem[] = [
  { symbol: "NIFTY", price: "22,520.45", change: "+288.65", percent: "1.30%", isPositive: true },
  { symbol: "SENSEX", price: "72,472.33", change: "+879.09", percent: "1.23%", isPositive: true },
  { symbol: "BANKNIFTY", price: "55,256.65", change: "+741.60", percent: "1.36%", isPositive: true },
  { symbol: "MIDCPNIFTY", price: "13,591.35", change: "+204.60", percent: "1.53%", isPositive: true },
  { symbol: "FINNIFTY", price: "24,968.50", change: "+312.40", percent: "1.27%", isPositive: true },
];

export interface BondItem {
  id: string;
  name: string;
  issuer: string;
  maturity: string;
  yieldPercent: string;
  tenure: string;
  rating: string;
  ratingColor: "orange" | "green";
  logoColor: string;
}

export const POPULAR_BONDS: BondItem[] = [
  {
    id: "bond-1",
    name: "Akara Capital",
    issuer: "Akara Capital Advisors",
    maturity: "Jun '28",
    yieldPercent: "14.00%",
    tenure: "20 months",
    rating: "BBB+",
    ratingColor: "orange",
    logoColor: "bg-orange-500",
  },
  {
    id: "bond-2",
    name: "Keertana Finserv",
    issuer: "Keertana Finserv Ltd.",
    maturity: "Aug '27",
    yieldPercent: "12.10%",
    tenure: "18 months",
    rating: "A-",
    ratingColor: "green",
    logoColor: "bg-emerald-600",
  },
  {
    id: "bond-3",
    name: "Profectus Capital",
    issuer: "Profectus Capital Private Limited",
    maturity: "Dec '28",
    yieldPercent: "10.45%",
    tenure: "24 months",
    rating: "A+",
    ratingColor: "green",
    logoColor: "bg-indigo-600",
  },
  {
    id: "bond-4",
    name: "Capri Global",
    issuer: "Capri Global Capital Ltd.",
    maturity: "Mar '29",
    yieldPercent: "9.20%",
    tenure: "36 months",
    rating: "AA+",
    ratingColor: "green",
    logoColor: "bg-blue-600",
  },
];

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
  logoText: string;
  logoBg: string;
}

export const MOST_BOUGHT_STOCKS: StockItem[] = [
  {
    id: "nse",
    symbol: "NSE",
    name: "National Stock Exchange",
    price: "₹1,730.90",
    change: "+6.30",
    percent: "0.37%",
    isPositive: true,
    logoText: "NSE",
    logoBg: "bg-amber-600",
  },
  {
    id: "tata-steel",
    symbol: "Tata Steel",
    name: "Tata Steel Ltd.",
    price: "₹173.80",
    change: "+1.84",
    percent: "1.07%",
    isPositive: true,
    logoText: "TS",
    logoBg: "bg-blue-600",
  },
  {
    id: "cupid",
    symbol: "Cupid",
    name: "Cupid Limited",
    price: "₹366.10",
    change: "+9.45",
    percent: "2.65%",
    isPositive: true,
    logoText: "CP",
    logoBg: "bg-rose-500",
  },
  {
    id: "union-bank",
    symbol: "Union Bank of India",
    name: "Union Bank of India",
    price: "₹173.06",
    change: "+1.55",
    percent: "0.90%",
    isPositive: true,
    logoText: "UB",
    logoBg: "bg-red-600",
  },
];

export interface ProductTool {
  id: string;
  label: string;
  iconName: string;
  pill?: string;
  pillColor?: string;
}

export const STOCKS_PRODUCTS_TOOLS: ProductTool[] = [
  { id: "ipo", label: "IPO", iconName: "TrendingUp", pill: "0 open", pillColor: "bg-emerald-50 text-[#00B386]" },
  { id: "bonds", label: "Bonds", iconName: "Shield" },
  { id: "etfs", label: "ETFs", iconName: "PieChart" },
  { id: "intraday", label: "Intraday Screener", iconName: "Search" },
  { id: "sip", label: "Stock SIP", iconName: "Repeat" },
  { id: "movers", label: "Market Movers", iconName: "Activity" },
];

export interface FnOCardItem {
  id: string;
  name: string;
  price: string;
  change: string;
  percent: string;
  isPositive: boolean;
  candles: { open: number; close: number; high: number; low: number }[];
}

export const FNO_TOP_TRADED: FnOCardItem[] = [
  {
    id: "fno-1",
    name: "NIFTY 50",
    price: "22,520.45",
    change: "+288.65",
    percent: "+1.30%",
    isPositive: true,
    candles: [
      { open: 20, close: 25, high: 28, low: 18 },
      { open: 25, close: 24, high: 26, low: 22 },
      { open: 24, close: 30, high: 32, low: 23 },
      { open: 30, close: 28, high: 31, low: 27 },
      { open: 28, close: 35, high: 38, low: 27 },
      { open: 35, close: 40, high: 42, low: 34 },
      { open: 40, close: 38, high: 43, low: 36 },
      { open: 38, close: 45, high: 47, low: 37 },
      { open: 45, close: 43, high: 46, low: 41 },
      { open: 43, close: 50, high: 52, low: 42 },
      { open: 50, close: 54, high: 56, low: 48 },
      { open: 54, close: 60, high: 62, low: 52 },
    ],
  },
  {
    id: "fno-2",
    name: "SENSEX",
    price: "72,472.33",
    change: "+879.09",
    percent: "+1.23%",
    isPositive: true,
    candles: [
      { open: 30, close: 28, high: 32, low: 26 },
      { open: 28, close: 34, high: 36, low: 27 },
      { open: 34, close: 38, high: 40, low: 33 },
      { open: 38, close: 36, high: 39, low: 34 },
      { open: 36, close: 42, high: 44, low: 35 },
      { open: 42, close: 48, high: 50, low: 40 },
      { open: 48, close: 46, high: 49, low: 44 },
      { open: 46, close: 52, high: 55, low: 45 },
      { open: 52, close: 50, high: 54, low: 48 },
      { open: 50, close: 58, high: 60, low: 49 },
      { open: 58, close: 62, high: 64, low: 56 },
      { open: 62, close: 66, high: 68, low: 60 },
    ],
  },
  {
    id: "fno-3",
    name: "BANK NIFTY",
    price: "55,256.65",
    change: "+741.60",
    percent: "+1.36%",
    isPositive: true,
    candles: [
      { open: 25, close: 29, high: 31, low: 24 },
      { open: 29, close: 34, high: 36, low: 28 },
      { open: 34, close: 32, high: 35, low: 30 },
      { open: 32, close: 38, high: 40, low: 31 },
      { open: 38, close: 44, high: 46, low: 37 },
      { open: 44, close: 42, high: 45, low: 40 },
      { open: 42, close: 49, high: 51, low: 41 },
      { open: 49, close: 53, high: 55, low: 48 },
      { open: 53, close: 50, high: 54, low: 48 },
      { open: 50, close: 56, high: 58, low: 49 },
      { open: 56, close: 60, high: 63, low: 55 },
      { open: 60, close: 64, high: 66, low: 58 },
    ],
  },
  {
    id: "fno-4",
    name: "TCS",
    price: "₹2,156.00",
    change: "+80.00",
    percent: "+3.85%",
    isPositive: true,
    candles: [
      { open: 20, close: 24, high: 26, low: 18 },
      { open: 24, close: 28, high: 30, low: 22 },
      { open: 28, close: 32, high: 34, low: 26 },
      { open: 32, close: 30, high: 33, low: 28 },
      { open: 30, close: 38, high: 40, low: 29 },
      { open: 38, close: 42, high: 44, low: 36 },
      { open: 42, close: 45, high: 48, low: 40 },
      { open: 45, close: 44, high: 47, low: 42 },
      { open: 44, close: 50, high: 53, low: 43 },
      { open: 50, close: 55, high: 58, low: 48 },
      { open: 55, close: 58, high: 62, low: 53 },
      { open: 58, close: 65, high: 68, low: 56 },
    ],
  },
  {
    id: "fno-5",
    name: "HDFC Bank",
    price: "₹707.25",
    change: "+15.00",
    percent: "+2.17%",
    isPositive: true,
    candles: [
      { open: 30, close: 32, high: 35, low: 28 },
      { open: 32, close: 36, high: 38, low: 30 },
      { open: 36, close: 34, high: 37, low: 32 },
      { open: 34, close: 40, high: 42, low: 33 },
      { open: 40, close: 38, high: 41, low: 36 },
      { open: 38, close: 44, high: 46, low: 37 },
      { open: 44, close: 48, high: 50, low: 42 },
      { open: 48, close: 46, high: 49, low: 44 },
      { open: 46, close: 52, high: 54, low: 45 },
      { open: 52, close: 55, high: 58, low: 50 },
      { open: 55, close: 54, high: 57, low: 52 },
      { open: 54, close: 60, high: 62, low: 53 },
    ],
  },
  {
    id: "fno-6",
    name: "Avenue Supermarts",
    price: "₹3,516.80",
    change: "-68.20",
    percent: "-1.90%",
    isPositive: false,
    candles: [
      { open: 60, close: 55, high: 62, low: 53 },
      { open: 55, close: 58, high: 60, low: 54 },
      { open: 58, close: 52, high: 59, low: 50 },
      { open: 52, close: 48, high: 53, low: 46 },
      { open: 48, close: 50, high: 52, low: 47 },
      { open: 50, close: 45, high: 51, low: 43 },
      { open: 45, close: 42, high: 46, low: 40 },
      { open: 42, close: 44, high: 45, low: 41 },
      { open: 44, close: 38, high: 45, low: 36 },
      { open: 38, close: 35, high: 40, low: 33 },
      { open: 35, close: 36, high: 38, low: 34 },
      { open: 36, close: 30, high: 37, low: 28 },
    ],
  },
];

export const FNO_PRODUCTS_TOOLS: ProductTool[] = [
  { id: "groww-api", label: "Groww API", iconName: "Code2" },
  { id: "commodities-expiry", label: "Commodities Expiry Calendar", iconName: "CalendarCheck" },
];

export interface MutualFundItem {
  id: string;
  name: string;
  return3Y: string;
  category: string;
  logoBg: string;
}

export const POPULAR_FUNDS: MutualFundItem[] = [
  {
    id: "sbi-gold",
    name: "SBI Gold Direct Plan-Growth",
    return3Y: "+35.75%",
    category: "Commodities",
    logoBg: "bg-amber-500",
  },
  {
    id: "bandhan-small",
    name: "Bandhan Small Cap Fund",
    return3Y: "+22.06%",
    category: "Small Cap",
    logoBg: "bg-emerald-600",
  },
  {
    id: "motilal-midcap",
    name: "Motilal Oswal Midcap Fund",
    return3Y: "+17.30%",
    category: "Mid Cap",
    logoBg: "bg-indigo-600",
  },
  {
    id: "parag-parikh",
    name: "Parag Parikh Flexi Cap Fund",
    return3Y: "+11.75%",
    category: "Flexi Cap",
    logoBg: "bg-blue-600",
  },
];

export const FUND_COLLECTIONS = [
  { id: "high-return", label: "High return", icon: "🔥", desc: "Top performing funds" },
  { id: "sip-100", label: "SIP with ₹100", icon: "🌱", desc: "Start micro-investing" },
  { id: "gold-silver", label: "Gold & Silver", icon: "🪙", desc: "Hedge with bullion" },
  { id: "large-cap", label: "Large Cap", icon: "🏢", desc: "Stable top 100 giants" },
  { id: "mid-cap", label: "Mid Cap", icon: "🚀", desc: "High growth potential" },
  { id: "small-cap", label: "Small Cap", icon: "⭐", desc: "Next multibaggers" },
];

export const FUNDS_BY_GROWCLONE: MutualFundItem[] = [
  {
    id: "groww-total-market",
    name: "Groww Nifty Total Market Index Fund",
    return3Y: "+19.45%",
    category: "Index Fund",
    logoBg: "bg-emerald-500",
  },
  {
    id: "groww-smallcap-250",
    name: "Groww Nifty Smallcap 250 Index Fund",
    return3Y: "+24.80%",
    category: "Index Fund",
    logoBg: "bg-teal-600",
  },
  {
    id: "groww-gold-etf",
    name: "Groww Gold ETF FoF",
    return3Y: "+32.10%",
    category: "Commodities",
    logoBg: "bg-amber-600",
  },
  {
    id: "groww-banking",
    name: "Groww Banking & Financial Services Fund",
    return3Y: "+16.85%",
    category: "Thematic",
    logoBg: "bg-indigo-500",
  },
];

export const MF_PRODUCTS_TOOLS: ProductTool[] = [
  { id: "nfo-live", label: "NFO Live", iconName: "Flame", pill: "8 open", pillColor: "bg-emerald-50 text-[#00B386]" },
  { id: "import-funds", label: "Import funds", iconName: "Upload" },
  { id: "file-tax", label: "File tax", iconName: "FileText" },
  { id: "compare-funds", label: "Compare funds", iconName: "GitCompare" },
];

export interface BankAccount {
  id: string;
  bankName: string;
  maskedAccount: string;
  fullAccount: string;
  ifscCode: string;
  branchName: string;
  status: string;
  isPrimary: boolean;
  logoColor: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "bank-indusind",
    bankName: "INDUSIND BANK",
    maskedAccount: "XXXX2231",
    fullAccount: "XXXXXXXX2231",
    ifscCode: "INDB0000099",
    branchName: "ANDHERI",
    status: "Verified",
    isPrimary: true,
    logoColor: "bg-red-700",
  },
  {
    id: "bank-kotak",
    bankName: "KOTAK MAHINDRA BANK",
    maskedAccount: "XXXX4434",
    fullAccount: "XXXXXXXX4434",
    ifscCode: "KKBK0000123",
    branchName: "BANDRA WEST",
    status: "Verified",
    isPrimary: false,
    logoColor: "bg-red-600",
  },
];

export interface FAQCategory {
  id: string;
  label: string;
  iconName: string;
  hasSubpage?: boolean;
  route?: string;
}

export const SUPPORT_FAQS: FAQCategory[] = [
  { id: "most-asked", label: "Most Asked", iconName: "HelpCircle" },
  { id: "my-account", label: "My Account", iconName: "User", hasSubpage: true, route: "/help/my-account" },
  { id: "stocks", label: "Stocks", iconName: "TrendingUp" },
  { id: "fno", label: "F&O", iconName: "Activity" },
  { id: "ipo-mtf", label: "IPO & MTF", iconName: "Award" },
  { id: "payments", label: "Payments & Withdrawals", iconName: "CreditCard" },
  { id: "mutual-funds", label: "Mutual Funds", iconName: "PieChart" },
  { id: "loans", label: "Loans", iconName: "Percent" },
  { id: "fds", label: "FDs", iconName: "Lock" },
  { id: "us-stocks", label: "US Stocks", iconName: "Globe" },
];

export interface SubAccountItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export const MY_ACCOUNT_SUBCATEGORIES: SubAccountItem[] = [
  {
    id: "kyc",
    title: "KYC",
    subtitle: "Documents - eSign - PAN",
    iconName: "Fingerprint",
  },
  {
    id: "growclone-account",
    title: "GrowClone Account",
    subtitle: "Login - Password - Mobile No.",
    iconName: "UserCheck",
  },
  {
    id: "bank-accounts",
    title: "Bank Accounts",
    subtitle: "Primary Bank - NEFT - Bank verification",
    iconName: "Building2",
  },
  {
    id: "others",
    title: "Others",
    subtitle: "Reports - Login - Aadhaar PAN linking",
    iconName: "FileSpreadsheet",
  },
  {
    id: "other-demat",
    title: "Other Demat Accounts",
    subtitle: "Demat account for HUF, Minor, Corporate & Partnership",
    iconName: "Users",
  },
  {
    id: "nri-accounts",
    title: "NRI Accounts",
    subtitle: "NRI Onboarding",
    iconName: "Globe2",
  },
];
