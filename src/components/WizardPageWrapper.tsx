import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface WizardPageWrapperProps {
  children: React.ReactNode;
  title: string;
  description: React.ReactNode;
  previousPath?: string;
  nextPath?: string;
  overviewSubtitle?: string;
  informationSubtitle?: string;
  previousLabel?: string;
  nextLabel?: string;
}

export const WizardPageWrapper: React.FC<WizardPageWrapperProps> = ({
  children,
  title,
  description,
  previousPath,
  nextPath,
  overviewSubtitle = 'Overview',
  informationSubtitle = 'Enter Information',
  previousLabel = 'Previous',
  nextLabel = 'Next'
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] relative w-full">
      {/* this is janky as hell - fix the padding for the fixed title/buttons section */}
      <div className="flex justify-between items-center mb-6 fixed top-16 w-full bg-white z-10 pr-12 pt-4 pb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex space-x-4">
          {previousPath && (
            <Button color="grey" onClick={() => navigate(previousPath)}>
              ← {previousLabel}
            </Button>
          )}
          {nextPath && (
            <Button color="green" onClick={() => navigate(nextPath)}>
              {nextLabel} →
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">{overviewSubtitle}</h2>
        <div className="text-gray-600">
          {description}
        </div>
      </div>
      <div className="pb-16">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{informationSubtitle}</h2>
        {children}
      </div>
    </div>
  );
};
