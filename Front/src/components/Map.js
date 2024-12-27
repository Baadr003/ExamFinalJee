import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Paper, Typography, Divider, Grid } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { MAP_CENTER, DEFAULT_ZOOM } from '../utils/constants';
import CitySearch from './CitySearch';

// Configuration des icônes Leaflet
const configureLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
};

// Composant pour afficher la couche de chaleur
const HeatLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const points = data.map(city => [
      city.coord.lat,
      city.coord.lon,
      city.list[0].main.aqi * 3,
    ]);

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: '#00ff00', // Bon
        0.6: '#ffff00', // Modéré
        0.8: '#ff8000', // Mauvais
        1.0: '#ff0000', // Très mauvais
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

// Composant pour le contenu du Popup
const PopupContent = ({ city }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#000' }}>
      {city.cityName}
    </Typography>
    <Divider sx={{ my: 1 }} />
    <Typography variant="body2" sx={{ color: '#000' }}>AQI: {city.list[0].main.aqi}</Typography>
    <Typography variant="body2" sx={{ color: '#000' }}>CO: {city.list[0].components.co}</Typography>
    <Typography variant="body2" sx={{ color: '#000' }}>NO2: {city.list[0].components.no2}</Typography>
    <Typography variant="body2" sx={{ color: '#000' }}>O3: {city.list[0].components.o3}</Typography>
    <Typography variant="body2" sx={{ color: '#000' }}>PM2.5: {city.list[0].components.pm2_5}</Typography>
  </>
);

// Composant pour la section de recherche
const SearchSection = ({ onCitySelect }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 4,
      backgroundColor: 'background.paper',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      mb: 3,
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
      Recherche de Ville
    </Typography>
    <CitySearch onCitySelect={onCitySelect} />
  </Paper>
);

// Composant pour la section de carte
const MapSection = ({ pollutionData, onCitySelect }) => {
  useEffect(() => {
    console.log('PollutionData:', pollutionData); // Debug log
  }, [pollutionData]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4, height: '70vh' }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
          borderRadius: 4,
        }}
      >
        <MapContainer center={MAP_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {pollutionData && Array.isArray(pollutionData) && pollutionData.map((city, index) => (
            <Marker
              key={`marker-${city.cityName}-${index}`}
              position={[city.coord.lat, city.coord.lon]}
              eventHandlers={{
                click: () => onCitySelect?.(city),
              }}
            >
              <Popup>
                <PopupContent city={city} />
              </Popup>
            </Marker>
          ))}
          {pollutionData && <HeatLayer data={pollutionData} />}
        </MapContainer>
      </Paper>
    </Box>
  );
};

// Composant principal
const PollutionMap = ({ pollutionData, onCitySelect }) => {
  useEffect(() => {
    configureLeafletIcons();
  }, []);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SearchSection onCitySelect={onCitySelect} />
      </Box>
      <MapSection pollutionData={pollutionData} onCitySelect={onCitySelect} />
    </Box>
  );
};

export default PollutionMap;
