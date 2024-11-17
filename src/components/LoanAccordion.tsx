import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { LoanCardType, Loan } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { addLoan, deleteLoan, getLoans, updateLoan } from '../services/loanService';
import { Modal } from './Modal';
import { subscribeToStore } from '../dataStore.ts/dataStore';
import { LoanForm } from './LoanForm';

export const LoanAccordion: React.FC = () => {
  const [loanData, setLoanData] = useState<LoanCardType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([]);

  const updateLoanData = useCallback(() => {
    const loans = getLoans();
    setLoanData({
      title: "Existing Loans",
      description: "Your current loans",
      monetaryValues: loans,
      onClick: handleOpenAddModal
    });
  }, []);

  useEffect(() => {
    updateLoanData();
    const unsubscribe = subscribeToStore(updateLoanData);
    return () => unsubscribe();
  }, [updateLoanData]);

  useEffect(() => {
    if (loanData) {
      setAccordionItems([
        {
          title: loanData.title,
          content: (
            <MonetaryCard
              title={loanData.title}
              description={loanData.description}
              monetaryValues={loanData.monetaryValues.map(loan => (
                <MonetaryNode
                  key={loan.id}
                  item={loan}
                  onEdit={() => handleOpenEditModal(loan)}
                  onClear={(id) => handleClear(id)}
                />
              ))}
              onClick={handleOpenAddModal}
            />
          ),
          isOpen: true,
          onClick: () => toggleAccordion(0)
        }
      ]);
    }
  }, [loanData]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (loan: Loan) => {
    setCurrentLoan(loan);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentLoan(null);
  };

  const handleAddLoan = async (newLoan: Loan) => {
    try {
      await addLoan(newLoan);
      console.log('New loan added successfully');
      handleCloseAddModal();
      updateLoanData();
    } catch (error) {
      console.error('Error adding new loan:', error);
    }
  };

  const handleEditLoan = async (updatedLoan: Loan) => {
    try {
      await updateLoan(updatedLoan);
      console.log(`Loan ${updatedLoan.id} updated successfully`);
      handleCloseEditModal();
      updateLoanData();
    } catch (error) {
      console.error(`Error updating loan ${updatedLoan.id}:`, error);
    }
  };

  const handleClear = async (id: string) => {
    try {
      await deleteLoan(id);
      console.log(`Loan ${id} deleted successfully`);
      updateLoanData();
    } catch (error) {
      console.error(`Error deleting loan ${id}:`, error);
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
    </>
  );
};
