import React, { useState } from 'react';
import { 
  Tractor, Plus, Calendar, Droplets, Layers, CheckCircle2, 
  Clock, AlertTriangle, Trash2, Edit3, ArrowRight, ChevronRight, 
  Sparkles, Check, Bell, Sprout
} from 'lucide-react';
import { Crop, FarmCrop, FarmingTask } from '../types';
import { allCrops } from '../data/cropsIndex';
import { Language, translations } from '../utils/translations';

interface MyFarmProps {
  farmCrops: FarmCrop[];
  onUpdateFarmCrops: (crops: FarmCrop[]) => void;
  tasks: FarmingTask[];
  onUpdateTasks: (tasks: FarmingTask[]) => void;
  onSelectCropDetails: (crop: Crop) => void;
  language: Language;
}

export const MyFarm: React.FC<MyFarmProps> = ({
  farmCrops = [],
  onUpdateFarmCrops,
  tasks = [],
  onUpdateTasks,
  onSelectCropDetails,
  language,
}) => {
  const t = translations[language] || translations['en'];

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropId, setNewCropId] = useState<string>(allCrops[0].id);
  const [newArea, setNewArea] = useState<number>(1.0);
  const [newPlantingDate, setNewPlantingDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Quick Action Modal for Logging Watering / Fertilizer
  const [logModal, setLogModal] = useState<{ crop: FarmCrop; type: 'water' | 'fertilizer' } | null>(null);
  const [logNote, setLogNote] = useState('');

  // Task filter
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const cropMeta = allCrops.find(c => c.id === newCropId);
    if (!cropMeta) return;

    // Estimate harvest date based on total timeline duration
    const totalDays = cropMeta.growthTimeline.reduce((acc, curr) => acc + curr.durationDays, 0);
    const plantDateObj = new Date(newPlantingDate);
    const harvestDateObj = new Date(plantDateObj.getTime() + totalDays * 24 * 60 * 60 * 1000);

    const newFarmCrop: FarmCrop = {
      id: `farm-crop-${Date.now()}`,
      cropId: cropMeta.id,
      cropName: cropMeta.name,
      farmAreaAcre: newArea,
      plantingDate: newPlantingDate,
      currentStageIndex: 1, // Seedling
      wateringLog: [{ date: newPlantingDate, note: 'Initial soaking irrigation' }],
      fertilizerLog: [{ date: newPlantingDate, name: 'Basal compost & FYM' }],
      pestIssues: [],
      expectedHarvestDate: harvestDateObj.toISOString().split('T')[0],
      notes: `Planted on ${newArea} acre(s).`,
    };

    // Also auto-generate initial tasks for this crop
    const generatedTasks: FarmingTask[] = [
      {
        id: `task-${Date.now()}-1`,
        cropId: cropMeta.id,
        cropName: cropMeta.name,
        title: `Watering Check: ${cropMeta.name} Seedling Stage`,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'watering',
        completed: false,
        priority: 'high',
      },
      {
        id: `task-${Date.now()}-2`,
        cropId: cropMeta.id,
        cropName: cropMeta.name,
        title: `First Top Dressing & Weeding: ${cropMeta.name}`,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'fertilizer',
        completed: false,
        priority: 'medium',
      },
      {
        id: `task-${Date.now()}-3`,
        cropId: cropMeta.id,
        cropName: cropMeta.name,
        title: `Pest Scouting: Check for early aphids & stem borer`,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'pest',
        completed: false,
        priority: 'medium',
      }
    ];

    onUpdateFarmCrops([newFarmCrop, ...farmCrops]);
    onUpdateTasks([...generatedTasks, ...tasks]);
    setShowAddModal(false);
  };

  const handleDeleteCrop = (id: string) => {
    if (confirm('Are you sure you want to remove this crop from My Farm?')) {
      onUpdateFarmCrops(farmCrops.filter(c => c.id !== id));
    }
  };

  const handleAdvanceStage = (crop: FarmCrop) => {
    const cropMeta = allCrops.find(c => c.id === crop.cropId);
    if (!cropMeta) return;

    const maxIndex = cropMeta.growthTimeline.length - 1;
    const nextIndex = Math.min(maxIndex, crop.currentStageIndex + 1);

    const updated = farmCrops.map(c => 
      c.id === crop.id ? { ...c, currentStageIndex: nextIndex } : c
    );
    onUpdateFarmCrops(updated);
  };

  const handleSaveLog = () => {
    if (!logModal) return;
    const today = new Date().toISOString().split('T')[0];

    const updated = farmCrops.map(c => {
      if (c.id === logModal.crop.id) {
        if (logModal.type === 'water') {
          return {
            ...c,
            wateringLog: [{ date: today, note: logNote || 'Irrigation completed' }, ...c.wateringLog],
          };
        } else {
          return {
            ...c,
            fertilizerLog: [{ date: today, name: logNote || 'Fertilizer application logged' }, ...c.fertilizerLog],
          };
        }
      }
      return c;
    });

    onUpdateFarmCrops(updated);
    setLogModal(null);
    setLogNote('');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateTasks(updated);
  };

  const filteredTasks = (tasks || []).filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white p-5 sm:p-7 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 mb-2 border border-emerald-500/30">
            <Tractor className="w-3.5 h-3.5 text-emerald-300" />
            <span>Farm Management Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            My Farm & Active Crops
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Track growth timelines, log daily irrigation, monitor fertilizer schedules, and receive timely harvest reminders.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crop</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Active Crops</span>
          <span className="text-2xl font-black text-stone-900 font-mono mt-1 block">{farmCrops.length}</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Under cultivation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Farm Area</span>
          <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
            {farmCrops.reduce((sum, c) => sum + c.farmAreaAcre, 0).toFixed(1)} <span className="text-xs font-normal">Acres</span>
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Planted ground</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Pending Tasks</span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
            {(tasks || []).filter(t => !t.completed).length}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Actions due soon</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Completed Tasks</span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            {(tasks || []).filter(t => t.completed).length}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 block">Logs recorded</span>
        </div>
      </div>

      {/* ACTIVE CROPS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <span>Currently Cultivated Crops ({farmCrops.length})</span>
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            + Add Another Field
          </button>
        </div>

        {farmCrops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
            <Tractor className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">No active crops planted yet</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Select any recommended crop to add it to your farm dashboard and start receiving automatic stage reminders.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {farmCrops.map(crop => {
              const meta = allCrops.find(c => c.id === crop.cropId);
              if (!meta) return null;

              const plantDateObj = new Date(crop.plantingDate);
              const daysSince = Math.max(0, Math.floor((Date.now() - plantDateObj.getTime()) / (24 * 60 * 60 * 1000)));
              const currentStage = meta.growthTimeline[crop.currentStageIndex] || meta.growthTimeline[0];
              const isLastStage = crop.currentStageIndex >= meta.growthTimeline.length - 1;

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Card top banner */}
                  <div className="p-4 border-b border-stone-100 flex items-start justify-between gap-3 bg-stone-50/70">
                    <div className="flex items-center space-x-3">
                      <img
                        src={meta.image}
                        alt={meta.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                            {crop.cropName}
                          </h3>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {crop.farmAreaAcre} Acre(s)
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Planted on {new Date(crop.plantingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} ({daysSince} days ago)
                        </p>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                          Target Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Remove Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Growth Progress Tracker */}
                  <div className="p-4 space-y-3 flex-1">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-stone-700">
                          Current Stage: <strong className="text-emerald-800 font-extrabold">{currentStage.name}</strong>
                        </span>
                        <span className="text-[11px] font-mono font-bold text-stone-500">
                          Stage {crop.currentStageIndex + 1} of {meta.growthTimeline.length}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden flex">
                        {meta.growthTimeline.map((stg, i) => (
                          <div
                            key={i}
                            className={`h-full border-r border-white/50 transition-all ${
                              i <= crop.currentStageIndex ? 'bg-emerald-600' : 'bg-stone-200'
                            }`}
                            style={{ width: `${100 / meta.growthTimeline.length}%` }}
                            title={stg.name}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                        <span>{meta.growthTimeline[0].name}</span>
                        <span>{meta.growthTimeline[meta.growthTimeline.length - 1].name}</span>
                      </div>
                    </div>

                    {/* Stage Care Details */}
                    <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1 text-stone-700 border border-stone-200">
                      <div>
                        <span className="font-bold text-stone-900">🌾 Today's Care: </span>
                        <span>{currentStage.care}</span>
                      </div>
                      <div>
                        <span className="font-bold text-sky-800">💧 Water Requirement: </span>
                        <span>{currentStage.water}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800">🧪 Recommended Fertilizer: </span>
                        <span>{currentStage.fertilizer}</span>
                      </div>
                      {currentStage.warnings && (
                        <div>
                          <span className="font-bold text-rose-800">⚠️ Risk: </span>
                          <span className="text-rose-900">{currentStage.warnings}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Logging Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => setLogModal({ crop, type: 'water' })}
                        className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Droplets className="w-3.5 h-3.5 text-sky-600" />
                        <span>Log Water</span>
                      </button>

                      <button
                        onClick={() => setLogModal({ crop, type: 'fertilizer' })}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Log Fertilizer</span>
                      </button>

                      <button
                        disabled={isLastStage}
                        onClick={() => handleAdvanceStage(crop)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors ${
                          isLastStage
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                        title="Move to next growth stage"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>Next Stage</span>
                      </button>
                    </div>

                    {/* History chips */}
                    <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between">
                      <span>Last watered: {crop.wateringLog[0]?.date || 'None'}</span>
                      <span>Last fertilized: {crop.fertilizerLog[0]?.date || 'None'}</span>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-600">
                      Benchmark: {meta.yieldEstimates.minPerAcre}–{meta.yieldEstimates.maxPerAcre} {meta.yieldEstimates.unit}
                    </span>
                    <button
                      onClick={() => onSelectCropDetails(meta)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                    >
                      <span>Complete Protocol</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SMART FARMING REMINDERS & TASKS (FEATURE 8) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Smart Farming Reminders & Calendar</span>
            </h2>
            <p className="text-xs text-stone-500">
              Personalized tasks for timely watering, fertilizer top-dressing, and pest inspection.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
            {(['pending', 'completed', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTaskFilter(tab)}
                className={`text-xs px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  taskFilter === tab
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">
              No tasks found in this category. All clear for today!
            </p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-stone-50 border-stone-200 opacity-60'
                    : 'bg-white border-stone-200 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-300 bg-white'
                  }`}>
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold ${
                      task.completed ? 'line-through text-stone-500' : 'text-stone-900'
                    }`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Crop: <strong>{task.cropName}</strong> • Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                    task.type === 'watering' ? 'bg-sky-100 text-sky-800' :
                    task.type === 'fertilizer' ? 'bg-emerald-100 text-emerald-800' :
                    task.type === 'pest' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {task.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: ADD NEW CROP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900">Add Crop to My Farm</h3>
            <p className="text-xs text-stone-500">
              FARMY will automatically generate a tailored growth tracker and critical stage reminders.
            </p>

            <form onSubmit={handleAddCrop} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Crop</label>
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                >
                  {allCrops.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Farm Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={newArea}
                  onChange={(e) => setNewArea(parseFloat(e.target.value) || 1)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Planting / Sowing Date</label>
                <input
                  type="date"
                  value={newPlantingDate}
                  onChange={(e) => setNewPlantingDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Confirm & Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG WATER / FERTILIZER */}
      {logModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 flex items-center space-x-2">
              {logModal.type === 'water' ? (
                <>
                  <Droplets className="w-5 h-5 text-sky-600" />
                  <span>Log Watering for {logModal.crop.cropName}</span>
                </>
              ) : (
                <>
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Log Fertilizer for {logModal.crop.cropName}</span>
                </>
              )}
            </h3>

            <div className="text-xs space-y-2">
              <label className="block font-bold text-stone-700">Notes / Details</label>
              <input
                type="text"
                placeholder={logModal.type === 'water' ? 'e.g., 2 hours drip irrigation' : 'e.g., 25 kg Urea top dressed'}
                value={logNote}
                onChange={(e) => setLogNote(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setLogModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLog}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-xs"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
