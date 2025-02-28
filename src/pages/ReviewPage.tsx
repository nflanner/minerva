import { useNavigate } from "react-router-dom";
import { WizardPageWrapper } from "../components/WizardPageWrapper";
import { getStoreData } from "../dataStore.ts/dataStore";
import React from "react";
import { DataSection } from "../components/DataSection";
import { Button } from "../components/Button";
import { PATHS } from '../constants/paths';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const data = getStoreData();

  return (
    <WizardPageWrapper
      title="Data Review"
      description={
        <div>
          <p>Congratulations! You've completed entering all your financial information.</p>
          <p className="mt-2">Please review your entries below before proceeding to the analysis.</p>
        </div>
      }
      previousPath="/loans"
      informationSubtitle="Review Your Information"
    >
      <div className="space-y-8">
        <DataSection title="Monthly Income" items={data.monthlyIncome} />
        <DataSection title="Monthly Expenses" items={data.monthlyExpenses} />
        <DataSection title="Current Loans" items={data.loans} showInterestRate />

        <div className="flex justify-center space-x-4 mt-8">
          <Button color="grey" onClick={() => navigate(PATHS.BUDGET_PARAMETERS)}>
            Re-enter Data
          </Button>
          <Button color="green" onClick={() => navigate(PATHS.SCRIPT)}>
            Continue to Analysis
          </Button>
        </div>
      </div>
    </WizardPageWrapper>
  );
};
