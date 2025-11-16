import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
