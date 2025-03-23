import { Garden, PlantPosition, GardenDimensions, ScaleReference } from '../types';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, saveImageToLocalStorage, getImageFromLocalStorage } from '../utils/storage';
import { generateUUID } from '../utils/general';
import { calculatePixelsPerInch } from '../utils/scale';

// Keys for localStorage
const GARDENS_KEY = 'garden_planner_gardens';
const CURRENT_GARDEN_KEY = 'garden_planner_current_garden';
const GARDEN_IMAGE_PREFIX = 'garden_planner_image_';

/**
 * Helper function to get all gardens
 */
const getAllGardens = (): Garden[] => {
  return getFromLocalStorage<Garden[]>(GARDENS_KEY) || [];
};

/**
 * Service for managing garden data in local storage
 */
export const gardenService = {
  /**
   * Create a new garden
   */
  createGarden: (name: string, imageUrl: string, dimensions: GardenDimensions): Garden => {
    const garden: Garden = {
      id: generateUUID(),
      name,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dimensions,
      plants: [],
      viewTime: 'current'
    };

    // Save the garden
    gardenService.saveGarden(garden);
    
    // Save the image
    saveImageToLocalStorage(`${GARDEN_IMAGE_PREFIX}${garden.id}`, imageUrl);
    
    // Set as current garden
    saveToLocalStorage(CURRENT_GARDEN_KEY, garden.id);
    
    return garden;
  },

  /**
   * Save a garden
   */
  saveGarden: (garden: Garden): void => {
    const gardens = getAllGardens();
    
    // Update the garden if it exists, otherwise add it
    const index = gardens.findIndex((g: Garden) => g.id === garden.id);
    
    if (index !== -1) {
      gardens[index] = {
        ...garden,
        updatedAt: new Date().toISOString()
      };
    } else {
      gardens.push(garden);
    }
    
    saveToLocalStorage(GARDENS_KEY, gardens);
  },

  /**
   * Get all gardens
   */
  getAllGardens,

  /**
   * Get a garden by ID
   */
  getGardenById: (id: string): Garden | null => {
    const gardens = getAllGardens();
    const garden = gardens.find((g: Garden) => g.id === id);
    
    if (!garden) {
      return null;
    }
    
    // Retrieve the garden image
    const imageUrl = getImageFromLocalStorage(`${GARDEN_IMAGE_PREFIX}${garden.id}`);
    
    if (imageUrl) {
      garden.imageUrl = imageUrl;
    }
    
    return garden;
  },

  /**
   * Get the current garden
   */
  getCurrentGarden: (): Garden | null => {
    const currentGardenId = getFromLocalStorage<string>(CURRENT_GARDEN_KEY);
    
    if (!currentGardenId) {
      return null;
    }
    
    return gardenService.getGardenById(currentGardenId);
  },

  /**
   * Set the current garden
   */
  setCurrentGarden: (gardenId: string): void => {
    saveToLocalStorage(CURRENT_GARDEN_KEY, gardenId);
  },

  /**
   * Delete a garden
   */
  deleteGarden: (gardenId: string): void => {
    const gardens = getAllGardens();
    const filteredGardens = gardens.filter((g: Garden) => g.id !== gardenId);
    
    saveToLocalStorage(GARDENS_KEY, filteredGardens);
    
    // Remove the garden image
    removeFromLocalStorage(`${GARDEN_IMAGE_PREFIX}${gardenId}`);
    
    // Clear current garden if it's the one being deleted
    const currentGardenId = getFromLocalStorage<string>(CURRENT_GARDEN_KEY);
    if (currentGardenId === gardenId) {
      removeFromLocalStorage(CURRENT_GARDEN_KEY);
    }
  },

  /**
   * Set scale reference for a garden
   */
  setScaleReference: (gardenId: string, scaleRef: { width: number; height: number; realWidth: number }): Garden | null => {
    const garden = gardenService.getGardenById(gardenId);
    
    if (!garden) {
      return null;
    }
    
    const pixelsPerInch = calculatePixelsPerInch(scaleRef.width, scaleRef.realWidth);
    
    const scaleReference: ScaleReference = {
      ...scaleRef,
      pixelsPerInch
    };
    
    const updatedGarden: Garden = {
      ...garden,
      scaleReference,
      updatedAt: new Date().toISOString()
    };
    
    gardenService.saveGarden(updatedGarden);
    
    return updatedGarden;
  },

  /**
   * Add a plant to the garden
   */
  addPlantToGarden: (gardenId: string, plantPosition: Omit<PlantPosition, 'id'>): PlantPosition => {
    const garden = gardenService.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    const newPlantPosition: PlantPosition = {
      ...plantPosition,
      id: generateUUID()
    };
    
    garden.plants.push(newPlantPosition);
    garden.updatedAt = new Date().toISOString();
    
    gardenService.saveGarden(garden);
    
    return newPlantPosition;
  },

 /**
 * Update a plant position in the garden
 */
updatePlantPosition: (gardenId: string, updatedPlantPosition: PlantPosition): void => {
  const garden = gardenService.getGardenById(gardenId);
  
  if (!garden) {
    throw new Error(`Garden with ID ${gardenId} not found`);
  }
  
  const index = garden.plants.findIndex((p: PlantPosition) => p.id === updatedPlantPosition.id);
  
  if (index === -1) {
    // Instead of throwing an error, just add the plant if it doesn't exist
    console.warn(`Plant position with ID ${updatedPlantPosition.id} not found in garden, adding it instead`);
    garden.plants.push(updatedPlantPosition);
  } else {
    garden.plants[index] = updatedPlantPosition;
  }
  
  garden.updatedAt = new Date().toISOString();
  
  gardenService.saveGarden(garden);
},

  /**
   * Remove a plant from the garden
   */
  removePlantFromGarden: (gardenId: string, plantPositionId: string): void => {
    const garden = gardenService.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.plants = garden.plants.filter((p: PlantPosition) => p.id !== plantPositionId);
    garden.updatedAt = new Date().toISOString();
    
    gardenService.saveGarden(garden);
  },

  /**
   * Change the view time of the garden
   */
  setGardenViewTime: (gardenId: string, viewTime: Garden['viewTime']): void => {
    const garden = gardenService.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.viewTime = viewTime;
    
    gardenService.saveGarden(garden);
  },

  /**
   * Update garden dimensions
   */
  updateGardenDimensions: (gardenId: string, dimensions: GardenDimensions): void => {
    const garden = gardenService.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.dimensions = dimensions;
    garden.updatedAt = new Date().toISOString();
    
    gardenService.saveGarden(garden);
  }
};