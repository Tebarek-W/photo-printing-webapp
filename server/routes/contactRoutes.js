import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  replyToMessage,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createContactMessage);

// Protected admin routes
router.get('/', protect, getContactMessages);
router.get('/:id', protect, getContactMessage);
router.put('/:id/status', protect, updateMessageStatus);
router.post('/:id/reply', protect, replyToMessage);
router.delete('/:id', protect, deleteContactMessage);

export default router;