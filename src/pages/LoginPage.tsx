import React from 'react';
import { Box, Paper, Typography, TextField, Button, Link, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useUIStore from '@/store/uiStore';
import authService from '@/services/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setLoading: setAuthLoading } = useAuthStore();
  const { setLoading: setUILoading, addNotification } = useUIStore();
  const [keyLogin, setKeyLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setUILoading(true);

    try {
      const response = await authService.login({ keyLogin, password });

      if (response.token || response.accessToken) {
        const token = (response.token || response.accessToken) as string;
        setToken(token, response.refreshToken);

        if (response.user) {
          setUser(response.user);
        }

        addNotification({
          type: 'success',
          message: 'Login successful!',
          duration: 3000,
        });

        navigate('/', { replace: true });
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      addNotification({
        type: 'error',
        message,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setUILoading(false);
      setAuthLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component={Paper}
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
          Course Management System
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email or Username"
            placeholder="your@email.com"
            value={keyLogin}
            onChange={(e) => setKeyLogin(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
