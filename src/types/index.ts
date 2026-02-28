export interface Asset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  currentValue: number;
  purchasePrice: number;
}

export interface Mortgage {
  id: string;
  propertyId: string;
  propertyName: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
}

export interface SimulatorConfig {
  totalHoldings: number;
  useAutoHoldings: boolean;
  annualAppreciation: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export interface YearProjection {
  year: number;
  date: string;
  startBalance: number;
  appreciation: number;
  totalIncome: number;
  totalExpenses: number;
  endBalance: number;
}
