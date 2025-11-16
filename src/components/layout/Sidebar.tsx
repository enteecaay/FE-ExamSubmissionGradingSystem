import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as ExamIcon,
  FilePresent as SubmissionIcon,
  Assessment as GradingIcon,
  Warning as ViolationIcon,
} from '@mui/icons-material';
import useAuthStore from '@/store/authStore';

interface SidebarProps {
  open: boolean;
  onToggle?: () => void;
}

const DRAWER_WIDTH = 260;

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: DashboardIcon,
      path: '/',
      roles: [0, 1, 2],
    },
    {
      label: 'Exams',
      icon: ExamIcon,
      path: '/exams',
      roles: [0, 1, 2],
    },
    {
      label: 'Submissions',
      icon: SubmissionIcon,
      path: '/submissions',
      roles: [0, 1],
    },
    {
      label: 'Grading',
      icon: GradingIcon,
      path: '/grading',
      roles: [1],
    },
    {
      label: 'Violations',
      icon: ViolationIcon,
      path: '/violations',
      roles: [0],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onToggle}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          CMS
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Course Management System
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

      <List sx={{ flex: 1 }}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              component="div"
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                borderLeft: isActive ? '4px solid #22c55e' : '4px solid transparent',
                pl: 1.75,
                '&:hover': {
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                },
                color: isActive ? '#22c55e' : '#ffffff',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? '#22c55e' : '#ffffff',
                  minWidth: 40,
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          User Role: {user?.role === 0 ? 'Admin' : user?.role === 1 ? 'Examiner' : 'Student'}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
