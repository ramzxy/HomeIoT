import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Enschede coordinates: 52.2215° N, 6.8937° E
        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast?latitude=52.2215&longitude=6.8937&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m'
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

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={48} className="weather-icon sun" />;
    if (code >= 1 && code <= 3) return <Cloud size={48} className="weather-icon cloud" />;
    if (code >= 45 && code <= 48) return <CloudFog size={48} className="weather-icon fog" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle size={48} className="weather-icon drizzle" />;
    if (code >= 61 && code <= 65) return <CloudRain size={48} className="weather-icon rain" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={48} className="weather-icon snow" />;
    if (code >= 80 && code <= 82) return <CloudRain size={48} className="weather-icon shower" />;
    if (code >= 95 && code <= 99) return <CloudLightning size={48} className="weather-icon thunder" />;
    return <Cloud size={48} className="weather-icon unknown" />;
  };

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  if (loading) return <div className="card weather-card loading">Loading weather...</div>;
  if (error) return <div className="card weather-card error">{error}</div>;

  return (
    <div className="card weather-card">
      <div className="weather-header">
        <h3>Enschede</h3>
        <span className="weather-time">Now</span>
      </div>
      
      <div className="weather-content-wrapper">
        <div className="weather-main-display">
          {getWeatherIcon(weather.weather_code)}
          <div className="temp-display">
            <span className="weather-temp">{Math.round(weather.temperature_2m)}°</span>
            <span className="weather-desc">{getWeatherDescription(weather.weather_code)}</span>
          </div>
        </div>

        <div className="weather-details-grid">
          <div className="detail-item">
            <span className="label">Humidity</span>
            <span className="value">{weather.relative_humidity_2m}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind</span>
            <span className="value">{weather.wind_speed_10m} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
