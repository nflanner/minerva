import React, { useState, useEffect, useCallback } from "react";
import { runBudgetScript } from "../helpers/budget";
import { Button } from "./Button";
import { ResultsAccordion } from "./ResultsAccordion";
import { getStoreData, subscribeToStore } from "../dataStore.ts/dataStore";
import { Income } from "../schema/schema";
import { LocalData } from "../services/dataService";
import { FormInput } from "./FormInput";
import { monthDays } from "../helpers/records";

export const ScriptSection: React.FC = () => {
  const [storeData, setStoreData] = useState<LocalData>(getStoreData());
  const [scriptResults, setScriptResults] = useState<any>(null);
  const [currentSavings, setCurrentSavings] = useState<string | null>(null);
  const [currentChecking, setCurrentChecking] = useState<string | null>(null);
  const [desiredDepositAmount, setDesiredDepositAmount] = useState<string | null>(null);
  const [desiredCheckingMin, setDesiredCheckingMin] = useState<string | null>(null);
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
      parseFloat(desiredCheckingMin) > 0 &&
      Object.values(incomePayDates).every(date => date.month > 0 && date.day > 0);

    setIsFormValid(allFieldsFilled);
  }, [currentSavings, currentChecking, desiredDepositAmount, desiredCheckingMin, incomePayDates]);

  const handleRunScript = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    if (isFormValid) {
      const scriptVars = {
        currentSavings: parseFloat(currentSavings!),
        currentChecking: parseFloat(currentChecking!),
        desiredDepositAmount: parseFloat(desiredDepositAmount!),
        desiredCheckingMin: parseFloat(desiredCheckingMin!),
        incomePayDates,
      };
      console.log(scriptVars);
      const scriptResults = runBudgetScript(scriptVars);
      console.log(scriptResults);
      // Uncomment the following lines when ready to run the actual script
      // const results = runBudgetScript(scriptVars);
      // setScriptResults(results);
    }
  };

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleIncomePayDateChange = (incomeId: string, field: 'month' | 'day', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    const errorKey = `${incomeId}-${field}`;
  
    if (value === '') {
      setIncomePayDates(prev => ({
        ...prev,
        [incomeId]: { ...prev[incomeId], [field]: 0 }
      }));
      setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
    } else if (field === 'month') {
      if (numValue >= 1 && numValue <= 12) {
        setIncomePayDates(prev => ({
          ...prev,
          [incomeId]: { ...prev[incomeId], month: numValue }
        }));
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, [errorKey]: 'Please enter a valid month (1-12)' }));
      }
    } else if (field === 'day') {
      const month = incomePayDates[incomeId]?.month || 1;
      if (numValue >= 1 && numValue <= monthDays[month]) {
        setIncomePayDates(prev => ({
          ...prev,
          [incomeId]: { ...prev[incomeId], day: numValue }
        }));
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, [errorKey]: `Please enter a valid day (1-${monthDays[month]})` }));
      }
    }
  };

  return (
    <form onSubmit={handleRunScript} className="space-y-4">
      <FormInput
        label="Current Savings"
        id="current-savings"
        value={currentSavings || ''}
        onChange={setCurrentSavings}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormInput
        label="Current Checking"
        id="current-checking"
        value={currentChecking || ''}
        onChange={setCurrentChecking}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />

      <FormInput
        label="Desired Deposit Amount"
        id="desired-deposit-amount"
        value={desiredDepositAmount || ''}
        onChange={setDesiredDepositAmount}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />

      <FormInput
        label="Desired Checking Minimum"
        id="desired-checking-minimum"
        value={desiredCheckingMin || ''}
        onChange={setDesiredCheckingMin}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />

      {storeData.monthlyIncome.length > 0 && (
        <>
          <h3 className="font-bold">Next Pay Dates</h3>
          {storeData.monthlyIncome.map((income: Income) => (
            <div key={income.id}>
              <div className="flex flex-row items-end space-x-4">
                <span className="font-bold pb-3">{income.name}:</span>
                <FormInput
                  label="Month"
                  id={`${income.id}-month`}
                  value={incomePayDates[income.id]?.month.toString() || ''}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'month', value)}
                  required
                  className="w-[50px]"
                />
                <FormInput
                  label="Day"
                  id={`${income.id}-day`}
                  value={incomePayDates[income.id]?.day.toString() || ''}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'day', value)}
                  required
                  className="w-[50px]"
                />
              </div>
              {(validationErrors[`${income.id}-month`] || validationErrors[`${income.id}-day`]) && (
                <span className="text-red-500 text-xs text-center">
                  {validationErrors[`${income.id}-month`] || validationErrors[`${income.id}-day`]}
                </span>
              )}
            </div>
          ))}
        </>
      )}

      <Button type="submit" color="green" disabled={!isFormValid} disabledTooltip="Please fill in all fields">
        Run Budget Script
      </Button>
      {scriptResults && <ResultsAccordion scriptResults={scriptResults} />}
    </form>
  );
};
