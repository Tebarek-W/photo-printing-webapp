import asyncHandler from 'express-async-handler';
import Gallery from '../models/Gallery.js';

// @desc    Upload gallery image
// @route   POST /api/gallery/upload
// @access  Private/Admin
const uploadGalleryImage = asyncHandler(async (req, res) => {
  try {
    console.log('📤 Upload request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      } : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const uploadResult = await Gallery.uploadImage(req.file, req.user.id);

    // ✅ RETURN ABSOLUTE URL instead of relative
    const absoluteImageUrl = `http://localhost:5000/uploads/gallery/${req.file.filename}`;

    console.log('✅ Upload completed:', {
      relativeUrl: uploadResult.imageUrl,
      absoluteUrl: absoluteImageUrl,
      filePath: req.file.path
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: absoluteImageUrl, // ✅ Changed to absolute URL
      dimensions: uploadResult.dimensions,
      fileMetadata: uploadResult.fileMetadata
    });

  } catch (error) {
    console.error('🔴 Upload gallery image error:', error);
    
    if (req.file && req.file.path) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Cleaned up failed upload:', req.file.path);
        }
      } catch (cleanupError) {
        console.error('🔴 File cleanup error:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
});

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      status = 'active',
      featured,
      search 
    } = req.query;

    // Build filter
    const filter = { status };
    if (category && category !== 'All') filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get gallery items with pagination
    const galleryItems = await Gallery.find(filter)
      .populate('createdBy', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Gallery.countDocuments(filter);

    // Get categories for filter
    const categories = await Gallery.distinct('category', { status: 'active' });

    // Get gallery stats using the new method
    const stats = await Gallery.getGalleryStats();

    res.json({
      success: true,
      data: galleryItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      categories: ['All', ...categories],
      stats: {
        total: stats.total,
        featured: stats.featured,
        active: stats.active,
        downloads: stats.downloads,
        orders: stats.orders,
        byCategory: stats.byCategory
      }
    });

  } catch (error) {
    console.error('🔴 Get gallery items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items'
    });
  }
});

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryItem = asyncHandler(async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: galleryItem
    });

  } catch (error) {
    console.error('🔴 Get gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item'
    });
  }
});

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      imageSize,
      specifications,
      pricing,
      tags,
      featured
    } = req.body;

    // Validation
    if (!title || !description || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const galleryData = {
      title: title.trim(),
      description: description.trim(),
      category,
      imageUrl,
      imageSize: imageSize || { width: 0, height: 0, size: 0 },
      specifications: specifications || {},
      pricing: pricing || {},
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      featured: featured || false,
      createdBy: req.user.id
    };

    const galleryItem = await Gallery.create(galleryData);

    console.log('✅ Gallery item created:', {
      id: galleryItem._id,
      title: galleryItem.title,
      category: galleryItem.category,
      createdBy: galleryItem.createdBy
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });

  } catch (error) {
    console.error('🔴 Create gallery item error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item'
    });
  }
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      imageSize,
      specifications,
      pricing,
      tags,
      status,
      featured
    } = req.body;

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        description: description?.trim(),
        category,
        imageUrl,
        imageSize,
        specifications,
        pricing,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : undefined),
        status,
        featured
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem
    });

  } catch (error) {
    console.error('🔴 Update gallery item error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item'
    });
  }
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Use deleteOne to trigger the middleware for file cleanup
    await Gallery.deleteOne({ _id: req.params.id });

    console.log('🗑️ Gallery item deleted:', {
      id: req.params.id,
      title: galleryItem.title,
      hadFile: !!(galleryItem.fileMetadata && galleryItem.fileMetadata.fileName)
    });

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });

  } catch (error) {
    console.error('🔴 Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item'
    });
  }
});

// @desc    Update gallery item stats
// @route   PUT /api/gallery/:id/stats
// @access  Public
const updateGalleryStats = asyncHandler(async (req, res) => {
  try {
    const { action } = req.body; // 'download' or 'order'

    if (!action || !['download', 'order'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "download" or "order"'
      });
    }

    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Use the instance method for better control
    if (action === 'download') {
      await galleryItem.incrementDownloadCount();
    } else if (action === 'order') {
      await galleryItem.incrementOrderCount();
    }

    console.log('📈 Gallery stats updated:', {
      id: galleryItem._id,
      action: action,
      newDownloadCount: galleryItem.downloadCount,
      newOrderCount: galleryItem.orderCount
    });

    res.json({
      success: true,
      message: `Gallery item ${action} count updated`,
      data: galleryItem
    });

  } catch (error) {
    console.error('🔴 Update gallery stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery stats'
    });
  }
});

// @desc    Get gallery categories
// @route   GET /api/gallery/categories
// @access  Public
const getGalleryCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Gallery.distinct('category', { status: 'active' });
    
    res.json({
      success: true,
      data: ['All', ...categories]
    });

  } catch (error) {
    console.error('🔴 Get gallery categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery categories'
    });
  }
});

// @desc    Search gallery items with advanced filtering
// @route   GET /api/gallery/search
// @access  Public
const searchGalleryItems = asyncHandler(async (req, res) => {
  try {
    const { 
      q: searchTerm, 
      category, 
      page = 1, 
      limit = 12 
    } = req.query;

    const result = await Gallery.searchGallery(
      searchTerm, 
      category, 
      parseInt(page), 
      parseInt(limit)
    );

    console.log('🔍 Gallery search performed:', {
      searchTerm,
      category,
      page,
      limit,
      results: result.data.length
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('🔴 Search gallery items error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

export {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGalleryStats,
  getGalleryCategories,
  uploadGalleryImage, // NEW: Export the upload function
  searchGalleryItems  // NEW: Export the search function
};