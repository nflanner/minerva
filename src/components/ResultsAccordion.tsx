import React, { useEffect } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import Chart from 'chart.js/auto';

interface ResultsAccordionProps {
  scriptResults: {
    billsArray: number[];
    incomeArray: number[];
    checkingArray: number[];
    savingsArray: number[];
  };
}

export const ResultsAccordion: React.FC<ResultsAccordionProps> = ({ scriptResults }) => {
  useEffect(() => {
    const labels = Array.from({ length: 365 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toLocaleDateString();
    });

    // Checking Balance Chart
    const checkingCtx = document.getElementById('checkingChart') as HTMLCanvasElement;
    new Chart(checkingCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Checking Balance',
          data: scriptResults.checkingArray,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Checking Account Projection' }
        }
      }
    });

    // Savings Balance Chart
    const savingsCtx = document.getElementById('savingsChart') as HTMLCanvasElement;
    new Chart(savingsCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Savings Balance',
          data: scriptResults.savingsArray,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Savings Account Projection' }
        }
      }
    });

    // Cash Flow Chart
    const cashFlowCtx = document.getElementById('cashFlowChart') as HTMLCanvasElement;
    new Chart(cashFlowCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: scriptResults.incomeArray,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Bills',
            data: scriptResults.billsArray,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Daily Cash Flow' }
        }
      }
    });
  }, [scriptResults]);

  const resultAccordionItems: AccordionChildType[] = [
    {
      title: "Budget Simulation Results",
      content: (
        <div className="space-y-8 p-4">
          <div className="h-[400px]">
            <canvas id="checkingChart"></canvas>
          </div>
          <div className="h-[400px]">
            <canvas id="savingsChart"></canvas>
          </div>
          <div className="h-[400px]">
            <canvas id="cashFlowChart"></canvas>
          </div>
        </div>
      ),
      isOpen: true,
      onClick: () => {}
    }
  ];

  return <Accordion items={resultAccordionItems} />;
};
