import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { ExpenseCardType } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { deleteExpense } from '../services/expenseService';

interface ExpenseAccordionProps {
  expenseData: ExpenseCardType;
}

export const ExpenseAccordion: React.FC<ExpenseAccordionProps> = ({ expenseData }) => {
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([
    {
      title: expenseData.title,
      content: (
        <MonetaryCard
          title={expenseData.title}
          description={expenseData.description}
          monetaryValues={expenseData.monetaryValues.map(value => (
            <MonetaryNode
              key={value.id}
              item={value}
              onEdit={() => console.log(`Editing expense ${value.id}`)}
              onClear={() => handleDelete(value.id)}
            />
          ))}
          onClick={expenseData.onClick}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(0)
    }
  ]);

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      console.log(`Expense ${id} deleted successfully`);
      // Refresh the expenses data here
      // You might want to implement a function to fetch updated expense data
      // and update the state accordingly
    } catch (error) {
      console.error(`Error deleting expense ${id}:`, error);
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
