const API_BASE_URL = 'http://localhost:5000/api';

// Order service for handling order operations
export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },

  // Get orders for current user
  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Get all orders (admin only)
  getAllOrders: async (page = 1, limit = 50, status = '') => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_BASE_URL}/orders?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  // Update order (admin only)
  updateOrder: async (id, orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },

  // Delete order (admin only)
  deleteOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Upload order files
  uploadFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/orders/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return await response.json();
  }
};