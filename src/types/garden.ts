export interface GardenDimensions {
    width: number; // in feet
    height: number; // in feet
  }
  
  export interface PlantPosition {
    id: string; // UUID of the placed plant
    plantId: string; // Reference to the plant in database
    x: number; // X position in percentage from the left (0-100)
    y: number; // Y position in percentage from the top (0-100)
    width: number; // Width in percentage of garden width (0-100)
    height: number; // Height in percentage of garden height (0-100)
    rotation: number; // Rotation in degrees
    scale: number; // Custom scaling factor
    zIndex: number; // Z-index for layering
  }
  
  export interface GardenZone {
    id: string;
    name: string;
    sunExposure: 'full-sun' | 'partial-sun' | 'shade';
    soilType?: string;
    area: {
      points: Array<{x: number; y: number}>; // Array of points defining a polygon
    };
  }
  
  export interface Garden {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
    dimensions: GardenDimensions;
    plants: PlantPosition[];
    zones?: GardenZone[];
    viewTime: 'current' | 'year3' | 'year5' | 'mature';
  }