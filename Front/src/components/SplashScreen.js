import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const SplashScreen = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1f3a60 0%, #172a45 100%)', // Thème du projet
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // Centré verticalement
            }}
        >
            {/* Logo animé */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={process.env.PUBLIC_URL + '/images/logo.png'}
                    alt="Logo"
                    style={{
                        width: '350px', // Taille agrandie du logo
                        height: '350px', // Taille proportionnelle
                        objectFit: 'contain',
                    }}
                />
            </motion.div>

            {/* Texte animé */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                style={{ marginTop: '0.5rem' }} // Espacement réduit sous le logo
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#00fff5',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(0, 255, 245, 0.5)',
                    }}
                >
                    Bienvenue sur City Pollution
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: '#9AC8EB',
                        textAlign: 'center',
                        marginTop: '0.25rem', // Espacement réduit entre les deux lignes de texte
                    }}
                >
                    Parce que chaque souffle compte
                </Typography>
            </motion.div>
        </Box>
    );
};

export default SplashScreen;