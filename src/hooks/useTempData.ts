import { useEffect, useState } from 'react';
import { validateJsonStructure } from '../helpers/helpers';
import { updateStoreData } from '../dataStore.ts/dataStore';
import { TEMP_DATA_KEY } from '../constants/constants';

export const useTempData = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tempData = localStorage.getItem(TEMP_DATA_KEY);
    if (tempData) {
      try {
        const json = JSON.parse(tempData);
        if (validateJsonStructure(json)) {
          updateStoreData(json);
          console.log("Restored data from previoes session.");
        } else {
          console.error("Invalid JSON structure in localStorage");
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
      localStorage.removeItem(TEMP_DATA_KEY);
    }
    setIsLoading(false);
  }, []);

  return isLoading;
};