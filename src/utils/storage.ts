import { FarmCrop, FarmingTask, SoilReport, WeatherData } from '../types';

const FARM_CROPS_KEY = 'farmy_user_crops';
const TASKS_KEY = 'farmy_farming_tasks';
const SOIL_REPORT_KEY = 'farmy_soil_report';
const LANGUAGE_KEY = 'farmy_app_lang';
const LOCATION_KEY = 'farmy_selected_location';

export const initialFarmCrops: FarmCrop[] = [
  {
    id: 'farm-crop-1',
    cropId: 'tomato',
    cropName: 'Tomato (Hybrid)',
    farmAreaAcre: 1.5,
    plantingDate: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 52 days ago -> Flowering
    currentStageIndex: 4, // Flowering
    wateringLog: [
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], note: 'Drip 2 hours morning' },
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], note: 'Drip 2 hours with micronutrient' },
    ],
    fertilizerLog: [
      { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], name: 'Urea Top Dress 30kg' },
      { date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], name: 'Basal DAP + MOP + FYM' },
    ],
    pestIssues: ['Slight leaf miner tunnels on lower leaves - controlled with Neem spray'],
    expectedHarvestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Staking completed with bamboo poles. Flowers setting uniformly.',
  },
  {
    id: 'farm-crop-2',
    cropId: 'chilli',
    cropName: 'Chilli (Hot Pepper)',
    farmAreaAcre: 1.0,
    plantingDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 28 days ago -> Vegetative
    currentStageIndex: 2, // Vegetative Branching
    wateringLog: [
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], note: 'Furrow irrigation' },
    ],
    fertilizerLog: [
      { date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], name: 'Basal FYM 8 tonnes + DAP' },
    ],
    pestIssues: [],
    expectedHarvestDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Terminal shoot pinching scheduled this week.',
  }
];

export const initialTasks: FarmingTask[] = [
  {
    id: 'task-1',
    cropId: 'tomato',
    cropName: 'Tomato',
    title: 'Flowering Stage: Apply Potash & inspect for Fruit Borer',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'fertilizer',
    completed: false,
    priority: 'high',
  },
  {
    id: 'task-2',
    cropId: 'tomato',
    cropName: 'Tomato',
    title: 'Morning Drip Irrigation (2 hours)',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'watering',
    completed: false,
    priority: 'high',
  },
  {
    id: 'task-3',
    cropId: 'chilli',
    cropName: 'Chilli',
    title: 'First Top Dressing of Nitrogen & Inter-cultivation',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'fertilizer',
    completed: false,
    priority: 'medium',
  },
  {
    id: 'task-4',
    cropId: 'chilli',
    cropName: 'Chilli',
    title: 'Install Yellow & Blue Sticky Traps for Thrips & Whitefly',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'pest',
    completed: true,
    priority: 'low',
  }
];

export const defaultSoilReport: SoilReport = {
  soilType: 'Loamy',
  ph: 6.8,
  nitrogenLevel: 'Medium',
  phosphorusLevel: 'Medium',
  potassiumLevel: 'High',
  soilMoisture: 'Moderate',
  healthScore: 84,
  recommendations: [
    'Maintain current organic matter additions by continuing annual FYM or vermicompost.',
    'Test micronutrients (Zinc and Boron) prior to the next vegetable cropping cycle.',
  ],
};

export function loadFarmCrops(): FarmCrop[] {
  try {
    const raw = localStorage.getItem(FARM_CROPS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialFarmCrops;
}

export function saveFarmCrops(crops: FarmCrop[]): void {
  try {
    localStorage.setItem(FARM_CROPS_KEY, JSON.stringify(crops));
  } catch (e) {
    console.error(e);
  }
}

export function loadTasks(): FarmingTask[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return initialTasks;
}

export function saveTasks(tasks: FarmingTask[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error(e);
  }
}

export function loadSoilReport(): SoilReport {
  try {
    const raw = localStorage.getItem(SOIL_REPORT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return defaultSoilReport;
}

export function saveSoilReport(report: SoilReport): void {
  try {
    localStorage.setItem(SOIL_REPORT_KEY, JSON.stringify(report));
  } catch (e) {
    console.error(e);
  }
}

export function loadSavedLocation(): string {
  try {
    return localStorage.getItem(LOCATION_KEY) || 'Coimbatore, Tamil Nadu';
  } catch {
    return 'Coimbatore, Tamil Nadu';
  }
}

export function saveSelectedLocation(loc: string): void {
  try {
    localStorage.setItem(LOCATION_KEY, loc);
  } catch {}
}

export function loadLanguage(): 'en' | 'ta' | 'hi' {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'ta' || saved === 'hi') return saved;
  } catch {}
  return 'en';
}

export function saveLanguage(lang: 'en' | 'ta' | 'hi'): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {}
}

// Convenient aliases
export const loadSavedFarmCrops = loadFarmCrops;
export const loadSavedTasks = loadTasks;
export const loadSavedSoilReport = loadSoilReport;
export const saveLocation = saveSelectedLocation;
export const loadSavedLanguage = loadLanguage;
