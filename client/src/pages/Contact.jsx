import { Box, Button, Container, Grid, TextField, Typography, Paper, Card, Chip, useTheme, alpha, Fade } from '@mui/material';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

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

// Add the missing scaleIn animation
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
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
            Get in touch with our team for inquiries or appointments. We're here to help bring your vision to life.
          </Typography>
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
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
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
                  endIcon={isSubmitted ? <CheckCircleIcon /> : <SendIcon />}
                  disabled={isSubmitted}
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
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitted ? 'Message Sent!' : 'Send Message'}
                </Button>
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

                {/* Social Media Links */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Follow us on social media
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {['Instagram', 'Facebook', 'Twitter'].map((platform, index) => (
                      <Box
                        key={index}
                        component={motion.div}
                        whileHover={{ scale: 1.1, y: -3 }}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {platform}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
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
              gap: 1
            }}
          >
            <CheckCircleIcon />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Your message has been sent successfully!
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Contact;