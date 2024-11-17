import React, { useState, useEffect, useCallback } from "react";
import { runBudgetScript } from "../helpers/budget";
import { Button } from "./Button";
import { ResultsAccordion } from "./ResultsAccordion";
import { getStoreData, subscribeToStore } from "../dataStore.ts/dataStore";
import { Income } from "../schema/schema";
import { LocalData } from "../services/dataService";

export const ScriptSection: React.FC = () => {
  const [storeData, setStoreData] = useState<LocalData>(getStoreData());
  const [scriptResults, setScriptResults] = useState<any>(null);
  const [currentSavings, setCurrentSavings] = useState<number | null>(null);
  const [currentChecking, setCurrentChecking] = useState<number | null>(null);
  const [desiredDepositAmount, setDesiredDepositAmount] = useState<number | null>(null);
  const [desiredCheckingMin, setDesiredCheckingMin] = useState<number | null>(null);
  const [incomePayDates, setIncomePayDates] = useState<{[key: string]: {month: number, day: number}}>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const updateStoreData = useCallback(() => {
    const newStoreData = getStoreData();
    setStoreData(newStoreData);
    
    const initialIncomePayDates = newStoreData.monthlyIncome.reduce((acc, income) => {
      acc[income.id] = { month: 0, day: 0 };
      return acc;
    }, {} as {[key: string]: {month: number, day: number}});
    setIncomePayDates(initialIncomePayDates);
  }, []);

  useEffect(() => {
    updateStoreData();
    const unsubscribe = subscribeToStore(updateStoreData);
    return () => unsubscribe();
  }, [updateStoreData]);

  useEffect(() => {
    const initialIncomePayDates = storeData.monthlyIncome.reduce((acc, income) => {
      acc[income.id] = { month: 0, day: 0 };
      return acc;
    }, {} as {[key: string]: {month: number, day: number}});
    setIncomePayDates(initialIncomePayDates);
  }, [storeData.monthlyIncome]);

  useEffect(() => {
    const allFieldsFilled =
      currentSavings !== null &&
      currentChecking !== null &&
      desiredDepositAmount !== null &&
      desiredCheckingMin !== null &&
      desiredCheckingMin > 0 &&
      Object.values(incomePayDates).every(date => date.month > 0 && date.day > 0);

    setIsFormValid(allFieldsFilled);
  }, [currentSavings, currentChecking, desiredDepositAmount, desiredCheckingMin, incomePayDates]);

  const handleRunScript = () => {
    if (isFormValid) {
      const results = runBudgetScript({
        currentSavings: currentSavings!,
        currentChecking: currentChecking!,
        desiredDepositAmount: desiredDepositAmount!,
        desiredCheckingMin: desiredCheckingMin!,
        incomePayDates,
      });
      setScriptResults(results);
    }
  };

  const handleIncomePayDateChange = (incomeId: string, field: 'month' | 'day', value: number) => {
    setIncomePayDates(prev => ({
      ...prev,
      [incomeId]: {
        ...prev[incomeId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Current Savings"
          value={currentSavings || ''}
          onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || null)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Current Checking"
          value={currentChecking || ''}
          onChange={(e) => setCurrentChecking(parseFloat(e.target.value) || null)}
          className="p-2 border rounded"
        />
         <input
          type="number"
          placeholder="Desired Deposit Amount"
          value={desiredDepositAmount || ''}
          onChange={(e) => setDesiredDepositAmount(parseFloat(e.target.value) || null)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Desired Checking Minimum"
          value={desiredCheckingMin || ''}
          onChange={(e) => setDesiredCheckingMin(parseFloat(e.target.value) || null)}
          className="p-2 border rounded"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">Next Pay Dates</h3>
        {storeData.monthlyIncome.map((income: Income) => (
          <div key={income.id} className="flex space-x-2">
            <span>{income.name}:</span>
            <input
              type="number"
              placeholder="Month"
              min={1}
              max={12}
              value={incomePayDates[income.id]?.month || ''}
              onChange={(e) => handleIncomePayDateChange(income.id, 'month', parseInt(e.target.value))}
              className="w-16 p-1 border rounded"
            />
            <input
              type="number"
              placeholder="Day"
              min={1}
              max={31}
              value={incomePayDates[income.id]?.day || ''}
              onChange={(e) => handleIncomePayDateChange(income.id, 'day', parseInt(e.target.value))}
              className="w-16 p-1 border rounded"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleRunScript} color="green" disabled={!isFormValid}>
        Run Budget Script
      </Button>
      {scriptResults && <ResultsAccordion scriptResults={scriptResults} />}
    </div>
  );
};
