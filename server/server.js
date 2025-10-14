import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import galleryRoutes from './routes/gallery.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Debug routes for uploads
app.get('/api/debug/uploads', async (req, res) => {
  try {
    // Use dynamic import for fs
    const fs = await import('fs');
    const uploadsPath = path.join(__dirname, 'uploads', 'gallery');
    
    const uploadsExists = fs.existsSync(uploadsPath);
    let files = [];
    let fileDetails = [];

    if (uploadsExists) {
      files = fs.readdirSync(uploadsPath);
      
      fileDetails = files.map(file => {
        const filePath = path.join(uploadsPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          url: `http://localhost:${process.env.PORT || 5000}/uploads/gallery/${file}`,
          directTest: `http://localhost:${process.env.PORT || 5000}/api/debug/file/${file}`
        };
      });
    }

    res.json({
      success: true,
      serverInfo: {
        __dirname: __dirname,
        staticPath: path.join(__dirname, 'uploads'),
        uploadsPath: uploadsPath,
        uploadsExists: uploadsExists,
        galleryExists: fs.existsSync(path.join(__dirname, 'uploads', 'gallery'))
      },
      files: fileDetails,
      totalFiles: files.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test individual file access
app.get('/api/debug/file/:filename', async (req, res) => {
  try {
    const fs = await import('fs');
    const filePath = path.join(__dirname, 'uploads', 'gallery', req.params.filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found via static serving',
        filename: req.params.filename,
        searchedPath: filePath,
        directoryExists: fs.existsSync(path.join(__dirname, 'uploads', 'gallery'))
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Payment test route (for sandbox testing)
app.get('/api/payments/test-page', (req, res) => {
  res.json({
    success: true,
    message: 'Payment test endpoint is active',
    testScenarios: [
      {
        name: 'Successful Payment',
        endpoint: 'POST /api/payments/initialize',
        body: { orderId: 'your_order_id', testMode: 'test_success' }
      },
      {
        name: 'Failed Payment', 
        endpoint: 'POST /api/payments/initialize',
        body: { orderId: 'your_order_id', testMode: 'test_failure' }
      }
    ]
  });
});

// Admin payment stats route (for AdminDashboard)
app.get('/api/payments/admin/stats', async (req, res) => {
  try {
    // Import models
    const Order = (await import('./models/Order.js')).default;
    const Payment = (await import('./models/Payment.js')).default;

    // Get payment statistics
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const pendingPayments = await Order.countDocuments({ paymentStatus: 'pending' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Get recent payments count
    const recentPayments = await Payment.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.json({
      success: true,
      data: {
        paidOrders,
        pendingPayments,
        recentPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
});

// Admin payments list route (for AdminDashboard)
app.get('/api/payments/admin', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    // Import models
    const Payment = (await import('./models/Payment.js')).default;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('orderId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Admin payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
});

// Update order payment status route (for AdminDashboard)
app.put('/api/orders/admin/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // Import models
    const Order = (await import('./models/Order.js')).default;
    const Payment = (await import('./models/Payment.js')).default;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order payment status
    order.paymentStatus = paymentStatus;
    await order.save();

    // Also update the associated payment record if it exists
    if (order.paymentId) {
      await Payment.findByIdAndUpdate(order.paymentId, { 
        status: paymentStatus === 'paid' ? 'completed' : paymentStatus 
      });
    }

    res.json({
      success: true,
      message: 'Order payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order payment status'
    });
  }
});

// Add to your server.js after existing routes

// Pay Later test route
app.get('/api/orders/pending/test', async (req, res) => {
  try {
    const Order = (await import('./models/Order.js')).default;
    
    // Create a test pending order
    const testOrder = new Order({
      serviceType: 'printing',
      serviceName: 'Test Printing Service',
      selectedOptions: { printingType: 'tshirts', quantity: 1 },
      orderDetails: {
        customerName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: 'Test Address',
        specialInstructions: 'Test instructions'
      },
      inputMethod: 'upload',
      files: [],
      totalPrice: 25,
      status: 'pending',
      paymentStatus: 'pending',
      customerId: '65a1b2c3d4e5f6a7b8c9d0e1', // Use a real user ID from your DB
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      allowPayLater: true,
      paymentExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await testOrder.save();

    res.json({
      success: true,
      message: 'Test pending order created',
      order: testOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Josi Photo Printing API is running!',
    timestamp: new Date().toISOString(),
    services: {
      auth: '✅ Active',
      contact: '✅ Active',
      gallery: '✅ Active',
      orders: '✅ Active',
      payments: '✅ Active'
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Josi Photo Printing API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      contact: '/api/contact',
      gallery: '/api/gallery',
      orders: '/api/orders',
      payments: '/api/payments',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔴 SERVER ERROR DETAILS:');
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  console.error('Request Body:', req.body);
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads served from: http://localhost:${PORT}/uploads`);
  console.log(`🔧 Debug route: http://localhost:${PORT}/api/debug/uploads`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`💰 Payment API: http://localhost:${PORT}/api/payments`);
  console.log(`📊 Payment Stats: http://localhost:${PORT}/api/payments/admin/stats`);
  console.log(`📈 Order Stats: http://localhost:${PORT}/api/orders/admin/stats`);
  console.log(`🔄 Update Payment Status: PUT http://localhost:${PORT}/api/orders/admin/:id/payment-status`);
  console.log(`🧪 Payment Test: http://localhost:${PORT}/api/payments/test-page`);
  console.log('💳 Chapa Sandbox Mode: ACTIVE 🧪');
  console.log(`🗄️  MongoDB URI: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/josi-photo-printing'}`);
  console.log(`📦 Order routes: http://localhost:${PORT}/api/orders`);
});