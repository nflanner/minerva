import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { ExpenseCardType, FinancialItem } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { deleteExpense } from '../services/expenseService';
import { getStoreData, subscribeToStore, updateStoreData } from '../dataStore.ts/dataStore';

export const ExpenseAccordion: React.FC = () => {
  const [expenseData, setExpenseData] = useState<ExpenseCardType | null>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([]);

  const updateExpenseData = useCallback(() => {
    const storeData = getStoreData();
    setExpenseData({
      title: "Monthly Expenses",
      description: "Your recurring monthly expenses",
      monetaryValues: storeData.monthlyExpenses,
      onClick: () => console.log("Adding new monthly expense")
    });
  }, []);

  useEffect(() => {
    updateExpenseData(); // Initial data load
    const unsubscribe = subscribeToStore(updateExpenseData);

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [updateExpenseData]);

  useEffect(() => {
    if (expenseData) {
      setAccordionItems([
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
    }
  }, [expenseData]);

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      console.log(`Expense ${id} deleted successfully`);
      
      // Update the local state and the data store
      const updatedExpenseData = {
        ...expenseData!,
        monetaryValues: expenseData!.monetaryValues.filter((item: FinancialItem) => item.id !== id)
      };
      setExpenseData(updatedExpenseData);
      
      // Update the data store
      const storeData = getStoreData();
      updateStoreData({
        ...storeData,
        monthlyExpenses: updatedExpenseData.monetaryValues
      });
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
