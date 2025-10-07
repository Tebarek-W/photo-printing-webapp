import API from './api'; // Your existing axios instance

export const contactService = {
  // Get all contact messages
  getMessages: async (page = 1, limit = 10, status = '') => {
    const params = { page, limit };
    if (status) params.status = status;
    
    const response = await API.get('/contact', { params });
    return response.data;
  },

  // Get single message
  getMessage: async (id) => {
    const response = await API.get(`/contact/${id}`);
    return response.data;
  },

  // Update message status
  updateStatus: async (id, status) => {
    const response = await API.put(`/contact/${id}/status`, { status });
    return response.data;
  },

  // Reply to message
  sendReply: async (id, replyMessage) => {
    const response = await API.post(`/contact/${id}/reply`, { replyMessage });
    return response.data;
  },

  // Delete message
  deleteMessage: async (id) => {
    const response = await API.delete(`/contact/${id}`);
    return response.data;
  }
};