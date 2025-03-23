import React from 'react';
import { Plant } from '../../../types';

interface PlantCardProps {
  plant: Plant;
  onClick?: (plant: Plant) => void;
  selected?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick, selected = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(plant);
    }
  };

  const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Moderate';
      case 3:
        return 'Intermediate';
      case 4:
        return 'Difficult';
      case 5:
        return 'Expert';
      default:
        return 'Unknown';
    }
  };

  const getSunExposureLabel = (exposure: string): string => {
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

  const getWaterNeedsLabel = (needs: string): string => {
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

  return (
    <div 
      className={`card transition-all ${
        selected ? 'ring-2 ring-primary border-transparent' : 'hover:shadow-lg'
      }`}
      onClick={handleClick}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <img 
          src={plant.images.thumbnail.src} 
          alt={plant.images.thumbnail.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-bold mb-1">{plant.name}</h3>
      <p className="text-gray-500 text-sm italic mb-2">{plant.scientificName}</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-gray-500">Category:</span>
          <div className="capitalize">{plant.category}</div>
        </div>
        
        <div>
          <span className="text-gray-500">Maintenance:</span>
          <div>{getDifficultyLabel(plant.maintenanceDifficulty)}</div>
        </div>
        
        <div>
          <span className="text-gray-500">Sun:</span>
          <div>{getSunExposureLabel(plant.sunExposure)}</div>
        </div>
        
        <div>
          <span className="text-gray-500">Water:</span>
          <div>{getWaterNeedsLabel(plant.waterNeeds)}</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <span>Mature size: </span>
        <span>{Math.round(plant.dimensions.mature.height / 12)}' H × {Math.round(plant.dimensions.mature.width / 12)}' W</span>
      </div>
      
      {plant.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {plant.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="inline-block bg-background-light text-gray-600 rounded-full px-2 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
          {plant.tags.length > 3 && (
            <span className="inline-block bg-background-light text-gray-600 rounded-full px-2 py-1 text-xs">
              +{plant.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantCard;