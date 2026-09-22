import React from 'react';
import { Home, Sprout, Sparkles, Tractor, Bot, Wrench, Gamepad2, Store } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { procurementNavLabel, procurementNavLabelFull } from '../procurement/i18n';

export type TabType = 'home' | 'crops' | 'recommend' | 'myfarm' | 'procurement' | 'quiz' | 'assistant' | 'tools';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home' as TabType, label: t.home, icon: Home },
    { id: 'crops' as TabType, label: t.crops, icon: Sprout },
    { id: 'recommend' as TabType, label: t.recommend, icon: Sparkles, highlight: true },
    { id: 'myfarm' as TabType, label: t.myFarm, icon: Tractor },
    { id: 'procurement' as TabType, label: procurementNavLabelFull[language], shortLabel: procurementNavLabel[language], icon: Store },
    { id: 'quiz' as TabType, label: 'Quiz', icon: Gamepad2 },
    { id: 'assistant' as TabType, label: t.assistant, icon: Bot },
    { id: 'tools' as TabType, label: 'Tools', icon: Wrench },
  ];

  return (
    <>
      {/* Mobile Bottom Fixed Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg md:hidden">
        <div className="grid grid-cols-8 h-16 max-w-lg mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all relative min-w-0 px-0.5 ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-stone-500 hover:text-stone-800 font-medium'
                }`}
              >
                {item.highlight ? (
                  <div
                    className={`w-8 h-8 -mt-3 rounded-full flex items-center justify-center shadow-md transition-transform ${
                      isActive
                        ? 'bg-emerald-600 text-white scale-110'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ) : (
                  <Icon className={`w-[18px] h-[18px] mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                )}
                <span className="text-[9px] tracking-tight leading-none mt-0.5 truncate max-w-full">
                  {(item as { shortLabel?: string }).shortLabel ?? item.label}
                </span>
                {isActive && !item.highlight && (
                  <span className="absolute top-0 w-6 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Sub-Bar */}
      <nav className="hidden md:block bg-emerald-900/90 backdrop-blur text-emerald-100 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-1 py-1.5 overflow-x-auto scrollbar-none">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-emerald-200 font-medium hidden lg:flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kharif & Rabi Guidance Active</span>
          </div>
        </div>
      </nav>
    </>
  );
};
