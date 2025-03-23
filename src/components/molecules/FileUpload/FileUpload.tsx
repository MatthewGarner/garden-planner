import React, { useRef, useState } from 'react';
import { useImageUpload } from '../../../hooks';
import { Button } from '../../atoms';

interface FileUploadProps {
  onImageUploaded: (imageDataUrl: string, file: File) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  instructionText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onImageUploaded,
  maxSizeMB = 15,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  instructionText = 'Upload a photo of your garden'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { 
    image, 
    originalFile, 
    loading, 
    error, 
    handleFileSelect, 
    handleFileDrop, 
    handleDragOver,
    clearImage 
  } = useImageUpload({
    maxSizeMB,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 4000,
    maxHeight: 3000,
    autoResize: true
  });

  // Handle file drop
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const success = await handleFileDrop(e);
    
    if (success && image && originalFile) {
      onImageUploaded(image, originalFile);
    }
  };

  // Handle file input change
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const success = await handleFileSelect(file);
      
      if (success && image) {
        onImageUploaded(image, file);
      }
    }
  };

  // Trigger the file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
          handleDragOver(e);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptedFileTypes.join(',')}
          onChange={onFileChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-1">{instructionText}</p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your image here, or click the button below
            </p>
            <Button onClick={onButtonClick}>
              Select Image
            </Button>
          </div>
          
          {loading && (
            <div className="mt-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Processing image...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            Supported formats: JPEG, PNG, WebP • Max size: {maxSizeMB}MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;