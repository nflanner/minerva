import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { validateJsonStructure } from '../helpers/helpers';
import { updateStoreData } from '../dataStore.ts/dataStore';
import { PATHS } from '../constants/paths';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetStarted = () => {
    navigate(PATHS.INCOME);
  };

  const handleImport = () => {
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
            navigate(PATHS.REVIEW);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Minerva</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your personal finance companion for budgeting, loan management, and financial planning
        </p>
        
        <div className="text-left max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">How to Use Minerva</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Choose Your Path:</h3>
              <div className="ml-5 mt-2 space-y-4">
                <div>
                  <p className="font-medium text-green-700">New Users - Click "Get Started"</p>
                  <ol className="list-decimal ml-5 mt-2">
                    <li>Enter your monthly income sources</li>
                    <li>Add your recurring monthly expenses</li>
                    <li>Input any existing loans or debts</li>
                    <li>Use our analysis tool to create your budget plan</li>
                  </ol>
                </div>
                
                <div>
                  <p className="font-medium text-blue-700">Returning Users - Click "Import Existing Data"</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Upload your previously exported Minerva data file</li>
                    <li>Skip directly to the analysis stage</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Data Management:</h3>
              <ul className="list-disc ml-5 mt-2">
                <li>Use the export button (↑) in the header to save your data at any time</li>
                <li>Use the import button (↓) to restore previously saved data</li>
                <li>Your data can be reused across sessions for quick updates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Button color="green" onClick={handleGetStarted} className="w-64">
            Get Started
          </Button>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-gray-300 w-20"></div>
            <span className="text-gray-500">OR</span>
            <div className="h-px bg-gray-300 w-20"></div>
          </div>
          <Button color="blue" onClick={handleImport} className="w-64">
            Import Existing Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
