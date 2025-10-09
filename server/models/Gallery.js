import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Gallery Schema (keep your existing schema)
const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Portrait', 'Landscape', 'Urban', 'Nature', 'Architecture', 'Event', 'Product', 'Wedding', 'Family', 'Other']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  imageSize: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true } // in bytes
  },
  specifications: {
    camera: String,
    lens: String,
    aperture: String,
    shutterSpeed: String,
    iso: String,
    location: String,
    dateTaken: Date
  },
  pricing: {
    digital: { type: Number, default: 0 },
    smallPrint: { type: Number, default: 0 },
    mediumPrint: { type: Number, default: 0 },
    largePrint: { type: Number, default: 0 },
    customPrint: { type: Number, default: 0 }
  },
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // NEW: File upload metadata
  fileMetadata: {
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Index for better performance (keep existing indexes)
gallerySchema.index({ category: 1, status: 1 });
gallerySchema.index({ featured: 1, status: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ createdBy: 1 });

// NEW: Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/gallery';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `gallery-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file per upload
  }
});

// NEW: Static method to handle file upload
gallerySchema.statics.uploadImage = function(file, userId) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Get image dimensions using a simple approach
    const getImageDimensions = (filePath) => {
      return new Promise((resolve) => {
        // For production, you might want to use a proper image processing library like sharp
        const size = fs.statSync(filePath).size;
        // Return default dimensions - in production, use sharp or jimp to get actual dimensions
        resolve({
          width: 1920,
          height: 1080,
          size: size
        });
      });
    };

    const filePath = file.path;
    
    getImageDimensions(filePath)
      .then(dimensions => {
        const imageUrl = `/uploads/gallery/${file.filename}`;
        
        resolve({
          imageUrl: imageUrl,
          dimensions: dimensions,
          fileMetadata: {
            originalName: file.originalname,
            fileName: file.filename,
            filePath: filePath,
            mimeType: file.mimetype,
            uploadedAt: new Date()
          }
        });
      })
      .catch(error => {
        // Clean up the uploaded file if there's an error
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(error);
      });
  });
};

// NEW: Static method to delete image file
gallerySchema.statics.deleteImageFile = function(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join('uploads/gallery', fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false); // File doesn't exist
    }
  });
};

// NEW: Instance method to get full image URL
gallerySchema.methods.getFullImageUrl = function() {
  if (this.imageUrl.startsWith('http')) {
    return this.imageUrl;
  }
  // For relative paths, construct full URL
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}${this.imageUrl}`;
};

// NEW: Instance method to increment download count
gallerySchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

// NEW: Instance method to increment order count
gallerySchema.methods.incrementOrderCount = function() {
  this.orderCount += 1;
  return this.save();
};

// NEW: Static method to get gallery stats
gallerySchema.statics.getGalleryStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalDownloads: { $sum: '$downloadCount' },
        totalOrders: { $sum: '$orderCount' },
        featuredCount: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    }
  ]);

  const categoryStats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    total: stats[0]?.totalImages || 0,
    downloads: stats[0]?.totalDownloads || 0,
    orders: stats[0]?.totalOrders || 0,
    featured: stats[0]?.featuredCount || 0,
    active: stats[0]?.activeCount || 0,
    byCategory: categoryStats
  };
};

// NEW: Static method to search gallery items
gallerySchema.statics.searchGallery = async function(searchTerm, category = '', page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  
  let query = { status: 'active' };
  
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ];
  }
  
  if (category && category !== 'All') {
    query.category = category;
  }

  const [items, total] = await Promise.all([
    this.find(query)
      .select('title description category imageUrl pricing featured downloadCount orderCount specifications tags')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    data: items,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

// NEW: Middleware to delete image file when gallery item is removed
gallerySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    if (this.fileMetadata && this.fileMetadata.fileName) {
      await this.constructor.deleteImageFile(this.fileMetadata.fileName);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// NEW: Middleware to handle updates and clean up old files
gallerySchema.pre('save', async function(next) {
  if (this.isModified('imageUrl') && !this.isNew) {
    // If imageUrl is being updated and this is not a new document,
    // we might want to delete the old file
    // You can implement this based on your needs
  }
  next();
});

// Virtual for formatted pricing
gallerySchema.virtual('formattedPricing').get(function() {
  return {
    digital: `$${this.pricing.digital.toFixed(2)}`,
    smallPrint: `$${this.pricing.smallPrint.toFixed(2)}`,
    mediumPrint: `$${this.pricing.mediumPrint.toFixed(2)}`,
    largePrint: `$${this.pricing.largePrint.toFixed(2)}`,
    customPrint: `$${this.pricing.customPrint.toFixed(2)}`
  };
});

// Ensure virtual fields are serialized
gallerySchema.set('toJSON', { virtuals: true });
gallerySchema.set('toObject', { virtuals: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;