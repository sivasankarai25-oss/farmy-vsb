import React, { useState } from 'react';
import { Sprout, MapPin, Globe, Bell, ChevronDown, Check, CloudSun, LogOut, User as UserIcon } from 'lucide-react';
import { Language, translations, LANGUAGE_OPTIONS } from '../utils/translations';
import { FarmingTask, WeatherData } from '../types';
import { User } from '../firebase';

interface HeaderProps {
  language?: Language;
  currentLanguage?: Language;
  onLanguageChange: (lang: Language) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  weather?: WeatherData | null;
  onOpenWeather?: () => void;
  tasks?: FarmingTask[];
  onOpenNotifications?: () => void;
  user?: User | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  currentLanguage,
  onLanguageChange,
  selectedLocation,
  onLocationChange,
  weather,
  onOpenWeather,
  tasks = [],
  onOpenNotifications,
  user,
  onSignOut,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeLang: Language = language || currentLanguage || 'en';
  const t = translations[activeLang] || translations['en'];
  const pendingTasksCount = (tasks || []).filter(task => !task.completed).length;

  const popularLocations = [
    'Coimbatore, Tamil Nadu',
    'Ludhiana, Punjab',
    'Nashik, Maharashtra',
    'Dharwad, Karnataka',
    'Guntur, Andhra Pradesh',
    'Varanasi, Uttar Pradesh',
    'Rajkot, Gujarat',
    'Jaipur, Rajasthan',
    'Patna, Bihar',
    'Bhopal, Madhya Pradesh',
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight leading-none text-white">FARMY</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-600/80 px-1.5 py-0.5 rounded text-emerald-100 border border-emerald-500/50">Smart Farm</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium leading-tight">Intelligent Crop Guidance</p>
          </div>
        </div>

        {/* Actions (Weather pill, Location, Language, Notifications) */}
        <div className="flex items-center space-x-2">
          {/* Quick Weather Header Pill */}
          {weather && (
            <button
              onClick={onOpenWeather}
              className="hidden sm:flex items-center space-x-1.5 bg-emerald-900/70 hover:bg-emerald-900 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-700/50 transition-colors text-emerald-100"
              title="View Agro-Weather Suitability"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono font-bold text-white">{Math.round(weather.current.temp)}°C</span>
              <span className="text-[10px] text-emerald-300 hidden md:inline">({weather.current.humidity}% Hum.)</span>
            </button>
          )}

          {/* Location selector */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center space-x-1 bg-emerald-900/60 hover:bg-emerald-900 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-700/50 transition-colors"
              title="Change Farm Location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="max-w-[100px] sm:max-w-[140px] truncate text-emerald-50 font-medium">
                {selectedLocation.split(',')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-300 shrink-0" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-stone-800 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                  Select Farm Location
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {popularLocations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        onLocationChange(loc);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        selectedLocation === loc ? 'font-semibold text-emerald-800 bg-emerald-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 bg-emerald-900/60 hover:bg-emerald-900 text-xs px-2 py-1.5 rounded-lg border border-emerald-700/50 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-semibold text-emerald-100">
                {LANGUAGE_OPTIONS.find(l => l.code === activeLang)?.nativeLabel || 'English'}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-stone-800 z-50">
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      onLanguageChange(opt.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                      activeLang === opt.code ? 'font-bold text-emerald-700 bg-emerald-50' : ''
                    }`}
                  >
                    <span>{opt.nativeLabel}</span>
                    {activeLang === opt.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications / Task alerts */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/50 transition-colors"
              title="Farm Reminders & Tasks"
            >
              <Bell className="w-4 h-4 text-emerald-200" />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-900 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-emerald-800 animate-pulse">
                  {pendingTasksCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Sign Out Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 bg-emerald-900/70 hover:bg-emerald-900 px-2 py-1 rounded-lg border border-emerald-700/50 transition-colors"
                title="Account & Profile"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/50"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                    {(user.displayName || user.email || 'F')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-emerald-100 max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                  {user.displayName || user.email?.split('@')[0] || user.phoneNumber || 'Farmer'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 text-stone-800 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-stone-100 bg-emerald-50/50 rounded-t-lg">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {user.displayName || 'FARMY Farmer'}
                      </span>
                      <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded font-mono">
                        PRO
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {user.email || user.phoneNumber || 'Authenticated'}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                    <span>🌱</span>
                    <span>SPARK TEAM • FARMY v1.0.0</span>
                  </div>

                  {onSignOut && (
                    <div className="pt-1 border-t border-stone-100 mt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out from FARMY</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
