import { useState, useEffect, useMemo } from 'react';
import { Plant, PlantCategory, SunExposure, WaterNeeds, GrowthRate } from '../types';
import { plantService } from '../services';

type SortDirection = 'name-asc' | 'name-desc' | 'height-asc' | 'height-desc';

interface PlantFilters {
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
  sort?: SortDirection;
}

/**
 * Hook for accessing and filtering plants
 */
export const usePlants = (initialFilters?: PlantFilters) => {
  const [filters, setFilters] = useState<PlantFilters>(initialFilters || {});
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  
  // Load all plants on mount
  useEffect(() => {
    const plants = plantService.getAllPlants();
    setAllPlants(plants);
  }, []);
  
  // Get filtered plants based on current filters
  const filteredPlants = useMemo(() => {
    // First, filter plants based on criteria
    let filtered = allPlants;
    
    if (Object.keys(filters).length > 0) {
      // Remove sort from filters before passing to plantService.filterPlants
      const { sort, ...filterCriteria } = filters;
      filtered = plantService.filterPlants(filterCriteria);
    }
    
    // Then, sort the filtered plants if a sort option is specified
    if (filters.sort) {
      return [...filtered].sort((a, b) => {
        switch (filters.sort) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'height-asc':
            return a.dimensions.mature.height - b.dimensions.mature.height;
          case 'height-desc':
            return b.dimensions.mature.height - a.dimensions.mature.height;
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [allPlants, filters]);
  
  // Get all available categories
  const categories = useMemo(() => {
    return plantService.getCategories();
  }, [allPlants]);
  
  // Get all available tags
  const tags = useMemo(() => {
    return plantService.getTags();
  }, [allPlants]);
  
  // Update filters
  const updateFilters = (newFilters: Partial<PlantFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };
  
  // Search plants by name or scientific name
  const searchPlants = (query: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: query
    }));
  };
  
  return {
    allPlants,
    filteredPlants,
    filters,
    categories,
    tags,
    updateFilters,
    resetFilters,
    searchPlants
  };
};