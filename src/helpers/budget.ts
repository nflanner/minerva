import { getStoreData } from "../dataStore.ts/dataStore";
import { BudgetLogger } from "./BudgetLogger";
import { calculateDailyBalances, processExpenses, processIncomes, processLoans } from "./helpers";
import { ScriptInputs } from '../types';

export function runBudgetScript(inputs: ScriptInputs) {
  const storeData = getStoreData();
  const { loans, monthlyExpenses, monthlyIncome } = storeData;
  const { currentSavings, currentChecking, desiredDepositAmount, desiredCheckingMin } = inputs;

  const daysInYear = 365;
  const startDate = new Date();

  BudgetLogger.logInitialData({ loans, monthlyExpenses, monthlyIncome, ...inputs });

  const expensePayments = processExpenses(monthlyExpenses, daysInYear);
  const loanPayments = processLoans(loans, daysInYear);
  const incomeArray = processIncomes(monthlyIncome, daysInYear);

  const billsArray = expensePayments.map((exp, i) => exp + loanPayments[i]);

  const { checkingArray, savingsArray } = calculateDailyBalances(
    incomeArray,
    billsArray,
    currentChecking,
    currentSavings,
    desiredDepositAmount,
    desiredCheckingMin
  );

  BudgetLogger.logFinalResults({ billsArray, incomeArray, checkingArray, savingsArray });

  return {
    billsArray,
    incomeArray,
    checkingArray,
    savingsArray
  };
}
