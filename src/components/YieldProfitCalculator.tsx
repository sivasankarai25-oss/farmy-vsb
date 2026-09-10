import React, { useState, useEffect } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, PieChart, Sparkles, 
  AlertCircle, ChevronRight, RefreshCw, Layers, CheckCircle2
} from 'lucide-react';
import { Crop } from '../types';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface YieldProfitCalculatorProps {
  initialCrop?: Crop;
  language: Language;
}

export const YieldProfitCalculator: React.FC<YieldProfitCalculatorProps> = ({
  initialCrop,
  language,
}) => {
  const t = translations[language];

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCrop ? initialCrop.id : 'tomato');
  const [farmArea, setFarmArea] = useState<number>(1.0);
  const [farmingMethod, setFarmingMethod] = useState<'precision' | 'conventional' | 'organic'>('precision');

  // Cost inputs
  const [seedCost, setSeedCost] = useState<number>(3500);
  const [fertilizerCost, setFertilizerCost] = useState<number>(8500);
  const [laborCost, setLaborCost] = useState<number>(16000);
  const [irrigationCost, setIrrigationCost] = useState<number>(3500);
  const [otherCost, setOtherCost] = useState<number>(4500);

  // Yield & Price
  const [yieldKgPerAcre, setYieldKgPerAcre] = useState<number>(14000);
  const [pricePerKg, setPricePerKg] = useState<number>(15);

  const selectedCrop = allCrops.find(c => c.id === selectedCropId) || allCrops[0];

  // Populate default crop economic benchmarks on crop change
  useEffect(() => {
    if (selectedCrop) {
      const eco = selectedCrop.economics;
      setSeedCost(eco.defaultSeedCost * farmArea);
      setFertilizerCost(eco.defaultFertilizerCost * farmArea);
      setLaborCost(eco.defaultLaborCost * farmArea);
      setIrrigationCost(eco.defaultIrrigationCost * farmArea);
      setOtherCost(eco.defaultOtherCost * farmArea);

      // Method multiplier on yield
      const multiplier = farmingMethod === 'precision' ? 1.15 : farmingMethod === 'organic' ? 0.85 : 1.0;
      setYieldKgPerAcre(Math.round(eco.defaultYieldKgPerAcre * multiplier));
      setPricePerKg(eco.defaultSellingPricePerKg);
    }
  }, [selectedCropId, farmArea, farmingMethod]);

  // Calculations
  const totalCost = seedCost + fertilizerCost + laborCost + irrigationCost + otherCost;
  const totalYieldKg = yieldKgPerAcre * farmArea;
  const totalYieldTonnes = (totalYieldKg / 1000).toFixed(1);
  const totalRevenue = totalYieldKg * pricePerKg;
  const netProfit = totalRevenue - totalCost;
  const profitPerAcre = farmArea > 0 ? Math.round(netProfit / farmArea) : 0;
  const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-white p-5 sm:p-7 rounded-2xl shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-emerald-500/30">
            <Calculator className="w-3.5 h-3.5 text-emerald-300" />
            <span>Farm Financial & Yield Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Yield Prediction & Profit Calculator
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Estimate production costs, market returns, net profits, and Return on Investment (ROI) based on your cultivated acreage and farming methodology.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Input Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Crop & Acreage Selector */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>1. Crop & Farm Setup</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Crop</label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {allCrops.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Total Acreage (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="100"
                  value={farmArea}
                  onChange={(e) => setFarmArea(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Farming Method</label>
                <select
                  value={farmingMethod}
                  onChange={(e) => setFarmingMethod(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="precision">Drip / Precision (+15% yield)</option>
                  <option value="conventional">Standard Conventional</option>
                  <option value="organic">Certified Organic (Premium Price)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Input Production Costs */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                2. Estimated Production Expenses (for {farmArea} Acre(s))
              </h3>
              <span className="text-xs font-mono font-black text-stone-800">
                Total Cost: ₹{totalCost.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-stone-500 font-semibold mb-1">Seed & Seedling (₹)</label>
                <input
                  type="number"
                  value={seedCost}
                  onChange={(e) => setSeedCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-semibold mb-1">Fertilizer & Manure (₹)</label>
                <input
                  type="number"
                  value={fertilizerCost}
                  onChange={(e) => setFertilizerCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-semibold mb-1">Labor / Tillage / Harvest (₹)</label>
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-semibold mb-1">Irrigation & Power (₹)</label>
                <input
                  type="number"
                  value={irrigationCost}
                  onChange={(e) => setIrrigationCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-500 font-semibold mb-1">Pest Mgmt & Other (₹)</label>
                <input
                  type="number"
                  value={otherCost}
                  onChange={(e) => setOtherCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
              </div>
            </div>
          </div>

          {/* 3. Expected Yield & Mandi Price */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              3. Yield & Market Selling Price
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-stone-700">Expected Yield per Acre (kg)</label>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ~{(yieldKgPerAcre / 1000).toFixed(1)} Tonnes/Acre
                  </span>
                </div>
                <input
                  type="number"
                  value={yieldKgPerAcre}
                  onChange={(e) => setYieldKgPerAcre(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Regional benchmark: {selectedCrop.yieldEstimates.minPerAcre} – {selectedCrop.yieldEstimates.maxPerAcre} {selectedCrop.yieldEstimates.unit}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-stone-700">Selling Price per kg (₹)</label>
                  <span className="text-[11px] text-stone-500 font-semibold">
                    Mandi rate benchmark
                  </span>
                </div>
                <input
                  type="number"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-800"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  e.g., ₹{selectedCrop.economics.defaultSellingPricePerKg}/kg average wholesale APMC price
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Results Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                Financial Projection Summary
              </span>
              <h4 className="text-lg font-black text-stone-900 mt-0.5">
                {selectedCrop.name} ({farmArea} Acre)
              </h4>
            </div>

            {/* Big Net Profit Display */}
            <div className={`p-4 rounded-xl text-center border ${
              netProfit >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider block">
                Estimated Net Profit
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono mt-1 block">
                ₹{netProfit.toLocaleString()}
              </span>
              <span className="text-xs font-semibold mt-1 inline-block">
                ₹{profitPerAcre.toLocaleString()} per Acre
              </span>
            </div>

            {/* Key Metrics Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Total Yield:</span>
                <span className="font-mono font-bold text-stone-900">
                  {totalYieldKg.toLocaleString()} kg ({totalYieldTonnes} Tonnes)
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Gross Revenue:</span>
                <span className="font-mono font-bold text-emerald-800">
                  ₹{totalRevenue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Total Cost:</span>
                <span className="font-mono font-bold text-stone-800">
                  ₹{totalCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-stone-500 font-medium">Return on Investment (ROI):</span>
                <span className={`font-mono font-black text-sm ${roi >= 50 ? 'text-emerald-700' : 'text-stone-800'}`}>
                  {roi}%
                </span>
              </div>
            </div>

            {/* Quick Profit Advice */}
            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
              <span className="font-bold block text-stone-900">💡 Profit Maximization Tip:</span>
              <p className="leading-relaxed text-[11px]">
                {farmingMethod === 'precision'
                  ? 'Drip fertigation optimizes water use and saves up to 30% on fertilizer costs while boosting uniform fruit size.'
                  : 'Stagger harvest times to sell in high-demand windows and reduce post-harvest storage losses.'}
              </p>
            </div>
          </div>

          {/* Market Disclaimer */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Market Rate Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Agricultural market prices fluctuate daily based on arrivals, weather, and transport logistics. Use this calculator for planning budgets; consult local mandis for real-time spot prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
