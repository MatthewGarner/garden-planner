/**
 * General utility functions
 */

// Generate a random UUID
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  
  // Format date to readable string
  export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Deep clone an object
  export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Debounce function to limit how often a function can be called
  export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ): ((...args: Parameters<F>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<F>): void => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  };
  
  // Throttle function to limit the rate at which a function can fire
  export const throttle = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
  ): ((...args: Parameters<F>) => void) => {
    let waiting = false;
    let lastArgs: Parameters<F> | null = null;
  
    const timeoutFunc = () => {
      if (lastArgs === null) {
        waiting = false;
      } else {
        func(...lastArgs);
        lastArgs = null;
        setTimeout(timeoutFunc, waitFor);
      }
    };
  
    return (...args: Parameters<F>): void => {
      if (waiting) {
        lastArgs = args;
        return;
      }
  
      func(...args);
      waiting = true;
      setTimeout(timeoutFunc, waitFor);
    };
  };
  
  // Convert hex color to rgba
  export const hexToRgba = (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Capitalize first letter of a string
  export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Format number with commas as thousands separators
  export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Check if a value is empty (null, undefined, empty string, empty array, empty object)
  export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  };