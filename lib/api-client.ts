const API_URL = 'http://127.0.0.1:8000/api';
console.log('[API Client] Initialized with:', API_URL);

export const apiClient = {
  getCurrentApiUrl() {
    return API_URL;
  },
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) throw new Error('Authentication required. Please login.');
    
    const response = await fetch(`${API_URL}/users/admin-stats/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        console.error(`[API Client] Stats failed with status: ${response.status}`);
        if (response.status === 401) throw new Error('Session expired. Please login again.');
        throw new Error(`Failed to fetch stats (Status: ${response.status})`);
    }
    return response.json();
  },

  async auditKYC() {
    const response = await fetch(`${API_URL}/users/admin/audit-kyc/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Global KYC Audit failed');
    return response.json();
  },

  async syncInventory() {
    const response = await fetch(`${API_URL}/users/admin/sync-inventory/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Inventory Sync failed');
    return response.json();
  },

  async getPlatformHealth() {
    const response = await fetch(`${API_URL}/users/admin/health/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },

  async getAdminKYCs(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/kyc/admin/?${searchParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin KYCs');
    return response.json();
  },

  async getAdminUserList(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_URL}/kyc/admin/users/?${searchParams}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user management list');
    return response.json();
  },

  async getAdminUserKYCDetail(userId: string) {
    const response = await fetch(`${API_URL}/kyc/admin/${userId}/user-profile/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user kyc profile');
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

  async postProductReview(data: any) {
    const response = await fetch(`${API_URL}/products/reviews/`, {
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

  // --- Order & Cart Methods ---
  async syncCart(items: any[]) {
    // 1. Clear existing cart
    await fetch(`${API_URL}/orders/cart/clear/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    // 2. Add items one by one (or batch if the API allowed, but here we add sequentially)
    for (const item of items) {
      await fetch(`${API_URL}/orders/cart/add_item/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          product_id: item.id,
          quantity: item.quantity,
          variant_id: item.variant_id || null
        })
      });
    }
    return true;
  },

  async checkoutOrder(data: any = {}) {
    const response = await fetch(`${API_URL}/orders/order/checkout/`, {
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

  async getOrders() {
    const response = await fetch(`${API_URL}/orders/order/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getOrder(id: string) {
    const response = await fetch(`${API_URL}/orders/order/${id}/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async getVendorOrders() {
    const response = await fetch(`${API_URL}/orders/order/vendor_orders/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch vendor orders');
    return response.json();
  },

  async getVendorStats() {
    const response = await fetch(`${API_URL}/orders/order/vendor_stats/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch vendor stats');
    return response.json();
  },

  async updateOrderStatus(orderId: string, status: string) {
    const response = await fetch(`${API_URL}/orders/order/${orderId}/update_status/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    if (!response.ok) throw { errors: result };
    return result;
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
  },

  // --- Finance & Payout Methods ---
  async getWalletSummary() {
    const response = await fetch(`${API_URL}/finance/wallet-summary/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch wallet summary');
    return response.json();
  },

  async getPayoutMethods() {
    const response = await fetch(`${API_URL}/finance/payout-methods/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch payout methods');
    return response.json();
  },

  async addPayoutMethod(data: any) {
    const response = await fetch(`${API_URL}/finance/payout-methods/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getTransactions() {
    const response = await fetch(`${API_URL}/finance/transactions/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async getPayouts() {
    const response = await fetch(`${API_URL}/finance/payouts/`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch payouts');
    return response.json();
  },

  async requestPayout(amount: number) {
    const response = await fetch(`${API_URL}/finance/payouts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount })
    });
    const result = await response.json();
    if (!response.ok) throw { errors: result };
    return result;
  }
};
