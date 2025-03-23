export type SunExposure = 'full-sun' | 'partial-sun' | 'shade';
export type WaterNeeds = 'low' | 'medium' | 'high';
export type PlantCategory = 'tree' | 'shrub' | 'perennial' | 'annual' | 'grass' | 'vegetable' | 'herb' | 'climber';
export type GrowthRate = 'slow' | 'medium' | 'fast';

export interface PlantDimensions {
  height: number; // in inches
  width: number; // in inches
}

export interface PlantImage {
  src: string;
  alt: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  category: PlantCategory;
  sunExposure: SunExposure;
  waterNeeds: WaterNeeds;
  dimensions: {
    mature: PlantDimensions;
    initialYear: PlantDimensions;
    threeYears: PlantDimensions;
    fiveYears: PlantDimensions;
  };
  growthRate: GrowthRate;
  images: {
    thumbnail: PlantImage;
    fullSize: PlantImage;
  };
  maintenanceDifficulty: number; // 1-5 scale
  bloomTime?: string;
  tags: string[];
}