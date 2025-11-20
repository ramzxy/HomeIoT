import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';

const Dashboard = ({ current }) => {
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
      </div>

      <div className="card hum-card">
        <div className="card-header">
          <Droplets size={24} />
          <h2>Humidity</h2>
        </div>
        <div className="value">
          {hum}<span className="unit">%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
