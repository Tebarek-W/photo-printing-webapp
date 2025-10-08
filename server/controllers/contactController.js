import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  console.log('📥 Contact message received:', { name, email, subject });

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (name, email, message)'
    });
  }

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  try {
    // Create contact message
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      status: 'unread',
      replied: false
    });

    console.log('✅ Contact message saved:', contactMessage.email);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject
      }
    });

  } catch (error) {
    console.error('🔴 Contact message error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin only)
const getContactMessages = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get messages with pagination
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await ContactMessage.countDocuments(filter);

    // Get stats
    const unreadCount = await ContactMessage.countDocuments({ status: 'unread' });
    const totalCount = await ContactMessage.countDocuments();

    console.log(`✅ Fetched ${messages.length} contact messages`);

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      stats: {
        unread: unreadCount,
        total: totalCount,
        read: totalCount - unreadCount
      }
    });

  } catch (error) {
    console.error('🔴 Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private (Admin only)
const getContactMessage = asyncHandler(async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if it's unread
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('🔴 Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message'
    });
  }
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin only)
const updateMessageStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'replied' && { 
          replied: true,
          repliedAt: new Date()
        })
      },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: message
    });

  } catch (error) {
    console.error('🔴 Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
});

// @desc    Reply to contact message
// @route   POST /api/contact/:id/reply
// @access  Private (Admin only)
const replyToMessage = asyncHandler(async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        replied: true,
        adminReply: replyMessage.trim(),
        repliedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    console.log(`✅ Admin replied to message from ${message.email}`);

    // Here you would typically send an email to the user
    // await sendEmail(message.email, 'Reply to your inquiry', replyMessage);

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });

  } catch (error) {
    console.error('🔴 Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
const deleteContactMessage = asyncHandler(async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('🔴 Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

export {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  replyToMessage,
  deleteContactMessage
};