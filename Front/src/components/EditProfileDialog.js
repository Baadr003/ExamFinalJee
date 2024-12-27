import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Tabs,
    Tab,
    Typography,
    Alert
} from '@mui/material';
import { authService } from '../services/authService';

const EditProfileDialog = ({ open, onClose, userId, currentUsername, onUpdateSuccess }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: currentUsername,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setError('');

            if (activeTab === 1) {
                // Validation du mot de passe
                if (!formData.currentPassword.trim() || !formData.newPassword.trim()) {
                    setError('Veuillez remplir tous les champs');
                    return;
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('Les mots de passe ne correspondent pas');
                    return;
                }
                if (formData.newPassword.length < 6) {
                    setError('Le mot de passe doit contenir au moins 6 caractères');
                    return;
                }
            }

            const updateData = activeTab === 0
                ? { username: formData.username }
                : {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                };

            console.log('Sending update data:', updateData); // Debug log
            const response = await authService.updateProfile(userId, updateData);
            
            if (response.success) {
                if (activeTab === 0) {
                    onUpdateSuccess(formData.username);
                }
                onClose();
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.message || 'Erreur lors de la mise à jour');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'background.paper', color: '#00fff5' }}>
                Modifier le profil
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.paper', pt: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        mb: 3,
                        '& .MuiTab-root': { color: '#00fff5' },
                        '& .Mui-selected': { color: '#00fff5' }
                    }}
                >
                    <Tab label="Nom d'utilisateur" />
                    <Tab label="Mot de passe" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {activeTab === 0 ? (
                    <TextField
                        fullWidth
                        label="Nom d'utilisateur"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                                '&:hover fieldset': { borderColor: '#00fff5' },
                            },
                            '& .MuiInputLabel-root': { color: '#00fff5' }
                        }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            type="password"
                            label="Mot de passe actuel"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                                    '&:hover fieldset': { borderColor: '#00fff5' },
                                },
                                '& .MuiInputLabel-root': { color: '#00fff5' }
                            }}
                        />
                        <TextField
                            type="password"
                            label="Nouveau mot de passe"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                                    '&:hover fieldset': { borderColor: '#00fff5' },
                                },
                                '& .MuiInputLabel-root': { color: '#00fff5' }
                            }}
                        />
                        <TextField
                            type="password"
                            label="Confirmer le mot de passe"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                                    '&:hover fieldset': { borderColor: '#00fff5' },
                                },
                                '& .MuiInputLabel-root': { color: '#00fff5' }
                            }}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'background.paper', p: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: '#ff4444' }}
                >
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        bgcolor: '#00fff5',
                        color: '#000',
                        '&:hover': { bgcolor: '#00cccc' }
                    }}
                >
                    Sauvegarder
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;