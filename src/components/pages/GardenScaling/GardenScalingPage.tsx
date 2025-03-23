import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../templates';
import { GardenScaling } from '../../organisms';
import { Button } from '../../atoms';
import { gardenService } from '../../../services';
import { Garden } from '../../../types';

const GardenScalingPage: React.FC = () => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      } catch (err) {
        console.error(err);
        setError('Failed to load garden data');
      } finally {
        setLoading(false);
      }
    };
    
    loadGarden();
  }, [gardenId]);
  
  const handleScalingComplete = (updatedGarden: Garden) => {
    setGarden(updatedGarden);
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
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display mb-2">Set Garden Scale</h1>
          <p className="text-gray-600">
            Configure the scale of your garden to ensure plants are sized correctly.
          </p>
        </div>
        
        <GardenScaling 
          garden={garden}
          onScalingComplete={handleScalingComplete}
        />
      </div>
    </MainLayout>
  );
};

export default GardenScalingPage;