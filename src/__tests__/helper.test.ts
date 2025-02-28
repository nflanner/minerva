import { 
  getNextPaymentDate,
  calculateLoanPayment,
  processExpenses,
  processLoans,
  processIncomes,
  calculateDailyBalances
} from '../helpers/helpers';
import { testBudgetData } from './fixtures/sampleBudget';

describe('Budget Helper Functions', () => {
  const daysInYear = 365;

  describe('getNextPaymentDate', () => {
    test('calculates next monthly payment date', () => {
      const item = testBudgetData.monthlyIncome[0];
      const currentDate = new Date(2024, 0, 15);
      const nextDate = getNextPaymentDate(item, currentDate);
      expect(nextDate.getMonth()).toBe(1); // February
      expect(nextDate.getDate()).toBe(15);
    });

    test('calculates next biweekly payment date', () => {
      const item = testBudgetData.monthlyIncome[1];
      const currentDate = new Date(2024, 0, 1);
      const nextDate = getNextPaymentDate(item, currentDate);
      expect(nextDate.getDate()).toBe(15);
    });
  });

  describe('calculateLoanPayment', () => {
    test('calculates loan payment with interest', () => {
      const loan = testBudgetData.loans[0];
      const payment = calculateLoanPayment(loan, 30);
      expect(payment).toBeGreaterThan(loan.cadenceAmount);
    });
  });

  describe('processExpenses', () => {
    test('processes monthly expenses correctly', () => {
      const expenses = testBudgetData.monthlyExpenses;
      const expenseArray = processExpenses(expenses, daysInYear);
      const totalExpenses = expenseArray.reduce((sum, val) => sum + val, 0);
      expect(totalExpenses).toBeGreaterThan(0);
    });
  });

  describe('processLoans', () => {
    test('processes loan payments correctly', () => {
      const loans = testBudgetData.loans;
      const loanArray = processLoans(loans, daysInYear);
      const totalLoanPayments = loanArray.reduce((sum, val) => sum + val, 0);
      expect(totalLoanPayments).toBeGreaterThan(0);
    });
  });

  describe('processIncomes', () => {
    test('processes all income types correctly', () => {
      const incomes = testBudgetData.monthlyIncome;
      const incomeArray = processIncomes(incomes, daysInYear);
      const totalIncome = incomeArray.reduce((sum, val) => sum + val, 0);
      expect(totalIncome).toBeGreaterThan(0);
    });
  });

  describe('calculateDailyBalances', () => {
    test('calculates daily balances with savings goals', () => {
      const { currentChecking, currentSavings, desiredDepositAmount, desiredCheckingMin } = testBudgetData.budgetParameters;
      const incomeArray = new Array(daysInYear).fill(1000);
      const billsArray = new Array(daysInYear).fill(500);

      const { checkingArray, savingsArray } = calculateDailyBalances(
        incomeArray,
        billsArray,
        currentChecking,
        currentSavings,
        desiredDepositAmount,
        desiredCheckingMin
      );

      expect(checkingArray[daysInYear - 1]).toBeGreaterThan(desiredCheckingMin);
      expect(savingsArray[daysInYear - 1]).toBeGreaterThan(currentSavings);
    });
  });
});
