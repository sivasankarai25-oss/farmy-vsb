import { Crop } from '../types';
import { vegetableCrops } from './vegetables';
import { grainCrops } from './grains';
import { pulsesAndFruitCrops } from './pulsesAndFruits';

export const allCrops: Crop[] = [
  ...vegetableCrops,
  ...grainCrops,
  ...pulsesAndFruitCrops,
];

export function getCropById(id: string): Crop | undefined {
  return allCrops.find(c => c.id.toLowerCase() === id.toLowerCase());
}

export function getCropsByCategory(category: Crop['category']): Crop[] {
  return allCrops.filter(c => c.category === category);
}

export function searchCrops(query: string): Crop[] {
  const q = query.toLowerCase().trim();
  if (!q) return allCrops;
  return allCrops.filter(c => 
    c.name.toLowerCase().includes(q) ||
    (c.tamilName && c.tamilName.includes(q)) ||
    (c.hindiName && c.hindiName.includes(q)) ||
    c.scientificName.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
}
