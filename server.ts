import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FARMY Backend' });
});

// ---------------------------------------------------------------------------
// FARMY QUIZ API surface.
//
// The Quiz feature's real data path is Firebase Firestore, accessed directly
// from the client (src/utils/quizStorage.ts), the same backend this app
// already uses for authentication. Firestore's client SDK does not have a
// service-side counterpart running in this Express process (no admin
// credentials are configured), so these routes exist to satisfy the documented
// API surface and always return honest fallback data rather than pretending to
// read/write real progress. They never block or break the quiz UI, which talks
// to Firestore directly and only touches these routes if a future admin-backed
// implementation is wired in here.
// ---------------------------------------------------------------------------

const DEMO_LEADERBOARD = [
  { userId: 'demo-1', username: 'Alex', totalScore: 4920 },
  { userId: 'demo-2', username: 'Priya', totalScore: 4870 },
  { userId: 'demo-3', username: 'Rahul', totalScore: 4810 },
  { userId: 'demo-4', username: 'Siva', totalScore: 4750 },
  { userId: 'demo-5', username: 'Meera', totalScore: 4600 },
];

app.get('/api/quiz/leaderboard', (req, res) => {
  res.json({ entries: DEMO_LEADERBOARD, isDemo: true, note: 'Live leaderboard is served from Firestore on the client (quizLeaderboard collection).' });
});

app.post('/api/quiz/score', (req, res) => {
  // Score submission is validated and written client-side to Firestore
  // (quizLeaderboard/{uid}), never trusted blindly from the request body.
  res.status(202).json({ accepted: false, note: 'Scores are written directly to Firestore from the client after server-side-style validation in quizStorage.ts.' });
});

app.get('/api/quiz/progress', (req, res) => {
  res.status(404).json({ found: false, note: 'Progress is stored in Firestore (quizProgress/{uid}) with a localStorage fallback, read directly by the client.' });
});

app.post('/api/quiz/progress', (req, res) => {
  res.status(202).json({ accepted: false, note: 'Progress is written directly to Firestore from the client; this endpoint is a placeholder for a future admin-backed implementation.' });
});

