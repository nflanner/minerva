import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface ContentLayoutProps {
  children: ReactNode;
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-20 mb-16 px-4 space-y-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};
