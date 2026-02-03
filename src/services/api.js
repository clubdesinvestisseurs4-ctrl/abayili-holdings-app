/**
 * Services API - Abayili Holdings
 * Avec support de navigation mensuelle
 */

import axios from 'axios';
import { getAuth } from 'firebase/auth';

// S'assurer que l'URL se termine par /api
const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  // Si l'URL ne se termine pas par /api, l'ajouter
  if (!baseUrl.endsWith('/api')) {
    return `${baseUrl}/api`;
  }
  return baseUrl;
};

const API_BASE_URL = getApiUrl();

// Instance Axios avec intercepteur pour le token
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Erreur récupération token:', error);
    }
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== TRANSACTIONS API ====================
export const TransactionAPI = {
  /**
   * Récupérer toutes les transactions d'une entreprise
   * @param {string} companyId - ID de l'entreprise
   * @param {Object} filters - Filtres optionnels
   * @param {string} filters.month - Mois au format YYYY-MM
   * @param {string} filters.type - Type de transaction (revenue/expense)
   * @param {string} filters.status - Statut de la transaction
   */
  getAll: (companyId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    return api.get(`/transactions/${companyId}${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Récupérer tous les mois avec transactions
   * @param {string} companyId - ID de l'entreprise
   */
  getAllMonths: (companyId) => api.get(`/transactions/${companyId}/all-months`),
  
  /**
   * Créer une nouvelle transaction
   * @param {Object} data - Données de la transaction
   */
  create: (data) => api.post('/transactions', data),
  
  /**
   * Mettre à jour le statut d'une transaction
   * @param {string} id - ID de la transaction
   * @param {string} status - Nouveau statut (validated/rejected)
   */
  updateStatus: (id, status) => api.put(`/transactions/${id}/status`, { status }),
  
  /**
   * Mettre à jour une transaction
   * @param {string} id - ID de la transaction
   * @param {Object} data - Données à mettre à jour
   */
  update: (id, data) => api.put(`/transactions/${id}`, data),
  
  /**
   * Supprimer une transaction
   * @param {string} id - ID de la transaction
   */
  delete: (id) => api.delete(`/transactions/${id}`),
};

// ==================== BUDGETS API ====================
export const BudgetAPI = {
  /**
   * Récupérer tous les budgets d'une entreprise pour un mois donné
   * @param {string} companyId - ID de l'entreprise
   * @param {string} month - Mois au format YYYY-MM (optionnel, défaut: mois courant)
   */
  getAll: (companyId, month = null) => {
    const params = month ? `?month=${month}` : '';
    return api.get(`/budgets/${companyId}${params}`);
  },
  
  /**
   * Récupérer tous les mois avec budgets
   * @param {string} companyId - ID de l'entreprise
   */
  getAllMonths: (companyId) => api.get(`/budgets/${companyId}/all-months`),
  
  /**
   * Vérifier les alertes de budget
   * @param {string} companyId - ID de l'entreprise
   * @param {Object} params - Paramètres de vérification
   */
  checkAlert: (companyId, params) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/budgets/${companyId}/check?${queryParams}`);
  },
  
  /**
   * Créer un nouveau budget
   * @param {Object} data - Données du budget (inclure month pour spécifier le mois)
   */
  create: (data) => api.post('/budgets', data),
  
  /**
   * Renouveler les budgets d'un mois vers un autre
   * @param {string} companyId - ID de l'entreprise
   * @param {string} sourceMonth - Mois source au format YYYY-MM
   * @param {string} targetMonth - Mois cible au format YYYY-MM
   */
  renew: (companyId, sourceMonth, targetMonth) => 
    api.post(`/budgets/${companyId}/renew`, { sourceMonth, targetMonth }),
  
  /**
   * Mettre à jour un budget
   * @param {string} id - ID du budget
   * @param {Object} data - Données à mettre à jour
   */
  update: (id, data) => api.put(`/budgets/${id}`, data),
  
  /**
   * Supprimer un budget
   * @param {string} id - ID du budget
   */
  delete: (id) => api.delete(`/budgets/${id}`),
};

