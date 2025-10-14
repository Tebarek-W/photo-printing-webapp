import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  MenuItem,
  CardMedia,
  CardActions,
  Tooltip,
  alpha,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Fab,
  Zoom,
  Fade,
  Slide
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
  Chat as ChatIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  LocalOffer as LocalOfferIcon,
  Category as CategoryIcon,
  CloudUpload as CloudUploadIcon,
  Update as UpdateIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as LocalShippingIcon,
  Description as DescriptionIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

// Order service for admin
const orderService = {
  getAllOrders: async (page = 1, limit = 10, status = '', paymentStatus = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    if (paymentStatus) params.append('paymentStatus', paymentStatus);
    
    const response = await fetch(`http://localhost:5000/api/orders/admin?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  getOrder: async (id) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}/payment-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentStatus })
    });
    return await response.json();
  },

  deleteOrder: async (id) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  updateOrder: async (id, orderData) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },

  getOrderStats: async () => {
    const response = await fetch('http://localhost:5000/api/orders/admin/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  }
};

// Payment service for admin
const paymentService = {
  getPaymentDetails: async (orderId) => {
    const response = await fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  getAllPayments: async (page = 1, limit = 10, status = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    
    const response = await fetch(`http://localhost:5000/api/payments/admin?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  getPaymentStats: async () => {
    const response = await fetch('http://localhost:5000/api/payments/admin/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  }
};

// Gallery service
const galleryService = {
  getGalleryItems: async (page = 1, limit = 50) => {
    const response = await fetch(`http://localhost:5000/api/gallery?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:5000/api/gallery/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    });
    return await response.json();
  },

  createGalleryItem: async (data) => {
    const response = await fetch('http://localhost:5000/api/gallery', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  updateGalleryItem: async (id, data) => {
    const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteGalleryItem: async (id) => {
    const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  }
};

// Contact service
const contactService = {
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

  getMessage: async (id) => {
    const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

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

// Enhanced StatCard Component
const StatCard = ({ icon, title, value, color, subtitle, trend, onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
          border: `1px solid ${alpha(color, 0.1)}`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 30px ${alpha(color, 0.15)}`,
            borderColor: alpha(color, 0.2)
          },
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={onClick}
      >
        {/* Background accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, transparent 70%)`,
            borderRadius: '0 0 0 80px'
          }}
        />
        
        <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography 
                color="textSecondary" 
                gutterBottom 
                variant="h6" 
                sx={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem', 
                  fontWeight: 600,
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="div" 
                fontWeight="bold" 
                sx={{ 
                  color: color,
                  mb: 0.5
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ 
                    mt: 0.5, 
                    opacity: 0.7,
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <ArrowUpIcon 
                    sx={{ 
                      fontSize: 16, 
                      color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      mr: 0.5 
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: trend > 0 ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 600
                    }}
                  >
                    {trend > 0 ? '+' : ''}{trend}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: alpha(color, 0.1), 
                color: color, 
                width: isMobile ? 44 : 56, 
                height: isMobile ? 44 : 56,
                boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
                ml: 1
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

// Mobile Navigation Drawer
const MobileNavDrawer = ({ open, onClose, activeTab, onTabChange }) => {
  const theme = useTheme();
  
  const navItems = [
    { icon: <OrderIcon />, label: 'Orders', value: 0 },
    { icon: <CreditCardIcon />, label: 'Payments', value: 1 },
    { icon: <PhotoIcon />, label: 'Gallery', value: 2 },
    { icon: <EmailIcon />, label: 'Messages', value: 3 },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Admin Menu
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navItems.map((item) => (
            <ListItem 
              key={item.value}
              button 
              selected={activeTab === item.value}
              onClick={() => {
                onTabChange(null, item.value);
                onClose();
              }}
              sx={{
                mb: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}15 100%)`,
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                },
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}5 100%)`,
                }
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.value ? theme.palette.primary.main : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: activeTab === item.value ? 600 : 400
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

// Fixed ResponsiveTable Component
const ResponsiveTable = ({ headers, children, loading, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box>
        {children}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} sx={{ fontWeight: 600, fontSize: isSmallMobile ? '0.8rem' : '0.9rem' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {children}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Mobile Order Card for responsive view
const MobileOrderCard = ({ order, onView, onUpdateStatus, onDelete }) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ mb: 2, p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            Order: {order._id.slice(-8).toUpperCase()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {order.customerName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {order.customerEmail}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
          <Chip 
            label={order.status} 
            size="small" 
            color={getStatusColor(order.status)}
            sx={{ fontSize: '0.7rem' }}
          />
          <Chip 
            label={order.paymentStatus} 
            size="small" 
            color={getPaymentStatusColor(order.paymentStatus)}
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" fontWeight="bold">
          {formatCurrency(order.totalPrice)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatDate(order.createdAt)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => onView(order)}
          sx={{ flex: 1 }}
        >
          <ViewIcon />
        </IconButton>
        <IconButton 
          size="small" 
          color="warning"
          onClick={() => onUpdateStatus(order._id, 
            order.status === 'pending' ? 'in-progress' : 
            order.status === 'in-progress' ? 'completed' : 'pending'
          )}
          sx={{ flex: 1 }}
        >
          <UpdateIcon />
        </IconButton>
        <IconButton 
          size="small" 
          color="error"
          onClick={() => onDelete(order._id)}
          sx={{ flex: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

// Mobile Payment Card for responsive view
const MobilePaymentCard = ({ payment, onView, onMarkAsPaid }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {payment.tx_ref}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {payment.orderId?.customerName || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Order: {payment.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}
          </Typography>
        </Box>
        <Chip 
          label={payment.status} 
          size="small" 
          color={getPaymentStatusColor(payment.status)}
          sx={{ fontSize: '0.7rem' }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" fontWeight="bold">
          {formatCurrency(payment.amount)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {formatDate(payment.createdAt)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => onView(payment)}
          sx={{ flex: 1 }}
        >
          <ViewIcon />
        </IconButton>
        {payment.status === 'pending' && payment.orderId?._id && (
          <IconButton 
            size="small" 
            color="success"
            onClick={() => onMarkAsPaid(payment.orderId._id)}
            sx={{ flex: 1 }}
          >
            <CheckCircleIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
    case 'active':
    case 'read':
    case 'replied':
    case 'paid':
      return 'success';
    case 'in-progress':
      return 'warning';
    case 'pending':
    case 'unread':
      return 'error';
    case 'shipped':
      return 'info';
    case 'inactive':
    case 'failed':
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'info';
    default:
      return 'default';
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const AdminDashboardContent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    totalPhotos: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    paidOrders: 0,
    pendingPayments: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentRowsPerPage, setPaymentRowsPerPage] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    specifications: {
      camera: '',
      lens: '',
      aperture: '',
      shutterSpeed: '',
      iso: '',
      location: '',
      dateTaken: ''
    },
    pricing: {
      digital: '',
      smallPrint: '',
      mediumPrint: '',
      largePrint: '',
      customPrint: ''
    },
    tags: '',
    featured: false,
    status: 'active'
  });

  const [orderForm, setOrderForm] = useState({
    status: '',
    paymentStatus: '',
    totalPrice: 0,
    specialInstructions: ''
  });

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      loadOrders();
    } else if (activeTab === 1) {
      loadPayments();
    } else if (activeTab === 2) {
      loadGalleryItems();
    } else if (activeTab === 3) {
      loadContactMessages();
    }
  }, [activeTab, page, rowsPerPage, paymentPage, paymentRowsPerPage, filterStatus, filterPaymentStatus]);

  const loadInitialData = async () => {
    await loadStats();
    await loadOrders();
    await loadPayments();
    await loadGalleryItems();
    await loadContactMessages();
  };

  const loadStats = async () => {
    try {
      const [orderStats, paymentStats] = await Promise.all([
        orderService.getOrderStats(),
        paymentService.getPaymentStats()
      ]);

      if (orderStats.success) {
        setStats(prev => ({
          ...prev,
          totalOrders: orderStats.data.totalOrders || 0,
          pendingOrders: orderStats.data.pendingOrders || 0,
          completedOrders: orderStats.data.completedOrders || 0,
          totalRevenue: orderStats.data.totalRevenue || 0
        }));
      }

      if (paymentStats.success) {
        setStats(prev => ({
          ...prev,
          paidOrders: paymentStats.data.paidOrders || 0,
          pendingPayments: paymentStats.data.pendingPayments || 0
        }));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders(
        page + 1, 
        rowsPerPage, 
        filterStatus, 
        filterPaymentStatus
      );
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setTotalOrders(response.data.totalCount || 0);
      } else {
        showSnackbar('Failed to load orders', 'error');
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments(paymentPage + 1, paymentRowsPerPage);
      
      if (response.success) {
        setPayments(response.data.payments || []);
        setTotalPayments(response.data.totalCount || 0);
      } else {
        showSnackbar('Failed to load payments', 'error');
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      showSnackbar('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getGalleryItems();
      
      if (response.success) {
        setGalleryItems(response.data || []);
        setStats(prev => ({
          ...prev,
          totalPhotos: response.data?.length || 0
        }));
      } else {
        showSnackbar('Failed to load gallery items', 'error');
      }
    } catch (error) {
      console.error('Failed to load gallery items:', error);
      showSnackbar('Failed to load gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadContactMessages = async () => {
    try {
      setLoading(true);
      const response = await contactService.getMessages();
      
      if (response.success) {
        setContactMessages(response.data || []);
        const unreadCount = (response.data || []).filter(msg => msg.status === 'unread').length;
        setStats(prev => ({
          ...prev,
          unreadMessages: unreadCount
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
    setPage(0);
    setPaymentPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePaymentChangePage = (event, newPage) => {
    setPaymentPage(newPage);
  };

  const handlePaymentChangeRowsPerPage = (event) => {
    setPaymentRowsPerPage(parseInt(event.target.value, 10));
    setPaymentPage(0);
  };

  // Order Management Functions
  const handleViewOrder = async (order) => {
    try {
      const response = await orderService.getOrder(order._id);
      if (response.success) {
        setSelectedOrder(response.data);
        setOrderForm({
          status: response.data.status,
          paymentStatus: response.data.paymentStatus,
          totalPrice: response.data.totalPrice,
          specialInstructions: response.data.orderDetails?.specialInstructions || ''
        });
        setOrderDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to view order:', error);
      showSnackbar('Failed to load order details', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        showSnackbar('Order status updated successfully!');
        await loadOrders();
        await loadStats();
        if (orderDialogOpen) {
          setOrderDialogOpen(false);
        }
      } else {
        showSnackbar('Failed to update order status', 'error');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      showSnackbar('Failed to update order status', 'error');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    if (!orderId) {
      showSnackbar('Invalid order ID', 'error');
      return;
    }

    try {
      const response = await orderService.updatePaymentStatus(orderId, newPaymentStatus);
      if (response.success) {
        showSnackbar('Payment status updated successfully!');
        await loadOrders();
        await loadPayments();
        await loadStats();
        if (orderDialogOpen) {
          setOrderDialogOpen(false);
        }
      } else {
        showSnackbar('Failed to update payment status', 'error');
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      showSnackbar('Failed to update payment status', 'error');
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await orderService.updateOrder(selectedOrder._id, orderForm);
      if (response.success) {
        showSnackbar('Order updated successfully!');
        setOrderDialogOpen(false);
        await loadOrders();
        await loadStats();
      } else {
        showSnackbar('Failed to update order', 'error');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      showSnackbar('Failed to update order', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await orderService.deleteOrder(orderId);
        if (response.success) {
          showSnackbar('Order deleted successfully!');
          await loadOrders();
          await loadStats();
          if (orderDialogOpen) {
            setOrderDialogOpen(false);
          }
        } else {
          showSnackbar('Failed to delete order', 'error');
        }
      } catch (error) {
        console.error('Failed to delete order:', error);
        showSnackbar('Failed to delete order', 'error');
      }
    }
  };

  // Gallery Management Functions
  const handleOpenGalleryDialog = (item = null) => {
    if (item) {
      setSelectedGalleryItem(item);
      setGalleryForm({
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        specifications: {
          camera: item.specifications?.camera || '',
          lens: item.specifications?.lens || '',
          aperture: item.specifications?.aperture || '',
          shutterSpeed: item.specifications?.shutterSpeed || '',
          iso: item.specifications?.iso || '',
          location: item.specifications?.location || '',
          dateTaken: item.specifications?.dateTaken || ''
        },
        pricing: {
          digital: item.pricing?.digital?.toString() || '',
          smallPrint: item.pricing?.smallPrint?.toString() || '',
          mediumPrint: item.pricing?.mediumPrint?.toString() || '',
          largePrint: item.pricing?.largePrint?.toString() || '',
          customPrint: item.pricing?.customPrint?.toString() || ''
        },
        tags: item.tags?.join(', ') || '',
        featured: item.featured || false,
        status: item.status || 'active'
      });
      setSelectedFile(null);
    } else {
      setSelectedGalleryItem(null);
      setGalleryForm({
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        specifications: {
          camera: '',
          lens: '',
          aperture: '',
          shutterSpeed: '',
          iso: '',
          location: '',
          dateTaken: ''
        },
        pricing: {
          digital: '',
          smallPrint: '',
          mediumPrint: '',
          largePrint: '',
          customPrint: ''
        },
        tags: '',
        featured: false,
        status: 'active'
      });
      setSelectedFile(null);
    }
    setGalleryDialogOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar('Please select a valid image file (JPG, PNG, GIF, WebP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('File size must be less than 10MB', 'error');
      return;
    }

    setSelectedFile(file);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      
      const response = await galleryService.uploadImage(file);

      if (response.success) {
        setGalleryForm({ ...galleryForm, imageUrl: response.imageUrl });
        setSelectedFile(null);
        showSnackbar('Image uploaded successfully!');
      } else {
        showSnackbar(response.message || 'Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showSnackbar('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGallerySubmit = async () => {
    if (!galleryForm.imageUrl) {
      showSnackbar('Please upload an image first', 'error');
      return;
    }

    try {
      const submitData = {
        ...galleryForm,
        pricing: {
          digital: parseFloat(galleryForm.pricing.digital) || 0,
          smallPrint: parseFloat(galleryForm.pricing.smallPrint) || 0,
          mediumPrint: parseFloat(galleryForm.pricing.mediumPrint) || 0,
          largePrint: parseFloat(galleryForm.pricing.largePrint) || 0,
          customPrint: parseFloat(galleryForm.pricing.customPrint) || 0
        },
        tags: galleryForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let response;
      if (selectedGalleryItem) {
        response = await galleryService.updateGalleryItem(selectedGalleryItem._id, submitData);
      } else {
        response = await galleryService.createGalleryItem(submitData);
      }
      
      if (response.success) {
        showSnackbar(selectedGalleryItem ? 'Gallery item updated!' : 'Gallery item created!');
        setGalleryDialogOpen(false);
        loadGalleryItems();
      } else {
        showSnackbar(response.message, 'error');
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      showSnackbar('Failed to save gallery item', 'error');
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await galleryService.deleteGalleryItem(id);
        
        if (response.success) {
          showSnackbar('Gallery item deleted!');
          loadGalleryItems();
        } else {
          showSnackbar('Failed to delete gallery item', 'error');
        }
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
        showSnackbar('Failed to delete gallery item', 'error');
      }
    }
  };

  // Contact message functions
  const handleViewMessage = async (message) => {
    try {
      const response = await contactService.getMessage(message._id);
      if (response.success) {
        if (message.status === 'unread') {
          await contactService.updateStatus(message._id, 'read');
          await loadContactMessages();
        }
        setSelectedMessage(response.data);
        setMessageDialogOpen(true);
      }
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
        await loadContactMessages();
      } else {
        showSnackbar(response.message || 'Failed to send reply', 'error');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      showSnackbar('Failed to send reply', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await contactService.deleteMessage(id);
        if (response.success) {
          showSnackbar('Message deleted successfully!');
          await loadContactMessages();
          setMessageDialogOpen(false);
        } else {
          showSnackbar('Failed to delete message', 'error');
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
        showSnackbar('Failed to delete message', 'error');
      }
    }
  };

  // Enhanced Mobile App Bar
  const MobileAppBar = () => (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 0
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          color="inherit"
          onClick={() => setMobileDrawerOpen(true)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={loadInitialData}>
            <RefreshIcon />
          </IconButton>
          <Badge badgeContent={stats.unreadMessages} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );

  // Order Management Tab Component
  const OrderManagementTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 4,
        p: isMobile ? 2 : 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Order Management
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            width: isMobile ? '100%' : 'auto'
          }}>
            <TextField
              select
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ 
                minWidth: isMobile ? '48%' : 120,
                flex: isMobile ? 1 : 'auto'
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Payment"
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              sx={{ 
                minWidth: isMobile ? '48%' : 120,
                flex: isMobile ? 1 : 'auto'
              }}
            >
              <MenuItem value="">All Payments</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
          </Box>
          <Button 
            startIcon={<RefreshIcon />}
            onClick={loadOrders}
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ 
          p: isMobile ? 4 : 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <OrderIcon sx={{ fontSize: isMobile ? 48 : 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant={isMobile ? "h6" : "h5"} color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Customer orders will appear here once they start placing orders.
          </Typography>
        </Paper>
      ) : isMobile ? (
        // Mobile view with cards
        <Box>
          {orders.map((order) => (
            <MobileOrderCard
              key={order._id}
              order={order}
              onView={handleViewOrder}
              onUpdateStatus={handleUpdateOrderStatus}
              onDelete={handleDeleteOrder}
            />
          ))}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1
              }
            }}
          />
        </Box>
      ) : (
        // Desktop view with table
        <Box>
          <ResponsiveTable 
            headers={['Order ID', 'Customer', 'Service', 'Amount', 'Status', 'Payment', 'Date', 'Actions']}
            data={orders}
            loading={loading}
          >
            {orders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {order._id.slice(-8).toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="600" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                      {order.customerName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" fontSize={isSmallMobile ? '0.7rem' : '0.8rem'}>
                      {order.customerEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.serviceName} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {formatCurrency(order.totalPrice)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small" 
                    color={getStatusColor(order.status)}
                    sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentStatus} 
                    size="small" 
                    color={getPaymentStatusColor(order.paymentStatus)}
                    sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {formatDate(order.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewOrder(order)}
                      >
                        <ViewIcon fontSize={isSmallMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update Status">
                      <IconButton 
                        size="small" 
                        color="warning"
                        onClick={() => handleUpdateOrderStatus(order._id, 
                          order.status === 'pending' ? 'in-progress' : 
                          order.status === 'in-progress' ? 'completed' : 'pending'
                        )}
                      >
                        <UpdateIcon fontSize={isSmallMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        <DeleteIcon fontSize={isSmallMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </ResponsiveTable>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1
              }
            }}
          />
        </Box>
      )}
    </Box>
  );

  // Payment Management Tab Component
  const PaymentManagementTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 4,
        p: isMobile ? 2 : 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.03)} 0%, ${alpha(theme.palette.info.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Payment Management
        </Typography>
        <Button 
          startIcon={<RefreshIcon />}
          onClick={loadPayments}
          disabled={loading}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      ) : payments.length === 0 ? (
        <Paper sx={{ 
          p: isMobile ? 4 : 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <CreditCardIcon sx={{ fontSize: isMobile ? 48 : 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant={isMobile ? "h6" : "h5"} color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Payments Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Payment records will appear here once customers start making payments.
          </Typography>
        </Paper>
      ) : isMobile ? (
        // Mobile view with cards
        <Box>
          {payments.map((payment) => (
            <MobilePaymentCard
              key={payment._id}
              payment={payment}
              onView={(payment) => {
                setSelectedPayment(payment);
                setPaymentDialogOpen(true);
              }}
              onMarkAsPaid={(orderId) => handleUpdatePaymentStatus(orderId, 'paid')}
            />
          ))}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPayments}
            rowsPerPage={paymentRowsPerPage}
            page={paymentPage}
            onPageChange={handlePaymentChangePage}
            onRowsPerPageChange={handlePaymentChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1
              }
            }}
          />
        </Box>
      ) : (
        // Desktop view with table
        <Box>
          <ResponsiveTable 
            headers={['Transaction ID', 'Order ID', 'Customer', 'Amount', 'Status', 'Method', 'Date', 'Actions']}
            data={payments}
            loading={loading}
          >
            {payments.map((payment) => (
              <TableRow key={payment._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {payment.tx_ref}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {payment.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {payment.orderId?.customerName || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {formatCurrency(payment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={payment.status} 
                    size="small" 
                    color={getPaymentStatusColor(payment.status)}
                    sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={payment.paymentMethod} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontSize={isSmallMobile ? '0.8rem' : '0.9rem'}>
                    {formatDate(payment.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setPaymentDialogOpen(true);
                        }}
                      >
                        <ViewIcon fontSize={isSmallMobile ? "small" : "medium"} />
                      </IconButton>
                    </Tooltip>
                    {payment.status === 'pending' && payment.orderId?._id && (
                      <Tooltip title="Mark as Paid">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleUpdatePaymentStatus(payment.orderId._id, 'paid')}
                        >
                          <CheckCircleIcon fontSize={isSmallMobile ? "small" : "medium"} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </ResponsiveTable>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPayments}
            rowsPerPage={paymentRowsPerPage}
            page={paymentPage}
            onPageChange={handlePaymentChangePage}
            onRowsPerPageChange={handlePaymentChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1
              }
            }}
          />
        </Box>
      )}
    </Box>
  );

  // Gallery Management Tab Component
  const GalleryManagementTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 4,
        p: isMobile ? 2 : 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Gallery Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenGalleryDialog()}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Add New Image
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      ) : galleryItems.length === 0 ? (
        <Paper sx={{ 
          p: isMobile ? 4 : 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <PhotoIcon sx={{ fontSize: isMobile ? 48 : 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant={isMobile ? "h6" : "h5"} color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Gallery Items Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Start building your photography portfolio by adding stunning images to the gallery.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenGalleryDialog()}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              px: 4,
              py: 1.5
            }}
          >
            Add First Image
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {galleryItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Fade in={true}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        lineHeight: 1.3,
                        fontSize: isSmallMobile ? '0.9rem' : '1rem'
                      }}>
                        {item.title}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                      <Chip 
                        label={item.status} 
                        size="small" 
                        color={getStatusColor(item.status)}
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                      {item.featured && (
                        <Chip 
                          label="Featured" 
                          size="small" 
                          color="secondary"
                          sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: isSmallMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 1,
                      p: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" fontWeight="bold" color="primary.main" fontSize={isSmallMobile ? '0.8rem' : '0.875rem'}>
                        ${item.pricing?.digital || 0}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" fontSize={isSmallMobile ? '0.7rem' : '0.75rem'}>
                        Downloads: {item.downloadCount || 0}
                      </Typography>
                    </Box>

                    <CardActions sx={{ p: 0, gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleOpenGalleryDialog(item)}
                          sx={{ 
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={item.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <IconButton 
                          size="small" 
                          color={item.status === 'active' ? 'warning' : 'success'}
                          onClick={async () => {
                            const newStatus = item.status === 'active' ? 'inactive' : 'active';
                            try {
                              await galleryService.updateGalleryItem(item._id, { status: newStatus });
                              loadGalleryItems();
                            } catch (error) {
                              console.error('Failed to update status:', error);
                            }
                          }}
                          sx={{ 
                            backgroundColor: item.status === 'active' 
                              ? alpha(theme.palette.warning.main, 0.1)
                              : alpha(theme.palette.success.main, 0.1),
                            '&:hover': { 
                              backgroundColor: item.status === 'active'
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.success.main, 0.2)
                            }
                          }}
                        >
                          {item.status === 'active' ? <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={item.featured ? 'Remove Featured' : 'Make Featured'}>
                        <IconButton 
                          size="small" 
                          color={item.featured ? 'warning' : 'default'}
                          onClick={async () => {
                            try {
                              await galleryService.updateGalleryItem(item._id, { featured: !item.featured });
                              loadGalleryItems();
                            } catch (error) {
                              console.error('Failed to update featured status:', error);
                            }
                          }}
                          sx={{ 
                            backgroundColor: item.featured 
                              ? alpha(theme.palette.warning.main, 0.1)
                              : alpha(theme.palette.grey[500], 0.1),
                            '&:hover': { 
                              backgroundColor: item.featured
                                ? alpha(theme.palette.warning.main, 0.2)
                                : alpha(theme.palette.grey[500], 0.2)
                            }
                          }}
                        >
                          <StarIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          sx={{ 
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.2) }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Contact Management Tab
  const ContactManagementTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 4,
        p: isMobile ? 2 : 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
        gap: isMobile ? 2 : 0
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Contact Messages
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadContactMessages}
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Refresh
          </Button>
          <Badge badgeContent={stats.unreadMessages} color="error" showZero={false}>
            <EmailIcon sx={{ color: theme.palette.info.main }} />
          </Badge>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      ) : contactMessages.length === 0 ? (
        <Paper sx={{ 
          p: isMobile ? 4 : 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <EmailIcon sx={{ fontSize: isMobile ? 48 : 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant={isMobile ? "h6" : "h5"} color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Messages Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Contact messages from users will appear here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contactMessages.map((message) => (
            <Grid item xs={12} key={message._id}>
              <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  borderLeft: message.status === 'unread' 
                    ? `4px solid ${theme.palette.error.main}`
                    : '4px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between', 
                      alignItems: isMobile ? 'stretch' : 'flex-start', 
                      mb: 2,
                      gap: isMobile ? 1 : 0
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600,
                          fontSize: isMobile ? '1rem' : '1.25rem'
                        }}>
                          {message.subject || 'General Inquiry'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                          From: {message.name} • {message.email} • {message.phone || 'No phone provided'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          color: 'text.primary',
                          fontSize: isMobile ? '0.8rem' : '0.875rem'
                        }}>
                          {message.message}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        ml: isMobile ? 0 : 2, 
                        flexShrink: 0,
                        flexDirection: isMobile ? 'row' : 'column',
                        justifyContent: isMobile ? 'space-between' : 'flex-start',
                        width: isMobile ? '100%' : 'auto',
                        mt: isMobile ? 1 : 0
                      }}>
                        {message.replied && (
                          <Chip 
                            label="Replied" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        <Chip 
                          label={message.status} 
                          size="small" 
                          color={getStatusColor(message.status)}
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" color="textSecondary" sx={{ 
                          minWidth: isMobile ? 'auto' : 120, 
                          textAlign: isMobile ? 'left' : 'right',
                          fontSize: isMobile ? '0.7rem' : '0.75rem'
                        }}>
                          {formatDate(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewMessage(message)}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ReplyIcon />}
                        variant="contained"
                        onClick={() => handleReply(message)}
                        sx={{ 
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        }}
                      >
                        Reply
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Mobile App Bar */}
      {isMobile && <MobileAppBar />}

      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Enhanced Header - Hidden on mobile since we have app bar */}
        {!isMobile && (
          <Box mb={6}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: isMobile ? '2rem' : '3rem'
            }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ 
              fontSize: isMobile ? '1rem' : '1.1rem',
              opacity: 0.8
            }}>
              Welcome back, {user?.name}! Manage your photography business efficiently.
            </Typography>
          </Box>
        )}

        {/* Enhanced Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<PeopleIcon />}
              title="Total Users"
              value={stats.totalUsers}
              color={theme.palette.primary.main}
              trend={12}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<OrderIcon />}
              title="Total Orders"
              value={stats.totalOrders}
              color={theme.palette.success.main}
              subtitle={`${stats.pendingOrders} pending`}
              trend={8}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<MoneyIcon />}
              title="Revenue"
              value={`$${stats.totalRevenue}`}
              color={theme.palette.warning.main}
              subtitle={`${stats.paidOrders} paid`}
              trend={15}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<CreditCardIcon />}
              title="Payments"
              value={stats.paidOrders}
              color={theme.palette.info.main}
              subtitle={`${stats.pendingPayments} pending`}
              trend={10}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<PhotoIcon />}
              title="Gallery Items"
              value={stats.totalPhotos}
              color={theme.palette.secondary.main}
              trend={5}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <StatCard
              icon={<EmailIcon />}
              title="Messages"
              value={contactMessages.length}
              color={theme.palette.error.main}
              subtitle={`${stats.unreadMessages} unread`}
              trend={-2}
            />
          </Grid>
        </Grid>

        {/* Enhanced Tabs - Hidden on mobile, replaced by drawer */}
        {!isMobile && (
          <Paper sx={{ 
            width: '100%', 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  minHeight: 'auto',
                  textTransform: 'none'
                }
              }}
            >
              <Tab 
                icon={<OrderIcon />} 
                iconPosition="start"
                label={
                  <Badge badgeContent={stats.pendingOrders} color="error" showZero={false}>
                    Orders
                  </Badge>
                } 
              />
              <Tab 
                icon={<CreditCardIcon />} 
                iconPosition="start"
                label={
                  <Badge badgeContent={stats.pendingPayments} color="error" showZero={false}>
                    Payments
                  </Badge>
                } 
              />
              <Tab 
                icon={<PhotoIcon />} 
                iconPosition="start"
                label="Gallery" 
              />
              <Tab 
                icon={<EmailIcon />} 
                iconPosition="start"
                label={
                  <Badge badgeContent={stats.unreadMessages} color="error" showZero={false}>
                    Messages
                  </Badge>
                } 
              />
            </Tabs>
          </Paper>
        )}

        {/* Mobile Tab Indicator */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            background: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {['Orders', 'Payments', 'Gallery', 'Messages'][activeTab]}
            </Typography>
            <IconButton 
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'white'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <OrderManagementTab />}
          {activeTab === 1 && <PaymentManagementTab />}
          {activeTab === 2 && <GalleryManagementTab />}
          {activeTab === 3 && <ContactManagementTab />}
        </Box>

        {/* Scroll to Top FAB */}
        <Zoom in={showScrollTop}>
          <Fab
            color="primary"
            aria-label="scroll to top"
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowUpIcon />
          </Fab>
        </Zoom>

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer 
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Order Detail Dialog */}
        <Dialog 
          open={orderDialogOpen} 
          onClose={() => setOrderDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            Order Details
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box>
                <Typography>Order ID: {selectedOrder._id}</Typography>
                <Typography>Customer: {selectedOrder.customerName}</Typography>
                <Typography>Status: {selectedOrder.status}</Typography>
                {/* Add more order details as needed */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOrderDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Payment Detail Dialog */}
        <Dialog 
          open={paymentDialogOpen} 
          onClose={() => setPaymentDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            Payment Details
          </DialogTitle>
          <DialogContent>
            {selectedPayment && (
              <Box>
                <Typography>Transaction ID: {selectedPayment.tx_ref}</Typography>
                <Typography>Amount: {formatCurrency(selectedPayment.amount)}</Typography>
                <Typography>Status: {selectedPayment.status}</Typography>
                {/* Add more payment details as needed */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Gallery Dialog */}
        <Dialog 
          open={galleryDialogOpen} 
          onClose={() => setGalleryDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            {selectedGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={galleryForm.description}
                onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ marginBottom: '16px' }}
              />
              {uploading && <LinearProgress />}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGalleryDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleGallerySubmit}
              variant="contained"
              disabled={!galleryForm.imageUrl || !galleryForm.title}
            >
              {selectedGalleryItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Message Dialog */}
        <Dialog 
          open={messageDialogOpen} 
          onClose={() => setMessageDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            Message Details
          </DialogTitle>
          <DialogContent>
            {selectedMessage && (
              <Box>
                <Typography variant="h6">{selectedMessage.subject}</Typography>
                <Typography>From: {selectedMessage.name} ({selectedMessage.email})</Typography>
                <Typography sx={{ mt: 2 }}>{selectedMessage.message}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialogOpen(false)}>Close</Button>
            <Button onClick={() => handleReply(selectedMessage)} variant="contained">
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
            Reply to Message
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              label="Your reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSendReply} 
              variant="contained"
              disabled={!replyText.trim()}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: isMobile ? 'top' : 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
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