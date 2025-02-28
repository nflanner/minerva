import React from 'react';

interface DataItem {
  id: string;
  name: string;
  cadenceAmount: number;
  amountRemaining?: number;
  interestRate?: number;
}

interface DataSectionProps {
  title: string;
  items: DataItem[];
  showInterestRate?: boolean;
}

export const DataSection: React.FC<DataSectionProps> = ({ title, items, showInterestRate = false }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div>
        {items.map((item, index) => (
          <div key={item.id}>
            {index === 0 && <div className="border-t border-gray-200" />}
            <div className="flex justify-between py-2 hover:bg-blue-50 transition-colors duration-150 px-2">
              <span>{item.name}</span>
              <span>
                ${item.cadenceAmount}
                {showInterestRate && item.interestRate && ` @ ${item.interestRate}%`}
                {showInterestRate && item.amountRemaining && ` ($${item.amountRemaining} remaining)`}
              </span>
            </div>
            <div className="border-t border-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

