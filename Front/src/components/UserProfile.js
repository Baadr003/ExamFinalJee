// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, Divider, Snackbar, Alert, CircularProgress, Stack, TextField } from '@mui/material';
import { format, parseISO } from 'date-fns';
import NotificationPreferences from './NotificationPreferences';
import FavoritesList from './FavoritesList';
import { authService } from '../services/authService';
import EditProfileDialog from './EditProfileDialog';  // Remove curly braces

const getPriorityInfo = (aqi) => {
  if (aqi >= 301) return { label: 'Très Dangereux', color: '#8f3f97' };
  if (aqi >= 201) return { label: 'Dangereux', color: '#ff0000' };
  if (aqi >= 151) return { label: 'Malsain', color: '#ff7e00' };
  if (aqi >= 101) return { label: 'Modéré', color: '#00e400' };
  if (aqi >= 0) return { label: 'Bon', color: '#119AB6' };
  return { label: 'Non défini', color: '#808080' };
};

const extractPriorityFromMessage = (message) => {
  try {
    const priorityMatch = message.match(/\(([^)]+)\)/);
    return priorityMatch ? priorityMatch[1] : 'Non défini';
  } catch (error) {
    return 'Non défini';
  }
};

const UserProfile = ({ userId }) => {
  const [preferences, setPreferences] = useState({
    aqiThreshold: 3,  
    emailNotificationsEnabled: true,
    appNotificationsEnabled: true
  });
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [profileData, setProfileData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'Date non disponible';
      return format(parseISO(timestamp), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const loadUserData = async () => {
    if (!userId) {
      showNotification('ID utilisateur manquant', 'error');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const [userResponse, historyResponse] = await Promise.all([
        fetch(`http://localhost:8081/api/auth/user/${userId}`, { method: 'GET', headers }),
        fetch(`http://localhost:8081/api/auth/alerts/history/${userId}`, { method: 'GET', headers })
      ]);

      if (!userResponse.ok) throw new Error('Erreur lors du chargement du profil');
      
      const userData = await userResponse.json();
      console.log('User data:', userData);
      setUserDetails(userData);
      
      if (userData.preferences) {
        setPreferences(userData.preferences);
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        console.log('Raw alert history:', historyData);

        if (Array.isArray(historyData)) {
          const validatedHistory = historyData
            .filter(alert => alert && alert.id)
            .map(alert => {
              const alertPriority = getPriorityInfo(alert.aqi);
              return {
                ...alert,
                priority: {
                  level: alertPriority.level,
                  label: alertPriority.label,
                  color: alertPriority.color
                }
              };
            });

          console.log('Validated history:', validatedHistory);
          setAlertHistory(validatedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8081/api/auth/preferences/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de mise à jour');
      }

      showNotification('Préférences mises à jour avec succès', 'success');
      await loadUserData();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleEditProfile = () => {
    setProfileData({
      ...profileData,
      username: userDetails?.username || ''
    });
    setEditMode(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      setNotification({
        open: true,
        message: 'Les mots de passe ne correspondent pas',
        severity: 'error'
      });
      return;
    }

    try {
      const updateData = {
        username: profileData.username,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      };

      const response = await authService.updateProfile(userId, updateData);
      setNotification({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success'
      });
      setEditMode(false);
      // Refresh user details
      setUserDetails(prev => ({
        ...prev,
        username: profileData.username
      }));
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  const handleEditMode = () => {
    setProfileData({
      ...profileData,
      username: userDetails?.username || ''
    });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      {/* Profile Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ color: '#00fff5' }}>
            {userDetails ? `Profil de ${userDetails.username}` : 'Chargement...'}
          </Typography>
          <Button
            onClick={handleOpenEditDialog}
            variant="outlined"
            sx={{
              color: '#00fff5',
              borderColor: '#00fff5'
            }}
          >
            Modifier le profil
          </Button>
        </Box>
        
        {userDetails && (
          <Typography variant="subtitle1" sx={{ color: '#fff', mb: 2 }}>
            {userDetails.email}
          </Typography>
        )}

        <EditProfileDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          userId={userId}
          currentUsername={userDetails?.username}
          onUpdateSuccess={(username) => {
            setUserDetails(prev => ({...prev, username}));
            handleCloseEditDialog();
          }}
        />
      </Paper>

      {/* Preferences Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#00fff5' }}>
          Préférences de notification
        </Typography>
        <Box component="form" onSubmit={handlePreferencesSubmit}>
          <NotificationPreferences 
            preferences={preferences}
            setPreferences={setPreferences}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: '#00fff5',
              color: '#000',
              '&:hover': { bgcolor: '#00cccc' }
            }}
          >
            Sauvegarder les Préférences
          </Button>
        </Box>
      </Paper>

      {/* Favorites Section - Single Instance */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#00fff5' }}>
        </Typography>
        <FavoritesList userId={userId} />
      </Paper>

      {/* Alert History Section */}
      <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#00fff5' }}>
          Historique des Alertes
        </Typography>
        {alertHistory && alertHistory.length > 0 ? (
          <List>
            {alertHistory.map((alert, index) => (
              <React.Fragment key={alert.id || index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ color: '#fff', fontWeight: 'medium' }}>
                        {alert.cityName || 'Ville inconnue'} - AQI: {alert.aqi || 'N/A'}
                      </Box>
                    }
                    secondary={
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{ 
                              color: alert.priority?.color || '#fff',
                              bgcolor: 'rgba(0,0,0,0.2)',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            {extractPriorityFromMessage(alert.message)}
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {formatTimestamp(alert.timestamp)}
                          </Typography>
                        </Box>
                        {alert.message && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {alert.message}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
                {index < alertHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            py: 4, 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.2)',
            borderRadius: 1
          }}>
            <Typography sx={{ color: 'text.secondary' }}>
              Aucune alerte dans l'historique
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={notification.severity}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;