import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

const Dashboard = ({ current, statsTemp, statsHum }) => {
  if (!current) return <div className="loading">Loading...</div>;

  // Find latest temp and hum from the list or object
  // Expecting current to be a list of readings, we need to filter by topic
  // Or the API returns the latest reading for each topic.
  
  const tempReading = current.find(r => r.topic.includes('temperature'));
  const humReading = current.find(r => r.topic.includes('humidity'));

  const temp = tempReading ? tempReading.value.toFixed(1) : '--';
  const hum = humReading ? humReading.value.toFixed(1) : '--';

  return (
    <div className="dashboard-grid">
      <div className="card temp-card">
        <div className="card-header">
          <Thermometer size={24} />
          <h2>Temperature</h2>
        </div>
        <div className="value">
          {temp}<span className="unit">°C</span>
        </div>
        {statsTemp && (
          <div className="stats-row">
            <div className="stat">
              <span className="label">Avg</span>
              <span className="val">{statsTemp.avg?.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="label">Min</span>
              <span className="val">{statsTemp.min?.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="label">Max</span>
              <span className="val">{statsTemp.max?.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="card hum-card">
        <div className="card-header">
          <Droplets size={24} />
          <h2>Humidity</h2>
        </div>
        <div className="value">
          {hum}<span className="unit">%</span>
        </div>
        {statsHum && (
          <div className="stats-row">
            <div className="stat">
              <span className="label">Avg</span>
              <span className="val">{statsHum.avg?.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="label">Min</span>
              <span className="val">{statsHum.min?.toFixed(1)}</span>
            </div>
            <div className="stat">
              <span className="label">Max</span>
              <span className="val">{statsHum.max?.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      <WeatherWidget />
    </div>
  );
};

export default Dashboard;
