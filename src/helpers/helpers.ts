import { FinancialItem, Cadence, Loan, Income, ValidatedIncome, Deposit } from "../schema/schema";
import { BudgetLogger } from "./BudgetLogger";

export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const validateFilename = (name: string) => {
  const regex = /^[a-zA-Z0-9_-]+\.json$/;
  return regex.test(name);
};

export const validateJsonStructure = (json: any): boolean => {
  return (
    json &&
    Array.isArray(json.loans) &&
    Array.isArray(json.monthlyExpenses) &&
    Array.isArray(json.monthlyIncome) &&
    json.loans.every((loan: any) =>
      typeof loan.name === 'string' &&
      typeof loan.cadenceAmount === 'number' &&
      typeof loan.amountRemaining === 'number' &&
      typeof loan.interestRate === 'number' &&
      typeof loan.cadence === 'string'
    ) &&
    json.monthlyExpenses.every((expense: any) =>
      typeof expense.name === 'string' &&
      typeof expense.cadenceAmount === 'number' &&
      typeof expense.cadence === 'string'
    ) &&
    json.monthlyIncome.every((income: any) =>
      typeof income.name === 'string' &&
      typeof income.cadenceAmount === 'number' &&
      typeof income.cadence === 'string'
    )
  );
};

// Use an enum for months to improve type safety and readability
export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}

export const monthConfig = {
  [Month.January]: { days: 31, name: 'January' },
  [Month.February]: { days: 28, name: 'February' },
  [Month.March]: { days: 31, name: 'March' },
  [Month.April]: { days: 30, name: 'April' },
  [Month.May]: { days: 31, name: 'May' },
  [Month.June]: { days: 30, name: 'June' },
  [Month.July]: { days: 31, name: 'July' },
  [Month.August]: { days: 31, name: 'August' },
  [Month.September]: { days: 30, name: 'September' },
  [Month.October]: { days: 31, name: 'October' },
  [Month.November]: { days: 30, name: 'November' },
  [Month.December]: { days: 31, name: 'December' }
} as const;

export const monthOptions = Object.entries(monthConfig).map(([value, { name }]) => ({
  value,
  label: name
}));

export const getDayOptions = (month: number) => {
  const { days } = monthConfig[month as Month] || monthConfig[Month.January];
  return Array.from({ length: days }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));
};

export function calculateLoanPayment(loan: Loan, daysElapsed: number): number {
  const monthlyRate = loan.interestRate / 12;
  const dailyInterest = loan.amountRemaining * (monthlyRate / 30);
  return loan.cadenceAmount + (dailyInterest * daysElapsed);
}

export function getNextPaymentDate(item: FinancialItem, currentDate: Date): Date {
  const nextDate = new Date(currentDate);
  
  switch (item.cadence) {
    case Cadence.Daily:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case Cadence.Weekly:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case Cadence.Biweekly:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case Cadence.Monthly:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case Cadence.Quarterly:
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case Cadence.Annually:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case Cadence.SpecificDates:
      if (item.specificDates) {
        const currentDay = currentDate.getDate();
        const nextSpecificDate = item.specificDates.find(date => date > currentDay);
        if (nextSpecificDate) {
          nextDate.setDate(nextSpecificDate);
        } else {
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(item.specificDates[0]);
        }
      }
      break;
  }
  return nextDate;
}

export function processExpenses(expenses: FinancialItem[], daysInYear: number): number[] {
  const startDate = new Date();
  const billsArray = new Array(daysInYear).fill(0);
  
  expenses.forEach(expense => {
    let nextPaymentDate = new Date(startDate);
    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (currentDate.getTime() === nextPaymentDate.getTime()) {
        billsArray[i] += expense.cadenceAmount;
        nextPaymentDate = getNextPaymentDate(expense, currentDate);
      }
    }
  });
  
  return billsArray;
}

export function processLoans(loans: Loan[], daysInYear: number): number[] {
  const startDate = new Date();
  const loanPayments = new Array(daysInYear).fill(0);
  
  loans.forEach(loan => {
    let nextPaymentDate = new Date(startDate);
    let daysElapsed = 0;
    
    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      if (currentDate.getTime() === nextPaymentDate.getTime()) {
        loanPayments[i] += calculateLoanPayment(loan, daysElapsed);
        nextPaymentDate = getNextPaymentDate(loan, currentDate);
        daysElapsed = 0;
      }
      daysElapsed++;
    }
  });
  
  return loanPayments;
}

