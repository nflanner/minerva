import { getStoreData } from '../dataStore.ts/dataStore';
import { Loan, Expense, Income, Cadence } from '../schema/schema';
import { Chart } from 'chart.js/auto';

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

  const roundHundreds = (number: number): string => {
    const rounded = Math.round(number * 100) / 100;
    return rounded.toFixed(2).padStart(5, '0');
  };

  const totalIncomePerMonth = monthlyIncome.reduce((total, income) => {
    switch (income.cadence) {
      case Cadence.Monthly:
        return total + income.amount;
      case Cadence.Biweekly:
        return total + income.amount * 26 / 12; // More accurate average
      case Cadence.SpecificDates:
        return total + (income.specificDates?.length || 0) * income.amount;
      default:
        return total;
    }
  }, 0);
  

  const totalExpensesPerMonth = monthlyExpenses.reduce((total, expense) => {
    if (expense.cadence === Cadence.Monthly) {
      return total + expense.amount;
    }
    return total;
  }, 0);

  const totalLoanPaymentsPerMonth = loans.reduce((total, loan) => {
    const monthlyPayment = (loan.amount * loan.interestRate) / 12;
    return total + monthlyPayment;
  }, 0);

  const totalBills = totalExpensesPerMonth + totalLoanPaymentsPerMonth;

  console.log('Total income per month: $' + totalIncomePerMonth.toFixed(2));
  console.log('Total expenses per month: $' + totalExpensesPerMonth.toFixed(2));
  console.log('Total loan payments per month: $' + totalLoanPaymentsPerMonth.toFixed(2));
  console.log('Total bills per month: $' + totalBills.toFixed(2));
  console.log('Maximum savings per month: $' + (totalIncomePerMonth - totalBills).toFixed(2));

  const simulationMonths = 12;
  const daysInEachMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let currentCheckingBalance = currentChecking;
  let currentSavingsBalance = currentSavings;

  const monthDayArray: number[] = [];
  const checkingArray: number[] = [];
  const savingsArray: number[] = [];
  const totalArray: number[] = [];

  const todaysMonth = new Date().getMonth() + 1;
  const todaysDay = new Date().getDate();

  for (let month = 1; month <= simulationMonths; month++) {
    for (let day = 1; day <= daysInEachMonth[month - 1]; day++) {
      if ((month > todaysMonth) || (month === todaysMonth && day >= todaysDay)) {
        // Process incomes
        monthlyIncome.forEach(income => {
          const payDate = incomePayDates[income.id];
          if (payDate.month === month && payDate.day === day) {
            currentCheckingBalance += income.amount;
          }
        });

        // Remove monthly bills on first day of month
        if (day === 1) {
          currentCheckingBalance -= totalBills;
        }

        // Transfer to savings if possible
        if (currentCheckingBalance - desiredDepositAmount > desiredCheckingMin) {
          const newSavings = currentSavingsBalance + desiredDepositAmount;
          const newChecking = currentCheckingBalance - desiredDepositAmount;
          console.log(`Deposit $${desiredDepositAmount} on ${roundHundreds(month + day/100)}; (checking, savings): (${roundHundreds(currentCheckingBalance)}, ${roundHundreds(currentSavingsBalance)}) -> (${roundHundreds(newChecking)}, ${roundHundreds(newSavings)}); New Total: $${roundHundreds(newChecking + newSavings)}`);
          currentSavingsBalance = newSavings;
          currentCheckingBalance = newChecking;
        }

        // Fill our plot arrays
        monthDayArray.push(month + day/100);
        checkingArray.push(currentCheckingBalance);
        savingsArray.push(currentSavingsBalance);
        totalArray.push(currentCheckingBalance + currentSavingsBalance);
      }
    }
  }

  // Create charts
  createChart('checkingChart', 'Checking Balance', monthDayArray, checkingArray);
  createChart('savingsChart', 'Savings Balance', monthDayArray, savingsArray);
  createChart('totalChart', 'Total Balance', monthDayArray, totalArray);

  return {
    monthDayArray,
    checkingArray,
    savingsArray,
    totalArray
  };
}

function createChart(canvasId: string, label: string, xData: number[], yData: number[]) {
  const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: xData,
      datasets: [{
        label: label,
        data: yData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (Months)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Balance ($)'
          }
        }
      }
    }
  });
}
