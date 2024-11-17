import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { LoanCardType } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';

interface LoanAccordionProps {
  loans: LoanCardType[];
}

export const LoanAccordion: React.FC<LoanAccordionProps> = ({ loans }) => {
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>(
    loans.map((loan, index) => ({
      title: loan.title,
      content: (
        <MonetaryCard
          title={loan.title}
          description={loan.description}
          monetaryValues={loan.monetaryValues.map(loan => (
            <MonetaryNode
              key={loan.id}
              item={loan}
              onEdit={(id) => console.log(`Editing loan ${id}`)}
              onClear={(id) => console.log(`Clearing loan ${id}`)}
            />
          ))}
          onClick={loan.onClick}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(index)
    }))
  );

  const toggleAccordion = (index: number) => {
    setAccordionItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return <Accordion items={accordionItems} />;
};
