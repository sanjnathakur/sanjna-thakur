import React, { useEffect, useState } from 'react';
import { WiThermometer, WiStrongWind, WiHumidity } from 'react-icons/wi';

function WeatherWidget({ locationName }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (locationName) {
      fetchWeather();
    }
  }, [locationName]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      // 1. Resolve geocoding using OSM Nominatim
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
      );
      const geoResult = await geoResponse.json();

      if (!geoResult || geoResult.length === 0) {
        throw new Error("Location not found");
      }

      const { lat, lon } = geoResult[0];

      // 2. Fetch real-time and 3-day forecast weather from Open-Meteo
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
      );
      const weatherResult = await weatherResponse.json();

      setWeatherData(weatherResult);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconAndText = (code) => {
    // Open-Meteo Weather Codes translation
    switch (code) {
      case 0:
        return { icon: '☀️', text: 'Clear Sky', bg: 'from-amber-400 to-orange-500' };
      case 1:
      case 2:
      case 3:
        return { icon: '⛅', text: 'Partly Cloudy', bg: 'from-blue-400 to-amber-300' };
      case 45:
      case 48:
        return { icon: '🌫️', text: 'Foggy', bg: 'from-slate-400 to-gray-500' };
      case 51:
      case 53:
      case 55:
        return { icon: '🌦️', text: 'Drizzle', bg: 'from-blue-300 to-cyan-500' };
      case 61:
      case 63:
      case 65:
        return { icon: '🌧️', text: 'Raining', bg: 'from-blue-500 to-indigo-600' };
      case 71:
      case 73:
      case 75:
      case 77:
        return { icon: '❄️', text: 'Snowy', bg: 'from-sky-300 to-blue-400' };
      case 80:
      case 81:
      case 82:
        return { icon: '🌦️', text: 'Rain Showers', bg: 'from-cyan-400 to-blue-500' };
      case 95:
      case 96:
      case 99:
        return { icon: '⛈️', text: 'Thunderstorm', bg: 'from-purple-600 to-slate-800' };
      default:
        return { icon: '☁️', text: 'Cloudy', bg: 'from-slate-300 to-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-xl shadow-blue-900/5 h-[230px] flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-sm font-semibold">Fetching Weather...</p>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-xl shadow-blue-900/5 h-[230px] flex flex-col justify-center items-center text-center">
        <span className="text-3xl">🌦️</span>
        <p className="text-slate-500 mt-3 text-sm font-bold">Weather Unavailable</p>
        <p className="text-slate-400 text-xs mt-1">Unable to load climate data for this location.</p>
      </div>
    );
  }

  const current = weatherData?.current_weather;
  const daily = weatherData?.daily;
  const weather = getWeatherIconAndText(current?.weathercode);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-blue-900/5 flex flex-col justify-between h-[230px] hover:shadow-xl hover:border-slate-200 transition-all duration-300 animate-slide-up">
      
      {/* Widget Header & Current Weather */}
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-wider uppercase text-blue-600 bg-blue-50 rounded-full">
            Live Weather
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg mt-2 truncate max-w-[150px] sm:max-w-[200px]" title={locationName}>
            {locationName}
          </h3>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">{weather.text}</p>
        </div>
        
        {/* Dynamic Condition Icon and Temperature */}
        <div className="flex items-center gap-2">
          <span className="text-4xl filter drop-shadow-sm select-none">{weather.icon}</span>
          <span className="text-3xl font-black text-slate-800 tracking-tighter">
            {Math.round(current?.temperature)}°C
          </span>
        </div>
      </div>

      {/* Weather Attributes Row */}
      <div className="flex gap-4 py-2 border-y border-slate-50 my-2">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <WiStrongWind className="text-blue-500 text-xl" />
          <span className="font-semibold">{current?.windspeed} km/h</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <WiThermometer className="text-red-500 text-xl" />
          <span className="font-semibold">Wind Dir: {current?.winddirection}°</span>
        </div>
      </div>

      {/* 3-Day Horizontal Forecast Row */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        {daily?.time?.slice(0, 3).map((time, idx) => {
          const forecastWeather = getWeatherIconAndText(daily?.weathercode[idx]);
          return (
            <div key={idx} className="bg-slate-50/50 border border-slate-100/30 rounded-xl p-1.5 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{idx === 0 ? 'Today' : getDayName(time)}</span>
              <span className="text-base my-0.5 filter drop-shadow-xs">{forecastWeather.icon}</span>
              <span className="text-[10px] font-black text-slate-700">
                {Math.round(daily?.temperature_2m_max[idx])}°/{Math.round(daily?.temperature_2m_min[idx])}°
              </span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

export default WeatherWidget;
