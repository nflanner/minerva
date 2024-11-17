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

export const updateStoreData = (newData: LocalData) => {
  currentData = newData;
  listeners.forEach(listener => listener());
  console.log('Data updated:', currentData);
};

export const getStoreData = (): LocalData => {
  return currentData;
};
