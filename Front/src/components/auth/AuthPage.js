import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import EmailVerificationDialog from '../components/EmailVerificationDialog';

const AuthPage = ({ isAuthenticated, setIsAuthenticated, setUserId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [verificationDialog, setVerificationDialog] = useState({
    open: false,
    email: ''
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (response.success) {
        setIsAuthenticated(true);
        setUserId(response.userId);
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.success) {
        setVerificationDialog({
          open: true,
          email: formData.email
        });
        setTabValue(0);
        setError('');
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (email, code) => {
    try {
      await authService.verifyEmail(email, code);
      setVerificationDialog({ open: false, email: '' });
      setTabValue(0);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid rgba(0, 255, 245, 0.1)',
            borderRadius: 2
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#00fff5',
                fontWeight: 600,
                letterSpacing: 1,
                textShadow: '0 0 10px rgba(0,255,245,0.3)'
              }}
            >
              PolluAlert
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                mt: 1 
              }}
            >
              Surveillance de la qualité de l'air en temps réel
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            centered
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: '#00fff5',
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab 
              label="Connexion" 
              sx={{ 
                color: '#fff',
                '&.Mui-selected': { color: '#00fff5' }
              }}
            />
            <Tab 
              label="Inscription" 
              sx={{ 
                color: '#fff',
                '&.Mui-selected': { color: '#00fff5' }
              }}
            />
          </Tabs>

          {error && (
            <Typography 
              color="error" 
              sx={{ mb: 2, textAlign: 'center' }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: '#00fff5' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff5' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': { color: '#00fff5' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
              }}
            />

            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                    '&:hover fieldset': { borderColor: '#00fff5' },
                    '&.Mui-focused fieldset': { borderColor: '#00fff5' },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-focused': { color: '#00fff5' },
                  },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
              />
            )}

            <TextField
              fullWidth
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: '#00fff5' },
                  '&.Mui-focused fieldset': { borderColor: '#00fff5' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': { color: '#00fff5' },
                },
                '& .MuiInputBase-input': { color: '#fff' },
              }}
            />

            <Button
              fullWidth
              onClick={tabValue === 0 ? handleLogin : handleRegister}
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#00fff5',
                color: '#1a1a1a',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#00ddd5',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0,255,245,0.3)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#1a1a1a' }} />
              ) : (
                tabValue === 0 ? 'Se connecter' : 'S\'inscrire'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      <EmailVerificationDialog
        open={verificationDialog.open}
        email={verificationDialog.email}
        onClose={() => setVerificationDialog({ open: false, email: '' })}
        onVerify={handleVerifyEmail}
      />
    </Box>
  );
};

export default AuthPage;