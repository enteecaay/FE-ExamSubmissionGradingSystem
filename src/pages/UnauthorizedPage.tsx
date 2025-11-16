import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const UnauthorizedPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        p: 2,
      }}
    >
      <ErrorOutline sx={{ fontSize: 80, color: '#ef4444', mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center', maxWidth: 500 }}>
        You don&apos;t have permission to access this page. Please contact an administrator if you think this is a mistake.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
