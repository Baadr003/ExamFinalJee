import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Box, Paper, Typography } from '@mui/material';

const PollutionHeatmap = ({ historyData }) => {
  const formatData = () => {
    if (!historyData?.list) return [];
    
    const hours = Array.from(new Set(
      historyData.list.map(item => 
        new Date(item.dt * 1000).getHours()
      )
    )).sort((a, b) => a - b);

    const pollutants = ['CO', 'NO2', 'O3', 'PM2.5', 'PM10', 'SO2'];
    
    return pollutants.map(pollutant => ({
      id: pollutant,
      data: hours.map(hour => ({
        x: `${hour}h`,
        y: historyData.list
          .filter(item => new Date(item.dt * 1000).getHours() === hour)
          .map(item => item.components[pollutant.toLowerCase().replace('.', '_')])
          .reduce((acc, val) => acc + val, 0) / 
          historyData.list.filter(item => 
            new Date(item.dt * 1000).getHours() === hour
          ).length
      }))
    }));
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)', mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#00fff5' }}>
        Distribution des polluants par heure
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveHeatMap
          data={formatData()}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          valueFormat=">-.2f"
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: 'Heures',
            legendPosition: 'middle',
            legendOffset: 46
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Polluants',
            legendPosition: 'middle',
            legendOffset: 70
          }}
          colors={{
            type: 'sequential',
            scheme: 'blues'
          }}
          emptyColor="#555555"
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          borderWidth={1}
          enableLabels={true}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          theme={{
            text: { fill: '#00fff5' },
            axis: { ticks: { text: { fill: '#00fff5' } } },
            legends: { text: { fill: '#00fff5' } }
          }}
        />
      </Box>
    </Paper>
  );
};

export default PollutionHeatmap;