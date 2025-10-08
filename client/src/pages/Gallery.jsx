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
  Alert,
  Grid,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress
} from '@mui/material';
import {
  Close,
  NavigateBefore,
  NavigateNext,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  Print,
  AddShoppingCart,
  Search,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [stats, setStats] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  // Load gallery items
  const loadGalleryItems = async (page = 1, category = activeCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 12);
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`http://localhost:5000/api/gallery?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setGalleryItems(data.data);
        setPagination(data.pagination);
        setCategories(data.categories);
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to load gallery items');
      }
    } catch (error) {
      console.error('Failed to load gallery items:', error);
      setError('Failed to load gallery items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    loadGalleryItems();
    loadCategories();
  }, []);

  // Calculate column count based on screen size
  const getColumnCount = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  // Handle image selection
  const handleImageClick = (item, index) => {
    setSelectedImage(item);
    setCurrentIndex(galleryItems.findIndex(img => img._id === item._id));
  };

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    setIsFullscreen(false);
  }, []);

  // Navigate to next image
  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryItems[nextIndex]);
  }, [currentIndex, galleryItems]);

  // Navigate to previous image
  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryItems[prevIndex]);
  }, [currentIndex, galleryItems]);

  // Handle redirect to order page
  const handleOrderRedirect = () => {
    if (selectedImage) {
      handleCloseModal();
      navigate('/order', { 
        state: { 
          selectedImage: selectedImage,
          fromGallery: true
        } 
      });
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    loadGalleryItems(1, category, searchTerm);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    loadGalleryItems(1, activeCategory, value);
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    loadGalleryItems(page, activeCategory, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
          Explore our professional photography work. {stats.total} stunning images available.
        </Typography>

        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TextField
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            sx={{ minWidth: 250 }}
            size="small"
          />
          
          <TextField
            select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <Button
            startIcon={<Refresh />}
            onClick={() => loadGalleryItems()}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip 
            label={`${stats.total || 0} Total Images`} 
            variant="outlined" 
            color="primary" 
          />
          <Chip 
            label={`${stats.featured || 0} Featured`} 
            variant="outlined" 
            color="secondary" 
          />
          {stats.byCategory?.map(stat => (
            <Chip 
              key={stat._id}
              label={`${stat.count} ${stat._id}`} 
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)`,
              gap: 2,
              mb: 4
            }}
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={item._id}
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
                  {!loadedImages[item._id] && (
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
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    onLoad={() => handleImageLoad(item._id)}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: loadedImages[item._id] ? 'block' : 'none',
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
                        height: 24,
                        mb: 1
                      }} 
                    />
                    {item.featured && (
                      <Chip 
                        label="Featured" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'secondary.main',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }} 
                      />
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                      <Typography variant="caption">
                        ${item.pricing?.digital || 0}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ZoomIn sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">View & Order</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}

          {/* Empty state */}
          {galleryItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom>
                No images found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || activeCategory !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'No images available in the gallery yet'
                }
              </Typography>
              {(searchTerm || activeCategory !== 'All') && (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                    loadGalleryItems(1, 'All', '');
                  }}
                >
                  View All Photos
                </Button>
              )}
            </Box>
          )}
        </>
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
                  src={selectedImage.imageUrl}
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
                
                {/* Specifications */}
                {selectedImage.specifications && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {selectedImage.specifications.camera && (
                      <Chip 
                        label={selectedImage.specifications.camera} 
                        size="small"
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }} 
                      />
                    )}
                    {selectedImage.specifications.lens && (
                      <Chip 
                        label={selectedImage.specifications.lens} 
                        size="small"
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }} 
                      />
                    )}
                    {selectedImage.specifications.location && (
                      <Chip 
                        label={selectedImage.specifications.location} 
                        size="small"
                        sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }} 
                      />
                    )}
                  </Box>
                )}

                {/* Pricing and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={selectedImage.category} 
                    sx={{ 
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }} 
                  />
                  <Chip 
                    label={`Digital: $${selectedImage.pricing?.digital || 0}`} 
                    sx={{ 
                      backgroundColor: 'success.main',
                      color: 'white'
                    }} 
                  />
                  {selectedImage.featured && (
                    <Chip 
                      label="Featured" 
                      sx={{ 
                        backgroundColor: 'secondary.main',
                        color: 'white'
                      }} 
                    />
                  )}
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
                {currentIndex + 1} / {galleryItems.length}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Gallery;