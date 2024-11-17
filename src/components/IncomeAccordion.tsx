import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { IncomeCardType } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { deleteIncome } from '../services/incomeServices';

interface IncomeAccordionProps {
  incomeData: IncomeCardType;
}

export const IncomeAccordion: React.FC<IncomeAccordionProps> = ({ incomeData }) => {
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([
    {
      title: incomeData.title,
      content: (
        <MonetaryCard
          title={incomeData.title}
          description={incomeData.description}
          monetaryValues={incomeData.monetaryValues.map(value => (
            <MonetaryNode
              key={value.id}
              item={value}
              onEdit={() => console.log(`Editing income ${value.id}`)}
              onClear={() => handleClear(value.id)}
            />
          ))}
          onClick={incomeData.onClick}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(0)
    }
  ]);

  const handleClear = async (id: string) => {
    try {
      await deleteIncome(id);
      console.log(`Income ${id} deleted successfully`);
      // Refresh the income data here
      // You might want to implement a function to fetch updated income data
      // and update the state accordingly
    } catch (error) {
      console.error(`Error deleting income ${id}:`, error);
    }
  };

  const toggleAccordion = (index: number) => {
    setAccordionItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return <Accordion items={accordionItems} />;
};
