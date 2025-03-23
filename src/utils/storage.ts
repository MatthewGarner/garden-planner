/**
 * Utility functions for browser storage operations
 */

// Generic function to save data to localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };
  
  // Generic function to get data from localStorage
  export const getFromLocalStorage = <T>(key: string): T | null => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error('Error getting data from localStorage:', error);
      return null;
    }
  };
  
  // Function to save an image to localStorage
  export const saveImageToLocalStorage = (key: string, imageDataUrl: string): void => {
    try {
      localStorage.setItem(key, imageDataUrl);
    } catch (error) {
      // If the image is too large for localStorage, try to compress it
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Image too large for localStorage. Consider using IndexedDB for larger files.');
      } else {
        console.error('Error saving image to localStorage:', error);
      }
    }
  };
  
  // Function to get an image from localStorage
  export const getImageFromLocalStorage = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting image from localStorage:', error);
      return null;
    }
  };
  
  // Function to remove data from localStorage
  export const removeFromLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  };
  
  // Check if localStorage is available
  export const isLocalStorageAvailable = (): boolean => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };