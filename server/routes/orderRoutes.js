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
  getOrderAnalytics
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

// Admin routes
router.get('/admin', protect, getAllOrders);
router.get('/admin/stats', protect, getOrderStats);
router.get('/admin/analytics', protect, getOrderAnalytics);
router.get('/admin/:id', protect, getOrderById);
router.put('/admin/:id/status', protect, updateOrderStatus);
router.put('/admin/:id/payment-status', protect, updateOrderPaymentStatus);
router.put('/admin/:id', protect, updateOrder);
router.delete('/admin/:id', protect, deleteOrder);

export default router;