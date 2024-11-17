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
  name: string
  amount: number;
  cadence: Cadence;
  specificDates?: number[];
}

export interface Loan extends FinancialItem {
  interestRate: number;
}

export interface Expense extends FinancialItem {
  // Additional expense-specific properties can be added here
}

export interface Income extends FinancialItem {
  // Additional income-specific properties can be added here
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
