import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: ['printing', 'photo', 'design']
  },
  serviceName: {
    type: String,
    required: true
  },
  selectedOptions: {
    type: Object,
    required: true
  },
  orderDetails: {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    specialInstructions: { type: String },
    projectDescription: { type: String }
  },
  inputMethod: {
    type: String,
    enum: ['upload', 'describe'],
    required: true
  },
  files: [{
    name: String,
    size: Number,
    type: String
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  // ADD PAYMENT STATUS FIELD
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 }); // ADD INDEX FOR PAYMENT STATUS
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);