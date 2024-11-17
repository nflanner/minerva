import React from 'react';
import { LoanAccordion } from './LoanAccordion';
import { OtherAccordion } from './OtherAccordion';
import { getLoanList, getOtherMonetaryList } from '../helpers/helpers';

export const MonetaryInput: React.FC = () => {
  const loans = getLoanList();
  const otherItems = getOtherMonetaryList();

  return (
    <>
      <LoanAccordion loans={loans} />
      <OtherAccordion items={otherItems} />
    </>
  );
};
