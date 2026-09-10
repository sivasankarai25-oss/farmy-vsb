import React, { useState } from 'react';
import { 
  Search, Sparkles, CloudSun, Sprout, Tractor, TestTube, 
  Bug, Calculator, ArrowRight, ChevronRight, Droplets, 
  Thermometer, MapPin, Calendar, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { Crop, FarmCrop, FarmingTask, WeatherData } from '../types';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';
import { TabType } from './Navigation';

interface HomeScreenProps {
  weather: WeatherData | null;
  farmCrops: FarmCrop[];
  tasks: FarmingTask[];
  onSelectCrop: (crop: Crop) => void;
  onNavigateTab: (tab: TabType) => void;
  language: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weather,
  farmCrops = [],
  tasks = [],
  onSelectCrop,
  onNavigateTab,
  language,
}) => {
  const t = translations[language] || translations['en'];
  const [searchQuery, setSearchQuery] = useState('');

  // Determine current greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  // Filter crops based on search query
  const filteredCrops = searchQuery.trim()
    ? allCrops.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tamilName && c.tamilName.includes(searchQuery)) ||
        (c.hindiName && c.hindiName.includes(searchQuery)) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Seasonal recommended crops (e.g. Kharif monsoon crops)
  const seasonCrops = allCrops.filter(c => 
    c.bestSeason.seasonName.includes('Kharif') || c.bestSeason.seasonName === 'Year-Round'
  ).slice(0, 4);

  // Popular high-value cash crops
  const popularCrops = allCrops.filter(c => 
    ['tomato', 'chilli', 'rice', 'maize', 'banana', 'wheat'].includes(c.id)
  );

  const pendingTasks = (tasks || []).filter(t => !t.completed).slice(0, 3);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. HERO & WELCOME BANNER */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 sm:p-7 rounded-2xl shadow-lg relative overflow-hidden">
        {/* Background decorative graphic */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 border border-emerald-500/30">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kharif Season Agricultural Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {getGreeting()}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
            Welcome to <strong>FARMY</strong>. Decide which crop to plant, discover when to irrigate, test soil fertility, and protect your fields with modern IPM guides.
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('recommend')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.findSuitableCropCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('myfarm')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center space-x-1.5"
            >
              <Tractor className="w-4 h-4 text-emerald-300" />
              <span>My Farm ({farmCrops.length} Active)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CROP SEARCH BAR */}
      <div className="relative">
        <div className="relative bg-white rounded-2xl border border-stone-200 shadow-xs focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={t.searchCropPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 text-xs sm:text-sm text-stone-800 bg-transparent rounded-2xl focus:outline-none font-medium"
          />
        </div>

        {/* Instant Search Results Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl p-3 z-30 max-h-80 overflow-y-auto space-y-1.5 animate-in fade-in">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Matching Crops ({filteredCrops.length})
            </div>
            {filteredCrops.length === 0 ? (
              <p className="text-xs text-stone-500 px-2 py-3">No crops found matching "{searchQuery}".</p>
            ) : (
              filteredCrops.map(crop => (
                <div
                  key={crop.id}
                  onClick={() => {
                    onSelectCrop(crop);
                    setSearchQuery('');
                  }}
                  className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{crop.name}</h4>
                      <p className="text-[11px] text-stone-500 italic font-mono">{crop.scientificName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {crop.category}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. CURRENT WEATHER SUMMARY CARD */}
      {weather && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
              <CloudSun className="w-7 h-7 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-stone-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-stone-700">{weather.location}</span>
                <span>• Live Agro-Weather</span>
              </div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-stone-900 font-mono">
                  {Math.round(weather.current.temp)}°C
                </span>
                <span className="text-xs font-bold text-sky-800">
                  {weather.current.condition}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-stone-600">
            <div className="flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>{weather.current.humidity}% Humidity</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>Wind: {weather.current.windSpeed} km/h</span>
            </div>

            <button
              onClick={() => onNavigateTab('tools')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>Weather Analysis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. QUICK TOOLS SHORTCUTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3.5 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left shadow-xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <TestTube className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-stone-900">Soil Health Check</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Test pH & nutrients</p>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3.5 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left shadow-xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Bug className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-stone-900">Pest Doctor & IPM</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Symptom diagnosis</p>
        </button>

        <button
          onClick={() => onNavigateTab('tools')}
          className="p-3.5 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left shadow-xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Calculator className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-stone-900">Profit Calculator</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Yield & cost estimates</p>
        </button>

        <button
          onClick={() => onNavigateTab('assistant')}
          className="p-3.5 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-left shadow-xs transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-stone-900">FARMY AI Chat</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Instant crop advice</p>
        </button>
      </div>

      {/* 5. RECOMMENDED CROPS FOR CURRENT SEASON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              {t.recommendedThisSeason}
            </h2>
            <p className="text-xs text-stone-500">
              Crops ideal for current temperature ({weather ? Math.round(weather.current.temp) : 28}°C) and Kharif planting
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('crops')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            View All ({allCrops.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {seasonCrops.map(crop => (
            <div
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 right-2 text-[10px] font-black uppercase bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {crop.category}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {crop.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 italic mt-0.5">
                    {crop.scientificName}
                  </p>
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    Yield: {crop.yieldEstimates.minPerAcre}–{crop.yieldEstimates.maxPerAcre} {crop.yieldEstimates.unit}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>pH: {crop.soilReq.idealPhMin}–{crop.soilReq.idealPhMax}</span>
                  <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. POPULAR CROPS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              {t.popularCrops}
            </h2>
            <p className="text-xs text-stone-500">
              Staple cereals, pulses, vegetables, and commercial fruit crops
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularCrops.map(crop => (
            <div
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              className="bg-white rounded-2xl border border-stone-200 p-3 text-center shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <img
                src={crop.image}
                alt={crop.name}
                className="w-16 h-16 rounded-xl object-cover mx-auto mb-2 border border-stone-100 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <h4 className="font-bold text-xs text-stone-900 group-hover:text-emerald-800 truncate">
                {crop.name}
              </h4>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                {crop.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. MY FARM DASHBOARD PREVIEW */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Tractor className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">My Farm Overview</h3>
          </div>
          <button
            onClick={() => onNavigateTab('myfarm')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>Open Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active crops snippet */}
          <div>
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              Cultivated Fields ({farmCrops.length})
            </span>
            <div className="space-y-2">
              {farmCrops.slice(0, 2).map(crop => {
                const meta = allCrops.find(c => c.id === crop.cropId);
                const currentStage = meta?.growthTimeline[crop.currentStageIndex];
                return (
                  <div key={crop.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{crop.cropName} ({crop.farmAreaAcre} Ac)</h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">Stage: {currentStage?.name || 'Active'}</p>
                    </div>
                    <button
                      onClick={() => onNavigateTab('myfarm')}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200"
                    >
                      Track
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending reminders snippet */}
          <div>
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              Upcoming Reminders ({pendingTasks.length})
            </span>
            <div className="space-y-2">
              {pendingTasks.length === 0 ? (
                <p className="text-xs text-stone-400 py-3">No tasks due today. All caught up!</p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-amber-950">{task.title}</h4>
                      <p className="text-[11px] text-amber-800">Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="text-[10px] uppercase font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      {task.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
