import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

// Mock payment data for sandbox testing
const mockPaymentData = {
  'test_success': {
    status: 'success',
    data: {
      checkout_url: 'https://checkout.chapa.co/checkout/test-success',
      id: 'chapa_test_success_123',
      message: 'Payment initialized successfully'
    }
  },
  'test_failure': {
    status: 'error',
    message: 'Payment failed - Insufficient funds'
  }
};

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { orderId, testMode = 'test_success' } = req.body;

    console.log('🔄 Initializing payment for order:', orderId);

    // Validate order exists and belongs to user
    const order = await Order.findOne({ 
      _id: orderId, 
      customerId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Generate unique transaction reference
    const tx_ref = `JOSI-${order._id}-${Date.now()}`;

    // For sandbox testing
    console.log('🧪 Using sandbox payment mode');
    
    const mockResponse = mockPaymentData[testMode];
    
    if (mockResponse.status === 'success') {
      // Create payment record
      const payment = new Payment({
        orderId: order._id,
        customerId: req.user._id,
        amount: order.totalPrice,
        currency: 'ETB',
        tx_ref,
        chapaTransactionId: mockResponse.data.id,
        status: 'pending',
        paymentMethod: 'chapa',
        testMode: true
      });

      await payment.save();

      return res.json({
        success: true,
        message: 'Sandbox payment initialized successfully',
        data: {
          checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-test?tx_ref=${tx_ref}&orderId=${order._id}`,
          tx_ref,
          paymentId: payment._id,
          testMode: true,
          testScenario: testMode,
          orderId: order._id
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: mockResponse.message || 'Sandbox payment failed',
        testMode: true
      });
    }

  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message,
      testMode: true
    });
  }
};

// Verify payment (for sandbox testing)
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, testScenario = 'success' } = req.body;

    console.log('🔍 Verifying payment:', tx_ref);

    // For sandbox testing
    console.log('🧪 Using sandbox verification');
    
    // Find payment record
    const payment = await Payment.findOne({ tx_ref });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (testScenario === 'success') {
      // Simulate successful payment
      payment.status = 'completed';
      payment.chapaTransactionId = `chapa_test_${Date.now()}`;
      payment.paidAt = new Date();
      payment.verificationResponse = { status: 'success', message: 'Sandbox payment completed' };
      await payment.save();

      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'in-progress';
        order.paymentStatus = 'paid';
        await order.save();
      }

      console.log(`✅ Sandbox payment verified successfully for tx_ref: ${tx_ref}`);
      
      return res.json({
        success: true,
        message: 'Sandbox payment verified successfully',
        data: {
          payment,
          order,
          testMode: true
        }
      });
    } else {
      // Simulate failed payment
      payment.status = 'failed';
      payment.verificationResponse = { status: 'failed', message: 'Sandbox payment failed' };
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Sandbox payment verification failed',
        testMode: true
      });
    }

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
      testMode: true
    });
  }
};

// Mock webhook handler for sandbox
export const chapaWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log('📨 Received sandbox webhook:', event);

    // For sandbox, just log the webhook
    console.log('🧪 Sandbox webhook received:', { event, data });
    
    if (event === 'charge.complete') {
      const { tx_ref } = data;
      const payment = await Payment.findOne({ tx_ref });
      
      if (payment && payment.status === 'pending') {
        payment.status = 'completed';
        payment.chapaTransactionId = data.id;
        payment.paidAt = new Date();
        payment.verificationResponse = data;
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = 'in-progress';
          order.paymentStatus = 'paid';
          await order.save();
        }

        console.log(`✅ Sandbox webhook: Payment completed for tx_ref: ${tx_ref}`);
      }
    }

    res.status(200).json({ 
      success: true,
      message: 'Sandbox webhook received',
      testMode: true
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false,
      testMode: true
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ 
      orderId, 
      customerId: req.user._id 
    }).populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status'
    });
  }
};

// Get user payment history
export const getUserPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ customerId: req.user._id })
      .populate('orderId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Payment.countDocuments({ customerId: req.user._id });

    res.json({
      success: true,
      data: {
        payments,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};