import { Plant, PlantCategory, SunExposure, WaterNeeds, GrowthRate } from '../types';
import plantsData from '../data/plants.json';
import { getPlantImagePlaceholder } from '../utils/placeholderImages';

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
  // Patch all plants with local placeholder images
  return plants.map(plant => plantService.patchPlantImages(plant));
},

  /**
   * Get a plant by ID
   */
  getPlantById: (id: string): Plant | undefined => {
    const plant = plants.find(plant => plant.id === id);
    if (!plant) return undefined;
    
    // Patch the plant with local placeholder images
    return plantService.patchPlantImages(plant);
  },


  /**
   * Get a random plant
   */
  getRandomPlant: (): Plant => {
    const randomIndex = Math.floor(Math.random() * plants.length);
    return plants[randomIndex];
  },

  /**
   * Get plants by IDs
   */
  getPlantsByIds: (ids: string[]): Plant[] => {
    return plants.filter(plant => ids.includes(plant.id));
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
   * Filter plants by growth rate
   */
  filterByGrowthRate: (growthRate: GrowthRate): Plant[] => {
    return plants.filter(plant => plant.growthRate === growthRate);
  },

  /**
   * Filter plants by maintenance difficulty
   */
  filterByMaintenanceDifficulty: (difficulty: number): Plant[] => {
    return plants.filter(plant => plant.maintenanceDifficulty === difficulty);
  },

  /**
   * Filter plants by tag
   */
  filterByTag: (tag: string): Plant[] => {
    return plants.filter(plant => plant.tags.includes(tag));
  },

  /**
   * Filter plants by height range (in inches)
   */
  filterByHeight: (min: number, max: number): Plant[] => {
    return plants.filter(
      plant => 
        plant.dimensions.mature.height >= min && 
        plant.dimensions.mature.height <= max
    );
  },

  /**
   * Filter plants by width range (in inches)
   */
  filterByWidth: (min: number, max: number): Plant[] => {
    return plants.filter(
      plant => 
        plant.dimensions.mature.width >= min && 
        plant.dimensions.mature.width <= max
    );
  },

  
  /**
   * Patch plant data to use local placeholder images
   */
  patchPlantImages: (plant: Plant): Plant => {
    return {
      ...plant,
      images: {
        thumbnail: {
          src: getPlantImagePlaceholder(plant, 'thumbnail'),
          alt: plant.name
        },
        fullSize: {
          src: getPlantImagePlaceholder(plant, 'fullSize'),
          alt: plant.name
        }
      }
    };
  },
  /**
   * Search plants by name or scientific name
   */
  searchPlants: (query: string): Plant[] => {
    const lowerQuery = query.toLowerCase();
    return plants.filter(
      plant =>
        plant.name.toLowerCase().includes(lowerQuery) ||
        plant.scientificName.toLowerCase().includes(lowerQuery) ||
        plant.description.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter plants by multiple criteria
   */
  filterPlants: (filters: {
    category?: PlantCategory;
    sunExposure?: SunExposure;
    waterNeeds?: WaterNeeds;
    growthRate?: GrowthRate;
    tags?: string[];
    search?: string;
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
    maxMaintenanceDifficulty?: number;
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

      // Check growth rate
      if (filters.growthRate && plant.growthRate !== filters.growthRate) {
        return false;
      }

      // Check maintenance difficulty
      if (filters.maxMaintenanceDifficulty && plant.maintenanceDifficulty > filters.maxMaintenanceDifficulty) {
        return false;
      }

      // Check tags
      if (filters.tags && filters.tags.length > 0) {
        const hasAnyTag = filters.tags.some(tag => plant.tags.includes(tag));
        if (!hasAnyTag) {
          return false;
        }
      }

      // Check height range
      if (filters.minHeight !== undefined && plant.dimensions.mature.height < filters.minHeight) {
        return false;
      }
      if (filters.maxHeight !== undefined && plant.dimensions.mature.height > filters.maxHeight) {
        return false;
      }

      // Check width range
      if (filters.minWidth !== undefined && plant.dimensions.mature.width < filters.minWidth) {
        return false;
      }
      if (filters.maxWidth !== undefined && plant.dimensions.mature.width > filters.maxWidth) {
        return false;
      }

      // Check search query
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        if (
          !plant.name.toLowerCase().includes(lowerQuery) &&
          !plant.scientificName.toLowerCase().includes(lowerQuery) &&
          !plant.description.toLowerCase().includes(lowerQuery) &&
          !plant.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
    return Array.from(categories).sort();
  },

  /**
   * Get all available tags
   */
  getTags: (): string[] => {
    const tags = new Set<string>();
    plants.forEach(plant => {
      plant.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  },

  /**
   * Get all available sun exposure options
   */
  getSunExposureOptions: (): SunExposure[] => {
    const options = new Set<SunExposure>();
    plants.forEach(plant => options.add(plant.sunExposure));
    return Array.from(options).sort();
  },

  /**
   * Get all available water needs options
   */
  getWaterNeedsOptions: (): WaterNeeds[] => {
    const options = new Set<WaterNeeds>();
    plants.forEach(plant => options.add(plant.waterNeeds));
    return Array.from(options).sort();
  },
  
  /**
   * Get all available growth rate options
   */
  getGrowthRateOptions: (): GrowthRate[] => {
    const options = new Set<GrowthRate>();
    plants.forEach(plant => options.add(plant.growthRate));
    return Array.from(options).sort();
  },

  /**
   * Get plant statistics
   */
  getPlantStatistics: () => {
    const categoryCount: Record<string, number> = {};
    const sunExposureCount: Record<string, number> = {};
    const waterNeedsCount: Record<string, number> = {};
    const tagCount: Record<string, number> = {};
    
    plants.forEach(plant => {
      // Count categories
      categoryCount[plant.category] = (categoryCount[plant.category] || 0) + 1;
      
      // Count sun exposures
      sunExposureCount[plant.sunExposure] = (sunExposureCount[plant.sunExposure] || 0) + 1;
      
      // Count water needs
      waterNeedsCount[plant.waterNeeds] = (waterNeedsCount[plant.waterNeeds] || 0) + 1;
      
      // Count tags
      plant.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return {
      totalPlants: plants.length,
      categoryCount,
      sunExposureCount,
      waterNeedsCount,
      tagCount
    };
  },

  /**
   * Get similar plants to a given plant
   */
  getSimilarPlants: (plantId: string, count: number = 3): Plant[] => {
    const targetPlant = plantService.getPlantById(plantId);
    
    if (!targetPlant) return [];
    
    // Create a scoring system for similarity
    const scoredPlants = plants
      .filter(plant => plant.id !== plantId) // Exclude the target plant
      .map(plant => {
        let score = 0;
        
        // Same category
        if (plant.category === targetPlant.category) score += 3;
        
        // Same sun exposure
        if (plant.sunExposure === targetPlant.sunExposure) score += 2;
        
        // Same water needs
        if (plant.waterNeeds === targetPlant.waterNeeds) score += 2;
        
        // Similar height (within 25%)
        const heightDiff = Math.abs(plant.dimensions.mature.height - targetPlant.dimensions.mature.height);
        const heightPercentDiff = heightDiff / targetPlant.dimensions.mature.height;
        if (heightPercentDiff < 0.25) score += 1;
        
        // Similar growth rate
        if (plant.growthRate === targetPlant.growthRate) score += 1;
        
        // Shared tags
        const sharedTags = plant.tags.filter(tag => targetPlant.tags.includes(tag));
        score += sharedTags.length;
        
        return { plant, score };
      })
      .sort((a, b) => b.score - a.score); // Sort by score, highest first
    
    // Return the top N results
    return scoredPlants.slice(0, count).map(item => item.plant);
  },

  /**
   * Get recommended plants for a specific environment
   */
  getRecommendedPlants: (params: {
    sunExposure: SunExposure;
    waterAvailability: WaterNeeds;
    spaceConstraints?: { maxHeight?: number; maxWidth?: number };
    lowMaintenance?: boolean;
  }): Plant[] => {
    const { sunExposure, waterAvailability, spaceConstraints, lowMaintenance } = params;
    
    return plants.filter(plant => {
      // Match sun exposure
      if (plant.sunExposure !== sunExposure) return false;
      
      // For low water availability, only include plants with low water needs
      if (waterAvailability === 'low' && plant.waterNeeds !== 'low') return false;
      
      // For medium water availability, exclude high water needs plants
      if (waterAvailability === 'medium' && plant.waterNeeds === 'high') return false;
      
      // Check space constraints
      if (spaceConstraints) {
        if (spaceConstraints.maxHeight && plant.dimensions.mature.height > spaceConstraints.maxHeight) {
          return false;
        }
        
        if (spaceConstraints.maxWidth && plant.dimensions.mature.width > spaceConstraints.maxWidth) {
          return false;
        }
      }
      
      // Check maintenance level
      if (lowMaintenance && plant.maintenanceDifficulty > 2) {
        return false;
      }
      
      return true;
    });
  }
};