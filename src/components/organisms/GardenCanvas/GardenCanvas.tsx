import React, { useState, useRef, useEffect } from 'react';
import { Garden, Plant, PlantPosition } from '../../../types';
import { DraggablePlant } from '../../molecules';
import { plantService } from '../../../services';
import { inchesToPixels } from '../../../utils/scale';

interface GardenCanvasProps {
  garden: Garden;
  selectedPlant?: Plant | null;
  onPlantPlaced?: (plantPosition: PlantPosition) => void;
  onPlantUpdate?: (updatedPosition: PlantPosition) => void;
  onPlantRemove?: (plantId: string) => void;
  onCancelPlacement?: () => void;
}

const GardenCanvas: React.FC<GardenCanvasProps> = ({
  garden,
  selectedPlant,
  onPlantPlaced,
  onPlantUpdate,
  onPlantRemove,
  onCancelPlacement
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedPlantPosition, setSelectedPlantPosition] = useState<string | null>(null);
  const [isPlacingPlant, setIsPlacingPlant] = useState(!!selectedPlant);
  
  // Update isPlacingPlant when selectedPlant changes
  useEffect(() => {
    setIsPlacingPlant(!!selectedPlant);
  }, [selectedPlant]);
  
  // Get canvas size when the image loads
  const handleImageLoad = () => {
    if (imageRef.current) {
      setCanvasSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      });
    }
  };
  
  // Update canvas size on window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (imageRef.current) {
        setCanvasSize({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  // Handle click on the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If we're not placing a new plant, just deselect
    if (!isPlacingPlant || !selectedPlant) {
      setSelectedPlantPosition(null);
      return;
    }
    
    // Calculate click position relative to the canvas
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to percentage of canvas width/height
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Get the plant's dimensions based on current view time
    const getDimensions = () => {
      const { initialYear, threeYears, fiveYears, mature } = selectedPlant.dimensions;
      
      switch (garden.viewTime) {
        case 'year3':
          return threeYears;
        case 'year5':
          return fiveYears;
        case 'mature':
          return mature;
        case 'current':
        default:
          return initialYear;
      }
    };
    
    const plantDimensions = getDimensions();
    
    // Calculate the plant's width and height in pixels
    const { width: widthInPixels, height: heightInPixels } = 
      garden.scaleReference
        ? inchesToPixels(plantDimensions, { 
            pixelsPerInch: garden.scaleReference.pixelsPerInch,
            referenceObjectWidth: garden.scaleReference.width,
            referenceRealWidth: garden.scaleReference.realWidth
          })
        : { width: 50, height: 50 }; // Default fallback if no scale reference
    
    // Convert to percentage of canvas
    const widthPercent = (widthInPixels / rect.width) * 100;
    const heightPercent = (heightInPixels / rect.height) * 100;
    
    // Create new plant position
    const newPosition: PlantPosition = {
      id: `plant-${Date.now()}`,
      plantId: selectedPlant.id,
      x: xPercent,
      y: yPercent,
      width: widthPercent,
      height: heightPercent,
      rotation: 0,
      scale: 1,
      zIndex: garden.plants.length + 1
    };
    
    // Call the callback to add the plant to the garden
    if (onPlantPlaced) {
      onPlantPlaced(newPosition);
    }
    
    // Stop placing the plant
    setIsPlacingPlant(false);
    if (onCancelPlacement) {
      onCancelPlacement();
    }
  };
  
  // Handle plant position update
  const handlePlantPositionChange = (updatedPosition: PlantPosition) => {
    if (onPlantUpdate) {
      onPlantUpdate(updatedPosition);
    }
  };
  
  // Handle plant selection
  const handlePlantSelect = (id: string) => {
    setSelectedPlantPosition(id);
  };
  
  // Handle plant deletion
  const handlePlantDelete = (id: string) => {
    if (onPlantRemove) {
      onPlantRemove(id);
    }
    setSelectedPlantPosition(null);
  };
  
  // Cancel plant placement on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacingPlant && onCancelPlacement) {
        onCancelPlacement();
        setIsPlacingPlant(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlacingPlant, onCancelPlacement]);
  
  // Helper function to get plant by ID
  const getPlantById = (id: string): Plant | undefined => {
    return plantService.getPlantById(id);
  };
  
  return (
    <div 
      ref={canvasRef}
      className={`relative mx-auto bg-white rounded-lg shadow-md overflow-hidden ${isPlacingPlant ? 'cursor-crosshair' : 'cursor-default'}`}
      onClick={handleCanvasClick}
    >
      {/* Garden image */}
      <img 
        ref={imageRef}
        src={garden.imageUrl} 
        alt={garden.name}
        className="w-full h-auto"
        onLoad={handleImageLoad}
      />
      
      {/* Placed plants */}
      {garden.plants.map(plantPosition => {
        const plant = getPlantById(plantPosition.plantId);
        if (!plant || !garden.scaleReference) return null;
        
        return (
          <DraggablePlant
            key={plantPosition.id}
            plant={plant}
            position={plantPosition}
            scaleReference={garden.scaleReference}
            containerWidth={canvasSize.width}
            containerHeight={canvasSize.height}
            viewTime={garden.viewTime}
            isSelected={selectedPlantPosition === plantPosition.id}
            onSelect={handlePlantSelect}
            onPositionChange={handlePlantPositionChange}
            onDelete={handlePlantDelete}
          />
        );
      })}
      
      {/* Garden dimensions and scale info */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded text-xs">
        <div>Dimensions: {garden.dimensions.width}' × {garden.dimensions.height}'</div>
        {garden.scaleReference && (
          <div>Scale: {garden.scaleReference.pixelsPerInch.toFixed(2)} px/inch</div>
        )}
      </div>
      
      {/* Placement instruction overlay */}
      {isPlacingPlant && selectedPlant && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
          <div className="bg-white p-4 rounded-lg text-center">
            <h3 className="font-bold">Ready to Place: {selectedPlant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Click on the garden to place this plant</p>
            <p className="text-xs text-gray-500">Press ESC to cancel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenCanvas;