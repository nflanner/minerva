import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { IncomeCardType, Income } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { addIncome, deleteIncome, getIncome, updateIncome } from '../services/incomeServices';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { Modal } from './Modal';
import { IncomeForm } from './IncomeForm';

export const IncomeAccordion: React.FC = () => {
  const [incomeData, setIncomeData] = useState<IncomeCardType | null>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);

  const updateIncomeData = useCallback(() => {
    const income = getIncome();
    setIncomeData({
      title: "Monthly Income",
      description: "Your recurring monthly income",
      monetaryValues: income,
      onClick: handleOpenAddModal
    });
  }, []);

  useEffect(() => {
    updateIncomeData();
    const unsubscribe = subscribeToStore(updateIncomeData);
    return () => unsubscribe();
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
                  onEdit={() => handleOpenEditModal(value as Income)}
                  onClear={() => handleClear(value.id)}
                />
              ))}
              onClick={incomeData.onClick}
            />
          ),
          isOpen: false,
          onClick: () => toggleAccordion(0)
        }
      ]);
    }
  }, [incomeData]);

  const handleClear = async (id: string) => {
    try {
      await deleteIncome(id);
      console.log(`Income ${id} deleted successfully`);
      updateIncomeData();
    } catch (error) {
      console.error(`Error deleting income ${id}:`, error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (income: Income) => {
    setCurrentIncome(income);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentIncome(null);
  };

  const handleAddIncome = async (newIncome: Income) => {
    try {
      await addIncome(newIncome);
      console.log('New income added successfully');
      handleCloseAddModal();
      updateIncomeData();
    } catch (error) {
      console.error('Error adding new income:', error);
    }
  };

  const handleEditIncome = async (updatedIncome: Income) => {
    try {
      await updateIncome(updatedIncome);
      console.log(`Income ${updatedIncome.id} updated successfully`);
      handleCloseEditModal();
      updateIncomeData();
    } catch (error) {
      console.error(`Error updating income ${updatedIncome.id}:`, error);
    }
  };

  const toggleAccordion = (index: number) => {
    setAccordionItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <>
      <Accordion items={accordionItems} />
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add Income"
      >
        <IncomeForm onSubmit={handleAddIncome} />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Income"
      >
        <IncomeForm income={currentIncome || undefined} onSubmit={handleEditIncome} />
      </Modal>
    </>
  );
};
