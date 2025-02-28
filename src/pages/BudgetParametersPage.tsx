import React from 'react';
import { BudgetParametersForm } from '../components/BudgetParametersForm';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { PATHS } from '../constants/paths';

export const BudgetParametersPage: React.FC = () => {
  return (
    <WizardPageWrapper
      title="Budget Parameters"
      description={
        <div>
          <p>Set your budget targets and account parameters:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Current account balances</li>
            <li>Target savings deposit amount</li>
            <li>Minimum checking balance</li>
            <li>Income payment schedules</li>
          </ul>
        </div>
      }
      previousPath={PATHS.LOANS}
      nextPath={PATHS.REVIEW}
      previousLabel="Loans"
      nextLabel="Review"
    >
      <BudgetParametersForm />
    </WizardPageWrapper>
  );
};
