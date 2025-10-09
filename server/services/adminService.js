const API_BASE_URL = 'http://localhost:5000/api';

// Admin service for dashboard statistics and management
export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/activities?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period = 'monthly') => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/revenue?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }
};