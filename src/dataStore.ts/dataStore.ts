import { generateGuid } from "../helpers/helpers";
import { LocalData } from "../services/dataService";

let currentData: LocalData = {
  loans: [],
  monthlyExpenses: [],
  monthlyIncome: [],
  budgetParameters: undefined
};


let listeners: ((data: LocalData) => void)[] = [];

export const subscribeToStore = (listener: (data: LocalData) => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export const updateStoreData = (data: LocalData): void => {
  const ensureGuid = (item: any) => ({
    ...item,
    id: item.id || generateGuid()
  });

  const updatedData = {
    ...data,
    loans: data.loans.map(ensureGuid),
    monthlyExpenses: data.monthlyExpenses.map(ensureGuid),
    monthlyIncome: data.monthlyIncome.map(ensureGuid),
    budgetParameters: data.budgetParameters
  };

  currentData = updatedData;
  listeners.forEach(listener => listener(currentData));
};

export const getStoreData = (): LocalData => {
  return currentData;
};
