/**
 * Utility functions for image processing
 */

// Function to convert a File object to a data URL
export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  // Function to validate image file type
  export const isValidImageType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
  };
  
  // Function to validate image file size
  export const isValidFileSize = (file: File, maxSizeMB: number = 15): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };
  
  // Function to validate image dimensions
  export const validateImageDimensions = (
    dataUrl: string,
    minWidth: number = 800,
    minHeight: number = 600,
    maxWidth: number = 4000,
    maxHeight: number = 3000
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const valid =
          img.width >= minWidth &&
          img.height >= minHeight &&
          img.width <= maxWidth &&
          img.height <= maxHeight;
        resolve(valid);
      };
      img.onerror = () => resolve(false);
      img.src = dataUrl;
    });
  };
  
  // Function to resize an image to fit within maximum dimensions while preserving aspect ratio
  export const resizeImage = (
    dataUrl: string,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while preserving aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        // Create canvas with the new dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to data URL
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      
      img.onerror = () => reject(new Error('Error loading image'));
      img.src = dataUrl;
    });
  };
  
  // Function to extract dominant color from an image
  export const extractDominantColor = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a small canvas to sample pixels
        const canvas = document.createElement('canvas');
        canvas.width = 50; // Sample at a small size for performance
        canvas.height = 50;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the image scaled down
        ctx.drawImage(img, 0, 0, 50, 50);
        
        // Get pixel data
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const pixels = imageData.data;
        
        // Simple algorithm to find an average color
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          count++;
        }
        
        // Calculate average
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Return as hex
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        resolve(hex);
      };
      
      img.onerror = () => reject(new Error('Error loading image'));
      img.src = dataUrl;
    });
  };