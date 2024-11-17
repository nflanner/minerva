import { Loan, Cadence, FinancialItem, LoanCardType, OtherMonetaryCardType } from "../schema/schema";

export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getLoanList = (): LoanCardType[] => {
  const loans: Loan[] = [
    { id: generateGuid(), name: "Loan 1", amount: 200000, interestRate: 0.035, cadence: Cadence.Monthly },
    { id: generateGuid(), name: "Loan 2", amount: 15000, interestRate: 0.045, cadence: Cadence.Biweekly },
  ];

  return [
    {
      title: "Existing Loans",
      description: "Your current loans",
      monetaryValues: loans,
      onClick: () => console.log("Adding new loan"),
    },
  ];
};

export const getOtherMonetaryList = (): OtherMonetaryCardType[] => {
  return [
    {
      title: "Monthly Expenses",
      description: "Recurring monthly costs",
      monetaryValues: [
        { id: generateGuid(), name: "Expense 1", amount: 1000, cadence: Cadence.Monthly },
        { id: generateGuid(), name: "Expense 2", amount: 200, cadence: Cadence.Monthly },
        { id: generateGuid(), name: "Expense 3", amount: 400, cadence: Cadence.Monthly },
      ],
      onClick: () => console.log("Adding new monthly expense"),
    },
    {
      title: "Monthly Income",
      description: "Reccuring monthly income",
      monetaryValues: [
        { id: generateGuid(), name: "Income 1", amount: 5000, cadence: Cadence.Biweekly },
        { id: generateGuid(), name: "Income 2", amount: 2000, cadence: Cadence.Monthly },
        { id: generateGuid(), name: "Income 3", amount: 2000, cadence: Cadence.SpecificDates, specificDates: [10, 25] },
      ],
      onClick: () => console.log("Adding new monthly income"),
    },
  ];
};
