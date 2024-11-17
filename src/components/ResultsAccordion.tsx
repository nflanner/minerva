import React from 'react';
import { Accordion, AccordionChildType } from './Accordion';

interface ResultsAccordionProps {
  scriptResults: any;
}

export const ResultsAccordion: React.FC<ResultsAccordionProps> = ({ scriptResults }) => {
  const resultAccordionItems: AccordionChildType[] = [
    {
      title: "Budget Simulation Results",
      content: (
        <div>
          <canvas id="checkingChart"></canvas>
          <canvas id="savingsChart"></canvas>
          <canvas id="totalChart"></canvas>
        </div>
      ),
      isOpen: true,
      onClick: () => {}
    }
  ];

  return <Accordion items={resultAccordionItems} />;
};
