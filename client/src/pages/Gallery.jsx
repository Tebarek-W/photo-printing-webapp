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
    img: 'https://images.unsplash.com/icon-1504198453319-5ce911bafcde',
    title: 'Mountain Majesty',
    category: 'Landscape',
    description: 'Breathtaking mountain view during golden hour with perfect lighting.',
    photographer: 'Jane Smith',
    price: 59.99
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/icon-1554080353-a576cf803bda',
    title: 'Natural Portrait',
    category: 'Portrait',
    description: 'Authentic portrait photography with natural lighting and emotional depth.',
    photographer: 'Alex Johnson',
    price: 39.99
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/icon-1502082553048-f009c37129b9',
    title: 'Forest Pathway',
    category: 'Nature',
    description: 'Serene forest pathway captured with beautiful bokeh effect.',
    photographer: 'Michael Brown',
    price: 45.99
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/icon-1516483638261-f4dbaf036963',
    title: 'Italian Architecture',
    category: 'Architecture',
    description: 'Historic Italian architecture photographed with perfect symmetry.',
    photographer: 'Sarah Williams',
    price: 54.99
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/icon-1526662092590-e314cbeaf8da',
    title: 'Professional Headshot',
    category: 'Portrait',
    description: 'Corporate headshot with professional lighting and composition.',
    photographer: 'David Wilson',
    price: 42.99
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/icon-1472214103451-9374bd1c798e',
    title: 'Coastal Cliffs',
    category: 'Landscape',
    description: 'Dramatic coastal cliffs with crashing waves and golden sunset.',
    photographer: 'Emily Davis',
    price: 62.99
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/icon-1433086966358-54859d0ed716',
    title: 'Forest Waterfall',
    category: 'Nature',
    description: 'Majestic waterfall in the forest with long exposure technique.',
    photographer: 'Robert Miller',
    price: 57.99
  },
  {
    id: 9,
    img: 'https://images.unsplash.com/icon-1501594907352-04cda38ebc29',
    title: 'Wine Photography',
    category: 'Product',
    description: 'Elegant product photography for premium wine branding.',
    photographer: 'Jessica Taylor',
    price: 47.99
  },
  {
    id: 10,
    img: 'https://images.unsplash.com/icon-1518837695005-2083093ee35b',
    title: 'Musical Atmosphere',
    category: 'Event',
    description: 'Live music event photography capturing the energy and emotion.',
    photographer: 'Thomas Anderson',
    price: 52.99
  },
  {
    id: 11,
    img: 'https://images.unsplash.com/icon-1418065460487-3e41a6c84dc5',
    title: 'Mountain Cabin',
    category: 'Landscape',
    description: 'Cozy mountain cabin surrounded by autumn foliage.',
    photographer: 'Olivia Martin',
    price: 49.99
  },
  {
    id: 12,
    img: 'https://images.unsplash.com/icon-1470071459604-3b5ec3a7fe05',
    title: 'Misty Landscape',
    category: 'Nature',
    description: 'Atmospheric misty landscape with dramatic lighting.',
    photographer: 'Christopher Lee',
    price: 55.99
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
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

  // Handle redirect to order page
  const handleOrderRedirect = () => {
    if (selectedImage) {
      // Close the modal first
      handleCloseModal();
      
      // Navigate to order page with the selected image as state
      navigate('/order', { 
        state: { 
          selectedImage: selectedImage,
          fromGallery: true
        } 
      });
    }
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
            handleOrderRedirect();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleCloseModal, handleNext, handlePrev, handleOrderRedirect]);

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
                  handleOrderRedirect();
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
                    handleOrderRedirect();
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

      {/* Snackbar for notifications */}
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