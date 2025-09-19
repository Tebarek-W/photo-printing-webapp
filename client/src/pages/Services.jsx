import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowForward,
  Close,
  CameraAlt,
  Celebration,
  Print,
  AutoFixHigh,
  Book,
  Brush,
  Star,
  CheckCircle
} from '@mui/icons-material';

// Custom theme colors for photography/printing website
const photoTheme = {
  primary: '#2C3E50',     // Dark blue-black for professionalism
  secondary: '#E74C3C',   // Vibrant red for calls-to-action
  accent: '#3498DB',      // Bright blue for highlights
  neutral: '#ECF0F1',     // Light gray for backgrounds
  darkText: '#2C3E50',    // Dark text
  lightText: '#7F8C8D',   // Light text
  success: '#27AE60',     // Green for positive elements
  warning: '#F39C12',     // Orange for alerts
};

const services = [
  {
    title: 'Portrait Photography',
    description: 'Professional portrait sessions for individuals, families, and groups in our studio or on location.',
    detailedDescription: 'Our portrait photography sessions are tailored to your specific needs. We offer both studio and outdoor options, with multiple outfit changes and professional lighting setups.',
    price: '$150 - $400',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <CameraAlt />,
    features: ['Studio Sessions', 'Outdoor Options', 'Multiple Outfits', 'Digital Delivery', 'Professional Editing', 'Print Options']
  },
  {
    title: 'Event Photography',
    description: 'Capture your special events with our professional event photography services.',
    detailedDescription: 'Our event photography team specializes in capturing the essence of your special occasion with a photojournalistic approach.',
    price: '$300 - $1000',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <Celebration />,
    features: ['Weddings', 'Corporate Events', 'Birthdays', 'Full Coverage', 'Digital Gallery', 'Photo Album Options']
  },
  {
    title: 'Photo Printing',
    description: 'High-quality prints in various sizes and finishes to showcase your favorite photos.',
    detailedDescription: 'Our professional printing service uses museum-quality archival papers and pigment-based inks that resist fading for generations.',
    price: 'Starting at $5',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <Print />,
    features: ['Premium Paper', 'Multiple Sizes', 'Matte/Glossy', 'Fast Turnaround', 'Archival Quality', 'Custom Cropping']
  },
  {
    title: 'T-Shirt Printing',
    description: 'Create custom t-shirts with your designs, photos, or logos.',
    detailedDescription: 'Our custom t-shirt printing service allows you to create unique garments for events, businesses, or personal use.',
    price: '$15 - $40 per shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <AutoFixHigh />,
    features: ['Custom Designs', 'Multiple Garment Options', 'Bulk Discounts', 'Quick Turnaround', 'Premium Inks', 'Color Matching']
  },
  {
    title: 'Custom Photo Books',
    description: 'Create beautiful custom photo books to preserve your memories in a stylish format.',
    detailedDescription: 'Our custom photo books are professionally designed to showcase your images in the best possible way.',
    price: '$50 - $200',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <Book />,
    features: ['Custom Layouts', 'Premium Cover', 'Multiple Sizes', 'Personalized Design', 'Various Paper Options', 'Durable Binding']
  },
  {
    title: 'Digital Retouching',
    description: 'Professional photo retouching to enhance your images and remove imperfections.',
    detailedDescription: 'Our digital retouching services go beyond basic edits to transform your images.',
    price: '$20 - $100 per photo',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: <Brush />,
    features: ['Skin Retouching', 'Background Editing', 'Color Correction', 'Object Removal', 'Professional Grading', 'Natural Results']
  },
];

