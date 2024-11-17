import { getStoreData, updateStoreData } from '../dataStore.ts/dataStore';
import { FinancialItem } from '../schema/schema';

export const getExpenses = (): FinancialItem[] => {
  const data = getStoreData();
  return data.monthlyExpenses;
};

export const addExpense = async (expense: FinancialItem): Promise<void> => {
  const data = getStoreData();
  data.monthlyExpenses.push(expense);
  await updateStoreData(data);
};

export const updateExpense = async (updatedExpense: FinancialItem): Promise<void> => {
  const data = getStoreData();
  const index = data.monthlyExpenses.findIndex(expense => expense.id === updatedExpense.id);
  if (index !== -1) {
    data.monthlyExpenses[index] = updatedExpense;
    await updateStoreData(data);
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  const data = getStoreData();
  data.monthlyExpenses = data.monthlyExpenses.filter(expense => expense.id !== id);
  await updateStoreData(data);
};
