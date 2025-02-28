import React, { useState, useCallback, useEffect } from 'react';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { MonetaryCard } from '../components/MonetaryCard';
import { MonetaryNode } from '../components/MonetaryNode';
import { Modal } from '../components/Modal';
import { ExpenseForm } from '../components/ExpenseForm';
import { Expense } from '../schema/schema';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../services/expenseService';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { PATHS } from '../constants/paths';

export const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const updateExpenseData = useCallback(() => {
    const expenseData = getExpenses();
    setExpenses(expenseData);
  }, []);

  useEffect(() => {
    updateExpenseData();
    const unsubscribe = subscribeToStore(updateExpenseData);
    return () => unsubscribe();
  }, [updateExpenseData]);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleOpenEditModal = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentExpense(null);
  };

  const handleAddExpense = async (newExpense: Expense) => {
    await addExpense(newExpense);
    handleCloseAddModal();
    updateExpenseData();
  };

  const handleEditExpense = async (updatedExpense: Expense) => {
    await updateExpense(updatedExpense);
    handleCloseEditModal();
    updateExpenseData();
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    updateExpenseData();
  };

  return (
    <WizardPageWrapper
      title="Expense Information"
      description={
        <div>
          <p>Add your recurring monthly expenses. Consider including:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Utilities (electricity, water, gas)</li>
            <li>Rent or mortgage payments</li>
            <li>Insurance premiums</li>
            <li>Subscriptions and memberships</li>
            <li>Regular shopping (groceries, household items)</li>
          </ul>
        </div>
      }
      previousPath={PATHS.INCOME}
      nextPath={PATHS.LOANS}
      previousLabel="Income"
      nextLabel="Loans"
    >
      <MonetaryCard
        title="Monthly Expenses"
        description="Your recurring monthly expenses"
        monetaryValues={expenses.map(expense => (
          <MonetaryNode
            key={expense.id}
            item={expense}
            onEdit={() => handleOpenEditModal(expense)}
            onClear={() => handleDelete(expense.id)}
          />
        ))}
        onClick={handleOpenAddModal}
      />

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
    </WizardPageWrapper>
  );
};
