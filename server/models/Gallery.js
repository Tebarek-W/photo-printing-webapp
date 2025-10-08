import mongoose from 'mongoose';

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
  }
}, {
  timestamps: true
});

// Index for better performance
gallerySchema.index({ category: 1, status: 1 });
gallerySchema.index({ featured: 1, status: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ createdBy: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;