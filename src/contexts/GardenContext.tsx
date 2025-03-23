import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { Garden, Plant, PlantPosition, GardenDimensions, ScaleReference } from '../types';
import { gardenService, plantService } from '../services';
import { generateUUID } from '../utils/general';

// Define the state shape
interface GardenState {
  gardens: Garden[];
  currentGarden: Garden | null;
  loading: boolean;
  error: string | null;
}

// Define action types
type GardenAction =
  | { type: 'LOADING' }
  | { type: 'LOAD_GARDENS_SUCCESS'; payload: Garden[] }
  | { type: 'LOAD_GARDENS_ERROR'; payload: string }
  | { type: 'SET_CURRENT_GARDEN'; payload: Garden | null }
  | { type: 'CREATE_GARDEN'; payload: Garden }
  | { type: 'UPDATE_GARDEN'; payload: Garden }
  | { type: 'DELETE_GARDEN'; payload: string }
  | { type: 'ADD_PLANT'; payload: { gardenId: string; plantPosition: PlantPosition } }
  | { type: 'UPDATE_PLANT'; payload: { gardenId: string; plantPosition: PlantPosition } }
  | { type: 'REMOVE_PLANT'; payload: { gardenId: string; plantId: string } }
  | { type: 'SET_SCALE_REFERENCE'; payload: { gardenId: string; scaleReference: ScaleReference } }
  | { type: 'SET_VIEW_TIME'; payload: { gardenId: string; viewTime: Garden['viewTime'] } }
  | { type: 'SET_DIMENSIONS'; payload: { gardenId: string; dimensions: GardenDimensions } };

// Define the context interface
interface GardenContextType {
  state: GardenState;
  dispatch: React.Dispatch<GardenAction>;
  createGarden: (name: string, imageUrl: string, dimensions: GardenDimensions) => Garden;
  loadGarden: (gardenId: string) => Garden | null;
  updateGarden: (garden: Garden) => void;
  deleteGarden: (gardenId: string) => void;
  addPlantToGarden: (gardenId: string, plantId: string, position: Omit<PlantPosition, 'id' | 'plantId'>) => PlantPosition | null;
  updatePlantPosition: (gardenId: string, plantPosition: PlantPosition) => void;
  removePlantFromGarden: (gardenId: string, plantId: string) => void;
  setScaleReference: (gardenId: string, reference: { width: number; height: number; realWidth: number }) => void;
  setViewTime: (gardenId: string, viewTime: Garden['viewTime']) => void;
  setDimensions: (gardenId: string, dimensions: GardenDimensions) => void;
  getPlantById: (plantId: string) => Plant | undefined;
}

// Initial state
const initialState: GardenState = {
  gardens: [],
  currentGarden: null,
  loading: false,
  error: null
};

