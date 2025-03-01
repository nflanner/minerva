import { getStoreData } from "../dataStore.ts/dataStore";
import { calculateDailyBalances, processExpenses, processIncomes, processLoans } from "./helpers";
import { ScriptInputs } from '../types';

export function runBudgetScript(inputs: ScriptInputs) {
  const storeData = getStoreData();
  const { loans, monthlyExpenses, monthlyIncome } = storeData;
  const { currentSavings, currentChecking, desiredDepositAmount, desiredCheckingMin } = inputs;

  const daysInYear = 365;

  const expensePayments = processExpenses(monthlyExpenses, daysInYear);
  const loanPayments = processLoans(loans, daysInYear);
  const incomeArray = processIncomes(monthlyIncome, daysInYear);

  const billsArray = expensePayments.map((exp, i) => exp + loanPayments[i]);

  const { checkingArray, savingsArray, depositsArray } = calculateDailyBalances(
    incomeArray,
    billsArray,
    currentChecking,
    currentSavings,
    desiredDepositAmount,
    desiredCheckingMin
  );

  return {
    billsArray,
    incomeArray,
    checkingArray,
    savingsArray,
    depositsArray
  };
}
