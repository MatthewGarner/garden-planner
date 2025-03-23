import { useState, useEffect, useCallback } from 'react';
import { Garden, GardenDimensions, PlantPosition } from '../types';
import { gardenService } from '../services';
import { generateUUID } from '../utils/general';

/**
 * Hook for managing garden data
 */
export const useGarden = (gardenId?: string) => {
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load garden data
  useEffect(() => {
    const loadGarden = () => {
      setLoading(true);
      setError(null);
      
      try {
        let loadedGarden: Garden | null = null;
        
        if (gardenId) {
          // Load specific garden
          loadedGarden = gardenService.getGardenById(gardenId);
          
          if (!loadedGarden) {
            setError(`Garden with ID ${gardenId} not found`);
          }
        } else {
          // Load current garden
          loadedGarden = gardenService.getCurrentGarden();
        }
        
        setGarden(loadedGarden);
      } catch (err) {
        setError('Failed to load garden data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadGarden();
  }, [gardenId]);
  
  // Create a new garden
  const createGarden = useCallback((name: string, imageUrl: string, dimensions: GardenDimensions) => {
    try {
      const newGarden = gardenService.createGarden(name, imageUrl, dimensions);
      setGarden(newGarden);
      return newGarden;
    } catch (err) {
      setError('Failed to create garden');
      console.error(err);
      return null;
    }
  }, []);
  
  // Save garden changes
  const saveGarden = useCallback(() => {
    if (!garden) return;
    
    try {
      gardenService.saveGarden(garden);
    } catch (err) {
      setError('Failed to save garden');
      console.error(err);
    }
  }, [garden]);
  
  // Update garden dimensions
  const updateDimensions = useCallback((dimensions: GardenDimensions) => {
    if (!garden) return;
    
    try {
      const updatedGarden = {
        ...garden,
        dimensions,
        updatedAt: new Date().toISOString()
      };
      
      gardenService.saveGarden(updatedGarden);
      setGarden(updatedGarden);
    } catch (err) {
      setError('Failed to update garden dimensions');
      console.error(err);
    }
  }, [garden]);
  
  // Add a plant to the garden
  const addPlant = useCallback((plantPosition: Omit<PlantPosition, 'id'>) => {
    if (!garden) return null;
    
    try {
      const newPlantPosition: PlantPosition = {
        ...plantPosition,
        id: generateUUID()
      };
      
      const updatedGarden = {
        ...garden,
        plants: [...garden.plants, newPlantPosition],
        updatedAt: new Date().toISOString()
      };
      
      gardenService.saveGarden(updatedGarden);
      setGarden(updatedGarden);
      
      return newPlantPosition;
    } catch (err) {
      setError('Failed to add plant to garden');
      console.error(err);
      return null;
    }
  }, [garden]);
  
  // Update a plant position
  const updatePlant = useCallback((updatedPlantPosition: PlantPosition) => {
    if (!garden) return;
    
    try {
      const updatedPlants = garden.plants.map(plant => 
        plant.id === updatedPlantPosition.id ? updatedPlantPosition : plant
      );
      
      const updatedGarden = {
        ...garden,
        plants: updatedPlants,
        updatedAt: new Date().toISOString()
      };
      
      gardenService.saveGarden(updatedGarden);
      setGarden(updatedGarden);
    } catch (err) {
      setError('Failed to update plant position');
      console.error(err);
    }
  }, [garden]);
  
  // Remove a plant from the garden
  const removePlant = useCallback((plantId: string) => {
    if (!garden) return;
    
    try {
      const updatedPlants = garden.plants.filter(plant => plant.id !== plantId);
      
      const updatedGarden = {
        ...garden,
        plants: updatedPlants,
        updatedAt: new Date().toISOString()
      };
      
      gardenService.saveGarden(updatedGarden);
      setGarden(updatedGarden);
    } catch (err) {
      setError('Failed to remove plant');
      console.error(err);
    }
  }, [garden]);
  
  // Change the view time
  const setViewTime = useCallback((viewTime: Garden['viewTime']) => {
    if (!garden) return;
    
    try {
      const updatedGarden = {
        ...garden,
        viewTime,
        updatedAt: new Date().toISOString()
      };
      
      gardenService.saveGarden(updatedGarden);
      setGarden(updatedGarden);
    } catch (err) {
      setError('Failed to change view time');
      console.error(err);
    }
  }, [garden]);
  
  return {
    garden,
    loading,
    error,
    createGarden,
    saveGarden,
    updateDimensions,
    addPlant,
    updatePlant,
    removePlant,
    setViewTime
  };
};