import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../atoms';
import { MainLayout } from '../../templates';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 py-10">
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">
              Design Your Dream Garden
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Upload a photo of your space and see how plants will look in your garden 
              before you buy. Plan, visualize, and create the perfect outdoor space.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/garden/new')}
              >
                Get Started
              </Button>
              <Link to="/plants">
                <Button variant="outline" size="lg">Browse Plants</Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-200 rounded-xl overflow-hidden aspect-video">
              {/* Placeholder for hero image */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 font-medium">Garden Preview Image</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12">
          <h2 className="text-3xl font-bold font-display text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Upload Your Garden',
                description: 'Start by uploading a photo of your garden space.'
              },
              {
                title: 'Add Plants',
                description: 'Browse our plant database and drag plants into your garden.'
              },
              {
                title: 'Visualize & Plan',
                description: 'See how your garden will look now and in the future.'
              }
            ].map((step, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;