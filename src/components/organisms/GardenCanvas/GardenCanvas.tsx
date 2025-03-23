import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Garden, Plant, PlantPosition } from '../../../types';
import DraggablePlant from '../../molecules/DraggablePlant/DraggablePlant';
import { useGarden } from '../../../contexts/GardenContext';
import { inchesToPixels } from '../../../utils/scale';
import { useToast } from '../../molecules/Toast/ToastProvider';
import { useConfirmation } from '../../molecules/ConfirmationDialog/ConfirmationProvider';
import { getPlantDimensionsForViewTime } from '../../../utils/plantutils';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCoordinates, setHoveredCoordinates] = useState<{x: number, y: number} | null>(null);
  
  // Access garden context, toast and confirmation dialogs
  const { getPlantById } = useGarden();
  const { addToast } = useToast();
  const { showConfirmation } = useConfirmation();
  
  // Update isPlacingPlant when selectedPlant changes
  useEffect(() => {
    setIsPlacingPlant(!!selectedPlant);
  }, [selectedPlant]);
  
  // Get canvas size when the image loads
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setCanvasSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      });
      setIsLoading(false);
    }
  }, []);
  
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
  
  // Handle mousemove on the canvas to show placement preview
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingPlant || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setHoveredCoordinates({ x, y });
  }, [isPlacingPlant]);
  
  // Handle click on the canvas for plant placement
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
    
    // Get plant dimensions based on view time
    const plantDimensions = getPlantDimensionsForViewTime(selectedPlant, garden.viewTime);
    
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
      
      // Show success toast
      addToast({
        type: 'success',
        message: `Added ${selectedPlant.name} to your garden`,
        duration: 3000
      });
    }
    
    // Reset hover preview
    setHoveredCoordinates(null);
    
    // Stop placing the plant
    setIsPlacingPlant(false);
    if (onCancelPlacement) {
      onCancelPlacement();
    }
  }, [garden, selectedPlant, isPlacingPlant, onPlantPlaced, onCancelPlacement, addToast]);
  
  // Handle plant position update
  const handlePlantPositionChange = useCallback((updatedPosition: PlantPosition) => {
    setIsDragging(true);
    if (onPlantUpdate) {
      onPlantUpdate(updatedPosition);
    }
    
    // Add a small delay before setting isDragging back to false
    // This helps prevent flickering if multiple updates come in quickly
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, [onPlantUpdate]);
  
  // Handle plant selection
  const handlePlantSelect = useCallback((id: string) => {
    setSelectedPlantPosition(id);
  }, []);
  
  // Handle plant deletion with confirmation
  const handlePlantDelete = useCallback((id: string) => {
    const plantPosition = garden.plants.find(p => p.id === id);
    if (!plantPosition) return;
    
    const plant = getPlantById(plantPosition.plantId);
    if (!plant) return;
    
    showConfirmation({
      title: 'Remove Plant',
      message: `Are you sure you want to remove ${plant.name} from your garden?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
      onConfirm: () => {
        if (onPlantRemove) {
          onPlantRemove(id);
          setSelectedPlantPosition(null);
          
          // Show toast notification
          addToast({
            type: 'info',
            message: `Removed ${plant.name} from your garden`,
            duration: 3000
          });
        }
      }
    });
  }, [garden.plants, onPlantRemove, getPlantById, showConfirmation, addToast]);
  
  // Cancel plant placement on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlacingPlant && onCancelPlacement) {
        onCancelPlacement();
        setIsPlacingPlant(false);
        setHoveredCoordinates(null);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlacingPlant, onCancelPlacement]);
  
  // Calculate placement preview dimensions
  const placementPreview = useMemo(() => {
    if (!selectedPlant || !hoveredCoordinates || !garden.scaleReference) return null;
    
    // Get plant dimensions based on view time
    const plantDimensions = getPlantDimensionsForViewTime(selectedPlant, garden.viewTime);
    
    // Calculate width and height in pixels
    const { width, height } = inchesToPixels(plantDimensions, {
      pixelsPerInch: garden.scaleReference.pixelsPerInch,
      referenceObjectWidth: garden.scaleReference.width,
      referenceRealWidth: garden.scaleReference.realWidth
    });
    
    return {
      width,
      height,
      x: hoveredCoordinates.x - width / 2,
      y: hoveredCoordinates.y - height / 2
    };
  }, [selectedPlant, hoveredCoordinates, garden.scaleReference, garden.viewTime]);
  
  // Memoize the list of plants to avoid unnecessary re-renders
  const renderedPlants = useMemo(() => {
    if (!garden.scaleReference) return null;
    
    return garden.plants.map(plantPosition => {
      const plant = getPlantById(plantPosition.plantId);
      if (!plant) return null;
      
      return (
        <DraggablePlant
          key={plantPosition.id}
          plant={plant}
          position={plantPosition}
          scaleReference={garden.scaleReference!}
          containerWidth={canvasSize.width}
          containerHeight={canvasSize.height}
          viewTime={garden.viewTime}
          isSelected={selectedPlantPosition === plantPosition.id}
          onSelect={handlePlantSelect}
          onPositionChange={handlePlantPositionChange}
          onDelete={handlePlantDelete}
        />
      );
    });
  }, [
    garden.plants, 
    garden.scaleReference, 
    garden.viewTime, 
    canvasSize, 
    selectedPlantPosition, 
    getPlantById,
    handlePlantSelect, 
    handlePlantPositionChange, 
    handlePlantDelete
  ]);
  
  return (
    <div 
      ref={canvasRef}
      className={`relative mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isPlacingPlant ? 'cursor-crosshair' : 'cursor-default'
      } ${isDragging ? 'scale-[0.99]' : 'scale-100'}`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredCoordinates(null)}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Loading garden...</p>
          </div>
        </div>
      )}
      
      {/* Garden image */}
      <img 
        ref={imageRef}
        src={garden.imageUrl} 
        alt={garden.name}
        className="w-full h-auto transition-opacity duration-300"
        onLoad={handleImageLoad}
        style={{ opacity: isLoading ? 0.5 : 1 }}
      />
      
      {/* Placement preview */}
      {isPlacingPlant && placementPreview && selectedPlant && (
        <div 
          className="absolute pointer-events-none transform-gpu transition-opacity duration-150 z-10 opacity-70 animate-pulse-subtle"
          style={{
            left: placementPreview.x,
            top: placementPreview.y,
            width: placementPreview.width,
            height: placementPreview.height
          }}
        >
          <div 
            className="w-full h-full rounded-full overflow-hidden border-2 border-primary bg-primary bg-opacity-40"
            style={{
              backgroundImage: `url(${selectedPlant.images.thumbnail.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      )}
      
      {/* Placed plants */}
      {renderedPlants}
      
      {/* Garden dimensions and scale info */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-80 p-2 rounded text-xs backdrop-blur-sm transition-opacity duration-300 hover:bg-opacity-100">
        <div>Dimensions: {garden.dimensions.width}' × {garden.dimensions.height}'</div>
        {garden.scaleReference && (
          <div>Scale: {garden.scaleReference.pixelsPerInch.toFixed(2)} px/inch</div>
        )}
      </div>
      
      {/* Placement instruction overlay */}
      {isPlacingPlant && selectedPlant && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none z-20 animate-fade-in">
          <div className="bg-white p-4 rounded-lg text-center max-w-xs">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 border border-primary overflow-hidden">
              <img 
                src={selectedPlant.images.thumbnail.src} 
                alt={selectedPlant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-lg mb-1">{selectedPlant.name}</h3>
            <p className="text-sm text-gray-700 mb-2">Click on the garden to place this plant</p>
            <p className="text-xs text-gray-500">Press ESC to cancel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenCanvas;