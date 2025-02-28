import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { DepositScheduleTable } from './DepositScheduleTable';
import { getStoreData } from '../dataStore.ts/dataStore';

interface BudgetAnalysisProps {
  results: {
    checkingArray: number[];
    savingsArray: number[];
    billsArray: number[];
    incomeArray: number[];
  };
}

export const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ results }) => {
  const checkingChartRef = useRef<HTMLCanvasElement>(null);
  const savingsChartRef = useRef<HTMLCanvasElement>(null);

  const storeData = getStoreData();
  const depositAmount = storeData.budgetParameters?.desiredDepositAmount || 0;

  useEffect(() => {
    if (checkingChartRef.current && savingsChartRef.current) {
      const checkingChart = new Chart(checkingChartRef.current, {
        type: 'line',
        data: {
          labels: Array.from({ length: results.checkingArray.length }, (_, i) => i + 1),
          datasets: [{
            label: 'Checking Balance',
            data: results.checkingArray,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      });

      const savingsChart = new Chart(savingsChartRef.current, {
        type: 'line',
        data: {
          labels: Array.from({ length: results.savingsArray.length }, (_, i) => i + 1),
          datasets: [{
            label: 'Savings Balance',
            data: results.savingsArray,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }]
        }
      });

      return () => {
        checkingChart.destroy();
        savingsChart.destroy();
      };
    }
  }, [results]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4">Checking Account Projection</h3>
        <canvas ref={checkingChartRef} />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Savings Account Projection</h3>
        <canvas ref={savingsChartRef} />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Deposit Schedule</h3>
        <DepositScheduleTable 
          checkingArray={results.checkingArray}
          savingsArray={results.savingsArray}
          desiredDepositAmount={depositAmount}
        />
      </div>
    </div>
  );
};
