import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  CreditCard,
  AccessTime,
  CheckCircle,
  ArrowBack,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Payment service (copied from Order.jsx)
const paymentService = {
  // Initialize payment
  initializePayment: async (orderId, testMode = 'test_success') => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId, testMode })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to initialize payment');
      }
      
      return result;
    } catch (error) {
      console.error('Initialize payment error:', error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (tx_ref, testScenario = 'success') => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tx_ref, testScenario })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed');
      }
      
      return result;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payment status');
      }
      
      return result;
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }
};

// Order service (copied from Order.jsx)
const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }
      
      return result;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch orders');
      }
      
      return result;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Get pending orders for payment
  getPendingOrders: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch pending orders');
      }
      
      return result;
    } catch (error) {
      console.error('Get pending orders error:', error);
      throw error;
    }
  },

  // Save order for later payment
  saveOrderForLater: async (orderId) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/pay-later', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save order for later');
      }
      
      return result;
    } catch (error) {
      console.error('Save order for later error:', error);
      throw error;
    }
  },

  // Resume payment for an order
  resumeOrderPayment: async (orderId) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/resume-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to resume payment');
      }
      
      return result;
    } catch (error) {
      console.error('Resume payment error:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update order status');
      }
      
      return result;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }
};

// Modern theme colors (copied from Order.jsx)
const modernTheme = {
  primary: '#2563eb',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  neutral: '#f8fafc',
  darkText: '#1e293b',
  lightText: '#64748b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
};

const PendingOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log('PendingOrders mounted - Auth status:', { isAuthenticated, user });
    if (isAuthenticated) {
      loadPendingOrders();
    } else {
      setLoading(false);
      showSnackbar('Please login to view pending orders', 'warning');
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [isAuthenticated, navigate]);

  const loadPendingOrders = async () => {
    try {
      setLoading(true);
      console.log('Loading pending orders...');
      
      const result = await orderService.getPendingOrders();
      console.log('Pending orders API response:', result);
      
      if (result.success) {
        setPendingOrders(result.data?.orders || []);
        console.log('Loaded orders:', result.data?.orders);
      } else {
        showSnackbar(result.message || 'Failed to load pending orders', 'error');
      }
    } catch (error) {
      console.error('Load pending orders error:', error);
      showSnackbar('Failed to load pending orders. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatExpiryTime = (expiryDate) => {
    if (!expiryDate) return 'No expiry';
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setPaymentDialogOpen(true);
  };

  const handlePayment = async (testMode = 'test_success') => {
    if (!selectedOrder) return;

    setProcessingPayment(true);

    try {
      // First resume the payment to ensure it's valid
      const resumeResult = await orderService.resumeOrderPayment(selectedOrder._id);
      
      if (!resumeResult.success) {
        showSnackbar('Cannot process payment for this order', 'error');
        return;
      }

      const paymentResult = await paymentService.initializePayment(selectedOrder._id, testMode);

      if (paymentResult.success) {
        // Simulate payment verification for sandbox
        setTimeout(async () => {
          try {
            const verifyResult = await paymentService.verifyPayment(paymentResult.data.tx_ref, 'success');
            
            if (verifyResult.success) {
              showSnackbar('Payment completed successfully!', 'success');
              setPaymentDialogOpen(false);
              loadPendingOrders(); // Refresh the list
            } else {
              showSnackbar('Payment verification failed', 'error');
            }
          } catch (verifyError) {
            showSnackbar('Payment verification failed', 'error');
          } finally {
            setProcessingPayment(false);
          }
        }, 2000);
      } else {
        showSnackbar(paymentResult.message || 'Payment initialization failed', 'error');
        setProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showSnackbar('Payment processing failed', 'error');
      setProcessingPayment(false);
    }
  };

  const isOrderExpired = (order) => {
    if (!order.paymentExpiry) return false;
    return new Date(order.paymentExpiry) < new Date();
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting to login...
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading pending orders...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Pending Payments
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Complete payment for your pending orders
        </Typography>
      </Box>

      {pendingOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Pending Payments
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have any orders waiting for payment.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/order')}
            size="large"
          >
            Place New Order
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {order.serviceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order ID: {order._id?.slice(-8).toUpperCase() || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                      ${order.totalPrice}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2" color={isOrderExpired(order) ? 'error' : 'warning.main'}>
                        {formatExpiryTime(order.paymentExpiry)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Chip 
                      label={order.status} 
                      color={order.status === 'pending' ? 'warning' : 'primary'}
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={order.paymentStatus} 
                      color={order.paymentStatus === 'pending' ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<CreditCard />}
                    onClick={() => handlePayNow(order)}
                    disabled={isOrderExpired(order)}
                    size="large"
                  >
                    {isOrderExpired(order) ? 'Expired' : 'Pay Now'}
                  </Button>
                </Box>

                {isOrderExpired(order) && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    This order has expired. Please contact support if you still wish to complete it.
                  </Alert>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => !processingPayment && setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: modernTheme.gradient,
          color: 'white',
          textAlign: 'center',
          fontWeight: 700
        }}>
          <CreditCard sx={{ mr: 1, fontSize: 28 }} />
          Complete Payment
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedOrder && (
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {selectedOrder.serviceName}
              </Typography>
              <Typography variant="h4" color={modernTheme.primary} sx={{ fontWeight: 700, my: 2 }}>
                ${selectedOrder.totalPrice}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Order ID: {selectedOrder._id?.slice(-8).toUpperCase() || 'N/A'}
              </Typography>
              
              {selectedOrder.paymentExpiry && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <strong>Pay within: {formatExpiryTime(selectedOrder.paymentExpiry)}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Sandbox Mode:</strong> This is a test payment environment. 
              No real money will be charged.
            </Typography>
          </Alert>

          <Box sx={{ 
            p: 3, 
            backgroundColor: 'white', 
            borderRadius: 3,
            border: `1px solid ${modernTheme.primary}20`,
            mb: 3
          }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Test Payment Methods:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handlePayment('test_success')}
                disabled={processingPayment}
                startIcon={processingPayment ? <CircularProgress size={16} /> : <CheckCircle />}
                sx={{
                  background: modernTheme.success,
                  '&:hover': { background: modernTheme.success },
                  borderRadius: 2
                }}
              >
                Success Test
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handlePayment('test_failure')}
                disabled={processingPayment}
                startIcon={<Close />}
                sx={{ borderRadius: 2 }}
              >
                Failure Test
              </Button>
            </Box>
          </Box>

          {processingPayment && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Processing payment...
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setPaymentDialogOpen(false)}
            disabled={processingPayment}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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

export default PendingOrders;