export enum Cadence {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Biweekly = 'Biweekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Annually = 'Annually',
  SpecificDates = 'SpecificDates'
}

export interface FinancialItem {
  id: string;
  name: string;
  cadenceAmount: number;
  cadence: Cadence;
  specificDates?: number[];
}

export interface Loan extends FinancialItem {
  interestRate: number;
  amountRemaining: number;
}

export interface Expense extends FinancialItem {
  // Additional expense-specific properties can be added here
}

export interface Income extends FinancialItem {
  nextPayDate?: {
    month: number;
    day: number;
  };
}

export interface ValidatedIncome extends FinancialItem {
  nextPayDate: {
    month: number;
    day: number;
  };
}

export interface LoanCardType {
  title: string;
  description: string;
  monetaryValues: Loan[];
  onClick: () => void;
}

export interface ExpenseCardType {
  title: string;
  description: string;
  monetaryValues: Expense[];
  onClick: () => void;
}

export interface IncomeCardType {
  title: string;
  description: string;
  monetaryValues: Income[];
  onClick: () => void;
}

export interface BudgetParameters {
  currentSavings: number;
  currentChecking: number;
  desiredDepositAmount: number;
  desiredCheckingMin: number;
}
