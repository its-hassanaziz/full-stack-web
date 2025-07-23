import axios from 'axios';
import Cookies from 'js-cookie';
import { Game, ContactForm, GameForm } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('admin_token');
      localStorage.removeItem('admin_data');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const gameAPI = {
  getAll: () => api.get<Game[]>('/games'),
  getBySlug: (slug: string) => api.get<Game>(`/games/${slug}`),
  create: (formData: FormData) => api.post<Game>('/games', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: string, formData: FormData) => api.put<Game>(`/games/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: string) => api.delete(`/games/${id}`),
};

export const adminAPI = {
  login: (username: string, password: string) => 
    api.post('/admin/login', { username, password }),
  register: (username: string, password: string) => 
    api.post('/admin/register', { username, password }),
  resetPassword: (username: string, newPassword: string) => 
    api.post('/admin/reset-password', { username, newPassword }),
  getAll: () => api.get('/admin/list'),
};

export const contactAPI = {
  send: (data: ContactForm) => api.post('/contact', data),
};

export default api;