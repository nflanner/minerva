import React, { ReactNode } from 'react';
import { Button } from './Button';

interface MonetaryCardProps {
  title: ReactNode;
  description: ReactNode;
  monetaryValues: ReactNode[];
  onClick: () => void;
}

export const MonetaryCard: React.FC<MonetaryCardProps> = ({
  title,
  description,
  monetaryValues,
  onClick
}) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      <div className="flex flex-col mb-4">
        {monetaryValues.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            {item}
          </div>
        ))}
      </div>
      <Button
        onClick={onClick}
        color="blue"
      >
        Add
      </Button>
    </div>
  );
};
