import React from 'react';
import { Plant } from '../../../types';
import { Button } from '../../atoms';

interface PlantDetailsPanelProps {
  plant: Plant;
  onClose: () => void;
  onAddToGarden: (plant: Plant) => void;
  viewTime: 'current' | 'year3' | 'year5' | 'mature';
}

const PlantDetailsPanel: React.FC<PlantDetailsPanelProps> = ({
  plant,
  onClose,
  onAddToGarden,
  viewTime = 'current'
}) => {
  // Get the dimensions based on the selected view time
  const getDimensions = () => {
    switch (viewTime) {
      case 'year3':
        return plant.dimensions.threeYears;
      case 'year5':
        return plant.dimensions.fiveYears;
      case 'mature':
        return plant.dimensions.mature;
      case 'current':
      default:
        return plant.dimensions.initialYear;
    }
  };

  const dimensions = getDimensions();

  // Helpers to format data
  const formatSunExposure = (exposure: string) => {
    switch (exposure) {
      case 'full-sun':
        return 'Full Sun';
      case 'partial-sun':
        return 'Partial Sun';
      case 'shade':
        return 'Shade';
      default:
        return exposure;
    }
  };

  const formatWaterNeeds = (needs: string) => {
    switch (needs) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return needs;
    }
  };

  const formatGrowthRate = (rate: string) => {
    return rate.charAt(0).toUpperCase() + rate.slice(1);
  };

  const formatDimensions = (height: number, width: number) => {
    const heightFeet = Math.floor(height / 12);
    const heightInches = Math.round(height % 12);
    const widthFeet = Math.floor(width / 12);
    const widthInches = Math.round(width % 12);

    const heightStr = heightFeet > 0 
      ? `${heightFeet}'${heightInches > 0 ? ` ${heightInches}"` : ''}` 
      : `${heightInches}"`;
    
    const widthStr = widthFeet > 0 
      ? `${widthFeet}'${widthInches > 0 ? ` ${widthInches}"` : ''}` 
      : `${widthInches}"`;

    return `${heightStr} H × ${widthStr} W`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-lg w-full">
      {/* Header */}
      <div className="relative">
        <img 
          src={plant.images.fullSize.src}
          alt={plant.name}
          className="w-full h-48 object-cover"
        />
        <button 
          className="absolute top-3 right-3 bg-white bg-opacity-75 p-1.5 rounded-full hover:bg-opacity-100 transition"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-white text-xl font-bold">{plant.name}</h2>
          <p className="text-white text-opacity-80 text-sm italic">{plant.scientificName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Description</h3>
          <p className="text-gray-700">{plant.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-bold text-lg mb-2">Characteristics</h3>
            <ul className="space-y-1 text-sm">
              <li><span className="font-medium">Type:</span> {plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}</li>
              <li><span className="font-medium">Sun Needs:</span> {formatSunExposure(plant.sunExposure)}</li>
              <li><span className="font-medium">Water Needs:</span> {formatWaterNeeds(plant.waterNeeds)}</li>
              <li><span className="font-medium">Growth Rate:</span> {formatGrowthRate(plant.growthRate)}</li>
              {plant.bloomTime && (
                <li><span className="font-medium">Bloom Time:</span> {plant.bloomTime}</li>
              )}
              <li>
                <span className="font-medium">Maintenance:</span> {
                  plant.maintenanceDifficulty === 1 ? 'Easy' :
                  plant.maintenanceDifficulty === 2 ? 'Moderate' :
                  plant.maintenanceDifficulty === 3 ? 'Intermediate' :
                  plant.maintenanceDifficulty === 4 ? 'Difficult' :
                  plant.maintenanceDifficulty === 5 ? 'Expert' : 'Unknown'
                }
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">Dimensions</h3>
            <div className="text-sm mb-2">
              <span className="font-medium">Current View:</span> {formatDimensions(dimensions.height, dimensions.width)}
            </div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">First Year:</span> {formatDimensions(plant.dimensions.initialYear.height, plant.dimensions.initialYear.width)}</div>
              <div><span className="font-medium">Year 3:</span> {formatDimensions(plant.dimensions.threeYears.height, plant.dimensions.threeYears.width)}</div>
              <div><span className="font-medium">Year 5:</span> {formatDimensions(plant.dimensions.fiveYears.height, plant.dimensions.fiveYears.width)}</div>
              <div><span className="font-medium">Mature:</span> {formatDimensions(plant.dimensions.mature.height, plant.dimensions.mature.width)}</div>
            </div>
          </div>
        </div>
        
        {plant.tags && plant.tags.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {plant.tags.map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onAddToGarden(plant)}>
            Add to Garden
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailsPanel;