/**
 * Generate placeholder image data URLs
 */

// Generate a colored SVG placeholder with text
export const generatePlaceholderImage = (
    width: number, 
    height: number, 
    text: string, 
    bgColor: string = '#e2e8f0'
  ): string => {
    // Create an SVG with the text centered
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${Math.min(width, height) / 10}px" 
          fill="#4a5568" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${text}
        </text>
      </svg>
    `;
    
    // Convert SVG to data URL
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
      
    return `data:image/svg+xml;charset=UTF-8,${encoded}`;
  };
  
  // Generate color based on plant type
  export const getPlantColor = (category: string): string => {
    const colors: Record<string, string> = {
      tree: '#a3e635',    // Light green
      shrub: '#84cc16',   // Medium green
      perennial: '#bef264', // Very light green
      annual: '#fef08a',   // Light yellow
      grass: '#d9f99d',   // Light lime
      vegetable: '#fde68a', // Light amber
      herb: '#d1fae5',    // Light mint
      climber: '#c7d2fe'  // Light indigo
    };
    
    return colors[category] || '#e2e8f0'; // Default to light gray
  };
  
  // Generate plant image placeholder
  export const getPlantImagePlaceholder = (
    plant: { name: string; category: string }, 
    size: 'thumbnail' | 'fullSize' = 'thumbnail'
  ): string => {
    const width = size === 'thumbnail' ? 100 : 400;
    const height = size === 'thumbnail' ? 100 : 400;
    const bgColor = getPlantColor(plant.category);
    
    return generatePlaceholderImage(width, height, plant.name, bgColor);
  };