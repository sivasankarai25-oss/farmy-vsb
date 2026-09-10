import React, { useState } from 'react';
import { 
  X, Calendar, Droplets, Thermometer, ShieldAlert, Sparkles, 
  TrendingUp, Layers, Compass, CheckCircle2, ChevronRight, 
  Leaf, Info, PlusCircle, Calculator
} from 'lucide-react';
import { Crop } from '../types';
import { Language, translations } from '../utils/translations';

interface CropDetailsModalProps {
  crop: Crop | null;
  onClose: () => void;
  onAddToFarm?: (crop: Crop) => void;
  onCalculateProfit?: (crop: Crop) => void;
  weather?: any;
  language: Language;
}

export const CropDetailsModal: React.FC<CropDetailsModalProps> = ({
  crop,
  onClose,
  onAddToFarm,
  onCalculateProfit,
  weather,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'water' | 'fertilizer' | 'timeline' | 'pests' | 'yield'>('guide');
  const t = translations[language] || translations['en'];

  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Modal Header with Crop Image Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden shrink-0">
          <img
            src={crop.image}
            alt={crop.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors border border-white/20"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & category badges */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-extrabold bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-emerald-400/40">
                {crop.category.toUpperCase()}
              </span>
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/20">
                {crop.bestSeason.seasonName}
              </span>
              {crop.tamilName && language === 'ta' && (
                <span className="text-xs font-bold text-amber-300">
                  {crop.tamilName}
                </span>
              )}
              {crop.hindiName && language === 'hi' && (
                <span className="text-xs font-bold text-amber-300">
                  {crop.hindiName}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {crop.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 italic font-mono">
              {crop.scientificName}
            </p>
          </div>
        </div>

        {/* Action strip: Add to farm / Calculate Profit */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 text-emerald-900 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Expected Yield: <strong>{crop.yieldEstimates.minPerAcre} – {crop.yieldEstimates.maxPerAcre} {crop.yieldEstimates.unit}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onCalculateProfit(crop)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-100/70 border border-emerald-300 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profit Calc</span>
            </button>
            <button
              onClick={() => onAddToFarm(crop)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add to My Farm</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto scrollbar-none px-2 shrink-0">
          {[
            { id: 'guide', label: '1. Planting Guide', icon: Compass },
            { id: 'water', label: '2. Water', icon: Droplets },
            { id: 'fertilizer', label: '3. Fertilizer', icon: Layers },
            { id: 'timeline', label: '4. Growth Timeline', icon: Calendar },
            { id: 'pests', label: '5. Pest Doctor', icon: ShieldAlert },
            { id: 'yield', label: '6. Yield & Economics', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isSelected
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6 text-stone-800">
          {/* TAB 1: PLANTING GUIDE & SOIL / WEATHER REQUIREMENTS */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Summary Description */}
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                {crop.description}
              </p>

              {/* Requirement Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Soil Requirements */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-3">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Soil Requirements</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium">Suitable Soil Types: </span>
                      <span className="font-semibold text-stone-800">{crop.soilReq.suitableSoilTypes.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Ideal pH Range: </span>
                      <span className="font-bold text-emerald-700">{crop.soilReq.idealPhMin} – {crop.soilReq.idealPhMax}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Key Nutrients: </span>
                      <span className="text-stone-700">{crop.soilReq.requiredNutrients}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 mt-2">
                      <span className="font-bold text-stone-700 block mb-1">Soil Preparation:</span>
                      <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                        {crop.soilReq.soilPrepInstructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Weather Requirements */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-3">
                    <Thermometer className="w-4 h-4 text-emerald-600" />
                    <span>Weather & Season</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium">Temperature Range: </span>
                      <span className="font-bold text-stone-800">{crop.weatherReq.tempRange}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Relative Humidity: </span>
                      <span className="text-stone-700">{crop.weatherReq.requiredHumidity}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Annual/Seasonal Rain: </span>
                      <span className="text-stone-700">{crop.weatherReq.rainfallMm}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Sunlight: </span>
                      <span className="text-stone-700">{crop.weatherReq.sunlightRequirements}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium">Planting Months: </span>
                      <span className="font-semibold text-emerald-800">{crop.bestSeason.months.join(', ')} ({crop.bestSeason.seasonName})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8-Step Step-by-Step Planting Guide */}
              <div>
                <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Step-by-Step Planting Protocol</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { step: '1', title: 'Prepare the Land', desc: crop.plantingGuide.landPrep },
                    { step: '2', title: 'Prepare the Soil', desc: crop.plantingGuide.soilPrep },
                    { step: '3', title: 'Seed Selection', desc: crop.plantingGuide.seedSelection },
                    { step: '4', title: 'Seed Treatment', desc: crop.plantingGuide.seedTreatment },
                    { step: '5', title: 'Planting Method', desc: crop.plantingGuide.plantingMethod },
                    { step: '6', title: 'Planting Depth', desc: crop.plantingGuide.plantingDepth },
                    { step: '7', title: 'Plant Spacing', desc: crop.plantingGuide.spacing },
                    { step: '8', title: 'Best Planting Window', desc: crop.plantingGuide.bestTime },
                  ].map(item => (
                    <div key={item.step} className="p-3 bg-white border border-stone-200 rounded-xl flex items-start space-x-3 shadow-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WATER MANAGEMENT */}
          {activeTab === 'water' && (
            <div className="space-y-5">
              {/* Level & frequency overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Water Requirement</span>
                  <span className="text-xl font-extrabold text-sky-950 mt-1 block">{crop.waterMgmt.level}</span>
                  <span className="text-[11px] text-sky-700 mt-0.5 block">{crop.waterMgmt.approxWaterRequirement}</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-center sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Irrigation Frequency</span>
                  <p className="text-xs font-bold text-emerald-950 mt-1">{crop.waterMgmt.recommendedFrequency}</p>
                </div>
              </div>

              {/* Critical Stages */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Critical Irrigation Stages (Water Stress Irreversible Here)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {crop.waterMgmt.criticalStages.map((stg, i) => (
                    <span key={i} className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-sky-300 text-sky-900 shadow-xs flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{stg}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                  <span className="font-extrabold text-amber-900 block mb-1">⚠️ Overwatering Dangers:</span>
                  <p className="text-amber-800 leading-relaxed">{crop.waterMgmt.overwateringWarning}</p>
                </div>
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                  <span className="font-extrabold text-rose-900 block mb-1">⚠️ Underwatering Dangers:</span>
                  <p className="text-rose-800 leading-relaxed">{crop.waterMgmt.underwateringWarning}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FERTILIZER GUIDE */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-5">
              {/* NPK badge */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended NPK Ratio</span>
                  <p className="text-xl font-black text-emerald-950 font-mono mt-0.5">{crop.fertilizerGuide.npkRatio}</p>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-full">
                  Targeted Nutrition
                </span>
              </div>

              {/* Organic vs Chemical breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <h4 className="font-bold text-emerald-800 text-sm mb-2">🌱 Organic Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-stone-700">
                    {crop.fertilizerGuide.organicRecommendations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <h4 className="font-bold text-indigo-900 text-sm mb-2">🧪 Inorganic / Commercial Options</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-stone-700">
                    {crop.fertilizerGuide.chemicalRecommendations.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quantity guidance */}
              <div className="p-3.5 bg-stone-100 rounded-xl text-xs text-stone-800">
                <span className="font-bold block mb-1">Dosing & Safety Guidance:</span>
                <p className="leading-relaxed text-stone-700">{crop.fertilizerGuide.quantityGuidance}</p>
              </div>

              {/* Application Schedule Table */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-2">Stage-by-Stage Application Schedule</h4>
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Growth Stage</th>
                        <th className="p-2.5">Fertilizer & Dose</th>
                        <th className="p-2.5">Timing</th>
                        <th className="p-2.5">Farmer Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {crop.fertilizerGuide.applicationSchedule.map((sched, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold text-stone-900">{sched.stage}</td>
                          <td className="p-2.5 text-emerald-800 font-semibold">{sched.fertilizer}</td>
                          <td className="p-2.5 text-stone-600">{sched.timing}</td>
                          <td className="p-2.5 text-stone-600">{sched.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL GROWTH TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Complete physiological life cycle for {crop.name}. Follow each stage's critical watering, fertilizer, and protection reminders:
              </p>

              <div className="relative pl-6 border-l-2 border-emerald-500 space-y-6">
                {crop.growthTimeline.map((step) => (
                  <div key={step.stageNumber} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white shadow-xs">
                      {step.stageNumber}
                    </div>

                    <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs hover:border-emerald-300 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-stone-900">{step.name}</h4>
                        <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {step.daysRange}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2 text-stone-700">
                        <div>
                          <span className="text-stone-500 font-medium">🌾 Care: </span>
                          <span>{step.care}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 font-medium">💧 Water: </span>
                          <span className="font-semibold text-sky-900">{step.water}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 font-medium">🧪 Fertilizer: </span>
                          <span className="text-emerald-900 font-medium">{step.fertilizer}</span>
                        </div>
                        <div>
                          <span className="text-rose-600 font-medium">⚠️ Warnings: </span>
                          <span className="text-rose-900">{step.warnings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PEST & DISEASE MANAGEMENT */}
          {activeTab === 'pests' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Integrated Pest Management (IPM) Directive:</strong> Always prioritize cultural prevention and biological controls first. Use chemical intervention only when pest crosses economic threshold levels, observing Post-Harvest Intervals (PHI) and mandatory personal protective equipment (PPE).
                </p>
              </div>

              {crop.pestDiseases.map((pd, i) => (
                <div key={i} className="border border-stone-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                        pd.type === 'pest' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pd.type}
                      </span>
                      <span>{pd.name}</span>
                    </h4>
                  </div>

                  <div className="text-xs space-y-1.5 text-stone-700">
                    <div>
                      <span className="font-bold text-stone-800">Visual Symptoms: </span>
                      <span>{pd.symptoms.join('; ')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-800">Root Cause: </span>
                      <span>{pd.causes}</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-800">Cultural Prevention: </span>
                      <span>{pd.prevention}</span>
                    </div>
                  </div>

                  {/* IPM control ladder */}
                  <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <span className="font-bold text-emerald-800 block">Biological / Organic</span>
                      <p className="text-emerald-950 text-[11px] mt-0.5">{pd.ipmControls.organic || pd.ipmControls.biological}</p>
                    </div>

                    <div className="p-2 bg-stone-100 rounded-lg">
                      <span className="font-bold text-stone-800 block">Mechanical / Cultural</span>
                      <p className="text-stone-700 text-[11px] mt-0.5">{pd.ipmControls.mechanical || 'Install sticky/pheromone traps'}</p>
                    </div>

                    {pd.ipmControls.chemical && (
                      <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                        <span className="font-bold text-rose-900 block">Targeted Chemical (Strict IPM)</span>
                        <p className="text-rose-950 text-[11px] mt-0.5">{pd.ipmControls.chemical.activeIngredient}</p>
                        <p className="text-[10px] text-rose-800 mt-1 font-semibold">
                          PHI: {pd.ipmControls.chemical.phiDays} days • PPE: {pd.ipmControls.chemical.ppe}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: YIELD & BENCHMARK ECONOMICS */}
          {activeTab === 'yield' && (
            <div className="space-y-5">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-stone-900 mb-2">Benchmark Acre Yield</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-emerald-700">
                    {crop.yieldEstimates.minPerAcre} – {crop.yieldEstimates.maxPerAcre}
                  </span>
                  <span className="text-sm font-bold text-stone-600">{crop.yieldEstimates.unit}</span>
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {crop.yieldEstimates.benchmarkNotes}
                </p>
              </div>

              {/* Economics Sample Breakdown */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Standard 1-Acre Cost & Revenue Model (Estimates)
                  </h4>
                  <button
                    onClick={() => onCalculateProfit(crop)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                  >
                    <span>Custom Calculator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-[11px] text-stone-500 block">Est. Cost</span>
                    <span className="text-base font-bold text-stone-800 font-mono">
                      ₹{(crop.economics.defaultSeedCost + crop.economics.defaultFertilizerCost + crop.economics.defaultLaborCost + crop.economics.defaultIrrigationCost + crop.economics.defaultOtherCost).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-[11px] text-stone-500 block">Market Price</span>
                    <span className="text-base font-bold text-stone-800 font-mono">
                      ₹{crop.economics.defaultSellingPricePerKg}/kg
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-[11px] text-stone-500 block">Est. Revenue</span>
                    <span className="text-base font-bold text-stone-800 font-mono">
                      ₹{(crop.economics.defaultYieldKgPerAcre * crop.economics.defaultSellingPricePerKg).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[11px] text-emerald-700 font-bold block">Est. Net Profit</span>
                    <span className="text-base font-black text-emerald-800 font-mono">
                      ₹{((crop.economics.defaultYieldKgPerAcre * crop.economics.defaultSellingPricePerKg) - (crop.economics.defaultSeedCost + crop.economics.defaultFertilizerCost + crop.economics.defaultLaborCost + crop.economics.defaultIrrigationCost + crop.economics.defaultOtherCost)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 mt-3 italic">
                  *Figures are regional benchmarks based on standard APMC market averages. Actual profit fluctuates based on wholesale mandi rates, weather conditions, and seasonal supply.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg"
          >
            Back to List
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onCalculateProfit(crop)}
              className="text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-2 rounded-lg transition-colors"
            >
              Calculate Profit
            </button>
            <button
              onClick={() => onAddToFarm(crop)}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plant on My Farm</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
