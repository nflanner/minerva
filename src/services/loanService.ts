import { getStoreData, updateStoreData } from '../dataStore.ts/dataStore';
import { Loan } from '../schema/schema';

export const getLoans = (): Loan[] => {
  const data = getStoreData();
  return data.loans;
};

export const addLoan = async (loan: Loan): Promise<void> => {
  const data = getStoreData();
  data.loans.push(loan);
  await updateStoreData(data);
};

export const updateLoan = async (updatedLoan: Loan): Promise<void> => {
  const data = getStoreData();
  console.log({ updatedLoan, data });
  const index = data.loans.findIndex(loan => loan.id === updatedLoan.id);
  if (index !== -1) {
    data.loans[index] = updatedLoan;
    await updateStoreData(data);
  }
};

export const deleteLoan = async (id: string): Promise<void> => {
  const data = getStoreData();
  data.loans = data.loans.filter(loan => loan.id !== id);
  await updateStoreData(data);
};
