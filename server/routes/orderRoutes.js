import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
  getOrderAnalytics,
  getRecentOrders,
  // New pay later routes
  getPendingOrders,
  saveOrderForLater,
  resumeOrderPayment
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (none)

// Protected routes (authenticated users)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/pending', protect, getPendingOrders); // Get pending orders for payment
router.post('/pay-later', protect, saveOrderForLater); // Explicit pay later
router.post('/resume-payment', protect, resumeOrderPayment); // Resume payment

// Admin routes
router.get('/admin', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.get('/admin/analytics', protect, admin, getOrderAnalytics);
router.get('/admin/recent', protect, admin, getRecentOrders);
router.get('/admin/:id', protect, admin, getOrderById);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.put('/admin/:id/payment-status', protect, admin, updateOrderPaymentStatus);
router.put('/admin/:id', protect, admin, updateOrder);
router.delete('/admin/:id', protect, admin, deleteOrder);

export default router;