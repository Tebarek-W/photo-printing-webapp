import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as OrderIcon,
  AttachMoney as MoneyIcon,
  Photo as PhotoIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  DesignServices as DesignIcon,
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

// API service for contact messages
const contactService = {
  // Get all contact messages
  getMessages: async (page = 1, limit = 50, status = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    
    const response = await fetch(`http://localhost:5000/api/contact?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Get single message
  getMessage: async (id) => {
    const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Update message status
  updateStatus: async (id, status) => {
    const response = await fetch(`http://localhost:5000/api/contact/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  // Reply to message
  sendReply: async (id, replyMessage) => {
    const response = await fetch(`http://localhost:5000/api/contact/${id}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ replyMessage })
    });
    return await response.json();
  },

  // Delete message
  deleteMessage: async (id) => {
    const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }
};

// Mock data for orders and gallery services (keep existing)
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    serviceType: 'printing',
    serviceDetails: 'T-shirts Printing',
    quantity: 5,
    totalAmount: 75.00,
    status: 'pending',
    date: '2024-01-15',
    files: ['design1.jpg', 'design2.png'],
    specialInstructions: 'Need this by next week',
    address: '123 Main St, City, State'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    serviceType: 'photo',
    serviceDetails: 'Wedding Photography',
    quantity: 1,
    totalAmount: 300.00,
    status: 'in-progress',
    date: '2024-01-14',
    files: ['wedding_shotlist.pdf'],
    specialInstructions: 'Outdoor ceremony at garden',
    address: '456 Oak Ave, City, State'
  }
];

const mockGalleryServices = [
  {
    id: 1,
    title: 'Urban Landscape',
    category: 'Urban',
    description: 'Stunning cityscape photography capturing the essence of modern architecture.',
    photographer: 'John Doe',
    price: 49.99,
    status: 'active',
    uploadDate: '2024-01-10',
    downloads: 15,
    orders: 8
  }
];

const AdminDashboardContent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    totalPhotos: 0,
    pendingOrders: 0,
    unreadMessages: 0
  });
  const [orders, setOrders] = useState([]);
  const [galleryServices, setGalleryServices] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load mock data for orders and gallery
    setOrders(mockOrders);
    setGalleryServices(mockGalleryServices);
    
    // Load real contact messages
    await loadContactMessages();
    
    // Calculate stats
    setStats({
      totalUsers: 156,
      totalOrders: mockOrders.length,
      revenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalPhotos: mockGalleryServices.length,
      pendingOrders: mockOrders.filter(order => order.status === 'pending').length,
      unreadMessages: contactMessages.filter(msg => msg.status === 'unread').length
    });
  };

  const loadContactMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getMessages();
      
      if (response.success) {
        setContactMessages(response.data);
        // Update unread messages count in stats
        setStats(prev => ({
          ...prev,
          unreadMessages: response.stats.unread
        }));
      } else {
        showSnackbar('Failed to load messages', 'error');
      }
    } catch (error) {
      console.error('Failed to load contact messages:', error);
      showSnackbar('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 2) { // Contact messages tab
      loadContactMessages();
    }
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleViewMessage = async (message) => {
    try {
      // If message is unread, mark it as read
      if (message.status === 'unread') {
        const response = await contactService.updateStatus(message._id, 'read');
        if (response.success) {
          await loadContactMessages(); // Reload to update the list
        }
      }
      
      setSelectedMessage(message);
      setMessageDialogOpen(true);
    } catch (error) {
      console.error('Failed to view message:', error);
      showSnackbar('Failed to load message details', 'error');
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      showSnackbar('Please enter a reply message', 'error');
      return;
    }

    try {
      const response = await contactService.sendReply(selectedMessage._id, replyText);
      
      if (response.success) {
        showSnackbar('Reply sent successfully!');
        setReplyDialogOpen(false);
        setReplyText('');
        await loadContactMessages(); // Reload messages
      } else {
        showSnackbar(response.message || 'Failed to send reply', 'error');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      showSnackbar('Failed to send reply', 'error');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await contactService.updateStatus(messageId, 'read');
      if (response.success) {
        showSnackbar('Message marked as read');
        await loadContactMessages();
      } else {
        showSnackbar('Failed to update message', 'error');
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      showSnackbar('Failed to update message', 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await contactService.deleteMessage(messageId);
        if (response.success) {
          showSnackbar('Message deleted successfully');
          await loadContactMessages();
        } else {
          showSnackbar('Failed to delete message', 'error');
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
        showSnackbar('Failed to delete message', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'read':
      case 'replied':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
      case 'unread':
        return 'error';
      case 'shipped':
        return 'info';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'printing':
        return <PrintIcon />;
      case 'photo':
        return <PhotoIcon />;
      case 'design':
        return <DesignIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}30, ${color}10)` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, color: color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const OrderManagementTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Order Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {order.customer}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getServiceIcon(order.serviceType)}
                    <Typography variant="body2">
                      {order.serviceDetails}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ${order.totalAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small" 
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewOrder(order)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={() => handleOrderStatusChange(order.id, 'completed')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="warning"
                    onClick={() => handleOrderStatusChange(order.id, 'in-progress')}
                  >
                    <ShippingIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const GalleryManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Gallery & Services Management
        </Typography>
        <Button variant="contained" startIcon={<PhotoIcon />}>
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {galleryServices.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Chip 
                      label={service.category} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Chip 
                    label={service.status} 
                    size="small" 
                    color={getStatusColor(service.status)}
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">
                    By {service.photographer}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${service.price}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Downloads: {service.downloads} • Orders: {service.orders}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color={service.status === 'active' ? 'warning' : 'success'}>
                      {service.status === 'active' ? <CancelIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const ContactManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Contact Messages
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadContactMessages}
            disabled={loading}
          >
            Refresh
          </Button>
          <Badge badgeContent={stats.unreadMessages} color="error">
            <EmailIcon color="action" />
          </Badge>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : contactMessages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmailIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Messages Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Contact messages from users will appear here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {contactMessages.map((message) => (
            <Grid item xs={12} key={message._id}>
              <Card sx={{ 
                borderLeft: message.status === 'unread' ? `4px solid ${theme.palette.error.main}` : '4px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {message.subject || 'General Inquiry'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        From: {message.name} • {message.email} • {message.phone || 'No phone provided'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {message.message}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                      {message.replied && (
                        <Chip 
                          label="Replied" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                        />
                      )}
                      <Chip 
                        label={message.status} 
                        size="small" 
                        color={getStatusColor(message.status)}
                      />
                      <Typography variant="caption" color="textSecondary" sx={{ minWidth: 120, textAlign: 'right' }}>
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewMessage(message)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      variant="outlined"
                      onClick={() => handleReply(message)}
                    >
                      Reply
                    </Button>
                    {message.status === 'unread' && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => handleMarkAsRead(message._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      variant="text"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Welcome back, {user?.name}! Manage your photo printing business efficiently.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<PeopleIcon />}
            title="Total Users"
            value={stats.totalUsers}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<OrderIcon />}
            title="Total Orders"
            value={stats.totalOrders}
            color={theme.palette.success.main}
            subtitle={`${stats.pendingOrders} pending`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<MoneyIcon />}
            title="Revenue"
            value={`$${stats.revenue}`}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<PhotoIcon />}
            title="Gallery Items"
            value={stats.totalPhotos}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<EmailIcon />}
            title="Messages"
            value={contactMessages.length}
            color={theme.palette.error.main}
            subtitle={`${stats.unreadMessages} unread`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<ChatIcon />}
            title="Response Rate"
            value="92%"
            color={theme.palette.success.main}
            subtitle="This month"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<OrderIcon />} 
            label={
              <Badge badgeContent={stats.pendingOrders} color="error">
                Orders
              </Badge>
            } 
          />
          <Tab 
            icon={<PhotoIcon />} 
            label="Gallery Services" 
          />
          <Tab 
            icon={<EmailIcon />} 
            label={
              <Badge badgeContent={stats.unreadMessages} color="error">
                Messages
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <OrderManagementTab />}
        {activeTab === 1 && <GalleryManagementTab />}
        {activeTab === 2 && <ContactManagementTab />}
      </Box>

      {/* Order Details Dialog */}
      <Dialog 
        open={orderDialogOpen} 
        onClose={() => setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - {selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name" secondary={selectedOrder.customer} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={selectedOrder.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Phone" secondary={selectedOrder.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Address" secondary={selectedOrder.address} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Order Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Service" secondary={selectedOrder.serviceDetails} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Quantity" secondary={selectedOrder.quantity} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Total Amount" secondary={`$${selectedOrder.totalAmount}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Status" secondary={
                      <Chip 
                        label={selectedOrder.status} 
                        size="small" 
                        color={getStatusColor(selectedOrder.status)}
                      />
                    } />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Special Instructions</Typography>
                <Typography variant="body2">{selectedOrder.specialInstructions}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Attached Files</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedOrder.files.map((file, index) => (
                    <Chip key={index} label={file} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleOrderStatusChange(selectedOrder.id, 'completed');
              setOrderDialogOpen(false);
            }}
          >
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Details Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Message from {selectedMessage?.name}
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name" secondary={selectedMessage.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={selectedMessage.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Phone" secondary={selectedMessage.phone || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Date" secondary={formatDate(selectedMessage.createdAt)} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>Message Status</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Status" secondary={
                      <Chip 
                        label={selectedMessage.status} 
                        size="small" 
                        color={getStatusColor(selectedMessage.status)}
                      />
                    } />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Replied" secondary={
                      <Chip 
                        label={selectedMessage.replied ? 'Yes' : 'No'} 
                        size="small" 
                        color={selectedMessage.replied ? 'success' : 'default'}
                      />
                    } />
                  </ListItem>
                  {selectedMessage.repliedAt && (
                    <ListItem>
                      <ListItemText primary="Replied At" secondary={formatDate(selectedMessage.repliedAt)} />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Subject</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedMessage.subject || 'General Inquiry'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Message</Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Grid>
              {selectedMessage.adminReply && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Your Reply</Typography>
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'primary.50' }}>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedMessage.adminReply}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Close</Button>
          <Button 
            variant="outlined"
            onClick={() => {
              setMessageDialogOpen(false);
              handleReply(selectedMessage);
            }}
          >
            Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reply to {selectedMessage?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            To: {selectedMessage?.email}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Subject: Re: {selectedMessage?.subject || 'General Inquiry'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Original Message:
          </Typography>
          <Paper variant="outlined" sx={{ p: 1, mb: 2, backgroundColor: 'grey.50', maxHeight: 100, overflow: 'auto' }}>
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedMessage?.message}
            </Typography>
          </Paper>
          <TextField
            autoFocus
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            label="Your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendReply}
            disabled={!replyText.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Wrap the dashboard with ProtectedRoute
const AdminDashboard = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default AdminDashboard;