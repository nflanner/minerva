import React, { useState, useEffect, useCallback } from "react";
import { runBudgetScript } from "../helpers/budget";
import { Button } from "./Button";
import { ResultsAccordion } from "./ResultsAccordion";
import { getStoreData, subscribeToStore } from "../dataStore.ts/dataStore";
import { Cadence, Income } from "../schema/schema";
import { LocalData } from "../services/dataService";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { Month, monthConfig, monthOptions, getDayOptions } from "../helpers/helpers";

export const ScriptSection: React.FC = () => {
  const [storeData, setStoreData] = useState<LocalData>(getStoreData());
  const [scriptResults, setScriptResults] = useState<any>(null);
  const [currentSavings, setCurrentSavings] = useState<string | null>(null);
  const [currentChecking, setCurrentChecking] = useState<string | null>(null);
  const [desiredDepositAmount, setDesiredDepositAmount] = useState<string | null>(null);
  const [desiredCheckingMin, setDesiredCheckingMin] = useState<string | null>(null);
  const [incomePayDates, setIncomePayDates] = useState<{[key: string]: {month: number, day: number}}>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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
    event.preventDefault();
    if (isFormValid) {
      const scriptVars = {
        currentSavings: parseFloat(currentSavings!),
        currentChecking: parseFloat(currentChecking!),
        desiredDepositAmount: parseFloat(desiredDepositAmount!),
        desiredCheckingMin: parseFloat(desiredCheckingMin!),
        incomePayDates,
      };
      const results = runBudgetScript(scriptVars);
      setScriptResults(results);
    }
  };

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
      if (numValue >= Month.January && numValue <= Month.December) {
        setIncomePayDates(prev => ({
          ...prev,
          [incomeId]: { ...prev[incomeId], month: numValue }
        }));
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, [errorKey]: 'Please select a valid month' }));
      }
    } else if (field === 'day') {
      const month = incomePayDates[incomeId]?.month || Month.January;
      const maxDays = monthConfig[month as Month].days;
      
      if (numValue >= 1 && numValue <= maxDays) {
        setIncomePayDates(prev => ({
          ...prev,
          [incomeId]: { ...prev[incomeId], day: numValue }
        }));
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({ 
          ...prev, 
          [errorKey]: `Please select a valid day (1-${maxDays})` 
        }));
      }
    }
  };

  // Add these helper functions at the top of the file
  const getCurrentMonthOptions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    // Only show current month and next 2 months
    return monthOptions.filter(option => {
      const monthNum = parseInt(option.value);
      return monthNum >= currentMonth && monthNum <= currentMonth + 2;
    });
  };

  const getValidDayOptions = (month: number, income: Income) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    const days = getDayOptions(month);
    
    // If selected month is current month, only show future dates
    if (month === currentMonth) {
      return days.filter(day => parseInt(day.value) > currentDay);
    }
    
    // For monthly income, only show valid pay dates
    if (income.cadence === Cadence.Monthly && income.specificDates?.length) {
      return days.filter(day => income.specificDates?.includes(parseInt(day.value)));
    }
    
    return days;
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
                <div className="flex flex-col">
                  <span className="font-bold">{income.name}</span>
                  <span className="text-xs text-gray-500">({income.cadence})</span>
                </div>
                <FormSelect
                  label="Month"
                  id={`${income.id}-month`}
                  value={incomePayDates[income.id]?.month.toString()}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'month', value)}
                  options={getCurrentMonthOptions()}
                  required
                  className="w-[200px]"
                />
                <FormSelect
                  label="Day"
                  id={`${income.id}-day`}
                  value={incomePayDates[income.id]?.day.toString()}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'day', value)}
                  options={getValidDayOptions(incomePayDates[income.id]?.month || 1, income)}
                  required
                  className="w-[100px]"
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
