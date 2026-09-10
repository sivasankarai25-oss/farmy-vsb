import React, { useState } from 'react';
import { 
  Sparkles, Sliders, RefreshCw, CheckCircle2, AlertTriangle, 
  XCircle, ChevronRight, Droplets, Thermometer, MapPin, 
  Layers, Sun, ArrowRight, Check, Compass
} from 'lucide-react';
import { Crop, RecommendationCriteria, SoilType, WaterLevel, SeasonName, SeasonType, SuitabilityResult, WeatherData, SoilReport } from '../types';
import { rankCropsForFarmer } from '../utils/recommendationEngine';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface CropRecommendationProps {
  currentSoilReport?: SoilReport;
  weather?: WeatherData | null;
  location?: string;
  onSelectCrop: (crop: Crop) => void;
  onAddToFarm?: (crop: Crop) => void;
  language: Language;
}

export const CropRecommendation: React.FC<CropRecommendationProps> = ({
  currentSoilReport,
  weather,
  location = 'Coimbatore, Tamil Nadu',
  onSelectCrop,
  onAddToFarm,
  language,
}) => {
  const t = translations[language];

  // Default criteria based on typical farmer profile or current soil report
  const [criteria, setCriteria] = useState<RecommendationCriteria>({
    location,
    soilType: currentSoilReport ? currentSoilReport.soilType : 'Loamy',
    soilPh: currentSoilReport ? currentSoilReport.ph : 6.5,
    soilMoisture: 'Moderate',
    temperature: weather ? Math.round(weather.current.temp) : 28,
    humidity: weather ? weather.current.humidity : 65,
    waterLevel: 'Medium',
    season: 'Kharif (Monsoon)',
  });

  const [results, setResults] = useState<SuitabilityResult[]>(() => 
    rankCropsForFarmer(allCrops, {
      location,
      soilType: currentSoilReport ? currentSoilReport.soilType : 'Loamy',
      soilPh: currentSoilReport ? currentSoilReport.ph : 6.5,
      soilMoisture: 'Moderate',
      temperature: weather ? Math.round(weather.current.temp) : 28,
      humidity: weather ? weather.current.humidity : 65,
      waterLevel: 'Medium',
      season: 'Kharif (Monsoon)',
    })
  );

  const [filterLevel, setFilterLevel] = useState<string>('all');

  const soilTypes: SoilType[] = ['Loamy', 'Clay', 'Sandy', 'Alluvial', 'Black', 'Red', 'Laterite', 'Silt'];
  const waterLevels: WaterLevel[] = ['Low', 'Medium', 'High'];
  const seasons: SeasonName[] = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-Round'];

  const handleApplyCriteria = () => {
    const ranked = rankCropsForFarmer(allCrops, criteria);
    setResults(ranked);
  };

  const handleUseLiveWeather = () => {
    if (!weather) return;
    setCriteria(prev => ({
      ...prev,
      temperature: Math.round(weather.current.temp),
      humidity: weather.current.humidity,
    }));
  };

  const safeResults = results || [];
  const filteredResults = filterLevel === 'all' 
    ? safeResults 
    : safeResults.filter(r => r.level === filterLevel);

  return (
    <div className="space-y-6 pb-20">
      {/* Hero / Header Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Agricultural Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find the Most Profitable & Suitable Crop
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Input your soil type, soil pH test, and water availability. FARMY calculates match scores against 15+ high-yielding crops and alerts you to potential disease or climate risks.
          </p>
        </div>
      </div>

      {/* Input Parameters Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">Your Farm Conditions</h2>
          </div>
          {weather && (
            <button
              onClick={handleUseLiveWeather}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1 transition-colors"
              title="Sync temperature & humidity from weather forecast"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Use Live Weather ({Math.round(weather.current.temp)}°C, {weather.current.humidity}%)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              1. Soil Type
            </label>
            <select
              value={criteria.soilType}
              onChange={(e) => setCriteria({ ...criteria, soilType: e.target.value as SoilType })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {soilTypes.map(st => (
                <option key={st} value={st}>{st} Soil</option>
              ))}
            </select>
          </div>

          {/* Soil pH */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                2. Soil pH
              </label>
              <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                criteria.soilPh < 6.0 ? 'bg-amber-100 text-amber-900' :
                criteria.soilPh > 7.5 ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                pH {criteria.soilPh.toFixed(1)} ({criteria.soilPh < 6.0 ? 'Acidic' : criteria.soilPh > 7.5 ? 'Alkaline' : 'Neutral'})
              </span>
            </div>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={criteria.soilPh}
              onChange={(e) => setCriteria({ ...criteria, soilPh: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Acidic (4.5)</span>
              <span>Neutral (6.5-7.0)</span>
              <span>Alkaline (9.0)</span>
            </div>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              3. Water Availability
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {waterLevels.map(wl => (
                <button
                  key={wl}
                  type="button"
                  onClick={() => setCriteria({ ...criteria, waterLevel: wl })}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    criteria.waterLevel === wl
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {wl}
                </button>
              ))}
            </div>
          </div>

          {/* Current Season */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              4. Target Season
            </label>
            <select
              value={criteria.season}
              onChange={(e) => setCriteria({ ...criteria, season: e.target.value as SeasonType })}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {seasons.map(sn => (
                <option key={sn} value={sn}>{sn}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sliders for Temp & Humidity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                <span>Ambient Temperature:</span>
              </span>
              <span className="text-xs font-mono font-bold text-stone-900">{criteria.temperature}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={criteria.temperature}
              onChange={(e) => setCriteria({ ...criteria, temperature: parseInt(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Relative Humidity:</span>
              </span>
              <span className="text-xs font-mono font-bold text-stone-900">{criteria.humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="1"
              value={criteria.humidity}
              onChange={(e) => setCriteria({ ...criteria, humidity: parseInt(e.target.value) })}
              className="w-full accent-sky-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleApplyCriteria}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Recalculate Recommendations</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: `All (${safeResults.length})` },
            { id: 'Highly Suitable', label: `Highly Suitable (${safeResults.filter(r => r.level === 'Highly Suitable').length})` },
            { id: 'Suitable', label: `Suitable (${safeResults.filter(r => r.level === 'Suitable').length})` },
            { id: 'Moderately Suitable', label: `Moderate (${safeResults.filter(r => r.level === 'Moderately Suitable').length})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterLevel(f.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterLevel === f.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredResults.length} scored crops
        </span>
      </div>

      {/* Recommended Crop Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map(result => {
          const { crop, score, level, matchingReasons, warningReasons } = result;

          // Color tags based on level
          const badgeStyle = 
            level === 'Highly Suitable' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
            level === 'Suitable' ? 'bg-teal-100 text-teal-900 border-teal-300' :
            level === 'Moderately Suitable' ? 'bg-amber-100 text-amber-900 border-amber-300' :
            'bg-rose-100 text-rose-900 border-rose-300';

          const scoreColor =
            score >= 80 ? 'text-emerald-700' :
            score >= 65 ? 'text-teal-700' :
            score >= 50 ? 'text-amber-700' : 'text-rose-700';

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Header with Crop details & Score badge */}
              <div className="p-4 flex items-start justify-between gap-3 border-b border-stone-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                        {crop.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {crop.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 italic mt-0.5">
                      {crop.scientificName}
                    </p>
                    <p className="text-xs text-emerald-800 font-semibold mt-1">
                      {crop.bestSeason.seasonName} • {crop.yieldEstimates.minPerAcre}–{crop.yieldEstimates.maxPerAcre} {crop.yieldEstimates.unit}
                    </p>
                  </div>
                </div>

                {/* Score badge */}
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-black font-mono leading-none ${scoreColor}`}>
                    {score}%
                  </div>
                  <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border mt-1 ${badgeStyle}`}>
                    {level}
                  </span>
                </div>
              </div>

              {/* Matching & Warning Analysis */}
              <div className="p-4 space-y-3 flex-1 text-xs">
                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center bg-stone-50 p-2 rounded-xl">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Soil</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.soil}/20</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">pH</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.ph}/15</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Temp</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.temperature}/25</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Humidity</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.humidity}/10</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Water</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.water}/15</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Season</span>
                    <span className="font-bold text-stone-800">{result.scoreBreakdown.season}/15</span>
                  </div>
                </div>

                {/* Why Suitable (Matches) */}
                {matchingReasons.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Why it suits your land:
                    </span>
                    <ul className="space-y-1 text-stone-700">
                      {matchingReasons.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings if any */}
                {warningReasons.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Precautions:
                    </span>
                    <ul className="space-y-1 text-stone-700">
                      {warningReasons.map((w, i) => (
                        <li key={i} className="flex items-start space-x-1.5 text-amber-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer: View complete protocol */}
              <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">
                  Ideal pH: {crop.soilReq.idealPhMin}–{crop.soilReq.idealPhMax}
                </span>
                <button
                  onClick={() => onSelectCrop(crop)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 bg-white border border-stone-300 hover:border-emerald-400 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  <span>View Step-by-Step Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
