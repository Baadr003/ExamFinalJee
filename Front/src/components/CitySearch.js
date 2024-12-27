import React, { useState } from 'react';
import { 
    Paper,
    TextField, 
    Autocomplete,
    Box 
} from '@mui/material';
import { ALL_CITIES } from '../utils/constants';

const CitySearch = ({ onCitySelect }) => {
    const [searchValue, setSearchValue] = useState(null);

    const handleCitySelect = (event, newValue) => {
        setSearchValue(newValue);
        if (newValue) {
            onCitySelect({
                cityName: newValue.name,
                coord: {
                    lat: newValue.lat,
                    lon: newValue.lon
                }
            });
        }
    };

    return (
        <Paper sx={{ 
            p: 2, 
            bgcolor: 'background.paper',
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            width: '300px'
        }}>
            <Autocomplete
                value={searchValue}
                onChange={handleCitySelect}
                options={ALL_CITIES}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Rechercher une ville"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                                '&:hover fieldset': { borderColor: '#00fff5' },
                            },
                            '& .MuiInputLabel-root': { color: '#00fff5' }
                        }}
                    />
                )}
            />
        </Paper>
    );
};

export default CitySearch;