import React from 'react';
import { Loan, Expense, Income, Cadence } from '../schema/schema';
import { EditDeleteNode } from './EditDeleteNode';

interface OtherMonetaryNodeProps {
  item: Loan | Expense | Income;
  onEdit: (id: string) => void;
  onClear: (id: string) => void;
}

export const MonetaryNode: React.FC<OtherMonetaryNodeProps> = ({ item, onEdit, onClear }) => {
  const hasInterestRate = 'interestRate' in item
  const hasAmountRemaining = 'amountRemaining' in item
  return (
    <EditDeleteNode
      onEdit={() => onEdit(item.id)}
      onClear={() => onClear(item.id)}
    >
      <div className="flex justify-start w-full gap-2">
        <span className="font-bold">{item.name} |</span>
        <span>Amount: ${item.cadenceAmount.toFixed(2)},</span>
        <span>Cadence: {item.cadence}{item.cadence === Cadence.SpecificDates ? ` (${item.specificDates?.join(', ')})` : ""}{hasInterestRate ? "," : ""}</span>
        {hasInterestRate && <span>Interest: {(item.interestRate * 100).toFixed(2)}%</span>}
        {hasAmountRemaining && <span>Total Remaining: ${item.amountRemaining.toFixed(2)}</span>}
      </div>
    </EditDeleteNode>
  );
};
