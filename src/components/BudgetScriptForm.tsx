import React, { useState } from "react";
import { FormInput } from "./FormInput";
import { Button } from "./Button";
import { Income } from "../schema/schema";

interface FormData {
  currentSavings: number;
  currentChecking: number;
  desiredDepositAmount: number;
  desiredCheckingMin: number;
  incomePayDates: { [key: string]: { month: number; day: number } };
}

interface BudgetScriptFormProps {
  onSubmit: (data: FormData) => void;
  monthlyIncome: Income[];
}

export const BudgetScriptForm: React.FC<BudgetScriptFormProps> = ({ onSubmit, monthlyIncome }) => {
  const [formData, setFormData] = useState<FormData>({
    currentSavings: 0,
    currentChecking: 0,
    desiredDepositAmount: 0,
    desiredCheckingMin: 0,
    incomePayDates: {}
  });

  const handleInputChange = (id: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleIncomePayDateChange = (incomeId: string, field: 'month' | 'day') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      incomePayDates: {
        ...prev.incomePayDates,
        [incomeId]: {
          ...prev.incomePayDates[incomeId],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Current Savings"
          id="currentSavings"
          type="number"
          value={formData.currentSavings.toString()}
          onChange={handleInputChange("currentSavings")}
          placeholder="Enter current savings"
        />
        <FormInput
          label="Current Checking"
          id="currentChecking"
          type="number"
          value={formData.currentChecking.toString()}
          onChange={handleInputChange("currentChecking")}
          placeholder="Enter current checking"
        />
        <FormInput
          label="Desired Deposit Amount"
          id="desiredDepositAmount"
          type="number"
          value={formData.desiredDepositAmount.toString()}
          onChange={handleInputChange("desiredDepositAmount")}
          placeholder="Enter desired deposit amount"
        />
        <FormInput
          label="Desired Checking Minimum"
          id="desiredCheckingMin"
          type="number"
          value={formData.desiredCheckingMin.toString()}
          onChange={handleInputChange("desiredCheckingMin")}
          placeholder="Enter desired checking minimum"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">Next Pay Dates</h3>
        {monthlyIncome.map((income: Income) => (
          <div key={income.id} className="flex space-x-2">
            <span>{income.name}:</span>
            <FormInput
              label={`${income.name} Month`}
              id={`${income.id}-month`}
              type="number"
              value={(formData.incomePayDates[income.id]?.month || '').toString()}
              onChange={handleIncomePayDateChange(income.id, 'month')}
              placeholder="Month"
            />
            <FormInput
              label={`${income.name} Day`}
              id={`${income.id}-day`}
              type="number"
              value={(formData.incomePayDates[income.id]?.day || '').toString()}
              onChange={handleIncomePayDateChange(income.id, 'day')}
              placeholder="Day"
            />
          </div>
        ))}
      </div>
      <Button type="submit" color="green">
        Run Budget Script
      </Button>
    </form>
  );
};
