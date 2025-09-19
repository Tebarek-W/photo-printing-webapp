import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardMedia,
  Chip,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  CloudUpload,
  CheckCircle,
  Delete,
  PhotoCamera,
  Print,
  LocalShipping,
  Payment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Order = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    paperType: 'glossy',
    size: '4x6',
    quantity: 1,
    finish: 'standard',
    customerName: '',
    email: '',
    phone: '',
    address: ''
  });

  const paperTypes = [
    { value: 'glossy', label: 'Glossy Photo Paper' },
    { value: 'matte', label: 'Matte Photo Paper' },
    { value: 'premium', label: 'Premium Lustre' },
    { value: 'canvas', label: 'Canvas' }
  ];

  const sizes = [
    { value: '4x6', label: '4x6 inches' },
    { value: '5x7', label: '5x7 inches' },
    { value: '8x10', label: '8x10 inches' },
    { value: '11x14', label: '11x14 inches' },
    { value: '16x20', label: '16x20 inches' }
  ];

  const finishes = [
    { value: 'standard', label: 'Standard' },
    { value: 'lustre', label: 'Lustre' },
    { value: 'metallic', label: 'Metallic' },
    { value: 'acrylic', label: 'Acrylic' }
  ];

  const steps = ['Upload Photos', 'Select Options', 'Review & Confirm'];

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Limit to 10 files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxFiles: 10,
    maxSize: 10485760 // 10MB
  });

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleInputChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the files and order details to your backend here
    console.log('Submitting order:', { files, orderDetails });
    setIsSubmitted(true);
  };

  const resetOrder = () => {
    setIsSubmitted(false);
    setFiles([]);
    setActiveStep(0);
    setOrderDetails({
      paperType: 'glossy',
      size: '4x6',
      quantity: 1,
      finish: 'standard',
      customerName: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Order Prints
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Upload your photos and we'll create beautiful, high-quality prints
        </Typography>
      </Box>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Order Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Thank you for your order. We've received your {files.length} photo{files.length !== 1 ? 's' : ''} and will begin processing your prints shortly.
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>
              Order Reference: <strong>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong>
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={resetOrder}
              sx={{ px: 4 }}
            >
              Place Another Order
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Box>
          <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 6 },
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              borderRadius: 3,
            }}
          >
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Upload Your Photos
                </Typography>
                
                <Box
                  {...getRootProps()}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    cursor: 'pointer',
                    p: 4,
                    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                    backgroundColor: isDragActive ? 'action.hover' : 'background.default',
                    borderRadius: 2,
                    mb: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" align="center" gutterBottom>
                    {isDragActive ? (
                      'Drop your photos here'
                    ) : (
                      'Drag & drop your photos here'
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    or click to browse files (JPEG, PNG, up to 10MB each)
                  </Typography>
                  <Chip 
                    label={`${files.length}/10 files`} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                  />
                </Box>

                {files.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Selected Photos
                    </Typography>
                    <Grid container spacing={2}>
                      {files.map((file) => (
                        <Grid item xs={6} sm={4} md={3} key={file.id}>
                          <Card
                            sx={{
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="140"
                              image={file.preview}
                              alt={file.name}
                              onLoad={() => URL.revokeObjectURL(file.preview)}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(file.id);
                                }}
                                sx={{ color: 'white' }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box sx={{ p: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={files.length === 0}
                    endIcon={<PhotoCamera />}
                  >
                    Continue to Options
                  </Button>
                </Box>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                  Printing Options
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Paper Type</InputLabel>
                      <Select
                        value={orderDetails.paperType}
                        label="Paper Type"
                        onChange={(e) => handleInputChange('paperType', e.target.value)}
                      >
                        {paperTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Print Size</InputLabel>
                      <Select
                        value={orderDetails.size}
                        label="Print Size"
                        onChange={(e) => handleInputChange('size', e.target.value)}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size.value} value={size.value}>
                            {size.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={orderDetails.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      inputProps={{ min: 1, max: 100 }}
                      sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth>
                      <InputLabel>Finish</InputLabel>
                      <Select
                        value={orderDetails.finish}
                        label="Finish"
                        onChange={(e) => handleInputChange('finish', e.target.value)}
                      >
                        {finishes.map((finish) => (
                          <MenuItem key={finish.value} value={finish.value}>
                            {finish.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Print sx={{ mr: 1 }} /> Order Summary
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Paper Type:
                        </Typography>
                        <Typography variant="body1">
                          {paperTypes.find(t => t.value === orderDetails.paperType)?.label}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Size:
                        </Typography>
                        <Typography variant="body1">
                          {sizes.find(s => s.value === orderDetails.size)?.label}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quantity:
                        </Typography>
                        <Typography variant="body1">
                          {orderDetails.quantity} print{orderDetails.quantity !== 1 ? 's' : ''} per photo
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Photos:
                        </Typography>
                        <Typography variant="body1">
                          {files.length} photo{files.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="h6" color="primary">
                          Estimated Total: ${(files.length * orderDetails.quantity * 2.5).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Final price may vary based on paper selection
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<LocalShipping />}
                  >
                    Continue to Shipping
                  </Button>
                </Box>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                  Shipping Information
                </Typography>

                <Alert severity="info" sx={{ mb: 4 }}>
                  Please review your order details and provide your shipping information.
                </Alert>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={orderDetails.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={orderDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={orderDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      label="Shipping Address"
                      multiline
                      rows={3}
                      value={orderDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>
                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Photos:
                        </Typography>
                        <Typography variant="body1">
                          {files.length} photo{files.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Paper:
                        </Typography>
                        <Typography variant="body1">
                          {paperTypes.find(t => t.value === orderDetails.paperType)?.label}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Size:
                        </Typography>
                        <Typography variant="body1">
                          {sizes.find(s => s.value === orderDetails.size)?.label}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quantity:
                        </Typography>
                        <Typography variant="body1">
                          {orderDetails.quantity} per photo
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="h6" color="primary">
                          Total: ${(files.length * orderDetails.quantity * 2.5).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Includes shipping and handling
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                    endIcon={<Payment />}
                    disabled={!orderDetails.customerName || !orderDetails.email || !orderDetails.address}
                  >
                    Complete Order
                  </Button>
                </Box>
              </motion.div>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Order;