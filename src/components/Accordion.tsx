import React, { ReactNode } from 'react';

export type AccordionChildType = {
  title;
  content: ReactNode;
  onClick: () => void;
  isOpen: boolean;
};

interface AccordionProps {
  items: AccordionChildType[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className="border-b">
          <button
            className="w-full text-left py-4 px-6 focus:outline-none"
            onClick={item.onClick}
          >
            {item.isOpen ? '▼' : '▶'} {item.title}
          </button>
          {item.isOpen && (
            <div className="py-4 px-6">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
