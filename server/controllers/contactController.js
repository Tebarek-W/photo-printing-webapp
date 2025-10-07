import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public (but can accept authenticated users)
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message, subject } = req.body;

  console.log('📥 Contact message received:', { name, email, subject });
  console.log('🔐 User authentication:', req.user ? `Authenticated as ${req.user.id}` : 'Guest user');

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
    // Include user ID if user is logged in (from Authorization header)
    const messageData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      status: 'unread',
      replied: false
    };

    // Add user reference if user is authenticated via Authorization header
    if (req.user && req.user.id) {
      messageData.user = req.user.id;
      console.log(`🔗 Linking message to user: ${req.user.id}`);
    } else {
      console.log('🔗 Message will be saved without user link (guest user)');
    }

    // Create contact message
    const contactMessage = await ContactMessage.create(messageData);

    console.log('✅ Contact message saved:', {
      email: contactMessage.email,
      user: contactMessage.user || 'No user linked',
      id: contactMessage._id
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        user: contactMessage.user
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
      .populate('user', 'name email') // Populate user info
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
    const message = await ContactMessage.findById(req.params.id)
      .populate('user', 'name email'); // Populate user info

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
    ).populate('user', 'name email');

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
    ).populate('user', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    console.log(`✅ Admin replied to message from ${message.email}`);
    console.log(`🔗 Message user link: ${message.user ? message.user._id : 'No user linked'}`);

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

// @desc    Get contact messages for logged-in user
// @route   GET /api/contact/user/messages
// @access  Private
const getUserMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`🟡 Fetching messages for user: ${userId}`);
    
    const messages = await ContactMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    console.log(`✅ Fetched ${messages.length} messages for user: ${userId}`);

    // Log message details for debugging
    messages.forEach(msg => {
      console.log(`📧 User Message: ${msg._id} | Replied: ${msg.replied} | AdminReply: ${msg.adminReply ? 'YES' : 'NO'}`);
    });

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });

  } catch (error) {
    console.error('🔴 Get user messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your messages'
    });
  }
});

// @desc    Debug: Check if messages are properly linked to users
// @route   GET /api/contact/debug/user-links
// @access  Private (Admin only)
const debugUserMessageLinks = asyncHandler(async (req, res) => {
  try {
    // Get all messages with user population
    const messages = await ContactMessage.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const stats = {
      total: messages.length,
      withUser: messages.filter(m => m.user).length,
      withoutUser: messages.filter(m => !m.user).length,
      replied: messages.filter(m => m.replied).length,
      repliedWithUser: messages.filter(m => m.replied && m.user).length
    };

    console.log('🔍 User Message Links Debug:');
    console.log('📊 Stats:', stats);
    
    messages.forEach(msg => {
      console.log(`📧 ${msg._id} | User: ${msg.user ? msg.user._id : 'NO USER'} | Email: ${msg.email} | Replied: ${msg.replied} | AdminReply: ${msg.adminReply ? 'YES' : 'NO'}`);
    });

    res.json({
      success: true,
      stats,
      messages: messages.map(msg => ({
        id: msg._id,
        email: msg.email,
        user: msg.user ? { id: msg.user._id, name: msg.user.name, email: msg.user.email } : null,
        replied: msg.replied,
        adminReply: msg.adminReply ? 'Present' : 'Missing',
        createdAt: msg.createdAt
      }))
    });

  } catch (error) {
    console.error('🔴 Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed'
    });
  }
});

// @desc    Debug: Check specific user's messages
// @route   GET /api/contact/debug/user/:userId
// @access  Private (Admin only)
const debugUserMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    
    console.log(`🔍 Debugging messages for user: ${userId}`);
    
    // Get messages with this user ID
    const userMessages = await ContactMessage.find({ user: userId })
      .sort({ createdAt: -1 });

    // Get all messages to compare
    const allMessages = await ContactMessage.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log('📊 Debug Results:');
    console.log(`User ${userId} has ${userMessages.length} messages`);
    
    userMessages.forEach(msg => {
      console.log(`📧 User Message: ${msg._id} | Replied: ${msg.replied} | AdminReply: ${msg.adminReply ? 'YES' : 'NO'} | Created: ${msg.createdAt}`);
    });

    console.log('\n🔍 All messages in database:');
    allMessages.forEach(msg => {
      console.log(`📧 All: ${msg._id} | User: ${msg.user ? msg.user._id : 'NO USER'} | Email: ${msg.email} | Replied: ${msg.replied} | AdminReply: ${msg.adminReply ? 'YES' : 'NO'}`);
    });

    res.json({
      success: true,
      userMessages: userMessages.map(msg => ({
        id: msg._id,
        email: msg.email,
        replied: msg.replied,
        adminReply: msg.adminReply,
        status: msg.status,
        createdAt: msg.createdAt,
        repliedAt: msg.repliedAt
      })),
      allMessages: allMessages.map(msg => ({
        id: msg._id,
        email: msg.email,
        user: msg.user ? { id: msg.user._id, name: msg.user.name } : null,
        replied: msg.replied,
        adminReply: msg.adminReply,
        status: msg.status
      })),
      stats: {
        userMessageCount: userMessages.length,
        totalMessageCount: allMessages.length,
        userRepliedCount: userMessages.filter(m => m.replied).length,
        totalRepliedCount: allMessages.filter(m => m.replied).length
      }
    });

  } catch (error) {
    console.error('🔴 Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed'
    });
  }
});

// Export all functions
export {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  replyToMessage,
  deleteContactMessage,
  getUserMessages,
  debugUserMessageLinks
};