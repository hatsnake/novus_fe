import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 9999,          
      backgroundColor: 'transparent'
    }}>
      <CircularProgress color='error' size={60} />
    </Box>
  );
};

export default LoadingSpinner;
