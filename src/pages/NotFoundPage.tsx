import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
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
      <SearchIcon sx={{ fontSize: 80, color: '#0ea5e9', mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center', maxWidth: 500 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
