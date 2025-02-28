import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardPageWrapper } from '../components/WizardPageWrapper';
import { Button } from '../components/Button';
import { runBudgetScript } from '../helpers/budget';
import { getStoreData } from '../dataStore.ts/dataStore';
import { ResultsAccordion } from '../components/ResultsAccordion';
import { PATHS } from '../constants/paths';

export const ScriptPage: React.FC = () => {
  const navigate = useNavigate();
  const data = getStoreData();
  const [scriptResults, setScriptResults] = useState(null);

  const handleRunScript = () => {
    const results = runBudgetScript(data.budgetParameters);
    setScriptResults(results);
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
        >
          Run Budget Analysis
        </Button>
        
        {scriptResults && <ResultsAccordion scriptResults={scriptResults} />}
      </div>
    </WizardPageWrapper>
  );
};
