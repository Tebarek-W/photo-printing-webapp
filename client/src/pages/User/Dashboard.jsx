import React from 'react';
import { Container, Box, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import UserMessages from '../../components/UserMessages';
import { Email, Photo, Assignment, History } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: <Email sx={{ fontSize: 40 }} />,
      title: 'Contact Support',
      description: 'Send a message to our team',
      link: '/contact',
      color: '#3B82F6'
    },
    {
      icon: <Photo sx={{ fontSize: 40 }} />,
      title: 'Browse Gallery',
      description: 'Explore our photography services',
      link: '/gallery',
      color: '#8B5CF6'
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Place Order',
      description: 'Start a new printing order',
      link: '/order',
      color: '#10B981'
    },
    {
      icon: <History sx={{ fontSize: 40 }} />,
      title: 'Message History',
      description: 'View your conversations',
      link: '#messages',
      color: '#F59E0B'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Manage your account and view your communications with us.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              component={action.link.startsWith('/') ? RouterLink : 'div'}
              to={action.link.startsWith('/') ? action.link : undefined}
              onClick={action.link === '#messages' ? () => document.getElementById('messages').scrollIntoView() : undefined}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: action.color, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  {action.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Messages Section */}
      <Paper sx={{ p: 3 }} id="messages">
        <UserMessages />
      </Paper>

      {/* Additional Info */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'primary.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary.main">
          Need Help?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Our support team is here to help you with any questions about our services, orders, or your account.
        </Typography>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/contact"
          startIcon={<Email />}
        >
          Contact Support
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard;