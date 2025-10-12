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
  Divider
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
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

// Order service for admin
const orderService = {
  // Get all orders
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

  // Get order by ID
  getOrder: async (id) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  // Update order status
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

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
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

  // Delete order
  deleteOrder: async (id) => {
    const response = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  // Update order
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

  // Get order stats
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
  // Get payment details
  getPaymentDetails: async (orderId) => {
    const response = await fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return await response.json();
  },

  // Get all payments
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

  // Get payment stats
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

  const handleViewPayment = async (order) => {
    try {
      const response = await paymentService.getPaymentDetails(order._id);
      if (response.success) {
        setSelectedPayment(response.data);
        setPaymentDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to view payment:', error);
      showSnackbar('Failed to load payment details', 'error');
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

  // Enhanced StatCard
  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
      border: `1px solid ${alpha(color, 0.1)}`,
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 30px ${alpha(color, 0.15)}`
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6" sx={{ 
              fontSize: '0.9rem', 
              fontWeight: 600,
              opacity: 0.8
            }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, opacity: 0.7 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ 
            bgcolor: alpha(color, 0.1), 
            color: color, 
            width: 56, 
            height: 56,
            boxShadow: `0 4px 12px ${alpha(color, 0.2)}`
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  // Order Management Tab Component
  const OrderManagementTab = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Order Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              select
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 120 }}
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
              sx={{ minWidth: 120 }}
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
            sx={{ borderRadius: 2 }}
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
          p: 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <OrderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Customer orders will appear here once they start placing orders.
          </Typography>
        </Paper>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {order._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {order.customerName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
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
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {formatCurrency(order.totalPrice)}
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
                      <Chip 
                        label={order.paymentStatus} 
                        size="small" 
                        color={getPaymentStatusColor(order.paymentStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewOrder(order)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Payment Details">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleViewPayment(order)}
                          >
                            <PaymentIcon />
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
                            <UpdateIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.03)} 0%, ${alpha(theme.palette.info.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
      }}>
        <Typography variant="h4" sx={{ 
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
          sx={{ borderRadius: 2 }}
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
          p: 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <CreditCardIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Payments Yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Payment records will appear here once customers start making payments.
          </Typography>
        </Paper>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {payment.tx_ref}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.orderId?.customerName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status} 
                        size="small" 
                        color={getPaymentStatusColor(payment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.paymentMethod} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setPaymentDialogOpen(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {payment.status === 'pending' && (
                          <Tooltip title="Mark as Paid">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleUpdatePaymentStatus(payment.orderId?._id, 'paid')}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPayments}
            rowsPerPage={paymentRowsPerPage}
            page={paymentPage}
            onPageChange={handlePaymentChangePage}
            onRowsPerPageChange={handlePaymentChangeRowsPerPage}
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
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Typography variant="h4" sx={{ 
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
            transition: 'all 0.3s ease'
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
          p: 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <PhotoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Gallery Items Yet
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
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
        <Grid container spacing={3}>
          {galleryItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={getStatusColor(item.status)}
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                    {item.featured && (
                      <Chip 
                        label="Featured" 
                        size="small" 
                        color="secondary"
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      ${item.pricing?.digital || 0}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
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
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Contact Messages
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadContactMessages}
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 2 }}
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
          p: 6, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <EmailIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
            No Messages Yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Contact messages from users will appear here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contactMessages.map((message) => (
            <Grid item xs={12} key={message._id}>
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {message.subject || 'General Inquiry'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        From: {message.name} • {message.email} • {message.phone || 'No phone provided'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'text.primary'
                      }}>
                        {message.message}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, flexShrink: 0 }}>
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
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header */}
      <Box mb={6}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ 
          fontSize: '1.1rem',
          opacity: 0.8
        }}>
          Welcome back, {user?.name}! Manage your photography business efficiently.
        </Typography>
      </Box>

      {/* Enhanced Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
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
            value={`$${stats.totalRevenue}`}
            color={theme.palette.warning.main}
            subtitle={`${stats.paidOrders} paid`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<CreditCardIcon />}
            title="Payments"
            value={stats.paidOrders}
            color={theme.palette.info.main}
            subtitle={`${stats.pendingPayments} pending`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            icon={<PhotoIcon />}
            title="Gallery Items"
            value={stats.totalPhotos}
            color={theme.palette.secondary.main}
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
      </Grid>

      {/* Enhanced Tabs */}
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
          variant="scrollable"
          scrollButtons="auto"
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
            label={
              <Badge badgeContent={stats.pendingOrders} color="error" showZero={false}>
                Orders
              </Badge>
            } 
          />
          <Tab 
            icon={<CreditCardIcon />} 
            label={
              <Badge badgeContent={stats.pendingPayments} color="error" showZero={false}>
                Payments
              </Badge>
            } 
          />
          <Tab 
            icon={<PhotoIcon />} 
            label="Gallery" 
          />
          <Tab 
            icon={<EmailIcon />} 
            label={
              <Badge badgeContent={stats.unreadMessages} color="error" showZero={false}>
                Messages
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 4 }}>
        {activeTab === 0 && <OrderManagementTab />}
        {activeTab === 1 && <PaymentManagementTab />}
        {activeTab === 2 && <GalleryManagementTab />}
        {activeTab === 3 && <ContactManagementTab />}
      </Box>

      {/* Order Detail Dialog */}
      <Dialog 
        open={orderDialogOpen} 
        onClose={() => setOrderDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: 3,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 2
            }
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <OrderIcon sx={{ fontSize: 28 }} />
            Order Details
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  mb: 3, 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                    Customer Information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedOrder.customerName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedOrder.customerEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {selectedOrder.orderDetails?.phone || 'Not provided'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {selectedOrder.orderDetails?.address || 'Not provided'}
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                    Order Information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Service:</strong> {selectedOrder.serviceName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Amount:</strong> {formatCurrency(selectedOrder.totalPrice)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip 
                      label={selectedOrder.status} 
                      color={getStatusColor(selectedOrder.status)}
                    />
                    <Chip 
                      label={selectedOrder.paymentStatus} 
                      color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                    Update Order
                  </Typography>
                  
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={orderForm.status}
                    onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label="Payment Status"
                    value={orderForm.paymentStatus}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentStatus: e.target.value })}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    type="number"
                    label="Total Price"
                    value={orderForm.totalPrice}
                    onChange={(e) => setOrderForm({ ...orderForm, totalPrice: parseFloat(e.target.value) })}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Special Instructions"
                    value={orderForm.specialInstructions}
                    onChange={(e) => setOrderForm({ ...orderForm, specialInstructions: e.target.value })}
                  />
                </Box>

                {selectedOrder.selectedOptions && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 3, 
                    backgroundColor: 'white', 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                      Service Options
                    </Typography>
                    <List dense>
                      {Object.entries(selectedOrder.selectedOptions).map(([key, value]) => (
                        <ListItem key={key}>
                          <ListItemText 
                            primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            secondary={String(value)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 2
        }}>
          <Button 
            onClick={() => setOrderDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                backgroundColor: 'rgba(0,0,0,0.02)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateOrder}
            size="large"
            startIcon={<UpdateIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Update Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Detail Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
            color: 'white',
            py: 3,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 2
            }
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CreditCardIcon sx={{ fontSize: 28 }} />
            Payment Details
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedPayment && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  mb: 3, 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.success.main, fontWeight: 600 }}>
                    Payment Information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Transaction ID:</strong> {selectedPayment.tx_ref}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Chapa Transaction ID:</strong> {selectedPayment.chapaTransactionId || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Currency:</strong> {selectedPayment.currency}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Status:</strong> 
                    <Chip 
                      label={selectedPayment.status} 
                      size="small" 
                      color={getPaymentStatusColor(selectedPayment.status)}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
                  </Typography>
                  {selectedPayment.testMode && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        This is a test payment (Sandbox Mode)
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.success.main, fontWeight: 600 }}>
                    Order Information
                  </Typography>
                  {selectedPayment.orderId ? (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Order ID:</strong> {selectedPayment.orderId._id}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Customer:</strong> {selectedPayment.orderId.customerName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Service:</strong> {selectedPayment.orderId.serviceName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Order Status:</strong> 
                        <Chip 
                          label={selectedPayment.orderId.status} 
                          size="small" 
                          color={getStatusColor(selectedPayment.orderId.status)}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      <Typography variant="body2">
                        <strong>Payment Status:</strong> 
                        <Chip 
                          label={selectedPayment.orderId.paymentStatus} 
                          size="small" 
                          color={getPaymentStatusColor(selectedPayment.orderId.paymentStatus)}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Order information not available
                    </Typography>
                  )}
                </Box>

                {(selectedPayment.paidAt || selectedPayment.createdAt) && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 3, 
                    backgroundColor: 'white', 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.success.main, fontWeight: 600 }}>
                      Payment Timeline
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Created:</strong> {formatDate(selectedPayment.createdAt)}
                    </Typography>
                    {selectedPayment.paidAt && (
                      <Typography variant="body2">
                        <strong>Paid At:</strong> {formatDate(selectedPayment.paidAt)}
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 2
        }}>
          <Button 
            onClick={() => setPaymentDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
            }}
          >
            Close
          </Button>
          {selectedPayment?.orderId && selectedPayment.status === 'pending' && (
            <Button 
              variant="contained" 
              onClick={() => handleUpdatePaymentStatus(selectedPayment.orderId._id, 'paid')}
              size="large"
              startIcon={<CheckCircleIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
              }}
            >
              Mark as Paid
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Enhanced Gallery Item Dialog */}
      <Dialog 
        open={galleryDialogOpen} 
        onClose={() => setGalleryDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: 3,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 2
            }
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <PhotoIcon sx={{ fontSize: 28 }} />
            {selectedGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  fontWeight: 600
                }}>
                  <CloudUploadIcon fontSize="small" />
                  Upload Image
                </Typography>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="image-upload-input"
                />
                <label htmlFor="image-upload-input">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      mb: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Choose Image File'}
                  </Button>
                </label>

                {uploading && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Uploading image...
                    </Typography>
                  </Box>
                )}

                {galleryForm.imageUrl && !uploading && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      ✓ Image uploaded successfully!
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <PhotoIcon color="success" fontSize="small" />
                      <Typography variant="caption" color="textSecondary">
                        {galleryForm.imageUrl.split('/').pop()}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {selectedFile && !uploading && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                    <Typography variant="body2" color="info.main" sx={{ fontWeight: 600 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                )}

                {!galleryForm.imageUrl && !selectedFile && !uploading && (
                  <Typography variant="body2" color="textSecondary">
                    Click to select an image file (JPG, PNG, GIF, WebP - Max 10MB)
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600
                }}>
                  <SettingsIcon fontSize="small" />
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Image Title *"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      variant="outlined"
                      placeholder="Enter a descriptive title for your image"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      variant="outlined"
                      placeholder="Describe your image, including key features and context"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Category Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: theme.palette.info.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600
                }}>
                  <CategoryIcon fontSize="small" />
                  Category
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Category *"
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      variant="outlined"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    >
                      <MenuItem value="Portrait">📷 Portrait</MenuItem>
                      <MenuItem value="Landscape">🏞️ Landscape</MenuItem>
                      <MenuItem value="Urban">🏙️ Urban</MenuItem>
                      <MenuItem value="Nature">🌿 Nature</MenuItem>
                      <MenuItem value="Architecture">🏛️ Architecture</MenuItem>
                      <MenuItem value="Event">🎉 Event</MenuItem>
                      <MenuItem value="Product">📦 Product</MenuItem>
                      <MenuItem value="Wedding">💒 Wedding</MenuItem>
                      <MenuItem value="Family">👨‍👩‍👧‍👦 Family</MenuItem>
                      <MenuItem value="Other">🔹 Other</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Pricing Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: theme.palette.warning.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600
                }}>
                  <MoneyIcon fontSize="small" />
                  Pricing (USD)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Digital Download"
                      value={galleryForm.pricing.digital}
                      onChange={(e) => setGalleryForm({
                        ...galleryForm,
                        pricing: { ...galleryForm.pricing, digital: e.target.value }
                      })}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Small Print (8x10)"
                      value={galleryForm.pricing.smallPrint}
                      onChange={(e) => setGalleryForm({
                        ...galleryForm,
                        pricing: { ...galleryForm.pricing, smallPrint: e.target.value }
                      })}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Large Print (16x20)"
                      value={galleryForm.pricing.largePrint}
                      onChange={(e) => setGalleryForm({
                        ...galleryForm,
                        pricing: { ...galleryForm.pricing, largePrint: e.target.value }
                      })}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Tags & Featured Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'white', 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: theme.palette.secondary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600
                }}>
                  <LocalOfferIcon fontSize="small" />
                  Tags & Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tags (comma separated)"
                      value={galleryForm.tags}
                      onChange={(e) => setGalleryForm({ ...galleryForm, tags: e.target.value })}
                      variant="outlined"
                      placeholder="nature, landscape, sunset, mountains"
                      helperText="Separate tags with commas"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100%',
                      p: 2,
                      backgroundColor: galleryForm.featured ? alpha(theme.palette.secondary.main, 0.08) : 'grey.50',
                      borderRadius: 2,
                      border: `2px dashed ${galleryForm.featured ? theme.palette.secondary.main : theme.palette.divider}`,
                      transition: 'all 0.3s ease'
                    }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={galleryForm.featured}
                            onChange={(e) => setGalleryForm({ ...galleryForm, featured: e.target.checked })}
                            color="secondary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              Featured Image
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Show this image prominently
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 2
        }}>
          <Button 
            onClick={() => setGalleryDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              borderColor: theme.palette.grey[400],
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.grey[600],
                backgroundColor: 'rgba(0,0,0,0.02)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleGallerySubmit}
            size="large"
            disabled={!galleryForm.imageUrl || !galleryForm.title || !galleryForm.category}
            startIcon={selectedGalleryItem ? <EditIcon /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                background: theme.palette.grey[400],
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {selectedGalleryItem ? 'Update Image' : 'Create Image'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Message Detail Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={() => setMessageDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            py: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <EmailIcon sx={{ fontSize: 28 }} />
            Message Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedMessage && (
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {selectedMessage.subject || 'General Inquiry'}
              </Typography>
              <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>From:</strong> {selectedMessage.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Email:</strong> {selectedMessage.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Phone:</strong> {selectedMessage.phone || 'Not provided'}
                </Typography>
              </Box>
              <Box sx={{ mb: 3, p: 3, backgroundColor: 'grey.50', borderRadius: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <Typography variant="body1">
                  {selectedMessage.message}
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Received: {formatDate(selectedMessage.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 2
        }}>
          <Button 
            onClick={() => setMessageDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
          <Button 
            onClick={() => handleReply(selectedMessage)}
            variant="contained"
            startIcon={<ReplyIcon />}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }}
          >
            Reply
          </Button>
          <Button 
            onClick={() => handleDeleteMessage(selectedMessage?._id)}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Reply Dialog */}
      <Dialog 
        open={replyDialogOpen} 
        onClose={() => setReplyDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4eaf1 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
            color: 'white',
            py: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <ReplyIcon sx={{ fontSize: 28 }} />
            Reply to Message
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ 
            p: 3, 
            backgroundColor: 'white', 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <TextField
              autoFocus
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              label="Your reply message"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response here..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          backgroundColor: 'white',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: 2
        }}>
          <Button 
            onClick={() => setReplyDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
            disabled={!replyText.trim()}
            sx={{
              borderRadius: 2,
              px: 4,
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
              },
              '&:disabled': {
                background: theme.palette.grey[400]
              }
            }}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            borderRadius: 2,
            alignItems: 'center',
            fontSize: '0.9rem'
          }}
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