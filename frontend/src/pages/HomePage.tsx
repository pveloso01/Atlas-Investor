import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Atlas Investor
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Real Estate Investment Platform for Portugal
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/properties')}
          sx={{ mr: 2 }}
        >
          Browse Properties
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

