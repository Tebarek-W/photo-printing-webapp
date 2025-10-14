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
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'expired'],
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
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  // Pay Later Fields
  allowPayLater: {
    type: Boolean,
    default: false
  },
  paymentExpiry: {
    type: Date,
    default: function() {
      // Orders expire in 24 hours if not paid
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  },
  paymentAttempts: {
    type: Number,
    default: 0
  },
  lastPaymentAttempt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentExpiry: 1 }); // For TTL
orderSchema.index({ allowPayLater: 1 }); // For pay later queries

// Method to check if order can be paid
orderSchema.methods.canPay = function() {
  if (this.paymentStatus === 'paid') return false;
  if (this.paymentStatus === 'expired') return false;
  if (this.paymentExpiry && new Date() > this.paymentExpiry) return false;
  return true;
};

// Method to check if order is expired
orderSchema.methods.isExpired = function() {
  return this.paymentExpiry && new Date() > this.paymentExpiry;
};

// Static method to get pending orders for user
orderSchema.statics.getPendingOrders = function(userId) {
  return this.find({
    customerId: userId,
    paymentStatus: 'pending',
    $or: [
      { paymentExpiry: { $gt: new Date() } },
      { paymentExpiry: { $exists: false } }
    ]
  }).sort({ createdAt: -1 });
};

export default mongoose.model('Order', orderSchema);