export function processIncomes(incomes: Income[], daysInYear: number): number[] {
  // Validate all incomes have nextPayDate
  if (!incomes.every(income => income.nextPayDate)) {
    throw new Error('All income items must have a next payment date specified');
  }

  const validatedIncomes = incomes as ValidatedIncome[];
  const startDate = new Date();
  const incomeArray = new Array(daysInYear).fill(0);

  validatedIncomes.forEach((income) => {
    console.log(`Processing income: ${income.name}`);
    switch (income.cadence) {
      // ... existing cases ...
    }
  });

  const processDailyIncome = (income: ValidatedIncome) => {
    for (let i = 0; i < daysInYear; i++) {
      incomeArray[i] += income.cadenceAmount;
    }
  };

  const processPeriodicIncome = (income: ValidatedIncome, daysInterval: number, expectedPayments: number) => {
    let currentDate = new Date(startDate);
    currentDate.setMonth(income.nextPayDate.month - 1);
    currentDate.setDate(income.nextPayDate.day);
    let paymentsProcessed = 0;
  
    while (paymentsProcessed < expectedPayments && currentDate.getTime() <= startDate.getTime() + (daysInYear * 24 * 60 * 60 * 1000)) {
      const dayIndex = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < daysInYear) {
        incomeArray[dayIndex] += income.cadenceAmount;
        paymentsProcessed++;
      }
      currentDate.setDate(currentDate.getDate() + daysInterval);
    }
  };
  
  const processMonthlyBasedIncome = (income: ValidatedIncome, monthInterval: number) => {
    let currentDate = new Date(startDate.getFullYear(), income.nextPayDate.month - 1, income.nextPayDate.day);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
  
    while (currentDate < endDate) {
      const dayIndex = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < daysInYear) {
        incomeArray[dayIndex] += income.cadenceAmount;
      }
      currentDate.setMonth(currentDate.getMonth() + monthInterval);
    }
  };  

  const processSpecificDatesIncome = (income: ValidatedIncome) => {
    if (!income.specificDates) return;
    let totalPayments = 0;
    let currentDate = new Date(startDate.getFullYear(), income.nextPayDate.month - 1, income.nextPayDate.day);
    
    while (currentDate.getTime() < startDate.getTime() + (daysInYear * 24 * 60 * 60 * 1000)) {
      income.specificDates.forEach(day => {
        currentDate.setDate(day);
        const dayIndex = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < daysInYear) {
          incomeArray[dayIndex] += income.cadenceAmount;
          totalPayments++;
        }
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  };
  
  validatedIncomes.forEach((income) => {
    switch (income.cadence) {
      case Cadence.Daily:
        processDailyIncome(income);
        break;
      case Cadence.Weekly:
        processPeriodicIncome(income, 7, 52);
        break;
      case Cadence.Biweekly:
        processPeriodicIncome(income, 14, 26);
        break;
      case Cadence.Monthly:
        processMonthlyBasedIncome(income, 1);
        break;
      case Cadence.Quarterly:
        processMonthlyBasedIncome(income, 3);
        break;
      case Cadence.Annually:
        processMonthlyBasedIncome(income, 12);
        break;
      case Cadence.SpecificDates:
        processSpecificDatesIncome(income);
        break;
    }
  });

  // Add these logs
  console.log('Income Array Summary:');
  console.log('Total days with income:', incomeArray.filter(amount => amount > 0).length);
  console.log('Total income sum:', incomeArray.reduce((sum, amount) => sum + amount, 0));
  console.log('Income days:', incomeArray.map((amount, index) => amount > 0 ? `Day ${index}: $${amount}` : null).filter(Boolean));


  return incomeArray;
}

export function calculateDailyBalances(
  incomeArray: number[],
  billsArray: number[],
  initialChecking: number,
  initialSavings: number,
  desiredDepositAmount: number,
  desiredCheckingMin: number
): { checkingArray: number[], savingsArray: number[], depositsArray: Deposit[] } {
  const daysInYear = incomeArray.length;
  const checkingArray = new Array(daysInYear).fill(initialChecking);
  const savingsArray = new Array(daysInYear).fill(initialSavings);
  const depositsArray: Deposit[] = [];

  for (let i = 0; i < daysInYear; i++) {
    if (i > 0) {
      checkingArray[i] = checkingArray[i-1];
      savingsArray[i] = savingsArray[i-1];
    }
    
    // Add income
    checkingArray[i] += incomeArray[i];
    
    // Process bills
    checkingArray[i] -= billsArray[i];

    // Pull from savings if checking goes negative
    if (checkingArray[i] < 0 && savingsArray[i] > 0) {
      const transferAmount = Math.min(-checkingArray[i], savingsArray[i]);
      savingsArray[i] -= transferAmount;
      checkingArray[i] += transferAmount;
    }
    
    // Process savings deposit if we have enough in checking
    if (checkingArray[i] - desiredDepositAmount >= desiredCheckingMin) {
      depositsArray.push({
        date: i,
        amount: desiredDepositAmount,
        savingsBefore: savingsArray[i],
        savingsAfter: savingsArray[i] + desiredDepositAmount,
        checkingBefore: checkingArray[i],
        checkingAfter: checkingArray[i] - desiredDepositAmount,
        totalAfter: (savingsArray[i] + desiredDepositAmount) + (checkingArray[i] - desiredDepositAmount)
      });
      savingsArray[i] += desiredDepositAmount;
      checkingArray[i] -= desiredDepositAmount;
    }
  }

  return { checkingArray, savingsArray, depositsArray };
}
