export interface BankAccount {
  id: string;
  bankName: string;
  maskedAccount: string;
  fullAccount: string;
  ifsc: string;
  branchName: string;
  isPrimary: boolean;
  status: 'Verified' | 'Pending';
  logoText: string;
  logoBg: string;
}

export const MOCK_BANKS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'INDUSIND BANK',
    maskedAccount: 'XXXX2231',
    fullAccount: 'XXXXXXXX2231',
    ifsc: 'INDB0000099',
    branchName: 'ANDHERI',
    isPrimary: true,
    status: 'Verified',
    logoText: 'IND',
    logoBg: 'bg-red-700',
  },
  {
    id: 'bank-2',
    bankName: 'KOTAK MAHINDRA BANK',
    maskedAccount: 'XXXX4434',
    fullAccount: 'XXXXXXXX4434',
    ifsc: 'KKBK0000123',
    branchName: 'NARIMAN POINT',
    isPrimary: false,
    status: 'Verified',
    logoText: 'KM',
    logoBg: 'bg-rose-600',
  },
  {
    id: 'bank-3',
    bankName: 'HDFC BANK',
    maskedAccount: 'XXXX8890',
    fullAccount: 'XXXXXXXX8890',
    ifsc: 'HDFC0000060',
    branchName: 'BANDRA KURLA COMPLEX',
    isPrimary: false,
    status: 'Verified',
    logoText: 'HDFC',
    logoBg: 'bg-blue-800',
  },
];
