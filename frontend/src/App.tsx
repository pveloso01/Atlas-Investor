import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Container maxWidth="xl">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Container>
  );
}

export default App;
