import React, { useState } from 'react';
import { Income, Cadence } from '../schema/schema';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface IncomeFormProps {
  income?: Income;
  onSubmit: (income: Income) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSubmit }) => {
  const [name, setName] = useState(income?.name || '');
  const [amount, setAmount] = useState(income?.amount.toString() || '');
  const [cadence, setCadence] = useState(income?.cadence || Cadence.Monthly);
  const [specificDates, setSpecificDates] = useState(income?.specificDates?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome: Income = {
      id: income?.id || '',
      name,
      amount: parseFloat(amount),
      cadence,
      specificDates: cadence === Cadence.SpecificDates ? specificDates.split(',').map(Number) : undefined
    };
    onSubmit(newIncome);
  };

  const cadenceOptions = Object.values(Cadence).map(c => ({ value: c, label: c }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Name"
        id="name"
        value={name}
        onChange={setName}
        required
      />
      <FormInput
        label="Amount"
        id="amount"
        value={amount}
        onChange={setAmount}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormSelect
        label="Cadence"
        id="cadence"
        value={cadence}
        onChange={(value) => setCadence(value as Cadence)}
        options={cadenceOptions}
        required
      />
      {cadence === Cadence.SpecificDates && (
        <FormInput
          label="Specific Dates"
          id="specificDates"
          value={specificDates}
          onChange={setSpecificDates}
          placeholder="e.g., 10, 25"
        />
      )}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </button>
    </form>
  );
};
