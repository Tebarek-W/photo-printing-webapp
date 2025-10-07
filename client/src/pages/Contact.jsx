import { Box, Button, Container, Grid, TextField, Typography, Paper, Card, Chip, useTheme, alpha, Fade } from '@mui/material';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const Contact = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure we have the user data even if fields are disabled
    const submissionData = {
      ...formData,
      name: user?.name || formData.name,
      email: user?.email || formData.email
    };

    console.log('📤 Sending contact message:', submissionData);
    console.log('🔐 User status:', isAuthenticated ? `Authenticated as ${user?.name}` : 'Guest user');

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Sending request with authentication token');
      } else {
        console.log('🔐 Sending request as guest user');
      }

      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Message sent successfully:', data);
        setIsSubmitted(true);
        
        // Reset form but keep user data if logged in
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          message: '',
        });

        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
        console.error('❌ Message send failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      py: 8, 
      background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip 
            label="Get In Touch" 
            color="primary" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              fontSize: '1rem',
              height: 40,
              px: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }} 
          />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              mb: 4, 
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {isAuthenticated 
              ? `Welcome ${user?.name}! Your messages will be saved to your account.`
              : 'Get in touch with our team for inquiries or appointments. We\'re here to help bring your vision to life.'
            }
          </Typography>

          {/* Authentication Status Info */}
          {isAuthenticated && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                maxWidth: 400,
                mx: 'auto'
              }}
            >
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" />
                You are logged in. Your messages will be saved to your account.
              </Typography>
            </Paper>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'white',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
                Send us a Message
              </Typography>
              
              {error && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.error.main, 0.1), borderRadius: 2 }}>
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              )}
              
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <TextField
                  label="Your Name"
                  variant="outlined"
                  name="name"
                  value={user?.name || formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loading || !!user?.name}
                  helperText={user?.name && "Prefilled from your account"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={user?.email || formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loading || !!user?.email}
                  helperText={user?.email && "Prefilled from your account"}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <TextField
                  label="Your Message"
                  variant="outlined"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={loading ? <CheckCircleIcon /> : <SendIcon />}
                  disabled={loading || isSubmitted}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    transition: 'all 0.3s ease',
                    '&:disabled': {
                      background: theme.palette.action.disabled,
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {loading ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send Message'}
                </Button>

                {/* Authentication Notice */}
                {!isAuthenticated && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    💡 <strong>Tip:</strong>{' '}
                    <Box 
                      component="span" 
                      sx={{ 
                        color: theme.palette.primary.main, 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onClick={() => window.location.href = '/login'}
                    >
                      Log in
                    </Box>{' '}
                    to save your messages to your account and track responses!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              sx={{ height: '100%' }}
            >
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: 'white',
                  height: '100%',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                  Contact Information
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  {[
                    { icon: <LocationOnIcon sx={{ fontSize: 30 }} />, text: '123 Photography Street, Studio City, CA 90210' },
                    { icon: <PhoneIcon sx={{ fontSize: 30 }} />, text: '(123) 456-7890' },
                    { icon: <EmailIcon sx={{ fontSize: 30 }} />, text: 'info@josiphotoprint.com' },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      component={motion.div}
                      variants={fadeInUp}
                      sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}
                    >
                      <Box sx={{ mr: 2, mt: 0.5 }}>{item.icon}</Box>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: 28 }} />
                    Business Hours
                  </Typography>
                  <Box component={motion.div} variants={fadeInUp}>
                    <Typography paragraph sx={{ mb: 1, opacity: 0.9 }}>
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </Typography>
                    <Typography paragraph sx={{ mb: 1, opacity: 0.9 }}>
                      Saturday: 10:00 AM - 4:00 PM
                    </Typography>
                    <Typography sx={{ opacity: 0.9 }}>
                      Sunday: Closed
                    </Typography>
                  </Box>
                </Box>

                {/* Message Tracking Info */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    {isAuthenticated 
                      ? '📬 Your messages are saved to your account. View them in "My Messages".'
                      : '💡 Create an account to track your messages and responses!'
                    }
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Success Message */}
        <Fade in={isSubmitted}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: theme.palette.success.main,
              color: 'white',
              px: 3,
              py: 2,
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              zIndex: 9999
            }}
          >
            <CheckCircleIcon />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Your message has been sent successfully!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isAuthenticated 
                  ? 'You can track responses in "My Messages".'
                  : 'We\'ll get back to you soon.'
                }
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Contact;