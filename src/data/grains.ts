import { Crop } from '../types';

export const grainCrops: Crop[] = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    tamilName: 'நெல் (அரிசி)',
    hindiName: 'धान (चावल)',
    scientificName: 'Oryza sativa',
    category: 'grain',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Primary staple food crop cultivated in flooded paddies with high caloric density and extensive culinary significance.',
    bestSeason: {
      months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 22,
      idealTempMax: 34,
    },
    soilReq: {
      suitableSoilTypes: ['Clay', 'Alluvial', 'Loamy', 'Silt'],
      idealPhMin: 5.5,
      idealPhMax: 6.8,
      requiredNutrients: 'High Nitrogen for tillering, balanced Phosphorus, Zinc sulfate 25 kg/ha against Khaira disease.',
      soilPrepInstructions: [
        'Puddling: wet tillage in standing water to destroy soil structure and create an impervious hardpan that prevents water seepage.',
        'Apply 10 tonnes well-rotted FYM or green manure (Dhaincha/Sunnhemp) in-situ.',
        'Level puddled field meticulously with wooden leveler.'
      ]
    },
    weatherReq: {
      tempRange: '22°C – 34°C',
      requiredHumidity: '70% – 85%',
      minHumidity: 60,
      maxHumidity: 90,
      rainfallMm: '1000 – 1500 mm',
      sunlightRequirements: 'Bright sunny conditions during grain filling'
    },
    plantingGuide: {
      landPrep: 'Thorough puddling with disc plow or cage wheels.',
      soilPrep: 'Incorporate green manure 15 days before final puddling.',
      seedSelection: 'Certified seed (MTU 1010, IR 64, BPT 5204 / Sona Masoori).',
      seedTreatment: 'Salt water floatation to remove chaff, then soak with Carbendazim (2g/kg) or Pseudomonas.',
      plantingMethod: 'Transplant 20–25 day old seedlings (2–3 seedlings per hill). System of Rice Intensification (SRI) uses 10–12 day single seedling.',
      plantingDepth: '2 to 3 cm (shallow transplanting encourages rapid tillering).',
      spacing: '20 cm x 15 cm (or 25 cm x 25 cm in SRI).',
      bestTime: 'June–July with monsoon onset.'
    },
    waterMgmt: {
      level: 'High',
      recommendedFrequency: 'Continuous standing water (2–5 cm) or Alternate Wetting & Drying (AWD).',
      approxWaterRequirement: '1200 – 1400 mm',
      criticalStages: ['Panicle initiation', 'Booting', 'Flowering (Heading)', 'Milk stage'],
      overwateringWarning: 'Excess water (>10 cm) stunts tillers and wastes water.',
      underwateringWarning: 'Moisture stress during panicle emergence causes empty/chaffy grains.'
    },
    fertilizerGuide: {
      npkRatio: '100:50:50 kg/ha + 25 kg ZnSO4',
      organicRecommendations: ['10 tonnes FYM/acre', 'Green manuring with Sesbania', 'Azospirillum biofertilizer'],
      chemicalRecommendations: ['Urea', 'DAP', 'MOP', 'Zinc Sulphate (21%)'],
      quantityGuidance: 'Apply Zinc separately from DAP (do not mix Zn and P together). Apply Nitrogen in 3 splits.',
      applicationSchedule: [
        { stage: 'Basal (Last puddling)', fertilizer: '100% P, 50% K, 25% N + Zinc Sulphate', timing: 'Day 0', notes: 'Incorporate into puddled mud.' },
        { stage: 'Active Tillering', fertilizer: '50% Nitrogen', timing: 'Day 20–25', notes: 'Drain field partially before broadcasting urea.' },
        { stage: 'Panicle Initiation', fertilizer: '25% Nitrogen + 50% Potash', timing: 'Day 45–55', notes: 'Maximizes filled grain count per panicle.' }
      ]
    },
    growthTimeline: [
      { name: 'Nursery', stageNumber: 1, daysRange: 'Day 0–22', durationDays: 22, care: 'Raise wet nursery bed, broadcast pre-germinated seeds.', water: 'Keep mud glistening wet.', fertilizer: 'Apply DAP at Day 10.', warnings: 'Armyworms and thrips.' },
      { name: 'Transplanting', stageNumber: 2, daysRange: 'Day 23–30', durationDays: 7, care: 'Transplant young vigorous seedlings.', water: 'Maintain 2 cm water.', fertilizer: 'Basal dose.', warnings: 'Do not plant deeper than 3 cm.' },
      { name: 'Tillering', stageNumber: 3, daysRange: 'Day 31–55', durationDays: 25, care: 'Cono-weeding or hand weeding; encourage tillers.', water: 'AWD or 3 cm shallow depth.', fertilizer: 'Top dress second split N.', warnings: 'Stem borer dead hearts.' },
      { name: 'Panicle Initiation', stageNumber: 4, daysRange: 'Day 56–75', durationDays: 20, care: 'Primordia develop inside stem sheath.', water: 'Keep strictly flooded (5 cm).', fertilizer: 'Apply final N and Potash.', warnings: 'Water stress here drops yield drastically.' },
      { name: 'Flowering / Heading', stageNumber: 5, daysRange: 'Day 76–90', durationDays: 15, care: 'Panicles emerge, anthesis occurs in late morning.', water: 'Maintain 5 cm water.', fertilizer: 'Foliar spray Boron 0.2%.', warnings: 'Blast or sheath blight disease.' },
      { name: 'Milk to Dough', stageNumber: 6, daysRange: 'Day 91–115', durationDays: 25, care: 'Grain fills with starch, bends downward.', water: 'Maintain shallow moisture.', fertilizer: 'None.', warnings: 'Gundhi bug sucking milky grains.' },
      { name: 'Maturity & Harvesting', stageNumber: 7, daysRange: 'Day 116–135', durationDays: 20, care: '85% grains turn golden yellow. Drain field 10 days before harvest.', water: 'Drain field dry.', fertilizer: 'None.', warnings: 'Over-drying causes grain cracking and shattering.' }
    ],
    pestDiseases: [
      {
        name: 'Yellow Stem Borer (Scirpophaga incertulas)',
        type: 'pest',
        symptoms: ['"Dead hearts" (wilted central shoot) in tillering stage', '"White ears" (empty white panicles) at heading stage'],
        causes: 'Larva bores into central stem and feeds internally.',
        prevention: 'Clip seedling leaf tips before transplanting to remove egg masses. Install pheromone traps.',
        ipmControls: {
          biological: 'Trichogramma japonicum egg parasitoid cards @ 20,000/acre released weekly.',
          organic: 'Neem oil spray (5 ml/L); encourage dragonfly and spider predators.',
          mechanical: 'Install light traps to monitor adult moth flights.',
          chemical: { activeIngredient: 'Cartap hydrochloride 4% G @ 8 kg/acre or Chlorantraniliprole 0.4% G', usage: 'Broadcast with sand in standing water at early pest threshold', phiDays: 21, ppe: 'Protective footwear and gloves' }
        }
      },
      {
        name: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
        type: 'disease',
        symptoms: ['Wavy translucent yellow-green lesions along leaf margins', 'Milky bacterial ooze droplets on leaves in morning', 'Kresek wilt in young seedlings'],
        causes: 'Bacterium entering through hydathodes or typhoon/cyclone wound damage.',
        prevention: 'Avoid excess nitrogen fertilization; drain water for 3–4 days; use certified resistant seeds.',
        ipmControls: {
          biological: 'Spray Pseudomonas fluorescens (5 g/L).',
          organic: 'Spray Cow dung supernatant (20%) or fresh neem extract.',
          mechanical: 'Avoid clipping seedling tips if BLB is endemic in region.',
          chemical: { activeIngredient: 'Copper hydroxide 77% WP (2 g/L) + Streptocycline (0.1 g/L)', usage: 'Spray at initial symptom appearance', phiDays: 14, ppe: 'Rubber gloves and mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 2.2,
      maxPerAcre: 3.5,
      unit: 'tonnes (paddy)/acre',
      benchmarkNotes: 'Modern high-yielding semi-dwarf cultivars yield 2.5–3.2 tonnes/acre under balanced AWD management.'
    },
    economics: {
      defaultSeedCost: 1500,
      defaultFertilizerCost: 6500,
      defaultLaborCost: 14000,
      defaultIrrigationCost: 3500,
      defaultOtherCost: 4000,
      defaultSellingPricePerKg: 24,
      defaultYieldKgPerAcre: 2600
    }
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    tamilName: 'மக்காச்சோளம்',
    hindiName: 'मक्का',
    scientificName: 'Zea mays',
    category: 'grain',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    description: 'The "Queen of Cereals", possessing the highest genetic yield potential among all grain crops.',
    bestSeason: {
      months: ['Jun', 'Jul', 'Oct', 'Nov', 'Jan', 'Feb'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 21,
      idealTempMax: 32,
    },
    soilReq: {
      suitableSoilTypes: ['Loamy', 'Alluvial', 'Red', 'Black'],
      idealPhMin: 6.0,
      idealPhMax: 7.5,
      requiredNutrients: 'High Nitrogen demand, high Potassium, responsive to Zinc application.',
      soilPrepInstructions: [
        'Deep plowing followed by 2 harrowing passes.',
        'Ridges and furrows spaced 60 cm apart or flat bed sowing with tractor planter.'
      ]
    },
    weatherReq: {
      tempRange: '21°C – 32°C (Sensitive to frost and extreme drought >38°C during tasseling)',
      requiredHumidity: '55% – 70%',
      minHumidity: 50,
      maxHumidity: 80,
      rainfallMm: '500 – 750 mm',
      sunlightRequirements: 'High solar radiation crop (C4 photosynthetic pathway)'
    },
    plantingGuide: {
      landPrep: 'Ensure excellent surface drainage; maize cannot tolerate standing water.',
      soilPrep: 'Apply 8 tonnes FYM and 10 kg Zinc Sulphate per acre.',
      seedSelection: 'Single cross hybrids (Pioneer, Syngenta NK, DKC series).',
      seedTreatment: 'Cyantraniliprole / Thiamethoxam to protect against Fall Armyworm.',
      plantingMethod: 'Direct dibbling in ridge slopes or flat rows.',
      plantingDepth: '3 to 5 cm in moist soil.',
      spacing: '60 cm between rows and 20 cm between plants.',
      bestTime: 'Onset of monsoon or October–November for winter maize.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 8–10 days; 5–6 critical irrigations in total.',
      approxWaterRequirement: '500 – 650 mm',
      criticalStages: ['Knee-high stage', 'Tasseling', 'Silking', 'Grain milk stage'],
      overwateringWarning: 'Waterlogging for even 24 hours causes severe yellowing and yield collapse.',
      underwateringWarning: 'Water deficit during silking desynchronizes pollen shed and causes barren cobs.'
    },
    fertilizerGuide: {
      npkRatio: '120:60:50 kg/ha',
      organicRecommendations: ['8 tonnes FYM/acre', 'Azotobacter seed inoculation'],
      chemicalRecommendations: ['Urea', 'DAP', 'MOP', 'Zinc Sulphate 21%'],
      quantityGuidance: 'Maize is a heavy feeder; apply Nitrogen in 3 equal splits: sowing, knee-high, and tasseling.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P, Full K, 1/3 N + Zinc', timing: 'At sowing', notes: 'Band 5 cm below and beside seed.' },
        { stage: 'Knee-High (V6)', fertilizer: '1/3 Nitrogen', timing: 'Day 25–30', notes: 'Side-dress before earthing up.' },
        { stage: 'Tasseling (VT)', fertilizer: '1/3 Nitrogen', timing: 'Day 50–55', notes: 'Directly supports cob kernel count.' }
      ]
    },
    growthTimeline: [
      { name: 'Germination & Emergence', stageNumber: 1, daysRange: 'Day 0–6', durationDays: 6, care: 'Check uniform seedling emergence.', water: 'Pre-sowing irrigation moisture.', fertilizer: 'None.', warnings: 'Bird damage to emerging shoots.' },
      { name: 'Knee-High Stage', stageNumber: 2, daysRange: 'Day 7–30', durationDays: 24, care: 'Scout whorls for Fall Armyworm caterpillars; earth up rows.', water: 'Irrigate at Day 25.', fertilizer: 'Top dress second N split.', warnings: 'Whorl feeding holes.' },
      { name: 'Tasseling', stageNumber: 3, daysRange: 'Day 31–55', durationDays: 25, care: 'Male tassel emerges at top; sheds pollen.', water: 'Most critical irrigation.', fertilizer: 'Final nitrogen top-dress.', warnings: 'Moisture stress aborts pollen.' },
      { name: 'Silking & Pollination', stageNumber: 4, daysRange: 'Day 56–70', durationDays: 15, care: 'Silks emerge from cob tip to capture pollen grains.', water: 'Maintain optimum soil moisture.', fertilizer: 'Foliar spray Boron 0.2%.', warnings: 'Extreme heat (>38°C) desensitizes silks.' },
      { name: 'Grain Filling (Dough)', stageNumber: 5, daysRange: 'Day 71–95', durationDays: 25, care: 'Kernels fill with starch; cob gains heavy weight.', water: 'Light irrigation if rain absent.', fertilizer: 'None.', warnings: 'Cob borer and fungal ear rot.' },
      { name: 'Physiological Maturity & Harvest', stageNumber: 6, daysRange: 'Day 96–115', durationDays: 20, care: 'Black layer forms at kernel base; husk leaves turn dry papery white.', water: 'No watering.', fertilizer: 'None.', warnings: 'Dry cobs thoroughly to <14% moisture before storage.' }
    ],
    pestDiseases: [
      {
        name: 'Fall Armyworm (Spodoptera frugiperda)',
        type: 'pest',
        symptoms: ['Ragged pin-holes and large irregular tears on whorl leaves', 'Copious sawdust-like frass inside central leaf whorl', 'Feeding damage inside cob tops'],
        causes: 'Invasive noctuid moth caterpillar with 4 black dots arranged in a square on 8th abdominal segment.',
        prevention: 'Intercrop with cowpea or pigeon pea. Sow early in season simultaneously with neighbors.',
        ipmControls: {
          biological: 'Pheromone traps @ 5/acre. Conserve Trichogramma and earwigs.',
          organic: 'Pour neem cake powder or wood ash mixed with fine sand (1:9) directly into leaf whorls.',
          mechanical: 'Hand-crush egg masses and larvae in early stages.',
          chemical: { activeIngredient: 'Spinetoram 11.7% SC @ 0.5 ml/L or Chlorantraniliprole 18.5% SC @ 0.4 ml/L', usage: 'Directed spray aimed right down into whorls when >10% plants show damage', phiDays: 14, ppe: 'Full PPE' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 2.5,
      maxPerAcre: 4.2,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Winter rabi hybrid maize frequently yields 3.5–4.2 tonnes/acre under drip fertigation.'
    },
    economics: {
      defaultSeedCost: 2400,
      defaultFertilizerCost: 5500,
      defaultLaborCost: 8000,
      defaultIrrigationCost: 2500,
      defaultOtherCost: 3000,
      defaultSellingPricePerKg: 22,
      defaultYieldKgPerAcre: 3000
    }
  },
  {
    id: 'wheat',
    name: 'Wheat',
    tamilName: 'கோதுமை',
    hindiName: 'गेहूं',
    scientificName: 'Triticum aestivum',
    category: 'grain',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    description: 'Premier temperate/subtropical winter cereal crop essential for global bread, chapati, and pastry flour.',
    bestSeason: {
      months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 12,
      idealTempMax: 24,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Loamy', 'Clay', 'Black'],
      idealPhMin: 6.0,
      idealPhMax: 7.5,
      requiredNutrients: 'Balanced NPK + responsive to early Phosphorus for root crown development.',
      soilPrepInstructions: [
        'Fine, pulverised seedbed or happy seeder direct sowing into rice stubble.',
        'Plow 2–3 times and plank thoroughly to conserve residual moisture.'
      ]
    },
    weatherReq: {
      tempRange: '12°C – 24°C (Needs cool vegetative phase and mild warm grain filling)',
      requiredHumidity: '50% – 65%',
      minHumidity: 40,
      maxHumidity: 70,
      rainfallMm: '350 – 500 mm',
      sunlightRequirements: 'Bright winter sun; sensitive to terminal heat stress >32°C in March'
    },
    plantingGuide: {
      landPrep: 'Level field; eradicate phalaris minor weed seeds.',
      soilPrep: 'Incorporate 6 tonnes FYM/acre before pre-sowing irrigation (rauni).',
      seedSelection: 'Varieties like HD-2967, HD-3086, DBW-187 (Karan Vandana), PBW-550.',
      seedTreatment: 'Carboxin + Thiram (Vitavax) @ 2.5 g/kg seed to prevent loose smut.',
      plantingMethod: 'Zero tillage / seed-cum-fertilizer drill.',
      plantingDepth: '4 to 5 cm (deep sowing hampers coleoptile emergence).',
      spacing: '20–22.5 cm between rows.',
      bestTime: 'November 1 to November 20 is optimal in northern plains.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: '4 to 6 critical stage irrigations.',
      approxWaterRequirement: '400 – 450 mm',
      criticalStages: ['Crown Root Initiation (CRI at Day 20–25 - NON-NEGOTIABLE)', 'Tillering', 'Jointing', 'Flowering', 'Milk', 'Dough'],
      overwateringWarning: 'Yellowing of young seedlings, lodging of tall crop.',
      underwateringWarning: 'Skipping CRI irrigation causes up to 35% irreversible yield loss.'
    },
    fertilizerGuide: {
      npkRatio: '120:60:40 kg/ha',
      organicRecommendations: ['6 tonnes FYM', 'Biofertilizer Azotobacter + PSB seed coating'],
      chemicalRecommendations: ['Urea', 'DAP', 'MOP'],
      quantityGuidance: 'Apply half Nitrogen and full P & K at sowing; remaining N split at 1st and 2nd irrigation.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: '50% N, 100% P, 100% K', timing: 'At drilling', notes: 'Band below seed line.' },
        { stage: 'CRI Stage (Day 21)', fertilizer: '25% Nitrogen', timing: 'With 1st irrigation', notes: 'Broadcasting urea before water.' },
        { stage: 'Jointing (Day 45)', fertilizer: '25% Nitrogen', timing: 'With 2nd irrigation', notes: 'Boosts spikelet fertility.' }
      ]
    },
    growthTimeline: [
      { name: 'Germination & Emergence', stageNumber: 1, daysRange: 'Day 0–7', durationDays: 7, care: 'Watch for even coleoptile emergence.', water: 'Germinates on residual soil moisture.', fertilizer: 'None.', warnings: 'Soil crusting.' },
      { name: 'Crown Root Initiation (CRI)', stageNumber: 2, daysRange: 'Day 8–25', durationDays: 17, care: 'Crown roots form just below surface.', water: 'FIRST CRITICAL IRRIGATION (Day 21).', fertilizer: 'Top dress 1st split Urea.', warnings: 'Delaying this water permanently limits tillers.' },
      { name: 'Tillering & Jointing', stageNumber: 3, daysRange: 'Day 26–65', durationDays: 40, care: 'Weed management (control Phalaris minor / Gullidanda).', water: 'Second and third irrigations.', fertilizer: 'Final nitrogen top dress.', warnings: 'Broadleaf and grassy weeds compete aggressively.' },
      { name: 'Booting & Heading', stageNumber: 4, daysRange: 'Day 66–90', durationDays: 25, care: 'Ears emerge from the flag leaf sheath.', water: 'Irrigate on calm windless days to prevent lodging.', fertilizer: 'Foliar spray 13:0:45 (Potassium Nitrate 1%).', warnings: 'Yellow rust (stripe rust) inspection.' },
      { name: 'Milk & Dough Stage', stageNumber: 5, daysRange: 'Day 91–115', durationDays: 25, care: 'Starch deposition inside grains.', water: 'Light irrigation if soil dry.', fertilizer: 'None.', warnings: 'Sudden hot winds in March (terminal heat stress).' },
      { name: 'Ripening & Harvest', stageNumber: 6, daysRange: 'Day 116–135', durationDays: 20, care: 'Grains become hard; straw turns bright golden yellow.', water: 'No irrigation.', fertilizer: 'None.', warnings: 'Combine harvest at 12% moisture.' }
    ],
    pestDiseases: [
      {
        name: 'Yellow (Stripe) Rust (Puccinia striiformis)',
        type: 'disease',
        symptoms: ['Linear yellow pustules arranged in parallel stripes on leaves', 'Yellow powdery spores on fingers when touched'],
        causes: 'Air-borne fungal rust favored by cool (10–18°C) humid morning weather.',
        prevention: 'Cultivate rust-resistant varieties. Avoid late sowing.',
        ipmControls: {
          biological: 'Foliar bio-agent formulation with Bacillus subtilis.',
          organic: 'Spray fermented sour buttermilk (Lassi 5%) mixed with neem oil.',
          mechanical: 'Destroy initial focal infection patches.',
          chemical: { activeIngredient: 'Propiconazole 25% EC @ 1 ml/L', usage: 'Spray immediately upon spotting initial yellow rust stripe in field', phiDays: 30, ppe: 'Full protective suit and mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 1.8,
      maxPerAcre: 2.8,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Indo-Gangetic plains average 2.2–2.5 tonnes/acre under timely November sowing.'
    },
    economics: {
      defaultSeedCost: 1800,
      defaultFertilizerCost: 4500,
      defaultLaborCost: 6500,
      defaultIrrigationCost: 2200,
      defaultOtherCost: 2500,
      defaultSellingPricePerKg: 23,
      defaultYieldKgPerAcre: 2200
    }
  },
  {
    id: 'millet',
    name: 'Pearl & Finger Millet (Bajra / Ragi)',
    tamilName: 'கம்பு / கேழ்வரகு',
    hindiName: 'बाजरा / रागी',
    scientificName: 'Pennisetum glaucum / Eleusine coracana',
    category: 'grain',
    image: 'https://images.unsplash.com/photo-1599818815598-a3f29050d221?w=600&auto=format&fit=crop&q=80',
    description: 'Climate-resilient nutri-cereal requiring minimal water and thriving in low-fertility drylands.',
    bestSeason: {
      months: ['Jun', 'Jul', 'Aug', 'Sep', 'Feb', 'Mar'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 25,
      idealTempMax: 38,
    },
    soilReq: {
      suitableSoilTypes: ['Sandy', 'Red', 'Loamy', 'Laterite'],
      idealPhMin: 5.5,
      idealPhMax: 8.0,
      requiredNutrients: 'Moderate Nitrogen, highly efficient phosphorus scavenger in arid soils.',
      soilPrepInstructions: ['Shallow plowing 1–2 times', 'Conserve pre-monsoon shower moisture']
    },
    weatherReq: {
      tempRange: '25°C – 38°C (Extreme drought and heat tolerant)',
      requiredHumidity: '40% – 60%',
      minHumidity: 30,
      maxHumidity: 70,
      rainfallMm: '300 – 500 mm',
      sunlightRequirements: 'Full intense tropical sunshine'
    },
    plantingGuide: {
      landPrep: 'Light harrowing and leveling.',
      soilPrep: 'Apply 4 tonnes FYM/acre.',
      seedSelection: 'Hybrids like HHB-67, RHB-173 for Bajra; GPU-28, ML-365 for Ragi.',
      seedTreatment: 'Azospirillum + PSB (200g each per 10kg seed).',
      plantingMethod: 'Direct line sowing with seed drill or transplanting for finger millet.',
      plantingDepth: '2 to 3 cm.',
      spacing: '45 cm x 15 cm (Bajra) or 22 cm x 10 cm (Ragi).',
      bestTime: 'June–July with onset of monsoon showers.'
    },
    waterMgmt: {
      level: 'Low',
      recommendedFrequency: 'Primarily rainfed; 1–2 protective irrigations if drought persists.',
      approxWaterRequirement: '250 – 350 mm',
      criticalStages: ['Tillering', 'Panicle emergence'],
      overwateringWarning: 'Excess water causes root rot; millets hate standing water.',
      underwateringWarning: 'Extremely resilient, but water stress during grain fill reduces grain weight.'
    },
    fertilizerGuide: {
      npkRatio: '60:30:30 kg/ha',
      organicRecommendations: ['4 tonnes FYM', 'Neem cake 50 kg/acre'],
      chemicalRecommendations: ['Urea', 'SSP', 'MOP'],
      quantityGuidance: 'Low fertilizer requirement; split nitrogen into basal and 30-day top dress.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Half N, Full P, Full K', timing: 'At sowing', notes: 'Band placement.' },
        { stage: 'Tillering', fertilizer: 'Half Nitrogen', timing: 'Day 30', notes: 'After weeding in moist soil.' }
      ]
    },
    growthTimeline: [
      { name: 'Emergence', stageNumber: 1, daysRange: 'Day 0–5', durationDays: 5, care: 'Rapid germination.', water: 'Rainfed.', fertilizer: 'None.', warnings: 'Ants and birds carrying seed.' },
      { name: 'Vegetative & Tillering', stageNumber: 2, daysRange: 'Day 6–35', durationDays: 30, care: 'Inter-cultivation with blade harrow.', water: 'Rainfed.', fertilizer: 'Top dress balance N.', warnings: 'Shoot fly.' },
      { name: 'Heading', stageNumber: 3, daysRange: 'Day 36–55', durationDays: 20, care: 'Ear-heads push through top sheath.', water: 'Protective irrigation if no rain.', fertilizer: 'None.', warnings: 'Ergot and downy mildew.' },
      { name: 'Grain Maturation', stageNumber: 4, daysRange: 'Day 56–85', durationDays: 30, care: 'Panicles turn brownish grey.', water: 'Dry weather preferred.', fertilizer: 'None.', warnings: 'Bird scaring required at maturity.' }
    ],
    pestDiseases: [
      {
        name: 'Downy Mildew / Green Ear (Sclerospora graminicola)',
        type: 'disease',
        symptoms: ['Chlorotic pale striping on young leaves with downy white growth underneath', 'Floral parts transform into leafy green brush-like structures (Green Ear)'],
        causes: 'Soil-borne and seed-borne oomycete.',
        prevention: 'Strict seed treatment with Metalaxyl. Rogue out infected plants early.',
        ipmControls: {
          biological: 'Seed treatment with Trichoderma viride.',
          organic: 'Spray copper fungicide on early leaf lesions.',
          mechanical: 'Pull out and bury green ear plants.',
          chemical: { activeIngredient: 'Metalaxyl-M 31.8% ES @ 2 ml/kg seed', usage: 'Seed dressing is primary control', phiDays: 45, ppe: 'Gloves and eye protection' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 1.0,
      maxPerAcre: 1.8,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Nutrient-rich grains give 1.2–1.6 tonnes/acre with valuable livestock dry fodder (karbi).'
    },
    economics: {
      defaultSeedCost: 800,
      defaultFertilizerCost: 2500,
      defaultLaborCost: 4500,
      defaultIrrigationCost: 800,
      defaultOtherCost: 1500,
      defaultSellingPricePerKg: 30,
      defaultYieldKgPerAcre: 1400
    }
  }
];
