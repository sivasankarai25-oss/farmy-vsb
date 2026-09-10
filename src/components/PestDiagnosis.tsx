import React, { useState } from 'react';
import { 
  ShieldAlert, Bug, AlertTriangle, CheckCircle2, ShieldCheck, 
  Search, Info, ExternalLink, Leaf, Filter, FileText
} from 'lucide-react';
import { Crop } from '../types';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface PestDiagnosisProps {
  onSelectCrop: (crop: Crop) => void;
  language: Language;
}

export const PestDiagnosis: React.FC<PestDiagnosisProps> = ({
  onSelectCrop,
  language,
}) => {
  const t = translations[language];

  const [selectedSymptom, setSelectedSymptom] = useState<string>('all');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const symptomsList = [
    { id: 'all', label: 'All Symptoms' },
    { id: 'yellow', label: 'Yellow Leaves / Chlorosis' },
    { id: 'spots', label: 'Brown Spots / Blight' },
    { id: 'holes', label: 'Holes in Leaves / Frass' },
    { id: 'wilting', label: 'Wilting / Drooping' },
    { id: 'curl', label: 'Leaf Curl / Wrinkling' },
    { id: 'insects', label: 'Visible Insects / Caterpillars' },
    { id: 'mold', label: 'White Mold / Downy Mildew' },
    { id: 'rot', label: 'Fruit Rot / Borer' },
  ];

  // Flatten all pest and diseases with their parent crop
  const allPestIssues = allCrops.flatMap(crop => 
    crop.pestDiseases.map(pd => ({
      ...pd,
      crop,
    }))
  );

  // Filter based on symptom, crop, and search
  const filteredPests = allPestIssues.filter(item => {
    // Crop filter
    if (selectedCropFilter !== 'all' && item.crop.id !== selectedCropFilter) {
      return false;
    }

    // Symptom filter
    if (selectedSymptom !== 'all') {
      const matchSymptom = item.symptoms.some(s => {
        const text = s.toLowerCase();
        if (selectedSymptom === 'yellow') return text.includes('yellow') || text.includes('chloros');
        if (selectedSymptom === 'spots') return text.includes('spot') || text.includes('blight') || text.includes('lesion');
        if (selectedSymptom === 'holes') return text.includes('hole') || text.includes('frass') || text.includes('ragged') || text.includes('tear');
        if (selectedSymptom === 'wilting') return text.includes('wilt') || text.includes('droop');
        if (selectedSymptom === 'curl') return text.includes('curl') || text.includes('mosaic') || text.includes('wrink');
        if (selectedSymptom === 'insects') return text.includes('caterpillar') || text.includes('hopper') || text.includes('fly') || text.includes('borer') || text.includes('aphid');
        if (selectedSymptom === 'mold') return text.includes('mold') || text.includes('downy') || text.includes('powdery') || text.includes('fungus');
        if (selectedSymptom === 'rot') return text.includes('rot') || text.includes('fruit');
        return false;
      });
      if (!matchSymptom) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        item.name.toLowerCase().includes(q) ||
        item.crop.name.toLowerCase().includes(q) ||
        item.symptoms.some(s => s.toLowerCase().includes(q)) ||
        (item.ipmControls.chemical && item.ipmControls.chemical.activeIngredient.toLowerCase().includes(q));
      if (!matchQuery) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-900 via-stone-900 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-rose-800/80 px-2.5 py-1 rounded-full text-xs font-bold text-rose-200 mb-2 border border-rose-600/40">
            <Bug className="w-3.5 h-3.5" />
            <span>Integrated Pest Management (IPM) Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Crop Doctor & Pest Diagnosis
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            Identify crop damage by visual symptoms. Learn natural, organic remedies first, followed by strict chemical dosage and mandatory Post-Harvest Interval (PHI) safety times.
          </p>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start space-x-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-amber-900 mb-0.5">Agricultural Extension & Safety Advisory</h4>
          <p className="leading-relaxed text-amber-900/90">
            Pesticide and fertilizer recommendations are not universally applicable. Soil composition, local climatic zones, and state regulations vary. Always cross-check with your local Krishi Vigyan Kendra (KVK) or agricultural extension officer, and adhere strictly to product label instructions, protective gear (PPE), and harvest wait periods.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
        {/* Search input & Crop dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search symptom, pest, or crop (e.g. leaf curl, borer, blight)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Crops</option>
              {allCrops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Symptom Chips */}
        <div>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Select Visual Symptoms:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {symptomsList.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSymptom(s.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
                  selectedSymptom === s.id
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
        <span>Found {filteredPests.length} documented pest & disease profiles</span>
        <span>Prioritize: Cultural → Biological → Chemical</span>
      </div>

      {/* Pest Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPests.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Header with Crop info */}
            <div className="p-4 border-b border-stone-100 flex items-start justify-between gap-3 bg-stone-50/70">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    item.type === 'pest' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    Host: {item.crop.name}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-stone-900 mt-1">
                  {item.name}
                </h3>
              </div>

              <img
                src={item.crop.image}
                alt={item.crop.name}
                className="w-11 h-11 rounded-lg object-cover border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Symptoms & Root Cause */}
            <div className="p-4 space-y-3 text-xs flex-1 text-stone-800">
              <div>
                <span className="font-bold text-stone-900 block mb-1">Visual Symptoms:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-600 pl-0.5">
                  {item.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-stone-900">Cause / Spread: </span>
                <span className="text-stone-600">{item.causes}</span>
              </div>

              <div>
                <span className="font-bold text-stone-900">Cultural Prevention: </span>
                <span className="text-stone-600">{item.prevention}</span>
              </div>

              {/* IPM Solution Ladder */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Integrated Control Actions:
                </span>

                {/* Biological / Organic */}
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900 mb-0.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Biological & Organic Control</span>
                  </div>
                  <p className="text-emerald-950 text-[11px] leading-relaxed">
                    {item.ipmControls.organic || item.ipmControls.biological}
                  </p>
                </div>

                {/* Mechanical */}
                {item.ipmControls.mechanical && (
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center space-x-1.5 font-bold text-stone-800 mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                      <span>Mechanical / Physical Traps</span>
                    </div>
                    <p className="text-stone-700 text-[11px] leading-relaxed">
                      {item.ipmControls.mechanical}
                    </p>
                  </div>
                )}

                {/* Chemical with safety warning */}
                {item.ipmControls.chemical && (
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                    <div className="flex items-center justify-between font-bold text-rose-900 mb-0.5">
                      <div className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Chemical Intervention (Last Resort)</span>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                        Strict Threshold
                      </span>
                    </div>
                    <p className="font-semibold text-rose-950 text-xs">
                      {item.ipmControls.chemical.activeIngredient}
                    </p>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      {item.ipmControls.chemical.usage}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-rose-900 mt-1.5 pt-1.5 border-t border-rose-200">
                      <span>• PHI (Wait time): {item.ipmControls.chemical.phiDays} days</span>
                      <span>• PPE Required: {item.ipmControls.chemical.ppe}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer: View parent crop */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Crop category: {item.crop.category}
              </span>
              <button
                onClick={() => onSelectCrop(item.crop)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                View Full Crop Guide →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
