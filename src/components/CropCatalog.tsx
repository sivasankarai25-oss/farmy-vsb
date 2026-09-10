import React, { useState } from 'react';
import { 
  Search, Filter, Sprout, ChevronRight, Droplets, 
  Layers, Thermometer, PlusCircle, CheckCircle2 
} from 'lucide-react';
import { Crop } from '../types';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface CropCatalogProps {
  onSelectCrop: (crop: Crop) => void;
  onAddToFarm: (crop: Crop) => void;
  language: Language;
}

export const CropCatalog: React.FC<CropCatalogProps> = ({
  onSelectCrop,
  onAddToFarm,
  language,
}) => {
  const t = translations[language];

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Crops' },
    { id: 'vegetable', label: 'Vegetables' },
    { id: 'grain', label: 'Grains & Cereals' },
    { id: 'pulse', label: 'Pulses & Legumes' },
    { id: 'fruit', label: 'Fruit Orchards' },
  ];

  const filteredCrops = allCrops.filter(crop => {
    // Category
    if (categoryFilter !== 'all' && crop.category !== categoryFilter) {
      return false;
    }

    // Water level
    if (waterFilter !== 'all' && crop.waterMgmt.level !== waterFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        crop.name.toLowerCase().includes(q) ||
        (crop.tamilName && crop.tamilName.includes(q)) ||
        (crop.hindiName && crop.hindiName.includes(q)) ||
        crop.scientificName.toLowerCase().includes(q) ||
        crop.soilReq.suitableSoilTypes.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-emerald-500/30">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            <span>Comprehensive Agronomic Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Agricultural Crop Library
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Detailed agronomic guides for 15+ high-yielding Indian crops covering soil preparation, irrigation schedules, fertilizer formulas, growth stages, and pest remedies.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by crop name, scientific name, or soil type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          {/* Water level filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold text-stone-600">Water Req:</span>
            <select
              value={waterFilter}
              onChange={(e) => setWaterFilter(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Water Levels</option>
              <option value="Low">Low Water (Drought Tolerant)</option>
              <option value="Medium">Medium Water</option>
              <option value="High">High Water (Flooded/Frequent)</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-stone-500 font-medium px-1 flex justify-between items-center">
        <span>Showing {filteredCrops.length} crops</span>
        <span>Click any crop for complete step-by-step planting protocol</span>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map(crop => (
          <div
            key={crop.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image banner */}
            <div className="relative h-44 w-full overflow-hidden cursor-pointer" onClick={() => onSelectCrop(crop)}>
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <span className="text-[10px] font-black uppercase bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {crop.category}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-xs text-white ${
                  crop.waterMgmt.level === 'High' ? 'bg-sky-600/90' :
                  crop.waterMgmt.level === 'Medium' ? 'bg-emerald-600/90' : 'bg-amber-600/90'
                }`}>
                  {crop.waterMgmt.level} Water
                </span>
              </div>
            </div>

            {/* Content body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      onClick={() => onSelectCrop(crop)}
                      className="font-extrabold text-base text-stone-900 hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {crop.name}
                    </h3>
                    <p className="text-xs text-stone-500 italic mt-0.5 font-mono">
                      {crop.scientificName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {crop.description}
                </p>

                {/* Key Spec Chips */}
                <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-stone-100 text-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Best Season</span>
                    <span className="font-semibold text-emerald-900">{crop.bestSeason.seasonName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Soil pH Range</span>
                    <span className="font-mono font-bold text-stone-800">{crop.soilReq.idealPhMin} – {crop.soilReq.idealPhMax}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Ideal Temp</span>
                    <span className="font-semibold text-stone-800">{crop.bestSeason.idealTempMin}°C – {crop.bestSeason.idealTempMax}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Avg Yield</span>
                    <span className="font-bold text-emerald-800">{crop.yieldEstimates.minPerAcre}–{crop.yieldEstimates.maxPerAcre} {crop.yieldEstimates.unit.split('/')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onAddToFarm(crop)}
                  className="text-xs font-bold text-stone-700 hover:text-emerald-800 bg-stone-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Plant</span>
                </button>

                <button
                  onClick={() => onSelectCrop(crop)}
                  className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center space-x-1"
                >
                  <span>View Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
