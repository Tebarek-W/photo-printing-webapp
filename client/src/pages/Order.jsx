import React, { useCallback, useState, useEffect } from 'react';
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
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Tabs,
  Tab
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CloudUpload,
  CheckCircle,
  Delete,
  PhotoCamera,
  Print,
  LocalShipping,
  Payment,
  Close,
  ArrowBack,
  DesignServices,
  Description,
  Image
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Modern theme matching the Services page
const modernTheme = {
  primary: '#2563eb',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  neutral: '#f8fafc',
  darkText: '#1e293b',
  lightText: '#64748b',
  success: '#10b981',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
};

// Service types with specific options
const serviceTypes = {
  PRINTING: {
    id: 'printing',
    name: 'Printing Services',
    icon: <Print />,
    gradient: modernTheme.gradient,
    options: {
      printingTypes: [
        { value: 'tshirts', label: 'T-shirts', price: 15, description: 'Custom printed t-shirts' },
        { value: 'banners', label: 'Banners', price: 50, description: 'Large format banners' },
        { value: 'stickers', label: 'Stickers', price: 5, description: 'Vinyl stickers' },
        { value: 'mugs', label: 'Mugs (prints on cups)', price: 12, description: 'Ceramic mug printing' },
        { value: 'business-cards', label: 'Business cards', price: 25, description: 'Professional business cards' },
        { value: 'caps', label: 'Caps', price: 18, description: 'Custom cap printing' },
        { value: 'scarves', label: 'Scarves', price: 20, description: 'Printed scarves' },
        { value: 'certificates', label: 'Certificates', price: 8, description: 'Award certificates' }
      ],
      sizes: [
        { value: 'small', label: 'Small', multiplier: 1 },
        { value: 'medium', label: 'Medium', multiplier: 1.2 },
        { value: 'large', label: 'Large', multiplier: 1.5 },
        { value: 'xlarge', label: 'Extra Large', multiplier: 1.8 }
      ],
      quantities: [
        { value: 1, label: '1 item' },
        { value: 5, label: '5 items' },
        { value: 10, label: '10 items' },
        { value: 25, label: '25 items' },
        { value: 50, label: '50 items' },
        { value: 100, label: '100+ items' }
      ]
    }
  },
  PHOTO: {
    id: 'photo',
    name: 'Photo Services',
    icon: <PhotoCamera />,
    gradient: modernTheme.gradient2,
    options: {
      photoTypes: [
        { value: 'onsite', label: 'Onsite photography', price: 200, description: 'Photography at your location' },
        { value: 'studio', label: 'Studio photography', price: 150, description: 'Professional studio session' },
        { value: 'event', label: 'Event photos (weddings, birthdays, graduations, etc.)', price: 300, description: 'Event coverage photography' },
        { value: 'frame', label: 'Frame photos (family portraits, decorative frames, etc.)', price: 100, description: 'Framed portrait sessions' }
      ],
      durations: [
        { value: '1h', label: '1 Hour', multiplier: 1 },
        { value: '2h', label: '2 Hours', multiplier: 1.8 },
        { value: '4h', label: '4 Hours', multiplier: 3.2 },
        { value: 'fullday', label: 'Full Day', multiplier: 5 }
      ],
      packages: [
        { value: 'basic', label: 'Basic (10 photos)', includes: ['Basic editing', 'Digital delivery'] },
        { value: 'standard', label: 'Standard (25 photos)', includes: ['Premium editing', 'Digital delivery', 'Online gallery'] },
        { value: 'premium', label: 'Premium (50+ photos)', includes: ['Premium editing', 'Digital delivery', 'Online gallery', 'Printed photos'] }
      ]
    }
  },
  DESIGN: {
    id: 'design',
    name: 'Design Services',
    icon: <DesignServices />,
    gradient: modernTheme.gradient3,
    options: {
      designTypes: [
        { value: 'logo', label: 'Logo design', price: 200, description: 'Custom logo creation' },
        { value: 'business-card', label: 'Business card design', price: 100, description: 'Business card design' },
        { value: 'certificate', label: 'Certificate design', price: 150, description: 'Certificate and award design' },
        { value: 'marketing', label: 'Marketing materials (flyers, posters, banners)', price: 250, description: 'Marketing collateral design' },
        { value: 'custom', label: 'Custom graphic design', price: 300, description: 'Custom design projects' }
      ],
      complexity: [
        { value: 'simple', label: 'Simple', multiplier: 1, description: 'Basic design requirements' },
        { value: 'medium', label: 'Medium', multiplier: 1.5, description: 'Moderate complexity' },
        { value: 'complex', label: 'Complex', multiplier: 2, description: 'Advanced design needs' }
      ],
      revisions: [
        { value: 1, label: '1 Revision' },
        { value: 2, label: '2 Revisions' },
        { value: 3, label: '3 Revisions' },
        { value: 'unlimited', label: 'Unlimited Revisions' }
      ]
    }
  }
};

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // No default service selected initially
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [files, setFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'describe'
  const [orderDetails, setOrderDetails] = useState({
    serviceType: '',
    customerName: '',
    email: '',
    phone: '',
    address: '',
    specialInstructions: '',
    projectDescription: '' // New field for project description
  });

  const steps = ['Select Service', 'Provide Details', 'Review & Confirm'];

  useEffect(() => {
    if (selectedService) {
      setOrderDetails(prev => ({
        ...prev,
        serviceType: selectedService.id
      }));
    }
    setSelectedOptions({});
  }, [selectedService]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, 10));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.ai', '.eps', '.pdf'] },
    maxFiles: 10,
    maxSize: 20971520
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

  const handleOptionSelect = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowServiceSelector(false);
    setFiles([]);
    setSelectedOptions({});
    setInputMethod('upload'); // Reset to upload by default
  };

  const calculatePrice = () => {
    if (!selectedService) return 0;
    
    let basePrice = 0;
    
    switch (selectedService.id) {
      case 'printing':
        const printingType = serviceTypes.PRINTING.options.printingTypes.find(
          p => p.value === selectedOptions.printingType
        );
        const quantity = selectedOptions.quantity || 1;
        basePrice = printingType ? printingType.price * quantity : 0;
        break;
        
      case 'photo':
        const photoType = serviceTypes.PHOTO.options.photoTypes.find(
          p => p.value === selectedOptions.photoType
        );
        const duration = serviceTypes.PHOTO.options.durations.find(
          d => d.value === selectedOptions.duration
        );
        basePrice = photoType ? photoType.price * (duration?.multiplier || 1) : 0;
        break;
        
      case 'design':
        const designType = serviceTypes.DESIGN.options.designTypes.find(
          d => d.value === selectedOptions.designType
        );
        const complexity = serviceTypes.DESIGN.options.complexity.find(
          c => c.value === selectedOptions.complexity
        );
        basePrice = designType ? designType.price * (complexity?.multiplier || 1) : 0;
        break;
    }
    
    return basePrice;
  };

  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return !!selectedService;
      case 1:
        if (!selectedService) return false;
        
        // Check if user has provided either files OR description
        const hasFiles = files.length > 0;
        const hasDescription = orderDetails.projectDescription.trim().length > 0;
        const hasInput = inputMethod === 'upload' ? hasFiles : hasDescription;
        
        // Check service-specific requirements
        switch (selectedService.id) {
          case 'printing':
            return hasInput && !!selectedOptions.printingType && !!selectedOptions.quantity;
          case 'photo':
            return hasInput && !!selectedOptions.photoType && !!selectedOptions.duration;
          case 'design':
            return hasInput && !!selectedOptions.designType && !!selectedOptions.complexity;
          default:
            return hasInput;
        }
      case 2:
        return orderDetails.customerName && orderDetails.email && orderDetails.address;
      default:
        return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting order:', { 
      selectedService, 
      selectedOptions, 
      files, 
      orderDetails, 
      inputMethod,
      totalPrice: calculatePrice() 
    });
    setIsSubmitted(true);
  };

  const resetOrder = () => {
    setIsSubmitted(false);
    setFiles([]);
    setActiveStep(0);
    setSelectedService(null);
    setSelectedOptions({});
    setInputMethod('upload');
    setOrderDetails({
      serviceType: '',
      customerName: '',
      email: '',
      phone: '',
      address: '',
      specialInstructions: '',
      projectDescription: ''
    });
  };

  const ServiceSelectorDialog = () => (
    <Dialog 
      open={showServiceSelector} 
      onClose={() => setShowServiceSelector(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: modernTheme.gradient,
        color: 'white',
        textAlign: 'center',
        fontWeight: 700
      }}>
        Choose a Service
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {Object.values(serviceTypes).map((service) => (
            <Grid item xs={12} md={4} key={service.id}>
              <Card 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedService?.id === service.id ? `3px solid ${service.gradient}` : '1px solid #e2e8f0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => handleServiceSelect(service)}
              >
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  background: service.gradient 
                }}>
                  {service.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {service.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  const renderServiceOptions = () => {
    if (!selectedService) return null;

    switch (selectedService.id) {
      case 'printing':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: modernTheme.darkText }}>
                Select Printing Type
              </FormLabel>
              <RadioGroup
                value={selectedOptions.printingType || ''}
                onChange={(e) => handleOptionSelect('printingType', e.target.value)}
              >
                <Grid container spacing={2}>
                  {serviceTypes.PRINTING.options.printingTypes.map((type) => (
                    <Grid item xs={12} sm={6} key={type.value}>
                      <Card
                        sx={{
                          p: 2,
                          border: selectedOptions.printingType === type.value ? 
                            `2px solid ${modernTheme.primary}` : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: modernTheme.primary,
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleOptionSelect('printingType', type.value)}
                      >
                        <FormControlLabel
                          value={type.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {type.description}
                              </Typography>
                              <Typography variant="body2" color="primary" fontWeight={600}>
                                Starting from ${type.price}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Quantity</InputLabel>
                <Select
                  value={selectedOptions.quantity || ''}
                  label="Quantity"
                  onChange={(e) => handleOptionSelect('quantity', e.target.value)}
                >
                  {serviceTypes.PRINTING.options.quantities.map((qty) => (
                    <MenuItem key={qty.value} value={qty.value}>
                      {qty.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedOptions.size || ''}
                  label="Size"
                  onChange={(e) => handleOptionSelect('size', e.target.value)}
                >
                  {serviceTypes.PRINTING.options.sizes.map((size) => (
                    <MenuItem key={size.value} value={size.value}>
                      {size.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'photo':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: modernTheme.darkText }}>
                Select Photo Service
              </FormLabel>
              <RadioGroup
                value={selectedOptions.photoType || ''}
                onChange={(e) => handleOptionSelect('photoType', e.target.value)}
              >
                <Grid container spacing={2}>
                  {serviceTypes.PHOTO.options.photoTypes.map((type) => (
                    <Grid item xs={12} md={6} key={type.value}>
                      <Card
                        sx={{
                          p: 2,
                          border: selectedOptions.photoType === type.value ? 
                            `2px solid ${modernTheme.secondary}` : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: modernTheme.secondary,
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleOptionSelect('photoType', type.value)}
                      >
                        <FormControlLabel
                          value={type.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {type.description}
                              </Typography>
                              <Typography variant="body2" color="secondary" fontWeight={600}>
                                Starting from ${type.price}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={selectedOptions.duration || ''}
                  label="Duration"
                  onChange={(e) => handleOptionSelect('duration', e.target.value)}
                >
                  {serviceTypes.PHOTO.options.durations.map((duration) => (
                    <MenuItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Package</InputLabel>
                <Select
                  value={selectedOptions.package || ''}
                  label="Package"
                  onChange={(e) => handleOptionSelect('package', e.target.value)}
                >
                  {serviceTypes.PHOTO.options.packages.map((pkg) => (
                    <MenuItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'design':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: modernTheme.darkText }}>
                Select Design Service
              </FormLabel>
              <RadioGroup
                value={selectedOptions.designType || ''}
                onChange={(e) => handleOptionSelect('designType', e.target.value)}
              >
                <Grid container spacing={2}>
                  {serviceTypes.DESIGN.options.designTypes.map((type) => (
                    <Grid item xs={12} md={6} key={type.value}>
                      <Card
                        sx={{
                          p: 2,
                          border: selectedOptions.designType === type.value ? 
                            `2px solid ${modernTheme.accent}` : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: modernTheme.accent,
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleOptionSelect('designType', type.value)}
                      >
                        <FormControlLabel
                          value={type.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {type.description}
                              </Typography>
                              <Typography variant="body2" color={modernTheme.accent} fontWeight={600}>
                                Starting from ${type.price}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Complexity Level</InputLabel>
                <Select
                  value={selectedOptions.complexity || ''}
                  label="Complexity Level"
                  onChange={(e) => handleOptionSelect('complexity', e.target.value)}
                >
                  {serviceTypes.DESIGN.options.complexity.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Revisions</InputLabel>
                <Select
                  value={selectedOptions.revisions || ''}
                  label="Revisions"
                  onChange={(e) => handleOptionSelect('revisions', e.target.value)}
                >
                  {serviceTypes.DESIGN.options.revisions.map((rev) => (
                    <MenuItem key={rev.value} value={rev.value}>
                      {rev.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const renderInputMethodSection = () => {
    if (!selectedService) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          How would you like to provide project details?
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={inputMethod} 
            onChange={(e, newValue) => setInputMethod(newValue)}
            centered
          >
            <Tab 
              icon={<Image />} 
              iconPosition="start"
              label="Upload Files" 
              value="upload" 
              sx={{ fontWeight: 600 }}
            />
            <Tab 
              icon={<Description />} 
              iconPosition="start"
              label="Describe Project" 
              value="describe" 
              sx={{ fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                border: inputMethod === 'upload' ? `2px solid ${modernTheme.primary}` : '1px solid #e2e8f0',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                opacity: inputMethod === 'upload' ? 1 : 0.7
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <Image sx={{ mr: 1 }} /> Upload Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your photos, designs, or reference files
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
                  p: 3,
                  border: `2px dashed ${isDragActive ? modernTheme.primary : '#cbd5e1'}`,
                  backgroundColor: isDragActive ? `${modernTheme.primary}15` : modernTheme.neutral,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: modernTheme.primary,
                    backgroundColor: `${modernTheme.primary}08`
                  }
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: modernTheme.primary, mb: 2 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Supported formats: JPEG, PNG, PDF, AI, EPS (up to 20MB each)
                </Typography>
              </Box>

              {files.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Files ({files.length})
                  </Typography>
                  <Grid container spacing={1}>
                    {files.map((file) => (
                      <Grid item xs={6} key={file.id}>
                        <Card
                          sx={{
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="80"
                            image={file.preview}
                            alt={file.name}
                            onLoad={() => URL.revokeObjectURL(file.preview)}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeFile(file.id)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Description Section */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                border: inputMethod === 'describe' ? `2px solid ${modernTheme.primary}` : '1px solid #e2e8f0',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                opacity: inputMethod === 'describe' ? 1 : 0.7
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                <Description sx={{ mr: 1 }} /> Describe Your Project
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tell us about your project requirements and vision
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder={`Describe your ${selectedService.name.toLowerCase()} project in detail...\n\n• What are your specific requirements?\n• What style or theme are you looking for?\n• Any specific colors, fonts, or elements?\n• What is the intended use?`}
                value={orderDetails.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    alignItems: 'flex-start'
                  }
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              background: modernTheme.gradient,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            Place Your Order
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.2rem'
            }}
          >
            {selectedService ? `Configure your ${selectedService.name.toLowerCase()} order` : 'Select a service to get started'}
          </Typography>
        </motion.div>
      </Box>

      <ServiceSelectorDialog />

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${modernTheme.neutral} 0%, #ffffff 100%)`,
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: modernTheme.success, mb: 3 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Order Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your {selectedService?.name} order. We'll contact you within 24 hours.
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: modernTheme.primary }}>
              Order Total: ${calculatePrice().toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={resetOrder}
              sx={{ px: 4, borderRadius: 3 }}
            >
              Place Another Order
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Box>
          {/* Service Selection Chip - Only show if service is selected */}
          {selectedService && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Chip
                icon={selectedService.icon}
                label={selectedService.name}
                onClick={() => setShowServiceSelector(true)}
                sx={{
                  px: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: selectedService.gradient,
                  color: 'white',
                  '&:hover': { background: selectedService.gradient, transform: 'translateY(-2px)' }
                }}
              />
            </Box>
          )}

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
              background: `linear-gradient(135deg, ${modernTheme.neutral} 0%, #ffffff 100%)`,
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                    Select Your Service
                  </Typography>
                  
                  {!selectedService && (
                    <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
                      Please select a service category to continue with your order.
                    </Alert>
                  )}
                  
                  <Grid container spacing={4} sx={{ mb: 4 }}>
                    {Object.values(serviceTypes).map((service) => (
                      <Grid item xs={12} md={4} key={service.id}>
                        <Card 
                          sx={{ 
                            textAlign: 'center',
                            p: 4,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: selectedService?.id === service.id ? `3px solid ${service.gradient}` : '1px solid #e2e8f0',
                            background: selectedService?.id === service.id ? `${service.gradient}15` : 'white',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                            }
                          }}
                          onClick={() => handleServiceSelect(service)}
                        >
                          <Avatar sx={{ 
                            width: 80, 
                            height: 80, 
                            mx: 'auto', 
                            mb: 3,
                            background: service.gradient 
                          }}>
                            {service.icon}
                          </Avatar>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            {service.name}
                          </Typography>
                          <Button 
                            variant="contained"
                            sx={{
                              background: service.gradient,
                              borderRadius: 3
                            }}
                          >
                            {selectedService?.id === service.id ? 'Selected' : 'Select Service'}
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      disabled={!selectedService}
                      sx={{ px: 6, borderRadius: 3 }}
                    >
                      Continue to Details
                    </Button>
                  </Box>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Configure Your {selectedService?.name}
                  </Typography>

                  {renderServiceOptions()}
                  {renderInputMethodSection()}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button onClick={handleBack} startIcon={<ArrowBack />}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                      sx={{ borderRadius: 3, px: 4 }}
                    >
                      Continue to Review
                    </Button>
                  </Box>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Review Your Order
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Contact Information
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={orderDetails.customerName}
                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={orderDetails.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={orderDetails.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address"
                            multiline
                            rows={2}
                            value={orderDetails.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            sx={{ mb: 3 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Special Instructions"
                            multiline
                            rows={3}
                            value={orderDetails.specialInstructions}
                            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Paper
                        sx={{
                          p: 3,
                          background: modernTheme.neutral,
                          borderRadius: 3,
                          position: 'sticky',
                          top: 20
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Order Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <List>
                          <ListItem>
                            <ListItemIcon>
                              {selectedService?.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary="Service" 
                              secondary={selectedService?.name}
                            />
                          </ListItem>
                          
                          {selectedOptions.printingType && (
                            <ListItem>
                              <ListItemText 
                                primary="Printing Type" 
                                secondary={serviceTypes.PRINTING.options.printingTypes.find(
                                  p => p.value === selectedOptions.printingType
                                )?.label}
                              />
                            </ListItem>
                          )}
                          
                          {selectedOptions.photoType && (
                            <ListItem>
                              <ListItemText 
                                primary="Photo Service" 
                                secondary={serviceTypes.PHOTO.options.photoTypes.find(
                                  p => p.value === selectedOptions.photoType
                                )?.label}
                              />
                            </ListItem>
                          )}
                          
                          {selectedOptions.designType && (
                            <ListItem>
                              <ListItemText 
                                primary="Design Service" 
                                secondary={serviceTypes.DESIGN.options.designTypes.find(
                                  d => d.value === selectedOptions.designType
                                )?.label}
                              />
                            </ListItem>
                          )}
                          
                          <ListItem>
                            <ListItemText 
                              primary="Input Method" 
                              secondary={inputMethod === 'upload' ? 
                                `${files.length} file${files.length !== 1 ? 's' : ''} uploaded` : 
                                'Project description provided'
                              }
                            />
                          </ListItem>
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color={modernTheme.primary} sx={{ fontWeight: 700 }}>
                            ${calculatePrice().toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total amount due
                          </Typography>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={handleSubmit}
                          disabled={!isStepComplete()}
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            mt: 2,
                            background: modernTheme.gradient,
                            fontWeight: 600
                          }}
                        >
                          Complete Order
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button onClick={handleBack} startIcon={<ArrowBack />}>
                      Back
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Order;