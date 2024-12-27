// src/utils/constants.js
export const CITIES = {
  MOROCCO: [
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
    { name: 'Sous-Massa', lat: 29.4064, lon: -10.0299 },
    { name: 'Guelmim-Oued Noun', lat: 28.4445, lon: -10.0634 },
    { name: 'Errachidia', lat: 31.9314, lon: -4.4246 },
    { name: 'Figuig', lat: 32.1138, lon: -1.2296 },
    { name: 'Zagora', lat: 30.3322, lon: -5.8380 }
    
  ],
  SPAIN: [
    { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
    { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
    { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
    { name: 'Seville', lat: 37.3891, lon: -5.9845 },
    { name: 'Bilbao', lat: 43.2627, lon: -2.9253 }
  ],
  FRANCE: [
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Marseille', lat: 43.2965, lon: 5.3698 },
    { name: 'Lyon', lat: 45.7640, lon: 4.8357 },
    { name: 'Toulouse', lat: 43.6047, lon: 1.4442 },
    { name: 'Nice', lat: 43.7102, lon: 7.2620 }
  ],
  ITALY: [
    { name: 'Rome', lat: 41.9028, lon: 12.4964 },
    { name: 'Milan', lat: 45.4642, lon: 9.1900 },
    { name: 'Naples', lat: 40.8518, lon: 14.2681 },
    { name: 'Turin', lat: 45.0703, lon: 7.6869 },
    { name: 'Florence', lat: 43.7696, lon: 11.2558 }
  ],
  PORTUGAL: [
    { name: 'Lisbon', lat: 38.7223, lon: -9.1393 },
    { name: 'Porto', lat: 41.1579, lon: -8.6291 },
    { name: 'Braga', lat: 41.5518, lon: -8.4229 },
    { name: 'Coimbra', lat: 40.2033, lon: -8.4103 },
    { name: 'Faro', lat: 37.0194, lon: -7.9322 }
  ]
};

// Combine all cities for the API calls
export const ALL_CITIES = Object.values(CITIES).flat();

// Center map on Mediterranean region
export const MAP_CENTER = [41.9028, 2.9534]; // Centered between the countries
export const DEFAULT_ZOOM = 5; // Adjusted for wider view

// Color scheme for different AQI levels
export const AQI_COLORS = {
  GOOD: '#00e400',
  MODERATE: '#ffff00',
  UNHEALTHY_SENSITIVE: '#ff7e00',
  UNHEALTHY: '#ff0000',
  VERY_UNHEALTHY: '#8f3f97',
  HAZARDOUS: '#7e0023'
};

// Morocco Cities - Extensive List
export const MOROCCAN_CITIES = [
  // Major Cities
  { cityName: 'El Jadida', lat: 33.2316, lon: -8.5007 },
  { cityName: 'Casablanca', lat: 33.5731, lon: -7.5898 },
  { cityName: 'Rabat', lat: 34.0209, lon: -6.8416 },
  { cityName: 'Marrakech', lat: 31.6295, lon: -7.9811 },
  { cityName: 'Fès', lat: 34.0181, lon: -5.0078 },
  { cityName: 'Tanger', lat: 35.7595, lon: -5.8340 },
  { cityName: 'Meknès', lat: 33.8935, lon: -5.5547 },
  { cityName: 'Oujda', lat: 34.6867, lon: -1.9114 },
  { cityName: 'Agadir', lat: 30.4278, lon: -9.5981 },
  { cityName: 'Tétouan', lat: 35.5889, lon: -5.3626 },
  
  // Regional Cities
  { cityName: 'Safi', lat: 32.2994, lon: -9.2372 },
  { cityName: 'Mohammedia', lat: 33.6866, lon: -7.3833 },
  { cityName: 'Khouribga', lat: 32.8830, lon: -6.9063 },
  { cityName: 'Béni Mellal', lat: 32.3369, lon: -6.3498 },
  { cityName: 'Nador', lat: 35.1743, lon: -2.9287 },
  { cityName: 'Kénitra', lat: 34.2610, lon: -6.5802 },
  { cityName: 'Taza', lat: 34.2100, lon: -4.0100 },
  { cityName: 'Settat', lat: 33.0016, lon: -7.6167 },
  { cityName: 'Larache', lat: 35.1933, lon: -6.1562 },
  { cityName: 'Guelmim', lat: 28.9870, lon: -10.0574 },
  
  // Coastal Cities
  { cityName: 'Essaouira', lat: 31.5085, lon: -9.7595 },
  { cityName: 'Al Hoceima', lat: 35.2517, lon: -3.9372 },
  { cityName: 'Asilah', lat: 35.4667, lon: -6.0333 },
  { cityName: 'Dakhla', lat: 23.7147, lon: -15.9370 },
  { cityName: 'Tan-Tan', lat: 28.4381, lon: -11.1032 },
  
  // Interior Cities
  { cityName: 'Ouarzazate', lat: 30.9335, lon: -6.9370 },
  { cityName: 'Errachidia', lat: 31.9314, lon: -4.4269 },
  { cityName: 'Midelt', lat: 32.6852, lon: -4.7341 },
  { cityName: 'Azrou', lat: 33.4342, lon: -5.2239 },
  { cityName: 'Ifrane', lat: 33.5333, lon: -5.1000 },
  
  // Northern Cities
  { cityName: 'Chefchaouen', lat: 35.1689, lon: -5.2694 },
  { cityName: 'Ouezzane', lat: 34.7958, lon: -5.5718 },
  { cityName: 'Fnideq', lat: 35.8486, lon: -5.3567 },
  { cityName: 'Martil', lat: 35.6167, lon: -5.2667 },
  { cityName: 'M\'diq', lat: 35.6833, lon: -5.3167 },
  
  // Southern Cities
  { cityName: 'Taroudant', lat: 30.4704, lon: -8.8831 },
  { cityName: 'Tiznit', lat: 29.6974, lon: -9.7369 },
  { cityName: 'Sidi Ifni', lat: 29.3797, lon: -10.1731 },
  { cityName: 'Laayoune', lat: 27.1536, lon: -13.2033 },
  { cityName: 'Boujdour', lat: 26.1236, lon: -14.4844 }
];

// European Cities - Extended
export const EUROPEAN_CITIES = [
  // Western Europe
  { cityName: 'Paris', lat: 48.8566, lon: 2.3522 },
  { cityName: 'London', lat: 51.5074, lon: -0.1278 },
  { cityName: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
  { cityName: 'Brussels', lat: 50.8503, lon: 4.3517 },
  { cityName: 'Dublin', lat: 53.3498, lon: -6.2603 },
  
  // Southern Europe
  { cityName: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { cityName: 'Barcelona', lat: 41.3851, lon: 2.1734 },
  { cityName: 'Rome', lat: 41.9028, lon: 12.4964 },
  { cityName: 'Athens', lat: 37.9838, lon: 23.7275 },
  { cityName: 'Lisbon', lat: 38.7223, lon: -9.1393 },
  
  // Central Europe
  { cityName: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { cityName: 'Vienna', lat: 48.2082, lon: 16.3738 },
  { cityName: 'Prague', lat: 50.0755, lon: 14.4378 },
  { cityName: 'Warsaw', lat: 52.2297, lon: 21.0122 },
  { cityName: 'Budapest', lat: 47.4979, lon: 19.0402 }
];

// Asian Cities - Extended
export const ASIAN_CITIES = [
  // East Asia
  { cityName: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { cityName: 'Seoul', lat: 37.5665, lon: 126.9780 },
  { cityName: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { cityName: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { cityName: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
  
  // Southeast Asia
  { cityName: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { cityName: 'Bangkok', lat: 13.7563, lon: 100.5018 },
  { cityName: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { cityName: 'Manila', lat: 14.5995, lon: 120.9842 },
  { cityName: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
  
  // South Asia
  { cityName: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { cityName: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { cityName: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { cityName: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { cityName: 'Colombo', lat: 6.9271, lon: 79.8612 }
];

// American Cities - Extended
export const AMERICAN_CITIES = [
  // North America
  { cityName: 'New York', lat: 40.7128, lon: -74.0060 },
  { cityName: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { cityName: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { cityName: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { cityName: 'Mexico City', lat: 19.4326, lon: -99.1332 },
  
  // South America
  { cityName: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { cityName: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { cityName: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { cityName: 'Lima', lat: -12.0464, lon: -77.0428 },
  { cityName: 'Bogotá', lat: 4.7110, lon: -74.0721 }
];

// African Cities - Extended
export const AFRICAN_CITIES = [
  // North Africa
  { cityName: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { cityName: 'Alexandria', lat: 31.2001, lon: 29.9187 },
  { cityName: 'Tunis', lat: 36.8065, lon: 10.1815 },
  { cityName: 'Algiers', lat: 36.7538, lon: 3.0588 },
  { cityName: 'Tripoli', lat: 32.8872, lon: 13.1913 },
  
  // West Africa
  { cityName: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { cityName: 'Accra', lat: 5.6037, lon: -0.1870 },
  { cityName: 'Dakar', lat: 14.7167, lon: -17.4677 },
  { cityName: 'Abidjan', lat: 5.3600, lon: -4.0083 },
  { cityName: 'Kano', lat: 12.0000, lon: 8.5167 },
  
  // East Africa
  { cityName: 'Nairobi', lat: -1.2921, lon: 36.8219 },
  { cityName: 'Addis Ababa', lat: 9.0320, lon: 38.7469 },
  { cityName: 'Dar es Salaam', lat: -6.7924, lon: 39.2083 },
  { cityName: 'Kampala', lat: 0.3476, lon: 32.5825 },
  { cityName: 'Khartoum', lat: 15.5007, lon: 32.5599 }
];