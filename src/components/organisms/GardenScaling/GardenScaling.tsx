import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GardenDimensionsForm, ReferenceObject } from '../../molecules';
import { Button } from '../../atoms';
import { GardenDimensions, Garden } from '../../../types';
import { gardenService } from '../../../services';

interface GardenScalingProps {
  garden: Garden;
  onScalingComplete?: (updatedGarden: Garden) => void;
}

enum ScalingStep {
  REFERENCE_OBJECT,
  GARDEN_DIMENSIONS,
  CONFIRMATION
}

const GardenScaling: React.FC<GardenScalingProps> = ({
  garden,
  onScalingComplete
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ScalingStep>(ScalingStep.REFERENCE_OBJECT);
  const [scaleReference, setScaleReference] = useState<{ width: number; height: number; realWidth: number } | null>(null);
  const [gardenDimensions, setGardenDimensions] = useState<GardenDimensions>(garden.dimensions);
  const [error, setError] = useState<string | null>(null);
  const [updatedGarden, setUpdatedGarden] = useState<Garden | null>(null);

  // Handle reference object placement
  const handleReferenceSet = (reference: { width: number; height: number; realWidth: number }) => {
    setScaleReference(reference);
    setCurrentStep(ScalingStep.GARDEN_DIMENSIONS);
  };

  // Handle garden dimensions setting
  const handleDimensionsSet = (dimensions: GardenDimensions) => {
    setGardenDimensions(dimensions);
    setCurrentStep(ScalingStep.CONFIRMATION);
  };

  // Complete the scaling process
  const handleComplete = () => {
    if (!scaleReference) {
      setError('Reference object is required');
      return;
    }

    try {
      // Update the garden with scale reference and dimensions
      const updated = gardenService.setScaleReference(garden.id, scaleReference);
      
      if (!updated) {
        setError('Failed to update garden scale reference');
        return;
      }
      
      // Also update dimensions if they've changed
      if (gardenDimensions.width !== garden.dimensions.width || 
          gardenDimensions.height !== garden.dimensions.height) {
        gardenService.updateGardenDimensions(garden.id, gardenDimensions);
        
        // Get the fully updated garden
        const fullyUpdated = gardenService.getGardenById(garden.id);
        
        if (fullyUpdated) {
          setUpdatedGarden(fullyUpdated);
          
          if (onScalingComplete) {
            onScalingComplete(fullyUpdated);
          }
        }
      } else {
        setUpdatedGarden(updated);
        
        if (onScalingComplete) {
          onScalingComplete(updated);
        }
      }
    } catch (err) {
      console.error('Error updating garden:', err);
      setError('Failed to save garden scaling information');
    }
  };

  // Handle going back a step
  const handleBack = () => {
    if (currentStep === ScalingStep.GARDEN_DIMENSIONS) {
      setCurrentStep(ScalingStep.REFERENCE_OBJECT);
    } else if (currentStep === ScalingStep.CONFIRMATION) {
      setCurrentStep(ScalingStep.GARDEN_DIMENSIONS);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transition-all"
            style={{ 
              width: currentStep === ScalingStep.REFERENCE_OBJECT ? '0%' : 
                    currentStep === ScalingStep.GARDEN_DIMENSIONS ? '50%' : '100%' 
            }}
          ></div>
          
          {/* Step Circles */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
              currentStep >= ScalingStep.REFERENCE_OBJECT ? 'bg-primary' : 'bg-gray-300'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Reference</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
              currentStep >= ScalingStep.GARDEN_DIMENSIONS ? 'bg-primary' : 'bg-gray-300'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Dimensions</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
              currentStep >= ScalingStep.CONFIRMATION ? 'bg-primary' : 'bg-gray-300'
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Confirm</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {currentStep === ScalingStep.REFERENCE_OBJECT && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Place Reference Object</h2>
            <p className="text-gray-600 mb-6">
              To accurately scale plants, we need to know the real-world size of objects in your garden photo.
            </p>
            
            <ReferenceObject 
              gardenImageUrl={garden.imageUrl}
              onReferenceSet={handleReferenceSet}
            />
          </div>
        )}
        
        {currentStep === ScalingStep.GARDEN_DIMENSIONS && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Confirm Garden Dimensions</h2>
            <p className="text-gray-600 mb-6">
              Now, confirm or adjust the overall dimensions of your garden area.
            </p>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={garden.imageUrl}
                    alt="Garden with reference"
                    className="w-full h-auto"
                  />
                  
                  {scaleReference && (
                    <div
                      className="absolute border-2 border-primary bg-primary bg-opacity-30 flex items-center justify-center text-white font-medium"
                      style={{
                        left: `${scaleReference.width/2}px`,
                        top: `${scaleReference.height/2}px`,
                        width: `${scaleReference.width}px`,
                        height: `${scaleReference.height}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="text-xs bg-primary px-2 py-1 rounded">
                        {scaleReference.realWidth}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <GardenDimensionsForm 
                  onDimensionsSet={handleDimensionsSet}
                  initialDimensions={gardenDimensions}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-start">
              <Button variant="outline" onClick={handleBack}>
                Back to Reference
              </Button>
            </div>
          </div>
        )}
        
        {currentStep === ScalingStep.CONFIRMATION && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Confirm Garden Scaling</h2>
            <p className="text-gray-600 mb-6">
              Please review your garden scaling settings before proceeding.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Garden Scaling Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Reference Object</h4>
                  <p className="text-gray-600">Width: {scaleReference?.realWidth} inches</p>
                  <p className="text-gray-600">Pixels per inch: {(scaleReference?.width || 0) / (scaleReference?.realWidth || 1)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Garden Dimensions</h4>
                  <p className="text-gray-600">Width: {gardenDimensions.width} feet</p>
                  <p className="text-gray-600">Length: {gardenDimensions.height} feet</p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {updatedGarden ? (
              <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                Garden scaling has been successfully updated!
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleComplete}>
                  Save Scaling Information
                </Button>
              </div>
            )}
            
            {updatedGarden && (
              <div className="flex justify-end">
                <Button 
                  variant="primary"
                  onClick={() => navigate(`/garden/${garden.id}`)}
                >
                  Continue to Garden Editor
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenScaling;