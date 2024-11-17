import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface ContentLayoutProps {
  children: ReactNode;
  onDataUpload: (data: any) => void;
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({ children, onDataUpload }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onDataUpload={onDataUpload} />
      <main className="flex-grow mt-20 mb-16 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};
