import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../templates';
import { FileUpload, ImagePreview, GardenDimensionsForm } from '../../molecules';
import { Button } from '../../atoms';
import { GardenDimensions } from '../../../types';
import { gardenService } from '../../../services';

enum UploadStep {
  UPLOAD,
  DIMENSIONS,
  NAMING
}

const GardenUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<UploadStep>(UploadStep.UPLOAD);
  const [gardenImage, setGardenImage] = useState<string | null>(null);
  const [gardenFile, setGardenFile] = useState<File | null>(null);
  const [gardenDimensions, setGardenDimensions] = useState<GardenDimensions>({ width: 10, height: 10 });
  const [gardenName, setGardenName] = useState<string>('My Garden');
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const handleImageUploaded = (imageDataUrl: string, file: File) => {
    console.log("Image uploaded:", imageDataUrl.substring(0, 50) + "...");
    setGardenImage(imageDataUrl);
    setGardenFile(file);
    setCurrentStep(UploadStep.DIMENSIONS);
  };

  const handleRemoveImage = () => {
    setGardenImage(null);
    setGardenFile(null);
    setCurrentStep(UploadStep.UPLOAD);
  };

  const handleDimensionsSet = (dimensions: GardenDimensions) => {
    setGardenDimensions(dimensions);
    setCurrentStep(UploadStep.NAMING);
  };

  const handleBack = () => {
    if (currentStep === UploadStep.DIMENSIONS) {
      setCurrentStep(UploadStep.UPLOAD);
    } else if (currentStep === UploadStep.NAMING) {
      setCurrentStep(UploadStep.DIMENSIONS);
    }
  };

  const handleCreateGarden = () => {
    try {
      if (!gardenImage || !gardenFile) {
        setError('Garden image is required');
        return;
      }

      if (!gardenName.trim()) {
        setError('Garden name is required');
        return;
      }

      // Create the garden in the service
      const newGarden = gardenService.createGarden(gardenName, gardenImage, gardenDimensions);
      
      // Navigate to the garden scaling page
      navigate(`/garden/${newGarden.id}/scale`);
    } catch (err) {
      setError('Failed to create garden. Please try again.');
      console.error(err);
    }
  };

  // Get the step title
  const getStepTitle = () => {
    switch (currentStep) {
      case UploadStep.UPLOAD:
        return "Upload Your Garden Photo";
      case UploadStep.DIMENSIONS:
        return "Set Garden Dimensions";
      case UploadStep.NAMING:
        return "Garden Details";
    }
  };

  // Get the step description
  const getStepDescription = () => {
    switch (currentStep) {
      case UploadStep.UPLOAD:
        return "Start by uploading a photo of your garden area. This will be used as the base for your design.";
      case UploadStep.DIMENSIONS:
        return "Enter the approximate dimensions of your garden to help accurately scale plants.";
      case UploadStep.NAMING:
        return "Add a name and any additional details about your garden.";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        {/* Step Indicator - more compact on mobile */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transition-all"
              style={{ 
                width: currentStep === UploadStep.UPLOAD ? '0%' : 
                      currentStep === UploadStep.DIMENSIONS ? '50%' : '100%' 
              }}
            ></div>
            
            {/* Step Circles - smaller on mobile */}
            <div className="flex flex-col items-center">
              <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                currentStep >= UploadStep.UPLOAD ? 'bg-primary' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Upload</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                currentStep >= UploadStep.DIMENSIONS ? 'bg-primary' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Dimensions</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                currentStep >= UploadStep.NAMING ? 'bg-primary' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Details</span>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>{getStepTitle()}</h2>
          <p className="text-gray-600 mb-6">{getStepDescription()}</p>
          
          {currentStep === UploadStep.UPLOAD && (
            <div>
              {gardenImage ? (
                <ImagePreview 
                  imageUrl={gardenImage} 
                  onRemove={handleRemoveImage}
                  onNext={() => setCurrentStep(UploadStep.DIMENSIONS)} 
                />
              ) : (
                <FileUpload onImageUploaded={handleImageUploaded} />
              )}
            </div>
          )}
          
          {currentStep === UploadStep.DIMENSIONS && (
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <ImagePreview 
                    imageUrl={gardenImage!} 
                    onRemove={handleRemoveImage} 
                  />
                </div>
                
                <div className="md:w-1/2">
                  <GardenDimensionsForm 
                    onDimensionsSet={handleDimensionsSet}
                    initialDimensions={gardenDimensions}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="min-h-[44px] min-w-[44px]"
                >
                  Back to Upload
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === UploadStep.NAMING && (
            <div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <ImagePreview 
                    imageUrl={gardenImage!} 
                    onRemove={handleRemoveImage} 
                  />
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Garden Dimensions</h3>
                    <p className="text-gray-700">
                      Width: {gardenDimensions.width} ft • Length: {gardenDimensions.height} ft
                    </p>
                    <button 
                      onClick={() => setCurrentStep(UploadStep.DIMENSIONS)}
                      className="text-primary text-sm font-medium mt-2 hover:underline min-h-[44px] touch-manipulation flex items-center"
                    >
                      Edit Dimensions
                    </button>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                    <h3 className="text-xl font-bold mb-4">Garden Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Garden Name
                        </label>
                        <input
                          type="text"
                          value={gardenName}
                          onChange={(e) => setGardenName(e.target.value)}
                          className="input w-full h-12 text-base"
                          placeholder="My Garden"
                        />
                      </div>
                      
                      {error && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                          {error}
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <Button
                          onClick={handleCreateGarden}
                          variant="primary"
                          fullWidth
                          className="min-h-[44px] text-base"
                        >
                          Create Garden
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="min-h-[44px] min-w-[44px]"
                >
                  Back to Dimensions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GardenUploadPage;