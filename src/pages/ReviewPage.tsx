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
  const parameters = data.budgetParameters;

  return (
    <WizardPageWrapper
      title="Data Review"
      description={
        <div>
          <p>Congratulations! You've completed entering all your financial information.</p>
          <p className="mt-2">Please review your entries below before proceeding to the analysis.</p>
        </div>
      }
      previousPath={PATHS.BUDGET_PARAMETERS}
      informationSubtitle="Review Your Information"
    >
      <div className="space-y-8">
        <DataSection title="Monthly Income" items={data.monthlyIncome} />
        <DataSection title="Monthly Expenses" items={data.monthlyExpenses} />
        <DataSection title="Current Loans" items={data.loans} showInterestRate />
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Budget Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold">Current Savings:</span>
              <span className="ml-2">${parameters?.currentSavings?.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold">Current Checking:</span>
              <span className="ml-2">${parameters?.currentChecking?.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold">Desired Deposit Amount:</span>
              <span className="ml-2">${parameters?.desiredDepositAmount?.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold">Desired Checking Minimum:</span>
              <span className="ml-2">${parameters?.desiredCheckingMin?.toFixed(2)}</span>
            </div>
          </div>

          {data.monthlyIncome.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Next Pay Dates</h3>
              <div className="grid gap-2">
                {data.monthlyIncome.map((income) => (
                  <div key={income.id} className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{income.name}</span>
                      <span className="text-xs text-gray-500">({income.cadence})</span>
                    </div>
                    <span className="text-sm">
                      {parameters?.incomePayDates[income.id]?.month}/
                      {parameters?.incomePayDates[income.id]?.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
