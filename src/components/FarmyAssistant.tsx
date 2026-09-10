import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, RefreshCw, AlertCircle, 
  HelpCircle, MessageSquare, Sprout, CornerDownLeft, Volume2
} from 'lucide-react';
import { FarmCrop, SoilReport, WeatherData } from '../types';
import { Language, translations } from '../utils/translations';

interface FarmyAssistantProps {
  farmCrops: FarmCrop[];
  soilReport: SoilReport;
  weather: WeatherData | null;
  location: string;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FarmyAssistant: React.FC<FarmyAssistantProps> = ({
  farmCrops,
  soilReport,
  weather,
  location,
  language,
}) => {
  const t = translations[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello, Farmer! I am your FARMY Intelligent Assistant. You can ask me anything about crop planting dates, fertilizer schedules, watering needs, pest symptoms, or soil amendments. How can I help your farm today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'When should I plant tomato?',
    'Why are my leaves turning yellow?',
    'How much water does rice need?',
    'Which fertilizer is good for chilli?',
    "Is today's weather suitable for planting?",
    'How do I control Fall Armyworm in maize?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      // Build context for the AI
      const farmContext = {
        location,
        activeCrops: farmCrops.map(c => `${c.cropName} (${c.farmAreaAcre} acres, planted ${c.plantingDate})`).join(', '),
        soilInfo: `Type: ${soilReport.soilType}, pH: ${soilReport.ph}, N: ${soilReport.nitrogenLevel}, P: ${soilReport.phosphorusLevel}, K: ${soilReport.potassiumLevel}`,
        weatherInfo: weather ? `Temp: ${Math.round(weather.current.temp)}°C, Humidity: ${weather.current.humidity}%, Condition: ${weather.current.condition}` : 'Not available',
        language,
      };

      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: farmContext,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const reply = data.reply || getOfflineFarmerAdvice(textToSend);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Backend Assistant unavailable, using local expert agricultural database', err);
      // Fallback response from internal expert engine
      const offlineReply = getOfflineFarmerAdvice(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive offline fallback answering core farming questions accurately
  function getOfflineFarmerAdvice(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('tomato') && (q.includes('when') || q.includes('season') || q.includes('plant'))) {
      return `🍅 **Tomato Planting Guide:**\n- **Best Season:** June–July (Kharif) and October–November (Rabi).\n- **Optimal Temperature:** 21°C – 28°C.\n- **Transplanting:** Use 25–30 day old vigorous seedlings.\n- **Spacing:** 60 cm between rows and 45 cm between plants.\n- **Pro Tip:** Provide bamboo staking before flowering to prevent fruit rot and increase marketable yield by 25%.`;
    }
    if (q.includes('yellow') && (q.includes('leaf') || q.includes('leaves'))) {
      return `🍂 **Why Leaves Turn Yellow (Chlorosis):**\n1. **Nitrogen Deficiency:** Older lower leaves turn pale yellow first. Remedy: Top-dress well-rotted compost or urea in moist soil.\n2. **Overwatering / Waterlogging:** Suffocates root hairs, preventing nutrient absorption. Check drainage furrows.\n3. **Iron Deficiency (in alkaline soils pH > 7.5):** New young leaves turn yellow while veins stay green. Remedy: Foliar spray Ferrous Sulfate (FeSO4 0.5%).\n4. **Viral Infection (Whitefly transmission):** Mottled bright yellow mosaic patterns. Remove infected plants and install yellow sticky traps.`;
    }
    if (q.includes('rice') && (q.includes('water') || q.includes('irrigation'))) {
      return `🌾 **Rice Water Requirements:**\n- **Total Water:** 1200 – 1400 mm over 120–135 days.\n- **Critical Stages:** Panicle initiation, booting, flowering, and early milk stage require continuous 3–5 cm water depth.\n- **Water-Saving Practice (AWD):** Practice Alternate Wetting and Drying during vegetative tillering to save up to 30% water without yield reduction. Drain field 10 days before harvest to hasten uniform grain ripening.`;
    }
    if (q.includes('chilli') && (q.includes('fertilizer') || q.includes('npk'))) {
      return `🌶️ **Chilli Fertilizer Schedule:**\n- **Target NPK:** 120:60:60 kg/ha.\n- **Basal (Day 0):** Apply 10 tonnes FYM/acre + 100% Phosphorus + 50% Potash + 25% Nitrogen.\n- **First Top Dress (Day 30):** 50% Nitrogen during rapid vegetative branching.\n- **Flowering / Fruiting (Day 60):** Remaining 25% Nitrogen + 50% Potash to promote flower retention and glossy pod luster.\n- **Micronutrients:** Foliar spray 0.2% Boron and 0.5% Zinc Sulfate at flower bud initiation.`;
    }
    if (q.includes('weather') || q.includes('today')) {
      const curTemp = weather ? `${Math.round(weather.current.temp)}°C` : 'current temperature';
      const curHum = weather ? `${weather.current.humidity}%` : 'humidity';
      return `🌦️ **Weather Suitability Check for ${location}:**\n- Current ambient conditions: **${curTemp}**, humidity **${curHum}**.\n- Field advice: Ensure irrigation is scheduled in early mornings to minimize solar evaporation. If rainfall is forecasted, withhold pesticide spraying to prevent chemical wash-off into irrigation channels.`;
    }
    if (q.includes('fall armyworm') || q.includes('maize')) {
      return `🌽 **Fall Armyworm Management in Maize:**\n- **Scouting:** Check leaf whorls for pin-holes and fresh sawdust-like frass.\n- **Organic Action:** Pour neem cake powder or dry wood ash mixed with fine river sand (1:9 ratio) directly into the central leaf whorl.\n- **Biological:** Install pheromone traps @ 5 per acre.\n- **Chemical threshold:** If >10% whorls show active caterpillars, apply Spinetoram 11.7% SC (0.5 ml/L) directed straight into the whorl. Observe 14-day harvest wait time.`;
    }

    return `🌾 **Agro-Advisory for ${location}:**\nBased on your active crops (${farmCrops.map(c => c.cropName).join(', ') || 'Tomato & Chilli'}) and current soil profile (pH ${soilReport.ph}):\n- Always maintain soil organic carbon above 0.75% using annual farmyard manure or vermicompost.\n- Scout crops twice weekly for early signs of sucking pests (aphids, thrips, whiteflies).\n- Feel free to ask about a specific crop, symptom, or watering schedule!`;
  }

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white p-4 sm:p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white">FARMY AI Assistant</h1>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-500 text-stone-900 px-2 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Trained on Agricultural University crop protocols & extension manuals
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white text-xs flex items-center space-x-1"
          title="Reset Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-xs">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 px-1">
          Frequently Asked Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-xs bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 px-3 py-1.5 rounded-full transition-colors font-medium text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === 'user'
                ? 'bg-stone-800 text-white'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-stone-900 text-white rounded-tr-none'
                : 'bg-stone-50 text-stone-800 border border-stone-200 rounded-tl-none space-y-1.5'
            }`}>
              <div className="whitespace-pre-line font-normal">
                {msg.text}
              </div>
              <div className={`text-[10px] font-mono mt-1 ${
                msg.sender === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-stone-400 text-xs italic pl-10">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
            <span>FARMY is preparing agricultural advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 sm:p-3 shadow-md flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask FARMY any crop question (e.g. fertilizer for brinjal, whitefly cure)..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 text-xs sm:text-sm bg-transparent px-3 py-2 text-stone-800 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
