import React, { useState } from 'react';
import { Expense, Cadence } from '../schema/schema';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { Button } from './Button';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSubmit }) => {
  const [name, setName] = useState(expense?.name || '');
  const [amount, setAmount] = useState(expense?.cadenceAmount.toString() || '');
  const [cadence, setCadence] = useState(expense?.cadence || Cadence.Monthly);
  const [specificDates, setSpecificDates] = useState(expense?.specificDates?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: expense?.id || '',
      name,
      cadenceAmount: parseFloat(amount),
      cadence,
      specificDates: cadence === Cadence.SpecificDates ? specificDates.split(',').map(Number) : undefined
    };
    onSubmit(newExpense);
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
      <Button type="submit" color="blue" fullWidth>
        Submit
      </Button>
    </form>
  );
};
