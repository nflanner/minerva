import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { LoanCardType, Loan } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';
import { deleteLoan } from '../services/loanService';
import { Modal } from './Modal';

interface LoanAccordionProps {
  loanData: LoanCardType;
}

export const LoanAccordion: React.FC<LoanAccordionProps> = ({ loanData }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);

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

  const handleAddLoan = () => {
    // Logic for adding a new loan
    console.log('New loan added successfully');
    handleCloseAddModal();
    // Refresh loan data here
  };

  const handleEditLoan = () => {
    if (currentLoan) {
      // Logic for updating the current loan
      console.log(`Loan ${currentLoan.id} updated successfully`);
      handleCloseEditModal();
      // Refresh loan data here
    }
  };

  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>([
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

  const handleClear = async (id: string) => {
    try {
      await deleteLoan(id);
      console.log(`Loan ${id} deleted successfully`);
      // Refresh the loans data here
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
        onSubmit={handleAddLoan}
        title="Add Loan"
      >
        Add loan placeholder
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditLoan}
        title="Edit Loan"
      >
        Edit loan placeholder
      </Modal>
    </>
  );
};