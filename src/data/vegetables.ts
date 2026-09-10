import { Crop } from '../types';

export const vegetableCrops: Crop[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    tamilName: 'தக்காளி',
    hindiName: 'टमाटर',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'High-value, nutrient-dense solanaceous fruit vegetable widely grown across tropical and subtropical zones.',
    bestSeason: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 18,
      idealTempMax: 28,
    },
    soilReq: {
      suitableSoilTypes: ['Loamy', 'Sandy', 'Black', 'Alluvial'],
      idealPhMin: 6.0,
      idealPhMax: 6.8,
      requiredNutrients: 'High Phosphorus for early rooting, balanced Potassium for firm fruit skin, moderate Nitrogen.',
      soilPrepInstructions: [
        'Deep plowing 2–3 times to create fine tilt.',
        'Incorporate 10 tonnes of decomposed Farm Yard Manure (FYM) per acre.',
        'Form raised beds 90 cm wide with 30 cm drainage furrows.',
        'Incorporate neem cake (100 kg/acre) to suppress soil nematodes.'
      ]
    },
    weatherReq: {
      tempRange: '18°C – 28°C',
      requiredHumidity: '50% – 70%',
      minHumidity: 45,
      maxHumidity: 75,
      rainfallMm: '600 – 800 mm',
      sunlightRequirements: 'Full sunlight (6–8 hours daily)'
    },
    plantingGuide: {
      landPrep: 'Thoroughly plow and level land with proper drainage slopes.',
      soilPrep: 'Prepare raised nursery beds or direct field beds with organic compost.',
      seedSelection: 'Choose certified hybrid F1 seeds with >85% germination rate.',
      seedTreatment: 'Treat seeds with Trichoderma viride (4g/kg) or Pseudomonas fluorescens.',
      plantingMethod: 'Transplant 25–30 day old healthy seedlings with 4–5 true leaves.',
      plantingDepth: '1.5 to 2 cm nursery depth, firm soil around root ball.',
      spacing: '60 cm between rows and 45 cm between plants.',
      bestTime: 'Cool late afternoon or cloudy morning to reduce transplant shock.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 4–6 days (Drip irrigation daily 1–2 hours preferred)',
      approxWaterRequirement: '500 – 600 mm per season',
      criticalStages: ['Post-transplantation establishment', 'Flowering stage', 'Fruit enlargement'],
      overwateringWarning: 'Causes collar rot, root asphyxiation, and fungal fruit split.',
      underwateringWarning: 'Causes blossom-end rot (calcium deficiency) and flower abortion.'
    },
    fertilizerGuide: {
      npkRatio: '120:60:60 kg/ha',
      organicRecommendations: ['10 tonnes FYM/acre', '500 kg Vermicompost', '100 kg Neem cake at basal'],
      chemicalRecommendations: ['Urea / Ammonium Sulphate', 'Single Super Phosphate (SSP)', 'Muriate of Potash (MOP)'],
      quantityGuidance: 'Split Nitrogen into 3 equal doses: basal, 30 days, and 50 days after transplanting.',
      applicationSchedule: [
        { stage: 'Basal (Land preparation)', fertilizer: '100% P, 50% K, 30% N + FYM', timing: 'Day 0', notes: 'Incorporate into root zone.' },
        { stage: 'Vegetative (Active growth)', fertilizer: '35% Nitrogen (Urea)', timing: 'Day 25–30', notes: 'Band placement near base with light weeding.' },
        { stage: 'Flowering & Fruiting', fertilizer: '35% Nitrogen + 50% Potash (MOP)', timing: 'Day 50–60', notes: 'Supports continuous heavy fruit setting.' },
      ]
    },
    growthTimeline: [
      { name: 'Seed', stageNumber: 1, daysRange: 'Day 0–3', durationDays: 3, care: 'Maintain moisture in nursery tray or bed.', water: 'Fine mist spray twice daily.', fertilizer: 'None required.', warnings: 'Do not let topsoil crust form.' },
      { name: 'Germination', stageNumber: 2, daysRange: 'Day 4–8', durationDays: 5, care: 'Provide diffused sunlight.', water: 'Gentle moisture.', fertilizer: 'None.', warnings: 'Watch for damping-off fungus.' },
      { name: 'Seedling', stageNumber: 3, daysRange: 'Day 9–25', durationDays: 16, care: 'Thin overcrowded shoots, harden in sunlight.', water: 'Morning watering.', fertilizer: 'Foliar spray with 0.2% 19:19:19 at Day 18.', warnings: 'Protect from whiteflies and leaf miners.' },
      { name: 'Vegetative', stageNumber: 4, daysRange: 'Day 26–50', durationDays: 25, care: 'Stake indeterminate plants with bamboo sticks.', water: 'Irrigate every 4–5 days.', fertilizer: 'First top dress of Nitrogen.', warnings: 'Control sucking insects with neem oil.' },
      { name: 'Flowering', stageNumber: 5, daysRange: 'Day 51–65', durationDays: 15, care: 'Avoid touching wet plants, ensure good aeration.', water: 'Critical: steady moisture, avoid stress.', fertilizer: 'Spray Planofix or micronutrient boron.', warnings: 'Water stress drops flowers.' },
      { name: 'Fruiting', stageNumber: 6, daysRange: 'Day 66–90', durationDays: 25, care: 'Support heavy branches with tying twine.', water: 'Consistent uniform drip.', fertilizer: 'Top dress Potash for fruit shine.', warnings: 'Uneven watering causes blossom end rot.' },
      { name: 'Maturity', stageNumber: 7, daysRange: 'Day 91–105', durationDays: 15, care: 'Color breaks from mature green to breaker pink.', water: 'Slightly reduce watering.', fertilizer: 'Stop heavy nitrogen.', warnings: 'Bird and fruit borer damage.' },
      { name: 'Harvesting', stageNumber: 8, daysRange: 'Day 106–135', durationDays: 30, care: 'Harvest at breaker stage for transport or red ripe for local.', water: 'Light irrigation between pickings.', fertilizer: 'None.', warnings: 'Handle carefully to avoid bruising.' }
    ],
    pestDiseases: [
      {
        name: 'Fruit Borer (Helicoverpa armigera)',
        type: 'pest',
        symptoms: ['Holes in fruits', 'Frass (excreta) near stalk', 'Premature fruit rotting'],
        causes: 'Nocturnal moth caterpillar feeding inside developing fruit.',
        prevention: 'Intercrop with African Marigold as a trap crop (1:16 ratio). Install bird perches.',
        ipmControls: {
          biological: 'Install pheromone traps @ 5/acre. Spray Helicoverpa NPV @ 250 LE/acre.',
          organic: 'Spray Neem Seed Kernel Extract (NSKE 5%) or Bt (Bacillus thuringiensis) @ 2g/L.',
          mechanical: 'Hand-pick visible egg masses and early instars in morning.',
          chemical: { activeIngredient: 'Chlorantraniliprole 18.5% SC @ 0.3 ml/L', usage: 'Only on severe threshold (>5% damaged fruits)', phiDays: 3, ppe: 'Mask, rubber gloves, full sleeves' }
        }
      },
      {
        name: 'Late Blight (Phytophthora infestans)',
        type: 'disease',
        symptoms: ['Water-soaked dark lesions on leaves', 'White fuzzy mold on leaf undersides during humid weather', 'Brown greasy rot on green fruit'],
        causes: 'Oomycete pathogen favored by cool, foggy, high-humidity (>80%) weather.',
        prevention: 'Ensure good air circulation, avoid overhead sprinkler irrigation, destroy infected crop residue.',
        ipmControls: {
          biological: 'Soil application of Trichoderma viride enriched FYM at planting.',
          organic: 'Spray copper oxychloride (2.5 g/L) or Bordeaux mixture 1% as preventative.',
          mechanical: 'Prune lower leaves touching soil.',
          chemical: { activeIngredient: 'Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L', usage: 'Apply immediately upon initial lesion appearance', phiDays: 7, ppe: 'Eye goggles, chemical-resistant gloves, respirator mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 15,
      maxPerAcre: 25,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Hybrid indeterminate varieties under drip fertigation typically produce 20–25 tonnes/acre.'
    },
    economics: {
      defaultSeedCost: 3500,
      defaultFertilizerCost: 12000,
      defaultLaborCost: 22000,
      defaultIrrigationCost: 4000,
      defaultOtherCost: 6500,
      defaultSellingPricePerKg: 18,
      defaultYieldKgPerAcre: 20000
    }
  },
  {
    id: 'potato',
    name: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    hindiName: 'आलू',
    scientificName: 'Solanum tuberosum',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Major tuber crop and staple food known for high caloric yield and rich potassium content.',
    bestSeason: {
      months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 15,
      idealTempMax: 22,
    },
    soilReq: {
      suitableSoilTypes: ['Sandy', 'Loamy', 'Alluvial'],
      idealPhMin: 5.0,
      idealPhMax: 6.5,
      requiredNutrients: 'High Potash for tuber bulk, balanced Phosphorus, moderate Nitrogen.',
      soilPrepInstructions: [
        'Plow 20–25 cm deep to create friable, loose, clod-free soil bed.',
        'Avoid alkaline soils (pH > 7.0) to prevent potato scab disease.',
        'Incorporate 12 tonnes well-rotted cattle manure per acre.'
      ]
    },
    weatherReq: {
      tempRange: '15°C – 22°C (Tuber initiation stops above 25°C)',
      requiredHumidity: '60% – 80%',
      minHumidity: 50,
      maxHumidity: 85,
      rainfallMm: '450 – 650 mm',
      sunlightRequirements: 'Bright sunny days with cool crisp nights'
    },
    plantingGuide: {
      landPrep: 'Make ridges and furrows spaced 50–60 cm apart.',
      soilPrep: 'Ensure friable loose beds so expanding tubers encounter zero compaction.',
      seedSelection: 'Certified seed tubers (30–40g size) with 2–3 sprouted eyes.',
      seedTreatment: 'Dip tubers in Mencozeb (0.2%) or Trichoderma for 10 mins, dry in shade.',
      plantingMethod: 'Plant whole sprouted seed tubers eye-facing up on ridge flanks.',
      plantingDepth: '5 to 7 cm deep, immediately covered with loose soil.',
      spacing: '50–60 cm between ridges and 20 cm between tubers.',
      bestTime: 'October to early November when night temperatures drop below 20°C.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 7–10 days; light, frequent furrow irrigations.',
      approxWaterRequirement: '450 – 600 mm per crop cycle',
      criticalStages: ['Stolon formation', 'Tuber initiation (Day 30–35)', 'Tuber bulking'],
      overwateringWarning: 'Causes tuber rot, black heart, and fungal blight.',
      underwateringWarning: 'Causes knobby, irregular, cracked tubers.'
    },
    fertilizerGuide: {
      npkRatio: '150:100:120 kg/ha',
      organicRecommendations: ['12 tonnes FYM/acre', 'Castor cake 200 kg/acre'],
      chemicalRecommendations: ['DAP', 'Urea', 'Muriate of Potash (MOP) or Potassium Sulphate (SOP)'],
      quantityGuidance: 'Potassium Sulphate provides better starch content and skin finish than MOP.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Half N, Full P, Half K', timing: 'At planting', notes: 'Band 5 cm away from seed tubers.' },
        { stage: 'Earthing-Up (Day 30)', fertilizer: 'Remaining Half N + Half K', timing: 'At 30–35 days', notes: 'Earth up soil around plant base to cover growing tubers from sunlight.' }
      ]
    },
    growthTimeline: [
      { name: 'Seed Sprouting', stageNumber: 1, daysRange: 'Day 0–7', durationDays: 7, care: 'Keep tubers in diffuse light till sprouts turn thick green.', water: 'None.', fertilizer: 'None.', warnings: 'Discard diseased or rotted tubers.' },
      { name: 'Emergence', stageNumber: 2, daysRange: 'Day 8–18', durationDays: 10, care: 'Watch for uniform emergence through ridge.', water: 'First light irrigation if soil dry.', fertilizer: 'None.', warnings: 'Do not flood ridge tops.' },
      { name: 'Vegetative Growth', stageNumber: 3, daysRange: 'Day 19–35', durationDays: 16, care: 'Weed carefully between rows.', water: 'Maintain 65% field capacity.', fertilizer: 'Top dress balance N before earthing up.', warnings: 'Protect from cutworms.' },
      { name: 'Tuber Initiation', stageNumber: 4, daysRange: 'Day 36–50', durationDays: 15, care: 'Critical earthing up to prevent greening.', water: 'Ensure regular steady moisture.', fertilizer: 'Foliar spray Potassium Nitrate.', warnings: 'Sunlight on exposed tubers causes toxic solanine.' },
      { name: 'Tuber Bulking', stageNumber: 5, daysRange: 'Day 51–80', durationDays: 30, care: 'Peak growth phase.', water: 'Irrigate every 5–7 days.', fertilizer: 'Micronutrient foliar spray (B & Zn).', warnings: 'Monitor for aphid vectors of viral leaf roll.' },
      { name: 'Maturity', stageNumber: 6, daysRange: 'Day 81–95', durationDays: 15, care: 'Haulm cutting (dehaulming) 10–12 days before harvest to harden skin.', water: 'Stop all irrigation 10 days before harvest.', fertilizer: 'None.', warnings: 'Do not dig wet soil.' },
      { name: 'Harvesting', stageNumber: 7, daysRange: 'Day 96–110', durationDays: 15, care: 'Dig tubers carefully with potato digger or hand khurpa.', water: 'None.', fertilizer: 'None.', warnings: 'Avoid skinning or bruising tubers.' }
    ],
    pestDiseases: [
      {
        name: 'Potato Tuber Moth (Phthorimaea operculella)',
        type: 'pest',
        symptoms: ['Mined galleries in leaves', 'Caterpillars tunneling inside tubers leaving dirty excrement'],
        causes: 'Adult moths lay eggs near exposed tubers in cracked soils.',
        prevention: 'Deep planting (10 cm) and proper earthing-up so tubers remain well-buried.',
        ipmControls: {
          biological: 'Pheromone traps @ 8/acre. Granulosis virus (PoGV) spray.',
          organic: 'Coat stored seed potatoes with dried Lantana or eucalyptus leaves.',
          mechanical: 'Prompt earthing-up to close all soil cracks.',
          chemical: { activeIngredient: 'Quinalphos 25% EC @ 2 ml/L', usage: 'Spray on crop foliage if moth density exceeds threshold', phiDays: 15, ppe: 'Full protective suit and mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 8,
      maxPerAcre: 14,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Quality certified seed tubers yield 10–12 tonnes/acre in northern and central belts.'
    },
    economics: {
      defaultSeedCost: 18000,
      defaultFertilizerCost: 11000,
      defaultLaborCost: 14000,
      defaultIrrigationCost: 3500,
      defaultOtherCost: 5000,
      defaultSellingPricePerKg: 14,
      defaultYieldKgPerAcre: 10000
    }
  },
  {
    id: 'onion',
    name: 'Onion',
    tamilName: 'வெங்காயம்',
    hindiName: 'प्याज',
    scientificName: 'Allium cepa',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Essential bulb vegetable with high commercial demand across all culinary markets.',
    bestSeason: {
      months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 15,
      idealTempMax: 26,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Loamy', 'Sandy', 'Clay'],
      idealPhMin: 6.0,
      idealPhMax: 7.2,
      requiredNutrients: 'High Sulphur for pungency and storage life, moderate N-P-K.',
      soilPrepInstructions: [
        'Till 4 times to produce fine clod-free crumbly seedbed.',
        'Apply 10 tonnes FYM + 25 kg agricultural Sulphur per acre.',
        'Form broad beds and furrows (BBF) 1.2 m wide.'
      ]
    },
    weatherReq: {
      tempRange: '15°C – 26°C',
      requiredHumidity: '55% – 70%',
      minHumidity: 50,
      maxHumidity: 75,
      rainfallMm: '350 – 550 mm',
      sunlightRequirements: 'Long photoperiod for bulb development'
    },
    plantingGuide: {
      landPrep: 'Level thoroughly with laser leveler for uniform shallow irrigation.',
      soilPrep: 'Ensure high organic carbon content and free drainage.',
      seedSelection: 'Cultivars like N-53, Bhima Super, or Arka Kalyan.',
      seedTreatment: 'Thiram or Captan @ 2g/kg seed to prevent smut and damping-off.',
      plantingMethod: 'Transplant 6–7 week old seedlings with pencil-thickness stems.',
      plantingDepth: '1.5 to 2.0 cm (avoid planting too deep, which causes thick necks).',
      spacing: '15 cm between rows and 10 cm between seedlings.',
      bestTime: 'Cool early morning transplanting into moist soil.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 5–7 days; shallow root system requires frequent light water.',
      approxWaterRequirement: '400 – 500 mm',
      criticalStages: ['Post-transplant', 'Vegetative growth', 'Bulb enlargement (Day 60–90)'],
      overwateringWarning: 'Leads to purple blotch, basal rot, and thick neck with poor shelf life.',
      underwateringWarning: 'Causes premature bolting and split double bulbs.'
    },
    fertilizerGuide: {
      npkRatio: '100:50:50 + 30 kg S/ha',
      organicRecommendations: ['10 tonnes FYM', '200 kg poultry manure', 'Sulphur bentonite 25 kg/acre'],
      chemicalRecommendations: ['Urea', 'SSP (Single Super Phosphate provides both P & S)', 'MOP'],
      quantityGuidance: 'Apply Sulphur; it increases pungency, bulb density, and storage lifespan.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: '30% N, 100% P, 100% K + Sulphur', timing: 'At transplanting', notes: 'Incorporate into top 10 cm soil.' },
        { stage: '30 Days', fertilizer: '35% Nitrogen', timing: 'Day 30', notes: 'Side-dress after shallow hoeing.' },
        { stage: '45 Days', fertilizer: '35% Nitrogen', timing: 'Day 45', notes: 'Final nitrogen dose before bulb development starts.' }
      ]
    },
    growthTimeline: [
      { name: 'Nursery', stageNumber: 1, daysRange: 'Day 0–45', durationDays: 45, care: 'Raise vigorous seedlings on raised nursery beds.', water: 'Rose-can daily watering.', fertilizer: 'Light vermicompost application.', warnings: 'Protect from thrips.' },
      { name: 'Transplanting', stageNumber: 2, daysRange: 'Day 46–55', durationDays: 10, care: 'Clip top 1/3 of seedling leaves to reduce transpiration.', water: 'Immediate life irrigation.', fertilizer: 'Basal dose applied.', warnings: 'Do not bury root collar too deep.' },
      { name: 'Vegetative', stageNumber: 3, daysRange: 'Day 56–90', durationDays: 35, care: 'Keep field weed-free with 2 hand weedings.', water: 'Irrigate every 6 days.', fertilizer: 'Complete all nitrogen top dressings.', warnings: 'Onion roots are very shallow, hoe gently.' },
      { name: 'Bulb Formation', stageNumber: 4, daysRange: 'Day 91–125', durationDays: 35, care: 'Bulbs swell above ground.', water: 'Critical moisture period.', fertilizer: 'Foliar spray 0:0:50 (Potassium sulphate).', warnings: 'Do not apply late nitrogen, causes hollow bulbs.' },
      { name: 'Bulb Maturity', stageNumber: 5, daysRange: 'Day 126–140', durationDays: 15, care: 'Top neck fall occurs naturally (50% neck fall indicates harvest time).', water: 'Withhold all water 15 days before harvest.', fertilizer: 'None.', warnings: 'Watering near harvest causes post-harvest rot.' },
      { name: 'Harvest & Curing', stageNumber: 6, daysRange: 'Day 141–155', durationDays: 15, care: 'Field cure in shade for 5–7 days to seal dry outer scales.', water: 'None.', fertilizer: 'None.', warnings: 'Direct scorching sun turns bulbs green.' }
    ],
    pestDiseases: [
      {
        name: 'Onion Thrips (Thrips tabaci)',
        type: 'pest',
        symptoms: ['Silvery white patches on leaves', 'Curled and deformed leaf tips', 'Stunted growth'],
        causes: 'Microscopic yellow-brown insects rasping leaf surface in dry warm weather.',
        prevention: 'Maintain good moisture. Plant 2 border rows of maize or maize-sorghum barrier.',
        ipmControls: {
          biological: 'Install blue sticky traps @ 15–20 per acre.',
          organic: 'Spray Neem oil 10,000 ppm @ 3 ml/L or Verticillium lecanii @ 5 g/L.',
          mechanical: 'Sprinkler irrigation dislodges thrips mechanically.',
          chemical: { activeIngredient: 'Fipronil 5% SC @ 1.5 ml/L', usage: 'Apply when thrips count >30 per plant', phiDays: 7, ppe: 'Protective face mask and gloves' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 8,
      maxPerAcre: 15,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Rabi season yields 12–15 tonnes/acre with excellent storage capability.'
    },
    economics: {
      defaultSeedCost: 4500,
      defaultFertilizerCost: 8500,
      defaultLaborCost: 18000,
      defaultIrrigationCost: 3500,
      defaultOtherCost: 4500,
      defaultSellingPricePerKg: 22,
      defaultYieldKgPerAcre: 11000
    }
  },
  {
    id: 'chilli',
    name: 'Chilli (Hot Pepper)',
    tamilName: 'மிளகாய்',
    hindiName: 'मिर्च',
    scientificName: 'Capsicum annuum',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'High-earning spice and vegetable crop cultivated for green fruit and sun-dried red chillies.',
    bestSeason: {
      months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Jan', 'Feb'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 20,
      idealTempMax: 32,
    },
    soilReq: {
      suitableSoilTypes: ['Black', 'Loamy', 'Red', 'Alluvial'],
      idealPhMin: 6.2,
      idealPhMax: 7.5,
      requiredNutrients: 'Balanced NPK + Calcium & Boron to prevent fruit blossom-end decay and curl.',
      soilPrepInstructions: [
        'Plow deeply 3 times; chillies need well-drained, deep, aerated soils.',
        'Form ridges spaced 60 cm apart or raised beds with drip lateral lines.'
      ]
    },
    weatherReq: {
      tempRange: '20°C – 32°C',
      requiredHumidity: '55% – 70%',
      minHumidity: 50,
      maxHumidity: 75,
      rainfallMm: '600 – 1000 mm',
      sunlightRequirements: 'Full tropical sun (7–9 hours)'
    },
    plantingGuide: {
      landPrep: 'Ensure complete eradication of perennial weed rhizomes.',
      soilPrep: 'Apply 8 tonnes FYM and 100 kg Neem Cake per acre.',
      seedSelection: 'High-pungency hybrids like Guntur Hope, Teja, Byadgi, or US-341.',
      seedTreatment: 'Treat with Trichoderma viride (4 g/kg) and Imidacloprid (3 g/kg).',
      plantingMethod: 'Transplant 35-day seedlings with strong taproots.',
      plantingDepth: 'Root collar level (2 cm).',
      spacing: '60 cm x 45 cm.',
      bestTime: 'Afternoon planting after irrigating the furrow.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 5–8 days depending on temperature.',
      approxWaterRequirement: '500 – 700 mm',
      criticalStages: ['Vegetative branching', 'Flowering', 'Fruit expansion'],
      overwateringWarning: 'Severe risk of damping off and Phytophthora root rot.',
      underwateringWarning: 'Flower and fruit drop, stunted small pods.'
    },
    fertilizerGuide: {
      npkRatio: '120:60:60 kg/ha',
      organicRecommendations: ['8 tonnes FYM', '200 kg Vermicompost', 'Neem cake 100 kg'],
      chemicalRecommendations: ['DAP', 'Urea', 'MOP', 'Micronutrient foliar spray (Zinc + Boron)'],
      quantityGuidance: 'Split Nitrogen into 4 equal splits at transplanting, 30, 60, and 90 days.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P + 30% N + 50% K', timing: 'Day 0', notes: 'Apply in ridges.' },
        { stage: 'Early Vegetative', fertilizer: '25% Nitrogen', timing: 'Day 30', notes: 'Along with inter-cultivation.' },
        { stage: 'Flowering', fertilizer: '25% Nitrogen + 50% K', timing: 'Day 60', notes: 'Boosts bloom density.' },
        { stage: 'Pod Picking', fertilizer: '20% Nitrogen', timing: 'Day 90', notes: 'Maintains successive flushes.' }
      ]
    },
    growthTimeline: [
      { name: 'Nursery', stageNumber: 1, daysRange: 'Day 0–35', durationDays: 35, care: 'Use 40-mesh insect-proof net over nursery.', water: 'Daily light sprinkling.', fertilizer: 'Foliar spray with Seaweed extract.', warnings: 'Keep seedlings free of sucking thrips.' },
      { name: 'Transplanting', stageNumber: 2, daysRange: 'Day 36–45', durationDays: 10, care: 'Transplant into moist ridges.', water: 'Immediate life irrigation.', fertilizer: 'Basal dose applied.', warnings: 'Avoid root damage.' },
      { name: 'Vegetative Branching', stageNumber: 3, daysRange: 'Day 46–70', durationDays: 25, care: 'Pinch terminal shoot at Day 50 to promote bushiness.', water: 'Irrigate weekly.', fertilizer: 'First split top dressing.', warnings: 'Scout for yellow mite under leaf surfaces.' },
      { name: 'Flowering', stageNumber: 4, daysRange: 'Day 71–90', durationDays: 20, care: 'Spray Planofix (1ml / 4.5L water) to stop flower drop.', water: 'Keep soil moist, never waterlogged.', fertilizer: 'Potash and Boron spray.', warnings: 'Hot dry winds cause flower abortion.' },
      { name: 'Fruit Setting', stageNumber: 5, daysRange: 'Day 91–110', durationDays: 20, care: 'Green pods lengthen and develop pungency.', water: 'Uniform regular irrigation.', fertilizer: 'Calcium nitrate foliar spray.', warnings: 'Fruit rot / Anthracnose control.' },
      { name: 'Harvesting (Multiple Pickings)', stageNumber: 6, daysRange: 'Day 111–180', durationDays: 70, care: 'Pick green chillies every 10–14 days or let ripen red.', water: 'Irrigate after every picking.', fertilizer: 'Light urea after major flushes.', warnings: 'Dry red chillies on clean tarpaulins, not bare dirt.' }
    ],
    pestDiseases: [
      {
        name: 'Chilli Leaf Curl Virus (Murda disease)',
        type: 'disease',
        symptoms: ['Upward curling of leaves (thrips vector) or downward curling (mite vector)', 'Stunted bushy growth', 'Puckered thick leaves'],
        causes: 'Viral infection transmitted by whitefly (Bemisia tabaci) and thrips.',
        prevention: 'Grow 3 border rows of sorghum/maize as barrier. Install yellow & blue sticky cards.',
        ipmControls: {
          biological: 'Spray Verticillium lecanii @ 5 g/L. Release green lacewing (Chrysoperla).',
          organic: 'Spray Neem oil (10,000 ppm) + Pongamia oil @ 3 ml/L each week.',
          mechanical: 'Uproot and burn virus-infected plants immediately.',
          chemical: { activeIngredient: 'Diafenthiuron 50% WP @ 1.2 g/L', usage: 'Controls both mites and whiteflies', phiDays: 5, ppe: 'Full PPE' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 6,
      maxPerAcre: 12,
      unit: 'tonnes green / 1.5–2.5 tonnes dry',
      benchmarkNotes: 'Green chilli yields 8–10 tonnes/acre; sun-dried red chilli gives 1.8–2.2 tonnes/acre.'
    },
    economics: {
      defaultSeedCost: 4000,
      defaultFertilizerCost: 11000,
      defaultLaborCost: 24000,
      defaultIrrigationCost: 4000,
      defaultOtherCost: 6000,
      defaultSellingPricePerKg: 35,
      defaultYieldKgPerAcre: 8000
    }
  },
  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    tamilName: 'கத்தரிக்காய்',
    hindiName: 'बैंगन',
    scientificName: 'Solanum melongena',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&auto=format&fit=crop&q=80',
    description: 'Hardy warm-season vegetable giving prolonged harvests over 5–8 months.',
    bestSeason: {
      months: ['Jun', 'Jul', 'Oct', 'Nov', 'Feb', 'Mar'],
      seasonName: 'Year-Round',
      idealTempMin: 22,
      idealTempMax: 32,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Loamy', 'Clay', 'Black'],
      idealPhMin: 6.0,
      idealPhMax: 7.2,
      requiredNutrients: 'High organic carbon, rich in Nitrogen and Potash.',
      soilPrepInstructions: ['Deep summer plowing', 'Ridge and furrow preparation 75 cm apart']
    },
    weatherReq: {
      tempRange: '22°C – 32°C',
      requiredHumidity: '60% – 75%',
      minHumidity: 50,
      maxHumidity: 80,
      rainfallMm: '500 – 800 mm',
      sunlightRequirements: 'Sunny conditions'
    },
    plantingGuide: {
      landPrep: 'Tillage to 25 cm depth.',
      soilPrep: 'Apply 10 tonnes FYM/acre.',
      seedSelection: 'Choose pest-tolerant varieties like Pusa Purple, CO-2, or hybrid varieties.',
      seedTreatment: 'Pseudomonas fluorescens 10g/kg.',
      plantingMethod: 'Transplanting 30-day seedlings.',
      plantingDepth: '2 cm.',
      spacing: '75 cm x 60 cm.',
      bestTime: 'Evening hours.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 5–7 days.',
      approxWaterRequirement: '550 – 700 mm',
      criticalStages: ['Transplanting', 'Branching', 'Continuous fruiting'],
      overwateringWarning: 'Root rot and wilting.',
      underwateringWarning: 'Bitterness in fruit, stunted growth.'
    },
    fertilizerGuide: {
      npkRatio: '100:50:50 kg/ha',
      organicRecommendations: ['10 tonnes FYM', '200 kg Vermicompost'],
      chemicalRecommendations: ['Urea', 'SSP', 'MOP'],
      quantityGuidance: 'Top-dress nitrogen every 3 weeks during peak pickings.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P, Half K, 1/3 N', timing: 'Day 0', notes: 'Incorporated into furrows.' },
        { stage: 'Day 30', fertilizer: '1/3 Nitrogen', timing: 'Day 30', notes: 'Hoeing and earthing-up.' },
        { stage: 'Day 60', fertilizer: '1/3 Nitrogen + Half K', timing: 'Day 60', notes: 'Prolongs harvest flushes.' }
      ]
    },
    growthTimeline: [
      { name: 'Nursery', stageNumber: 1, daysRange: 'Day 0–30', durationDays: 30, care: 'Protect from flea beetles.', water: 'Daily sprinkler.', fertilizer: 'Vermicompost top dressing.', warnings: 'Do not let seedlings grow lanky.' },
      { name: 'Transplanting', stageNumber: 2, daysRange: 'Day 31–40', durationDays: 10, care: 'Firm planting in moist soil.', water: 'Life irrigation.', fertilizer: 'Basal applied.', warnings: 'Transplant shock.' },
      { name: 'Vegetative Growth', stageNumber: 3, daysRange: 'Day 41–65', durationDays: 25, care: 'Earthing up to anchor heavy stem.', water: 'Every 6 days.', fertilizer: 'First N split.', warnings: 'Shoot and fruit borer shoot wilting.' },
      { name: 'Flowering & Fruiting', stageNumber: 4, daysRange: 'Day 66–90', durationDays: 25, care: 'First harvest starts around day 75.', water: 'Steady irrigation.', fertilizer: 'Potash top dressing.', warnings: 'Borer entry in young calyx.' },
      { name: 'Continuous Harvest', stageNumber: 5, daysRange: 'Day 91–180', durationDays: 90, care: 'Pick tender shiny fruits twice a week.', water: 'Post-picking watering.', fertilizer: 'Foliar nutrition monthly.', warnings: 'Over-mature fruits turn dull and seedy.' }
    ],
    pestDiseases: [
      {
        name: 'Shoot and Fruit Borer (Leucinodes orbonalis)',
        type: 'pest',
        symptoms: ['Wilting and drooping of terminal shoots', 'Bore holes in fruits plugged with frass', 'Misshapen rotting fruits'],
        causes: 'Caterpillar boring inside tender shoots and fruits.',
        prevention: 'Continuous clipping and burying of wilted shoots with larvae.',
        ipmControls: {
          biological: 'Pheromone traps (Lucinlure) @ 8–10 per acre.',
          organic: 'Neem seed kernel extract (NSKE 5%) or Bacillus thuringiensis (Bt) @ 2g/L.',
          mechanical: 'Install nylon mesh barrier; prompt destruction of infested fruit.',
          chemical: { activeIngredient: 'Emamectin benzoate 5% SG @ 0.4 g/L', usage: 'Spray during peak egg hatching', phiDays: 3, ppe: 'Gloves and respirator' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 12,
      maxPerAcre: 22,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Hybrids produce 16–20 tonnes/acre over a 6-month period.'
    },
    economics: {
      defaultSeedCost: 2800,
      defaultFertilizerCost: 9500,
      defaultLaborCost: 20000,
      defaultIrrigationCost: 4000,
      defaultOtherCost: 4500,
      defaultSellingPricePerKg: 16,
      defaultYieldKgPerAcre: 16000
    }
  },
  {
    id: 'okra',
    name: 'Okra (Lady Finger)',
    tamilName: 'வெண்டைக்காய்',
    hindiName: 'भिंडी',
    scientificName: 'Abelmoschus esculentus',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&auto=format&fit=crop&q=80',
    description: 'Fast-growing warm-weather vegetable harvested every 2 days for tender mucilaginous pods.',
    bestSeason: {
      months: ['Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug'],
      seasonName: 'Zaid (Summer)',
      idealTempMin: 24,
      idealTempMax: 35,
    },
    soilReq: {
      suitableSoilTypes: ['Loamy', 'Alluvial', 'Sandy', 'Clay'],
      idealPhMin: 6.0,
      idealPhMax: 7.5,
      requiredNutrients: 'Rich in organic matter and balanced Nitrogen.',
      soilPrepInstructions: ['Tillage 2 times', 'Make ridges at 45 cm distance']
    },
    weatherReq: {
      tempRange: '24°C – 35°C',
      requiredHumidity: '60% – 80%',
      minHumidity: 50,
      maxHumidity: 85,
      rainfallMm: '500 – 750 mm',
      sunlightRequirements: 'Thrives in warm sunny weather'
    },
    plantingGuide: {
      landPrep: 'Level and weed-free field.',
      soilPrep: 'Incorporate 8 tonnes FYM/acre.',
      seedSelection: 'Yellow Vein Mosaic Virus (YVMV) resistant varieties like Arka Anamika, Mahyco-10.',
      seedTreatment: 'Soak seeds in water for 12 hours, treat with Thiram @ 2g/kg.',
      plantingMethod: 'Direct dibbling in ridges.',
      plantingDepth: '2 to 2.5 cm.',
      spacing: '45 cm row to row, 30 cm plant to plant.',
      bestTime: 'Early morning sowing in pre-irrigated soil.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Summer: every 4–5 days; Monsoon: as needed.',
      approxWaterRequirement: '400 – 500 mm',
      criticalStages: ['Germination', 'Flowering', 'Pod formation'],
      overwateringWarning: 'Yellowing and root fungal decay.',
      underwateringWarning: 'Fibrous hard pods with poor consumer appeal.'
    },
    fertilizerGuide: {
      npkRatio: '80:50:50 kg/ha',
      organicRecommendations: ['8 tonnes FYM', '150 kg Neem cake'],
      chemicalRecommendations: ['Urea', 'DAP', 'MOP'],
      quantityGuidance: 'Apply nitrogen in 3 equal splits: basal, 30 days, and 45 days.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P, Full K, 1/3 N', timing: 'At sowing', notes: 'Band placement.' },
        { stage: '30 Days', fertilizer: '1/3 Nitrogen', timing: 'Day 30', notes: 'Side dressing.' },
        { stage: '45 Days', fertilizer: '1/3 Nitrogen', timing: 'Day 45', notes: 'Sustains pod elongation.' }
      ]
    },
    growthTimeline: [
      { name: 'Germination', stageNumber: 1, daysRange: 'Day 0–6', durationDays: 6, care: 'Maintain soil moisture.', water: 'Gentle moisture.', fertilizer: 'None.', warnings: 'Avoid crusting.' },
      { name: 'Seedling', stageNumber: 2, daysRange: 'Day 7–20', durationDays: 14, care: 'Thin to one seedling per hill.', water: 'Every 5 days.', fertilizer: 'None.', warnings: 'Flea beetles and jassids.' },
      { name: 'Vegetative', stageNumber: 3, daysRange: 'Day 21–40', durationDays: 20, care: 'Hoeing and earthing-up.', water: 'Regular irrigation.', fertilizer: 'First N split.', warnings: 'Watch for whitefly vectors.' },
      { name: 'Flowering & Fruiting', stageNumber: 4, daysRange: 'Day 41–55', durationDays: 15, care: 'Yellow hibiscus-like blooms appear.', water: 'Critical moisture stage.', fertilizer: 'Second N split.', warnings: 'Borer entry in buds.' },
      { name: 'Harvesting', stageNumber: 5, daysRange: 'Day 56–100', durationDays: 45, care: 'Harvest tender pods every alternate day.', water: 'Irrigate after every two pickings.', fertilizer: 'Foliar micronutrient spray.', warnings: 'Delayed picking makes pods fibrous.' }
    ],
    pestDiseases: [
      {
        name: 'Yellow Vein Mosaic Virus (YVMV)',
        type: 'disease',
        symptoms: ['Bright yellow network of veins on leaves', 'Small deformed yellow-green pods', 'Stunted plant'],
        causes: 'Virus vectored by the whitefly (Bemisia tabaci).',
        prevention: 'Plant strictly resistant hybrids (e.g. Arka Anamika). Remove alternate weed hosts.',
        ipmControls: {
          biological: 'Conserve predatory coccinellids.',
          organic: 'Spray Neem oil @ 5 ml/L at 10-day intervals.',
          mechanical: 'Install yellow sticky traps @ 10/acre.',
          chemical: { activeIngredient: 'Acetamiprid 20% SP @ 0.3 g/L', usage: 'For whitefly control before virus spreads', phiDays: 5, ppe: 'Gloves, mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 4,
      maxPerAcre: 7,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Summer and rainy crops yield 4.5–6.5 tonnes/acre under clean IPM management.'
    },
    economics: {
      defaultSeedCost: 2000,
      defaultFertilizerCost: 6500,
      defaultLaborCost: 15000,
      defaultIrrigationCost: 3000,
      defaultOtherCost: 3500,
      defaultSellingPricePerKg: 25,
      defaultYieldKgPerAcre: 5500
    }
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    tamilName: 'வெள்ளரிக்காய்',
    hindiName: 'खीरा',
    scientificName: 'Cucumis sativus',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=80',
    description: 'Refreshing cucurbit vine providing quick returns within 45–60 days of direct seeding.',
    bestSeason: {
      months: ['Jan', 'Feb', 'Mar', 'Jun', 'Jul'],
      seasonName: 'Zaid (Summer)',
      idealTempMin: 22,
      idealTempMax: 34,
    },
    soilReq: {
      suitableSoilTypes: ['Sandy', 'Loamy', 'Alluvial'],
      idealPhMin: 6.0,
      idealPhMax: 7.0,
      requiredNutrients: 'High organic matter, balanced Potassium for crispness.',
      soilPrepInstructions: ['Dig pits of 45 cm x 45 cm x 45 cm', 'Fill pit with 10 kg FYM and topsoil']
    },
    weatherReq: {
      tempRange: '22°C – 34°C',
      requiredHumidity: '60% – 75%',
      minHumidity: 45,
      maxHumidity: 80,
      rainfallMm: '400 – 600 mm',
      sunlightRequirements: 'Abundant sunshine'
    },
    plantingGuide: {
      landPrep: 'Plow field twice, make channels spaced 1.5 to 2 meters apart.',
      soilPrep: 'Add organic compost and neem cake to each planting hill.',
      seedSelection: 'Parthenocarpic hybrids (Poinsette, Malini, Green Long).',
      seedTreatment: 'Trichoderma viride 4g/kg.',
      plantingMethod: 'Dibble 3–4 seeds per hill, thin to best 2 seedlings.',
      plantingDepth: '2 cm.',
      spacing: '1.5 to 2.0 m between rows, 60 cm between hills.',
      bestTime: 'February for summer or June for rainy season.'
    },
    waterMgmt: {
      level: 'High',
      recommendedFrequency: 'Every 3–4 days in summer.',
      approxWaterRequirement: '400 – 550 mm',
      criticalStages: ['Flowering', 'Fruit development'],
      overwateringWarning: 'Powdery mildew, downy mildew, and root rot.',
      underwateringWarning: 'Bitter fruits with hollow centers.'
    },
    fertilizerGuide: {
      npkRatio: '70:50:50 kg/ha',
      organicRecommendations: ['10 tonnes FYM/acre', 'Panchagavya foliar spray 3%'],
      chemicalRecommendations: ['Urea', 'SSP', 'MOP'],
      quantityGuidance: 'Avoid excess nitrogen which causes male flower excess and bitterness.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P, Half K, 1/3 N', timing: 'In pits before sowing', notes: 'Thoroughly mix with soil.' },
        { stage: 'Vine Extension', fertilizer: '1/3 Nitrogen', timing: 'Day 25', notes: 'Band around vine.' },
        { stage: 'Fruiting', fertilizer: '1/3 Nitrogen + Half K', timing: 'Day 45', notes: 'Sustains crisp fruiting.' }
      ]
    },
    growthTimeline: [
      { name: 'Germination', stageNumber: 1, daysRange: 'Day 0–5', durationDays: 5, care: 'Protect from red pumpkin beetle.', water: 'Light surface moisture.', fertilizer: 'None.', warnings: 'Red beetle cuts cotyledons.' },
      { name: 'Vine Running', stageNumber: 2, daysRange: 'Day 6–30', durationDays: 25, care: 'Direct vines on dry mulching or trellis.', water: 'Regular irrigation.', fertilizer: 'First N dose.', warnings: 'Keep leaves off damp soil.' },
      { name: 'Flowering', stageNumber: 3, daysRange: 'Day 31–45', durationDays: 15, care: 'Ensure bee activity for open pollinated types.', water: 'Uniform moisture.', fertilizer: 'Foliar micronutrient spray.', warnings: 'Do not spray chemicals in morning when bees visit.' },
      { name: 'Harvesting', stageNumber: 4, daysRange: 'Day 46–75', durationDays: 30, care: 'Pick tender crisp cucumbers every 2 days.', water: 'Immediate post-harvest watering.', fertilizer: 'Foliar 13:0:45.', warnings: 'Over-mature fruit turns yellow and bitter.' }
    ],
    pestDiseases: [
      {
        name: 'Downy Mildew (Pseudoperonospora cubensis)',
        type: 'disease',
        symptoms: ['Angular yellow lesions on upper leaf surface restricted by veins', 'Purplish fungal down on lower surface'],
        causes: 'Fungus thriving during warm humid or foggy spells.',
        prevention: 'Trellis training for vertical airflow; avoid wetting leaves.',
        ipmControls: {
          biological: 'Spray Trichoderma harzianum @ 5 g/L.',
          organic: 'Spray milk solution (10%) or Bordeaux mixture (0.5%).',
          mechanical: 'Prune diseased lower leaves.',
          chemical: { activeIngredient: 'Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L', usage: 'At first appearance of angular spots', phiDays: 5, ppe: 'Respirator, gloves' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 6,
      maxPerAcre: 12,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Open field yields 7–9 tonnes/acre; trellis and polyhouse systems yield 15–20 tonnes/acre.'
    },
    economics: {
      defaultSeedCost: 2500,
      defaultFertilizerCost: 6000,
      defaultLaborCost: 12000,
      defaultIrrigationCost: 3500,
      defaultOtherCost: 3000,
      defaultSellingPricePerKg: 18,
      defaultYieldKgPerAcre: 8000
    }
  },
  {
    id: 'carrot',
    name: 'Carrot',
    tamilName: 'கேரட்',
    hindiName: 'गाजर',
    scientificName: 'Daucus carota',
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    description: 'High-value root crop rich in beta-carotene, thriving in cool winter temperatures.',
    bestSeason: {
      months: ['Sep', 'Oct', 'Nov', 'Dec'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 15,
      idealTempMax: 22,
    },
    soilReq: {
      suitableSoilTypes: ['Sandy', 'Loamy', 'Alluvial'],
      idealPhMin: 6.0,
      idealPhMax: 6.8,
      requiredNutrients: 'High Potash and Phosphorus; low un-decomposed manure to prevent root branching.',
      soilPrepInstructions: [
        'Deep plowing 30 cm to remove all stones, clods, and hardpans.',
        'Apply only fully decomposed compost (fresh manure causes forking/splitting of roots).'
      ]
    },
    weatherReq: {
      tempRange: '15°C – 22°C',
      requiredHumidity: '60% – 70%',
      minHumidity: 50,
      maxHumidity: 75,
      rainfallMm: '350 – 500 mm',
      sunlightRequirements: 'Full sunlight for carotene synthesis'
    },
    plantingGuide: {
      landPrep: 'Raise flat beds or broad ridges with super fine tilth.',
      soilPrep: 'Rake thoroughly to eliminate hard lumps.',
      seedSelection: 'Asiatic (Pusa Kesar, Pusa Meghali) or European (Nantes, Kuroda).',
      seedTreatment: 'Rub seeds to remove bristles; treat with Trichoderma.',
      plantingMethod: 'Direct line sowing on ridges or flat beds.',
      plantingDepth: '1.0 to 1.5 cm.',
      spacing: '25–30 cm between rows, thin to 6–8 cm between plants.',
      bestTime: 'October in plains, March–July in hills.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 6–8 days; light uniform moisture.',
      approxWaterRequirement: '350 – 450 mm',
      criticalStages: ['Germination', 'Root elongation', 'Root thickening'],
      overwateringWarning: 'Cracked roots, rotting, and pale orange color.',
      underwateringWarning: 'Hard, woody, pungent roots.'
    },
    fertilizerGuide: {
      npkRatio: '60:40:80 kg/ha',
      organicRecommendations: ['8 tonnes well-rotted FYM', '250 kg Vermicompost'],
      chemicalRecommendations: ['SSP', 'Urea', 'MOP'],
      quantityGuidance: 'High Potash is essential for root length, sugar sweetness, and vibrant red/orange hue.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full P, Half K, Half N', timing: 'At bed preparation', notes: 'Deeply mixed.' },
        { stage: 'Thinning (Day 30)', fertilizer: 'Half N + Half K', timing: 'Day 30', notes: 'Applied during thinning.' }
      ]
    },
    growthTimeline: [
      { name: 'Germination', stageNumber: 1, daysRange: 'Day 0–10', durationDays: 10, care: 'Carrot seeds germinate slowly; keep bed damp.', water: 'Gentle sprinkle daily.', fertilizer: 'None.', warnings: 'Crusted surface prevents emergence.' },
      { name: 'Seedling & Thinning', stageNumber: 2, daysRange: 'Day 11–30', durationDays: 20, care: 'Crucial thinning at 25 days to 8 cm spacing.', water: 'Every 5 days.', fertilizer: 'Top dress remaining N & K.', warnings: 'Overcrowded carrots stay thin pencil-size.' },
      { name: 'Root Elongation', stageNumber: 3, daysRange: 'Day 31–55', durationDays: 25, care: 'Weed carefully; earth up exposed root crowns.', water: 'Maintain constant moisture.', fertilizer: 'Foliar spray Boron 0.1%.', warnings: 'Sunlight on root shoulder causes greening.' },
      { name: 'Root Bulking & Sugar', stageNumber: 4, daysRange: 'Day 56–80', durationDays: 25, care: 'Roots thicken into conical shape.', water: 'Avoid heavy flood after dry spell.', fertilizer: 'None.', warnings: 'Moisture fluctuations crack roots.' },
      { name: 'Harvesting', stageNumber: 5, daysRange: 'Day 81–100', durationDays: 20, care: 'Irrigate field 24 hrs prior to ease pulling roots intact.', water: 'Pre-harvest soak.', fertilizer: 'None.', warnings: 'Overstaying in field makes roots fibrous and core pithy.' }
    ],
    pestDiseases: [
      {
        name: 'Alternaria Leaf Blight (Alternaria dauci)',
        type: 'disease',
        symptoms: ['Brown-black water-soaked lesions with yellow halos on leaf margins', 'Tops turn brown and die'],
        causes: 'Fungus favored by warm humid weather and overhead irrigation.',
        prevention: 'Wide row spacing for air movement; crop rotation with non-umbelliferous crops.',
        ipmControls: {
          biological: 'Seed treatment with Pseudomonas fluorescens (10 g/kg).',
          organic: 'Foliar spray copper hydroxide @ 2 g/L.',
          mechanical: 'Avoid wetting foliage in late evening.',
          chemical: { activeIngredient: 'Mancozeb 75% WP @ 2 g/L', usage: 'At initial foliar spotting', phiDays: 7, ppe: 'Protective mask and gloves' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 8,
      maxPerAcre: 14,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Asiatic varieties produce 10–12 tonnes/acre in northern winter plains.'
    },
    economics: {
      defaultSeedCost: 2200,
      defaultFertilizerCost: 6000,
      defaultLaborCost: 14000,
      defaultIrrigationCost: 2800,
      defaultOtherCost: 3500,
      defaultSellingPricePerKg: 20,
      defaultYieldKgPerAcre: 10000
    }
  }
];
