export type SoilType = 
  | 'Alluvial'
  | 'Black'
  | 'Red'
  | 'Clay'
  | 'Sandy'
  | 'Loamy'
  | 'Laterite'
  | 'Silt';

export type SeasonName = 'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)' | 'Year-Round';
export type SeasonType = SeasonName;

export type WaterLevel = 'Low' | 'Medium' | 'High';

export type CropCategory = 'vegetable' | 'grain' | 'pulse' | 'fruit';

export interface GrowthStageInfo {
  name: string;
  stageNumber: number;
  daysRange: string;
  durationDays: number;
  care: string;
  water: string;
  fertilizer: string;
  warnings: string;
}

export interface ChemicalPesticideInfo {
  activeIngredient: string;
  usage: string;
  phiDays: number; // Pre-harvest interval
  ppe: string;
}

export interface PestDisease {
  name: string;
  type: 'pest' | 'disease';
  symptoms: string[];
  causes: string;
  prevention: string;
  ipmControls: {
    biological: string;
    organic: string;
    mechanical: string;
    chemical?: ChemicalPesticideInfo;
  };
}

export interface Crop {
  id: string;
  name: string;
  tamilName?: string;
  hindiName?: string;
  scientificName: string;
  category: CropCategory;
  image: string;
  description: string;
  bestSeason: {
    months: string[];
    seasonName: SeasonName;
    idealTempMin: number;
    idealTempMax: number;
  };
  soilReq: {
    suitableSoilTypes: SoilType[];
    idealPhMin: number;
    idealPhMax: number;
    requiredNutrients: string;
    soilPrepInstructions: string[];
  };
  weatherReq: {
    tempRange: string;
    requiredHumidity: string;
    minHumidity: number;
    maxHumidity: number;
    rainfallMm: string;
    sunlightRequirements: string;
  };
  plantingGuide: {
    landPrep: string;
    soilPrep: string;
    seedSelection: string;
    seedTreatment: string;
    plantingMethod: string;
    plantingDepth: string;
    spacing: string;
    bestTime: string;
  };
  waterMgmt: {
    level: WaterLevel;
    recommendedFrequency: string;
    approxWaterRequirement: string;
    criticalStages: string[];
    overwateringWarning: string;
    underwateringWarning: string;
  };
  fertilizerGuide: {
    npkRatio: string;
    organicRecommendations: string[];
    chemicalRecommendations: string[];
    quantityGuidance: string;
    applicationSchedule: {
      stage: string;
      fertilizer: string;
      timing: string;
      notes: string;
    }[];
  };
  growthTimeline: GrowthStageInfo[];
  pestDiseases: PestDisease[];
  yieldEstimates: {
    minPerAcre: number;
    maxPerAcre: number;
    unit: string;
    benchmarkNotes: string;
  };
  economics: {
    defaultSeedCost: number;
    defaultFertilizerCost: number;
    defaultLaborCost: number;
    defaultIrrigationCost: number;
    defaultOtherCost: number;
    defaultSellingPricePerKg: number;
    defaultYieldKgPerAcre: number;
  };
}

export interface SoilReport {
  soilType: SoilType;
  ph: number;
  nitrogenLevel: 'Low' | 'Medium' | 'High';
  phosphorusLevel: 'Low' | 'Medium' | 'High';
  potassiumLevel: 'Low' | 'Medium' | 'High';
  soilMoisture: 'Low' | 'Moderate' | 'High';
  healthScore: number;
  recommendations: string[];
}

export interface FarmCrop {
  id: string;
  cropId: string;
  cropName: string;
  farmAreaAcre: number;
  plantingDate: string;
  currentStageIndex: number;
  wateringLog: { date: string; note?: string }[];
  fertilizerLog: { date: string; name: string }[];
  pestIssues: string[];
  expectedHarvestDate: string;
  notes?: string;
}

export interface FarmingTask {
  id: string;
  cropId: string;
  cropName: string;
  title: string;
  dueDate: string;
  type: 'watering' | 'fertilizer' | 'pest' | 'inspection' | 'harvest';
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface WeatherData {
  location: string;
  lat: number;
  lon: number;
  current: {
    temp: number;
    humidity: number;
    feelsLike: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  };
  forecast: {
    date: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    precipSum: number;
    weatherCode: number;
  }[];
}

export interface RecommendationCriteria {
  location: string;
  soilType: SoilType;
  soilPh: number;
  soilMoisture: 'Low' | 'Moderate' | 'High';
  temperature: number;
  humidity: number;
  waterLevel: 'Scarce' | 'Moderate' | 'Abundant' | WaterLevel;
  season: SeasonName;
}

export interface SuitabilityResult {
  crop: Crop;
  score: number; // 0 to 100
  level: 'Highly Suitable' | 'Suitable' | 'Moderately Suitable' | 'Not Recommended';
  matchingReasons: string[];
  warningReasons: string[];
  scoreBreakdown: {
    soil: number;
    ph: number;
    temperature: number;
    humidity: number;
    water: number;
    season: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'knowledge_base';
}
