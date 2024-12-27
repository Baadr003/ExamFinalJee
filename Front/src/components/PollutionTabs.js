// src/components/PollutionTabs.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Tabs, Tab, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { format, isSameDay } from 'date-fns';
import { styled } from '@mui/material/styles';
import { favoriteService } from '../services/favoriteService';
import { fr } from 'date-fns/locale';

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

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  if (!cityName) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Sélectionnez une ville sur la carte</Typography>
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
        <StyledTab label="Prévisions (3j)" />
        <StyledTab label="Historique" />
      </StyledTabs>

      <Box sx={{ mt: 3 }}>
        {value === 0 && <PollutionDetails data={current} />}
        
        {value === 1 && (
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <Typography variant="subtitle1" sx={{ color: '#00fff5', mb: 2 }}>
              Prévisions des 3 prochains jours
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
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <Typography variant="subtitle1" sx={{ color: '#00fff5', mb: 2 }}>
              Historique des dernières 24 heures
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
              p: 1
            }}>
              {[...(history?.list || [])].reverse().map((item, idx) => (
                <CompactPollutionCard key={idx} data={{ list: [item] }} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

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