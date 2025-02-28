import React, { useState, useCallback, useEffect } from 'react';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { MonetaryCard } from '../components/MonetaryCard';
import { MonetaryNode } from '../components/MonetaryNode';
import { Modal } from '../components/Modal';
import { LoanForm } from '../components/LoanForm';
import { Loan } from '../schema/schema';
import { addLoan, deleteLoan, getLoans, updateLoan } from '../services/loanService';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { PATHS } from '../constants/paths';

export const LoanPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);

  const updateLoanData = useCallback(() => {
    const loanData = getLoans();
    setLoans(loanData);
  }, []);

  useEffect(() => {
    updateLoanData();
    const unsubscribe = subscribeToStore(updateLoanData);
    return () => unsubscribe();
  }, [updateLoanData]);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleOpenEditModal = (loan: Loan) => {
    setCurrentLoan(loan);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentLoan(null);
  };

  const handleAddLoan = async (newLoan: Loan) => {
    await addLoan(newLoan);
    handleCloseAddModal();
    updateLoanData();
  };

  const handleEditLoan = async (updatedLoan: Loan) => {
    await updateLoan(updatedLoan);
    handleCloseEditModal();
    updateLoanData();
  };

  const handleDelete = async (id: string) => {
    await deleteLoan(id);
    updateLoanData();
  };

  return (
    <WizardPageWrapper
      title="Loan Information"
      description={
        <div>
          <p>Enter details about your current loans and debts:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Student loans</li>
            <li>Car loans</li>
            <li>Personal loans</li>
            <li>Credit card debt</li>
            <li>Other outstanding debts</li>
          </ul>
          <p className="mt-2">Include interest rates and payment schedules for accurate analysis.</p>
        </div>
      }
      previousPath={PATHS.EXPENSES}
      nextPath={PATHS.BUDGET_PARAMETERS}
      previousLabel="Expenses"
      nextLabel="Budget Parameters"
    >
      <MonetaryCard
        title="Current Loans"
        description="Your active loans and debts"
        monetaryValues={loans.map(loan => (
          <MonetaryNode
            key={loan.id}
            item={loan}
            onEdit={() => handleOpenEditModal(loan)}
            onClear={() => handleDelete(loan.id)}
          />
        ))}
        onClick={handleOpenAddModal}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Add Loan"
      >
        <LoanForm onSubmit={handleAddLoan} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Loan"
      >
        <LoanForm loan={currentLoan || undefined} onSubmit={handleEditLoan} />
      </Modal>
    </WizardPageWrapper>
  );
};
