import React from 'react';
import { getLoanData, getExpenseData, getIncomeData } from '../helpers/helpers';
import { LoanAccordion } from './LoanAccordion';
import { ExpenseAccordion } from './ExpenseAccordion';
import { IncomeAccordion } from './IncomeAccordion';

export const MonetaryInput: React.FC = () => {
  const loans = getLoanData();
  const expenses = getExpenseData();
  const income = getIncomeData();

  return (
    <>
      <LoanAccordion loanData={loans} />
      <ExpenseAccordion expenseData={expenses} />
      <IncomeAccordion incomeData={income} />
    </>
  );
};
