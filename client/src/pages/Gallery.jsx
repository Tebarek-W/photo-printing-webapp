import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  Print,
  AddShoppingCart
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample photography images from Unsplash
const galleryImages = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    title: 'Urban Landscape',
    category: 'Urban',
    description: 'Stunning cityscape photography capturing the essence of modern architecture.',
    photographer: 'John Doe',
    price: 49.99
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
    title: 'Mountain Majesty',
    category: 'Landscape',
    description: 'Breathtaking mountain view during golden hour with perfect lighting.',
    photographer: 'Jane Smith',
    price: 59.99
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1554080353-a576cf803bda',
    title: 'Natural Portrait',
    category: 'Portrait',
    description: 'Authentic portrait photography with natural lighting and emotional depth.',
    photographer: 'Alex Johnson',
    price: 39.99
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    title: 'Forest Pathway',
    category: 'Nature',
    description: 'Serene forest pathway captured with beautiful bokeh effect.',
    photographer: 'Michael Brown',
    price: 45.99
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    title: 'Italian Architecture',
    category: 'Architecture',
    description: 'Historic Italian architecture photographed with perfect symmetry.',
    photographer: 'Sarah Williams',
    price: 54.99
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1526662092590-e314cbeaf8da',
    title: 'Professional Headshot',
    category: 'Portrait',
    description: 'Corporate headshot with professional lighting and composition.',
    photographer: 'David Wilson',
    price: 42.99
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    title: 'Coastal Cliffs',
    category: 'Landscape',
    description: 'Dramatic coastal cliffs with crashing waves and golden sunset.',
    photographer: 'Emily Davis',
    price: 62.99
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    title: 'Forest Waterfall',
    category: 'Nature',
    description: 'Majestic waterfall in the forest with long exposure technique.',
    photographer: 'Robert Miller',
    price: 57.99
  },
  {
    id: 9,
    img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    title: 'Wine Photography',
    category: 'Product',
    description: 'Elegant product photography for premium wine branding.',
    photographer: 'Jessica Taylor',
    price: 47.99
  },
  {
    id: 10,
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    title: 'Musical Atmosphere',
    category: 'Event',
    description: 'Live music event photography capturing the energy and emotion.',
    photographer: 'Thomas Anderson',
    price: 52.99
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5',
    title: 'Mountain Cabin',
    category: 'Landscape',
    description: 'Cozy mountain cabin surrounded by autumn foliage.',
    photographer: 'Olivia Martin',
    price: 49.99
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    title: 'Misty Landscape',
    category: 'Nature',
    description: 'Atmospheric misty landscape with dramatic lighting.',
    photographer: 'Christopher Lee',
    price: 55.99
  }
];

// Print options
const printSizes = [
  { value: '4x6', label: '4x6 inches', priceMultiplier: 1 },
  { value: '5x7', label: '5x7 inches', priceMultiplier: 1.5 },
  { value: '8x10', label: '8x10 inches', priceMultiplier: 2 },
  { value: '11x14', label: '11x14 inches', priceMultiplier: 3 },
  { value: '16x20', label: '16x20 inches', priceMultiplier: 4 }
];

