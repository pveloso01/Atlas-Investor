import React from 'react';
import { Typography, Box } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Login form will be displayed here.
      </Typography>
    </Box>
  );
};

export default LoginPage;

