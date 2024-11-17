import React, { useState } from 'react';
import { Accordion, AccordionChildType } from './Accordion';
import { MonetaryCard } from './MonetaryCard';
import { OtherMonetaryCardType } from '../schema/schema';
import { MonetaryNode } from './MonetaryNode';

interface OtherAccordionProps {
  items: OtherMonetaryCardType[];
}

export const OtherAccordion: React.FC<OtherAccordionProps> = ({ items }) => {
  const [accordionItems, setAccordionItems] = useState<AccordionChildType[]>(
    items.map((item, index) => ({
      title: item.title,
      content: (
        <MonetaryCard
          title={item.title}
          description={item.description}
          monetaryValues={item.monetaryValues.map(value => (
            <MonetaryNode
              key={value.id}
              item={value}
              onEdit={() => console.log(`Editing node ${value.id}`)}
              onClear={() => console.log(`Clearing node ${value.id}`)}
            />
          ))}
          onClick={item.onClick}
        />
      ),
      isOpen: true,
      onClick: () => toggleAccordion(index)
    }))
  );

  const toggleAccordion = (index: number) => {
    setAccordionItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return <Accordion items={accordionItems} />;
};
