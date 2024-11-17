import {
  Loan,
  Cadence,
  LoanCardType,
  ExpenseCardType,
  IncomeCardType,
  Expense,
  Income
} from "../schema/schema";
import localData from '../../local-data/local-data.json';

export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getLoanData = (): LoanCardType => {
  return {
    title: "Existing Loans",
    description: "Your current loans",
    monetaryValues: [],
    onClick: () => console.log("Adding new loan"),
  };
};

export const getExpenseData = (): ExpenseCardType => {
  return {
    title: "Monthly Expenses",
    description: "Recurring monthly costs",
    monetaryValues: [],
    onClick: () => console.log("Adding new monthly expense"),
  };
};

export const getIncomeData = (): IncomeCardType => {
  return {
    title: "Monthly Income",
    description: "Recurring monthly income",
    monetaryValues: [],
    onClick: () => console.log("Adding new monthly income"),
  };
};

export const validateJsonStructure = (json: any): boolean => {
  return (
    json &&
    Array.isArray(json.loans) &&
    Array.isArray(json.monthlyExpenses) &&
    Array.isArray(json.monthlyIncome) &&
    json.loans.every((loan: any) => 
      typeof loan.name === 'string' &&
      typeof loan.amount === 'number' &&
      typeof loan.interestRate === 'number' &&
      typeof loan.cadence === 'string'
    ) &&
    json.monthlyExpenses.every((expense: any) =>
      typeof expense.name === 'string' &&
      typeof expense.amount === 'number' &&
      typeof expense.cadence === 'string'
    ) &&
    json.monthlyIncome.every((income: any) =>
      typeof income.name === 'string' &&
      typeof income.amount === 'number' &&
      typeof income.cadence === 'string'
    )
  );
};

