import React, { useRef, useState } from 'react';
import { Button } from '../../atoms';
import { useFileUpload } from '../../../hooks';
import { useWindowSize } from '../../../hooks/useWindowSize';

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
  const { isMobile } = useWindowSize();
  
  // Use our custom file upload hook
  const {
    image,
    originalFile,
    loading,
    error,
    progress,
    handleFileSelect,
    handleFileDrop,
    handleDragOver,
    useCameraCapture
  } = useFileUpload({
    maxSizeMB,
    acceptedFileTypes
  });
  
  // When image is successfully loaded, call the parent component's callback
  React.useEffect(() => {
    if (image && originalFile) {
      onImageUploaded(image, originalFile);
    }
  }, [image, originalFile, onImageUploaded]);
  
  // Handle file input change
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileSelect(e.target.files[0]);
    }
  };

  // Trigger the file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle drag over to update visual state
  const onDragEnter = () => {
    setIsDragging(true);
  };
  
  // Handle drag leave to update visual state
  const onDragLeave = () => {
    setIsDragging(false);
  };
  
  // Handle drop event
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    await handleFileDrop(e);
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
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
            <p className="text-lg font-medium text-gray-700 mb-2">{instructionText}</p>
            <p className="text-sm text-gray-500 mb-4">
              {isMobile 
                ? "Take a photo or select from your gallery" 
                : "Drag and drop your image here, or choose an option below"}
            </p>
            
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3'} justify-center`}>
              <Button 
                onClick={onButtonClick}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Browse Files
              </Button>
              
              {isMobile && (
                <Button 
                  onClick={useCameraCapture} 
                  variant="outline"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </Button>
              )}
            </div>
          </div>
          
          {loading && (
            <div className="mt-4 w-full">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Processing image: {progress}%</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 rounded-lg max-w-xs mx-auto">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')} • Max {maxSizeMB}MB • Min 800×600px
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;