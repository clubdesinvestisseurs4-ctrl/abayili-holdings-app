// Service API - Communique avec le backend sur Render
import axios from 'axios';
import { auth } from './firebase';

// URL du backend (Render)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Instance Axios configurée
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token Firebase
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== TRANSACTIONS ====================
export const TransactionAPI = {
  getAll: (companyId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/transactions/${companyId}?${params}`);
  },
  create: (data) => api.post('/transactions', data),
  updateStatus: (id, status) => api.put(`/transactions/${id}/status`, { status }),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// ==================== BUDGETS ====================
export const BudgetAPI = {
  getAll: (companyId) => api.get(`/budgets/${companyId}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  checkAlert: (companyId, category, type, amount) => 
    api.get(`/budgets/${companyId}/check?category=${encodeURIComponent(category)}&type=${type}&amount=${amount}`)
};

// ==================== OBJECTIVES ====================
export const ObjectiveAPI = {
  getAll: (companyId) => api.get(`/objectives/${companyId}`),
  getOne: (companyId, id) => api.get(`/objectives/${companyId}/${id}`),
  create: (data) => api.post('/objectives', data),
  update: (id, data) => api.put(`/objectives/${id}`, data),
  delete: (id) => api.delete(`/objectives/${id}`),
  
  // Étapes
  addStep: (objectiveId, data) => api.post(`/objectives/${objectiveId}/steps`, data),
  updateStep: (objectiveId, stepId, data) => api.put(`/objectives/${objectiveId}/steps/${stepId}`, data),
  updateStepStatus: (objectiveId, stepId, status) => 
    api.put(`/objectives/${objectiveId}/steps/${stepId}/status`, { status }),
  deleteStep: (objectiveId, stepId) => api.delete(`/objectives/${objectiveId}/steps/${stepId}`),
  
  // Compte-rendus
  addReport: (objectiveId, stepId, content, newStatus) => 
    api.post(`/objectives/${objectiveId}/steps/${stepId}/report`, { content, newStatus })
};

// ==================== USERS ====================
export const UserAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  updateRole: (uid, role, companies) => api.put(`/users/${uid}/role`, { role, companies })
};

// ==================== ANALYTICS ====================
export const AnalyticsAPI = {
  getMetrics: (companyId, period = 'month') => 
    api.get(`/analytics/${companyId}/metrics?period=${period}`),
  getChartData: (companyId, year) => 
    api.get(`/analytics/${companyId}/chart?year=${year}`)
};

// ==================== REPORTS ====================
export const ReportAPI = {
  upload: (companyId, file, type, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);
    formData.append('type', type);
    formData.append('description', description);
    return api.post('/upload/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAll: (companyId) => api.get(`/reports/${companyId}`)
};

// ==================== HEALTH CHECK ====================
export const healthCheck = () => api.get('/health');

export default api;
