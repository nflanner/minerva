import { Loan } from '../schema/schema';
import { readData, writeData, LocalData } from './dataService';

export const getLoans = (): Loan[] => {
  const data = readData();
  return data.loans;
};

export const addLoan = async (loan: Loan): Promise<void> => {
  const data = readData();
  data.loans.push(loan);
  await writeData(data);
};

export const updateLoan = async (updatedLoan: Loan): Promise<void> => {
  const data = readData();
  const index = data.loans.findIndex(loan => loan.id === updatedLoan.id);
  if (index !== -1) {
    data.loans[index] = updatedLoan;
    await writeData(data);
  }
};

export const deleteLoan = async (id: string): Promise<void> => {
  const data = readData();
  data.loans = data.loans.filter(loan => loan.id !== id);
  await writeData(data);
};
