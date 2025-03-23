import React from 'react';
import { MainLayout } from '../../templates';
import { GardenUpload } from '../../organisms';

const GardenUploadPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-display mb-2">Create a New Garden</h1>
          <p className="text-gray-600 mb-8">
            Upload a photo of your garden space and set the dimensions to get started.
          </p>
          
          <GardenUpload />
        </div>
      </div>
    </MainLayout>
  );
};

export default GardenUploadPage;