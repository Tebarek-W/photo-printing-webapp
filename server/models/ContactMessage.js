import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxLength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true,
      maxLength: [20, 'Phone number cannot be longer than 20 characters']
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry',
      maxLength: [200, 'Subject cannot be more than 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      trim: true,
      maxLength: [5000, 'Message cannot be more than 5000 characters']
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread'
    },
    replied: {
      type: Boolean,
      default: false
    },
    adminReply: {
      type: String,
      trim: true
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Create index for better performance
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ email: 1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;