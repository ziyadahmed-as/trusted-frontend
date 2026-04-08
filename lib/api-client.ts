
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  async login(credentials: any) {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.access);
      localStorage.setItem('refresh', result.refresh);
    }
    return result;
  },

  async register(data: any) {
    const response = await fetch(`${API_URL}/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw { errors: result };
    return result;
  },

  async getAdminStats() {
    const response = await fetch(`${API_URL}/users/admin-stats/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getAdminKYCs(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/kyc/admin/?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch KYCs');
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
    const response = await fetch(`${API_URL}/users/users/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // --- User KYC Methods ---
  async getKYCRequirements() {
    const response = await fetch(`${API_URL}/kyc/requirements/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch requirements');
    return response.json();
  },

  async getKYCStatus() {
    const response = await fetch(`${API_URL}/kyc/status/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch KYC status');
    return response.json();
  },

  async submitKYC(formData: FormData) {
    const response = await fetch(`${API_URL}/kyc/submit/`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // Note: Content-Type is NOT set here so the browser can set it to multipart/form-data with the correct boundary
      },
      body: formData
    });
    return response.json();
  },

  async getMe() {
    const response = await fetch(`${API_URL}/users/users/me/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
};
