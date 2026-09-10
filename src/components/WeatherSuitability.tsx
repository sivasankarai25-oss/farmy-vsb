import React, { useState } from 'react';
import { 
  CloudSun, Droplets, Wind, Thermometer, AlertTriangle, 
  CheckCircle2, XCircle, CloudRain, Sun, Calendar, 
  ArrowRight, ShieldAlert, Sparkles, MapPin, RefreshCw
} from 'lucide-react';
import { Crop, WeatherData } from '../types';
import { compareWeatherWithCrop } from '../utils/weatherEngine';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface WeatherSuitabilityProps {
  weather: WeatherData | null;
  onRefreshWeather: () => void;
  selectedLocation: string;
  onSelectCrop: (crop: Crop) => void;
  language: Language;
}

export const WeatherSuitability: React.FC<WeatherSuitabilityProps> = ({
  weather,
  onRefreshWeather,
  selectedLocation,
  onSelectCrop,
  language,
}) => {
  const t = translations[language];
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');

  if (!weather) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-xs">
        <CloudSun className="w-12 h-12 text-stone-300 mx-auto animate-bounce" />
        <h3 className="text-base font-bold text-stone-700 mt-3">Fetching Live Agro-Meteorological Forecast...</h3>
        <p className="text-xs text-stone-400 mt-1">Connecting to Open-Meteo satellite feed</p>
      </div>
    );
  }

  const selectedCrop = allCrops.find(c => c.id === selectedCropId) || allCrops[0];
  const comparison = compareWeatherWithCrop(weather, selectedCrop);

  const getStatusColor = () => {
    if (comparison.status === 'suitable') return 'bg-emerald-500 text-white';
    if (comparison.status === 'warning') return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getStatusCardBg = () => {
    if (comparison.status === 'suitable') return 'bg-emerald-50 border-emerald-200';
    if (comparison.status === 'warning') return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-sky-800 via-sky-900 to-indigo-950 text-white p-5 sm:p-7 rounded-2xl shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-sky-200 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{weather.location}</span>
            </div>
            <div className="flex items-baseline space-x-3 mt-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                {Math.round(weather.current.temp)}°C
              </span>
              <span className="text-sm sm:text-base font-medium text-sky-100">
                {weather.current.condition}
              </span>
            </div>
            <p className="text-xs text-sky-200/90 mt-1">
              Favorable for active field operations
            </p>
          </div>

          <button
            onClick={onRefreshWeather}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 backdrop-blur-sm transition-colors text-white"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Weather Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-sky-700/50 text-xs">
          <div className="flex items-center space-x-2.5">
            <Droplets className="w-4 h-4 text-sky-300" />
            <div>
              <span className="text-[11px] text-sky-200 block">Humidity</span>
              <span className="font-bold text-white text-sm">{weather.current.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Wind className="w-4 h-4 text-sky-300" />
            <div>
              <span className="text-[11px] text-sky-200 block">Wind Speed</span>
              <span className="font-bold text-white text-sm">{weather.current.windSpeed} km/h</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <CloudRain className="w-4 h-4 text-sky-300" />
            <div>
              <span className="text-[11px] text-sky-200 block">Precipitation</span>
              <span className="font-bold text-white text-sm">{weather.current.precipitation} mm</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Sun className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-[11px] text-sky-200 block">UV / Radiation</span>
              <span className="font-bold text-white text-sm">Moderate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>5-Day Agricultural Weather Outlook</span>
        </h3>

        <div className="grid grid-cols-5 gap-2 text-center">
          {weather.forecast.map((day, i) => (
            <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 hover:border-sky-300 transition-colors">
              <span className="text-[11px] font-bold text-stone-700 block">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <span className="text-xs font-black text-stone-900 font-mono block mt-1">
                {Math.round(day.tempMax)}° <span className="text-stone-400 text-[10px] font-normal">{Math.round(day.tempMin)}°</span>
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5 truncate">{day.condition}</span>
              <span className="text-[10px] font-semibold text-sky-600 block mt-1">
                {day.rainProb}% rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crop Suitability Selector & Comparison */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Crop Weather Suitability Evaluator
            </h3>
            <p className="text-xs text-stone-500">
              Select any crop to check if current conditions pose heat, humidity, or disease risks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-stone-600">Selected Crop:</span>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
            >
              {allCrops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Suitability Banner */}
        <div className={`p-4 rounded-xl border ${getStatusCardBg()} space-y-3`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img
                src={selectedCrop.image}
                alt={selectedCrop.name}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-extrabold text-stone-900">
                  {comparison.headline}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Ideal Temp: {selectedCrop.bestSeason.idealTempMin}°C – {selectedCrop.bestSeason.idealTempMax}°C • Humidity: {selectedCrop.weatherReq.requiredHumidity}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${getStatusColor()}`}>
                Score: {comparison.suitabilityScore}/100
              </span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                <span>Temperature Analysis</span>
              </div>
              <p className="text-stone-600">{comparison.details.tempStatus.message}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Humidity & Fungal Threat</span>
              </div>
              <p className="text-stone-600">{comparison.details.humidityStatus.message}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rain & Soil Moisture</span>
              </div>
              <p className="text-stone-600">{comparison.details.rainStatus.message}</p>
            </div>
          </div>

          {/* Actionable Tips */}
          {comparison.details.actionableTips.length > 0 && (
            <div className="pt-2 border-t border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Smart Agro-Advisory for Next 48 Hours:
              </span>
              <ul className="space-y-1 text-xs text-stone-700">
                {comparison.details.actionableTips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
