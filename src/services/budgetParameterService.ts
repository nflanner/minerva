import { getStoreData, updateStoreData } from '../dataStore.ts/dataStore';
import { BudgetParameters } from '../schema/schema';

export const getBudgetParameters = (): BudgetParameters | undefined => {
  const data = getStoreData();
  return data.budgetParameters;
};

export const updateBudgetParameters = async (parameters: BudgetParameters): Promise<void> => {
  const data = getStoreData();
  data.budgetParameters = parameters;
  await updateStoreData(data);
};
