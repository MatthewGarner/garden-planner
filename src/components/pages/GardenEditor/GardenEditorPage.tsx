import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../templates';
import { Button } from '../../atoms';
import { GardenPlantSelector, GardenCanvas } from '../../organisms';
import { gardenService } from '../../../services';
import { Garden, Plant, PlantPosition } from '../../../types';

const GardenEditorPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  // Update isMobileView on window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobileView = window.innerWidth < 768;
      setIsMobileView(newIsMobileView);
      
      // Automatically open sidebar on desktop if it was closed
      if (!newIsMobileView && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);
  
  useEffect(() => {
    const loadGarden = () => {
      if (!gardenId) {
        setError('No garden ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const loadedGarden = gardenService.getGardenById(gardenId);
        
        if (!loadedGarden) {
          setError(`Garden with ID ${gardenId} not found`);
          setLoading(false);
          return;
        }
        
        setGarden(loadedGarden);
        
        // If the garden doesn't have a scale reference, redirect to the scaling page
        if (!loadedGarden.scaleReference) {
          navigate(`/garden/${gardenId}/scale`);
          return;
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load garden data');
      } finally {
        setLoading(false);
      }
    };
    
    loadGarden();
  }, [gardenId, navigate]);
  
  // Handle adding a plant to the garden
  const handleAddPlantToGarden = (plant: Plant) => {
    setSelectedPlant(plant);
    
    // On mobile, close the sidebar when a plant is selected for placement
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  // Handle plant placement on the canvas
  const handlePlantPlaced = (plantPosition: PlantPosition) => {
    if (!garden || !gardenId) return;
    
    try {
      // Add plant to garden through the service
      gardenService.addPlantToGarden(gardenId, plantPosition);
      
      // Update local garden state
      const updatedGarden = gardenService.getGardenById(gardenId);
      if (updatedGarden) {
        setGarden(updatedGarden);
      }
      
      setSelectedPlant(null);
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error adding plant to garden:', err);
    }
  };

  // Handle plant position updates
  const handlePlantUpdate = (updatedPosition: PlantPosition) => {
    if (!garden || !gardenId) return;
    
    try {
      // Update plant in garden through the service
      gardenService.updatePlantPosition(gardenId, updatedPosition);
      
      // Update local garden state
      const updatedGarden = gardenService.getGardenById(gardenId);
      if (updatedGarden) {
        setGarden(updatedGarden);
      }
      
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error updating plant position:', err);
    }
  };

  // Handle plant removal
  const handlePlantRemove = (plantId: string) => {
    if (!garden || !gardenId) return;
    
    try {
      // Remove plant from garden through the service
      gardenService.removePlantFromGarden(gardenId, plantId);
      
      // Update local garden state
      const updatedGarden = gardenService.getGardenById(gardenId);
      if (updatedGarden) {
        setGarden(updatedGarden);
      }
      
      setIsUnsaved(true);
    } catch (err) {
      console.error('Error removing plant from garden:', err);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cancel plant placement
  const handleCancelPlacement = () => {
    setSelectedPlant(null);
  };

  // Change garden view time
  const handleViewTimeChange = (viewTime: Garden['viewTime']) => {
    if (!garden || !gardenId) return;
    
    try {
      gardenService.setGardenViewTime(gardenId, viewTime);
      
      // Update garden state
      setGarden({
        ...garden,
        viewTime
      });
    } catch (err) {
      console.error('Error changing view time:', err);
    }
  };

  // Save garden changes
  const handleSaveGarden = () => {
    if (!garden || !gardenId) return;
    
    try {
      gardenService.saveGarden(garden);
      setIsUnsaved(false);
    } catch (err) {
      console.error('Error saving garden:', err);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading garden data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !garden) {
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
            <h1 className="text-xl font-bold truncate max-w-[150px] md:max-w-xs">{garden.name}</h1>
            {isUnsaved && (
              <span className="ml-2 text-sm text-gray-500 hidden sm:inline">(Unsaved changes)</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time view selector - simplified on mobile */}
            <div className="flex items-center">
              <select 
                value={garden.viewTime}
                onChange={(e) => handleViewTimeChange(e.target.value as Garden['viewTime'])}
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
              isMobileView 
                ? `fixed inset-y-0 left-0 z-30 w-80 bg-white transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`
                : `${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 h-full border-r overflow-hidden`
            }`}
            style={{ top: isMobileView ? '64px' : '0' }}
          >
            {isSidebarOpen && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <GardenPlantSelector
                    onAddPlantToGarden={handleAddPlantToGarden}
                    viewTime={garden.viewTime}
                  />
                </div>
                
                {/* Mobile-only close button at bottom */}
                {isMobileView && (
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
          {isMobileView && isSidebarOpen && (
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
                garden={garden}
                selectedPlant={selectedPlant}
                onPlantPlaced={handlePlantPlaced}
                onPlantUpdate={handlePlantUpdate}
                onPlantRemove={handlePlantRemove}
                onCancelPlacement={handleCancelPlacement}
              />
            </div>
            
            {/* Mobile bottom action bar */}
            {isMobileView && !isSidebarOpen && (
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