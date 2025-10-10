import express from 'express';
import {
  initializePayment,
  verifyPayment,
  chapaWebhook,
  getPaymentStatus,
  getUserPayments
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/initialize', protect, initializePayment);
router.get('/status/:orderId', protect, getPaymentStatus);
router.get('/history', protect, getUserPayments);

// Public routes for webhooks and verification
router.post('/verify', verifyPayment);
router.post('/webhook/chapa', chapaWebhook);

export default router;