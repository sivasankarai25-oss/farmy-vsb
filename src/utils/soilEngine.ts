import { Crop, SoilReport, SoilType } from '../types';

export function calculateSoilHealthScore(report: Omit<SoilReport, 'healthScore' | 'recommendations'>): {
  score: number;
  recommendations: string[];
  parameterFeedback: Record<string, { status: 'optimal' | 'moderate' | 'action_needed'; text: string }>;
} {
  let score = 50; // baseline
  const recs: string[] = [];
  const feedback: Record<string, { status: 'optimal' | 'moderate' | 'action_needed'; text: string }> = {};

  // 1. pH evaluation (optimal 6.0 to 7.2)
  if (report.ph >= 6.2 && report.ph <= 7.2) {
    score += 20;
    feedback.ph = { status: 'optimal', text: `Neutral & optimal (pH ${report.ph}). Nutrient availability is at peak efficiency.` };
  } else if (report.ph >= 5.5 && report.ph < 6.2) {
    score += 12;
    feedback.ph = { status: 'moderate', text: `Slightly acidic (pH ${report.ph}). Suitable for potato, rice, and tea.` };
    recs.push('For neutral crops, apply agricultural lime (calcium carbonate) or dolomite at 200–400 kg/acre to gradually raise soil pH.');
  } else if (report.ph < 5.5) {
    score += 2;
    feedback.ph = { status: 'action_needed', text: `Strongly acidic (pH ${report.ph}). Phosphorus and molybdenum become locked and toxic aluminum solubilizes.` };
    recs.push('Critical: Broadcast agricultural slaked lime or wood ash and incorporate before rainy season.');
  } else if (report.ph > 7.2 && report.ph <= 7.8) {
    score += 12;
    feedback.ph = { status: 'moderate', text: `Mildly alkaline/calcareous (pH ${report.ph}). Phosphorus and iron uptake can be slow.` };
    recs.push('Incorporate decomposed cattle manure (FYM) or green manure (Dhaincha) to release natural organic acids.');
  } else {
    score += 2;
    feedback.ph = { status: 'action_needed', text: `High alkaline/saline-sodic soil (pH ${report.ph}). Risk of iron chlorosis and zinc deficiency.` };
    recs.push('Apply Agricultural Gypsum (calcium sulphate) @ 500 kg/acre and flush soil with clean irrigation water. Add elemental sulphur (50 kg/acre).');
  }

  // 2. Nitrogen level
  if (report.nitrogenLevel === 'Medium') {
    score += 10;
    feedback.nitrogen = { status: 'optimal', text: 'Balanced soil available nitrogen.' };
  } else if (report.nitrogenLevel === 'High') {
    score += 8;
    feedback.nitrogen = { status: 'moderate', text: 'Abundant nitrogen. Avoid excess chemical urea which causes soft vegetative tissue prone to insect attacks.' };
  } else {
    score += 3;
    feedback.nitrogen = { status: 'action_needed', text: 'Low nitrogen. Crops may display yellow older leaves and stunted tillers.' };
    recs.push('Incorporate 5 tonnes vermicompost or apply enriched neem cake. Seed treat pulses with Rhizobium culture to fix atmospheric nitrogen.');
  }

  // 3. Phosphorus level
  if (report.phosphorusLevel === 'Medium' || report.phosphorusLevel === 'High') {
    score += 10;
    feedback.phosphorus = { status: 'optimal', text: 'Adequate phosphorus for vigorous early root formation and flowering.' };
  } else {
    score += 3;
    feedback.phosphorus = { status: 'action_needed', text: 'Low phosphorus. Roots will develop slowly and purple pigmentation may show on leaf undersides.' };
    recs.push('Apply Single Super Phosphate (SSP) or Rock Phosphate accompanied by Phosphorus Solubilizing Bacteria (PSB) biofertilizer.');
  }

  // 4. Potassium level
  if (report.potassiumLevel === 'Medium' || report.potassiumLevel === 'High') {
    score += 10;
    feedback.potassium = { status: 'optimal', text: 'Strong potassium reserve supports drought tolerance, pest resistance, and fruit filling.' };
  } else {
    score += 4;
    feedback.potassium = { status: 'action_needed', text: 'Low potassium. Fruit skin may crack and leaf margins may show scorched brown tips.' };
    recs.push('Apply Muriate of Potash (MOP) or organic wood ash/potash-mobilizing bio-consortia.');
  }

  // 5. Moisture level
  if (report.soilMoisture === 'Moderate') {
    score += 10;
    feedback.moisture = { status: 'optimal', text: 'Ideal aerobic moisture balance for beneficial microbial life.' };
  } else if (report.soilMoisture === 'High') {
    score += 5;
    feedback.moisture = { status: 'moderate', text: 'High moisture. Ensure drainage furrows are open to prevent root rot.' };
  } else {
    score += 4;
    feedback.moisture = { status: 'action_needed', text: 'Dry soil profile. Irrigation required before any fertilizer top-dressing.' };
    recs.push('Apply organic mulch (straw or dried leaves 5–7 cm thick) to conserve soil moisture and lower root-zone temperature.');
  }

  // General organic health tip
  recs.push('Adopt regular green manuring with sunnhemp or cowpea every 2 years to sustain high soil organic carbon (>0.75%).');

  const finalScore = Math.min(100, Math.max(20, score));

  return {
    score: finalScore,
    recommendations: recs,
    parameterFeedback: feedback,
  };
}

