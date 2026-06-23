import api from '../lib/api';

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) { 
    return null; 
  }
}

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = parseJwt(token);
    if (!decoded) return null;
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.email,
      role: decoded.role,
    };
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  async checkStatus() {
    return api.get('/status');
  }
};
