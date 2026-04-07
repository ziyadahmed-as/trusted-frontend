
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = {
  async register(data: any) {
    try {
      const response = await fetch(`${API_URL}/register/`, {
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
};
