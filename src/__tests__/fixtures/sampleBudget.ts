import { Cadence } from '../../schema/schema';

const getNextMonthlyPayDate = () => {
  const now = new Date();
  const nextDate = new Date(now);
  if (now.getDate() >= 15) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  nextDate.setDate(15);
  return { month: nextDate.getMonth() + 1, day: 15 };
};

const getNextBiweeklyPayDate = () => {
  const now = new Date();
  const nextDate = new Date(now);
  while (nextDate.getDay() !== 5) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return { month: nextDate.getMonth() + 1, day: nextDate.getDate() };
};

const getNextSpecificPayDate = () => {
  const now = new Date();
  const nextDate = new Date(now);
  const day = now.getDate() < 10 ? 10 :
             now.getDate() < 25 ? 25 : 10;
  if (day === 10 && now.getDate() >= 25) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  return { month: nextDate.getMonth() + 1, day };
};

export const testBudgetData = {
  loans: [
    {
      id: 'loan1',
      name: 'Test Loan 1',
      cadenceAmount: 500,
      amountRemaining: 15000,
      interestRate: 0.05,
      cadence: Cadence.Monthly
    },
    {
      id: 'loan2',
      name: 'Test Loan 2',
      cadenceAmount: 200,
      amountRemaining: 10000,
      interestRate: 0.03,
      cadence: Cadence.Monthly
    }
  ],
  monthlyExpenses: [
    {
      id: 'exp1',
      name: 'Rent',
      cadenceAmount: 2000,
      cadence: Cadence.Monthly
    },
    {
      id: 'exp2',
      name: 'Utilities',
      cadenceAmount: 500,
      cadence: Cadence.Monthly
    },
    {
      id: 'exp3',
      name: 'Groceries',
      cadenceAmount: 100,
      cadence: Cadence.Weekly
    },
    {
      id: 'exp4',
      name: 'Insurance',
      cadenceAmount: 200,
      cadence: Cadence.Annually
    }
  ],
  monthlyIncome: [
    {
      id: '21c453ec-1e49-45e1-9356-8c771173ef5f',
      name: 'Income 1',
      cadenceAmount: 3000,
      cadence: Cadence.Monthly,
      nextPayDate: getNextMonthlyPayDate()
    },
    {
      id: 'b2a2a46a-21dd-479e-bccd-2d824d751899',
      name: 'Income 2',
      cadenceAmount: 100,
      cadence: Cadence.Biweekly,
      nextPayDate: getNextBiweeklyPayDate()
    },
    {
      id: 'da08049e-8fe0-4a42-b30f-25dba36538fb',
      name: 'Income 3',
      cadenceAmount: 1500,
      cadence: Cadence.SpecificDates,
      nextPayDate: getNextSpecificPayDate(),
      specificDates: [10, 25]
    }
  ],
  budgetParameters: {
    currentSavings: 30000,
    currentChecking: 9000,
    desiredDepositAmount: 5000,
    desiredCheckingMin: 10000,
  }
};

describe('Sample Budget Data', () => {
  test('contains valid data structure', () => {
    expect(testBudgetData.loans).toHaveLength(2);
    expect(testBudgetData.monthlyExpenses).toHaveLength(4);
    expect(testBudgetData.monthlyIncome).toHaveLength(3);
    expect(testBudgetData.budgetParameters).toBeDefined();
  });
});
