import { Plant, PlantDimensions } from '../types';

/**
 * Utility functions for working with plants
 */

/**
 * Get dimensions for a plant based on the selected view time
 */
export const getPlantDimensionsForViewTime = (
  plant: Plant,
  viewTime: 'current' | 'year3' | 'year5' | 'mature'
): PlantDimensions => {
  switch (viewTime) {
    case 'year3':
      return plant.dimensions.threeYears;
    case 'year5':
      return plant.dimensions.fiveYears;
    case 'mature':
      return plant.dimensions.mature;
    case 'current':
    default:
      return plant.dimensions.initialYear;
  }
};

/**
 * Format a plant's dimensions as a readable string
 */
export const formatPlantDimensions = (height: number, width: number): string => {
  const heightFeet = Math.floor(height / 12);
  const heightInches = Math.round(height % 12);
  const widthFeet = Math.floor(width / 12);
  const widthInches = Math.round(width % 12);

  const heightStr = heightFeet > 0 
    ? `${heightFeet}'${heightInches > 0 ? ` ${heightInches}"` : ''}` 
    : `${heightInches}"`;
  
  const widthStr = widthFeet > 0 
    ? `${widthFeet}'${widthInches > 0 ? ` ${widthInches}"` : ''}` 
    : `${widthInches}"`;

  return `${heightStr} H × ${widthStr} W`;
};

/**
 * Format sun exposure name for display
 */
export const formatSunExposure = (exposure: string): string => {
  switch (exposure) {
    case 'full-sun':
      return 'Full Sun';
    case 'partial-sun':
      return 'Partial Sun';
    case 'shade':
      return 'Shade';
    default:
      return exposure;
  }
};

/**
 * Format water needs for display
 */
export const formatWaterNeeds = (needs: string): string => {
  switch (needs) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    default:
      return needs;
  }
};

/**
 * Format growth rate for display
 */
export const formatGrowthRate = (rate: string): string => {
  return rate.charAt(0).toUpperCase() + rate.slice(1);
};

/**
 * Format plant's maintenance difficulty level for display
 */
export const formatMaintenanceDifficulty = (level: number): string => {
  switch (level) {
    case 1:
      return 'Easy';
    case 2:
      return 'Moderate';
    case 3:
      return 'Intermediate';
    case 4:
      return 'Difficult';
    case 5:
      return 'Expert';
    default:
      return 'Unknown';
  }
};

/**
 * Get sun exposure icon
 */
export const getSunExposureIcon = (exposure: string): string => {
  switch (exposure) {
    case 'full-sun':
      return '☀️';
    case 'partial-sun':
      return '⛅';
    case 'shade':
      return '🌥️';
    default:
      return '';
  }
};

/**
 * Get water needs icon
 */
export const getWaterNeedsIcon = (needs: string): string => {
  switch (needs) {
    case 'low':
      return '💧';
    case 'medium':
      return '💧💧';
    case 'high':
      return '💧💧💧';
    default:
      return '';
  }
};