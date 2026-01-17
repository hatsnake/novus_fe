import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button, Stack, CircularProgress, Box } from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fullWidth?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    icon,
    confirmText = '확인',
    cancelText = '취소',
    confirmColor = 'primary',
    loading = false,
    onClose,
    onConfirm,
    fullWidth = true,
    maxWidth = 'xs',
    children,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            aria-labelledby="confirm-dialog-title"
        >
            <DialogTitle id="confirm-dialog-title">
                <Stack direction="row" spacing={1} alignItems="center">
                    {icon}
                    <Box component="span" sx={{ fontWeight: 600 }}>{title}</Box>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 1 }}>
                {description && (
                    <DialogContentText sx={{ mb: children ? 1 : 0 }}>{description}</DialogContentText>
                )}

                {children}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} variant="outlined">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} disabled={loading} variant="contained" color={confirmColor}>
                    {loading ? <CircularProgress size={18} color="inherit" /> : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
