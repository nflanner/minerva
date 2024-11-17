import { FinancialItem } from '../schema/schema';
import { readData, writeData, LocalData } from './dataService';

export const getIncome = (): FinancialItem[] => {
  const data = readData();
  return data.monthlyIncome;
};

export const addIncome = async (income: FinancialItem): Promise<void> => {
  const data = readData();
  data.monthlyIncome.push(income);
  await writeData(data);
};

export const updateIncome = async (updatedIncome: FinancialItem): Promise<void> => {
  const data = readData();
  const index = data.monthlyIncome.findIndex(income => income.id === updatedIncome.id);
  if (index !== -1) {
    data.monthlyIncome[index] = updatedIncome;
    await writeData(data);
  }
};

export const deleteIncome = async (id: string): Promise<void> => {
  const data = readData();
  data.monthlyIncome = data.monthlyIncome.filter(income => income.id !== id);
  await writeData(data);
};
