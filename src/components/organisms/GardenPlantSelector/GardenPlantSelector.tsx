import React, { useState } from 'react';
import { Plant } from '../../../types';
import { PlantSelectionPanel } from '../../organisms';
import { PlantDetailsPanel } from '../../molecules';

interface GardenPlantSelectorProps {
  onAddPlantToGarden: (plant: Plant) => void;
  viewTime: 'current' | 'year3' | 'year5' | 'mature';
}

const GardenPlantSelector: React.FC<GardenPlantSelectorProps> = ({
  onAddPlantToGarden,
  viewTime = 'current'
}) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowDetailsPanel(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsPanel(false);
  };

  const handleAddToGarden = (plant: Plant) => {
    onAddPlantToGarden(plant);
    setShowDetailsPanel(false);
  };

  return (
    <div className="h-full relative">
      <div className="h-full overflow-hidden">
        <PlantSelectionPanel
          onPlantSelect={handlePlantSelect}
          selectedPlantId={selectedPlant?.id}
        />
      </div>
      
      {/* Plant details modal */}
      {showDetailsPanel && selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <PlantDetailsPanel
            plant={selectedPlant}
            onClose={handleCloseDetails}
            onAddToGarden={handleAddToGarden}
            viewTime={viewTime}
          />
        </div>
      )}
    </div>
  );
};

export default GardenPlantSelector;