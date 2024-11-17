import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { IncomeCardType, FinancialItem } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { deleteIncome, getIncome } from '../services/incomeServices';
import { getStoreData, subscribeToStore, updateStoreData } from '../dataStore.ts/dataStore';

export const IncomeAccordion: React.FC = () => {
  const [incomeData, setIncomeData] = useState<IncomeCardType | null>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([]);

  const updateIncomeData = useCallback(() => {
    const income = getIncome();
    setIncomeData({
      title: "Monthly Income",
      description: "Your recurring monthly income",
      monetaryValues: income,
      onClick: () => console.log("Adding new monthly income")
    });
  }, []);

  useEffect(() => {
    updateIncomeData(); // Initial data load
    const unsubscribe = subscribeToStore(updateIncomeData);

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [updateIncomeData]);

  useEffect(() => {
    if (incomeData) {
      setAccordionItems([
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
    }
  }, [incomeData]);

  const handleClear = async (id: string) => {
    try {
      await deleteIncome(id);
      console.log(`Income ${id} deleted successfully`);
      
      // Update the local state and the data store
      const updatedIncomeData = {
        ...incomeData!,
        monetaryValues: incomeData!.monetaryValues.filter((item: FinancialItem) => item.id !== id)
      };
      setIncomeData(updatedIncomeData);
      
      // Update the data store
      const storeData = getStoreData();
      updateStoreData({
        ...storeData,
        monthlyIncome: updatedIncomeData.monetaryValues
      });
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
