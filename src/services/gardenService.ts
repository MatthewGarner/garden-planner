import { Garden, PlantPosition, GardenDimensions } from '../types';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, saveImageToLocalStorage, getImageFromLocalStorage } from '../utils/storage';
import { generateUUID } from '../utils/general';

// Keys for localStorage
const GARDENS_KEY = 'garden_planner_gardens';
const CURRENT_GARDEN_KEY = 'garden_planner_current_garden';
const GARDEN_IMAGE_PREFIX = 'garden_planner_image_';

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
    this.saveGarden(garden);
    
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
    const gardens = this.getAllGardens();
    
    // Update the garden if it exists, otherwise add it
    const index = gardens.findIndex(g => g.id === garden.id);
    
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
  getAllGardens: (): Garden[] => {
    return getFromLocalStorage<Garden[]>(GARDENS_KEY) || [];
  },

  /**
   * Get a garden by ID
   */
  getGardenById: (id: string): Garden | null => {
    const gardens = this.getAllGardens();
    const garden = gardens.find(g => g.id === id);
    
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
    
    return this.getGardenById(currentGardenId);
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
    const gardens = this.getAllGardens();
    const filteredGardens = gardens.filter(g => g.id !== gardenId);
    
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
   * Add a plant to the garden
   */
  addPlantToGarden: (gardenId: string, plantPosition: Omit<PlantPosition, 'id'>): PlantPosition => {
    const garden = this.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    const newPlantPosition: PlantPosition = {
      ...plantPosition,
      id: generateUUID()
    };
    
    garden.plants.push(newPlantPosition);
    garden.updatedAt = new Date().toISOString();
    
    this.saveGarden(garden);
    
    return newPlantPosition;
  },

  /**
   * Update a plant position in the garden
   */
  updatePlantPosition: (gardenId: string, updatedPlantPosition: PlantPosition): void => {
    const garden = this.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    const index = garden.plants.findIndex(p => p.id === updatedPlantPosition.id);
    
    if (index === -1) {
      throw new Error(`Plant position with ID ${updatedPlantPosition.id} not found in garden`);
    }
    
    garden.plants[index] = updatedPlantPosition;
    garden.updatedAt = new Date().toISOString();
    
    this.saveGarden(garden);
  },

  /**
   * Remove a plant from the garden
   */
  removePlantFromGarden: (gardenId: string, plantPositionId: string): void => {
    const garden = this.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.plants = garden.plants.filter(p => p.id !== plantPositionId);
    garden.updatedAt = new Date().toISOString();
    
    this.saveGarden(garden);
  },

  /**
   * Change the view time of the garden
   */
  setGardenViewTime: (gardenId: string, viewTime: Garden['viewTime']): void => {
    const garden = this.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.viewTime = viewTime;
    
    this.saveGarden(garden);
  },

  /**
   * Update garden dimensions
   */
  updateGardenDimensions: (gardenId: string, dimensions: GardenDimensions): void => {
    const garden = this.getGardenById(gardenId);
    
    if (!garden) {
      throw new Error(`Garden with ID ${gardenId} not found`);
    }
    
    garden.dimensions = dimensions;
    garden.updatedAt = new Date().toISOString();
    
    this.saveGarden(garden);
  }
};