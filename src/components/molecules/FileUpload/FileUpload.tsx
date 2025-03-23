import React, { useRef, useState } from 'react';
import { 
  isValidImageType, 
  isValidFileSize, 
  validateImageDimensions, 
  fileToDataUrl,
  resizeImage
} from '../../../utils/image';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Process the file after selection or drop
  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate file type
      if (!isValidImageType(file)) {
        setError('Please upload a JPEG, PNG, or WebP image');
        setLoading(false);
        return false;
      }
      
      // Validate file size
      if (!isValidFileSize(file, maxSizeMB)) {
        setError(`Image exceeds ${maxSizeMB}MB limit`);
        setLoading(false);
        return false;
      }
      
      // Convert file to data URL
      const dataUrl = await fileToDataUrl(file);
      
      // Validate dimensions
      const dimensionsValid = await validateImageDimensions(
        dataUrl,
        800,  // minWidth
        600,  // minHeight
        4000, // maxWidth
        3000  // maxHeight
      );
      
      if (!dimensionsValid) {
        setError(`Image must be between 800×600 and 4000×3000 pixels`);
        setLoading(false);
        return false;
      }
      
      // Resize image if needed - smaller target on mobile to save bandwidth/memory
      const maxTargetWidth = isMobile ? 1200 : 2000;
      const maxTargetHeight = isMobile ? 900 : 1500;
      const resizedDataUrl = await resizeImage(dataUrl, maxTargetWidth, maxTargetHeight, 0.8);
      
      // Call the callback with the processed image
      onImageUploaded(resizedDataUrl, file);
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process image. Please try again.');
      setLoading(false);
      return false;
    }
  };

  // Handle file drop
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  // Handle file input change
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  // Trigger the file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle device camera for mobile
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      // Set capture attribute to camera for mobile devices
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.setAttribute('accept', 'image/*');
      fileInputRef.current.click();
      
      // Reset after click to allow both camera and file selection in future
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.removeAttribute('capture');
        }
      }, 100);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
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
                  onClick={handleCameraClick} 
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
            <div className="mt-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Processing image...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 rounded-lg max-w-xs mx-auto">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            JPEG, PNG, WebP • Max {maxSizeMB}MB • Min 800×600px
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;