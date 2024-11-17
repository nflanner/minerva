import React, { useRef } from 'react';
import { validateJsonStructure } from '../helpers/helpers';
import { updateStoreData } from '../dataStore.ts/dataStore';

export const Header: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (validateJsonStructure(json)) {
            updateStoreData(json);
            console.log("Valid JSON structure uploaded");
          } else {
            console.error("Invalid JSON structure");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />
      </div>
    </header>
  );
};