export function compareSoilWithCrop(soil: SoilReport, crop: Crop): {
  isCompatible: boolean;
  matchPercentage: number;
  differences: string[];
  recommendations: string[];
} {
  const diffs: string[] = [];
  const recs: string[] = [];
  let score = 100;

  // Check Soil Type
  if (!crop.soilReq.suitableSoilTypes.includes(soil.soilType)) {
    diffs.push(`Soil type "${soil.soilType}" is not in the primary list for ${crop.name} (${crop.soilReq.suitableSoilTypes.join(', ')}).`);
    score -= 25;
    recs.push(`Improve soil structure with heavy compost and organic manure before planting ${crop.name}.`);
  }

  // Check pH
  const { idealPhMin, idealPhMax } = crop.soilReq;
  if (soil.ph < idealPhMin) {
    diffs.push(`⚠️ Your soil pH (${soil.ph}) is lower than the ideal range for ${crop.name} (${idealPhMin} – ${idealPhMax}). Soil is too acidic.`);
    score -= 30;
    recs.push(`Apply agricultural lime (CaCO3) 2–3 weeks before planting to buffer acidity up to ${idealPhMin}.`);
  } else if (soil.ph > idealPhMax) {
    diffs.push(`⚠️ Your soil pH (${soil.ph}) is higher than the ideal range for ${crop.name} (${idealPhMin} – ${idealPhMax}). Soil is too alkaline.`);
    score -= 30;
    recs.push(`Incorporate agricultural gypsum and decomposed farmyard manure to moderate alkaline pH down toward ${idealPhMax}.`);
  } else {
    diffs.push(`✅ Soil pH ${soil.ph} matches ${crop.name}'s ideal range (${idealPhMin} – ${idealPhMax}).`);
  }

  // Check Nutrient deficits
  if (soil.nitrogenLevel === 'Low' && crop.category !== 'pulse') {
    diffs.push(`⚠️ Available soil Nitrogen is Low. ${crop.name} requires substantial Nitrogen for foliage and growth.`);
    score -= 15;
    recs.push(`Top-dress well-decomposed FYM or split doses of nitrogen fertilizer according to the ${crop.name} schedule.`);
  }

  if (soil.phosphorusLevel === 'Low') {
    diffs.push(`⚠️ Soil Phosphorus is Low. Critical for root anchoring and blossom initiation.`);
    score -= 15;
    recs.push(`Apply Single Super Phosphate (SSP) at land preparation.`);
  }

  return {
    isCompatible: score >= 60,
    matchPercentage: Math.max(10, score),
    differences: diffs,
    recommendations: recs,
  };
}
