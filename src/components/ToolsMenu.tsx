import React, { useState } from 'react';
import { 
  TestTube, CloudSun, Bug, Calculator, ArrowLeft, 
  Wrench, ChevronRight, ShieldAlert, Sparkles 
} from 'lucide-react';
import { Crop, FarmCrop, SoilReport, WeatherData } from '../types';
import { SoilCheck } from './SoilCheck';
import { WeatherSuitability } from './WeatherSuitability';
import { PestDiagnosis } from './PestDiagnosis';
import { YieldProfitCalculator } from './YieldProfitCalculator';
import { Language, translations } from '../utils/translations';

interface ToolsMenuProps {
  initialSubTool?: 'soil' | 'weather' | 'pest' | 'calculator' | null;
  soilReport: SoilReport;
  onSaveSoilReport: (report: SoilReport) => void;
  weather: WeatherData | null;
  onRefreshWeather: () => void;
  selectedLocation: string;
  onSelectCrop: (crop: Crop) => void;
  language: Language;
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({
  initialSubTool,
  soilReport,
  onSaveSoilReport,
  weather,
  onRefreshWeather,
  selectedLocation,
  onSelectCrop,
  language,
}) => {
  const [activeSubTool, setActiveSubTool] = useState<'menu' | 'soil' | 'weather' | 'pest' | 'calculator'>(
    initialSubTool || 'menu'
  );

  const t = translations[language];

  if (activeSubTool === 'soil') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSubTool('menu')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Hub</span>
        </button>
        <SoilCheck
          currentReport={soilReport}
          onSaveReport={onSaveSoilReport}
          onSelectCrop={onSelectCrop}
          language={language}
        />
      </div>
    );
  }

  if (activeSubTool === 'weather') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSubTool('menu')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Hub</span>
        </button>
        <WeatherSuitability
          weather={weather}
          onRefreshWeather={onRefreshWeather}
          selectedLocation={selectedLocation}
          onSelectCrop={onSelectCrop}
          language={language}
        />
      </div>
    );
  }

  if (activeSubTool === 'pest') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSubTool('menu')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Hub</span>
        </button>
        <PestDiagnosis
          onSelectCrop={onSelectCrop}
          language={language}
        />
      </div>
    );
  }

  if (activeSubTool === 'calculator') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSubTool('menu')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Hub</span>
        </button>
        <YieldProfitCalculator
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Tools Hub Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-white p-5 sm:p-7 rounded-2xl shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-emerald-500/30">
            <Wrench className="w-3.5 h-3.5 text-emerald-300" />
            <span>Farm Decision Support Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Agricultural Intelligence Tools
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Specialized calculators and diagnostic modules built specifically for field farmers and agricultural extension workers.
          </p>
        </div>
      </div>

      {/* Grid of 4 Major Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tool 1: Soil Check */}
        <div
          onClick={() => setActiveSubTool('soil')}
          className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200">
              <TestTube className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
              Soil Health & Testing Check
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Input soil texture, pH, and N-P-K levels. Get your Soil Health Score and check real-time soil compatibility with any crop before sowing.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Current Score: {soilReport.healthScore}/100</span>
            <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Open Soil Tool</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Tool 2: Weather Suitability */}
        <div
          onClick={() => setActiveSubTool('weather')}
          className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-sky-200">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-sky-800 transition-colors">
              Weather & Climate Suitability
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Compare live Open-Meteo satellite weather and 5-day forecasts against ideal crop temperature, humidity, and rainfall tolerances to avoid disease outbreaks.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-sky-800">
            <span>{weather ? `${Math.round(weather.current.temp)}°C, ${weather.current.humidity}% Hum.` : 'Live Satellite Feed'}</span>
            <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Open Weather Tool</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Tool 3: Pest Doctor */}
        <div
          onClick={() => setActiveSubTool('pest')}
          className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-rose-200">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-rose-800 transition-colors">
              Pest Doctor & Disease Diagnosis
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Identify insect damage and fungus by visual symptoms (leaf curl, yellowing, holes, wilting). Access organic, biological, and strict IPM chemical solutions.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-800">
            <span>IPM & Safe PHI Wait Times</span>
            <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Open Pest Doctor</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Tool 4: Profit & Yield Calculator */}
        <div
          onClick={() => setActiveSubTool('calculator')}
          className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-200">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
              Yield & Profit Calculator
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Estimate total production expenses (seeds, fertilizer, labor, irrigation) versus expected market returns and calculate your net profit per acre and ROI %.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Pre-filled Mandi Economics</span>
            <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Open Calculator</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
