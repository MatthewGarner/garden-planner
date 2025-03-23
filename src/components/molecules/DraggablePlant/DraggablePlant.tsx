import React, { useState, useRef, useEffect } from 'react';
import { Plant, PlantPosition, ScaleReference } from '../../../types';
import { plantService } from '../../../services';

interface DraggablePlantProps {
  plant: Plant;
  position: PlantPosition;
  scaleReference: ScaleReference;
  containerWidth: number;
  containerHeight: number;
  viewTime: 'current' | 'year3' | 'year5' | 'mature';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (updatedPosition: PlantPosition) => void;
  onDelete: (id: string) => void;
}

const DraggablePlant: React.FC<DraggablePlantProps> = ({
  plant,
  position,
  scaleReference,
  containerWidth,
  containerHeight,
  viewTime,
  isSelected,
  onSelect,
  onPositionChange,
  onDelete
}) => {
  const plantRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(position.rotation);
  const [scale, setScale] = useState(position.scale);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Get the plant dimensions based on the current viewTime
  const getPlantDimensions = () => {
    const { initialYear, threeYears, fiveYears, mature } = plant.dimensions;
    
    switch (viewTime) {
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

  // Calculate plant size in pixels based on real-world dimensions and scale
  const calculateSizeInPixels = () => {
    const plantDimensions = getPlantDimensions();
    
    // Convert from inches to pixels using the scaleReference
    const widthInPixels = plantDimensions.width * scaleReference.pixelsPerInch * scale;
    const heightInPixels = plantDimensions.height * scaleReference.pixelsPerInch * scale;
    
    return { width: widthInPixels, height: heightInPixels };
  };

  // Convert position from percentage to pixels
  const percentToPixels = (percent: number, dimension: 'width' | 'height') => {
    return (percent / 100) * (dimension === 'width' ? containerWidth : containerHeight);
  };

  // Convert position from pixels to percentage
  const pixelsToPercent = (pixels: number, dimension: 'width' | 'height') => {
    return (pixels / (dimension === 'width' ? containerWidth : containerHeight)) * 100;
  };

  // Handle mouse/touch down on plant for dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    
    if (!plantRef.current) return;
    
    // Capture pointer to ensure events are delivered
    if (e.target instanceof Element) {
      e.target.setPointerCapture(e.pointerId);
    }
    
    // Select this plant
    onSelect(position.id);
    
    // Calculate the offset between pointer position and plant position
    const plantRect = plantRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - plantRect.left,
      y: e.clientY - plantRect.top
    });
    
    setIsDragging(true);
  };

  // Handle pointer move for dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !plantRef.current) return;
    
    // Calculate new position in pixels
    const containerRect = plantRef.current.parentElement?.getBoundingClientRect();
    if (!containerRect) return;
    
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;
    
    // Convert to percentage of container
    const newXPercent = pixelsToPercent(newX, 'width');
    const newYPercent = pixelsToPercent(newY, 'height');
    
    // Update position
    const updatedPosition = {
      ...position,
      x: Math.max(0, Math.min(100, newXPercent)),
      y: Math.max(0, Math.min(100, newYPercent))
    };
    
    onPositionChange(updatedPosition);
  };

  // Handle pointer up to end dragging
  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.target instanceof Element) {
      e.target.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // Handle rotation change
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRotation = parseInt(e.target.value);
    setRotation(newRotation);
    
    const updatedPosition = {
      ...position,
      rotation: newRotation
    };
    
    onPositionChange(updatedPosition);
  };

  // Handle scale change
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    
    const updatedPosition = {
      ...position,
      scale: newScale
    };
    
    onPositionChange(updatedPosition);
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onDelete(position.id);
  };

  // Calculate plant size in pixels
  const plantSize = calculateSizeInPixels();

  // Get plant position in pixels
  const plantX = percentToPixels(position.x, 'width');
  const plantY = percentToPixels(position.y, 'height');

  return (
    <div
      ref={plantRef}
      className={`absolute touch-manipulation ${isDragging ? 'z-30' : isSelected ? 'z-20' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${plantSize.width}px`,
        height: `${plantSize.height}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        zIndex: position.zIndex,
        cursor: 'move',
        WebkitTapHighlightColor: 'transparent' // Remove tap highlight on mobile
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(position.id);
      }}
    >
      {/* Plant image placeholder */}
      <div 
        className={`w-full h-full rounded-full overflow-hidden border-2 transition-all ${
          isSelected ? 'border-primary shadow-lg' : 'border-transparent'
        }`}
        style={{
          backgroundColor: `rgba(144, 238, 144, ${isSelected ? 0.5 : 0.3})`,
          backgroundImage: `url(${plant.images.thumbnail.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Plant name and controls (visible when selected) */}
      {isSelected && (
        <div className={`absolute ${isMobile ? 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 mb-1' : '-bottom-16 left-1/2 transform -translate-x-1/2'} bg-white rounded-lg shadow-md p-2 min-w-[11rem] w-max z-30`}>
          <div className="text-xs font-medium text-center mb-2 truncate max-w-full">{plant.name}</div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs mr-2">Rotate:</span>
              <input
                type="range"
                min="0"
                max="359"
                value={rotation}
                onChange={handleRotationChange}
                className="w-20 h-5"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs mr-2">Size:</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
                className="w-20 h-5"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            
            <button
              className="w-full bg-red-100 hover:bg-red-200 text-red-600 text-xs px-2 py-2 rounded min-h-[44px] touch-manipulation"
              onClick={handleDelete}
              aria-label="Remove plant"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggablePlant;