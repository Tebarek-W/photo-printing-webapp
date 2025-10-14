import Order from '../models/Order.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

// Helper function to check admin privileges
const checkAdmin = (user) => {
  return user.role === 'admin';
};

// Helper function for error responses
const errorResponse = (res, message, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }
  
  return res.status(statusCode).json(response);
};

// Helper function for success responses
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

// Create new order (Authenticated users)
export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      paymentStatus: 'pending',
      allowPayLater: true, // Enable pay later by default
      paymentExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const order = new Order(orderData);
    await order.save();

    // Populate the order with customer info for response
    await order.populate('customerId', 'name email');

    return successResponse(res, 'Order created successfully', order, 201);
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse(res, 'Failed to create order', 400, error);
  }
};

// Get user's orders (with pay later support)
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const skip = (page - 1) * limit;

    // Build query for optional filtering
    const query = { customerId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('paymentId', 'status amount paymentMethod paidAt'),
      Order.countDocuments(query)
    ]);

    // Check for expired orders and update them
    const now = new Date();
    const expiredOrders = orders.filter(order => 
      order.paymentStatus === 'pending' && 
      order.paymentExpiry && 
      order.paymentExpiry < now
    );

    if (expiredOrders.length > 0) {
      await Order.updateMany(
        { 
          _id: { $in: expiredOrders.map(o => o._id) },
          paymentStatus: 'pending'
        },
        { paymentStatus: 'expired' }
      );
    }

    return successResponse(res, 'Orders fetched successfully', {
      orders: orders.map(order => ({
        ...order.toObject(),
        canPay: order.canPay?.() ?? (order.paymentStatus === 'pending' && 
                (!order.paymentExpiry || order.paymentExpiry > now))
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return errorResponse(res, 'Failed to fetch orders');
  }
};

// Get user's pending orders (for payment)
export const getPendingOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      customerId: req.user._id,
      paymentStatus: 'pending',
      $or: [
        { paymentExpiry: { $gt: new Date() } },
        { paymentExpiry: { $exists: false } }
      ]
    };

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('paymentId', 'status amount paymentMethod'),
      Order.countDocuments(query)
    ]);

    return successResponse(res, 'Pending orders fetched successfully', {
      orders: orders.map(order => ({
        ...order.toObject(),
        canPay: true,
        expiresIn: order.paymentExpiry ? 
          Math.max(0, order.paymentExpiry - new Date()) : null
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Get pending orders error:', error);
    return errorResponse(res, 'Failed to fetch pending orders');
  }
};

// Save order for later payment (explicit pay later)
export const saveOrderForLater = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customerId: req.user._id,
      paymentStatus: 'pending'
    });

    if (!order) {
      return errorResponse(res, 'Order not found or already processed', 404);
    }

    // Update order for pay later
    order.allowPayLater = true;
    order.paymentExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    order.paymentAttempts = 0;
    
    await order.save();

    return successResponse(res, 'Order saved for later payment', {
      order,
      paymentExpiry: order.paymentExpiry,
      message: 'You have 24 hours to complete payment'
    });
  } catch (error) {
    console.error('Save order for later error:', error);
    return errorResponse(res, 'Failed to save order for later payment', 400, error);
  }
};

// Resume payment for an order
export const resumeOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customerId: req.user._id,
      paymentStatus: 'pending'
    });

    if (!order) {
      return errorResponse(res, 'Order not found or already paid', 404);
    }

    // Check if order can be paid
    if (!order.canPay()) {
      if (order.isExpired()) {
        // Extend expiry for another 24 hours
        order.paymentExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        order.paymentAttempts = (order.paymentAttempts || 0) + 1;
        await order.save();
      } else {
        return errorResponse(res, 'This order cannot be paid at the moment', 400);
      }
    }

    return successResponse(res, 'Order ready for payment', {
      order,
      canPay: true,
      paymentExpiry: order.paymentExpiry
    });
  } catch (error) {
    console.error('Resume order payment error:', error);
    return errorResponse(res, 'Failed to resume order payment', 400, error);
  }
};

// Admin: Get all orders (updated with pay later support)
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, paymentStatus, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query with optional filters
    let query = {};
    
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    // Search functionality (customer name, email, or order ID)
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    const [orders, totalCount, pendingOrders, paidOrders, totalRevenueResult] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customerId', 'name email phone')
        .populate('paymentId', 'status amount paymentMethod paidAt'),
      Order.countDocuments(query),
      Order.countDocuments({ ...query, status: 'pending' }),
      Order.countDocuments({ ...query, paymentStatus: 'paid' }),
      Order.aggregate([
        { $match: { ...query, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    return successResponse(res, 'Orders fetched successfully', {
      orders,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
      stats: {
        pendingOrders,
        paidOrders,
        totalRevenue: totalRevenueResult[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    return errorResponse(res, 'Failed to fetch orders');
  }
};

// Admin: Get single order
export const getOrderById = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('paymentId');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, 'Order fetched successfully', order);
  } catch (error) {
    console.error('Admin get order error:', error);
    return errorResponse(res, 'Failed to fetch order');
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const { status } = req.body;
    
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('paymentId');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, 'Order status updated successfully', order);
  } catch (error) {
    console.error('Update order status error:', error);
    return errorResponse(res, 'Failed to update order status', 400, error);
  }
};

// Admin: Update order payment status (FIXED - No transactions)
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const { paymentStatus } = req.body;
    
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'expired'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return errorResponse(res, 'Invalid payment status', 400);
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Update order payment status
    order.paymentStatus = paymentStatus;
    await order.save();

    // Also update the associated payment record if it exists
    if (order.paymentId) {
      let paymentStatusUpdate = paymentStatus;
      if (paymentStatus === 'paid') {
        paymentStatusUpdate = 'completed';
      } else if (paymentStatus === 'failed') {
        paymentStatusUpdate = 'failed';
      }

      await Payment.findByIdAndUpdate(
        order.paymentId,
        { 
          status: paymentStatusUpdate,
          ...(paymentStatus === 'paid' && { paidAt: new Date() })
        },
        { new: true, runValidators: true }
      );
    }

    // If marking as paid and no payment record exists, create one
    if (paymentStatus === 'paid' && !order.paymentId) {
      const payment = new Payment({
        orderId: order._id,
        customerId: order.customerId,
        amount: order.totalPrice,
        currency: 'ETB',
        tx_ref: `MANUAL-${order._id}-${Date.now()}`,
        status: 'completed',
        paymentMethod: 'manual',
        paidAt: new Date(),
        testMode: false
      });

      const savedPayment = await payment.save();
      
      // Link payment to order
      order.paymentId = savedPayment._id;
      await order.save();
    }

    const updatedOrder = await Order.findById(req.params.id)
      .populate('paymentId');

    return successResponse(res, 'Order payment status updated successfully', updatedOrder);
  } catch (error) {
    console.error('Update order payment status error:', error);
    return errorResponse(res, 'Failed to update order payment status', 400, error);
  }
};

