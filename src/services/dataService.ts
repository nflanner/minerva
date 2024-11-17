import localData from '../../local-data/local-data.json';
import { Loan, FinancialItem } from '../schema/schema';

export interface LocalData {
  loans: Loan[];
  monthlyExpenses: FinancialItem[];
  monthlyIncome: FinancialItem[];
}

export const readData = (): LocalData => {
  return localData as LocalData;
};

export const writeData = async (data: LocalData): Promise<void> => {
  // This is a placeholder for the actual implementation
  // You'll need to implement this on the server-side
  console.log('Data to be written:', data);
  throw new Error('Writing data is not implemented on the client-side');
};