// ==================== OBJECTIVES API ====================
export const ObjectiveAPI = {
  /**
   * Récupérer tous les objectifs d'une entreprise
   * @param {string} companyId - ID de l'entreprise
   */
  getAll: (companyId) => api.get(`/objectives/${companyId}`),
  
  /**
   * Récupérer un objectif par ID
   * @param {string} companyId - ID de l'entreprise
   * @param {string} id - ID de l'objectif
   */
  getOne: (companyId, id) => api.get(`/objectives/${companyId}/${id}`),
  
  /**
   * Créer un nouvel objectif
   * @param {Object} data - Données de l'objectif
   */
  create: (data) => api.post('/objectives', data),
  
  /**
   * Mettre à jour un objectif
   * @param {string} id - ID de l'objectif
   * @param {Object} data - Données à mettre à jour
   */
  update: (id, data) => api.put(`/objectives/${id}`, data),
  
  /**
   * Supprimer un objectif
   * @param {string} id - ID de l'objectif
   */
  delete: (id) => api.delete(`/objectives/${id}`),
  
  /**
   * Ajouter une étape à un objectif
   * @param {string} objectiveId - ID de l'objectif
   * @param {Object} data - Données de l'étape
   */
  addStep: (objectiveId, data) => api.post(`/objectives/${objectiveId}/steps`, data),
  
  /**
   * Mettre à jour une étape
   * @param {string} objectiveId - ID de l'objectif
   * @param {string} stepId - ID de l'étape
   * @param {Object} data - Données à mettre à jour
   */
  updateStep: (objectiveId, stepId, data) => 
    api.put(`/objectives/${objectiveId}/steps/${stepId}`, data),
  
  /**
   * Mettre à jour le statut d'une étape
   * @param {string} objectiveId - ID de l'objectif
   * @param {string} stepId - ID de l'étape
   * @param {string} status - Nouveau statut
   */
  updateStepStatus: (objectiveId, stepId, status) => 
    api.put(`/objectives/${objectiveId}/steps/${stepId}/status`, { status }),
  
  /**
   * Ajouter un compte-rendu à une étape
   * @param {string} objectiveId - ID de l'objectif
   * @param {string} stepId - ID de l'étape
   * @param {Object} data - Données du compte-rendu
   */
  addReport: (objectiveId, stepId, data) => 
    api.post(`/objectives/${objectiveId}/steps/${stepId}/report`, data),
  
  /**
   * Supprimer une étape
   * @param {string} objectiveId - ID de l'objectif
   * @param {string} stepId - ID de l'étape
   */
  deleteStep: (objectiveId, stepId) => 
    api.delete(`/objectives/${objectiveId}/steps/${stepId}`),
};

// ==================== ANALYTICS API ====================
export const AnalyticsAPI = {
  /**
   * Récupérer les métriques financières
   * @param {string} companyId - ID de l'entreprise
   * @param {string} month - Mois au format YYYY-MM (optionnel)
   * @param {string} period - Période (month/quarter/year)
   */
  getMetrics: (companyId, month = null, period = 'month') => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    params.append('period', period);
    return api.get(`/analytics/${companyId}/metrics?${params.toString()}`);
  },
  
  /**
   * Récupérer les données pour le graphique
   * @param {string} companyId - ID de l'entreprise
   * @param {number} year - Année
   */
  getChartData: (companyId, year = new Date().getFullYear()) => 
    api.get(`/analytics/${companyId}/chart?year=${year}`),
  
  /**
   * Récupérer le résumé mensuel
   * @param {string} companyId - ID de l'entreprise
   * @param {number} year - Année
   */
  getMonthlySummary: (companyId, year = new Date().getFullYear()) =>
    api.get(`/analytics/${companyId}/monthly-summary?year=${year}`),
};

// ==================== USERS API ====================
export const UserAPI = {
  /**
   * Récupérer tous les utilisateurs
   */
  getAll: () => api.get('/users'),
  
  /**
   * Récupérer un utilisateur par UID
   * @param {string} uid - UID de l'utilisateur
   */
  getOne: (uid) => api.get(`/users/${uid}`),
  
  /**
   * Créer un nouvel utilisateur
   * @param {Object} data - Données de l'utilisateur
   */
  create: (data) => api.post('/users', data),
  
  /**
   * Mettre à jour le rôle d'un utilisateur
   * @param {string} uid - UID de l'utilisateur
   * @param {Object} data - Données à mettre à jour (role, companies)
   */
  updateRole: (uid, data) => api.put(`/users/${uid}/role`, data),
};

export default api;
