import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Container, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
      <Box component="main" sx={{ flexGrow: 1, py: isMobile ? 2 : 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;