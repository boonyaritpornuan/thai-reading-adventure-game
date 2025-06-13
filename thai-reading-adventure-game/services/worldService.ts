
import { World } from '../types';
import { WORLDS_DATA as DEFAULT_WORLDS_DATA } from '../constants'; // Renaming for clarity

const WORLDS_DATA_KEY = 'readingGameWorldsAanAan';

export const loadWorldsData = (): World[] => {
  const savedData = localStorage.getItem(WORLDS_DATA_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData) as World[];
      // Basic validation: check if it's an array
      if (Array.isArray(parsedData)) {
        // Further validation could be added here to ensure structure matches World[]
        return parsedData;
      }
    } catch (error) {
      console.error("Error parsing worlds data from localStorage:", error);
      // Fallback to default if parsing fails
    }
  }
  // If no saved data or parsing failed, return a deep copy of the default data
  // This ensures the original constant isn't mutated.
  return JSON.parse(JSON.stringify(DEFAULT_WORLDS_DATA));
};

export const saveWorldsData = (worlds: World[]): void => {
  try {
    localStorage.setItem(WORLDS_DATA_KEY, JSON.stringify(worlds));
  } catch (error) {
    console.error("Error saving worlds data to localStorage:", error);
    // Handle potential storage full errors, etc.
  }
};
