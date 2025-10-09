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
  Grid,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { keyframes } from '@emotion/react';

// Custom animations
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

// Photography-inspired color palette
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      return 'Please enter your email address';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  console.log('🔵 [Register] Starting form submission...');

  // Client-side validation
  const validationError = validateForm();
  if (validationError) {
    console.log('🔴 [Register] Client validation failed:', validationError);
    setError(validationError);
    setLoading(false);
    return;
  }

  const { confirmPassword, ...registerData } = formData;
  
  console.log('🟡 [Register] Sending data to backend:', registerData);

  try {
    const result = await register(registerData);
    
    console.log('🟡 [Register] Backend response:', result);
    
    if (result.success) {
      console.log('🟢 [Register] SUCCESS! User registered and logged in.');
      console.log('🟢 [Register] User data:', result.user);
      
      // Show success message
      setError(''); // Clear any errors
      
      // Redirect to home page
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } else {
      console.log('🔴 [Register] Registration failed:', result.error);
      setError(result.error || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('🔴 [Register] Unexpected error:', error);
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Test backend connection
  const testBackend = async () => {
    try {
      console.log('🟡 Testing backend connection...');
      const response = await fetch('http://localhost:5000/');
      const data = await response.json();
      console.log('🟢 Backend test response:', data);
    } catch (error) {
      console.error('🔴 Backend test failed:', error);
    }
  };

  // Test backend on component mount
  React.useEffect(() => {
    testBackend();
  }, []);

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
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${floatAnimation} 6s ease-in-out infinite`,
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
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${floatAnimation} 8s ease-in-out infinite 1s`,
              pointerEvents: 'none'
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '8%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${floatAnimation} 10s ease-in-out infinite 2s`,
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
              {/* Camera Aperture Inspired Avatar */}
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
                  <PersonAddIcon 
                    sx={{ 
                      fontSize: 40, 
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
                Join Our Studio
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
                Create your account and start capturing beautiful moments with professional printing services
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  mt: 1, 
                  width: '100%',
                  '& .MuiTextField-root': {
                    mb: 2
                  }
                }}
              >
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
                
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      autoFocus
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
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
                        },
                        '& .MuiInputLabel-root': {
                          color: photoTheme.text.secondary,
                          '&.Mui-focused': {
                            color: photoTheme.primary
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
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
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{
                                color: photoTheme.text.secondary,
                                '&:hover': {
                                  color: photoTheme.primary
                                }
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={handleClickShowConfirmPassword}
                              edge="end"
                              sx={{
                                color: photoTheme.text.secondary,
                                '&:hover': {
                                  color: photoTheme.primary
                                }
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
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
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
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
                    'Create Account'
                  )}
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color={photoTheme.text.secondary}>
                    Already have an account?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/login" 
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
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;