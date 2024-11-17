import { getStoreData, updateStoreData } from '../dataStore.ts/dataStore';
import { FinancialItem } from '../schema/schema';

export const getIncome = (): FinancialItem[] => {
  const data = getStoreData();
  return data.monthlyIncome;
};

export const addIncome = async (income: FinancialItem): Promise<void> => {
  const data = getStoreData();
  data.monthlyIncome.push(income);
  await updateStoreData(data);
};

export const updateIncome = async (updatedIncome: FinancialItem): Promise<void> => {
  const data = getStoreData();
  const index = data.monthlyIncome.findIndex(income => income.id === updatedIncome.id);
  if (index !== -1) {
    data.monthlyIncome[index] = updatedIncome;
    await updateStoreData(data);
  }
};

export const deleteIncome = async (id: string): Promise<void> => {
  const data = getStoreData();
  data.monthlyIncome = data.monthlyIncome.filter(income => income.id !== id);
  await updateStoreData(data);
};
