import React, { ReactNode } from 'react';

interface EditDeleteNodeProps {
  children: ReactNode;
  onEdit: () => void;
  onClear: () => void;
}

export const EditDeleteNode: React.FC<EditDeleteNodeProps> = ({
  children,
  onEdit,
  onClear
}) => {
  return (
    <div className="flex flex-row items-center justify-start space-x-4 mb-2 w-full">
      <div className="flex-grow">{children}</div>
      <button
        onClick={onEdit}
        className="text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
        aria-label="Edit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      <button
        onClick={onClear}
        className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
        aria-label="Clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
