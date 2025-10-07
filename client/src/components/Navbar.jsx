import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  CircularProgress,
  Button // Added missing import
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { styled } from "@mui/material/styles";

import profilePhoto from "../assets/profile.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  marginRight: theme.spacing(2),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(1),
  border: `2px solid ${theme.palette.common.white}`,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: ".1rem",
  color: "inherit",
  fontSize: "1.1rem",
  lineHeight: 1.2,
  background: "linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)",
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
}));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Order", path: "/order" },
    { name: "Contact", path: "/contact" },
  ];

  // Add My Messages link for logged-in users (non-admin)
  if (isAuthenticated && user?.role !== 'admin') {
    navItems.push({ 
      name: "My Messages", 
      path: "/user/dashboard"
    });
  }

  // Add Admin link only for admin users
  if (user?.role === 'admin') {
    navItems.push({ 
      name: "Admin", 
      path: "/admin",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 18, mr: 1 }} />
    });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleProfileMenuClose();
    setMobileOpen(false);
  };

  const handleDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user/dashboard');
    }
    handleProfileMenuClose();
  };

  // Show loading spinner while auth is loading
  if (loading) {
    return (
      <AppBar position="static" sx={{ mb: 4, backgroundColor: "#1A2E40" }}>
        <Toolbar>
          <Box display="flex" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress size={24} sx={{ color: 'white' }} />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 2 }}>
        <ProfileAvatar
          src={profilePhoto}
          alt="Josi Photo"
          sx={{ width: 60, height: 60, mr: 1 }}
        />
        <Box sx={{ textAlign: "left" }}>
          <LogoText variant="h6" component="div">
            JOSI PHOTO
          </LogoText>
          <LogoText variant="body2" component="div" sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
            AND PRINTING
          </LogoText>
        </Box>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
      
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{ 
                textAlign: "center",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              }}
            >
              {item.icon && item.icon}
              <ListItemText 
                primary={item.name} 
                sx={{ color: "white" }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Mobile Auth Section */}
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', my: 1 }} />
        
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleDashboard}
                sx={{ 
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}
              >
                <DashboardIcon sx={{ fontSize: 20, mr: 2, color: 'white' }} />
                <ListItemText 
                  primary={`Dashboard (${user?.name})`} 
                  sx={{ color: "white", textAlign: 'left' }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ 
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}
              >
                <LogoutIcon sx={{ fontSize: 20, mr: 2, color: 'white' }} />
                <ListItemText 
                  primary="Logout" 
                  sx={{ color: "white", textAlign: 'left' }} 
                />
              </ListItemButton>
            </ListItem>
            {user?.role === 'admin' && (
              <ListItem disablePadding>
                <Box sx={{ px: 2, py: 1, width: '100%' }}>
                  <Chip 
                    label="ADMIN" 
                    size="small" 
                    color="warning" 
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: '#ff9800',
                      color: 'white'
                    }} 
                  />
                </Box>
              </ListItem>
            )}
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/login"
                sx={{ 
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 20, mr: 2, color: 'white' }} />
                <ListItemText 
                  primary="Login" 
                  sx={{ color: "white", textAlign: 'left' }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/register"
                sx={{ 
                  textAlign: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 20, mr: 2, color: 'white' }} />
                <ListItemText 
                  primary="Register" 
                  sx={{ color: "white", textAlign: 'left' }} 
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      onClick={handleProfileMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          minWidth: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
          },
        },
      }}
    >
      <MenuItem disabled>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          {user?.role === 'admin' && (
            <Chip 
              label="ADMIN" 
              size="small" 
              color="warning" 
              sx={{ 
                mt: 0.5,
                fontSize: '0.7rem',
                height: 20,
                fontWeight: 'bold'
              }} 
            />
          )}
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDashboard}>
        <DashboardIcon sx={{ mr: 2, fontSize: 20 }} />
        {user?.role === 'admin' ? 'Admin Dashboard' : 'My Messages'}
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" sx={{ mb: 4, backgroundColor: "#1A2E40" }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <LogoContainer
          component={Link}
          to="/"
          sx={{
            flexGrow: isMobile ? 0 : 1,
          }}
        >
          <ProfileAvatar
            src={profilePhoto}
            alt="Josi Photo"
          />
          {!isMobile && (
            <Box sx={{ ml: 1, display: "flex", flexDirection: "column" }}>
              <LogoText variant="h6" component="div">
                JOSI PHOTO
              </LogoText>
              <LogoText variant="body2" component="div" sx={{ fontSize: "0.8rem", fontWeight: 500, lineHeight: 1 }}>
                AND PRINTING
              </LogoText>
            </Box>
          )}
        </LogoContainer>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* Navigation Links */}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {navItems.map((item) => (
                <Typography
                  key={item.name}
                  component={Link}
                  to={item.path}
                  variant="body1"
                  sx={{
                    color: "white",
                    mx: 1.5,
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    transition: "all 0.3s ease",
                    fontSize: "1rem",
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      textDecoration: "none",
                    },
                  }}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Typography>
              ))}
            </Box>

            {/* Desktop Auth Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to={user?.role === 'admin' ? '/admin' : '/user/dashboard'}
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Messages'}
                  </Button>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  {user?.role === 'admin' && (
                    <Chip 
                      label="ADMIN" 
                      size="small" 
                      color="warning" 
                      sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: '#ff9800',
                        color: 'white'
                      }} 
                    />
                  )}
                </>
              ) : (
                <>
                  <Typography
                    component={Link}
                    to="/login"
                    variant="body1"
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        textDecoration: "none",
                      },
                    }}
                  >
                    Login
                  </Typography>
                  <Typography
                    component={Link}
                    to="/register"
                    variant="body1"
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      fontSize: "1rem",
                      fontWeight: 500,
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        textDecoration: "none",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    Register
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 280,
            backgroundColor: "#1A2E40",
            color: "white"
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      {profileMenu}
    </AppBar>
  );
};

export default Navbar;