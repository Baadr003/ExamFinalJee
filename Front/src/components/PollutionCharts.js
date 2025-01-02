import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Box, Typography, Paper, Grid, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PollutionCharts = ({ historyData }) => {
  const theme = useTheme();

  const formatData = () => {
    if (!historyData?.list) return [];
    return historyData.list.map(item => ({
      time: format(new Date(item.dt * 1000), 'HH:mm', { locale: fr }),
      date: format(new Date(item.dt * 1000), 'dd/MM HH:mm', { locale: fr }),
      aqi: item.main.aqi,
      co: item.components.co,
      no2: item.components.no2,
      o3: item.components.o3,
      pm25: item.components.pm2_5,
      pm10: item.components.pm10,
      so2: item.components.so2
    }));
  };

  const data = formatData();

  const chartConfig = {
    stroke: '#00fff5',
    strokeWidth: 2,
    fill: 'rgba(0, 255, 245, 0.1)'
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Grid container spacing={3}>
        {/* AQI Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#00fff5' }}>
              Indice de Qualité de l'Air (AQI)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00fff5' }}
                  />
                  <Legend />
                  <Bar dataKey="aqi" name="AQI" fill="#00fff5" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pollutants Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#00fff5' }}>
              Évolution des Polluants
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00fff5' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="co" stroke="#8884d8" name="CO" strokeWidth={2} />
                  <Line type="monotone" dataKey="no2" stroke="#82ca9d" name="NO2" strokeWidth={2} />
                  <Line type="monotone" dataKey="o3" stroke="#ffc658" name="O3" strokeWidth={2} />
                  <Line type="monotone" dataKey="pm25" stroke="#ff7300" name="PM2.5" strokeWidth={2} />
                  <Line type="monotone" dataKey="pm10" stroke="#ff1744" name="PM10" strokeWidth={2} />
                  <Line type="monotone" dataKey="so2" stroke="#00C49F" name="SO2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PollutionCharts;