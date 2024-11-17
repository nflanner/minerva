import { FinancialItem } from '../schema/schema';
import { readData, writeData, LocalData } from './dataService';

export const getExpenses = (): FinancialItem[] => {
  const data = readData();
  return data.monthlyExpenses;
};

export const addExpense = async (expense: FinancialItem): Promise<void> => {
  const data = readData();
  data.monthlyExpenses.push(expense);
  await writeData(data);
};

export const updateExpense = async (updatedExpense: FinancialItem): Promise<void> => {
  const data = readData();
  const index = data.monthlyExpenses.findIndex(expense => expense.id === updatedExpense.id);
  if (index !== -1) {
    data.monthlyExpenses[index] = updatedExpense;
    await writeData(data);
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  const data = readData();
  data.monthlyExpenses = data.monthlyExpenses.filter(expense => expense.id !== id);
  await writeData(data);
};
