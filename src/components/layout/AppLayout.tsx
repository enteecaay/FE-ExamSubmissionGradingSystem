import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Container
          maxWidth="xl"
          component="main"
          sx={{
            py: 4,
            px: 3,
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
