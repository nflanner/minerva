import React from 'react';

export const Header: React.FC = () => {
  const onImportClick = () => {
    console.log('Import clicked');
  };
  const onInfoClick = () => {
    console.log('Info clicked');
  };
  return (
    <header className="w-full h-16 bg-gray-800 flex items-center justify-between px-4 fixed top-0 z-10">
      <div className="text-white text-xl font-bold">Minerva</div>
      <div className="flex space-x-4">
        <button className="text-white hover:text-gray-300" onClick={onInfoClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="text-white hover:text-gray-300" onClick={onImportClick}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </header>
  );
};
