import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography,
  useTheme,
  alpha,
  useMediaQuery,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Fade,
  Chip,
  Slide,
  Zoom
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowForward,
  Close,
  Print,
  PhotoCamera,
  DesignServices,
  Check,
  Star,
  Launch,
  Palette,
  Gradient
} from '@mui/icons-material';

// Modern color palette
const modernTheme = {
  primary: '#2563eb',     // Modern blue
  secondary: '#8b5cf6',   // Purple accent
  accent: '#06b6d4',      // Cyan
  neutral: '#f8fafc',     // Light background
  darkText: '#1e293b',    // Dark text
  lightText: '#64748b',   // Light text
  success: '#10b981',     // Emerald
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
};

// Service categories data with enhanced details
const serviceCategories = [
  {
    title: 'Printing Services',
    icon: <Print sx={{ fontSize: 32 }} />,
    gradient: modernTheme.gradient,
    items: [
      'T-shirts',
      'Banners',
      'Stickers',
      'Mugs (prints on cups)',
      'Business cards',
      'Caps',
      'Scarves',
      'Certificates'
    ],
    description: 'Premium printing solutions with cutting-edge technology and fastest turnaround',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['High-Quality Materials', 'Fast Turnaround', 'Eco-Friendly Options', 'Bulk Discounts']
  },
  {
    title: 'Photo Services',
    icon: <PhotoCamera sx={{ fontSize: 32 }} />,
    gradient: modernTheme.gradient2,
    items: [
      'Onsite photography',
      'Studio photography',
      'Event photos (weddings, birthdays, graduations, etc.)',
      'Frame photos (family portraits, decorative frames, etc.)',
      'Other photography packages (premium editing, albums, etc.)'
    ],
    description: 'Capture life\'s precious moments with professional photography services',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Professional Equipment', 'Creative Direction', 'Premium Editing', 'Fast Delivery']
  },
  {
    title: 'Design Services',
    icon: <DesignServices sx={{ fontSize: 32 }} />,
    gradient: modernTheme.gradient3,
    items: [
      'Logo design',
      'Business card design',
      'Certificate design',
      'Marketing materials (flyers, posters, banners)',
      'Custom graphic design'
    ],
    description: 'Transform your vision into stunning visual designs that make an impact',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Modern Designs', 'Multiple Revisions', 'Brand Consistency', 'Quick Turnaround']
  }
];

const Services = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ 
      py: 2, 
      backgroundColor: modernTheme.neutral,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Modern Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          py: { xs: 6, md: 10 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<Star sx={{ color: modernTheme.secondary }} />}
              label="Premium Services"
              sx={{
                mb: 3,
                fontWeight: 600,
                fontSize: '0.9rem',
                height: 36,
                px: 2,
                backgroundColor: 'white',
                color: modernTheme.primary,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '& .MuiChip-icon': { color: `${modernTheme.secondary} !important` }
              }}
            />
            
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                background: modernTheme.gradient,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1.1
              }}
            >
              Elevate Your Brand
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                color: modernTheme.lightText,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: '1.2rem'
              }}
            >
              Discover our comprehensive suite of printing, photography, and design services tailored to bring your vision to life
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Advanced Services Grid */}
      <Container maxWidth="lg" sx={{ py: 2, mb: 8 }}>
        <Grid container spacing={3}>
          {serviceCategories.map((category, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: `0 24px 48px ${alpha(modernTheme.primary, 0.15)}`,
                    }
                  }}
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {/* Gradient Header */}
                  <Box sx={{ 
                    height: 8,
                    background: category.gradient,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    }
                  }} />
                  
                  {/* Category Content */}
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Icon with Gradient Background */}
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      gap: 2
                    }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: category.gradient,
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                      }}>
                        {category.icon}
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700,
                          background: category.gradient,
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {category.title}
                      </Typography>
                    </Box>
                    
                    {/* Description */}
                    <Typography 
                      variant="body1" 
                      sx={{
                        mb: 3,
                        lineHeight: 1.6,
                        color: modernTheme.lightText,
                        flexGrow: 1
                      }}
                    >
                      {category.description}
                    </Typography>
                    
                    {/* Features Chips */}
                    <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {category.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          sx={{
                            backgroundColor: alpha(modernTheme.primary, 0.1),
                            color: modernTheme.primary,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                    </Box>
                    
                    {/* Services List */}
                    <Box sx={{ mb: 3 }}>
                      {category.items.map((item, idx) => (
                        <Box 
                          key={idx}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5, 
                            mb: 1.5,
                            transition: 'all 0.3s ease',
                            padding: '4px 8px',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: alpha(modernTheme.primary, 0.05),
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Check sx={{ 
                            fontSize: 18, 
                            color: modernTheme.success,
                            flexShrink: 0
                          }} />
                          <Typography variant="body2" sx={{ 
                            color: modernTheme.darkText,
                            fontSize: '0.9rem'
                          }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Action Button */}
                    <Button 
                      fullWidth
                      variant="contained"
                      onClick={() => handleCategoryClick(category)}
                      endIcon={<Launch />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 3,
                        background: category.gradient,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          background: category.gradient,
                        },
                      }}
                    >
                      Explore Services
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Modern CTA Section */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Slide direction="up" in timeout={1000}>
          <Box
            sx={{
              background: modernTheme.gradient,
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography variant="h3" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Ready to Get Started?
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem' }}>
                Let's create something amazing together. Get a free consultation and quote for your project.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/order')}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    color: modernTheme.primary,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  Start Project
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'white',
                      backgroundColor: alpha('#fff', 0.1),
                    }
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Container>

      {/* Enhanced Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          }
        }}
      >
        {selectedCategory && (
          <>
            <DialogTitle sx={{ 
              m: 0, 
              p: 0,
              position: 'relative'
            }}>
              <Box sx={{
                height: 200,
                background: `linear-gradient(135deg, ${selectedCategory.gradient}), url(${selectedCategory.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                p: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                }
              }}>
                <Box sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: 3,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      color: modernTheme.primary
                    }}>
                      {selectedCategory.icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {selectedCategory.title}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {selectedCategory.description}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: modernTheme.primary }}>
                    Services Included
                  </Typography>
                  {selectedCategory.items.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Check sx={{ color: modernTheme.success, flexShrink: 0 }} />
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: modernTheme.primary }}>
                    Key Features
                  </Typography>
                  {selectedCategory.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      sx={{
                        m: 0.5,
                        backgroundColor: alpha(modernTheme.primary, 0.1),
                        color: modernTheme.primary,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Services;