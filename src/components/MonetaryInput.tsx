import React, { useEffect } from 'react';
import { getLoanData, getExpenseData, getIncomeData } from '../helpers/helpers';
import { LoanAccordion } from './LoanAccordion';
import { ExpenseAccordion } from './ExpenseAccordion';
import { IncomeAccordion } from './IncomeAccordion';

export const MonetaryInput: React.FC<{ uploadedData: any }> = ({ uploadedData }) => {
  const loans = uploadedData ? { ...getLoanData(), monetaryValues: uploadedData.loans } : getLoanData();
  const expenses = uploadedData ? { ...getExpenseData(), monetaryValues: uploadedData.monthlyExpenses } : getExpenseData();
  const income = uploadedData ? { ...getIncomeData(), monetaryValues: uploadedData.monthlyIncome } : getIncomeData();

  return (
    <>
      <LoanAccordion loanData={loans} />
      <ExpenseAccordion expenseData={expenses} />
      <IncomeAccordion incomeData={income} />
    </>
  );
};
