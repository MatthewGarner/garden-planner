import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../atoms';

interface ReferenceObjectProps {
  onReferenceSet: (referenceSize: { width: number; height: number; realWidth: number }) => void;
  gardenImageUrl: string;
}

const REFERENCE_OBJECTS = [
  { name: 'Door', defaultWidth: 36, icon: '🚪' },
  { name: 'Chair', defaultWidth: 18, icon: '🪑' },
  { name: 'Person', defaultWidth: 24, icon: '👤' },
  { name: 'Custom', defaultWidth: 12, icon: '📏' }
];

const ReferenceObject: React.FC<ReferenceObjectProps> = ({
  onReferenceSet,
  gardenImageUrl
}) => {
  const [selectedObject, setSelectedObject] = useState(REFERENCE_OBJECTS[0]);
  const [customWidth, setCustomWidth] = useState<number>(12);
  const [objectWidth, setObjectWidth] = useState<number>(REFERENCE_OBJECTS[0].defaultWidth);
  const [isPlacing, setIsPlacing] = useState(false);
  const [referenceRect, setReferenceRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle object selection
  const handleObjectSelect = (object: typeof REFERENCE_OBJECTS[0]) => {
    setSelectedObject(object);
    if (object.name !== 'Custom') {
      setObjectWidth(object.defaultWidth);
    } else {
      setObjectWidth(customWidth);
    }
  };

  // Handle custom width change
  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomWidth(value);
      setObjectWidth(value);
    }
  };

  // Start placing the reference object
  const handleStartPlacement = () => {
    setIsPlacing(true);
    setReferenceRect(null);
  };

  // Handle click on the image to place the reference object
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing || !imageContainerRef.current || !imageRef.current) return;

    // Get the bounding client rect of the container
    const containerRect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate click position relative to the image container
    const relativeX = e.clientX - containerRect.left;
    const relativeY = e.clientY - containerRect.top;
    
    // Calculate the reference object size (in pixels)
    // Default sizes for common objects
    const refHeightMultiplier = 
      selectedObject.name === 'Door' ? 2.5 : 
      selectedObject.name === 'Person' ? 2 : 
      selectedObject.name === 'Chair' ? 1 : 1;
    
    const refWidth = 100; // Default width in pixels
    const refHeight = refWidth * refHeightMultiplier;
    
    console.log('Placing reference object at:', { x: relativeX, y: relativeY, width: refWidth, height: refHeight });
    
    // Set the reference rectangle
    setReferenceRect({
      x: relativeX,
      y: relativeY,
      width: refWidth,
      height: refHeight
    });
    
    setIsPlacing(false);
  };

  // Complete reference setting
  const handleSetReference = () => {
    if (!referenceRect) return;
    
    // Pass the reference object's dimensions to the parent component
    onReferenceSet({
      width: referenceRect.width,
      height: referenceRect.height,
      realWidth: objectWidth // in inches
    });
  };

  // Reset the reference placement
  const handleReset = () => {
    setReferenceRect(null);
    setIsPlacing(false);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold mb-3">Set Scale Reference</h3>
      <p className="text-gray-600 mb-4">
        To accurately represent plant sizes, place a reference object in your garden photo.
      </p>
      
      {/* Reference object selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a reference object:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {REFERENCE_OBJECTS.map((object) => (
            <button
              key={object.name}
              className={`p-3 rounded-lg text-center transition ${
                selectedObject.name === object.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleObjectSelect(object)}
            >
              <div className="text-2xl mb-1">{object.icon}</div>
              <div className="text-sm">{object.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom width input for Custom reference */}
      {selectedObject.name === 'Custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (inches):
          </label>
          <input
            type="number"
            value={customWidth}
            onChange={handleCustomWidthChange}
            min="1"
            max="120"
            step="1"
            className="input w-full"
          />
        </div>
      )}
      
      {/* Reference placement area */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">
          {isPlacing
            ? `Click on the image to place the ${selectedObject.name}`
            : referenceRect
            ? `${selectedObject.name} (${objectWidth}" wide) placed on image`
            : "Click 'Place Reference' to position your reference object"}
        </p>
        
        <div 
          className="relative rounded-lg overflow-hidden bg-gray-100" 
          ref={imageContainerRef}
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={gardenImageUrl}
            alt="Garden with reference"
            className="w-full h-auto"
          />
          
          {/* Show the placed reference object */}
          {referenceRect && (
            <div
              className="absolute border-2 border-primary bg-primary bg-opacity-30 flex items-center justify-center text-white font-medium"
              style={{
                left: `${referenceRect.x}px`,
                top: `${referenceRect.y}px`,
                width: `${referenceRect.width}px`,
                height: `${referenceRect.height}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-xs bg-primary px-2 py-1 rounded">
                {objectWidth}"
              </div>
            </div>
          )}
          
          {isPlacing && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white text-gray-800 p-4 rounded-lg">
                Click to place {selectedObject.name}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-3">
        {!isPlacing && !referenceRect ? (
          <Button variant="primary" onClick={handleStartPlacement} fullWidth>
            Place Reference
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            {referenceRect && (
              <Button variant="primary" onClick={handleSetReference}>
                Set Scale
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReferenceObject;