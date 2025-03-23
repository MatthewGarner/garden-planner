import React, { useState } from 'react';
import { Button } from '../../atoms';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  onNext?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onRemove,
  onNext
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full flex flex-col">
      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100 mb-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={imageUrl}
          alt="Garden preview"
          className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
        />
        
        <div className="absolute top-3 right-3">
          <button
            onClick={onRemove}
            className="bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full transition shadow-sm"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-500">
          Your garden image is ready for the next step.
        </p>
        
        {onNext && (
          <Button onClick={onNext} variant="primary">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;