/**
 * Utilities for scale calculations and conversions
 */

import { GardenDimensions, PlantDimensions } from '../types';

// Convert real-world dimensions (feet/inches) to percentage of garden
export const dimensionsToPercentage = (
  dimensions: PlantDimensions,
  gardenDimensions: GardenDimensions
): { width: number; height: number } => {
  // Convert plant dimensions from inches to feet
  const plantWidthInFeet = dimensions.width / 12;
  const plantHeightInFeet = dimensions.height / 12;
  
  // Calculate percentage of garden dimensions
  const widthPercentage = (plantWidthInFeet / gardenDimensions.width) * 100;
  const heightPercentage = (plantHeightInFeet / gardenDimensions.height) * 100;
  
  return {
    width: widthPercentage,
    height: heightPercentage
  };
};

// Convert percentage dimensions to real-world dimensions (inches)
export const percentageToDimensions = (
  widthPercentage: number,
  heightPercentage: number,
  gardenDimensions: GardenDimensions
): PlantDimensions => {
  // Calculate real dimensions in feet
  const widthInFeet = (widthPercentage / 100) * gardenDimensions.width;
  const heightInFeet = (heightPercentage / 100) * gardenDimensions.height;
  
  // Convert to inches
  return {
    width: widthInFeet * 12,
    height: heightInFeet * 12
  };
};

// Calculate plant scale based on reference object
export const calculatePlantScale = (
  referenceObjectSizePixels: number,
  referenceObjectRealSize: number, // in inches
  plantRealSize: number // in inches
): number => {
  // Calculate pixels per inch
  const pixelsPerInch = referenceObjectSizePixels / referenceObjectRealSize;
  
  // Calculate plant size in pixels
  return plantRealSize * pixelsPerInch;
};

// Calculate the size in pixels based on a percentage of the container
export const percentageToPixels = (
  percentage: number,
  containerSizePixels: number
): number => {
  return (percentage / 100) * containerSizePixels;
};

// Calculate percentage of container from pixel dimensions
export const pixelsToPercentage = (
  pixels: number,
  containerSizePixels: number
): number => {
  return (pixels / containerSizePixels) * 100;
};

// Calculate aspect ratio from width and height
export const calculateAspectRatio = (
  width: number,
  height: number
): number => {
  return width / height;
};

// Maintain aspect ratio when resizing
export const maintainAspectRatio = (
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;
  
  if (newWidth && !newHeight) {
    // Calculate height based on new width
    return {
      width: newWidth,
      height: newWidth / aspectRatio
    };
  } else if (!newWidth && newHeight) {
    // Calculate width based on new height
    return {
      width: newHeight * aspectRatio,
      height: newHeight
    };
  } else if (newWidth && newHeight) {
    // Use the provided dimensions
    return {
      width: newWidth,
      height: newHeight
    };
  }
  
  // Default to original dimensions
  return {
    width: originalWidth,
    height: originalHeight
  };
};