import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor (auto-attach token) ──────────────────
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (handle 401 globally) ────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired or invalid — clear auth state
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        // Don't redirect here — let AuthContext handle it
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const register = async (
  email: string,
  password: string,
  role?: string,
  phoneNumber?: string
) => {
  const res = await API.post('/auth/register', { email, password, role, phoneNumber });
  return res.data.data;
};

export const login = async (email: string, password: string) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data.data;
};

export const getProfile = async (token: string) => {
  const res = await API.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ─── Password Reset ────────────────────────────────────────────
export const forgotPassword = async (method: 'email' | 'sms', contact: string) => {
  const res = await API.post('/auth/forgot-password', { method, contact });
  return res.data;
};

export const resetPassword = async (payload: {
  code?: string;
  token?: string;
  email?: string;
  newPassword: string;
}) => {
  const res = await API.post('/auth/reset-password', payload);
  return res.data;
};

// ─── Tasks ─────────────────────────────────────────────────────
export const getTasks = async (token: string) => {
  const res = await API.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const createTask = async (
  token: string,
  task: { title: string; description?: string }
) => {
  const res = await API.post('/tasks', task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const updateTask = async (
  token: string,
  id: string,
  task: { title?: string; description?: string; completed?: boolean }
) => {
  const res = await API.put(`/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const deleteTask = async (token: string, id: string) => {
  await API.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ─── Admin ─────────────────────────────────────────────────────
export const getAdminUsers = async (token: string) => {
  const res = await API.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteAdminUser = async (token: string, id: string) => {
  const res = await API.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAdminStats = async (token: string) => {
  const res = await API.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