// Admin: Update order
export const updateOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const allowedUpdates = [
      'status', 
      'paymentStatus', 
      'totalPrice', 
      'orderDetails.specialInstructions',
      'orderDetails.customerName',
      'orderDetails.email',
      'orderDetails.phone',
      'orderDetails.address',
      'allowPayLater',
      'paymentExpiry'
    ];
    
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        // Handle nested fields
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (!updates[parent]) updates[parent] = {};
          updates[parent][child] = req.body[field];
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Validate totalPrice if provided
    if (updates.totalPrice !== undefined && updates.totalPrice < 0) {
      return errorResponse(res, 'Total price cannot be negative', 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('paymentId');

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, 'Order updated successfully', order);
  } catch (error) {
    console.error('Update order error:', error);
    return errorResponse(res, 'Failed to update order', 400, error);
  }
};

// Admin: Delete order (FIXED - No transactions)
export const deleteOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Also delete associated payment record if it exists
    if (order.paymentId) {
      await Payment.findByIdAndDelete(order.paymentId);
    }

    await Order.findByIdAndDelete(req.params.id);
    
    return successResponse(res, 'Order and associated payment deleted successfully');
  } catch (error) {
    console.error('Delete order error:', error);
    return errorResponse(res, 'Failed to delete order');
  }
};

// Get order statistics for dashboard
export const getOrderStats = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      paidOrders,
      pendingPayments,
      expiredOrders,
      revenueStats,
      recentRevenue,
      ordersPerMonth,
      paymentStats,
      serviceStats
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ paymentStatus: 'pending' }),
      Order.countDocuments({ paymentStatus: 'expired' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { 
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            averageOrderValue: { $avg: '$totalPrice' },
            maxOrderValue: { $max: '$totalPrice' },
            minOrderValue: { $min: '$totalPrice' },
            orderCount: { $sum: 1 }
          }
        }
      ]),
      // Recent revenue (last 30 days)
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]),
      // Orders per month for the last 6 months
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),
      // Payment method statistics
      Payment.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      // Service type statistics
      Order.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' },
            averagePrice: { $avg: '$totalPrice' }
          }
        }
      ])
    ]);

    const revenueData = revenueStats[0] || {};
    const recentRevenueData = recentRevenue[0] || {};

    return successResponse(res, 'Order statistics fetched successfully', {
      totalOrders,
      pendingOrders,
      completedOrders,
      paidOrders,
      pendingPayments,
      expiredOrders,
      totalRevenue: revenueData.totalRevenue || 0,
      recentRevenue: recentRevenueData.total || 0,
      averageOrderValue: revenueData.averageOrderValue || 0,
      maxOrderValue: revenueData.maxOrderValue || 0,
      minOrderValue: revenueData.minOrderValue || 0,
      paidOrderCount: revenueData.orderCount || 0,
      ordersPerMonth,
      paymentStats,
      serviceStats
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    return errorResponse(res, 'Failed to fetch order statistics');
  }
};

// Get order analytics for charts
export const getOrderAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const { period = 'month' } = req.query; // day, week, month, year

    let groupFormat;
    let dateRange = new Date();

    switch (period) {
      case 'day':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateRange.setDate(dateRange.getDate() - 30); // Last 30 days
        break;
      case 'week':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateRange.setDate(dateRange.getDate() - 90); // Last 12 weeks
        break;
      case 'year':
        groupFormat = {
          year: { $year: '$createdAt' }
        };
        dateRange.setFullYear(dateRange.getFullYear() - 3); // Last 3 years
        break;
      default: // month
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateRange.setMonth(dateRange.getMonth() - 12); // Last 12 months
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupFormat,
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          paidOrders: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0]
            }
          },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          expiredOrders: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'expired'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    return successResponse(res, 'Order analytics fetched successfully', {
      period,
      analytics,
      dateRange: {
        from: dateRange,
        to: new Date()
      }
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    return errorResponse(res, 'Failed to fetch order analytics');
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (!checkAdmin(req.user)) {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }

    const limit = parseInt(req.query.limit) || 10;
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customerId', 'name email')
      .populate('paymentId', 'status paymentMethod');

    return successResponse(res, 'Recent orders fetched successfully', recentOrders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    return errorResponse(res, 'Failed to fetch recent orders');
  }
};