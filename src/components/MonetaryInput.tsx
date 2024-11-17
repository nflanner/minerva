import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { MonetaryNode } from './MonetaryNode';

export const MonetaryInput: React.FC = () => {
  const createMonetaryNode = (id: string, text: string) => (
    <MonetaryNode
      key={id}
      onEdit={() => console.log(`Editing node ${id}`)}
      onClear={() => console.log(`Clearing node ${id}`)}
    >
      {text}
    </MonetaryNode>
  );

  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([
    {
      title: "Existing Loans",
      content: (
        <MonetaryCard
          title="Loan Details"
          description="Your current loans"
          monetaryValues={[
            createMonetaryNode("loan1", "Mortgage: $200,000"),
            createMonetaryNode("loan2", "Car Loan: $15,000"),
          ]}
          onClick={() => console.log("Adding new loan")}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(0)
    },
    {
      title: "Recurring Bills",
      content: (
        <MonetaryCard
          title="Monthly Bills"
          description="Regular monthly expenses"
          monetaryValues={[
            createMonetaryNode("bill1", "Electricity: $100"),
            createMonetaryNode("bill2", "Internet: $50"),
            createMonetaryNode("bill3", "Phone: $40"),
          ]}
          onClick={() => console.log("Adding new bill")}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(1)
    },
    {
      title: "Income",
      content: (
        <MonetaryCard
          title="Income Sources"
          description="Your regular income"
          monetaryValues={[
            createMonetaryNode("inc1", "Salary: $5000"),
            createMonetaryNode("inc2", "Freelance: $1000"),
          ]}
          onClick={() => console.log("Adding new income source")}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(2)
    },
    {
      title: "Other",
      content: (
        <MonetaryCard
          title="Miscellaneous"
          description="Other financial items"
          monetaryValues={[
            createMonetaryNode("other1", "Savings: $10,000"),
            createMonetaryNode("other2", "Investments: $20,000"),
          ]}
          onClick={() => console.log("Adding new item")}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(3)
    },
  ]);

  const toggleAccordion = (index: number) => {
    setAccordionItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return <Accordion items={accordionItems} />;
};
