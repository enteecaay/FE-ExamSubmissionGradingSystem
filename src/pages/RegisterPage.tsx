import React from 'react';
import { Box, Paper, Typography, TextField, Button, Link, Container, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useUIStore from '@/store/uiStore';
import authService from '@/services/auth';

const ROLE_OPTIONS = [
  { value: 0, label: 'Admin' },
  { value: 1, label: 'Examiner' },
  { value: 2, label: 'Student' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setLoading: setAuthLoading } = useAuthStore();
  const { setLoading: setUILoading, addNotification } = useUIStore();

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 2,
  });

  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setUILoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role as 0 | 1 | 2,
      });

      if (response.token || response.accessToken) {
        const token = (response.token || response.accessToken) as string;
        setToken(token, response.refreshToken);

        if (response.user) {
          setUser(response.user);
        }

        addNotification({
          type: 'success',
          message: 'Registration successful!',
          duration: 3000,
        });

        navigate('/', { replace: true });
      } else {
        setError('Registration failed');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
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
          Create Account
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Register for Course Management System
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Full Name"
            placeholder="John Doe"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            placeholder="your@email.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            placeholder="+1234567890"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter password (min. 6 characters)"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              href="/login"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
