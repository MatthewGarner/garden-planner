import { useState, useCallback } from 'react';
import { fileToDataUrl, isValidImageType, isValidFileSize, validateImageDimensions, resizeImage } from '../utils/image';
import { useToast } from '../components/molecules/Toast/ToastProvider';
import { useWindowSize } from './useWindowSize';
import { logError } from '../utils/errorutils';

interface FileUploadOptions {
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoResize?: boolean;
  resizeQuality?: number;
  acceptedFileTypes?: string[];
}

interface FileUploadResult {
  image: string | null;
  originalFile: File | null;
  loading: boolean;
  error: string | null;
  progress: number;
  handleFileSelect: (file: File) => Promise<boolean>;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => Promise<boolean>;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  clearImage: () => void;
  useCameraCapture: () => void;
}

/**
 * Enhanced hook for handling file uploads with progress, error handling, and additional features
 */
export const useFileUpload = (options: FileUploadOptions = {}): FileUploadResult => {
  const {
    maxSizeMB = 15,
    minWidth = 800,
    minHeight = 600,
    maxWidth = 4000,
    maxHeight = 3000,
    autoResize = true,
    resizeQuality = 0.8,
    acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  } = options;
  
  // State hooks
  const [image, setImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Custom hooks
  const { addToast } = useToast();
  const { isMobile } = useWindowSize();
  
  // Simulate progress updates during processing
  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90; // Leave the last 10% for actual completion
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Process the file
  const processFile = useCallback(async (file: File): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    // Start progress simulation
    const stopProgress = simulateProgress();
    
    try {
      // Validate file type
      if (!isValidImageType(file)) {
        setError(`Invalid file type. Please upload one of these formats: ${acceptedFileTypes.join(', ')}`);
        setLoading(false);
        stopProgress();
        return false;
      }
      
      // Validate file size
      if (!isValidFileSize(file, maxSizeMB)) {
        setError(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
        setLoading(false);
        stopProgress();
        return false;
      }
      
      // Convert file to data URL
      const dataUrl = await fileToDataUrl(file);
      
      // Validate dimensions
      const dimensionsValid = await validateImageDimensions(
        dataUrl,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight
      );
      
      if (!dimensionsValid) {
        setError(`Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight} pixels.`);
        setLoading(false);
        stopProgress();
        return false;
      }
      
      // Store original file
      setOriginalFile(file);
      
      // Resize image if needed
      let processedDataUrl = dataUrl;
      if (autoResize) {
        // Smaller target on mobile to save bandwidth/memory
        const targetWidth = isMobile ? Math.min(1200, maxWidth) : Math.min(2000, maxWidth);
        const targetHeight = isMobile ? Math.min(900, maxHeight) : Math.min(1500, maxHeight);
        
        processedDataUrl = await resizeImage(dataUrl, targetWidth, targetHeight, resizeQuality);
      }
      
      // Set the image
      setImage(processedDataUrl);
      setProgress(100);
      
      // After a brief delay, clear loading state
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      
      return true;
    } catch (err) {
      logError(err, 'useFileUpload.processFile');
      setError('Failed to process image. Please try again.');
      
      addToast({
        type: 'error',
        message: 'Error processing image. Please try another file.',
        duration: 5000
      });
      
      setLoading(false);
      stopProgress();
      return false;
    }
  }, [
    acceptedFileTypes, 
    maxSizeMB, 
    minWidth, 
    minHeight, 
    maxWidth, 
    maxHeight, 
    autoResize, 
    resizeQuality, 
    isMobile, 
    addToast, 
    simulateProgress
  ]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File): Promise<boolean> => {
    return processFile(file);
  }, [processFile]);

  // Handle file drop
  const handleFileDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>): Promise<boolean> => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      return processFile(file);
    }
    
    return false;
  }, [processFile]);

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  }, []);

  // Clear the uploaded image
  const clearImage = useCallback((): void => {
    setImage(null);
    setOriginalFile(null);
    setError(null);
    setProgress(0);
  }, []);

  // Helper function to use device camera
  const useCameraCapture = useCallback((): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        await processFile(target.files[0]);
      }
    };
    
    input.click();
  }, [processFile]);

  return {
    image,
    originalFile,
    loading,
    error,
    progress,
    handleFileSelect,
    handleFileDrop,
    handleDragOver,
    clearImage,
    useCameraCapture
  };
};

export default useFileUpload;