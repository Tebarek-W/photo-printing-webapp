import express from 'express';
import {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGalleryStats,
  getGalleryCategories
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getGalleryItems);
router.get('/categories', getGalleryCategories);
router.get('/:id', getGalleryItem);
router.put('/:id/stats', updateGalleryStats);

// Protected admin routes
router.post('/', protect, createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;