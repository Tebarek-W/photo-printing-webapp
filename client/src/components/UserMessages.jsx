import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Reply as ReplyIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const UserMessages = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserMessages();
  }, []);

  const loadUserMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🟡 Loading messages for user:', user?.id);
      
      const response = await fetch('http://localhost:5000/api/contact/user/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      console.log('🟡 API Response:', data);

      if (data.success) {
        setMessages(data.data);
        console.log('✅ Messages loaded:', data.data.length);
        
        // Log each message for debugging
        data.data.forEach(msg => {
          console.log(`📧 ${msg._id} | Replied: ${msg.replied} | AdminReply: ${msg.adminReply ? 'YES' : 'NO'}`);
        });
      } else {
        setError(data.message || 'Failed to load messages');
        console.error('❌ API Error:', data.message);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Failed to load your messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const getStatusColor = (status, replied) => {
    if (replied) return 'success';
    if (status === 'read') return 'info';
    return 'warning';
  };

  const getStatusText = (status, replied) => {
    if (replied) return 'Replied';
    if (status === 'read') return 'Read';
    return 'Pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            My Messages
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View your contact messages and responses from our team
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadUserMessages}
          variant="outlined"
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong> User ID: {user?.id} | Total Messages: {messages.length} | 
            Replied: {messages.filter(m => m.replied).length}
          </Typography>
        </Alert>
      )}

      {messages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmailIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Messages Yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            {user ? 
              "You haven't sent any messages to our team yet. Send your first message to get started!" : 
              "Please log in to view your messages."
            }
          </Typography>
          <Button variant="contained" href="/contact">
            Send Your First Message
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((message) => (
            <Card 
              key={message._id} 
              sx={{ 
                transition: 'all 0.3s ease',
                borderLeft: message.replied ? `4px solid ${theme.palette.success.main}` : 
                          message.status === 'read' ? `4px solid ${theme.palette.info.main}` : 
                          `4px solid ${theme.palette.warning.main}`,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {message.subject || 'General Inquiry'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Sent on {formatDate(message.createdAt)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {message.message}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, ml: 2 }}>
                    <Chip 
                      label={getStatusText(message.status, message.replied)} 
                      size="small" 
                      color={getStatusColor(message.status, message.replied)}
                    />
                    {message.replied && (
                      <Chip 
                        icon={<ReplyIcon />}
                        label="Response Available" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewMessage(message)}
                  >
                    View Details
                  </Button>
                  {message.replied && (
                    <Button
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      variant="outlined"
                      color="success"
                      onClick={() => handleViewMessage(message)}
                    >
                      View Response
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Message Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMessage?.subject || 'Message Details'}
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ mt: 2 }}>
              {/* Message Info */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Sent on {formatDate(selectedMessage.createdAt)}
                  </Typography>
                  <Chip 
                    label={getStatusText(selectedMessage.status, selectedMessage.replied)} 
                    color={getStatusColor(selectedMessage.status, selectedMessage.replied)}
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>Your Message</Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Box>

              {/* Admin Reply Section */}
              {selectedMessage.replied && selectedMessage.adminReply ? (
                <>
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ReplyIcon color="success" />
                      <Typography variant="h5" color="success.main">
                        Response from Josi Photo Printing
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {selectedMessage.repliedAt ? `Replied on ${formatDate(selectedMessage.repliedAt)}` : 'Replied recently'}
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'success.50', borderColor: 'success.light' }}>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedMessage.adminReply}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              ) : selectedMessage.replied && !selectedMessage.adminReply ? (
                <Box sx={{ textAlign: 'center', py: 3, backgroundColor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                        Response Status
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Our team has reviewed your message. Please check your email for our detailed response.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <TimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        Waiting for Response
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Our team will review your message and respond as soon as possible.
                        You'll see the response here once we've replied.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {!selectedMessage?.replied && (
                <Button 
                  variant="contained" 
                  href="/contact"
                >
                  Send New Message
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      );
    };

    export default UserMessages;