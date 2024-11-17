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
  const loans: Loan[] = localData.loans.map(loan => ({
    id: generateGuid(),
    ...loan,
    cadence: Cadence[loan.cadence as keyof typeof Cadence]
  }));

  return {
    title: "Existing Loans",
    description: "Your current loans",
    monetaryValues: loans,
    onClick: () => console.log("Adding new loan"),
  };
};

export const getExpenseData = (): ExpenseCardType => {
  const expenses: Expense[] = localData.monthlyExpenses.map(expense => ({
    id: generateGuid(),
    ...expense,
    cadence: Cadence[expense.cadence as keyof typeof Cadence]
  }));

  return {
    title: "Monthly Expenses",
    description: "Recurring monthly costs",
    monetaryValues: expenses,
    onClick: () => console.log("Adding new monthly expense"),
  };
};

export const getIncomeData = (): IncomeCardType => {
  const incomes: Income[] = localData.monthlyIncome.map(income => ({
    id: generateGuid(),
    ...income,
    cadence: Cadence[income.cadence as keyof typeof Cadence]
  }));

  return {
    title: "Monthly Income",
    description: "Recurring monthly income",
    monetaryValues: incomes,
    onClick: () => console.log("Adding new monthly income"),
  };
};

