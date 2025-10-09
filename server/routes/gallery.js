import express from 'express';
import {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGalleryStats,
  getGalleryCategories,
  uploadGalleryImage,    // NEW
  searchGalleryItems     // NEW
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../models/Gallery.js'; // Import multer config

const router = express.Router();

// Public routes
router.get('/', getGalleryItems);
router.get('/search', searchGalleryItems);     // NEW
router.get('/categories', getGalleryCategories);
router.get('/:id', getGalleryItem);
router.put('/:id/stats', updateGalleryStats);

// Protected admin routes
router.post('/upload', protect, upload.single('image'), uploadGalleryImage); // NEW
router.post('/', protect, createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;