export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  route?: string;
  count?: number;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'most-asked', name: 'Most Asked', icon: 'HelpCircle' },
  { id: 'my-account', name: 'My Account', icon: 'User', route: '/help/my-account' },
  { id: 'stocks', name: 'Stocks', icon: 'TrendingUp' },
  { id: 'fno', name: 'F&O', icon: 'Layers' },
  { id: 'ipo-mtf', name: 'IPO & MTF', icon: 'FileText' },
  { id: 'payments', name: 'Payments & Withdrawals', icon: 'CreditCard' },
  { id: 'mutual-funds', name: 'Mutual Funds', icon: 'Coins' },
  { id: 'loans', name: 'Loans', icon: 'Banknote' },
  { id: 'fds', name: 'FDs', icon: 'Lock' },
  { id: 'us-stocks', name: 'US Stocks', icon: 'Globe' },
];

export interface MyAccountTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export const MY_ACCOUNT_TOPICS: MyAccountTopic[] = [
  {
    id: 'kyc',
    title: 'KYC',
    subtitle: 'Documents · eSign · PAN',
    icon: 'Fingerprint',
  },
  {
    id: 'growclone-account',
    title: 'GrowClone Account',
    subtitle: 'Login · Password · Mobile No.',
    icon: 'UserCheck',
  },
  {
    id: 'bank-accounts',
    title: 'Bank Accounts',
    subtitle: 'Primary Bank · NEFT · Bank verification',
    icon: 'Landmark',
  },
  {
    id: 'others',
    title: 'Others',
    subtitle: 'Reports · Nominee · Aadhaar PAN linking',
    icon: 'Layers',
  },
  {
    id: 'other-demat',
    title: 'Other Demat Accounts',
    subtitle: 'Demat account for HUF, Minor, Corporate & Partnership',
    icon: 'Users',
  },
  {
    id: 'nri-accounts',
    title: 'NRI Accounts',
    subtitle: 'NRI Onboarding & Portfolio tracking',
    icon: 'Globe2',
  },
];
