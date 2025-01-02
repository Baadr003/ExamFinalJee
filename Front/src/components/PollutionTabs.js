// src/components/PollutionTabs.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Tabs, Tab, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { format, isSameDay } from 'date-fns';
import { styled } from '@mui/material/styles';
import { favoriteService } from '../services/favoriteService';
import { fr } from 'date-fns/locale';
import PollutionCharts from './PollutionCharts';
import GetAppIcon from '@mui/icons-material/GetApp';
import { AQI_COLORS } from '../utils/constants';

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#00fff5',
  }
});

const StyledTab = styled(Tab)({
  color: '#fff',
  '&.Mui-selected': {
    color: '#00fff5',
  }
});

const PollutionDetails = ({ data }) => {
  if (!data?.list?.[0]) return null;
  const { main, components } = data.list[0];
  
  // Show all pollutants
  const allComponents = {
    'CO': components.co,
    'NO': components.no,
    'NO2': components.no2,
    'O3': components.o3,
    'SO2': components.so2,
    'PM2.5': components.pm2_5,
    'PM10': components.pm10,
    'NH3': components.nh3
  };

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'rgba(0,0,0,0.2)', 
      borderRadius: '10px',
      border: '1px solid rgba(0, 255, 245, 0.1)',
    }}>
      <Typography variant="h6" sx={{ color: '#00fff5', mb: 2 }}>
        AQI: {main.aqi}
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2
      }}>
        {Object.entries(allComponents).map(([key, value]) => (
          <Typography key={key} sx={{ color: '#fff' }}>
            {key}: {value?.toFixed(1) || 'N/A'}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const CompactPollutionCard = ({ data }) => {
  if (!data?.list?.[0]) return null;
  const { main, components } = data.list[0];
  
  const allComponents = {
    'CO': components.co,
    'NO': components.no,
    'NO2': components.no2,
    'O3': components.o3,
    'SO2': components.so2,
    'PM2.5': components.pm2_5,
    'PM10': components.pm10,
    'NH3': components.nh3
  };

  return (
    <Box sx={{ 
      p: 1.5,
      bgcolor: 'rgba(0,0,0,0.2)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 255, 245, 0.1)',
      height: '100%'
    }}>
      <Typography variant="subtitle2" sx={{ color: '#00fff5' }}>
        {format(new Date(data.list[0].dt * 1000), 'HH:mm')}
      </Typography>
      <Typography variant="h6" sx={{ color: '#00fff5', my: 1 }}>
        AQI: {main.aqi}
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 0.5,
        fontSize: '0.75rem'
      }}>
        {Object.entries(allComponents).map(([key, value]) => (
          <Typography key={key} variant="caption" sx={{ color: '#fff' }}>
            {key}: {value.toFixed(1)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const GroupedPollutionData = ({ items }) => {
  const groupedByDay = items.reduce((acc, item) => {
    const date = format(new Date(item.dt * 1000), 'dd MMM', { locale: fr });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
      {Object.entries(groupedByDay).map(([date, dayItems]) => (
        <Box key={date} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#00fff5', mb: 1 }}>
            {date}
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2
          }}>
            {dayItems.map((item, idx) => (
              <CompactPollutionCard key={idx} data={{ list: [item] }} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const PollutionTabs = ({ cityName, current, forecast, history, isAuthenticated }) => {
  const [value, setValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [liveData, setLiveData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (cityName && favorites.length > 0) {
      const isCityFavorite = favorites.some(fav => 
        fav.latitude === current?.coord?.lat && 
        fav.longitude === current?.coord?.lon
      );
      setIsFavorite(isCityFavorite);
    }
  }, [cityName, favorites, current]);

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      setFavorites(response);
    } catch (error) {
      showNotification('Erreur lors du chargement des favoris', 'error');
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      showNotification('Veuillez vous connecter pour ajouter des favoris', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        const favoriteCity = favorites.find(fav => 
          fav.latitude === current.coord.lat && 
          fav.longitude === current.coord.lon
        );
        await favoriteService.removeFavorite(favoriteCity.id);
        showNotification('Ville retirée des favoris', 'success');
      } else {
        await favoriteService.addFavorite({
          cityName,
          coord: {
            lat: current.coord.lat,
            lon: current.coord.lon
          }
        });
        showNotification('Ville ajoutée aux favoris', 'success');
      }
      await loadFavorites();
    } catch (error) {
      showNotification('Erreur lors de la gestion des favoris', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/pollution/export-pdf?lat=${current.coord.lat}&lon=${current.coord.lon}&cityName=${cityName}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pollution-report-${cityName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setNotification({
        open: true,
        message: 'Erreur lors du téléchargement du PDF',
        severity: 'error'
      });
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const getAQILevel = (aqi) => {
    switch(aqi) {
      case 1:
        return { level: 'Bon', color: '#00e400' };
      case 2:
        return { level: 'Modéré', color: '#ffff00' };
      case 3:
        return { level: 'Malsain', color: '#ff7e00' };
      case 4:
        return { level: 'Dangeuereux', color: '#ff0000' };
      case 5:
        return { level: 'Très Dangeuereux', color: '#99004c' };
      default:
        return { level: 'Non disponible', color: '#cccccc' };
    }
  };

  const getAQIColor = (aqi) => {
    switch(aqi) {
      case 1:
        return '#00e400'; // Good
      case 2:
        return '#ffff00'; // Moderate
      case 3:
        return '#ff7e00'; // Unhealthy for sensitive
      case 4:
        return '#ff0000'; // Unhealthy
      case 5:
        return '#99004c'; // Very unhealthy
      default:
        return '#cccccc'; // Unknown
    }
  };

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const cities = [
          // Morocco
          { name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
          { name: 'Rabat', lat: 34.0209, lon: -6.8416 },
          { name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
          { name: 'Fès', lat: 34.0333, lon: -5.0000 },
          { name: 'Tanger', lat: 35.7595, lon: -5.8340 },
          { name: 'El Jadida', lat: 33.2316, lon: -8.5007 },
          { name: 'Agadir', lat: 30.4278, lon: -9.5981 },
          { name: 'Oujda', lat: 34.6814, lon: -1.9086 },
          { name: 'Nador', lat: 35.1681, lon: -2.9335 },
          { name: 'Tetouan', lat: 35.5785, lon: -5.3684 },
          { name: 'Kenitra', lat: 34.2610, lon: -6.5802 },
          { name: 'Beni Mellal', lat: 32.3372, lon: -6.3498 },
          { name: 'Safi', lat: 32.3008, lon: -9.2275 },
          { name: 'Essaouira', lat: 31.5125, lon: -9.7749 },
          { name: 'Taza', lat: 34.2133, lon: -3.9986 },
          { name: 'Ouarzazate', lat: 30.9189, lon: -6.8934 },
          { name: 'Tiznit', lat: 29.6974, lon: -9.7316 },
          { name: 'Tan-Tan', lat: 28.4378, lon: -11.1014 },
          { name: 'Guelmim', lat: 28.9870, lon: -10.0574 },
          { name: 'Laâyoune', lat: 27.1253, lon: -13.1625 },
          // Spain
          { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
          { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
          { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
          { name: 'Seville', lat: 37.3891, lon: -5.9845 },
          { name: 'Bilbao', lat: 43.2627, lon: -2.9253 },
          // France
          { name: 'Paris', lat: 48.8566, lon: 2.3522 },
          { name: 'Marseille', lat: 43.2965, lon: 5.3698 },
          { name: 'Lyon', lat: 45.7640, lon: 4.8357 },
          { name: 'Toulouse', lat: 43.6047, lon: 1.4442 },
          { name: 'Nice', lat: 43.7102, lon: 7.2620 },
          // Italy
          { name: 'Rome', lat: 41.9028, lon: 12.4964 },
          { name: 'Milan', lat: 45.4642, lon: 9.1900 },
          { name: 'Naples', lat: 40.8518, lon: 14.2681 },
          { name: 'Turin', lat: 45.0703, lon: 7.6869 },
          { name: 'Florence', lat: 43.7696, lon: 11.2558 },
          // Portugal
          { name: 'Lisbon', lat: 38.7223, lon: -9.1393 },
          { name: 'Porto', lat: 41.1579, lon: -8.6291 },
          { name: 'Braga', lat: 41.5518, lon: -8.4229 },
          { name: 'Coimbra', lat: 40.2033, lon: -8.4103 },
          { name: 'Faro', lat: 37.0194, lon: -7.9322 }
        ];

        const responses = await Promise.all(
          cities.map(async city => {
            try {
              const response = await fetch(
                `http://localhost:8081/api/pollution/current?lat=${city.lat}&lon=${city.lon}`
              );
              const data = await response.json();
              return { ...data, cityName: city.name };
            } catch (error) {
              console.error(`Error fetching data for ${city.name}:`, error);
              return null;
            }
          })
        );

        const validData = responses
          .filter(data => data !== null)
          .sort((a, b) => b.list[0].main.aqi - a.list[0].main.aqi)
          .slice(0, 9); // Changed from 5 to 8 cities

        setLiveData(validData);
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3600000);
    return () => clearInterval(interval);
  }, []);

  if (!cityName) {
    return (
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderRadius: '15px',
        backgroundColor: 'rgba(23, 42, 69, 0.9)',
      }}>
        <Typography variant="h6" sx={{ color: '#00fff5', mb: 2 }}>
        Classement dynamique des villes polluées au monde 
        </Typography>
        <List>
          {liveData
            .sort((a, b) => b.list[0].main.aqi - a.list[0].main.aqi)
            .map((city, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: '#fff' }}>
                        {index + 1}. {city.cityName}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ 
                        color: getAQILevel(city.list[0].main.aqi).color,
                        fontWeight: 'bold'
                      }}>
                        AQI: {city.list[0].main.aqi} - {getAQILevel(city.list[0].main.aqi).level}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < liveData.length - 1 && // Changed to show divider for all but last item
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                }
              </React.Fragment>
            ))}
        </List>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2,
      borderRadius: '15px',
      backgroundColor: 'rgba(23, 42, 69, 0.9)',
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h5" sx={{ color: '#00fff5' }}>
          {cityName}
        </Typography>
        {isAuthenticated && (
          <Button
            startIcon={loading ? <CircularProgress size={20} /> : (isFavorite ? <Star /> : <StarBorder />)}
            onClick={handleAddToFavorites}
            disabled={loading}
            sx={{ 
              color: isFavorite ? '#FFD700' : '#00fff5',
              borderColor: isFavorite ? '#FFD700' : '#00fff5',
              '&:hover': {
                color: '#FFD700',
                borderColor: '#FFD700'
              }
            }}
            variant="outlined"
          >
            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Button>
        )}
      </Box>

      <StyledTabs value={value} onChange={(e, v) => setValue(v)} centered>
        <StyledTab label="Actuel" />
        <StyledTab label="Prévisions (24h)" />
        <StyledTab label="Historique" />
      </StyledTabs>

      <Box sx={{ mt: 3 }}>
        {value === 0 && <PollutionDetails data={current} />}
        
        {value === 1 && (
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <Typography variant="subtitle1" sx={{ color: '#00fff5', mb: 2 }}>
              Prévisions des 24 prochaines heures
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
              p: 1
            }}>
              {forecast?.list?.slice(0, 24).map((item, idx) => (
                <CompactPollutionCard key={idx} data={{ list: [item] }} />
              ))}
            </Box>
          </Box>
        )}
        
        {value === 2 && (
          <Box sx={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <PollutionCharts historyData={history} />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#00fff5', mb: 2 }}>
                Historique détaillé
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2
              }}>
                {[...(history?.list || [])].reverse().map((item, idx) => (
                  <CompactPollutionCard key={idx} data={{ list: [item] }} />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Button
        onClick={handleExportPdf}
        startIcon={<GetAppIcon />}
        sx={{ 
          mt: 2,
          color: '#00fff5',
          borderColor: '#00fff5',
          '&:hover': {
            borderColor: '#00fff5',
            backgroundColor: 'rgba(0, 255, 245, 0.1)'
          }
        }}
        variant="outlined"
      >
        Télécharger le rapport PDF
      </Button>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity} onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PollutionTabs;