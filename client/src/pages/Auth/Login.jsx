import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  CssBaseline,
  Avatar,
  Link,
  Fade
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { keyframes } from '@emotion/react';

// Reuse the same animations and theme from register page
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

const photoTheme = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
  surface: 'rgba(255, 255, 255, 0.95)',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8'
  },
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  lensFlare: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@josi.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'user@josi.com',
        password: 'user123'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: photoTheme.background,
        backgroundSize: '400% 400%',
        animation: `${gradientShift} 15s ease infinite`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: photoTheme.lensFlare,
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${floatAnimation} 8s ease-in-out infinite`,
          pointerEvents: 'none'
        }
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          {/* Additional Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '25%',
              right: '10%',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${floatAnimation} 9s ease-in-out infinite 1.5s`,
              pointerEvents: 'none'
            }}
          />

          <Fade in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 3, sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: 4,
                background: photoTheme.surface,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: photoTheme.gradient,
                  backgroundSize: '200% 200%',
                  animation: `${gradientShift} 3s ease infinite`
                }
              }}
            >
              {/* Camera Shutter Inspired Avatar */}
              <Box
                sx={{
                  position: 'relative',
                  mb: 3
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'transparent',
                    background: photoTheme.gradient,
                    animation: `${pulseGlow} 2s ease-in-out infinite`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60%',
                      height: '60%',
                      backgroundColor: 'white',
                      borderRadius: '50%'
                    }
                  }}
                >
                  <LockOutlinedIcon 
                    sx={{ 
                      fontSize: 35, 
                      color: photoTheme.primary,
                      position: 'relative',
                      zIndex: 1
                    }} 
                  />
                </Avatar>
              </Box>

              <Typography 
                component="h1" 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  background: photoTheme.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              
              <Typography 
                variant="h6" 
                color={photoTheme.text.secondary} 
                align="center" 
                sx={{ 
                  mb: 4,
                  fontWeight: 400,
                  maxWidth: '400px'
                }}
              >
                Sign in to your account and continue creating beautiful memories
              </Typography>

              {/* Demo Credentials */}
              <Box sx={{ mb: 4, width: '100%' }}>
                <Typography variant="body2" color={photoTheme.text.secondary} gutterBottom align="center">
                  Quick Access Demo Accounts:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                  <Button
                    fullWidth
                    size="medium"
                    variant="outlined"
                    onClick={() => fillDemoCredentials('admin')}
                    sx={{
                      borderRadius: 2,
                      borderColor: photoTheme.primary,
                      color: photoTheme.primary,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        transform: 'translateY(-2px)',
                        borderColor: photoTheme.primary
                      }
                    }}
                  >
                    Admin Account
                  </Button>
                  <Button
                    fullWidth
                    size="medium"
                    variant="outlined"
                    onClick={() => fillDemoCredentials('user')}
                    sx={{
                      borderRadius: 2,
                      borderColor: photoTheme.secondary,
                      color: photoTheme.secondary,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        transform: 'translateY(-2px)',
                        borderColor: photoTheme.secondary
                      }
                    }}
                  >
                    User Account
                  </Button>
                </Box>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.05)'
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(59, 130, 246, 0.25)'
                      }
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(59, 130, 246, 0.25)'
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 1, 
                    mb: 3, 
                    py: 1.8,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    background: photoTheme.gradient,
                    backgroundSize: '200% 200%',
                    animation: `${gradientShift} 3s ease infinite`,
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                      animation: 'none'
                    },
                    '&:active': {
                      transform: 'translateY(-1px)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s ease'
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Sign In to Your Studio'
                  )}
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color={photoTheme.text.secondary} sx={{ mb: 1 }}>
                    New to our studio?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/register" 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: photoTheme.primary,
                        textDecoration: 'none',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '0%',
                          height: '2px',
                          bottom: -2,
                          left: 0,
                          background: photoTheme.primary,
                          transition: 'width 0.3s ease'
                        },
                        '&:hover::after': {
                          width: '100%'
                        }
                      }}
                    >
                      Create an account
                    </Link>
                  </Typography>
                  <Link 
                    component={RouterLink} 
                    to="/" 
                    variant="body2" 
                    sx={{ 
                      color: photoTheme.text.light,
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: photoTheme.primary
                      }
                    }}
                  >
                    ← Back to Home
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;