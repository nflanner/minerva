import React, { useState, useCallback, useEffect } from 'react';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { MonetaryCard } from '../components/MonetaryCard';
import { MonetaryNode } from '../components/MonetaryNode';
import { Modal } from '../components/Modal';
import { IncomeForm } from '../components/IncomeForm';
import { Income } from '../schema/schema';
import { addIncome, deleteIncome, getIncome, updateIncome } from '../services/incomeServices';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { PATHS } from '../constants/paths';

export const IncomePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);

  const updateIncomeData = useCallback(() => {
    const incomeData = getIncome();
    setIncomes(incomeData);
  }, []);

  useEffect(() => {
    updateIncomeData();
    const unsubscribe = subscribeToStore(updateIncomeData);
    return () => unsubscribe();
  }, [updateIncomeData]);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleOpenEditModal = (income: Income) => {
    setCurrentIncome(income);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentIncome(null);
  };

  const handleAddIncome = async (newIncome: Income) => {
    await addIncome(newIncome);
    handleCloseAddModal();
    updateIncomeData();
  };

  const handleEditIncome = async (updatedIncome: Income) => {
    await updateIncome(updatedIncome);
    handleCloseEditModal();
    updateIncomeData();
  };

  const handleDelete = async (id: string) => {
    await deleteIncome(id);
    updateIncomeData();
  };

  throw new Error('Testing error boundary');

  return (
    <WizardPageWrapper
      title="Income Information"
      description={
        <div>
          <p>Start by adding your sources of monthly income. This includes:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Regular salary or wages</li>
            <li>Freelance income</li>
            <li>Investment returns</li>
            <li>Other recurring income sources</li>
          </ul>
        </div>
      }
      previousPath={PATHS.HOME}
      nextPath={PATHS.EXPENSES}
      previousLabel="Home"
      nextLabel="Expenses"
    >
      <MonetaryCard
        title="Monthly Income"
        description="Your recurring monthly income"
        monetaryValues={incomes.map(income => (
          <MonetaryNode
            key={income.id}
            item={income}
            onEdit={() => handleOpenEditModal(income)}
            onClear={() => handleDelete(income.id)}
          />
        ))}
        onClick={handleOpenAddModal}
      />

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
    </WizardPageWrapper>
  );
};
