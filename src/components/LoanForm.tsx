import React, { useState } from 'react';
import { Loan, Cadence } from '../schema/schema';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface LoanFormProps {
  loan?: Loan;
  onSubmit: (loan: Loan) => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({ loan, onSubmit }) => {
  const [name, setName] = useState(loan?.name || '');
  const [amount, setAmount] = useState(loan?.amount.toString() || '');
  const [interestRate, setInterestRate] = useState(loan?.interestRate ? (loan.interestRate * 100).toString() : '');
  const [cadence, setCadence] = useState(loan?.cadence || Cadence.Monthly);
  const [specificDates, setSpecificDates] = useState(loan?.specificDates?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: Loan = {
      id: loan?.id || '',
      name,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate) / 100,
      cadence,
      specificDates: cadence === Cadence.SpecificDates ? specificDates.split(',').map(Number) : undefined
    };
    console.log({ newLoan });
    onSubmit(newLoan);
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
      <FormInput
        label="Interest Rate (%)"
        id="interestRate"
        value={interestRate}
        onChange={setInterestRate}
        required
        pattern="^(0|[1-9]\d?)(\.\d{1,2})?$|^100(\.0{1,2})?$"
        title="Please enter a number between 0 and 100 with up to 2 decimal places"
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