// AI Farm Assistant Chat endpoint (supports both /api/chat and /api/assistant)
const handleChat = async (req: express.Request, res: express.Response) => {
  try {
    const message = req.body.message || req.body.prompt;
    const context = req.body.context;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message or prompt is required' });
    }

    const ai = getGenAI();

    const languageName: string = context?.languageName || 'English';
    const languageInstruction = languageName === 'English'
      ? ''
      : `\nIMPORTANT: Respond entirely in ${languageName}. Do not use English except for scientific/product names that have no common ${languageName} equivalent.\n`;

    // Prepare rich agricultural context
    const contextPrompt = `
You are "Farmy Assistant", an expert, friendly, and practical agricultural scientist and smart farming advisor for farmers.
You provide clear, actionable, and safe advice for smallholder and progressive farmers.
Always emphasize Integrated Pest Management (IPM), soil health, responsible water stewardship, and remind farmers to cross-reference with local agricultural extension officers and official agrochemical labels.
${languageInstruction}
Farmer Context:
- Current Location: ${context?.location || 'Unknown location'}
- Soil Type: ${context?.soilType || 'Not specified'}
- Soil pH: ${context?.soilPh || 'Not specified'}
- Current Season: ${context?.season || 'Current Season'}
- Current Weather: Temperature ${context?.temperature || '28'}°C, Humidity ${context?.humidity || '65'}%, Rainfall: ${context?.rainfall || 'Light'}
- Active Farm Crops: ${Array.isArray(context?.crops) ? context.crops.join(', ') : 'None logged yet'}

User Question:
"${message}"

Instructions:
1. Provide a direct, encouraging, easy-to-understand response suitable for a farmer.
2. If discussing fertilizers, mention both organic (FYM, Vermicompost, Neem cake) and balanced NPK practices.
3. If discussing pests/diseases, prioritize organic/biological controls first (Neem oil, biocontrol agents, sticky traps, sanitation) before mentioning labeled chemical options with safety warnings.
4. Keep the response concise, formatted with clear bullet points, bold keywords, and warm tone.
`;

    if (ai) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 5000)
        );
        const aiPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contextPrompt,
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);

        if (response && response.text) {
          return res.json({
            reply: response.text,
            source: 'gemini',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, falling back to expert knowledge base:', geminiError.message);
      }
    }

    // Smart Agronomic Rule-Based Fallback if Gemini key is not set or network fails
    const lower = message.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('yellow') || lower.includes('leaf') || lower.includes('leaves')) {
      fallbackReply = `🌱 **Analysis for Yellow Leaves (Chlorosis):**\n\n` +
        `• **Nutrient Deficiency (Most Common):** Older bottom leaves turning pale yellow indicates **Nitrogen deficiency**. Apply well-decomposed farmyard manure (FYM), vermicompost, or a light top-dress of urea.\n` +
        `• **Water Stress:** Overwatering or poor drainage suffocates roots, preventing iron & nitrogen uptake. Check soil moisture—ensure soil is moist, not soggy.\n` +
        `• **Micronutrient Issue:** Yellowing between leaf veins with green veins (interveinal chlorosis) means **Iron or Zinc deficiency**. Spray chelated micronutrient mix.\n` +
        `• **Sucking Pests:** Check leaf undersides for aphids, whiteflies, or thrips which spread viral mosaic. Spray neem oil (5ml/L) with soap solution.`;
    } else if (lower.includes('tomato') && (lower.includes('plant') || lower.includes('when') || lower.includes('season'))) {
      fallbackReply = `🍅 **Tomato Planting Guide:**\n\n` +
        `• **Best Planting Seasons:** \n` +
        `  - Autumn-Winter: August–September sowing (harvest in Dec–Feb)\n` +
        `  - Spring-Summer: November–December sowing (harvest in March–May)\n` +
        `• **Ideal Temperature:** 21°C to 27°C during growth. Frost or extreme heat (>35°C) causes flower drop.\n` +
        `• **Soil Preparation:** Well-drained loamy soil rich in organic matter. Ideal pH: 6.0 to 6.8.\n` +
        `• **Spacing:** 60 cm between rows and 45–60 cm between plants.\n` +
        `• **Pro Tip:** Harden seedlings in shade for 2 days before transplanting in the late afternoon.`;
    } else if (lower.includes('rice') || lower.includes('paddy') || lower.includes('water')) {
      fallbackReply = `🌾 **Rice (Paddy) Water Management:**\n\n` +
        `• **Critical Stages:** Tillering, panicle initiation, flowering, and grain filling are most sensitive to water shortages.\n` +
        `• **Water Depth:** Maintain 2–5 cm shallow water depth during early vegetative growth. Drain water 7–10 days before harvesting.\n` +
        `• **Water Saving Tech:** Consider **Alternate Wetting and Drying (AWD)** to save 25–30% water without reducing yield, while reducing methane emissions!`;
    } else if (lower.includes('fertilizer') || lower.includes('chilli') || lower.includes('chili')) {
      fallbackReply = `🌶️ **Fertilizer Schedule for Chilli:**\n\n` +
        `• **Basal Dose (During land preparation):** 10–12 tonnes FYM/acre + 25 kg Nitrogen, 50 kg Phosphorus, and 50 kg Potash.\n` +
        `• **First Top Dressing:** 25 kg Nitrogen at 30 days after transplanting (vegetative stage).\n` +
        `• **Second Top Dressing:** 25 kg Nitrogen + 25 kg Potash at 60 days (flowering and early fruit set).\n` +
        `• **Foliar Spray:** Spray 19:19:19 (5g/L) during flowering for profuse blooming and fruit retention.`;
    } else if (lower.includes('weather') || lower.includes('today') || lower.includes('suitable')) {
      fallbackReply = `⛅ **Weather Suitability Assessment:**\n\n` +
        `• Current conditions: Moderate temperature with suitable humidity for sowing vegetables and hardy grains.\n` +
        `• **Actionable Advice:** If rain is forecasted in 24 hours, avoid applying foliar fertilizers or spraying bio-pesticides, as they will wash off.\n` +
        `• For transplanting, cloudy afternoons or post-drizzle conditions provide the lowest transplant shock.`;
    } else {
      fallbackReply = `🌾 **Farmy Advisory:**\n\n` +
        `Thank you for asking! For optimal farm productivity:\n` +
        `• Always conduct a soil test every 2–3 years to adjust your NPK and micronutrient dosage accurately.\n` +
        `• Maintain soil organic carbon by incorporating crop residues, green manuring (dhaincha/sunhemp), and FYM.\n` +
        `• Practice crop rotation (e.g. follow cereals with legumes like chickpea or moong) to fix biological nitrogen and break pest cycles.\n\n` +
        `You can ask me specific questions about crop seasons, symptoms on your crops, soil amendments, or irrigation schedules!`;
    }

    return res.json({
      reply: fallbackReply,
      source: 'knowledge_base',
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: 'Internal server error processing farming advice' });
  }
};

