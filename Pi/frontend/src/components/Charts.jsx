import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Charts = React.memo(({ historyTemp, historyHum }) => {
  // Prepare data for charts
  // historyTemp and historyHum are arrays of { timestamp, value, ... }
  
  // We might want to reverse them if they come in desc order
  // Memoize data transformation to avoid recalculation on every render
  const tempData = useMemo(() => {
    return [...historyTemp].map(r => ({
      timestamp: new Date(r.timestamp).getTime(),
      value: r.value
    }));
  }, [historyTemp]);

  const humData = useMemo(() => {
    return [...historyHum].map(r => ({
      timestamp: new Date(r.timestamp).getTime(),
      value: r.value
    }));
  }, [historyHum]);

  const formatXAxis = (tickItem) => {
    return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTooltipLabel = (label) => {
    return new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="charts-container">
      <div className="card chart-card">
        <h3>Temperature History</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tempData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatXAxis}
                stroke="#666" 
                tick={{fill: '#666', fontSize: 12}} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="#666" 
                tick={{fill: '#666', fontSize: 12}} 
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']} 
              />
              <Tooltip 
                labelFormatter={formatTooltipLabel}
                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#888', marginBottom: '0.5rem' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ff6b6b" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Humidity History</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={humData}>
              <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatXAxis}
                stroke="#666" 
                tick={{fill: '#666', fontSize: 12}} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="#666" 
                tick={{fill: '#666', fontSize: 12}} 
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 5', 'dataMax + 5']} 
              />
              <Tooltip 
                labelFormatter={formatTooltipLabel}
                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#888', marginBottom: '0.5rem' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4ecdc4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorHum)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

export default Charts;
