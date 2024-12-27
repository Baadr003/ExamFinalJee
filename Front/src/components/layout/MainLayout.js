import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Dialog, 
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Map as MapIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import PollutionMap from '../components/Map';
import PollutionTabs from '../components/PollutionTabs';
import UserProfile from '../components/UserProfile';
import CustomNotification from '../components/CustomNotification';
import { api } from '../services/api';
import { WebSocketService } from '../services/websocketService';
import { ALL_CITIES } from '../utils/constants';
import { checkSession } from '../utils/authUtils';

const MainPage = ({ 
  isAuthenticated: globalIsAuthenticated, 
  setIsAuthenticated: setGlobalIsAuthenticated, 
  userId: globalUserId, 
  setUserId: setGlobalUserId 
}) => {
  // State management
  const [view, setView] = useState('map'); // 'map' or 'profile'
  const [citiesData, setCitiesData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    aqi: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // WebSocket connection
  useEffect(() => {
    if (globalIsAuthenticated && globalUserId) {
      const wsService = new WebSocketService(globalUserId);
      wsService.connect((data) => {
        if (data.type === 'ALERT') {
          setNotification({
            open: true,
            message: data.message,
            aqi: data.aqi,
            severity: 'warning'
          });
        }
      });

      return () => wsService.disconnect();
    }
  }, [globalIsAuthenticated, globalUserId]);

  // Load cities data
  useEffect(() => {
    const fetchCitiesData = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          ALL_CITIES.map(city => 
            api.get(`/pollution/current?lat=${city.lat}&lon=${city.lon}`)
          )
        );
        
        const data = responses.map((response, index) => ({
          ...response.data,
          cityName: ALL_CITIES[index].name
        }));
        
        setCitiesData(data);
      } catch (error) {
        console.error('Error fetching cities data:', error);
        setNotification({
          open: true,
          message: 'Erreur lors du chargement des données',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitiesData();
  }, []);

  const handleLogout = () => {
    setGlobalIsAuthenticated(false);
    setGlobalUserId(null);
    localStorage.removeItem('authData');
    setView('map');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(26, 26, 26, 0.95)' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              color: '#00fff5',
              fontWeight: 600,
              letterSpacing: 1
            }}
          >
            PolluAlert
          </Typography>
          
          {globalIsAuthenticated && (
            <>
              <IconButton 
                onClick={() => setView(view === 'map' ? 'profile' : 'map')}
                sx={{ 
                  color: '#00fff5',
                  mr: 1
                }}
              >
                {view === 'map' ? <PersonIcon /> : <MapIcon />}
              </IconButton>
              
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  color: '#ff4444',
                  '&:hover': { bgcolor: 'rgba(255,68,68,0.1)' }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        {view === 'profile' ? (
          <UserProfile userId={globalUserId} />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  bgcolor: 'rgba(26, 26, 26, 0.95)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {isLoading ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress sx={{ color: '#00fff5' }} />
                  </Box>
                ) : (
                  <PollutionMap 
                    pollutionData={citiesData}
                    onCitySelect={setSelectedCity}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <PollutionTabs
                cityName={selectedCity?.cityName}
                current={selectedCity}
                isAuthenticated={globalIsAuthenticated}
              />
            </Grid>
          </Grid>
        )}
      </Container>

      <CustomNotification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        aqi={notification.aqi}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default MainPage;