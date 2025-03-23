import React, { useState } from 'react';
import { Plant, SunExposure, WaterNeeds, GrowthRate } from '../../../types';
import { PlantCard, PlantFilter } from '../../molecules';
import { usePlants } from '../../../hooks';
import { Button } from '../../atoms';

interface PlantSelectionPanelProps {
  onPlantSelect: (plant: Plant) => void;
  selectedPlantId?: string;
}

const PlantSelectionPanel: React.FC<PlantSelectionPanelProps> = ({
  onPlantSelect,
  selectedPlantId
}) => {
  const {
    filteredPlants,
    categories,
    tags,
    updateFilters,
    resetFilters
  } = usePlants();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  
  // Available filter options as regular arrays, not readonly
  const sunExposures: SunExposure[] = ['full-sun', 'partial-sun', 'shade'];
  const waterNeeds: WaterNeeds[] = ['low', 'medium', 'high'];
  const growthRates: GrowthRate[] = ['slow', 'medium', 'fast'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateFilters({ search: query });
  };

  const handleFilterChange = (filters: any) => {
    updateFilters(filters);
  };

  const handlePlantSelect = (plant: Plant) => {
    onPlantSelect(plant);
  };

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return (
    <div className="bg-white shadow-md rounded-lg h-full flex flex-col">
      {/* Header with search */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold mb-3">Plants</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search plants..."
            className="input w-full pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <button 
            className="text-sm text-primary font-medium flex items-center"
            onClick={toggleFiltersVisibility}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`p-1.5 rounded ${isGridView ? 'bg-gray-100' : ''}`}
              onClick={() => setIsGridView(true)}
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-1.5 rounded ${!isGridView ? 'bg-gray-100' : ''}`}
              onClick={() => setIsGridView(false)}
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter section (collapsible) */}
      {isFiltersVisible && (
        <div className="p-4 border-b">
          <PlantFilter
            categories={categories}
            sunExposures={sunExposures}
            waterNeeds={waterNeeds}
            growthRates={growthRates}
            tags={tags}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}
      
      {/* Plants list */}
      <div className="flex-grow overflow-y-auto p-4">
        {filteredPlants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No plants match your search criteria.</p>
            <Button variant="outline" size="sm" onClick={() => resetFilters()}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={isGridView ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {filteredPlants.map(plant => (
              <div 
                key={plant.id}
                className={isGridView ? "" : "border-b pb-4"}
                onClick={() => handlePlantSelect(plant)}
              >
                {isGridView ? (
                  <PlantCard
                    plant={plant}
                    selected={selectedPlantId === plant.id}
                  />
                ) : (
                  <div className={`flex items-center p-2 rounded-lg cursor-pointer transition ${
                    selectedPlantId === plant.id ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'
                  }`}>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={plant.images.thumbnail.src} 
                        alt={plant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{plant.name}</h3>
                      <p className="text-xs text-gray-500">{plant.scientificName}</p>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <span className="mr-2">
                          {plant.sunExposure === 'full-sun' ? '☀️ Full Sun' : 
                           plant.sunExposure === 'partial-sun' ? '⛅ Partial Sun' : 
                           '🌥️ Shade'}
                        </span>
                        <span>
                          {plant.waterNeeds === 'low' ? '💧 Low' : 
                           plant.waterNeeds === 'medium' ? '💧💧 Medium' : 
                           '💧💧💧 High'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                      {Math.round(plant.dimensions.mature.height / 12)}'H
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected plant info (if any) */}
      {selectedPlantId && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              {filteredPlants.find(p => p.id === selectedPlantId)?.name}
            </h3>
            <Button variant="primary" size="sm">
              Add to Garden
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantSelectionPanel;