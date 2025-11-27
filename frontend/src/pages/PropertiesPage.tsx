import React from 'react';
import { Typography, Box } from '@mui/material';

const PropertiesPage: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Properties
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Property listings will be displayed here.
      </Typography>
    </Box>
  );
};

export default PropertiesPage;

