import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Alert,
    Typography
} from '@mui/material';
import { authService } from '../services/authService';

const PasswordResetDialog = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleEmailSubmit = async () => {
        try {
            await authService.requestPasswordReset(email);
            setSuccess(true);
            setStep(2);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await authService.resetPassword({
                email,
                code,
                newPassword
            });
            onClose();
            alert('Mot de passe réinitialisé avec succès');
            setStep(1);
            setEmail('');
            setCode('');
            setNewPassword('');
            setSuccess(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="xs" 
            fullWidth
            disableEscapeKeyDown={step === 2}
        >
            <DialogTitle sx={{ 
                bgcolor: 'background.paper', 
                color: '#00fff5',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                {step === 1 ? 'Réinitialisation du mot de passe' : 'Entrer le code de vérification'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.paper', p: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && step === 2 && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Code envoyé ! Vérifiez votre email.
                    </Alert>
                )}

                {step === 1 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ color: 'text.primary' }}>
                            Entrez votre email pour recevoir un code de vérification
                        </Typography>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#00fff5'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#00fff5'
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleEmailSubmit}
                            sx={{
                                bgcolor: '#00fff5',
                                color: '#000',
                                '&:hover': { bgcolor: '#00cccc' }
                            }}
                        >
                            Envoyer le code
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ color: 'text.primary' }}>
                            Entrez le code reçu par email et votre nouveau mot de passe
                        </Typography>
                        <TextField
                            fullWidth
                            label="Code de vérification"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#00fff5'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#00fff5'
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#00fff5'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#00fff5'
                                }
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handlePasswordReset}
                            sx={{
                                bgcolor: '#00fff5',
                                color: '#000',
                                '&:hover': { bgcolor: '#00cccc' }
                            }}
                        >
                            Réinitialiser le mot de passe
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PasswordResetDialog;