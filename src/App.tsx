import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { CropCatalog } from './components/CropCatalog';
import { CropRecommendation } from './components/CropRecommendation';
import { MyFarm } from './components/MyFarm';
import { FarmyAssistant } from './components/FarmyAssistant';
import { ToolsMenu } from './components/ToolsMenu';
import { CropDetailsModal } from './components/CropDetailsModal';
import { AuthPage } from './components/AuthPage';
import { auth, onAuthStateChanged, signOut, User } from './firebase';
import { Crop, FarmCrop, FarmingTask, SoilReport, WeatherData } from './types';
import { allCrops } from './data/cropsIndex';
import { 
  loadSavedFarmCrops, saveFarmCrops, 
  loadSavedTasks, saveTasks, 
  loadSavedSoilReport, saveSoilReport, 
  loadSavedLocation, saveLocation, 
  loadSavedLanguage, saveLanguage 
} from './utils/storage';
import { Language, translations } from './utils/translations';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toolsSubTab, setToolsSubTab] = useState<'soil' | 'weather' | 'pest' | 'calculator' | null>(null);

  // User Preferences & State
  const [language, setLanguage] = useState<Language>(loadSavedLanguage());
  const [selectedLocation, setSelectedLocation] = useState<string>(loadSavedLocation());
  const [soilReport, setSoilReport] = useState<SoilReport>(loadSavedSoilReport());
  const [farmCrops, setFarmCrops] = useState<FarmCrop[]>(loadSavedFarmCrops());
  const [tasks, setTasks] = useState<FarmingTask[]>(loadSavedTasks());

  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  // Modal State
  const [selectedCropModal, setSelectedCropModal] = useState<Crop | null>(null);

  const t = translations[language];

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.removeItem('farmy_demo_user');
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    localStorage.removeItem('farmy_demo_user');
    setCurrentUser(null);
  };

  // Fetch live agro-meteorological weather
  const fetchWeather = async (locName: string) => {
    setWeatherLoading(true);
    try {
      const cityParam = locName.split(',')[0].trim().toLowerCase();
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityParam)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.warn('Could not fetch live weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  // Handle location update
  const handleLocationChange = (newLoc: string) => {
    setSelectedLocation(newLoc);
    saveLocation(newLoc);
  };

  // Handle language update
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    saveLanguage(newLang);
  };

  // Handle Soil Report Update
  const handleSaveSoilReport = (report: SoilReport) => {
    setSoilReport(report);
    saveSoilReport(report);
  };

  // Handle Farm Crops Update
  const handleUpdateFarmCrops = (updated: FarmCrop[]) => {
    setFarmCrops(updated);
    saveFarmCrops(updated);
  };

  // Handle Tasks Update
  const handleUpdateTasks = (updated: FarmingTask[]) => {
    setTasks(updated);
    saveTasks(updated);
  };

  // Quick Add crop to farm
  const handleQuickAddToFarm = (crop: Crop) => {
    const totalDays = crop.growthTimeline.reduce((sum, s) => sum + s.durationDays, 0);
    const today = new Date().toISOString().split('T')[0];
    const harvestDate = new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newFarmCrop: FarmCrop = {
      id: `farm-crop-${Date.now()}`,
      cropId: crop.id,
      cropName: crop.name,
      farmAreaAcre: 1.0,
      plantingDate: today,
      currentStageIndex: 0,
      wateringLog: [{ date: today, note: 'Initial field soaking' }],
      fertilizerLog: [{ date: today, name: 'Basal FYM organic application' }],
      pestIssues: [],
      expectedHarvestDate: harvestDate,
      notes: 'Added from FARMY catalog',
    };

    const newTasks: FarmingTask[] = [
      {
        id: `task-${Date.now()}-1`,
        cropId: crop.id,
        cropName: crop.name,
        title: `Irrigation Check: ${crop.name} Establishment`,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'watering',
        completed: false,
        priority: 'high',
      },
      {
        id: `task-${Date.now()}-2`,
        cropId: crop.id,
        cropName: crop.name,
        title: `Scout for Early Stage Pests on ${crop.name}`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'pest',
        completed: false,
        priority: 'medium',
      },
    ];

    handleUpdateFarmCrops([newFarmCrop, ...farmCrops]);
    handleUpdateTasks([...newTasks, ...tasks]);
    setActiveTab('myfarm');
  };

  const pendingTasksCount = (tasks || []).filter(t => !t.completed).length;

  // Show loading state while Firebase auth status is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#041209] flex flex-col items-center justify-center text-white select-none">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
        </div>
        <h2 className="text-xl font-bold tracking-wider text-amber-400 font-serif">SPARK</h2>
        <p className="text-xs text-emerald-300/70 font-medium tracking-wide mt-1">Starting FARMY...</p>
      </div>
    );
  }

  // If not authenticated (or email unverified), show the dedicated AgriTech Auth Page
  if (!currentUser) {
    return (
      <AuthPage 
        onAuthSuccess={(user) => setCurrentUser(user)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col selection:bg-emerald-200">
      {/* Primary Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        weather={weather}
        tasks={tasks}
        onOpenNotifications={() => setActiveTab('myfarm')}
        onOpenWeather={() => {
          setActiveTab('tools');
          setToolsSubTab('weather');
        }}
        user={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
        {activeTab === 'home' && (
          <HomeScreen
            weather={weather}
            farmCrops={farmCrops}
            tasks={tasks}
            onSelectCrop={(crop) => setSelectedCropModal(crop)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'tools') setToolsSubTab(null);
            }}
            language={language}
          />
        )}

        {activeTab === 'crops' && (
          <CropCatalog
            onSelectCrop={(crop) => setSelectedCropModal(crop)}
            onAddToFarm={handleQuickAddToFarm}
            language={language}
          />
        )}

        {activeTab === 'recommend' && (
          <CropRecommendation
            currentSoilReport={soilReport}
            weather={weather}
            onSelectCrop={(crop) => setSelectedCropModal(crop)}
            onAddToFarm={handleQuickAddToFarm}
            language={language}
          />
        )}

        {activeTab === 'myfarm' && (
          <MyFarm
            farmCrops={farmCrops}
            onUpdateFarmCrops={handleUpdateFarmCrops}
            tasks={tasks}
            onUpdateTasks={handleUpdateTasks}
            onSelectCropDetails={(crop) => setSelectedCropModal(crop)}
            language={language}
          />
        )}

        {activeTab === 'assistant' && (
          <FarmyAssistant
            farmCrops={farmCrops}
            soilReport={soilReport}
            weather={weather}
            location={selectedLocation}
            language={language}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsMenu
            initialSubTool={toolsSubTab}
            soilReport={soilReport}
            onSaveSoilReport={handleSaveSoilReport}
            weather={weather}
            onRefreshWeather={() => fetchWeather(selectedLocation)}
            selectedLocation={selectedLocation}
            onSelectCrop={(crop) => setSelectedCropModal(crop)}
            language={language}
          />
        )}
      </main>

      {/* Global Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'tools') setToolsSubTab(null);
        }}
        pendingTasksCount={pendingTasksCount}
        language={language}
      />

      {/* 360-Degree Full Crop Protocol Modal */}
      {selectedCropModal && (
        <CropDetailsModal
          crop={selectedCropModal}
          onClose={() => setSelectedCropModal(null)}
          onAddToFarm={handleQuickAddToFarm}
          onCalculateProfit={(crop) => {
            setSelectedCropModal(null);
            setToolsSubTab('calculator');
            setActiveTab('tools');
          }}
          weather={weather}
          language={language}
        />
      )}
    </div>
  );
}
