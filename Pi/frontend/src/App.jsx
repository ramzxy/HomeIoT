import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Charts from './components/Charts';
import './index.css';

// Configure base URL for API
// If running in dev (Vite on 5173, FastAPI on 8000), we need full URL
// In prod (served by FastAPI), relative URL is fine
const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '';

function App() {
  const [current, setCurrent] = useState([]);
  const [historyTemp, setHistoryTemp] = useState([]);
  const [historyHum, setHistoryHum] = useState([]);

  const fetchData = async () => {
    try {
      const currentRes = await axios.get(`${API_BASE}/api/current`);
      setCurrent(currentRes.data);

      const tempRes = await axios.get(`${API_BASE}/api/history/temperature`);
      setHistoryTemp(tempRes.data);

      const humRes = await axios.get(`${API_BASE}/api/history/humidity`);
      setHistoryHum(humRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>IoT Dashboard</h1>
        <div className="status-dot"></div>
      </header>
      
      <main>
        <Dashboard current={current} />
        <Charts historyTemp={historyTemp} historyHum={historyHum} />
      </main>
    </div>
  );
}

export default App;
