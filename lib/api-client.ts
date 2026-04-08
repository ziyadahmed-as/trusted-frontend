
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  async register(data: any) {
    try {
      const response = await fetch(`${API_URL}/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw { errors: result, status: response.status };
      }
      return result;
    } catch (err: any) {
      if (err.errors) throw err;
      // Network error (Failed to fetch)
      console.error('Network Error in apiClient.register:', err);
      throw { errors: { server: ['The backend server is unreachable. Check your connection or CORS settings.'] }, status: 500 };
    }
  },

  async getAdminKYCs(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/kyc/admin/?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  async approveKYC(id: string, comments: string = '') {
    const response = await fetch(`${API_URL}/kyc/admin/${id}/approve/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ comments })
    });
    return response.json();
  },

  async rejectKYC(id: string, reason: string, comments: string = '') {
    const response = await fetch(`${API_URL}/kyc/admin/${id}/reject/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ reason, comments })
    });
    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/users/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  }
};
