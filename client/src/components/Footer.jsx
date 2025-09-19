import React from 'react';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  useTheme,
  IconButton,
  Chip
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  Phone,
  LocationOn,
  CameraAlt,
  Print,
  DesignServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const theme = useTheme();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/', icon: null },
    { label: 'Services', href: '/services', icon: DesignServices },
    { label: 'Gallery', href: '/gallery', icon: CameraAlt },
    { label: 'Order Prints', href: '/order', icon: Print },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  const services = [
    'Portrait Photography',
    'Event Coverage',
    'Photo Printing',
    'Album Design'
  ];

  // Dark gray color palette
  const darkGrayPalette = {
    background: '#2A2A2A',
    lighter: '#3A3A3A',
    text: '#E0E0E0',
    accent: '#A0A0A0',
    border: '#404040'
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        backgroundColor: darkGrayPalette.background,
        color: darkGrayPalette.text,
        transition: 'all 0.3s ease',
        borderTop: `1px solid ${darkGrayPalette.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CameraAlt sx={{ 
                color: theme.palette.primary.main, 
                mr: 1, 
                fontSize: 28 
              }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: darkGrayPalette.text,
              }}>
                Josi Photo & Printing
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              opacity: 0.8, 
              mb: 2, 
              lineHeight: 1.6,
              pl: 3.5,
              color: darkGrayPalette.accent
            }}>
              Capturing moments with precision and delivering exceptional print quality in Addis Ababa.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, pl: 3.5 }}>
              {socialLinks.map((social) => (
                <motion.div
                  key={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    href={social.href}
                    aria-label={social.label}
                    size="small"
                    sx={{
                      backgroundColor: darkGrayPalette.lighter,
                      color: darkGrayPalette.text,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <social.icon fontSize="small" />
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: darkGrayPalette.text,
            }}>
              <DesignServices fontSize="small" />
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.2s ease',
                    color: darkGrayPalette.accent,
                    '&:hover': {
                      opacity: 1,
                      color: theme.palette.primary.main,
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  {link.icon && <link.icon sx={{ fontSize: 16 }} />}
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: darkGrayPalette.text,
            }}>
              <Print fontSize="small" />
              Services
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {services.map((service) => (
                <Chip
                  key={service}
                  label={service}
                  size="small"
                  variant="outlined"
                  sx={{
                    justifyContent: 'flex-start',
                    backgroundColor: darkGrayPalette.lighter,
                    color: darkGrayPalette.text,
                    borderColor: darkGrayPalette.border,
                    fontSize: '0.8rem',
                    height: 28,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: darkGrayPalette.text,
            }}>
              <Phone fontSize="small" />
              Contact Info
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ 
                  fontSize: 18, 
                  color: theme.palette.primary.main 
                }} />
                <Typography variant="body2" sx={{ 
                  opacity: 0.8, 
                  fontSize: '0.9rem',
                  color: darkGrayPalette.accent 
                }}>
                  info@josiphotoprint.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ 
                  fontSize: 18, 
                  color: theme.palette.primary.main 
                }} />
                <Typography variant="body2" sx={{ 
                  opacity: 0.8, 
                  fontSize: '0.9rem',
                  color: darkGrayPalette.accent 
                }}>
                  (+251) 942081178
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ 
                  fontSize: 18, 
                  color: theme.palette.primary.main,
                  mt: 0.25 
                }} />
                <Typography variant="body2" sx={{ 
                  opacity: 0.8, 
                  fontSize: '0.9rem',
                  color: darkGrayPalette.accent 
                }}>
                  Addis Ababa, Ethiopia
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4, 
          pt: 3, 
          borderTop: `1px solid ${darkGrayPalette.border}` 
        }}>
          <Typography variant="body2" sx={{ 
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            color: darkGrayPalette.accent
          }}>
            © {new Date().getFullYear()} Josi Photo & Printing
            <Box component="span" sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 600
            }}>
              •
            </Box>
            All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;