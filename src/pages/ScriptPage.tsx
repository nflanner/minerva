import React, { useState } from 'react';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { Button } from '../components/Button';
import { runBudgetScript } from '../helpers/budget';
import { getStoreData } from '../dataStore.ts/dataStore';
import { PATHS } from '../constants/paths';
import { BudgetAnalysis } from '../components/BudgetAnalysis';

interface ScriptResults {
  billsArray: number[];
  incomeArray: number[];
  checkingArray: number[];
  savingsArray: number[];
}

export const ScriptPage: React.FC = () => {
  const data = getStoreData();
  const [scriptResults, setScriptResults] = useState<ScriptResults | null>(null);

  const handleRunScript = () => {
    if (data.budgetParameters) {
      const results = runBudgetScript(data.budgetParameters);
      setScriptResults(results);
    }
  };

  return (
    <WizardPageWrapper
      title="Ready for Analysis"
      description={
        <div>
          <p className="text-xl">Great work! All your financial information has been collected.</p>
          <p className="mt-4">Click below to run your personalized budget analysis.</p>
        </div>
      }
      previousPath={PATHS.REVIEW}
    >
      <div className="space-y-8 text-center">
        <Button 
          color="green" 
          onClick={handleRunScript}
          className="px-8 py-4 text-lg"
          disabled={!data.budgetParameters}
          disabledTooltip="Budget parameters not found"
        >
          Run Budget Analysis
        </Button>
        
        {scriptResults && <BudgetAnalysis results={scriptResults} />}
      </div>
    </WizardPageWrapper>
  );
};
