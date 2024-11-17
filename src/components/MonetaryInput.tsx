import React, { useState } from 'react';
import { validateFilename } from '../helpers/helpers';
import { LoanAccordion } from './LoanAccordion';
import { ExpenseAccordion } from './ExpenseAccordion';
import { IncomeAccordion } from './IncomeAccordion';
import { Modal } from './Modal';
import { writeData } from '../services/dataService';
import { getStoreData } from '../dataStore.ts/dataStore';

export const MonetaryInput: React.FC = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [filenameError, setFilenameError] = useState('');

  const handleSaveClick = () => {
    setIsSaveModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSaveModalOpen(false);
    setFilename('');
    setFilenameError('');
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilename(value);
    if (!validateFilename(value)) {
      setFilenameError('Invalid filename. Use only letters, numbers, underscores, and hyphens, ending with .json');
    } else {
      setFilenameError('');
    }
  };

  const handleSaveSubmit = async () => {
    if (validateFilename(filename)) {
      try {
        const storeData = getStoreData();
        await writeData(storeData, filename);
        console.log('Data saved successfully');
        handleCloseModal();
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return (
    <>
      <LoanAccordion />
      <ExpenseAccordion />
      <IncomeAccordion />
      <button
        onClick={handleSaveClick}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Save Data
      </button>
      <Modal
        isOpen={isSaveModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveSubmit}
        title="Save Data"
      >
        <input
          type="text"
          value={filename}
          onChange={handleFilenameChange}
          placeholder="Enter filename (e.g., my-data.json)"
          className="w-full px-3 py-2 border rounded"
        />
        {filenameError && <p className="text-red-500 mt-1">{filenameError}</p>}
      </Modal>
    </>
  );
};
