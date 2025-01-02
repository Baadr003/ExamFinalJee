import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AQI_COLORS } from '../utils/constants';

const CityRanking = ({ citiesData }) => {
  const [rankedCities, setRankedCities] = useState([]);

  useEffect(() => {
    if (citiesData && citiesData.length > 0) {
      const sorted = [...citiesData]
        .sort((a, b) => b.list[0].main.aqi - a.list[0].main.aqi)
        .slice(0, 5);
      setRankedCities(sorted);
    }
  }, [citiesData]);

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: 'rgba(0,0,0,0.2)', 
      borderRadius: 2,
      p: 2,
      mb: 2 
    }}>
      <Typography variant="h6" sx={{ color: '#00fff5', mb: 2 }}>
        Villes les Plus Polluées
      </Typography>
      <List>
        {rankedCities.map((city, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography sx={{ color: '#fff' }}>
                    {index + 1}. {city.cityName}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ color: AQI_COLORS.MODERATE }}>
                    AQI: {city.list[0].main.aqi}
                  </Typography>
                }
              />
            </ListItem>
            {index < rankedCities.length - 1 && (
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CityRanking;