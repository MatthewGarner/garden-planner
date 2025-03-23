import { useState, useEffect, useMemo } from 'react';
import { Plant, PlantCategory, SunExposure, WaterNeeds } from '../types';
import { plantService } from '../services';

/**
 * Hook for accessing and filtering plants
 */
export const usePlants = (initialFilters?: {
  category?: PlantCategory;
  sunExposure?: SunExposure;
  waterNeeds?: WaterNeeds;
  tags?: string[];
  search?: string;
}) => {
  const [filters, setFilters] = useState(initialFilters || {});
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  
  // Load all plants on mount
  useEffect(() => {
    const plants = plantService.getAllPlants();
    setAllPlants(plants);
  }, []);
  
  // Get filtered plants based on current filters
  const filteredPlants = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return allPlants;
    }
    
    return plantService.filterPlants(filters);
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
  const updateFilters = (newFilters: Partial<typeof filters>) => {
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