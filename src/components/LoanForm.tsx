import React, { useState } from 'react';
import { Loan, Cadence } from '../schema/schema';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { Button } from './Button';

interface LoanFormProps {
  loan?: Loan;
  onSubmit: (loan: Loan) => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({ loan, onSubmit }) => {
  const [name, setName] = useState(loan?.name || '');
  const [amount, setAmount] = useState(loan?.cadenceAmount.toString() || '');
  const [amountRemaining, setAmountRemaining] = useState(loan?.amountRemaining.toString() || '');
  const [interestRate, setInterestRate] = useState(loan?.interestRate ? (loan.interestRate * 100).toString() : '');
  const [cadence, setCadence] = useState(loan?.cadence || Cadence.Monthly);
  const [specificDates, setSpecificDates] = useState(loan?.specificDates?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLoan: Loan = {
      id: loan?.id || '',
      name,
      cadenceAmount: parseFloat(amount),
      amountRemaining: parseFloat(amountRemaining),
      interestRate: parseFloat(interestRate) / 100,
      cadence,
      specificDates: cadence === Cadence.SpecificDates ? specificDates.split(',').map(Number) : undefined
    };
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
      <FormSelect
        label="Cadence"
        id="cadence"
        value={cadence}
        onChange={(value) => setCadence(value as Cadence)}
        options={cadenceOptions}
        required
      />
      <FormInput
        label="Amount due per cadence"
        id="amount"
        value={amount}
        onChange={setAmount}
        required
        pattern="^\d*\.?\d+$"
        title="Please enter a valid positive number"
      />
      <FormInput
        label="Remaining Balance"
        id="amountRemaining"
        value={amountRemaining.toString()}
        onChange={setAmountRemaining}
        required
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
