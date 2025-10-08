import asyncHandler from 'express-async-handler';
import Gallery from '../models/Gallery.js';

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
        total,
        featured: await Gallery.countDocuments({ ...filter, featured: true }),
        byCategory: await Gallery.aggregate([
          { $match: filter },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ])
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
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

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

    const updateField = action === 'download' ? 'downloadCount' : 'orderCount';

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

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

export {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  updateGalleryStats,
  getGalleryCategories
};