
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
// In dev, we use the absolute URL to avoid potential issues with Next.js rewrites and trailing slashes.
console.log('API_URL:', API_URL);

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
    const response = await fetch(`${API_URL}/kyc/me/requirements/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch requirements');
    return response.json();
  },

  async getKYCStatus() {
    const response = await fetch(`${API_URL}/kyc/me/status/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch KYC status');
    return response.json();
  },

  async submitKYC(formData: FormData) {
    const response = await fetch(`${API_URL}/kyc/me/submit/`, {
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
  },

  // --- Product Methods ---
  async getPublicProducts(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products/catalog/?${query}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: string) {
    const response = await fetch(`${API_URL}/products/catalog/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async getProducts() {
    const response = await fetch(`${API_URL}/products/catalog/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async createProduct(data: any) {
    const response = await fetch(`${API_URL}/products/catalog/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw { errors: result };
    return result;
  },

  async updateProduct(id: string, data: any) {
    const response = await fetch(`${API_URL}/products/catalog/${id}/`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw { errors: result };
    return result;
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_URL}/products/catalog/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/products/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // --- Vendor Profile Methods ---
  async getVendorProfile() {
    const response = await fetch(`${API_URL}/users/vendor-profile/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch vendor profile');
    return response.json();
  },

  async updateVendorProfile(data: any) {
    const response = await fetch(`${API_URL}/users/vendor-profile/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
