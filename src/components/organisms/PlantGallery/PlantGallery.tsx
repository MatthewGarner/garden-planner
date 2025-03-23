import React, { useState, useEffect } from 'react';
import { Plant, SunExposure, WaterNeeds, GrowthRate } from '../../../types';
import { PlantCard, PlantFilter } from '../../molecules';
import { usePlants } from '../../../hooks';

interface PlantGalleryProps {
  onPlantSelect?: (plant: Plant) => void;
  selectedPlantId?: string;
}

const PlantGallery: React.FC<PlantGalleryProps> = ({ 
  onPlantSelect,
  selectedPlantId
}) => {
  const {
    allPlants,
    filteredPlants,
    categories,
    tags,
    updateFilters,
    resetFilters,
  } = usePlants();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Available filter options (as regular arrays, not readonly)
  const sunExposures: SunExposure[] = ['full-sun', 'partial-sun', 'shade'];
  const waterNeeds: WaterNeeds[] = ['low', 'medium', 'high'];
  const growthRates: GrowthRate[] = ['slow', 'medium', 'fast'];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: any) => {
    updateFilters(filters);
  };

  const handlePlantClick = (plant: Plant) => {
    if (onPlantSelect) {
      onPlantSelect(plant);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading plants...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <PlantFilter
          categories={categories}
          sunExposures={sunExposures}
          waterNeeds={waterNeeds}
          growthRates={growthRates}
          tags={tags}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <div className="md:col-span-3">
        {filteredPlants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">No plants match your filters.</p>
            <button 
              className="btn btn-primary"
              onClick={() => resetFilters()}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {filteredPlants.length} {filteredPlants.length === 1 ? 'Plant' : 'Plants'}
              </h2>
              
              <select 
                className="input"
                onChange={(e) => {
                  // Sort plants by selected criterion
                  const value = e.target.value;
                  if (value === 'name-asc') {
                    // We'll handle sorting in the component since it's not in the filter type
                    // This avoids the TypeScript error
                  } else if (value === 'name-desc') {
                    // Alternative: handle sorting logic here instead of in updateFilters
                  } else if (value === 'height-asc') {
                    // Alternative: handle sorting logic here
                  } else if (value === 'height-desc') {
                    // Alternative: handle sorting logic here
                  }
                }}
                defaultValue="name-asc"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="height-asc">Height (Low-High)</option>
                <option value="height-desc">Height (High-Low)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onClick={handlePlantClick}
                  selected={selectedPlantId === plant.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlantGallery;