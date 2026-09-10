import { Crop, WeatherData } from '../types';

export interface WeatherCropComparison {
  status: 'suitable' | 'warning' | 'unsuitable';
  headline: string;
  suitabilityScore: number;
  details: {
    tempStatus: { ok: boolean; message: string };
    humidityStatus: { ok: boolean; message: string };
    rainStatus: { ok: boolean; message: string };
    actionableTips: string[];
  };
}

export function compareWeatherWithCrop(
  weather: WeatherData,
  crop: Crop
): WeatherCropComparison {
  const currentTemp = weather.current.temp;
  const currentHumidity = weather.current.humidity;
  const currentRain = weather.current.precipitation;
  const hasUpcomingRain = weather.forecast.some(f => f.rainProb > 40 || f.precipSum > 2);

  const tips: string[] = [];
  let score = 100;

  // 1. Temperature check
  const { idealTempMin, idealTempMax } = crop.bestSeason;
  let tempOk = true;
  let tempMsg = '';

  if (currentTemp >= idealTempMin && currentTemp <= idealTempMax) {
    tempMsg = `Current temp (${currentTemp}°C) is in the ideal range (${idealTempMin}°C – ${idealTempMax}°C).`;
  } else if (currentTemp < idealTempMin) {
    const diff = idealTempMin - currentTemp;
    if (diff <= 4) {
      tempMsg = `Temp is slightly cooler (${currentTemp}°C) than ideal (${idealTempMin}°C). Growth may slow down moderately.`;
      score -= 15;
      tips.push('Consider mulching the soil bed to keep root zone warmer at night.');
    } else {
      tempOk = false;
      tempMsg = `❌ Current temperature (${currentTemp}°C) is too cold for ${crop.name} (minimum recommended is ${idealTempMin}°C). Risk of stunted growth or frost injury.`;
      score -= 40;
      tips.push('Use row covers or polytunnel protection to avoid cold shock.');
    }
  } else {
    const diff = currentTemp - idealTempMax;
    if (diff <= 4) {
      tempMsg = `Temp is slightly hot (${currentTemp}°C) for ${crop.name} (ideal max ${idealTempMax}°C).`;
      score -= 15;
      tips.push('Ensure consistent morning irrigation to keep root zone cooled.');
    } else {
      tempOk = false;
      tempMsg = `❌ Current temperature (${currentTemp}°C) is excessively hot for ${crop.name} (ideal max is ${idealTempMax}°C). High danger of flower drop and pollen desiccation.`;
      score -= 40;
      tips.push('Provide light shade netting (30–50%) or irrigate frequently via drip lines.');
    }
  }

  // 2. Humidity check
  let humidityOk = true;
  let humidityMsg = '';

  if (currentHumidity >= crop.weatherReq.minHumidity && currentHumidity <= crop.weatherReq.maxHumidity) {
    humidityMsg = `Relative humidity (${currentHumidity}%) is well-balanced for foliage and pollination.`;
  } else if (currentHumidity > crop.weatherReq.maxHumidity) {
    humidityOk = false;
    humidityMsg = `⚠️ Humidity is too high (${currentHumidity}%) for this crop. Risk of fungal leaf spot, blight, and downy mildew increases substantially.`;
    score -= 25;
    tips.push('Avoid overhead sprinkler irrigation. Ensure wide plant spacing and aerate foliage.');
    tips.push('Keep preventative bio-fungicides (Trichoderma or Copper spray) on hand if overcast persists.');
  } else {
    humidityMsg = `Humidity is low (${currentHumidity}%). Air is dry; evaporation from leaves will be rapid.`;
    score -= 10;
    tips.push('Check soil moisture regularly. Monitor for red spider mites which thrive in dry microclimates.');
  }

  // 3. Rain forecast check
  let rainOk = true;
  let rainMsg = '';

  if (hasUpcomingRain) {
    rainMsg = `Rain forecasted in coming days. Helps reduce irrigation, but monitor water stagnation in low areas.`;
    tips.push('Do NOT spray pesticides or apply urea before forecasted rain; they will wash off into drainage.');
    if (crop.waterMgmt.level === 'Low') {
      rainOk = false;
      score -= 15;
      tips.push(`${crop.name} prefers dry conditions; ensure field ditches are clear of weeds to evacuate excess runoff quickly.`);
    }
  } else {
    rainMsg = `Dry weather ahead. Ideal for field plowing, transplanting, and foliar spray operations.`;
  }

  const finalScore = Math.max(10, Math.min(100, score));

  let status: WeatherCropComparison['status'] = 'suitable';
  let headline = `✅ Weather is suitable for growing ${crop.name}`;

  if (finalScore < 50 || !tempOk) {
    status = 'unsuitable';
    headline = `❌ Current temperature/weather is unsuitable for ${crop.name}`;
  } else if (finalScore < 75 || !humidityOk) {
    status = 'warning';
    headline = `⚠️ Weather conditions are marginal for ${crop.name}. Proactive care needed.`;
  }

  return {
    status,
    headline,
    suitabilityScore: finalScore,
    details: {
      tempStatus: { ok: tempOk, message: tempMsg },
      humidityStatus: { ok: humidityOk, message: humidityMsg },
      rainStatus: { ok: rainOk, message: rainMsg },
      actionableTips: tips,
    },
  };
}