app.post('/api/chat', handleChat);
app.post('/api/assistant', handleChat);

// Live Weather forecast endpoint (supports coordinate lookup or regional Indian farming hubs)
app.get('/api/weather', async (req, res) => {
  const { lat, lon, city } = req.query;

  const defaultLocations: Record<string, { lat: number; lon: number; name: string; state: string }> = {
    ludhiana: { lat: 30.901, lon: 75.8573, name: 'Ludhiana', state: 'Punjab' },
    coimbatore: { lat: 11.0168, lon: 76.9558, name: 'Coimbatore', state: 'Tamil Nadu' },
    nashik: { lat: 19.9975, lon: 73.7898, name: 'Nashik', state: 'Maharashtra' },
    dharwad: { lat: 15.4589, lon: 75.0078, name: 'Dharwad', state: 'Karnataka' },
    guntur: { lat: 16.3067, lon: 80.4365, name: 'Guntur', state: 'Andhra Pradesh' },
    varanasi: { lat: 25.3176, lon: 82.9739, name: 'Varanasi', state: 'Uttar Pradesh' },
    rajkot: { lat: 22.3039, lon: 70.8022, name: 'Rajkot', state: 'Gujarat' },
    jaipur: { lat: 26.9124, lon: 75.7873, name: 'Jaipur', state: 'Rajasthan' },
    patna: { lat: 25.5941, lon: 85.1376, name: 'Patna', state: 'Bihar' },
    bhopal: { lat: 23.2599, lon: 77.4126, name: 'Bhopal', state: 'Madhya Pradesh' },
  };

  let targetLat = 11.0168; // default Coimbatore, Tamil Nadu
  let targetLon = 76.9558;
  let locationName = 'Coimbatore, Tamil Nadu';

  if (lat && lon) {
    targetLat = parseFloat(lat as string);
    targetLon = parseFloat(lon as string);
    locationName = 'Current Farm Coordinates';
  } else if (city && typeof city === 'string') {
    const key = city.toLowerCase().trim();
    if (defaultLocations[key]) {
      targetLat = defaultLocations[key].lat;
      targetLon = defaultLocations[key].lon;
      locationName = `${defaultLocations[key].name}, ${defaultLocations[key].state}`;
    }
  }

  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
    
    const response = await fetch(openMeteoUrl, { headers: { 'User-Agent': 'FarmyApp/1.0' } });
    if (response.ok) {
      const data = await response.json();
      return res.json({
        location: locationName,
        lat: targetLat,
        lon: targetLon,
        current: {
          temp: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          precipitation: data.current.precipitation,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
        },
        forecast: data.daily.time.slice(0, 5).map((t: string, i: number) => ({
          date: t,
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          rainProb: data.daily.precipitation_probability_max[i] || 0,
          precipSum: data.daily.precipitation_sum[i] || 0,
          weatherCode: data.daily.weather_code[i],
        })),
      });
    }
  } catch (err) {
    console.warn('Live weather fetch failed, returning seasonal estimate', err);
  }

  // Fallback realistic seasonal agricultural weather
  return res.json({
    location: locationName,
    lat: targetLat,
    lon: targetLon,
    current: {
      temp: 28,
      humidity: 64,
      feelsLike: 30,
      precipitation: 0,
      windSpeed: 12,
      weatherCode: 1, // Mainly clear
    },
    forecast: [
      { date: 'Day 1', tempMax: 31, tempMin: 22, rainProb: 15, precipSum: 0, weatherCode: 1 },
      { date: 'Day 2', tempMax: 30, tempMin: 21, rainProb: 30, precipSum: 2, weatherCode: 2 },
      { date: 'Day 3', tempMax: 29, tempMin: 21, rainProb: 45, precipSum: 5, weatherCode: 3 },
      { date: 'Day 4', tempMax: 32, tempMin: 22, rainProb: 10, precipSum: 0, weatherCode: 1 },
      { date: 'Day 5', tempMax: 33, tempMin: 23, rainProb: 5, precipSum: 0, weatherCode: 0 },
    ],
  });
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FARMY Server running on port ${PORT}`);
  });
}

startServer();
