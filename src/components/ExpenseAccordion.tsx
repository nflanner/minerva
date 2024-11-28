import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { ExpenseCardType, Expense } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../services/expenseService';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { Modal } from './Modal';
import { ExpenseForm } from './ExpenseForm';

export const ExpenseAccordion: React.FC = () => {
  const [expenseData, setExpenseData] = useState<ExpenseCardType | null>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const updateExpenseData = useCallback(() => {
    const monthlyExpenses = getExpenses();
    setExpenseData({
      title: "Monthly Expenses",
      description: "Your recurring monthly expenses",
      monetaryValues: monthlyExpenses,
      onClick: handleOpenAddModal
    });
  }, []);

  useEffect(() => {
    updateExpenseData();
    const unsubscribe = subscribeToStore(updateExpenseData);
    return () => unsubscribe();
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
                  onEdit={() => handleOpenEditModal(value as Expense)}
                  onClear={() => handleDelete(value.id)}
                />
              ))}
              onClick={expenseData.onClick}
            />
          ),
          isOpen: false,
          onClick: () => toggleAccordion(0)
        }
      ]);
    }
  }, [expenseData]);

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      console.log(`Expense ${id} deleted successfully`);
      updateExpenseData();
    } catch (error) {
      console.error(`Error deleting expense ${id}:`, error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentExpense(null);
  };

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      await addExpense(newExpense);
      console.log('New expense added successfully');
      handleCloseAddModal();
      updateExpenseData();
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  const handleEditExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense);
      console.log(`Expense ${updatedExpense.id} updated successfully`);
      handleCloseEditModal();
      updateExpenseData();
    } catch (error) {
      console.error(`Error updating expense ${updatedExpense.id}:`, error);
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
        title="Add Expense"
      >
        <ExpenseForm onSubmit={handleAddExpense} />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Expense"
      >
        <ExpenseForm expense={currentExpense || undefined} onSubmit={handleEditExpense} />
      </Modal>
    </>
  );
};
