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
import paymentRoutes from './routes/paymentRoutes.js'; // ADD PAYMENT ROUTES

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

// ✅ Serve static files from uploads directory
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
app.use('/api/payments', paymentRoutes); // ADD PAYMENT ROUTES

// ✅ ADD THESE DEBUG ROUTES (FIXED FOR ES MODULES):
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
      payments: '✅ Active' // ADD PAYMENTS TO HEALTH CHECK
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
      payments: '/api/payments', // ADD PAYMENTS TO ENDPOINTS LIST
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
  console.log(`🧪 Payment Test: http://localhost:${PORT}/api/payments/test-page`);
  console.log('💳 Chapa Sandbox Mode: ACTIVE 🧪');
  console.log(`🗄️  MongoDB URI: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/josi-photo-printing'}`);
  console.log(`📦 Order routes: http://localhost:${PORT}/api/orders`);
});