const Services = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedService, setSelectedService] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  return (
    <Box sx={{ py: 2, backgroundColor: '#F9FAFB' }}>
      {/* Hero Section for Services */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(photoTheme.primary, 0.05)} 0%, ${alpha(photoTheme.accent, 0.05)} 100%)`,
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              icon={<Star sx={{ color: photoTheme.secondary }} />}
              label="Our Services"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontSize: '1rem',
                height: 40,
                px: 2,
                backgroundColor: alpha(photoTheme.primary, 0.1),
                color: photoTheme.primary,
                '& .MuiChip-icon': { color: `${photoTheme.secondary} !important` }
              }}
            />
            
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                background: `linear-gradient(135deg, ${photoTheme.primary} 0%, ${photoTheme.accent} 100%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Professional Photography & Printing
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                color: photoTheme.lightText,
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Discover our comprehensive range of services designed to capture and preserve your most precious moments
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/order')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: photoTheme.secondary,
                  boxShadow: `0 4px 12px ${alpha(photoTheme.secondary, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(photoTheme.secondary, 0.9),
                    boxShadow: `0 6px 16px ${alpha(photoTheme.secondary, 0.4)}`,
                  },
                }}
              >
                Book a Service
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: photoTheme.primary,
                  color: photoTheme.primary,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: alpha(photoTheme.primary, 0.8),
                    backgroundColor: alpha(photoTheme.primary, 0.05)
                  }
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section with Alternating Layout */}
      <Container maxWidth="lg" sx={{ py: 2, mb: 8 }}>
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <Fade in timeout={800} key={index}>
              <Grid 
                container 
                spacing={4}
                direction={isMobile ? 'column-reverse' : (isEven ? 'row' : 'row-reverse')}
                sx={{ 
                  mb: 10,
                  alignItems: 'center',
                  flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}
              >
                {/* Image Column */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={4}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 28px ${alpha(photoTheme.primary, 0.15)}`
                      }
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.title}
                      sx={{
                        width: '100%',
                        height: 400,
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                        transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(photoTheme.primary, 0.9),
                        color: 'white',
                        boxShadow: 3
                      }}
                    >
                      {service.icon}
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Content Column */}
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      p: 4,
                      borderRadius: 3,
                      boxShadow: 'none',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Typography 
                        variant="h3" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          mb: 2,
                          color: photoTheme.primary,
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        sx={{
                          mb: 3,
                          lineHeight: 1.7,
                          fontSize: '1.1rem',
                          color: photoTheme.lightText
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <CheckCircle sx={{ fontSize: 22, color: photoTheme.success }} />
                            <Typography variant="body1" sx={{ fontSize: '1rem', color: photoTheme.darkText }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: photoTheme.secondary
                          }}
                        >
                          {service.price}
                        </Typography>
                        
                        {index % 2 === 0 && (
                          <Chip 
                            label="Most Popular" 
                            size="medium"
                            sx={{ 
                              fontWeight: 600,
                              backgroundColor: alpha(photoTheme.warning, 0.15),
                              color: photoTheme.warning
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button 
                          size="large" 
                          variant="contained"
                          onClick={() => navigate('/order')}
                          endIcon={<ArrowForward />}
                          sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2,
                            backgroundColor: photoTheme.secondary,
                            boxShadow: `0 4px 12px ${alpha(photoTheme.secondary, 0.3)}`,
                            '&:hover': {
                              backgroundColor: alpha(photoTheme.secondary, 0.9),
                              boxShadow: `0 6px 16px ${alpha(photoTheme.secondary, 0.4)}`,
                            },
                          }}
                        >
                          Book Now
                        </Button>
                        
                        <Button 
                          size="large" 
                          variant="outlined"
                          onClick={() => handleServiceClick(service)}
                          sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2,
                            borderWidth: 2,
                            borderColor: photoTheme.primary,
                            color: photoTheme.primary,
                            '&:hover': {
                              borderWidth: 2,
                              borderColor: alpha(photoTheme.primary, 0.8),
                              backgroundColor: alpha(photoTheme.primary, 0.05)
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Fade>
          );
        })}
      </Container>

      {/* Service Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ 
              m: 0, 
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: photoTheme.primary,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  color: photoTheme.primary
                }}>
                  {selectedService.icon}
                </Box>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                  {selectedService.title}
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  color: 'white',
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={selectedService.image}
                  alt={selectedService.title}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 3, color: photoTheme.darkText }}>
                  {selectedService.detailedDescription}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2, color: photoTheme.primary }}>
                  Service Includes:
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {selectedService.features.map((feature, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ fontSize: 20, color: photoTheme.success }} />
                        <Typography variant="body2" sx={{ color: photoTheme.darkText }}>
                          {feature}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ 
                  backgroundColor: alpha(photoTheme.primary, 0.1), 
                  p: 2, 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: photoTheme.secondary }}>
                    {selectedService.price}
                  </Typography>
                  <Button 
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => {
                      handleCloseDialog();
                      navigate('/order');
                    }}
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: photoTheme.secondary,
                      '&:hover': {
                        backgroundColor: alpha(photoTheme.secondary, 0.9),
                      },
                    }}
                  >
                    Book This Service
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Call to Action Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${photoTheme.primary} 0%, ${photoTheme.accent} 100%)`,
            borderRadius: 4,
            p: 5,
            textAlign: 'center',
            color: 'white',
            boxShadow: 4,
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            Can't Find What You're Looking For?
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            We offer custom photography and printing solutions tailored to your specific needs. 
            Contact us to discuss your unique project requirements.
          </Typography>
          
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/contact')}
            endIcon={<ArrowForward />}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: photoTheme.secondary,
              '&:hover': {
                backgroundColor: alpha(photoTheme.secondary, 0.9),
              },
            }}
          >
            Request Custom Service
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;