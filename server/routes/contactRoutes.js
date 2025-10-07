import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  replyToMessage,
  deleteContactMessage,
  getUserMessages,
  debugUserMessageLinks
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - but we'll handle authentication in controller
router.post('/', createContactMessage);

// Protected user routes
router.get('/user/messages', protect, getUserMessages);

// Protected admin routes
router.get('/', protect, getContactMessages);
router.get('/:id', protect, getContactMessage);
router.put('/:id/status', protect, updateMessageStatus);
router.post('/:id/reply', protect, replyToMessage);
router.delete('/:id', protect, deleteContactMessage);

// Debug routes (remove in production)
router.get('/debug/user-links', protect, debugUserMessageLinks);

export default router;