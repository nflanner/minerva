import React from 'react';
import { Deposit } from '../schema/schema';

interface DepositScheduleProps {
  depositsArray: Deposit[]
}

export const DepositScheduleTable: React.FC<DepositScheduleProps> = ({
  depositsArray,
}) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Deposit Amount</th>
          <th className="px-4 py-2">Savings Delta</th>
          <th className="px-4 py-2">Checking Delta</th>
          <th className="px-4 py-2">Total Balance</th>
        </tr>
      </thead>
      <tbody>
        {depositsArray.map((deposit, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border px-4 py-2">
              {new Date(Date.now() + (deposit.date * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })}
            </td>
            <td className="border px-4 py-2">${deposit.amount.toFixed(2)}</td>
            <td className="border px-4 py-2">
              ${deposit.savingsBefore.toFixed(2)} → ${deposit.savingsAfter.toFixed(2)}
            </td>
            <td className="border px-4 py-2">
              ${deposit.checkingBefore.toFixed(2)} → ${deposit.checkingAfter.toFixed(2)}
            </td>
            <td className="border px-4 py-2">
              ${(deposit.savingsAfter + deposit.checkingAfter).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
