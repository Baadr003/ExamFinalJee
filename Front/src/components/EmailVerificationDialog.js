import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { authService } from '../services/authService';

const EmailVerificationDialog = ({ open, email, onClose, onVerify, onResendCode }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const handleVerify = async () => {
    try {
      const response = await authService.verifyEmail(email, verificationCode);
      
      if (response.success) {
        setMessage('Compte vérifié avec succès!');
        setSeverity('success');
        setVerificationCode('');
        setTimeout(() => {
          onClose();
          setMessage('');
        }, 2000);
      } else {
        setMessage('Code incorrect. Veuillez réessayer.');
        setSeverity('error');
      }
    } catch (error) {
      setMessage('Code incorrect. Veuillez réessayer.');
      setSeverity('error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Vérification Email</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Un code de vérification a été envoyé à {email}
          </Typography>
          <TextField
            fullWidth
            label="Code de vérification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            margin="normal"
          />
        </Box>
        {message && (
          <Alert severity={severity} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onResendCode(email)}>
          Renvoyer le code
        </Button>
        <Button 
          onClick={handleVerify} 
          variant="contained"
          disabled={!verificationCode}
        >
          Vérifier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationDialog;