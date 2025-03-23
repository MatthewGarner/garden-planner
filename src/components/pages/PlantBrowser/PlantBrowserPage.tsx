import React, { useState } from 'react';
import { Plant } from '../../../types';
import { MainLayout } from '../../templates';
import { PlantGallery } from '../../organisms';
import { Button } from '../../atoms';

const PlantBrowserPage: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showPlantDetails, setShowPlantDetails] = useState(false);

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowPlantDetails(true);
  };

  const handleClosePlantDetails = () => {
    setShowPlantDetails(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-display">Plant Library</h1>
          <div className="hidden md:block">
            <Button variant="primary">
              Add to Garden
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Browse our extensive plant library to find the perfect plants for your garden. 
            Use the filters to narrow down your search based on your garden conditions and preferences.
          </p>
        </div>
        
        <PlantGallery 
          onPlantSelect={handlePlantSelect}
          selectedPlantId={selectedPlant?.id}
        />

        {/* Plant Details Modal */}
        {showPlantDetails && selectedPlant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlant.name}</h2>
                    <p className="text-gray-500 italic">{selectedPlant.scientificName}</p>
                  </div>
                  <button 
                    onClick={handleClosePlantDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6">
                  <img 
                    src={selectedPlant.images.fullSize.src} 
                    alt={selectedPlant.images.fullSize.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedPlant.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Growing Conditions</h3>
                    <ul className="space-y-2">
                      <li>
                        <span className="font-medium">Sun Exposure:</span>{' '}
                        {selectedPlant.sunExposure === 'full-sun' ? 'Full Sun' :
                         selectedPlant.sunExposure === 'partial-sun' ? 'Partial Sun' :
                         selectedPlant.sunExposure === 'shade' ? 'Shade' : selectedPlant.sunExposure}
                      </li>
                      <li>
                        <span className="font-medium">Water Needs:</span>{' '}
                        {selectedPlant.waterNeeds.charAt(0).toUpperCase() + selectedPlant.waterNeeds.slice(1)}
                      </li>
                      <li>
                        <span className="font-medium">Growth Rate:</span>{' '}
                        {selectedPlant.growthRate.charAt(0).toUpperCase() + selectedPlant.growthRate.slice(1)}
                      </li>
                      {selectedPlant.bloomTime && (
                        <li>
                          <span className="font-medium">Bloom Time:</span>{' '}
                          {selectedPlant.bloomTime}
                        </li>
                      )}
                      <li>
                        <span className="font-medium">Maintenance:</span>{' '}
                        {selectedPlant.maintenanceDifficulty === 1 ? 'Easy' :
                         selectedPlant.maintenanceDifficulty === 2 ? 'Moderate' :
                         selectedPlant.maintenanceDifficulty === 3 ? 'Intermediate' :
                         selectedPlant.maintenanceDifficulty === 4 ? 'Difficult' :
                         selectedPlant.maintenanceDifficulty === 5 ? 'Expert' : 'Unknown'}
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">Plant Dimensions</h3>
                    <p className="mb-2"><span className="font-medium">Mature: </span>
                      {Math.round(selectedPlant.dimensions.mature.height / 12)}'H × {Math.round(selectedPlant.dimensions.mature.width / 12)}'W
                    </p>
                    <h4 className="font-medium mt-4">Growth Timeline</h4>
                    <ul className="space-y-2">
                      <li>
                        <span className="font-medium">Initial Year:</span>{' '}
                        {Math.round(selectedPlant.dimensions.initialYear.height / 12)}'H × {Math.round(selectedPlant.dimensions.initialYear.width / 12)}'W
                      </li>
                      <li>
                        <span className="font-medium">3 Years:</span>{' '}
                        {Math.round(selectedPlant.dimensions.threeYears.height / 12)}'H × {Math.round(selectedPlant.dimensions.threeYears.width / 12)}'W
                      </li>
                      <li>
                        <span className="font-medium">5 Years:</span>{' '}
                        {Math.round(selectedPlant.dimensions.fiveYears.height / 12)}'H × {Math.round(selectedPlant.dimensions.fiveYears.width / 12)}'W
                      </li>
                    </ul>
                  </div>
                </div>
                
                {selectedPlant.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlant.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-background-light text-gray-600 rounded-full px-3 py-1 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button variant="primary">
                    Add to Garden
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PlantBrowserPage;