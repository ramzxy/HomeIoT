import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Enschede coordinates: 52.2215° N, 6.8937° E
        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast?latitude=52.2215&longitude=6.8937&current=temperature_2m,relative_humidity_2m,weather_code'
        );
        setWeather(response.data.current);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to load weather");
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherDescription = (code) => {
    // Simplified WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  if (loading) return <div className="card weather-card loading">Loading weather...</div>;
  if (error) return <div className="card weather-card error">{error}</div>;

  return (
    <div className="card weather-card">
      <h3>Enschede Weather</h3>
      <div className="weather-content">
        <div className="weather-main">
          <span className="weather-temp">{weather.temperature_2m}°C</span>
          <span className="weather-desc">{getWeatherDescription(weather.weather_code)}</span>
        </div>
        <div className="weather-details">
          <div className="detail-item">
            <span className="label">Humidity</span>
            <span className="value">{weather.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
