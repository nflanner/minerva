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
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    updateStoreData(data);
    console.log(`Data successfully prepared for download as ${filename}`);
  } catch (error) {
    console.error('Error preparing data for download:', error);
    throw new Error('Failed to prepare data for download');
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
