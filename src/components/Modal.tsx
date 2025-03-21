import React, { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (...args: any[]) => void;
  title: string;
  children: ReactNode;
  customActions?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  customActions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {!!customActions
          ? customActions 
          : !!onSubmit && (
            <div className="flex justify-end p-4 border-t">
              <Button color="white" onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
};