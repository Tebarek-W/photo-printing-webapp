// PaymentTest.jsx - For sandbox testing
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { CheckCircle, Error, Payment, ShoppingCart } from '@mui/icons-material';

const PaymentTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testScenarios = [
    {
      name: 'Successful Payment',
      scenario: 'test_success',
      description: 'Simulate a successful payment',
      color: 'success'
    },
    {
      name: 'Failed Payment',
      scenario: 'test_failure', 
      description: 'Simulate a failed payment',
      color: 'error'
    }
  ];

  const handleTestPayment = async (scenario) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Create a mock order first
      const mockOrder = {
        serviceType: 'printing',
        serviceName: 'Test Printing Service',
        selectedOptions: { printingType: 'tshirts', quantity: 1 },
        orderDetails: {
          customerName: 'Test User',
          email: 'test@example.com',
          address: 'Test Address'
        },
        inputMethod: 'describe',
        totalPrice: 50,
        files: []
      };

      const orderResult = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(mockOrder)
      });

      const orderData = await orderResult.json();

      if (orderData.success) {
        const paymentResult = await paymentService.initializePayment(
          orderData.data._id, 
          scenario
        );

        setResult({
          scenario,
          order: orderData.data,
          payment: paymentResult
        });

        if (paymentResult.success && paymentResult.data.testMode) {
          // Auto-verify for sandbox
          setTimeout(async () => {
            const verifyResult = await paymentService.verifyPayment(
              paymentResult.data.tx_ref,
              scenario === 'test_success' ? 'success' : 'failure'
            );
            setResult(prev => ({ ...prev, verification: verifyResult }));
          }, 2000);
        }
      } else {
        setError('Failed to create test order');
      }
    } catch (err) {
      setError('Test payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        🧪 Payment Sandbox Testing
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test the Chapa payment integration without real transactions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {testScenarios.map((test) => (
          <Grid item xs={12} md={6} key={test.scenario}>
            <Card 
              sx={{ 
                height: '100%',
                border: theme => `2px solid ${theme.palette[test.color].main}20`
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                {test.color === 'success' ? (
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                ) : (
                  <Error sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                )}
                
                <Typography variant="h5" gutterBottom>
                  {test.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {test.description}
                </Typography>

                <Button
                  variant="contained"
                  color={test.color}
                  onClick={() => handleTestPayment(test.scenario)}
                  disabled={loading}
                  startIcon={<Payment />}
                >
                  {loading ? 'Testing...' : 'Test Payment'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Test Results
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`Scenario: ${result.scenario}`}
              color={result.scenario === 'test_success' ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Order Details</Typography>
              <Typography variant="body2">
                Service: {result.order.serviceName}
              </Typography>
              <Typography variant="body2">
                Amount: ${result.order.totalPrice}
              </Typography>
              <Typography variant="body2">
                Status: {result.order.status}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">Payment Response</Typography>
              <Typography variant="body2">
                Status: {result.payment.success ? 'Success' : 'Failed'}
              </Typography>
              <Typography variant="body2">
                Message: {result.payment.message}
              </Typography>
              {result.payment.data?.testMode && (
                <Chip label="Sandbox Mode" color="info" size="small" />
              )}
            </Grid>

            {result.verification && (
              <Grid item xs={12}>
                <Typography variant="h6">Verification Result</Typography>
                <Typography variant="body2">
                  Status: {result.verification.success ? 'Verified' : 'Failed'}
                </Typography>
                <Typography variant="body2">
                  Message: {result.verification.message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default PaymentTest;