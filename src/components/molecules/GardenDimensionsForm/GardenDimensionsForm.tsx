import React, { useState } from 'react';
import { Button } from '../../atoms';
import { GardenDimensions } from '../../../types';

interface GardenDimensionsFormProps {
  onDimensionsSet: (dimensions: GardenDimensions) => void;
  initialDimensions?: GardenDimensions;
}

const GardenDimensionsForm: React.FC<GardenDimensionsFormProps> = ({
  onDimensionsSet,
  initialDimensions = { width: 10, height: 10 }
}) => {
  const [dimensions, setDimensions] = useState<GardenDimensions>(initialDimensions);
  const [errors, setErrors] = useState<{ width?: string; height?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setDimensions(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: { width?: string; height?: string } = {};
    
    if (isNaN(dimensions.width) || dimensions.width <= 0) {
      newErrors.width = 'Please enter a valid width';
    } else if (dimensions.width > 200) {
      newErrors.width = 'Width cannot exceed 200 feet';
    }
    
    if (isNaN(dimensions.height) || dimensions.height <= 0) {
      newErrors.height = 'Please enter a valid height';
    } else if (dimensions.height > 200) {
      newErrors.height = 'Height cannot exceed 200 feet';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
    onDimensionsSet(dimensions);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Garden Dimensions</h2>
      <p className="text-gray-600 mb-6">
        Enter the approximate dimensions of your garden area to help scale plants accurately.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (in feet)
            </label>
            <input
              type="number"
              name="width"
              value={dimensions.width}
              onChange={handleChange}
              min="1"
              max="200"
              step="0.5"
              className={`input w-full ${errors.width ? 'border-red-500' : ''}`}
            />
            {errors.width && (
              <p className="mt-1 text-sm text-red-600">{errors.width}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length (in feet)
            </label>
            <input
              type="number"
              name="height"
              value={dimensions.height}
              onChange={handleChange}
              min="1"
              max="200"
              step="0.5"
              className={`input w-full ${errors.height ? 'border-red-500' : ''}`}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Set Dimensions
            </Button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>You can adjust these dimensions later if needed.</p>
      </div>
    </div>
  );
};

export default GardenDimensionsForm;