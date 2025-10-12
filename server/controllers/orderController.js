import Order from '../models/Order.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

// Create new order (Authenticated users)
export const createOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      paymentStatus: 'pending' // Ensure payment status is set
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Order.countDocuments({ customerId: req.user._id });

    res.json({
      success: true,
      data: {
        orders,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customerId', 'name email');

    const totalCount = await Order.countDocuments(query);

    // Calculate stats
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        stats: {
          pendingOrders,
          paidOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Admin: Get single order
export const getOrderById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('paymentId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Admin get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Admin: Update order payment status
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { paymentStatus } = req.body;
    
    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
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

    res.json({
      success: true,
      message: 'Order payment status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order payment status error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update order payment status',
      error: error.message
    });
  }
};

// Admin: Update order
export const updateOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const allowedUpdates = [
      'status', 
      'paymentStatus', 
      'totalPrice', 
      'orderDetails.specialInstructions',
      'orderDetails.customerName',
      'orderDetails.email',
      'orderDetails.phone',
      'orderDetails.address'
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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('paymentId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Admin: Delete order
export const deleteOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Also delete associated payment record if it exists
    if (order.paymentId) {
      await Payment.findByIdAndDelete(order.paymentId);
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order and associated payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

// Get order statistics for dashboard
export const getOrderStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const pendingPayments = await Order.countDocuments({ paymentStatus: 'pending' });
    
    const revenueStats = await Order.aggregate([
      {
        $match: { paymentStatus: 'paid' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' },
          maxOrderValue: { $max: '$totalPrice' },
          minOrderValue: { $min: '$totalPrice' }
        }
      }
    ]);

    // Recent revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Orders per month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const ordersPerMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
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
    ]);

    // Payment method statistics
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Service type statistics
    const serviceStats = await Order.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averagePrice: { $avg: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        paidOrders,
        pendingPayments,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        recentRevenue: recentRevenue[0]?.total || 0,
        averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
        maxOrderValue: revenueStats[0]?.maxOrderValue || 0,
        minOrderValue: revenueStats[0]?.minOrderValue || 0,
        ordersPerMonth,
        paymentStats,
        serviceStats
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};

// Get order analytics for charts
export const getOrderAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
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
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        analytics
      }
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order analytics'
    });
  }
};