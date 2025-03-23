import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../templates';
import { GardenScaling } from '../../organisms';
import { Button } from '../../atoms';
import { Garden } from '../../../types';
import { useGarden } from '../../../contexts/GardenContext';
import { useToast } from '../../molecules/Toast/ToastProvider';
import LoadingScreen from '../../molecules/LoadingScreen/LoadingScreen';

const GardenScalingPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Access garden context
  const { 
    state: { currentGarden, loading, error }, 
    loadGarden, 
    setScaleReference 
  } = useGarden();
  
  // Load garden on mount
  useEffect(() => {
    if (gardenId) {
      loadGarden(gardenId);
    }
  }, [gardenId, loadGarden]);
  
  // Handle scale reference setting
  const handleScalingComplete = (updatedGarden: Garden) => {
    if (gardenId) {
      addToast({
        type: 'success',
        message: 'Garden scaling completed successfully',
        duration: 3000
      });
    }
  };
  
  // Show loading screen while garden is loading
  if (loading) {
    return <LoadingScreen message="Loading garden data..." />;
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
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display mb-2">Set Garden Scale</h1>
          <p className="text-gray-600">
            Configure the scale of your garden to ensure plants are sized correctly.
          </p>
        </div>
        
        <GardenScaling 
          garden={currentGarden}
          onScalingComplete={handleScalingComplete}
        />
      </div>
    </MainLayout>
  );
};

export default GardenScalingPage;