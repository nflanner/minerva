import React from 'react';

interface DepositScheduleProps {
  checkingArray: number[];
  savingsArray: number[];
  desiredDepositAmount: number;
}

export const DepositScheduleTable: React.FC<DepositScheduleProps> = ({
  checkingArray,
  savingsArray,
  desiredDepositAmount
}) => {
  const deposits = checkingArray.reduce((acc, checking, index) => {
    if (index > 0) {
      const checkingDifference = checkingArray[index - 1] - checking;
      const savingsDifference = savingsArray[index] - savingsArray[index - 1];
      
      if (checkingDifference > 0 && savingsDifference > 0) {
        acc.push({
          date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString(),
          depositAmount: savingsDifference,
          savingsBefore: savingsArray[index - 1],
          savingsAfter: savingsArray[index],
          checkingBefore: checkingArray[index - 1],
          checkingAfter: checkingArray[index]
        });
      }
    }
    return acc;
  }, [] as Array<{
    date: string;
    depositAmount: number;
    savingsBefore: number;
    savingsAfter: number;
    checkingBefore: number;
    checkingAfter: number;
  }>);

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
        {deposits.map((deposit, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border px-4 py-2">{deposit.date}</td>
            <td className="border px-4 py-2">${deposit.depositAmount.toFixed(2)}</td>
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
