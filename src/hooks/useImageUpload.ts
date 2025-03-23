import { useState, useCallback } from 'react';
import { fileToDataUrl, isValidImageType, isValidFileSize, validateImageDimensions, resizeImage } from '../utils/image';

interface UseImageUploadOptions {
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoResize?: boolean;
  resizeQuality?: number;
}

/**
 * Hook for handling image upload and validation
 */
export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxSizeMB = 15,
    minWidth = 800,
    minHeight = 600,
    maxWidth = 4000,
    maxHeight = 3000,
    autoResize = true,
    resizeQuality = 0.8
  } = options;
  
  const [image, setImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate file type
      if (!isValidImageType(file)) {
        setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        setLoading(false);
        return false;
      }
      
      // Validate file size
      if (!isValidFileSize(file, maxSizeMB)) {
        setError(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
        setLoading(false);
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
        return false;
      }
      
      // Store original file
      setOriginalFile(file);
      
      // Resize image if needed
      if (autoResize) {
        const resizedDataUrl = await resizeImage(dataUrl, maxWidth, maxHeight, resizeQuality);
        setImage(resizedDataUrl);
      } else {
        setImage(dataUrl);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error handling file:', err);
      setError('Failed to process image. Please try again.');
      setLoading(false);
      return false;
    }
  }, [maxSizeMB, minWidth, minHeight, maxWidth, maxHeight, autoResize, resizeQuality]);
  
  // Handle file drop
  const handleFileDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      return handleFileSelect(file);
    }
    
    return false;
  }, [handleFileSelect]);
  
  // Handle drag over event
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);
  
  // Clear the uploaded image
  const clearImage = useCallback(() => {
    setImage(null);
    setOriginalFile(null);
    setError(null);
  }, []);
  
  return {
    image,
    originalFile,
    loading,
    error,
    handleFileSelect,
    handleFileDrop,
    handleDragOver,
    clearImage
  };
};