// Reducer function
const gardenReducer = (state: GardenState, action: GardenAction): GardenState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    
    case 'LOAD_GARDENS_SUCCESS':
      return { ...state, gardens: action.payload, loading: false, error: null };
    
    case 'LOAD_GARDENS_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'SET_CURRENT_GARDEN':
      return { ...state, currentGarden: action.payload };
    
    case 'CREATE_GARDEN': {
      const newGardens = [...state.gardens, action.payload];
      return { ...state, gardens: newGardens, currentGarden: action.payload };
    }
    
    case 'UPDATE_GARDEN': {
      const updatedGardens = state.gardens.map(garden => 
        garden.id === action.payload.id ? action.payload : garden
      );
      
      const updatedCurrentGarden = state.currentGarden?.id === action.payload.id
        ? action.payload
        : state.currentGarden;
      
      return { 
        ...state, 
        gardens: updatedGardens, 
        currentGarden: updatedCurrentGarden 
      };
    }
    
    case 'DELETE_GARDEN': {
      const filteredGardens = state.gardens.filter(garden => garden.id !== action.payload);
      const updatedCurrentGarden = state.currentGarden?.id === action.payload
        ? null
        : state.currentGarden;
      
      return { 
        ...state, 
        gardens: filteredGardens, 
        currentGarden: updatedCurrentGarden 
      };
    }
    
    case 'ADD_PLANT': {
      const { gardenId, plantPosition } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            plants: [...garden.plants, plantPosition],
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            plants: [...state.currentGarden.plants, plantPosition],
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    case 'UPDATE_PLANT': {
      const { gardenId, plantPosition } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            plants: garden.plants.map(plant => 
              plant.id === plantPosition.id ? plantPosition : plant
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            plants: state.currentGarden.plants.map(plant => 
              plant.id === plantPosition.id ? plantPosition : plant
            ),
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    case 'REMOVE_PLANT': {
      const { gardenId, plantId } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            plants: garden.plants.filter(plant => plant.id !== plantId),
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            plants: state.currentGarden.plants.filter(plant => plant.id !== plantId),
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    case 'SET_SCALE_REFERENCE': {
      const { gardenId, scaleReference } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            scaleReference,
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            scaleReference,
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    case 'SET_VIEW_TIME': {
      const { gardenId, viewTime } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            viewTime,
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            viewTime,
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    case 'SET_DIMENSIONS': {
      const { gardenId, dimensions } = action.payload;
      
      const updatedGardens = state.gardens.map(garden => {
        if (garden.id === gardenId) {
          return {
            ...garden,
            dimensions,
            updatedAt: new Date().toISOString()
          };
        }
        return garden;
      });
      
      const updatedCurrentGarden = state.currentGarden?.id === gardenId
        ? {
            ...state.currentGarden,
            dimensions,
            updatedAt: new Date().toISOString()
          }
        : state.currentGarden;
      
      return {
        ...state,
        gardens: updatedGardens,
        currentGarden: updatedCurrentGarden
      };
    }
    
    default:
      return state;
  }
};

// Create the context
const GardenContext = createContext<GardenContextType | undefined>(undefined);

// Provider component
const GardenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gardenReducer, initialState);
  
  // Load gardens on mount
  useEffect(() => {
    const loadGardens = () => {
      dispatch({ type: 'LOADING' });
      
      try {
        const gardens = gardenService.getAllGardens();
        dispatch({ type: 'LOAD_GARDENS_SUCCESS', payload: gardens });
        
        // Also load current garden if it exists
        const currentGarden = gardenService.getCurrentGarden();
        if (currentGarden) {
          dispatch({ type: 'SET_CURRENT_GARDEN', payload: currentGarden });
        }
      } catch (error) {
        console.error('Error loading gardens:', error);
        dispatch({ 
          type: 'LOAD_GARDENS_ERROR', 
          payload: 'Failed to load gardens. Please try again.' 
        });
      }
    };
    
    loadGardens();
  }, []); // Empty dependency array ensures this only runs once on mount
  
  // Create a new garden
  const createGarden = useCallback((name: string, imageUrl: string, dimensions: GardenDimensions): Garden => {
    try {
      const newGarden = gardenService.createGarden(name, imageUrl, dimensions);
      dispatch({ type: 'CREATE_GARDEN', payload: newGarden });
      return newGarden;
    } catch (error) {
      console.error('Error creating garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to create garden. Please try again.' 
      });
      throw error;
    }
  }, [dispatch]);
  
  // Load a garden by ID
  const loadGarden = useCallback((gardenId: string): Garden | null => {
    try {
      const garden = gardenService.getGardenById(gardenId);
      
      if (garden) {
        dispatch({ type: 'SET_CURRENT_GARDEN', payload: garden });
      }
      
      return garden;
    } catch (error) {
      console.error('Error loading garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: `Failed to load garden with ID ${gardenId}.` 
      });
      return null;
    }
  }, [dispatch]);
  
  // Update garden
  const updateGarden = useCallback((garden: Garden): void => {
    try {
      gardenService.saveGarden(garden);
      dispatch({ type: 'UPDATE_GARDEN', payload: garden });
    } catch (error) {
      console.error('Error updating garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to update garden. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Delete garden
  const deleteGarden = useCallback((gardenId: string): void => {
    try {
      gardenService.deleteGarden(gardenId);
      dispatch({ type: 'DELETE_GARDEN', payload: gardenId });
    } catch (error) {
      console.error('Error deleting garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to delete garden. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Add plant to garden
  const addPlantToGarden = useCallback((
    gardenId: string, 
    plantId: string, 
    position: Omit<PlantPosition, 'id' | 'plantId'>
  ): PlantPosition | null => {
    try {
      const newPosition: PlantPosition = {
        ...position,
        id: generateUUID(),
        plantId
      };
      
      gardenService.addPlantToGarden(gardenId, newPosition);
      
      dispatch({ 
        type: 'ADD_PLANT', 
        payload: { gardenId, plantPosition: newPosition } 
      });
      
      return newPosition;
    } catch (error) {
      console.error('Error adding plant to garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to add plant to garden. Please try again.' 
      });
      return null;
    }
  }, [dispatch]);
  
  // Update plant position
  const updatePlantPosition = useCallback((gardenId: string, plantPosition: PlantPosition): void => {
    try {
      gardenService.updatePlantPosition(gardenId, plantPosition);
      
      dispatch({ 
        type: 'UPDATE_PLANT', 
        payload: { gardenId, plantPosition } 
      });
    } catch (error) {
      console.error('Error updating plant position:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to update plant position. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Remove plant from garden
  const removePlantFromGarden = useCallback((gardenId: string, plantId: string): void => {
    try {
      gardenService.removePlantFromGarden(gardenId, plantId);
      
      dispatch({ 
        type: 'REMOVE_PLANT', 
        payload: { gardenId, plantId } 
      });
    } catch (error) {
      console.error('Error removing plant from garden:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to remove plant from garden. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Set scale reference
  const setScaleReference = useCallback((
    gardenId: string, 
    reference: { width: number; height: number; realWidth: number }
  ): void => {
    try {
      const garden = gardenService.getGardenById(gardenId);
      
      if (!garden) {
        throw new Error(`Garden with ID ${gardenId} not found`);
      }
      
      const updatedGarden = gardenService.setScaleReference(gardenId, reference);
      
      if (updatedGarden && updatedGarden.scaleReference) {
        dispatch({ 
          type: 'SET_SCALE_REFERENCE', 
          payload: { 
            gardenId, 
            scaleReference: updatedGarden.scaleReference
          } 
        });
      }
    } catch (error) {
      console.error('Error setting scale reference:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to set scale reference. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Set view time
  const setViewTime = useCallback((gardenId: string, viewTime: Garden['viewTime']): void => {
    try {
      gardenService.setGardenViewTime(gardenId, viewTime);
      
      dispatch({ 
        type: 'SET_VIEW_TIME', 
        payload: { gardenId, viewTime } 
      });
    } catch (error) {
      console.error('Error setting view time:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to set view time. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Set dimensions
  const setDimensions = useCallback((gardenId: string, dimensions: GardenDimensions): void => {
    try {
      gardenService.updateGardenDimensions(gardenId, dimensions);
      
      dispatch({ 
        type: 'SET_DIMENSIONS', 
        payload: { gardenId, dimensions } 
      });
    } catch (error) {
      console.error('Error setting dimensions:', error);
      dispatch({ 
        type: 'LOAD_GARDENS_ERROR', 
        payload: 'Failed to set dimensions. Please try again.' 
      });
    }
  }, [dispatch]);
  
  // Get plant by ID
  const getPlantById = useCallback((plantId: string): Plant | undefined => {
    return plantService.getPlantById(plantId);
  }, []);
  
  const contextValue = {
    state,
    dispatch,
    createGarden,
    loadGarden,
    updateGarden,
    deleteGarden,
    addPlantToGarden,
    updatePlantPosition,
    removePlantFromGarden,
    setScaleReference,
    setViewTime,
    setDimensions,
    getPlantById
  };
  
  return (
    <GardenContext.Provider value={contextValue}>
      {children}
    </GardenContext.Provider>
  );
};

// Custom hook to use the garden context
const useGarden = (): GardenContextType => {
  const context = useContext(GardenContext);
  
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  
  return context;
};

// Export the provider component as a named export
export { GardenProvider, useGarden };
// Also export the default context if needed
export default GardenContext;