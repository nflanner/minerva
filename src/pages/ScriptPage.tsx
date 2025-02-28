import React from 'react';
import { ScriptSection } from '../components/ScriptSection';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { PATHS } from '../constants/paths';

export const ScriptPage: React.FC = () => {
  return (
    <WizardPageWrapper
      title="Budget Analysis"
      description={
        <div>
          <p>Let's analyze your financial data and create a personalized budget plan.</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Enter your current account balances</li>
            <li>Set your desired savings goals</li>
            <li>Specify minimum balance requirements</li>
            <li>Input upcoming payment dates</li>
          </ul>
          <p className="mt-2">This will help generate a comprehensive budget strategy tailored to your needs.</p>
        </div>
      }
      previousPath={PATHS.REVIEW}
      previousLabel="Loans"
      informationSubtitle="Some Final Information to Enter.."
    >
      <ScriptSection />
    </WizardPageWrapper>
  );
};
