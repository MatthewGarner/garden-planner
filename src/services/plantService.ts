import { Plant, PlantCategory, SunExposure, WaterNeeds } from '../types';
import plantsData from '../data/plants.json';

// Type assertion to ensure the imported JSON is treated as an array of Plant objects
const plants = plantsData as Plant[];

/**
 * Service for accessing and filtering plant data
 */
export const plantService = {
  /**
   * Get all plants
   */
  getAllPlants: (): Plant[] => {
    return plants;
  },

  /**
   * Get a plant by ID
   */
  getPlantById: (id: string): Plant | undefined => {
    return plants.find(plant => plant.id === id);
  },

  /**
   * Filter plants by category
   */
  filterByCategory: (category: PlantCategory): Plant[] => {
    return plants.filter(plant => plant.category === category);
  },

  /**
   * Filter plants by sun exposure
   */
  filterBySunExposure: (sunExposure: SunExposure): Plant[] => {
    return plants.filter(plant => plant.sunExposure === sunExposure);
  },

  /**
   * Filter plants by water needs
   */
  filterByWaterNeeds: (waterNeeds: WaterNeeds): Plant[] => {
    return plants.filter(plant => plant.waterNeeds === waterNeeds);
  },

  /**
   * Search plants by name or scientific name
   */
  searchPlants: (query: string): Plant[] => {
    const lowerQuery = query.toLowerCase();
    return plants.filter(
      plant =>
        plant.name.toLowerCase().includes(lowerQuery) ||
        plant.scientificName.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter plants by multiple criteria
   */
  filterPlants: (filters: {
    category?: PlantCategory;
    sunExposure?: SunExposure;
    waterNeeds?: WaterNeeds;
    tags?: string[];
    search?: string;
  }): Plant[] => {
    return plants.filter(plant => {
      // Check category
      if (filters.category && plant.category !== filters.category) {
        return false;
      }

      // Check sun exposure
      if (filters.sunExposure && plant.sunExposure !== filters.sunExposure) {
        return false;
      }

      // Check water needs
      if (filters.waterNeeds && plant.waterNeeds !== filters.waterNeeds) {
        return false;
      }

      // Check tags
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => plant.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }

      // Check search query
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        if (
          !plant.name.toLowerCase().includes(lowerQuery) &&
          !plant.scientificName.toLowerCase().includes(lowerQuery) &&
          !plant.description.toLowerCase().includes(lowerQuery)
        ) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Get all available plant categories
   */
  getCategories: (): PlantCategory[] => {
    const categories = new Set<PlantCategory>();
    plants.forEach(plant => categories.add(plant.category));
    return Array.from(categories);
  },

  /**
   * Get all available tags
   */
  getTags: (): string[] => {
    const tags = new Set<string>();
    plants.forEach(plant => {
      plant.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }
};