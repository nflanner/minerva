import fs from 'fs/promises';
import path from 'path';
import { Loan, FinancialItem } from '../schema/schema';
import { getStoreData, updateStoreData } from '../dataStore.ts/dataStore';

export interface LocalData {
  loans: Loan[];
  monthlyExpenses: FinancialItem[];
  monthlyIncome: FinancialItem[];
}

export const readData = (): LocalData => {
  return getStoreData();
};

export const writeData = async (data: LocalData, filename: string): Promise<void> => {
  const localDataPath = path.join(process.cwd(), 'local-data');
  const filePath = path.join(localDataPath, filename);

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    updateStoreData(data);
    console.log(`Data successfully written to ${filePath}`);
  } catch (error) {
    console.error('Error writing data:', error);
    throw new Error('Failed to write data to file');
  }
};

export const loadDataFromFile = async (filename: string): Promise<void> => {
  const localDataPath = path.join(process.cwd(), 'local-data');
  const filePath = path.join(localDataPath, filename);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as LocalData;
    updateStoreData(data);
    console.log(`Data successfully loaded from ${filePath}`);
  } catch (error) {
    console.error('Error loading data:', error);
    throw new Error('Failed to load data from file');
  }
};
