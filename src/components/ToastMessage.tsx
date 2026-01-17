import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastMessageProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 3000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%', minWidth: '300px', minHeight: '48px' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;