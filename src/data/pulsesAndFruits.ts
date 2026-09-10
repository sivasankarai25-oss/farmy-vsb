import { Crop } from '../types';

export const pulsesAndFruitCrops: Crop[] = [
  {
    id: 'chickpea',
    name: 'Chickpea (Bengal Gram / Chana)',
    tamilName: 'கொண்டைக்கடலை',
    hindiName: 'चना',
    scientificName: 'Cicer arietinum',
    category: 'pulse',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80',
    description: 'Premier legume crop that fixes atmospheric nitrogen, enriches soil health, and yields protein-dense pulses.',
    bestSeason: {
      months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      seasonName: 'Rabi (Winter)',
      idealTempMin: 14,
      idealTempMax: 26,
    },
    soilReq: {
      suitableSoilTypes: ['Black', 'Loamy', 'Alluvial', 'Clay'],
      idealPhMin: 6.0,
      idealPhMax: 7.8,
      requiredNutrients: 'High Phosphorus for root nodulation; low nitrogen requirement due to biological N2 fixation.',
      soilPrepInstructions: ['Rough, cloddy seedbed (avoids crusting and facilitates root aeration)', 'Plank lightly']
    },
    weatherReq: {
      tempRange: '14°C – 26°C',
      requiredHumidity: '40% – 60%',
      minHumidity: 30,
      maxHumidity: 65,
      rainfallMm: '350 – 500 mm',
      sunlightRequirements: 'Cool crisp dry weather'
    },
    plantingGuide: {
      landPrep: 'Conserve residual moisture after kharif crop harvest.',
      soilPrep: 'Avoid fine powdery tilth; chickpea prefers loose cloddy soil for aeration.',
      seedSelection: 'Desi (JG-11, JAKI 9218) or Kabuli (KAK-2, Dollar Chana).',
      seedTreatment: 'Rhizobium leguminosarum + PSB culture + Trichoderma.',
      plantingMethod: 'Drilling with seed drill.',
      plantingDepth: '7 to 10 cm (deep sowing places seed in moist zone and escapes Fusarium wilt).',
      spacing: '30 cm x 10 cm.',
      bestTime: 'Mid-October to early November.'
    },
    waterMgmt: {
      level: 'Low',
      recommendedFrequency: '1–2 light irrigations if winter rains fail.',
      approxWaterRequirement: '250 – 350 mm',
      criticalStages: ['Pre-flowering (Day 45)', 'Pod development (Day 75)'],
      overwateringWarning: 'Excess water causes vegetative overgrowth and deadly collar/root rot.',
      underwateringWarning: 'Severe moisture deficit drops flowers.'
    },
    fertilizerGuide: {
      npkRatio: '20:40:20 kg/ha',
      organicRecommendations: ['Rhizobium culture 200g/acre', 'PSB 200g/acre', '5 tonnes FYM'],
      chemicalRecommendations: ['DAP (provides starter N and needed P)', 'MOP'],
      quantityGuidance: 'Starter dose of 20 kg N is sufficient; nodule bacteria fix the rest of the nitrogen naturally.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full DAP + MOP', timing: 'At sowing', notes: 'Band placed below seed line.' },
        { stage: 'Pod filling', fertilizer: 'Foliar spray 2% Urea or DAP', timing: 'Day 75', notes: 'Boosts grain protein and test weight.' }
      ]
    },
    growthTimeline: [
      { name: 'Emergence', stageNumber: 1, daysRange: 'Day 0–7', durationDays: 7, care: 'Strong taproot descends quickly.', water: 'Soil moisture.', fertilizer: 'None.', warnings: 'Cutworms clipping seedlings.' },
      { name: 'Nodulation & Branching', stageNumber: 2, daysRange: 'Day 8–40', durationDays: 32, care: 'Nodule bacteria colonize roots; nip terminal shoots at Day 35 to induce branching (Nipping).', water: 'None.', fertilizer: 'None.', warnings: 'Weed competition in early month.' },
      { name: 'Flowering', stageNumber: 3, daysRange: 'Day 41–65', durationDays: 25, care: 'Pinkish or white flowers bloom.', water: 'Do not flood; light moisture.', fertilizer: 'Boron 0.1% spray.', warnings: 'Gram pod borer egg laying.' },
      { name: 'Pod Setting', stageNumber: 4, daysRange: 'Day 66–90', durationDays: 25, care: 'Pods develop with 1–2 seeds.', water: 'Light irrigation if needed.', fertilizer: 'Foliar DAP 2%.', warnings: 'Helicoverpa borer holes.' },
      { name: 'Maturity & Harvest', stageNumber: 5, daysRange: 'Day 91–110', durationDays: 20, care: 'Leaves turn bronze-yellow and shed; pods rattle when shaken.', water: 'None.', fertilizer: 'None.', warnings: 'Harvest before pods shatter in hot sun.' }
    ],
    pestDiseases: [
      {
        name: 'Gram Pod Borer (Helicoverpa armigera)',
        type: 'pest',
        symptoms: ['Caterpillar feeding on leaves, buds, and boring circular holes in green pods', 'Defoliation of branches'],
        causes: 'Nocturnal moth.',
        prevention: 'Intercrop with coriander, mustard, or marigold. Install T-shaped bird perches @ 20/acre.',
        ipmControls: {
          biological: 'Pheromone traps (Helilure) @ 5/acre. HaNPV virus @ 250 LE/acre.',
          organic: 'Spray Neem seed kernel extract (NSKE 5%) at pod initiation.',
          mechanical: 'Shake plants onto cloth to collect and destroy caterpillars.',
          chemical: { activeIngredient: 'Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L', usage: 'Apply when pod damage exceeds economic threshold (1 larva/meter row)', phiDays: 14, ppe: 'Full PPE' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 0.7,
      maxPerAcre: 1.4,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Well-managed rainfed/irrigated crops produce 0.9–1.2 tonnes/acre.'
    },
    economics: {
      defaultSeedCost: 2800,
      defaultFertilizerCost: 2200,
      defaultLaborCost: 5000,
      defaultIrrigationCost: 1200,
      defaultOtherCost: 1800,
      defaultSellingPricePerKg: 65,
      defaultYieldKgPerAcre: 1000
    }
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    tamilName: 'நிலக்கடலை',
    hindiName: 'मूंगफली',
    scientificName: 'Arachis hypogaea',
    category: 'pulse',
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80',
    description: 'Major oilseed and leguminous food crop known for underground geocarpic pod development.',
    bestSeason: {
      months: ['Jun', 'Jul', 'Jan', 'Feb'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 22,
      idealTempMax: 32,
    },
    soilReq: {
      suitableSoilTypes: ['Sandy', 'Red', 'Loamy', 'Alluvial'],
      idealPhMin: 6.0,
      idealPhMax: 7.2,
      requiredNutrients: 'High Gypsum (Calcium for pod filling & shell hardening, Sulphur for oil synthesis).',
      soilPrepInstructions: [
        'Light, friable, loose sandy loam so pegs can penetrate underground without obstruction.',
        'Apply Gypsum @ 200 kg/acre at flowering/pegging stage.'
      ]
    },
    weatherReq: {
      tempRange: '22°C – 32°C',
      requiredHumidity: '50% – 70%',
      minHumidity: 45,
      maxHumidity: 75,
      rainfallMm: '500 – 700 mm',
      sunlightRequirements: 'Warm sunshine'
    },
    plantingGuide: {
      landPrep: 'Tillage to 15 cm; heavy clay is unsuitable as it compacts pegs.',
      soilPrep: 'Incorporate 5 tonnes FYM/acre.',
      seedSelection: 'Bunch type (TMV-2, JL-24, TAG-24, Kadiri-6) or spreading type.',
      seedTreatment: 'Rhizobium + Trichoderma viride 4g/kg kernel.',
      plantingMethod: 'Direct dibbling in furrows or broad bed furrows.',
      plantingDepth: '5 cm deep in moist sand/loam.',
      spacing: '30 cm x 10 cm.',
      bestTime: 'June–July for Kharif or January for irrigated Rabi.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Every 8–10 days; 4–6 irrigations for rabi crop.',
      approxWaterRequirement: '450 – 550 mm',
      criticalStages: ['Flowering', 'Peg penetration (CRITICAL)', 'Pod development'],
      overwateringWarning: 'Aflatoxin fungus (Aspergillus) and pod rotting.',
      underwateringWarning: 'Soil hardening prevents pegs from entering ground (causes pops/empty pods).'
    },
    fertilizerGuide: {
      npkRatio: '25:50:75 kg/ha + 400 kg Gypsum/ha',
      organicRecommendations: ['5 tonnes FYM', 'Neem cake 100 kg'],
      chemicalRecommendations: ['DAP', 'MOP', 'Agricultural Gypsum (essential)'],
      quantityGuidance: 'Gypsum application at Day 40–45 supplies Calcium directly to the subterranean pods.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full N, P, K + Half Gypsum', timing: 'At sowing', notes: 'Incorporate into root zone.' },
        { stage: 'Pegging (Day 40–45)', fertilizer: 'Remaining Half Gypsum (200 kg/acre)', timing: 'At earthing up', notes: 'Broadcast near base before light earthing-up.' }
      ]
    },
    growthTimeline: [
      { name: 'Emergence', stageNumber: 1, daysRange: 'Day 0–8', durationDays: 8, care: 'Watch for even seedling rows.', water: 'Sowing moisture.', fertilizer: 'None.', warnings: 'Collar rot.' },
      { name: 'Vegetative Growth', stageNumber: 2, daysRange: 'Day 9–30', durationDays: 22, care: 'Weed thoroughly; keep soil surface friable.', water: 'Irrigate at Day 25.', fertilizer: 'None.', warnings: 'Leaf miner.' },
      { name: 'Flowering & Pegging', stageNumber: 3, daysRange: 'Day 31–55', durationDays: 25, care: 'Yellow flowers bloom, pollinate, and push gynophores (pegs) downward into soil.', water: 'Keep soil soft for peg entry.', fertilizer: 'Apply Gypsum.', warnings: 'Hard crusted dry soil breaks pegs.' },
      { name: 'Pod Development', stageNumber: 4, daysRange: 'Day 56–85', durationDays: 30, care: 'Pods swell underground; do not disturb soil after pegs enter.', water: 'Uniform moisture.', fertilizer: 'Micronutrient foliar spray.', warnings: 'Tikka leaf spot.' },
      { name: 'Maturity & Harvest', stageNumber: 5, daysRange: 'Day 86–110', durationDays: 25, care: 'Inner pod shell develops brown/black veined lining. Pull plants or dig with blade.', water: 'Light irrigation 2 days before pulling.', fertilizer: 'None.', warnings: 'Dry pods immediately to <9% moisture to prevent Aflatoxin.' }
    ],
    pestDiseases: [
      {
        name: 'Tikka Disease (Cercospora leaf spot)',
        type: 'disease',
        symptoms: ['Circular dark brown spots surrounded by a distinct bright yellow halo on leaves', 'Premature severe defoliation'],
        causes: 'Fungus spreading during warm humid monsoon weather.',
        prevention: 'Crop rotation; remove weed hosts; balanced potash nutrition.',
        ipmControls: {
          biological: 'Spray Pseudomonas fluorescens @ 5 g/L.',
          organic: 'Spray Neem oil @ 3 ml/L or Bordeaux mixture 1%.',
          mechanical: 'Destroy infected crop debris after harvest.',
          chemical: { activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP (SAAF) @ 2 g/L', usage: 'Spray when first leaf spots are detected', phiDays: 20, ppe: 'Mask and rubber gloves' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 1.0,
      maxPerAcre: 1.8,
      unit: 'tonnes (pod)/acre',
      benchmarkNotes: 'Irrigated rabi groundnut produces 1.4–1.8 tonnes/acre of plump two-seeded pods.'
    },
    economics: {
      defaultSeedCost: 4500,
      defaultFertilizerCost: 4000,
      defaultLaborCost: 8500,
      defaultIrrigationCost: 2000,
      defaultOtherCost: 2500,
      defaultSellingPricePerKg: 55,
      defaultYieldKgPerAcre: 1400
    }
  },
  {
    id: 'greengram',
    name: 'Green Gram (Moong Dal)',
    tamilName: 'பாசிப்பயறு',
    hindiName: 'मूंग',
    scientificName: 'Vigna radiata',
    category: 'pulse',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80',
    description: 'Short-duration (60–70 days) catch crop, ideal for summer fallow and intercropping.',
    bestSeason: {
      months: ['Mar', 'Apr', 'Jun', 'Jul', 'Sep', 'Oct'],
      seasonName: 'Zaid (Summer)',
      idealTempMin: 25,
      idealTempMax: 35,
    },
    soilReq: {
      suitableSoilTypes: ['Loamy', 'Alluvial', 'Sandy', 'Red'],
      idealPhMin: 6.2,
      idealPhMax: 7.5,
      requiredNutrients: 'Low Nitrogen, responsive to Phosphorus and Rhizobium.',
      soilPrepInstructions: ['One plowing and harrowing for loose crumbly tilth']
    },
    weatherReq: {
      tempRange: '25°C – 35°C',
      requiredHumidity: '50% – 65%',
      minHumidity: 40,
      maxHumidity: 70,
      rainfallMm: '350 – 500 mm',
      sunlightRequirements: 'Full sunlight'
    },
    plantingGuide: {
      landPrep: 'Zero till or minimal till in wheat/rice stubbles.',
      soilPrep: 'Conserve moisture.',
      seedSelection: 'Yellow Mosaic Virus resistant varieties (IPM 0203, Samrat, Pusa Vishal).',
      seedTreatment: 'Rhizobium phaseoli + Trichoderma.',
      plantingMethod: 'Line sowing with seed drill.',
      plantingDepth: '3 to 4 cm.',
      spacing: '30 cm x 10 cm.',
      bestTime: 'March–April for summer moong; July for kharif.'
    },
    waterMgmt: {
      level: 'Low',
      recommendedFrequency: '2–3 irrigations in summer; rainfed in monsoon.',
      approxWaterRequirement: '250 – 300 mm',
      criticalStages: ['Branching', 'Pod filling'],
      overwateringWarning: 'Excess water leads to yellowing and fungal wilt.',
      underwateringWarning: 'Pod shriveling.'
    },
    fertilizerGuide: {
      npkRatio: '20:40:20 kg/ha',
      organicRecommendations: ['Rhizobium bio-inoculant', 'PSB'],
      chemicalRecommendations: ['DAP', 'MOP'],
      quantityGuidance: 'Single basal dose of DAP supplies all necessary nitrogen and phosphorus.',
      applicationSchedule: [
        { stage: 'Basal', fertilizer: 'Full DAP + MOP', timing: 'At sowing', notes: 'Band placement.' },
        { stage: 'Foliar', fertilizer: '2% DAP or 19:19:19', timing: 'At flowering (Day 35)', notes: 'Foliar spray to prevent pod drop.' }
      ]
    },
    growthTimeline: [
      { name: 'Emergence', stageNumber: 1, daysRange: 'Day 0–4', durationDays: 4, care: 'Fast germination.', water: 'Soil moisture.', fertilizer: 'None.', warnings: 'Flea beetles.' },
      { name: 'Vegetative', stageNumber: 2, daysRange: 'Day 5–25', durationDays: 20, care: 'One hand weeding.', water: 'First irrigation at Day 20.', fertilizer: 'None.', warnings: 'Whiteflies.' },
      { name: 'Flowering', stageNumber: 3, daysRange: 'Day 26–40', durationDays: 15, care: 'Yellow flowers bloom profusely.', water: 'Second irrigation.', fertilizer: 'Foliar spray.', warnings: 'MYMV symptoms.' },
      { name: 'Pod Maturation & Harvest', stageNumber: 4, daysRange: 'Day 41–65', durationDays: 25, care: 'Pods turn brownish black. Pick pods in 2 rounds or harvest whole plant.', water: 'None.', fertilizer: 'None.', warnings: 'Pod shattering if harvest is delayed.' }
    ],
    pestDiseases: [
      {
        name: 'Mungbean Yellow Mosaic Virus (MYMV)',
        type: 'disease',
        symptoms: ['Mottled yellow and green patches on leaves', 'Leaves turn completely yellow and dry', 'Fewer, smaller seeds'],
        causes: 'Virus transmitted by whitefly (Bemisia tabaci).',
        prevention: 'Cultivate resistant varieties like IPM 2-3. Install yellow sticky cards.',
        ipmControls: {
          biological: 'Conserve natural predators.',
          organic: 'Neem oil @ 5 ml/L spray.',
          mechanical: 'Yellow sticky traps @ 10/acre.',
          chemical: { activeIngredient: 'Thiamethoxam 25% WG @ 0.3 g/L', usage: 'For whitefly control upon first detection', phiDays: 14, ppe: 'Gloves, mask' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 0.4,
      maxPerAcre: 0.8,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Summer moong produces 0.5–0.7 tonnes/acre in just 60 days.'
    },
    economics: {
      defaultSeedCost: 1200,
      defaultFertilizerCost: 1500,
      defaultLaborCost: 3500,
      defaultIrrigationCost: 1000,
      defaultOtherCost: 1200,
      defaultSellingPricePerKg: 75,
      defaultYieldKgPerAcre: 550
    }
  },
  {
    id: 'banana',
    name: 'Banana',
    tamilName: 'வாழை',
    hindiName: 'केला',
    scientificName: 'Musa acuminata',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    description: 'High-yielding perennial fruit crop cultivated for nutritious fruit bunches and versatile leaves.',
    bestSeason: {
      months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      seasonName: 'Year-Round',
      idealTempMin: 22,
      idealTempMax: 35,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Loamy', 'Clay', 'Black'],
      idealPhMin: 6.5,
      idealPhMax: 7.5,
      requiredNutrients: 'Extremely high Potassium demand for bunch weight and finger length, high Nitrogen.',
      soilPrepInstructions: [
        'Dig planting pits of 60 cm x 60 cm x 60 cm.',
        'Fill pits with 15 kg well-rotted FYM, 250 g neem cake, and topsoil.'
      ]
    },
    weatherReq: {
      tempRange: '22°C – 35°C',
      requiredHumidity: '70% – 85%',
      minHumidity: 60,
      maxHumidity: 90,
      rainfallMm: '1200 – 1800 mm',
      sunlightRequirements: 'Full tropical sun with windbreak protection'
    },
    plantingGuide: {
      landPrep: 'Leveling and installation of drip fertigation lines.',
      soilPrep: 'Pit preparation with organic inputs.',
      seedSelection: 'Tissue culture disease-free plantlets (Grand Naine - G9) or healthy sword suckers (1.5–2.0 kg).',
      seedTreatment: 'Dip sucker corm in Carbendazim (2g/L) + Chlorpyriphos (2ml/L) for 15 mins.',
      plantingMethod: 'Plant in pit center, firming soil firmly around corm.',
      plantingDepth: 'Level with soil collar.',
      spacing: '1.8 m x 1.8 m (Grand Naine) or 2.1 m x 2.1 m (Robusta/Poovan).',
      bestTime: 'June–July with monsoon or September–October.'
    },
    waterMgmt: {
      level: 'High',
      recommendedFrequency: 'Drip irrigation 15–20 liters/plant/day.',
      approxWaterRequirement: '1500 – 2000 mm',
      criticalStages: ['Vegetative growth', 'Shooting (bunch emergence)', 'Finger development'],
      overwateringWarning: 'Waterlogging suffocates root mats and triggers Panama wilt.',
      underwateringWarning: 'Choked bunches that fail to emerge smoothly from pseudostem.'
    },
    fertilizerGuide: {
      npkRatio: '200:50:300 g/plant/cycle',
      organicRecommendations: ['15 kg FYM/plant', '1 kg Neem cake', 'Arka Microbial Consortium'],
      chemicalRecommendations: ['Urea', 'SSP/DAP', 'Muriate of Potash (MOP)'],
      quantityGuidance: 'High Potash is non-negotiable; split fertilizer into 4–5 equal monthly doses.',
      applicationSchedule: [
        { stage: '2nd Month', fertilizer: '50g N, 50g P, 50g K', timing: 'Month 2', notes: 'Band around plant basin.' },
        { stage: '4th Month', fertilizer: '50g N, 75g K', timing: 'Month 4', notes: 'Active pseudostem thickening.' },
        { stage: '6th Month', fertilizer: '50g N, 100g K', timing: 'Month 6', notes: 'Shooting initiation.' },
        { stage: 'Shooting (Bunch emergence)', fertilizer: '50g N, 75g K', timing: 'Month 8–9', notes: 'Finger elongation and sweetness.' }
      ]
    },
    growthTimeline: [
      { name: 'Establishment', stageNumber: 1, daysRange: 'Month 1–2', durationDays: 60, care: 'Keep basin weed-free, desucker regularly.', water: 'Daily drip 10L.', fertilizer: 'Basal and 2nd month dose.', warnings: 'Aphids transmitting bunchy top.' },
      { name: 'Rapid Vegetative', stageNumber: 2, daysRange: 'Month 3–6', durationDays: 120, care: 'Broad leaves unfold rapidly (up to 30 leaves). Remove side suckers (desuckering).', water: '15L/day.', fertilizer: 'Monthly N-K doses.', warnings: 'Pseudostem borer.' },
      { name: 'Shooting (Flowering)', stageNumber: 3, daysRange: 'Month 7–9', durationDays: 90, care: 'Large purple inflorescence (bell) emerges and bends down.', water: '20L/day.', fertilizer: 'High Potash.', warnings: 'Denavelling (remove male bud after bunch completes) to add 10% bunch weight.' },
      { name: 'Bunch Development', stageNumber: 4, daysRange: 'Month 10–11', durationDays: 60, care: 'Cover bunch with blue polypropylene sleeve; prop with double bamboo poles to prevent toppling.', water: '15L/day.', fertilizer: 'Foliar Potassium spray.', warnings: 'Wind damage and sun scorching.' },
      { name: 'Harvesting', stageNumber: 5, daysRange: 'Month 12–13', durationDays: 60, care: 'Harvest bunches when angles disappear and fingers turn round plump.', water: 'Reduce 7 days before cut.', fertilizer: 'None.', warnings: 'Handle with padded foam to prevent latex stains and bruising.' }
    ],
    pestDiseases: [
      {
        name: 'Sigatoka Leaf Spot (Mycosphaerella musicola)',
        type: 'disease',
        symptoms: ['Spindle-shaped brown streaks with grey centers and dark margins on leaves', 'Premature ripening of sour, undersized fruit'],
        causes: 'Airborne fungal spores during warm humid rainy weather.',
        prevention: 'Prune dry leaves and burn. Ensure good plantation drainage.',
        ipmControls: {
          biological: 'Spray Pseudomonas fluorescens @ 5 g/L.',
          organic: 'Spray mineral oil / banana spray oil (1%) + copper fungicide.',
          mechanical: 'Cut and burn heavily spotted lower leaves.',
          chemical: { activeIngredient: 'Propiconazole 25% EC @ 1 ml/L mixed with mineral oil', usage: 'Apply during monsoon leaf infection periods', phiDays: 30, ppe: 'Full protective gear' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 28,
      maxPerAcre: 45,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Tissue-culture Grand Naine yields 35–40 tonnes/acre with average bunch weights of 25–30 kg.'
    },
    economics: {
      defaultSeedCost: 18000,
      defaultFertilizerCost: 28000,
      defaultLaborCost: 35000,
      defaultIrrigationCost: 6000,
      defaultOtherCost: 10000,
      defaultSellingPricePerKg: 16,
      defaultYieldKgPerAcre: 35000
    }
  },
  {
    id: 'mango',
    name: 'Mango',
    tamilName: 'மாம்பழம்',
    hindiName: 'आम',
    scientificName: 'Mangifera indica',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    description: 'The "King of Fruits", an orchard crop prized for rich aroma, luscious pulp, and high export value.',
    bestSeason: {
      months: ['Jul', 'Aug', 'Sep', 'Oct'],
      seasonName: 'Kharif (Monsoon)',
      idealTempMin: 24,
      idealTempMax: 36,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Red', 'Loamy', 'Laterite'],
      idealPhMin: 5.5,
      idealPhMax: 7.5,
      requiredNutrients: 'Deep soil (>2 meters) without hardpan; balanced NPK with Boron and Zinc.',
      soilPrepInstructions: ['Dig pits 1m x 1m x 1m', 'Fill with 30 kg FYM + 2 kg SSP + 500 g neem cake']
    },
    weatherReq: {
      tempRange: '24°C – 36°C',
      requiredHumidity: '50% – 65%',
      minHumidity: 40,
      maxHumidity: 70,
      rainfallMm: '750 – 1200 mm',
      sunlightRequirements: 'Requires dry rainless period during flowering (Dec–Feb)'
    },
    plantingGuide: {
      landPrep: 'Contour bunding in slopes or square/hexagonal planting grid.',
      soilPrep: 'Pit seasoning in sun for 3 weeks before filling.',
      seedSelection: 'Grafted plants (Alphonso, Dasheri, Kesar, Banganapalli, Totapuri).',
      seedTreatment: 'Dip graft root ball in Trichoderma and mycorrhiza.',
      plantingMethod: 'Plant graft union 5 cm above soil surface.',
      plantingDepth: 'Soil collar level.',
      spacing: '5 m x 5 m (High Density) or 10 m x 10 m (Traditional).',
      bestTime: 'July–August during rainy season.'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Young trees: weekly; Mature bearing trees: withhold water in autumn to induce flowering.',
      approxWaterRequirement: '700 – 1000 mm',
      criticalStages: ['Fruit set (pea size)', 'Fruit enlargement (marble to egg size)'],
      overwateringWarning: 'Watering during October–November triggers vegetative flush instead of flowering.',
      underwateringWarning: 'Severe fruit drop during hot March–April winds.'
    },
    fertilizerGuide: {
      npkRatio: '1000:500:1000 g NPK per mature tree/year',
      organicRecommendations: ['50 kg FYM/tree', '5 kg Neem cake', 'Bio-fertilizers'],
      chemicalRecommendations: ['Urea', 'SSP', 'MOP', 'Borax spray 0.2%'],
      quantityGuidance: 'Apply post-harvest in July–August; foliar spray micronutrients at flower bud break.',
      applicationSchedule: [
        { stage: 'Post-Harvest (July)', fertilizer: 'Full FYM + 50% N + 100% P + 50% K', timing: 'July–Aug', notes: 'Trench around canopy drip-line.' },
        { stage: 'Fruit Set (Pea stage)', fertilizer: '50% N + 50% K', timing: 'Feb–March', notes: 'Supports fast fruit swelling.' }
      ]
    },
    growthTimeline: [
      { name: 'Flowering', stageNumber: 1, daysRange: 'Jan–Feb', durationDays: 45, care: 'Panicles emerge with thousands of blossoms.', water: 'Withhold irrigation until fruit sets.', fertilizer: 'None.', warnings: 'Mango hopper and powdery mildew.' },
      { name: 'Fruit Set (Pea to Marble)', stageNumber: 2, daysRange: 'Feb–March', durationDays: 30, care: 'Pollination completes; tiny fruits form.', water: 'Resume regular irrigation.', fertilizer: 'Spray Boron 0.2% + Planofix.', warnings: 'Heavy natural fruit drop.' },
      { name: 'Fruit Enlargement', stageNumber: 3, daysRange: 'March–April', durationDays: 45, care: 'Fruit expands rapidly.', water: 'Irrigate every 10 days.', fertilizer: 'Potassium spray.', warnings: 'Sunburn and fruit fly oviposition.' },
      { name: 'Harvesting', stageNumber: 4, daysRange: 'April–June', durationDays: 45, care: 'Harvest at tapka (shoulder raised) maturity using pole harvester with net bag.', water: 'Stop irrigation 10 days prior.', fertilizer: 'None.', warnings: 'Do not snap fruits roughly; leave 1 cm pedicel to avoid sap burn.' }
    ],
    pestDiseases: [
      {
        name: 'Mango Hopper (Amritodus atkinsoni)',
        type: 'pest',
        symptoms: ['Thousands of wedge-shaped nymphs and adults sucking sap from flower panicles', 'Panicles wither and turn black', 'Honeydew secretion followed by sooty mold'],
        causes: 'Pest proliferating during flower flush in cloudy humid weather.',
        prevention: 'Prune overcrowded inner branches to allow sunlight penetration.',
        ipmControls: {
          biological: 'Conserve predatory spiders and Chrysoperla.',
          organic: 'Spray Neem oil @ 5 ml/L or Fish oil rosin soap.',
          mechanical: 'Prune infected canopy.',
          chemical: { activeIngredient: 'Imidacloprid 17.8% SL @ 0.3 ml/L', usage: 'Single targeted spray before flower buds open', phiDays: 30, ppe: 'Full PPE with respirator' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 4,
      maxPerAcre: 8,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Mature orchards (8+ years) produce 5–7 tonnes/acre of premium dessert fruit.'
    },
    economics: {
      defaultSeedCost: 8000,
      defaultFertilizerCost: 12000,
      defaultLaborCost: 18000,
      defaultIrrigationCost: 3500,
      defaultOtherCost: 5000,
      defaultSellingPricePerKg: 40,
      defaultYieldKgPerAcre: 6000
    }
  },
  {
    id: 'papaya',
    name: 'Papaya',
    tamilName: 'பப்பாளி',
    hindiName: 'पपीता',
    scientificName: 'Carica papaya',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
    description: 'Fast-bearing herbaceous tropical fruit that begins yielding heavy sweet fruit within 9–10 months.',
    bestSeason: {
      months: ['Feb', 'Mar', 'Jun', 'Jul', 'Sep', 'Oct'],
      seasonName: 'Year-Round',
      idealTempMin: 22,
      idealTempMax: 35,
    },
    soilReq: {
      suitableSoilTypes: ['Alluvial', 'Loamy', 'Sandy', 'Red'],
      idealPhMin: 6.0,
      idealPhMax: 7.0,
      requiredNutrients: 'Rich in organic humus, sensitive to excess salinity and water stagnation.',
      soilPrepInstructions: [
        'Form raised mounds or beds 30 cm high.',
        'Zero waterlogging tolerance: even 24 hours of standing water causes stem collar rot.'
      ]
    },
    weatherReq: {
      tempRange: '22°C – 35°C',
      requiredHumidity: '60% – 75%',
      minHumidity: 50,
      maxHumidity: 80,
      rainfallMm: '1000 – 1500 mm',
      sunlightRequirements: 'Full tropical sun; protect from fierce frost and gale winds'
    },
    plantingGuide: {
      landPrep: 'Ensure slope drainage channels.',
      soilPrep: 'Pit 50 cm x 50 cm x 50 cm filled with 10 kg compost + 250 g bone meal.',
      seedSelection: 'Gynodioecious (hermaphrodite) hybrids like Red Lady 786, Taiwan-1, Pusa Delicious.',
      seedTreatment: 'Soak seeds 24 hours, treat with Captan 2g/kg.',
      plantingMethod: 'Transplant 45-day polybag seedlings.',
      plantingDepth: 'Same level as polybag.',
      spacing: '2.1 m x 2.1 m or 1.8 m x 1.8 m.',
      bestTime: 'Spring (Feb–March) or Monsoon (June–July).'
    },
    waterMgmt: {
      level: 'Medium',
      recommendedFrequency: 'Drip irrigation every 1–2 days; ring basin method (keep water away from trunk).',
      approxWaterRequirement: '800 – 1000 mm',
      criticalStages: ['Flowering', 'Continuous fruit load'],
      overwateringWarning: 'Pythium collar rot kills tree within days if water touches stem.',
      underwateringWarning: 'Leaves drop, fruits remain small and fail to sweeten.'
    },
    fertilizerGuide: {
      npkRatio: '250:250:500 g NPK per tree/year',
      organicRecommendations: ['10 kg FYM/plant', 'Neem cake 500 g', 'Mycorrhiza'],
      chemicalRecommendations: ['Urea', 'SSP', 'MOP', 'Borax 10 g/plant'],
      quantityGuidance: 'Apply bimonthly in split doses around the tree perimeter.',
      applicationSchedule: [
        { stage: 'Month 2', fertilizer: '50g N, 50g P, 50g K', timing: 'Month 2', notes: 'Ring placement 30 cm from trunk.' },
        { stage: 'Month 4', fertilizer: '50g N, 50g P, 100g K', timing: 'Month 4', notes: 'Pre-flowering push.' },
        { stage: 'Month 6', fertilizer: '50g N, 50g P, 150g K', timing: 'Month 6', notes: 'Fruit set and sweetening.' },
        { stage: 'Month 8+', fertilizer: '50g N, 50g P, 150g K', timing: 'Every 2 months', notes: 'Sustains continuous production.' }
      ]
    },
    growthTimeline: [
      { name: 'Seedling', stageNumber: 1, daysRange: 'Month 1–2', durationDays: 60, care: 'Raise in 50-mesh net house to keep aphid-free.', water: 'Sprinkler.', fertilizer: 'Vermicompost.', warnings: 'Damping off.' },
      { name: 'Transplanting', stageNumber: 2, daysRange: 'Month 2–3', durationDays: 30, care: 'Plant on mounds.', water: 'Immediate drip.', fertilizer: 'Basal.', warnings: 'Water accumulation at base.' },
      { name: 'Flowering & Sex Identification', stageNumber: 3, daysRange: 'Month 4–5', durationDays: 45, care: 'Flowers appear in leaf axils (Red Lady is 100% fruitful).', water: 'Regular drip.', fertilizer: 'Borax 0.1% spray.', warnings: 'Papaya Ringspot Virus.' },
      { name: 'Fruit Setting & Thinning', stageNumber: 4, daysRange: 'Month 6–8', durationDays: 60, care: 'Thin deformed or overcrowded fruits to 1–2 per node.', water: 'Steady drip.', fertilizer: 'Potash.', warnings: 'Mealybugs in fruit crevices.' },
      { name: 'Harvesting', stageNumber: 5, daysRange: 'Month 9–20', durationDays: 330, care: 'Harvest when slight yellowing appears at fruit apex (color break).', water: 'Regular.', fertilizer: 'Bimonthly maintenance.', warnings: 'Handle carefully to prevent latex burn on skin.' }
    ],
    pestDiseases: [
      {
        name: 'Papaya Ringspot Virus (PRSV)',
        type: 'disease',
        symptoms: ['Shoestring-like distorted leaves with dark green mosaic blisters', 'Oily water-soaked rings on fruit skin and green petiole streaks', 'Drastic yield collapse'],
        causes: 'Potyvirus transmitted by cotton/melon aphids (Aphis gossypii).',
        prevention: 'Grow 4 border rows of dense maize or sorghum barrier. Raise seedlings under insect nets.',
        ipmControls: {
          biological: 'Conserve coccinellid ladybirds.',
          organic: 'Spray Neem oil (5 ml/L) mixed with detergent every 10 days.',
          mechanical: 'Uproot and bury virus-infected plants immediately to prevent orchard-wide transmission.',
          chemical: { activeIngredient: 'Dimethoate 30% EC @ 1.5 ml/L', usage: 'Spray on aphids and surrounding barrier crops', phiDays: 20, ppe: 'Full PPE' }
        }
      }
    ],
    yieldEstimates: {
      minPerAcre: 25,
      maxPerAcre: 45,
      unit: 'tonnes/acre',
      benchmarkNotes: 'Red Lady hybrid produces 30–40 tonnes/acre over 18–24 months.'
    },
    economics: {
      defaultSeedCost: 7500,
      defaultFertilizerCost: 16000,
      defaultLaborCost: 20000,
      defaultIrrigationCost: 4500,
      defaultOtherCost: 6000,
      defaultSellingPricePerKg: 18,
      defaultYieldKgPerAcre: 32000
    }
  }
];