const paperTypes = [
  { value: 'glossy', label: 'Glossy Photo Paper' },
  { value: 'matte', label: 'Matte Photo Paper' },
  { value: 'premium', label: 'Premium Lustre' },
  { value: 'canvas', label: 'Canvas' }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderOptions, setOrderOptions] = useState({
    size: '8x10',
    paperType: 'glossy',
    quantity: 1,
    message: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  // Get unique categories
  const categories = ['All', ...new Set(galleryImages.map(image => image.category))];

  // Filter images by category
  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === activeCategory);

  // Calculate column count based on screen size
  const getColumnCount = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  // Handle image selection
  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(galleryImages.findIndex(img => img.id === image.id));
  };

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    setIsFullscreen(false);
  }, []);

  // Navigate to next image
  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  }, [currentIndex]);

  // Navigate to previous image
  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  }, [currentIndex]);

  // Open order dialog
  const handleOpenOrderDialog = () => {
    setOrderDialogOpen(true);
  };

  // Close order dialog
  const handleCloseOrderDialog = () => {
    setOrderDialogOpen(false);
  };

  // Handle order option changes
  const handleOrderOptionChange = (field, value) => {
    setOrderOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedImage) return 0;
    const sizeMultiplier = printSizes.find(size => size.value === orderOptions.size)?.priceMultiplier || 1;
    return (selectedImage.price * sizeMultiplier * orderOptions.quantity).toFixed(2);
  };

  // Handle order submission
  const handleOrderSubmit = () => {
    // In a real app, this would send the order to your backend
    setSnackbarMessage(`Order placed for "${selectedImage.title}"! We'll contact you soon.`);
    setSnackbarOpen(true);
    setOrderDialogOpen(false);
    
    // Alternatively, navigate to order page with pre-filled data
    // navigate('/order', { state: { image: selectedImage, options: orderOptions } });
  };

  // Handle quick order (direct to order page)
  const handleQuickOrder = () => {
    navigate('/order', { state: { image: selectedImage } });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'o':
        case 'O':
          if (selectedImage) {
            handleOpenOrderDialog();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleCloseModal, handleNext, handlePrev]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle image load
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          Photography Portfolio
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
          Explore our professional photography work. Click any image to view details and order prints.
        </Typography>

        {/* Category Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mb: 4 }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => setActiveCategory(category)}
              color={activeCategory === category ? 'primary' : 'default'}
              variant={activeCategory === category ? 'filled' : 'outlined'}
              sx={{ 
                mb: 1,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Masonry Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)`,
          gap: 2,
          mb: 4
        }}
      >
        {filteredImages.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover .gallery-image': {
                  transform: 'scale(1.05)'
                },
                '&:hover .image-overlay': {
                  opacity: 1
                }
              }}
              onClick={() => handleImageClick(item, index)}
            >
              {!loadedImages[item.id] && (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={Math.floor(Math.random() * 100) + 200} 
                  sx={{ borderRadius: 2 }}
                />
              )}
              <Box
                component="img"
                className="gallery-image"
                src={`${item.img}?auto=format&fit=crop&w=500`}
                alt={item.title}
                loading="lazy"
                onLoad={() => handleImageLoad(item.id)}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: loadedImages[item.id] ? 'block' : 'none',
                  transition: 'transform 0.5s ease',
                  borderRadius: 2
                }}
              />
              <Box
                className="image-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 2,
                  color: 'white'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Chip 
                  label={item.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 24
                  }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ZoomIn sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption">Click to view & order</Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Empty state if no images in category */}
      {filteredImages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            No images in this category yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Check back soon for new additions to our {activeCategory} portfolio
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setActiveCategory('All')}
          >
            View All Photos
          </Button>
        </Box>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                p: isMobile ? 1 : 4
              }}
              onClick={handleCloseModal}
            >
              {/* Navigation Buttons */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                sx={{
                  position: 'fixed',
                  left: isMobile ? 10 : 24,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                aria-label="Previous image"
              >
                <NavigateBefore />
              </IconButton>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{
                  position: 'fixed',
                  right: isMobile ? 10 : 24,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                aria-label="Next image"
              >
                <NavigateNext />
              </IconButton>

              {/* Close Button */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'fixed',
                  top: isMobile ? 10 : 24,
                  right: isMobile ? 10 : 24,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                aria-label="Close image viewer"
              >
                <Close />
              </IconButton>

              {/* Fullscreen Toggle */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                sx={{
                  position: 'fixed',
                  top: isMobile ? 10 : 24,
                  right: isMobile ? 60 : 80,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }
                }}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>

              {/* Order Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenOrderDialog();
                }}
                sx={{
                  position: 'fixed',
                  top: isMobile ? 10 : 24,
                  right: isMobile ? 110 : 130,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
                aria-label="Order this photo"
              >
                <AddShoppingCart />
              </IconButton>

              {/* Image with zoom animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <Box
                  component="img"
                  src={`${selectedImage.img}?auto=format&fit=crop&w=1200`}
                  alt={selectedImage.title}
                  sx={{
                    maxHeight: '90vh',
                    maxWidth: '90vw',
                    borderRadius: 1,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
              </motion.div>

              {/* Image Info */}
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  position: 'fixed',
                  bottom: isMobile ? 10 : 24,
                  left: isMobile ? 10 : 24,
                  right: isMobile ? 10 : 24,
                  color: 'white',
                  textAlign: 'center',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  {selectedImage.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={selectedImage.category} 
                    sx={{ 
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }} 
                  />
                  <Chip 
                    label={`By ${selectedImage.photographer}`} 
                    variant="outlined"
                    sx={{ color: 'white' }} 
                  />
                  <Chip 
                    label={`$${selectedImage.price}`} 
                    sx={{ 
                      backgroundColor: 'success.main',
                      color: 'white'
                    }} 
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Print />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOrderDialog();
                  }}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  Order Print
                </Button>
              </Box>

              {/* Image Counter */}
              <Typography
                variant="body2"
                sx={{
                  position: 'fixed',
                  top: isMobile ? 10 : 24,
                  left: isMobile ? 10 : 24,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                {currentIndex + 1} / {galleryImages.length}
              </Typography>

              {/* Quick Order Tip */}
              <Typography
                variant="caption"
                sx={{
                  position: 'fixed',
                  top: isMobile ? 50 : 64,
                  left: isMobile ? 10 : 24,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  opacity: 0.7
                }}
              >
                Press 'O' to order this photo
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Dialog */}
      <Dialog 
        open={orderDialogOpen} 
        onClose={handleCloseOrderDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Order Print: {selectedImage?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              select
              label="Print Size"
              value={orderOptions.size}
              onChange={(e) => handleOrderOptionChange('size', e.target.value)}
              fullWidth
            >
              {printSizes.map((size) => (
                <MenuItem key={size.value} value={size.value}>
                  {size.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Paper Type"
              value={orderOptions.paperType}
              onChange={(e) => handleOrderOptionChange('paperType', e.target.value)}
              fullWidth
            >
              {paperTypes.map((paper) => (
                <MenuItem key={paper.value} value={paper.value}>
                  {paper.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="Quantity"
              value={orderOptions.quantity}
              onChange={(e) => handleOrderOptionChange('quantity', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 100 }}
              fullWidth
            />

            <TextField
              label="Special Instructions (Optional)"
              multiline
              rows={3}
              value={orderOptions.message}
              onChange={(e) => handleOrderOptionChange('message', e.target.value)}
              fullWidth
            />

            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body2">
                Print: {selectedImage?.title}
              </Typography>
              <Typography variant="body2">
                Size: {printSizes.find(s => s.value === orderOptions.size)?.label}
              </Typography>
              <Typography variant="body2">
                Paper: {paperTypes.find(p => p.value === orderOptions.paperType)?.label}
              </Typography>
              <Typography variant="body2">
                Quantity: {orderOptions.quantity}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                Total: ${calculateTotalPrice()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleOrderSubmit} 
            variant="contained"
            startIcon={<AddShoppingCart />}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for order confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Gallery;