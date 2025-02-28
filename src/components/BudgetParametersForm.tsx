import React, { useState, useEffect } from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { getStoreData, subscribeToStore, updateStoreData } from '../dataStore.ts/dataStore';
import { Income, BudgetParameters } from '../schema/schema';
import { Month, monthConfig, monthOptions, getDayOptions } from '../helpers/helpers';
import { LocalData } from '../services/dataService';
import { updateIncome } from '../services/incomeServices';

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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const unsubscribe = subscribeToStore((newData: LocalData) => {
      setStoreData(newData);
    });
    return () => unsubscribe();
  }, []);

  const getCurrentMonthOptions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
 
    return monthOptions.filter(option => {
      const monthNum = parseInt(option.value);
     
      if (monthNum <= currentMonth) {
        return storeData.monthlyIncome.some(income =>
          income.specificDates?.some(date =>
            (monthNum === currentMonth && date > currentDay) ||
            monthNum > currentMonth
          )
        );
      }
     
      return monthNum <= currentMonth + 2;
    });
  };

  const getValidDayOptions = (income: Income) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const month = income.nextPayDate?.month || Month.January;
   
    let days = getDayOptions(month);
   
    if (month === currentMonth) {
      days = days.filter(day => parseInt(day.value) > currentDay);
    }
   
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
      desiredCheckingMin: parseFloat(desiredCheckingMin || '0')
    };

    const updatedData = {
      ...storeData,
      budgetParameters: newParameters
    };

    updateStoreData(updatedData);
  };

  const handleIncomePayDateChange = (incomeId: string, field: 'month' | 'day', value: string) => {
    const numValue = value === '' ? 1 : parseInt(value);
    const errorKey = `${incomeId}-${field}`;
    const income = storeData.monthlyIncome.find(inc => inc.id === incomeId);
  
    if (!income) return;
  
    // Ensure nextPayDate is always initialized
    if (!income.nextPayDate) {
      income.nextPayDate = { month: 1, day: 1 };
    }
  
    if (field === 'month') {
      if (numValue >= Month.January && numValue <= Month.December) {
        income.nextPayDate = { ...income.nextPayDate, month: numValue };
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({ ...prev, [errorKey]: 'Please select a valid month' }));
      }
    } else {
      const month = income.nextPayDate.month;
      const maxDays = monthConfig[month as Month].days;
      
      if (numValue >= 1 && numValue <= maxDays) {
        income.nextPayDate = { ...income.nextPayDate, day: numValue };
        setValidationErrors(prev => ({ ...prev, [errorKey]: '' }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          [errorKey]: `Please select a valid day (1-${maxDays})`
        }));
      }
    }
  
    updateIncome(income);
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
                  value={String(income.nextPayDate?.month || '')}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'month', value)}
                  options={getCurrentMonthOptions()}
                  required
                  className="w-[200px]"
                />
                <FormSelect
                  label="Day"
                  id={`${income.id}-day`}
                  value={String(income.nextPayDate?.day || '')}
                  onChange={(value) => handleIncomePayDateChange(income.id, 'day', value)}
                  options={getValidDayOptions(income)}
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
