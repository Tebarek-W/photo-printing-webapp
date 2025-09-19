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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

// Import your profile photo
import profilePhoto from "../assets/profile.jpg";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Gallery", path: "/gallery" },
  { name: "Order", path: "/order" },
  { name: "Contact", path: "/contact" },
  { name: "Admin", path: "/admin" },
];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.name} sx={{ color: "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
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
          <Box sx={{ display: "flex" }}>
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
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    textDecoration: "none",
                  },
                }}
              >
                {item.name}
              </Typography>
            ))}
          </Box>
        )}
      </Toolbar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 240,
            backgroundColor: "#1A2E40",
            color: "white"
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;