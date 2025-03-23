import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../templates';
import { Button } from '../../atoms';
import { GardenPlantSelector, GardenCanvas } from '../../organisms';
import { Plant, PlantPosition } from '../../../types';
// Make sure to use the correct path and export
import { useGarden } from '../../../contexts/GardenContext';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useToast } from '../../molecules/Toast/ToastProvider';
import LoadingScreen from '../../molecules/LoadingScreen/LoadingScreen';

const GardenEditorPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const { addToast } = useToast();
  
  // Access garden context
  const { 
    state: { currentGarden, loading, error },
    loadGarden,
    addPlantToGarden, 
    updatePlantPosition, 
    removePlantFromGarden,
    setViewTime,
    updateGarden
  } = useGarden();
  
  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isUnsaved, setIsUnsaved] = useState(false);
  
  // Load garden data on mount
  useEffect(() => {
    if (gardenId) {
      loadGarden(gardenId);
    }
  }, [gardenId, loadGarden]);
  
  // Update sidebar state when mobile view changes
  useEffect(() => {
    // Automatically open sidebar on desktop if it was closed
    if (!isMobile && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  }, [isMobile, isSidebarOpen]);
  
  // Handle adding a plant to the garden
  const handleAddPlantToGarden = useCallback((plant: Plant) => {
    setSelectedPlant(plant);
    
    // On mobile, close the sidebar when a plant is selected for placement
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Handle plant placement on the canvas
  const handlePlantPlaced = useCallback((plantPosition: PlantPosition) => {
    if (!gardenId) return;
    
    try {
      // Add plant to garden through the context
      addPlantToGarden(gardenId, plantPosition.plantId, {
        x: plantPosition.x,
        y: plantPosition.y,
        width: plantPosition.width,
        height: plantPosition.height,
        rotation: plantPosition.rotation,
        scale: plantPosition.scale,
        zIndex: plantPosition.zIndex
      });
      
      setSelectedPlant(null);
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error adding plant to garden:', err);
      
      addToast({
        type: 'error',
        message: 'Failed to add plant to garden',
        duration: 5000
      });
    }
  }, [gardenId, addPlantToGarden, addToast]);

  // Handle plant position updates
  const handlePlantUpdate = useCallback((updatedPosition: PlantPosition) => {
    if (!gardenId) return;
    
    try {
      // Update plant in garden through the context
      updatePlantPosition(gardenId, updatedPosition);
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error updating plant position:', err);
      
      addToast({
        type: 'error',
        message: 'Failed to update plant position',
        duration: 5000
      });
    }
  }, [gardenId, updatePlantPosition, addToast]);

  // Handle plant removal
  const handlePlantRemove = useCallback((plantId: string) => {
    if (!gardenId) return;
    
    try {
      // Remove plant from garden through the context
      removePlantFromGarden(gardenId, plantId);
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error removing plant from garden:', err);
      
      addToast({
        type: 'error',
        message: 'Failed to remove plant',
        duration: 5000
      });
    }
  }, [gardenId, removePlantFromGarden, addToast]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  // Cancel plant placement
  const handleCancelPlacement = useCallback(() => {
    setSelectedPlant(null);
  }, []);

  // Change garden view time
  const handleViewTimeChange = useCallback((viewTime: 'current' | 'year3' | 'year5' | 'mature') => {
    if (!gardenId || !currentGarden) return;
    
    try {
      setViewTime(gardenId, viewTime);
    } catch (err) {
      console.error('Error changing view time:', err);
      
      addToast({
        type: 'error',
        message: 'Failed to change view time',
        duration: 5000
      });
    }
  }, [gardenId, currentGarden, setViewTime, addToast]);

  // Save garden changes
  const handleSaveGarden = useCallback(() => {
    if (!currentGarden) return;
    
    try {
      updateGarden(currentGarden);
      setIsUnsaved(false);
      
      addToast({
        type: 'success',
        message: 'Garden saved successfully',
        duration: 3000
      });
    } catch (err) {
      console.error('Error saving garden:', err);
      
      addToast({
        type: 'error',
        message: 'Failed to save garden',
        duration: 5000
      });
    }
  }, [currentGarden, updateGarden, addToast]);
  
  // Show loading screen if garden is loading
  if (loading) {
    return <LoadingScreen message="Loading garden..." />;
  }
  
  // Show error message if garden can't be loaded
  if (error || !currentGarden) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[500px]">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Garden Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The garden you are looking for does not exist.'}</p>
            <Button variant="primary" onClick={() => navigate('/garden/new')}>
              Create New Garden
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleSidebar}
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <h1 className="text-xl font-bold truncate max-w-[150px] md:max-w-xs">{currentGarden.name}</h1>
            {isUnsaved && (
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">(Unsaved changes)</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time view selector - simplified on mobile */}
            <div className="flex items-center">
              <select 
                value={currentGarden.viewTime}
                onChange={(e) => handleViewTimeChange(e.target.value as 'current' | 'year3' | 'year5' | 'mature')}
                className="input py-1.5 px-2 text-sm rounded-md"
                aria-label="Growth timeline"
              >
                <option value="current">Now</option>
                <option value="year3">3 Yrs</option>
                <option value="year5">5 Yrs</option>
                <option value="mature">Mature</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              {/* Save button always visible, scale button only on larger screens */}
              <Button 
                variant="primary"
                size="sm"
                onClick={handleSaveGarden}
                disabled={!isUnsaved}
                className="whitespace-nowrap"
              >
                Save
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/garden/${gardenId}/scale`)}
                className="whitespace-nowrap hidden sm:inline-flex"
              >
                Edit Scale
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with plant selection - slide in on mobile, fixed on desktop */}
          <div 
            className={`${
              isMobile 
                ? `fixed inset-y-0 left-0 z-30 w-80 bg-white transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`
                : `${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 h-full border-r overflow-hidden`
            }`}
            style={{ top: isMobile ? '64px' : '0' }}
          >
            {isSidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <GardenPlantSelector
                    onAddPlantToGarden={handleAddPlantToGarden}
                    viewTime={currentGarden.viewTime}
                  />
                </div>
                
                {/* Mobile-only close button at bottom */}
                {isMobile && (
                  <div className="p-4 border-t">
                    <Button 
                      variant="outline" 
                      fullWidth 
                      onClick={toggleSidebar}
                    >
                      Close Plant Selection
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Overlay to close sidebar on mobile */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={toggleSidebar}
              aria-hidden="true"
              style={{ top: '64px' }}
            />
          )}
          
          {/* Main garden editor area */}
          <div className="flex-1 flex flex-col bg-gray-100 overflow-auto">
            {/* Garden canvas */}
            <div className="flex-1 p-4">
              <GardenCanvas
                garden={currentGarden}
                selectedPlant={selectedPlant}
                onPlantPlaced={handlePlantPlaced}
                onPlantUpdate={handlePlantUpdate}
                onPlantRemove={handlePlantRemove}
                onCancelPlacement={handleCancelPlacement}
              />
            </div>
            
            {/* Mobile bottom action bar */}
            {isMobile && !isSidebarOpen && (
              <div className="bg-white border-t p-3 flex justify-between items-center">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebar}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Plants
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/garden/${gardenId}/scale`)}
                >
                  Edit Scale
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GardenEditorPage;