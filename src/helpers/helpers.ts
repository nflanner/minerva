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

