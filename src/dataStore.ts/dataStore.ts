import { generateGuid } from "../helpers/helpers";
import { LocalData } from "../services/dataService";

let currentData: LocalData = {
  loans: [],
  monthlyExpenses: [],
  monthlyIncome: []
};

let listeners: (() => void)[] = [];

export const subscribeToStore = (listener: () => void) => {
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
    monthlyIncome: data.monthlyIncome.map(ensureGuid)
  };

  currentData = updatedData;
  listeners.forEach(listener => listener());
};

export const getStoreData = (): LocalData => {
  return currentData;
};
