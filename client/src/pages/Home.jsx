import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Box, Button, Container, Grid, Typography, useTheme, useMediaQuery,
  Card, Chip, Stack, alpha, IconButton, Tooltip, ThemeProvider,
  createTheme, CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero-placeholder.jpg';
import aboutImage from '../assets/about-placeholder.jpg';
import {
  ArrowForward,
  CameraAlt,
  Print,
  Palette,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  LightMode,
  DarkMode
} from '@mui/icons-material';

// Create a Theme Context with default values
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {}
});

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

// Custom animated social media icon component
const SocialIcon = ({ icon: Icon, label, href, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  
  return (
    <Tooltip title={label} placement="top" arrow>
      <IconButton
        component={motion.a}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 1, type: "spring", stiffness: 200 }}
        whileHover={{ 
          scale: 1.15,
          rotate: 5,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        sx={{
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha('#fff', 0.2)} 0%, transparent 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </IconButton>
    </Tooltip>
  );
};

// Glassmorphic service card component
const ServiceCard = ({ icon, title, description, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Grid item xs={12} md={4} key={index}>
      <Card
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } }
        }}
        whileHover={{ 
          y: -12,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
            : `linear-gradient(135deg, ${alpha('#fff', 0.8)} 0%, ${alpha('#fff', 0.6)} 100%)`,
          backdropFilter: 'blur(12px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 15px 35px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.5s ease'
          },
        }}
      >
        <Box
          className="service-icon"
          sx={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isHovered 
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              : theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            color: isHovered ? 'white' : theme.palette.primary.main,
            mb: 3,
            transition: 'all 0.4s ease',
            position: 'relative',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              padding: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.4s ease'
            }
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 36 } })}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: theme.palette.text.secondary, 
          mb: 3,
          flexGrow: 1
        }}>
          {description}
        </Typography>
        <Button
          endIcon={<ArrowForward />}
          onClick={() => navigate('/services')}
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
            }
          }}
        >
          Learn More
        </Button>
        
        {/* 3D accent effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            opacity: isHovered ? 0.1 : 0.05,
            transition: 'opacity 0.4s ease',
            zIndex: -1
          }}
        />
      </Card>
    </Grid>
  );
};

// Theme toggle component
const ThemeToggle = () => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  return (
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"} arrow>
      <IconButton
        onClick={toggleDarkMode}
        color="inherit"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

// Horizontal Service Cards Component
const HorizontalServiceCards = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const services = [
    { 
      icon: <CameraAlt />, 
      title: 'Photography', 
      description: 'Professional portrait, event, and commercial photography services with creative direction' 
    },
    { 
      icon: <Print />, 
      title: 'Printing', 
      description: 'High-quality printing solutions using premium materials for lasting results' 
    },
    { 
      icon: <Palette />, 
      title: 'Design', 
      description: 'Creative design services to make your projects stand out with unique visual identity' 
    },
  ];

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 }, 
      background: theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
        : `linear-gradient(180deg, ${alpha(theme.palette.grey[50], 0.5)} 0%, ${alpha(theme.palette.grey[100], 0.5)} 100%)`
    }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ textAlign: 'center', mb: 8 }}
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <Chip 
            label="Our Services" 
            color="secondary" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              fontSize: '0.9rem',
              height: 32
            }} 
            component={motion.div}
            variants={fadeInUp}
          />
          <Typography 
            variant="h3" 
            sx={{ fontWeight: 700, mb: 2 }}
            component={motion.h3}
            variants={fadeInUp}
          >
            What We Offer
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: theme.palette.text.secondary, maxWidth: 600, mx: 'auto' }}
            component={motion.p}
            variants={fadeInUp}
          >
            Discover our comprehensive range of photography and printing services tailored to your needs
          </Typography>
        </Box>
        
        {/* Horizontal Service Cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {services.map((service, index) => (
            <Card
              key={index}
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } }
              }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.3 }
              }}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 4,
                flex: 1,
                minWidth: isMobile ? '100%' : 300,
                maxWidth: isMobile ? '100%' : 380,
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#fff', 0.8)} 0%, ${alpha('#fff', 0.6)} 100%)`,
                backdropFilter: 'blur(12px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  : '0 15px 35px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  color: theme.palette.primary.main,
                  mb: 3,
                  transition: 'all 0.4s ease',
                }}
              >
                {React.cloneElement(service.icon, { sx: { fontSize: 36 } })}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {service.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.palette.text.secondary, 
                mb: 3,
                flexGrow: 1
              }}>
                {service.description}
              </Typography>
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/services')}
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                  }
                }}
              >
                Learn More
              </Button>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

const HomeContent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode } = useContext(ThemeContext);

  // Social media links data
  const socialLinks = [
    { icon: Instagram, label: "Follow on Instagram", href: "https://instagram.com" },
    { icon: Facebook, label: "Like on Facebook", href: "https://facebook.com" },
    { icon: Twitter, label: "Follow on Twitter", href: "https://twitter.com" },
  ];

  return (
    <Box>
      <ThemeToggle />
      
      {/* Enhanced Hero Section with Parallax and Animated Background */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          maxHeight: '1200px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 4,
        }}
      >
        {/* Animated background with gradient and pattern */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                135deg,
                ${alpha(theme.palette.primary.dark, 0.85)} 0%,
                ${alpha(theme.palette.secondary.dark, 0.85)} 100%
              ),
              url(${heroImage})
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
            zIndex: -2,
          }}
        />
        
        <Container maxWidth="lg" sx={{ px: 4, position: 'relative', zIndex: 1 }}>
          <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            sx={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              maxWidth: '800px',
              mx: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
              }
            }}
          >
            <Chip 
              icon={<CameraAlt />} 
              label="Professional Photography" 
              sx={{ 
                mb: 3, 
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                color: 'white',
                backdropFilter: 'blur(4px)',
                fontWeight: 600,
                py: 1
              }} 
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            />
            
            <Typography
              component={motion.h1}
              variants={fadeInUp}
              variant={isMobile ? 'h3' : 'h2'}
              gutterBottom
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${alpha(theme.palette.common.white, 0.8)} 100%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Capture Your Moments with Precision
            </Typography>
            
            <Typography
              component={motion.p}
              variants={fadeInUp}
              variant={isMobile ? 'body1' : 'h6'}
              gutterBottom
              sx={{
                mb: 5,
                color: theme.palette.grey[200],
                fontWeight: 300,
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              Professional photography services and premium printing solutions for timeless memories
            </Typography>
            
            <Box
              component={motion.div}
              variants={fadeInUp}
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center'
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/services')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 10px 24px ${alpha(theme.palette.secondary.main, 0.5)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Explore Services
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/order')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 2,
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 2,
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Order Now
              </Button>
            </Box>
          </Box>
        </Container>
        
        {/* Social Media Links */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            zIndex: 2
          }}
        >
          {socialLinks.map((social, index) => (
            <SocialIcon 
              key={index}
              icon={social.icon}
              label={social.label}
              href={social.href}
              index={index}
            />
          ))}
        </Box>
      </Box>

      {/* Modernized About Section with Split Layout */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* Text Column */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Box 
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              sx={{ 
                width: { xs: '100%', md: '90%' },
                ml: { md: 'auto' },
                pr: { md: 4 }
              }}
            >
              <Chip 
                label="Our Story" 
                color="primary" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  height: 32
                }} 
                component={motion.div}
                variants={fadeInUp}
              />
              
              <Typography
                component={motion.h2}
                variants={fadeInUp}
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Creating Memories That Last a Lifetime
              </Typography>
              
              <Typography 
                component={motion.p}
                variants={fadeInUp}
                variant="body1" 
                paragraph 
                sx={{ 
                  mb: 3, 
                  fontSize: '1.1rem',
                  color: theme.palette.text.secondary,
                  lineHeight: 1.7
                }}
              >
                Welcome to Josi Photo & Printing, where we transform your special moments into 
                timeless memories. With over 10 years of experience in professional photography 
                and high-quality printing.
              </Typography>
              
              <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
                {['Portrait Photography', 'Event Coverage', 'Custom Printing', 'Premium Quality'].map((item, index) => (
                  <Box 
                    component={motion.div}
                    variants={fadeInUp}
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              <Box
                component={motion.div}
                variants={fadeInUp}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/about')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  Learn More About Us
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Image Column */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            position: 'relative'
          }}>
            <Box
              component={motion.div}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                width: '100%',
                maxWidth: 550,
                aspectRatio: '1/1',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                '&:hover .about-image': {
                  transform: 'scale(1.05)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  zIndex: 1,
                  mixBlendMode: 'overlay'
                }
              }}
            >
              <Box
                className="about-image"
                component="img"
                src={aboutImage}
                alt="About Our Creative Studio"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s ease'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  zIndex: 2
                  }}
              >
                <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                  Our Creative Studio
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.8)">
                  Where magic happens
                </Typography>
              </Box>
              
              {/* Decorative Element */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                  opacity: 0.1,
                  zIndex: -1
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Horizontal Service Cards Section */}
      <HorizontalServiceCards />

      {/* Enhanced Call to Action */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainer}
          >
            <Typography
              component={motion.h3}
              variants={fadeInUp}
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Ready to Create Something Beautiful?
            </Typography>
            <Typography
              component={motion.p}
              variants={fadeInUp}
              variant="body1"
              paragraph
              sx={{
                mb: 5,
                fontSize: '1.1rem',
                maxWidth: '700px',
                mx: 'auto',
                color: theme.palette.grey[200]
              }}
            >
              Contact us today to discuss your project or browse our services to see how we can help.
            </Typography>
            <Box
              component={motion.div}
              variants={fadeInUp}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/contact')}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get in Touch
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// Create a wrapper component to handle theming
const ThemedApp = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
        light: '#6573c3',
        dark: '#2c387e'
      },
      secondary: {
        main: '#f50057',
        light: '#f73378',
        dark: '#ab003c'
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomeContent />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemedApp;