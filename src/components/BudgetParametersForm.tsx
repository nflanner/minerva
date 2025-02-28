import React, { useState, useEffect } from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { getStoreData, subscribeToStore, updateStoreData } from '../dataStore.ts/dataStore';
import { Income, BudgetParameters, Cadence } from '../schema/schema';
import { Month, monthConfig, monthOptions, getDayOptions } from '../helpers/helpers';
import { LocalData } from '../services/dataService';

export const BudgetParametersForm: React.FC = () => {
  const [storeData, setStoreData] = useState(getStoreData());
  const existingParameters = storeData.budgetParameters;

  const [currentSavings, setCurrentSavings] = useState<string>(
    existingParameters?.currentSavings?.toString() || ''
  );
  const [currentChecking, setCurrentChecking] = useState<string>(
    existingParameters?.currentChecking?.toString() || ''
  );
  const [desiredDepositAmount, setDesiredDepositAmount] = useState<string>(
    existingParameters?.desiredDepositAmount?.toString() || ''
  );
  const [desiredCheckingMin, setDesiredCheckingMin] = useState<string>(
    existingParameters?.desiredCheckingMin?.toString() || ''
  );
  const [incomePayDates, setIncomePayDates] = useState<{[key: string]: {month: number, day: number}}>(
    existingParameters?.incomePayDates || {}
  );
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const unsubscribe = subscribeToStore((newData: LocalData) => {
      setStoreData(newData);
      if (Object.keys(incomePayDates).length === 0) {
        const initialDates = newData.monthlyIncome.reduce((acc, income) => {
          acc[income.id] = { month: 0, day: 0 };
          return acc;
        }, {} as {[key: string]: {month: number, day: number}});
        setIncomePayDates(initialDates);
      }
    });
    return () => unsubscribe();
  }, []);

  const getCurrentMonthOptions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
  
    return monthOptions.filter(option => {
      const monthNum = parseInt(option.value);
      
      // For months before or equal to current month, check if any specific dates are still valid
      if (monthNum <= currentMonth) {
        return storeData.monthlyIncome.some(income => 
          income.specificDates?.some(date => 
            (monthNum === currentMonth && date > currentDay) ||
            monthNum > currentMonth
          )
        );
      }
      
      // Show next two months
      return monthNum <= currentMonth + 2;
    });
  };

  const getValidDayOptions = (month: number, income: Income) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    let days = getDayOptions(month);
    
    // If selected month is current month, only show future dates
    if (month === currentMonth) {
      days = days.filter(day => parseInt(day.value) > currentDay);
    }
    
    // Filter by specific dates if they exist
    if (income.specificDates && income.specificDates.length > 0) {
      days = days.filter(day => income.specificDates?.includes(parseInt(day.value)));
    }
    
    return days;
  };

  const handleFormChange = () => {
    const newParameters: BudgetParameters = {
      currentSavings: parseFloat(currentSavings || '0'),
      currentChecking: parseFloat(currentChecking || '0'),
      desiredDepositAmount: parseFloat(desiredDepositAmount || '0'),
      desiredCheckingMin: parseFloat(desiredCheckingMin || '0'),
      incomePayDates
    };

    const updatedData = {
      ...storeData,
      budgetParameters: newParameters
    };

    updateStoreData(updatedData);
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

    handleFormChange();
  };

  return (
    <div className="space-y-4" onChange={handleFormChange}>
      <FormInput
        label="Current Savings"
        id="current-savings"
        value={currentSavings}
        onChange={setCurrentSavings}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormInput
        label="Current Checking"
        id="current-checking"
        value={currentChecking}
        onChange={setCurrentChecking}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormInput
        label="Desired Deposit Amount"
        id="desired-deposit-amount"
        value={desiredDepositAmount}
        onChange={setDesiredDepositAmount}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormInput
        label="Desired Checking Minimum"
        id="desired-checking-minimum"
        value={desiredCheckingMin}
        onChange={setDesiredCheckingMin}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />

      {storeData.monthlyIncome.length > 0 && (
        <div className="space-y-4">
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
        </div>
      )}
    </div>
  );
};
