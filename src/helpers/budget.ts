import { getStoreData } from "../dataStore.ts/dataStore";
import { Cadence } from "../schema/schema";

interface ScriptInputs {
  currentSavings: number;
  currentChecking: number;
  desiredDepositAmount: number;
  desiredCheckingMin: number;
  incomePayDates: { [key: string]: { month: number; day: number } };
}

export function runBudgetScript(inputs: ScriptInputs) {
  const storeData = getStoreData();
  const { loans, monthlyExpenses, monthlyIncome } = storeData;
  const { currentSavings, currentChecking, desiredDepositAmount, desiredCheckingMin, incomePayDates } = inputs;

  const daysInYear = 365;
  const billsArray = new Array(daysInYear).fill(0);
  const incomeArray = new Array(daysInYear).fill(0);
  const checkingArray = new Array(daysInYear).fill(currentChecking);
  const savingsArray = new Array(daysInYear).fill(currentSavings);

  const startDate = new Date();
  
  // Process expenses and loans
  [...monthlyExpenses, ...loans].forEach(item => {
    let dayOfMonth = 1; // Assuming all bills are due on the 1st
    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (currentDate.getDate() === dayOfMonth) {
        billsArray[i] += item.cadenceAmount;
      }
    }
  });

  // Process incomes
  monthlyIncome.forEach(income => {
    const payDate = incomePayDates[income.id];
    let nextPayDate = new Date(startDate.getFullYear(), payDate.month - 1, payDate.day);
    
    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (currentDate.getTime() === nextPayDate.getTime()) {
        incomeArray[i] += income.cadenceAmount;
        
        // Calculate next pay date based on cadence
        switch (income.cadence) {
          case Cadence.Monthly:
            nextPayDate.setMonth(nextPayDate.getMonth() + 1);
            break;
          case Cadence.Biweekly:
            nextPayDate.setDate(nextPayDate.getDate() + 14);
            break;
          // Add other cadences as needed
        }
      }
    }
  });

  // Calculate daily balances
  for (let i = 0; i < daysInYear; i++) {
    if (i > 0) {
      checkingArray[i] = checkingArray[i-1];
      savingsArray[i] = savingsArray[i-1];
    }
    
    checkingArray[i] += incomeArray[i] - billsArray[i];
    
    if (checkingArray[i] - desiredDepositAmount >= desiredCheckingMin) {
      savingsArray[i] += desiredDepositAmount;
      checkingArray[i] -= desiredDepositAmount;
    }
  }

  return {
    billsArray,
    incomeArray,
    checkingArray,
    savingsArray
  };
}
