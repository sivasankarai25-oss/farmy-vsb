import React, { useState } from 'react';
import { 
  TestTube, CheckCircle2, AlertTriangle, RefreshCw, 
  ArrowRight, ShieldCheck, Leaf, Layers, BookmarkCheck,
  Info
} from 'lucide-react';
import { Crop, SoilReport, SoilType } from '../types';
import { calculateSoilHealthScore, compareSoilWithCrop } from '../utils/soilEngine';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface SoilCheckProps {
  currentReport: SoilReport;
  onSaveReport: (report: SoilReport) => void;
  onSelectCrop: (crop: Crop) => void;
  language: Language;
}

export const SoilCheck: React.FC<SoilCheckProps> = ({
  currentReport,
  onSaveReport,
  onSelectCrop,
  language,
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState<Omit<SoilReport, 'healthScore' | 'recommendations'>>({
    soilType: currentReport.soilType,
    ph: currentReport.ph,
    nitrogenLevel: currentReport.nitrogenLevel,
    phosphorusLevel: currentReport.phosphorusLevel,
    potassiumLevel: currentReport.potassiumLevel,
    soilMoisture: currentReport.soilMoisture,
  });

  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute live health score
  const healthEvaluation = calculateSoilHealthScore(formData);
  const activeCrop = allCrops.find(c => c.id === selectedCropId) || allCrops[0];

  // Compare with chosen crop
  const soilReportForCompare: SoilReport = {
    ...formData,
    healthScore: healthEvaluation.score,
    recommendations: healthEvaluation.recommendations,
  };
  const cropComparison = compareSoilWithCrop(soilReportForCompare, activeCrop);

  const handleSave = () => {
    onSaveReport(soilReportForCompare);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const soilTypes: SoilType[] = ['Loamy', 'Clay', 'Sandy', 'Alluvial', 'Black', 'Red', 'Laterite', 'Silt'];
  const levels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-stone-800 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-amber-800/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-200 mb-2 border border-amber-600/40">
            <TestTube className="w-3.5 h-3.5" />
            <span>Soil Testing & Diagnostics Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Soil Health & Crop Compatibility
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            Record your soil test results (pH and N-P-K levels) to receive your Soil Health Score and personalized amendments for maximum crop response.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Soil Parameters Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-800 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Input Soil Test Card Data</span>
            </h2>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center space-x-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to My Farm!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Soil Texture / Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as SoilType })}
                className="w-full text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                {soilTypes.map(st => (
                  <option key={st} value={st}>{st} Soil</option>
                ))}
              </select>
            </div>

            {/* Soil pH Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Soil pH Value
                </label>
                <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  pH {formData.ph.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Acidic (4.5)</span>
                <span>Ideal (6.5)</span>
                <span>Alkaline (9.0)</span>
              </div>
            </div>

            {/* Nitrogen Level */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Available Nitrogen (N)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, nitrogenLevel: lvl })}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      formData.nitrogenLevel === lvl
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Phosphorus Level */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Available Phosphorus (P)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, phosphorusLevel: lvl })}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      formData.phosphorusLevel === lvl
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Potassium Level */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Available Potassium (K)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, potassiumLevel: lvl })}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      formData.potassiumLevel === lvl
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Moisture Level */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Current Moisture Condition
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, soilMoisture: lvl })}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      formData.soilMoisture === lvl
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-stone-100">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Soil Report</span>
            </button>
          </div>
        </div>

        {/* Right Column: Health Score Gauge & Diagnostics */}
        <div className="space-y-4">
          {/* Health score card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Soil Health Index
            </span>
            <div className="my-3 inline-flex items-center justify-center">
              <div className={`w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center ${
                healthEvaluation.score >= 80 ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                healthEvaluation.score >= 60 ? 'border-teal-500 bg-teal-50 text-teal-800' :
                healthEvaluation.score >= 45 ? 'border-amber-500 bg-amber-50 text-amber-800' :
                'border-rose-500 bg-rose-50 text-rose-800'
              }`}>
                <span className="text-3xl font-black font-mono leading-none">{healthEvaluation.score}</span>
                <span className="text-[10px] uppercase font-bold mt-0.5">/ 100</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-stone-700">
              {healthEvaluation.score >= 80 ? 'Excellent soil biological & chemical fertility.' :
               healthEvaluation.score >= 60 ? 'Good condition; minor nutrient adjustments suggested.' :
               'Degraded soil health. Organic restoration required.'}
            </p>
          </div>

          {/* Parameter diagnostics */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2.5 text-xs">
            <h3 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
              Parameter Feedback
            </h3>

            {Object.entries(healthEvaluation.parameterFeedback).map(([param, fb]) => (
              <div key={param} className="p-2.5 bg-white rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold capitalize text-stone-900">{param}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    fb.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' :
                    fb.status === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {fb.status}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">{fb.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison against a selected crop */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Compare Soil with Target Crop
            </h3>
            <p className="text-xs text-stone-500">
              Check if this soil can grow your chosen crop successfully before sowing seeds.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-stone-600">Select Crop:</span>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-1.5"
            >
              {allCrops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Result Box */}
        <div className={`p-4 rounded-xl border ${
          cropComparison.isCompatible
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center space-x-2">
              <img
                src={activeCrop.image}
                alt={activeCrop.name}
                className="w-10 h-10 rounded-lg object-cover border border-emerald-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-stone-900">{activeCrop.name}</h4>
                <p className="text-xs text-stone-600">
                  Ideal pH: {activeCrop.soilReq.idealPhMin} – {activeCrop.soilReq.idealPhMax} • Suitable soils: {activeCrop.soilReq.suitableSoilTypes.join(', ')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${
                cropComparison.isCompatible ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {cropComparison.isCompatible ? 'Compatible' : 'Amendments Needed'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs mt-3">
            {cropComparison.differences.map((diff, i) => (
              <div key={i} className="flex items-start space-x-1.5 text-stone-800">
                <span className="mt-0.5">•</span>
                <span>{diff}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soil Improvement Recommendations */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Recommended Soil Amendments & Improvement Protocol</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {healthEvaluation.recommendations.map((rec, i) => (
            <div key={i} className="p-3 bg-white border border-stone-200 rounded-xl text-xs flex items-start space-x-2 shadow-xs">
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-stone-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
