import React from 'react';
import { MonetaryCard } from './MonetaryCard';
import { MonetaryNode } from './MonetaryNode';

export const MockMonetaryCardList: React.FC = () => {
  const createMonetaryNode = (id: string, text: string) => (
    <MonetaryNode
      key={id}
      onEdit={() => console.log(`Editing node ${id}`)}
      onClear={() => console.log(`Clearing node ${id}`)}
    >
      {text}
    </MonetaryNode>
  );

  const cards = [
    {
      title: "Monthly Expenses",
      description: "Recurring monthly costs",
      monetaryValues: [
        createMonetaryNode("exp1", "Rent: $1000"),
        createMonetaryNode("exp2", "Utilities: $200"),
        createMonetaryNode("exp3", "Groceries: $400"),
      ],
      onClick: () => console.log("Adding new monthly expense"),
    },
    {
      title: "Savings Goals",
      description: "Financial targets",
      monetaryValues: [
        createMonetaryNode("sav1", "Emergency Fund: $5000"),
        createMonetaryNode("sav2", "Vacation: $2000"),
      ],
      onClick: () => console.log("Adding new savings goal"),
    },
    {
      title: "Investments",
      description: "Current investment portfolio",
      monetaryValues: [
        createMonetaryNode("inv1", "Stocks: $10000"),
        createMonetaryNode("inv2", "Bonds: $5000"),
        createMonetaryNode("inv3", "Crypto: $1000"),
      ],
      onClick: () => console.log("Adding new investment"),
    },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <MonetaryCard
          key={index}
          title={card.title}
          description={card.description}
          monetaryValues={card.monetaryValues}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
};
