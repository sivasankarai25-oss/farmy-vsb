import { Crop, RecommendationCriteria, SuitabilityResult } from '../types';

export function evaluateCropSuitability(
  crop: Crop,
  criteria: RecommendationCriteria
): SuitabilityResult {
  const matchingReasons: string[] = [];
  const warningReasons: string[] = [];

  // 1. Soil Type Match (20 points)
  let soilScore = 0;
  const isDirectSoilMatch = crop.soilReq.suitableSoilTypes.includes(criteria.soilType);
  if (isDirectSoilMatch) {
    soilScore = 20;
    matchingReasons.push(`Soil type "${criteria.soilType}" is ideal for ${crop.name}.`);
  } else if (
    (criteria.soilType === 'Loamy' && crop.soilReq.suitableSoilTypes.includes('Alluvial')) ||
    (criteria.soilType === 'Alluvial' && crop.soilReq.suitableSoilTypes.includes('Loamy'))
  ) {
    soilScore = 15;
    matchingReasons.push(`Soil type "${criteria.soilType}" is well-adapted for ${crop.name}.`);
  } else {
    soilScore = 6;
    warningReasons.push(`Soil type "${criteria.soilType}" is suboptimal; ${crop.name} thrives in ${crop.soilReq.suitableSoilTypes.join(', ')}.`);
  }

  // 2. Soil pH Match (15 points)
  let phScore = 0;
  const { idealPhMin, idealPhMax } = crop.soilReq;
  if (criteria.soilPh >= idealPhMin && criteria.soilPh <= idealPhMax) {
    phScore = 15;
    matchingReasons.push(`Soil pH ${criteria.soilPh} is within the optimal range (${idealPhMin} – ${idealPhMax}).`);
  } else {
    const diff = criteria.soilPh < idealPhMin ? idealPhMin - criteria.soilPh : criteria.soilPh - idealPhMax;
    if (diff <= 0.5) {
      phScore = 10;
      matchingReasons.push(`Soil pH ${criteria.soilPh} is close to ideal (${idealPhMin} – ${idealPhMax}) with minor amendment.`);
    } else if (diff <= 1.2) {
      phScore = 5;
      warningReasons.push(`Soil pH ${criteria.soilPh} diverges from ideal ${idealPhMin} – ${idealPhMax} (yield may be suppressed).`);
    } else {
      phScore = 1;
      warningReasons.push(`Soil pH ${criteria.soilPh} is too ${criteria.soilPh < idealPhMin ? 'acidic' : 'alkaline'} for ${crop.name} (ideal: ${idealPhMin} – ${idealPhMax}).`);
    }
  }

  // 3. Temperature Match (25 points)
  let tempScore = 0;
  const { idealTempMin, idealTempMax } = crop.bestSeason;
  if (criteria.temperature >= idealTempMin && criteria.temperature <= idealTempMax) {
    tempScore = 25;
    matchingReasons.push(`Current temperature ${criteria.temperature}°C is in the sweet spot (${idealTempMin}°C – ${idealTempMax}°C).`);
  } else {
    const tDiff = criteria.temperature < idealTempMin ? idealTempMin - criteria.temperature : criteria.temperature - idealTempMax;
    if (tDiff <= 3) {
      tempScore = 16;
      matchingReasons.push(`Temperature ${criteria.temperature}°C is acceptable with slight seasonal variation.`);
    } else if (tDiff <= 7) {
      tempScore = 8;
      warningReasons.push(`Temperature ${criteria.temperature}°C diverges from optimal ${idealTempMin}°C – ${idealTempMax}°C.`);
    } else {
      tempScore = 2;
      warningReasons.push(`Extreme temperature (${criteria.temperature}°C) is hazardous for ${crop.name} (optimal: ${idealTempMin}°C – ${idealTempMax}°C).`);
    }
  }

  // 4. Humidity Match (10 points)
  let humidityScore = 0;
  if (criteria.humidity >= crop.weatherReq.minHumidity && criteria.humidity <= crop.weatherReq.maxHumidity) {
    humidityScore = 10;
    matchingReasons.push(`Humidity level (${criteria.humidity}%) is favorable.`);
  } else if (criteria.humidity > crop.weatherReq.maxHumidity) {
    humidityScore = 4;
    warningReasons.push(`High humidity (${criteria.humidity}%) increases risk of fungal leaf and blight diseases.`);
  } else {
    humidityScore = 5;
    warningReasons.push(`Low humidity (${criteria.humidity}%) may increase water evaporation and mite activity.`);
  }

  // 5. Water Level Match (15 points)
  let waterScore = 0;
  const requiredLevel = crop.waterMgmt.level; // Low, Medium, High
  if (
    (requiredLevel === 'High' && criteria.waterLevel === 'Abundant') ||
    (requiredLevel === 'Medium' && (criteria.waterLevel === 'Moderate' || criteria.waterLevel === 'Abundant')) ||
    (requiredLevel === 'Low' && (criteria.waterLevel === 'Scarce' || criteria.waterLevel === 'Moderate' || criteria.waterLevel === 'Abundant'))
  ) {
    waterScore = 15;
    matchingReasons.push(`Water availability (${criteria.waterLevel}) matches crop requirement (${requiredLevel}).`);
  } else if (requiredLevel === 'High' && criteria.waterLevel === 'Moderate') {
    waterScore = 8;
    warningReasons.push(`${crop.name} prefers high water; supplemental irrigation needed.`);
  } else if (requiredLevel === 'High' && criteria.waterLevel === 'Scarce') {
    waterScore = 2;
    warningReasons.push(`${crop.name} requires high water, but water availability is scarce. High drought risk.`);
  } else if (requiredLevel === 'Low' && criteria.waterLevel === 'Abundant') {
    waterScore = 10;
    matchingReasons.push(`Water is abundant, ensure good drainage for ${crop.name}.`);
  } else {
    waterScore = 7;
  }

  // 6. Season Match (15 points)
  let seasonScore = 0;
  const cropSeason = crop.bestSeason.seasonName;
  if (cropSeason === 'Year-Round' || cropSeason === criteria.season) {
    seasonScore = 15;
    matchingReasons.push(`Current season (${criteria.season}) is prime planting time.`);
  } else if (
    (criteria.season === 'Kharif (Monsoon)' && cropSeason === 'Zaid (Summer)') ||
    (criteria.season === 'Zaid (Summer)' && cropSeason === 'Kharif (Monsoon)')
  ) {
    seasonScore = 8;
    warningReasons.push(`Current season (${criteria.season}) is moderately suitable, but ${crop.name} peaks in ${cropSeason}.`);
  } else {
    seasonScore = 3;
    warningReasons.push(`Current season (${criteria.season}) is outside the main ${cropSeason} cycle for ${crop.name}.`);
  }

  const totalScore = Math.min(100, Math.round(soilScore + phScore + tempScore + humidityScore + waterScore + seasonScore));

  let level: SuitabilityResult['level'];
  if (totalScore >= 80) {
    level = 'Highly Suitable';
  } else if (totalScore >= 65) {
    level = 'Suitable';
  } else if (totalScore >= 50) {
    level = 'Moderately Suitable';
  } else {
    level = 'Not Recommended';
  }

  return {
    crop,
    score: totalScore,
    level,
    matchingReasons,
    warningReasons,
    scoreBreakdown: {
      soil: soilScore,
      ph: phScore,
      temperature: tempScore,
      humidity: humidityScore,
      water: waterScore,
      season: seasonScore,
    },
  };
}

export function rankCropsForFarmer(
  crops: Crop[],
  criteria: RecommendationCriteria
): SuitabilityResult[] {
  return crops
    .map(crop => evaluateCropSuitability(crop, criteria))
    .sort((a, b) => b.score - a.score);
}
