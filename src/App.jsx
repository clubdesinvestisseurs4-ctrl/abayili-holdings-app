// Application Principale - Abayili Holdings
// Version avec navigation mensuelle et renouvellement automatique des budgets
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionAPI, BudgetAPI, ObjectiveAPI, AnalyticsAPI, PionexAPI, ValuationAPI, BinanceAPI, WalletAPI } from './services/api';

// ==================== ICONS ====================
const Icons = {
  Building2: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  GraduationCap: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Brain: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54"/></svg>,
  BarChart3: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Receipt: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></svg>,
  Target: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  PiggyBank: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/></svg>,
  Plus: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>,
  X: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  Check: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowUpRight: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  ArrowDownRight: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" x2="17" y1="7" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>,
  Clock: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  TrendingUp: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  User: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Loader: ({ size = 24, className = '' }) => <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  ChevronDown: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  ChevronLeft: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Calendar: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  RefreshCw: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  FileText: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Trash2: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  MessageSquare: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  PieChart: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Edit: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  ChefHat: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,
  Layers: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Menu: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
};

// ==================== COMPANIES CONFIG ====================
const COMPANIES = {
  abayili_invest: { id: 'abayili_invest', name: 'Abayili Investissement', shortName: 'AI', description: 'Société de Capital-Risque', icon: 'Building2', liquidity: 'cash',
    departments: ['abayili_invest_rc', 'abayili_invest_rc_trading', 'abayili_invest_fcp', 'abayili_invest_rta', 'abayili_invest_rpp_c1'],
    revenueCategories: [{ id: 'commissions', name: 'Commissions', icon: '💰' }, { id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }],
    expenseCategories: [{ id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '🏢' }, { id: 'charges_financières_Apport_capital', name: 'Charges Financières Apport Capital', icon: '🏢' }, { id: 'charges_fixes_donations', name: 'Charges Fixes Donations', icon: '🏢' }, { id: 'charges_fixes_frais_opérationnels', name: 'Charges Fixes Frais Opérationnels', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  },
  // Réseau Cryptos scindé en deux : l'achat/détention d'actifs crypto (RC) et
  // le trading actif (RC Trading) sont deux activités distinctes avec leur
  // propre résultat, même si le capital du second vient du premier.
  abayili_invest_rc: { id: 'abayili_invest_rc', parentId: 'abayili_invest', name: 'Réseau Cryptos — Actifs', shortName: 'RC', description: 'Abayili Investissement — Achat/détention d\'actifs crypto', icon: 'TrendingUp', liquidity: 'placé',
    revenueCategories: [{ id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }, { id: 'apport_capital', name: 'Apport Capital', icon: '🏦' }],
    expenseCategories: [{ id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '💼' }, { id: 'apport_capital_retrait', name: 'Apport Capital', icon: '🏦' }]
  },
  abayili_invest_rc_trading: { id: 'abayili_invest_rc_trading', parentId: 'abayili_invest', name: 'Réseau Cryptos — Trading', shortName: 'RC Trading', description: 'Abayili Investissement — Trading actif crypto', icon: 'BarChart3', liquidity: 'placé',
    revenueCategories: [{ id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }, { id: 'apport_capital', name: 'Apport Capital', icon: '🏦' }],
    expenseCategories: [{ id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '💼' }, { id: 'apport_capital_retrait', name: 'Apport Capital', icon: '🏦' }]
  },
  abayili_invest_fcp: { id: 'abayili_invest_fcp', parentId: 'abayili_invest', name: 'FCP', shortName: 'FCP', description: 'Abayili Investissement — Département Capital Risque', icon: 'Layers', liquidity: 'placé',
    revenueCategories: [{ id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }, { id: 'apport_capital', name: 'Apport Capital', icon: '🏦' }],
    expenseCategories: [{ id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '💼' }, { id: 'apport_capital_retrait', name: 'Apport Capital', icon: '🏦' }]
  },
  abayili_invest_rta: { id: 'abayili_invest_rta', parentId: 'abayili_invest', name: 'RTA', shortName: 'RTA', description: 'Abayili Investissement — Département Capital Risque', icon: 'BarChart3', liquidity: 'placé',
    revenueCategories: [{ id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }, { id: 'apport_capital', name: 'Apport Capital', icon: '🏦' }],
    expenseCategories: [{ id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '💼' }, { id: 'apport_capital_retrait', name: 'Apport Capital', icon: '🏦' }]
  },
  abayili_invest_rpp_c1: { id: 'abayili_invest_rpp_c1', parentId: 'abayili_invest', name: 'Réseau Parieurs Pro — Compte 1', shortName: 'RPP C1', description: 'Abayili Investissement — Département Capital Risque', icon: 'Target', liquidity: 'placé',
    revenueCategories: [{ id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }, { id: 'apport_capital', name: 'Apport Capital', icon: '🏦' }],
    expenseCategories: [{ id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'apport_capital_retrait', name: 'Apport Capital', icon: '🏦' }]
  },
  abayili_consulting: { id: 'abayili_consulting', name: 'Abayili Consulting', shortName: 'AC', description: 'Consulting, Formation & Conférences', icon: 'GraduationCap', liquidity: 'cash',
    revenueCategories: [{ id: 'formations', name: 'Ventes de Formations', icon: '📚' }, { id: 'consulting', name: 'Missions Consulting', icon: '💼' }, { id: 'conferences', name: 'Conférences', icon: '🎤' }, { id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }],
    expenseCategories: [{ id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  },
  ai_for_afrika: { id: 'ai_for_afrika', name: 'AI for Afrika', shortName: 'AFA', description: 'Intelligence Artificielle & Développement', icon: 'Brain', liquidity: 'cash',
    revenueCategories: [{ id: 'contrats_dev', name: 'Contrats de Développement', icon: '💻' }, { id: 'licences', name: 'Licences Logicielles', icon: '📜' }, { id: 'maintenance', name: 'Maintenance & Support', icon: '🔧' }],
    expenseCategories: [{ id: 'charges_fixes_frais_opérationnels', name: 'Charges Fixes Frais Opérationnels', icon: '🏢' }, { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  },
  gourmandises_africaines: { id: 'gourmandises_africaines', name: 'Gourmandises Africaines', shortName: 'GA', description: 'Restauration & Traiteur Africain', icon: 'ChefHat', liquidity: 'cash',
    revenueCategories: [{ id: 'restauration', name: 'Restauration', icon: '🍽️' }, { id: 'traiteur', name: 'Traiteur & Événements', icon: '🥘' }, { id: 'vente_emporter', name: 'Ventes à Emporter', icon: '📦' }, { id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }],
    expenseCategories: [{ id: 'matieres_premieres', name: 'Matières Premières', icon: '🧺' }, { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏦' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  }
};

const STEP_STATUSES = [
  { id: 'todo', label: 'À faire', color: 'bg-neutral-500/10 text-neutral-400', dot: 'bg-neutral-400' },
  { id: 'in_progress', label: 'En cours', color: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
  { id: 'waiting_validation', label: 'En attente validation', color: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400' },
  { id: 'done', label: 'Terminée', color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' }
];

// ==================== HELPERS ====================

// Obtenir le mois courant au format YYYY-MM
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Formater le mois pour l'affichage
const formatMonthDisplay = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// Obtenir le mois précédent
const getPreviousMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, '0')}`;
};

// Obtenir le mois suivant
const getNextMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  if (month === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${String(month + 1).padStart(2, '0')}`;
};

// ==================== MONTH SELECTOR COMPONENT ====================
function MonthSelector({ selectedMonth, onChange, availableMonths = [], isTotal = false, onToggleTotal }) {
  const currentMonth = getCurrentMonth();
  const isCurrentMonth = !isTotal && selectedMonth === currentMonth;
  const canGoNext = !isTotal && selectedMonth < currentMonth;

  return (
    <div className="flex items-center gap-2">
      {onToggleTotal && (
        <button
          onClick={onToggleTotal}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
            isTotal
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-neutral-800/50 text-neutral-400 border-neutral-700/30 hover:text-white hover:border-neutral-600'
          }`}
          title={isTotal ? 'Passer en vue mensuelle' : 'Voir le total global (toutes années)'}
        >
          <Icons.Layers size={14} className="inline mr-1.5" />
          Total
        </button>
      )}

      {isTotal ? (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">
          <Icons.Calendar size={15} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400">
            Depuis le début
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-neutral-800/50 rounded-xl px-2 py-1">
          <button
            onClick={() => onChange(getPreviousMonth(selectedMonth))}
            className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors text-neutral-400 hover:text-white"
            title="Mois précédent"
          >
            <Icons.ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 min-w-[160px] justify-center">
            <Icons.Calendar size={16} className="text-neutral-500" />
            <span className="text-sm font-medium text-white">
              {formatMonthDisplay(selectedMonth)}
            </span>
            {isCurrentMonth && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                Actuel
              </span>
            )}
          </div>

          <button
            onClick={() => canGoNext && onChange(getNextMonth(selectedMonth))}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-colors ${canGoNext ? 'hover:bg-neutral-700/50 text-neutral-400 hover:text-white' : 'text-neutral-600 cursor-not-allowed'}`}
            title="Mois suivant"
          >
            <Icons.ChevronRight size={18} />
          </button>

          {!isCurrentMonth && (
            <button
              onClick={() => onChange(currentMonth)}
              className="ml-1 p-2 hover:bg-neutral-700/50 rounded-lg transition-colors text-neutral-400 hover:text-emerald-400"
              title="Revenir au mois actuel"
            >
              <Icons.RefreshCw size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== CHART COMPONENTS ====================

// Graphique en barres pour revenus/dépenses
// Graphique Donut pour répartition par catégorie
function DonutChart({ data, title, size = 120, strokeWidth = 20 }) {
  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-sm">
        <div className="text-neutral-600 text-xs">{title}</div>
        <div className="mt-2">Aucune donnée</div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const centerX = size / 2;
  const centerY = size / 2;

  // Couleurs pour les catégories
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  let currentAngle = -90; // Commencer à midi

  return (
    <div className="flex flex-col items-center">
      <div className="text-neutral-400 text-xs uppercase tracking-wider mb-3">{title}</div>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            // Calculer l'arc
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
              >
                <title>{item.name}: {item.value.toLocaleString('fr-FR')} FCFA ({percentage.toFixed(1)}%)</title>
              </path>
            );
          })}
          {/* Cercle central pour effet donut */}
          <circle cx={centerX} cy={centerY} r={radius * 0.55} fill="#0a0a0a" />
          {/* Total au centre */}
          <text x={centerX} y={centerY - 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
            {(total / 1000).toFixed(0)}k
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" fill="#888" fontSize="8">
            FCFA
          </text>
        </svg>
      </div>
      {/* Légende */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs max-h-24 overflow-y-auto">
        {data.slice(0, 6).map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 truncate">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></div>
            <span className="text-neutral-400 truncate" title={`${item.name}: ${item.value.toLocaleString('fr-FR')} FCFA`}>
              {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
            </span>
          </div>
        ))}
        {data.length > 6 && (
          <div className="text-neutral-500 text-xs col-span-2">+{data.length - 6} autres...</div>
        )}
      </div>
    </div>
  );
}

// Composant pour afficher la répartition Revenus/Dépenses
function CategoryDistributionChart({ transactions }) {
  // Calculer la répartition par catégorie
  const calculateCategoryData = (txs, type) => {
    const categoryMap = {};
    
    txs
      .filter(t => t.type === type && t.status === 'validated')
      .forEach(t => {
        const category = t.category || 'Autre';
        categoryMap[category] = (categoryMap[category] || 0) + (t.amount || 0);
      });
    
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const revenueData = calculateCategoryData(transactions, 'revenue');
  const expenseData = calculateCategoryData(transactions, 'expense');

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
  const totalExpense = expenseData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DonutChart data={revenueData} title="Revenus" size={140} />
        <DonutChart data={expenseData} title="Dépenses" size={140} />
      </div>
      
      {/* Résumé */}
      <div className="mt-4 pt-4 border-t border-neutral-800/50">
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Icons.ArrowUpRight size={14} className="text-emerald-500" />
            <span className="text-neutral-400">Total Revenus:</span>
            <span className="text-emerald-500 font-medium">{totalRevenue.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Icons.ArrowDownRight size={14} className="text-red-500" />
            <span className="text-neutral-400">Total Dépenses:</span>
            <span className="text-red-500 font-medium">{totalExpense.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <div className={`text-sm font-medium ${totalRevenue - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Résultat: {totalRevenue - totalExpense >= 0 ? '+' : ''}{(totalRevenue - totalExpense).toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>
    </div>
  );
}

// Courbe d'évolution (ligne + aire) - pas de librairie externe, même
// convention que DonutChart/CategoryDistributionChart plus haut (SVG à la
// main). Trace une série chronologique (ex: résultat net cumulé mois par
// mois) avec une ligne colorée selon le signe de la dernière valeur.
function EvolutionChart({ points, formatValue = (v) => v.toLocaleString('fr-FR') }) {
  if (!points || points.length === 0) {
    return <div className="flex items-center justify-center h-40 text-sm text-neutral-500">Aucune donnée</div>;
  }

  const width = 600;
  const height = 180;
  const padLeft = 55;
  const padRight = 12;
  const padTop = 16;
  const padBottom = 28;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const values = points.map(p => p.value);
  const rawMax = Math.max(...values, 0);
  const rawMin = Math.min(...values, 0);
  const range = rawMax - rawMin || 1;
  const max = rawMax + range * 0.1;
  const min = rawMin - range * 0.1;
  const span = max - min || 1;

  const xFor = (i) => padLeft + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
  const yFor = (v) => padTop + plotHeight - ((v - min) / span) * plotHeight;
  const zeroY = yFor(0);

  const isPositive = values[values.length - 1] >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.value)}`).join(' ');
  const areaPath = `${linePath} L ${xFor(points.length - 1)} ${zeroY} L ${xFor(0)} ${zeroY} Z`;

  // N'affiche pas plus de ~8 étiquettes sur l'axe X pour rester lisible
  const labelStep = Math.max(1, Math.ceil(points.length / 8));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <line x1={padLeft} y1={zeroY} x2={width - padRight} y2={zeroY} stroke="#404040" strokeWidth="1" strokeDasharray="4 3" />
      <text x={padLeft - 8} y={zeroY + 3} textAnchor="end" fontSize="9" fill="#666">0</text>
      <text x={padLeft - 8} y={padTop + 4} textAnchor="end" fontSize="9" fill="#666">{formatValue(max)}</text>
      <text x={padLeft - 8} y={padTop + plotHeight} textAnchor="end" fontSize="9" fill="#666">{formatValue(min)}</text>

      <path d={areaPath} fill={color} fillOpacity="0.12" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <circle key={i} cx={xFor(i)} cy={yFor(p.value)} r="3" fill={color}>
          <title>{p.label} : {formatValue(p.value)}</title>
        </circle>
      ))}

      {points.map((p, i) => (
        i % labelStep === 0 && (
          <text key={i} x={xFor(i)} y={height - 6} textAnchor="middle" fontSize="9" fill="#666">{p.label}</text>
        )
      ))}
    </svg>
  );
}

// Cercle de progression
function CircularProgress({ value, max, size = 100, strokeWidth = 8, label, sublabel, color = '#10b981' }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isOver = value > max;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Cercle de fond */}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#333" strokeWidth={strokeWidth} />
          {/* Cercle de progression */}
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={isOver ? '#ef4444' : color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-medium ${isOver ? 'text-red-400' : 'text-white'}`}>{percentage.toFixed(0)}%</span>
        </div>
      </div>
      {label && <p className="text-sm text-white mt-2 text-center">{label}</p>}
      {sublabel && <p className="text-xs text-neutral-500 text-center">{sublabel}</p>}
    </div>
  );
}

// Mini barre de progression horizontale
function MiniProgressBar({ value, max, color = 'bg-emerald-500', showLabel = true }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full">
      <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <p className="text-xs text-neutral-500 mt-1 text-right">{percentage.toFixed(0)}%</p>}
    </div>
  );
}

// ==================== COMPONENTS ====================
function MetricCard({ label, value, positive, icon, warning, trend, onClick }) {
  const IconComponent = icon ? Icons[icon] : null;
  return (
    <div className={`bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6 ${onClick ? 'cursor-pointer hover:bg-neutral-800/30 transition-colors' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
        {IconComponent && <IconComponent size={16} className={warning ? 'text-amber-400' : 'text-neutral-500'} />}
      </div>
      <p className={`text-2xl font-light ${positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>{value}</p>
      {trend && <p className={`text-xs mt-2 ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>{trend.up ? '↑' : '↓'} {trend.value}</p>}
    </div>
  );
}

function EmptyState({ icon: IconComponent, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
        {IconComponent && <IconComponent size={28} className="text-neutral-500" />}
      </div>
      <h3 className="text-base text-neutral-300 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm mb-4 max-w-md">{description}</p>
      {action && <button onClick={action} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors"><Icons.Plus size={16} />{actionLabel}</button>}
    </div>
  );
}

function LoadingSpinner() {
  return <div className="flex items-center justify-center min-h-screen bg-neutral-950"><div className="text-center"><Icons.Loader size={48} className="text-white mx-auto mb-4" /><p className="text-neutral-400">Chargement...</p></div></div>;
}

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : 'max-w-lg';
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className={`bg-neutral-900 border border-neutral-800 w-full ${sizeClass} h-full sm:h-auto max-h-full sm:max-h-[90vh] rounded-none sm:rounded-2xl overflow-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"><Icons.X size={20} /></button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

// ==================== LOGIN PAGE ====================
function LoginPage() {
  const { signIn, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setLocalError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-tight text-white"><span className="text-neutral-500">Abayili</span> Holdings</h1>
          <p className="text-neutral-500 text-sm mt-2">Connectez-vous pour accéder à votre espace</p>
        </div>
        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6 sm:p-8">
          {(error || localError) && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">{error || localError}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="votre@email.com" required /></div>
            <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Mot de passe</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="••••••••" required /></div>
            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{loading && <Icons.Loader size={18} />}{loading ? 'Connexion...' : 'Se connecter'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== YEARLY TOTAL VIEW (Total Global, toutes années) ====================
// Anciennement limité à l'année en cours (un mois-par-mois Promise.all sur
// currentYear) - maintenant que des transactions existent sur plusieurs
// années (2025+2026), ce total doit couvrir tout l'historique, pas juste
// l'année en cours. Récupère tout (comme PortfolioGlobalPage) puis regroupe
// par année/mois côté client.
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function YearlyTotalView({ company }) {
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => { loadAllData(); }, [company.id]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const r = await TransactionAPI.getAll(company.id);
      const validated = (r.data || []).filter(t => t.status === 'validated' && t.date);

      const byYearMonth = {};
      for (const t of validated) {
        const ym = t.date.slice(0, 7); // YYYY-MM
        if (!byYearMonth[ym]) byYearMonth[ym] = { revenue: 0, expense: 0 };
        if (t.type === 'revenue') byYearMonth[ym].revenue += (t.amount || 0);
        else if (t.type === 'expense') byYearMonth[ym].expense += (t.amount || 0);
      }

      const rows = Object.entries(byYearMonth)
        .map(([ym, v]) => {
          const [year, month] = ym.split('-').map(Number);
          return { ym, year, monthLabel: MONTHS_FR[month - 1], ...v };
        })
        .sort((a, b) => a.ym.localeCompare(b.ym));

      setMonthlyStats(rows);
    } catch (err) {
      console.error('Erreur chargement total global:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = monthlyStats.reduce((s, d) => s + d.revenue, 0);
  const totalExpense = monthlyStats.reduce((s, d) => s + d.expense, 0);
  const netResult = totalRevenue - totalExpense;
  const firstYear = monthlyStats[0]?.year;
  const lastYear = monthlyStats[monthlyStats.length - 1]?.year;

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Icons.Loader size={32} className="text-neutral-400" />
    </div>
  );

  const isPlacement = company.liquidity === 'placé';

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Total Entrées (toutes années)"
          value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`}
          icon="ArrowUpRight"
        />
        <MetricCard
          label="Total Sorties (toutes années)"
          value={`${totalExpense.toLocaleString('fr-FR')} FCFA`}
          icon="ArrowDownRight"
        />
        <MetricCard
          label={isPlacement ? 'Flux de Trésorerie Net (pas le rendement)' : 'Résultat Net Global'}
          value={`${netResult >= 0 ? '+' : ''}${netResult.toLocaleString('fr-FR')} FCFA`}
          positive={netResult >= 0}
          icon="TrendingUp"
        />
      </div>
      {isPlacement && (
        <p className="text-[11px] text-neutral-500 -mt-4 mb-8">
          <Icons.AlertTriangle size={12} className="inline mr-1 text-amber-400" />
          Ce chiffre additionne TOUTES les transactions (y compris les achats d'actifs et mouvements de capital entre départements) - ce n'est pas une mesure de rentabilité. Pour ça, voir le widget "Rendement" plus haut sur le tableau de bord.
        </p>
      )}

      <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/50">
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">
            Récapitulatif Mensuel{firstYear ? ` — ${firstYear === lastYear ? firstYear : `${firstYear} à ${lastYear}`}` : ''}
          </h3>
          <Icons.Calendar size={16} className="text-neutral-500" />
        </div>
        {monthlyStats.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-8">Aucune transaction validée pour l'instant.</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50">
                <th className="text-left px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Mois</th>
                <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Entrées</th>
                <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Sorties</th>
                <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Résultat Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((row, i) => {
                const net = row.revenue - row.expense;
                return (
                  <tr key={row.ym} className={`border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/20 transition-colors ${i % 2 !== 0 ? 'bg-neutral-900/20' : ''}`}>
                    <td className="px-6 py-4 text-sm text-white">{row.monthLabel} {row.year}</td>
                    <td className="px-6 py-4 text-sm text-right text-emerald-400">
                      {row.revenue > 0 ? `+${row.revenue.toLocaleString('fr-FR')}` : row.revenue.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-red-400">
                      {row.expense > 0 ? `-${row.expense.toLocaleString('fr-FR')}` : row.expense.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-medium ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {net >= 0 ? '+' : ''}{net.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-700 bg-neutral-800/30">
                <td className="px-6 py-4 text-sm font-medium text-white uppercase tracking-wider">Total</td>
                <td className="px-6 py-4 text-sm text-right text-emerald-400 font-semibold">
                  +{totalRevenue.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-6 py-4 text-sm text-right text-red-400 font-semibold">
                  -{totalExpense.toLocaleString('fr-FR')} FCFA
                </td>
                <td className={`px-6 py-4 text-sm text-right font-bold ${netResult >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {netResult >= 0 ? '+' : ''}{netResult.toLocaleString('fr-FR')} FCFA
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE (avec graphiques et navigation mensuelle) ====================
// ==================== PIONEX GRID BOT WIDGET ====================
// PnL dynamique du bot Pionex (Réseau Cryptos - Trading), recalculé côté
// serveur à partir du prix BTC en direct à chaque chargement de la page -
// voir routes/pionex.js pour la formule (vérifiée contre l'app Pionex).
function PionexGridBotWidget() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    PionexAPI.getGridBotStatus()
      .then(res => { if (!cancelled) setStatus(res.data); })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 flex items-center gap-3">
        <Icons.Loader size={18} className="text-neutral-500" />
        <span className="text-sm text-neutral-500">Chargement du bot Pionex en direct...</span>
      </div>
    );
  }
  if (error || !status) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 text-sm text-neutral-500">
        <Icons.AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
        Bot Pionex non disponible pour l'instant{error ? ` (${error})` : ''}.
      </div>
    );
  }

  const isPositive = status.currentProfit >= 0;
  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 mb-6 sm:mb-8 overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Bot Pionex — BTC/USDT Grille (en direct)</h3>
          <p className="text-[11px] text-neutral-600 mt-1">Prix BTC : {status.btcPrice.toLocaleString('fr-FR')} $ — actualisé {new Date(status.fetchedAt).toLocaleTimeString('fr-FR')}</p>
        </div>
        <Icons.TrendingUp size={18} className="text-neutral-500" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-6">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Investissement</p>
          <p className="text-sm text-white">{status.investment.toFixed(2)} $</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Bénéfice courant</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{status.currentProfit.toFixed(2)} $ ({isPositive ? '+' : ''}{status.currentProfitPct.toFixed(2)}%)
          </p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Grid profit</p>
          <p className="text-sm text-emerald-400">+{status.gridProfit.toFixed(2)} $</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Position actuelle</p>
          <p className="text-sm text-neutral-300">{status.baseAmount.toFixed(6)} BTC + {status.quoteAmount.toFixed(2)} $</p>
        </div>
      </div>
      {status.autoSync && (
        <div className="px-6 pb-4 -mt-2">
          <p className="text-[10px] text-neutral-600">
            {status.autoSync.synced
              ? `Synchro auto : transaction de ${status.autoSync.deltaUsd >= 0 ? '+' : ''}${status.autoSync.deltaUsd.toFixed(2)} $ créée dans le grand livre.`
              : status.autoSync.nextSyncAt
                ? `Prochaine synchro auto vers le grand livre : ${new Date(status.autoSync.nextSyncAt).toLocaleDateString('fr-FR')}.`
                : `Synchro auto : ${status.autoSync.reason}.`}
          </p>
        </div>
      )}
    </div>
  );
}

// Solde live Binance + MetaMask (Réseau Cryptos - Actifs) - même principe
// que le widget Pionex : lecture seule, montre juste ce qui existe
// réellement aujourd'hui sur ces comptes, sans reconstituer un historique.
function LiveWalletBalancesWidget() {
  const [binance, setBinance] = useState(null);
  const [binanceError, setBinanceError] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    BinanceAPI.getStatus()
      .then(res => { if (!cancelled) setBinance(res.data); })
      .catch(err => { if (!cancelled) setBinanceError(err.response?.data?.detail || err.message); });
    WalletAPI.getStatus()
      .then(res => { if (!cancelled) setWallet(res.data); })
      .catch(err => { if (!cancelled) setWalletError(err.response?.data?.detail || err.message); });
    return () => { cancelled = true; };
  }, []);

  const totalFcfa = (binance?.totalFcfa || 0) + (wallet?.fcfaValue || 0);

  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 mb-6 sm:mb-8 overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Soldes en direct — Binance + MetaMask</h3>
          <p className="text-[11px] text-neutral-600 mt-1">Ce qui existe réellement aujourd'hui sur ces comptes (pas un historique de transactions)</p>
        </div>
        {(binance || wallet) && (
          <span className="text-sm font-medium text-white">{totalFcfa.toLocaleString('fr-FR')} FCFA</span>
        )}
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Binance (spot)</p>
          {binanceError ? (
            <p className="text-xs text-neutral-500"><Icons.AlertTriangle size={12} className="inline mr-1 text-amber-400" />{binanceError}</p>
          ) : !binance ? (
            <p className="text-xs text-neutral-500 flex items-center gap-2"><Icons.Loader size={13} />Chargement...</p>
          ) : (
            <>
              <p className="text-sm text-white mb-1.5">{binance.totalFcfa.toLocaleString('fr-FR')} FCFA <span className="text-neutral-500">({binance.totalUsd.toFixed(2)} $)</span></p>
              <div className="space-y-0.5">
                {binance.holdings.slice(0, 5).map(h => (
                  <p key={h.asset} className="text-[11px] text-neutral-500">{h.asset} : {h.amount.toFixed(6)} (≈{h.usdValue.toFixed(2)} $)</p>
                ))}
              </div>
            </>
          )}
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">MetaMask (ETH natif)</p>
          {walletError ? (
            <p className="text-xs text-neutral-500"><Icons.AlertTriangle size={12} className="inline mr-1 text-amber-400" />{walletError}</p>
          ) : !wallet ? (
            <p className="text-xs text-neutral-500 flex items-center gap-2"><Icons.Loader size={13} />Chargement...</p>
          ) : (
            <>
              <p className="text-sm text-white mb-1.5">{wallet.fcfaValue.toLocaleString('fr-FR')} FCFA <span className="text-neutral-500">({wallet.usdValue.toFixed(2)} $)</span></p>
              <p className="text-[11px] text-neutral-500">{wallet.ethBalance.toFixed(6)} ETH</p>
              <p className="text-[10px] text-neutral-600 mt-1">{wallet.note}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Widget de rendement (ROI) - calculé à partir des transactions déjà
// enregistrées, pas d'API externe (contrairement au bot Pionex). Répond à
// "suis-je rentable ?" pour une entité "capital placé" : capital investi =
// somme des apports (catégorie "Apport Capital"), gains réels = somme des
// vrais revenus (toutes les autres catégories de revenu), rendement net =
// gains - charges, rapporté au capital investi.
function RendementWidget({ company }) {
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    TransactionAPI.getAll(company.id)
      .then(res => { if (!cancelled) setTransactions(res.data || []); })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message); });
    return () => { cancelled = true; };
  }, [company.id]);

  if (error) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 text-sm text-neutral-500">
        <Icons.AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
        Rendement indisponible pour l'instant ({error}).
      </div>
    );
  }
  if (!transactions) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 flex items-center gap-3">
        <Icons.Loader size={18} className="text-neutral-500" />
        <span className="text-sm text-neutral-500">Calcul du rendement...</span>
      </div>
    );
  }

  // "Apport Capital" est un mouvement de capital (apport si revenu, retrait
  // si dépense) - ni un gain, ni une charge. Un retrait de capital déjà
  // utilisé ailleurs ne doit pas compter comme une perte de l'activité.
  // "Charges Financières RESERVES" sert à enregistrer les achats d'actifs
  // (ex: achat de cryptos avec le capital apporté) - l'argent n'est pas
  // perdu, juste transformé en une autre forme d'actif ; compter ça comme
  // une charge ferait passer un simple réinvestissement pour une perte
  // (constaté concrètement sur RC Actifs : rendement à -100% alors que le
  // capital était juste investi en cryptos, pas envolé).
  const validated = transactions.filter(t => t.status === 'validated');
  const apports = validated
    .filter(t => t.type === 'revenue' && t.category === 'Apport Capital')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const retraits = validated
    .filter(t => t.type === 'expense' && t.category === 'Apport Capital')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const capitalInvesti = apports - retraits;
  const isCapitalOrReserve = (t) => t.category === 'Apport Capital' || t.category === 'Charges Financières RESERVES';
  const gainsReels = validated
    .filter(t => t.type === 'revenue' && !isCapitalOrReserve(t))
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const charges = validated
    .filter(t => t.type === 'expense' && !isCapitalOrReserve(t))
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const resultatNet = gainsReels - charges;
  const rendementPct = capitalInvesti > 0 ? (resultatNet / capitalInvesti) * 100 : 0;
  const isProfitable = resultatNet >= 0;

  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 mb-6 sm:mb-8 overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Rendement — Historique complet</h3>
          <p className="text-[11px] text-neutral-600 mt-1">Basé sur toutes les transactions validées, capital placé de {company.name}</p>
        </div>
        <Icons.BarChart3 size={18} className="text-neutral-500" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-6">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Capital investi</p>
          <p className="text-sm text-white">{capitalInvesti.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Gains réalisés</p>
          <p className="text-sm text-emerald-400">+{gainsReels.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Charges</p>
          <p className="text-sm text-red-400">-{charges.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Rendement</p>
          <p className={`text-sm font-medium ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}{resultatNet.toLocaleString('fr-FR')} FCFA ({isProfitable ? '+' : ''}{rendementPct.toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
}

const MONTH_LABELS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Widget "courbe d'évolution" - résultat net CUMULÉ mois par mois (gains
// réels moins charges, capital investi exclu - même logique que
// RendementWidget mais dans le temps plutôt qu'en un seul chiffre final).
// Répond à "est-ce que ça s'améliore ou ça empire", pas juste "où j'en suis".
function EvolutionWidget({ company }) {
  const [transactions, setTransactions] = useState(null);
  const [snapshots, setSnapshots] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([TransactionAPI.getAll(company.id), ValuationAPI.getAll(company.id)])
      .then(([txRes, snapRes]) => { if (!cancelled) { setTransactions(txRes.data || []); setSnapshots(snapRes.data || []); } })
      .catch(err => { if (!cancelled) setError(err.response?.data?.detail || err.message); });
    return () => { cancelled = true; };
  }, [company.id]);

  if (error) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 text-sm text-neutral-500">
        <Icons.AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
        Courbe d'évolution indisponible ({error}).
      </div>
    );
  }
  if (!transactions || !snapshots) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 flex items-center gap-3">
        <Icons.Loader size={18} className="text-neutral-500" />
        <span className="text-sm text-neutral-500">Chargement de la courbe d'évolution...</span>
      </div>
    );
  }

  // Deux modes selon le type d'entité : les départements "capital placé" ont
  // un Apport Capital distinct du gain réel -> on trace le rendement % (le
  // même calcul que RendementWidget, mais dans le temps). Les sociétés
  // opérationnelles ("cash") n'ont pas cette distinction - Apport Capital
  // n'existe pas comme catégorie chez elles - donc on trace simplement le
  // résultat net cumulé en FCFA, qui est le repère universellement lisible.
  const isPlacement = company.liquidity === 'placé';

  const validated = transactions.filter(t => t.status === 'validated' && t.date);
  const capitalMoves = validated
    .filter(t => t.category === 'Apport Capital')
    .map(t => ({ date: t.date, amount: t.type === 'revenue' ? (t.amount || 0) : -(t.amount || 0) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const capitalNetAt = (date) => capitalMoves.filter(m => m.date <= date).reduce((sum, m) => sum + m.amount, 0);

  const sortedSnapshots = [...snapshots].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const usingSnapshots = isPlacement && sortedSnapshots.length > 0;

  let points;
  if (usingSnapshots) {
    // Les relevés manuels (valeur réelle connue à une date) donnent une image
    // bien plus juste que les seules transactions "réalisées" - qui restent
    // à 0 tant qu'aucun gain n'a été concrètement encaissé/retiré. On les
    // utilise en priorité dès qu'il y en a au moins un.
    points = sortedSnapshots
      .map(s => {
        const capitalAtDate = capitalNetAt(s.date);
        return capitalAtDate > 0
          ? { label: new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), value: ((s.value - capitalAtDate) / capitalAtDate) * 100 }
          : null;
      })
      .filter(Boolean);
  } else {
    const byMonth = {};
    validated.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!byMonth[month]) byMonth[month] = { capital: 0, net: 0 };
      const isCapitalMove = isPlacement && t.category === 'Apport Capital';
      const isAssetReallocation = isPlacement && t.category === 'Charges Financières RESERVES';
      if (isCapitalMove) byMonth[month].capital += t.type === 'revenue' ? (t.amount || 0) : -(t.amount || 0);
      else if (isAssetReallocation) { /* achat d'actif, pas une perte - exclu du calcul */ }
      else if (t.type === 'revenue') byMonth[month].net += (t.amount || 0);
      else if (t.type === 'expense') byMonth[month].net -= (t.amount || 0);
    });

    const sortedMonths = Object.keys(byMonth).sort();
    let runningCapital = 0;
    let runningNet = 0;
    points = sortedMonths.map(month => {
      runningCapital += byMonth[month].capital;
      runningNet += byMonth[month].net;
      const [y, m] = month.split('-').map(Number);
      return {
        label: `${MONTH_LABELS_FR[m - 1]} ${String(y).slice(2)}`,
        value: isPlacement ? (runningCapital > 0 ? (runningNet / runningCapital) * 100 : null) : runningNet,
      };
    });
    // En mode rendement %, pas de point tant qu'aucun capital n'a encore été investi
    if (isPlacement) points = points.filter(p => p.value !== null);
  }

  if (points.length === 0) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 text-sm text-neutral-500">
        Pas encore assez de données pour tracer une courbe{isPlacement ? ' - ajoute un relevé manuel ci-dessus ou attends une première transaction de gain' : ''}.
      </div>
    );
  }

  const last = points[points.length - 1].value;
  const isPositive = last >= 0;

  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 mb-6 sm:mb-8 overflow-hidden p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">{isPlacement ? 'Évolution du rendement (%)' : 'Évolution — Résultat net cumulé'}</h3>
          <p className="text-[11px] text-neutral-600 mt-1">
            {isPlacement
              ? (usingSnapshots ? 'Basé sur tes relevés manuels de valeur (plus précis que les seuls gains réalisés)' : 'Résultat net cumulé / capital investi cumulé, mois par mois')
              : 'Revenus moins dépenses, cumulés mois par mois'}
          </p>
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{isPlacement ? `${last.toFixed(1)}%` : `${last.toLocaleString('fr-FR')} FCFA`}
        </span>
      </div>
      <EvolutionChart points={points} formatValue={isPlacement ? (v) => `${v.toFixed(0)}%` : (v) => `${(v / 1000).toFixed(1)}k`} />
    </div>
  );
}

// Relevés de valeur manuels - pour les placements gérés par un tiers sans
// API disponible (ex: FCP via Jamo/NSIA, contrairement au bot Pionex qui a
// sa propre intégration live). L'utilisateur entre "à telle date, ça vaut
// tel montant" de temps en temps ; le rendement est calculé automatiquement
// à partir de ça et du capital net déjà apporté (transactions "Apport
// Capital"), sans jamais toucher au grand livre des transactions.
function ValuationSnapshotWidget({ company }) {
  const [snapshots, setSnapshots] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], value: '', note: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    Promise.all([ValuationAPI.getAll(company.id), TransactionAPI.getAll(company.id)])
      .then(([snapRes, txRes]) => {
        setSnapshots(snapRes.data || []);
        setTransactions(txRes.data || []);
      })
      .catch(err => setError(err.response?.data?.detail || err.message));
  };

  useEffect(() => { load(); }, [company.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.value) return;
    setSubmitting(true);
    try {
      await ValuationAPI.create({ companyId: company.id, date: form.date, value: parseFloat(form.value), note: form.note });
      setForm({ date: new Date().toISOString().split('T')[0], value: '', note: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await ValuationAPI.delete(id);
    load();
  };

  if (error) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 text-sm text-neutral-500">
        <Icons.AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
        Relevés manuels indisponibles ({error}).
      </div>
    );
  }
  if (!snapshots || !transactions) {
    return (
      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 mb-6 sm:mb-8 flex items-center gap-3">
        <Icons.Loader size={18} className="text-neutral-500" />
        <span className="text-sm text-neutral-500">Chargement des relevés...</span>
      </div>
    );
  }

  // Capital net apporté (apports - retraits) cumulé jusqu'à une date donnée
  const capitalMoves = transactions
    .filter(t => t.status === 'validated' && t.category === 'Apport Capital' && t.date)
    .map(t => ({ date: t.date, amount: t.type === 'revenue' ? (t.amount || 0) : -(t.amount || 0) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const capitalNetAt = (date) => capitalMoves.filter(m => m.date <= date).reduce((sum, m) => sum + m.amount, 0);
  const capitalNetActuel = capitalMoves.reduce((sum, m) => sum + m.amount, 0);

  const sortedSnapshots = [...snapshots].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const points = sortedSnapshots
    .map(s => {
      const capitalAtDate = capitalNetAt(s.date);
      return capitalAtDate > 0
        ? { label: new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), value: ((s.value - capitalAtDate) / capitalAtDate) * 100 }
        : null;
    })
    .filter(Boolean);

  const latest = sortedSnapshots[sortedSnapshots.length - 1];
  const gainLatent = latest ? latest.value - capitalNetActuel : 0;
  const rendementLatentPct = latest && capitalNetActuel > 0 ? (gainLatent / capitalNetActuel) * 100 : 0;
  const isPositive = gainLatent >= 0;

  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 mb-6 sm:mb-8 overflow-hidden p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Relevés manuels de valeur</h3>
          <p className="text-[11px] text-neutral-600 mt-1">Pas d'API pour ce placement - tu entres la valeur toi-même, le rendement se calcule automatiquement</p>
        </div>
      </div>

      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Valeur actuelle connue</p>
            <p className="text-sm text-white">{latest.value.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Capital net apporté</p>
            <p className="text-sm text-neutral-300">{capitalNetActuel.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Gain latent</p>
            <p className={`text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{gainLatent.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Rendement latent</p>
            <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{isPositive ? '+' : ''}{rendementLatentPct.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {points.length > 1 && <div className="mb-5"><EvolutionChart points={points} formatValue={(v) => `${v.toFixed(0)}%`} /></div>}

      {sortedSnapshots.length > 0 && (
        <div className="mb-5 space-y-1.5">
          {[...sortedSnapshots].reverse().map(s => (
            <div key={s.id} className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-800/30 rounded-lg px-3 py-2">
              <span>{new Date(s.date).toLocaleDateString('fr-FR')} — {s.value.toLocaleString('fr-FR')} FCFA{s.note ? ` (${s.note})` : ''}</span>
              <button onClick={() => handleDelete(s.id)} className="text-neutral-600 hover:text-red-400 transition-colors">
                <Icons.Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
        <div>
          <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-600" required />
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Valeur totale (FCFA)</label>
          <input type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="ex: 1384" className="px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white w-32 focus:outline-none focus:border-neutral-600" required />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 block">Note (optionnel)</label>
          <input type="text" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="ex: relevé app Jamo" className="px-3 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white w-full focus:outline-none focus:border-neutral-600" />
        </div>
        <button type="submit" disabled={submitting} className="flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50">
          <Icons.Plus size={14} />{submitting ? '...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

function DashboardPage({ company, onNavigate, selectedMonth, onMonthChange }) {
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalExpenses: 0, netResult: 0, pendingExpenses: 0 });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTotal, setIsTotal] = useState(false);

  useEffect(() => { if (!isTotal) loadData(); }, [company.id, selectedMonth, isTotal]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, transactionsRes, budgetsRes, objectivesRes] = await Promise.all([
        AnalyticsAPI.getMetrics(company.id, selectedMonth).catch(() => ({ data: {} })),
        TransactionAPI.getAll(company.id, { month: selectedMonth }).catch(() => ({ data: [] })),
        BudgetAPI.getAll(company.id, selectedMonth).catch(() => ({ data: [] })),
        ObjectiveAPI.getAll(company.id).catch(() => ({ data: [] }))
      ]);
      
      setMetrics(metricsRes.data || {});
      setTransactions(transactionsRes.data || []);
      setBudgets(budgetsRes.data || []);
      setObjectives(objectivesRes.data || []);
    } catch (err) { console.error('Erreur:', err); } finally { setLoading(false); }
  };

  // Calculs pour les objectifs
  const objectivesStats = {
    total: objectives.length,
    completed: objectives.filter(o => o.status === 'completed').length,
    inProgress: objectives.filter(o => o.status === 'in_progress').length,
    todo: objectives.filter(o => o.status === 'todo').length
  };

  // Calculs pour les budgets
  const budgetStats = budgets.reduce((acc, b) => {
    acc.totalBudget += b.amount || 0;
    acc.totalSpent += b.spent || 0;
    return acc;
  }, { totalBudget: 0, totalSpent: 0 });
  const budgetUsage = budgetStats.totalBudget > 0 ? (budgetStats.totalSpent / budgetStats.totalBudget) * 100 : 0;

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header avec sélecteur de mois */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight">{company.name}</h2>
          <p className="text-neutral-500 text-sm mt-1">{company.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={onMonthChange}
            isTotal={isTotal}
            onToggleTotal={() => setIsTotal(v => !v)}
          />
          {!isTotal && (
            <button onClick={() => onNavigate('transactions')} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
              <Icons.Plus size={16} />Nouvelle Transaction
            </button>
          )}
        </div>
      </div>

      {company.id === 'abayili_invest_rc_trading' && <PionexGridBotWidget />}
      {company.id === 'abayili_invest_rc' && <LiveWalletBalancesWidget />}
      {company.liquidity === 'placé' && <RendementWidget company={company} />}
      {/* Relevé manuel : uniquement pour les placements sans API ET sans
          transactions décomposables (le FCP - un fonds tiers, on ne peut
          pas y noter de "transaction de gain" comme pour un pari ou une
          vente crypto). RC Trading a l'API Pionex, RC/RPP se suivent par
          transactions classiques (achat/vente, gain/perte) - pas besoin
          d'un relevé pour eux, juste noter les transactions au fil de l'eau. */}
      {company.id === 'abayili_invest_fcp' && <ValuationSnapshotWidget company={company} />}
      <EvolutionWidget company={company} />

      {/* Vue Total Annuel */}
      {isTotal ? (
        <YearlyTotalView company={company} />
      ) : (
        <>
      {/* Métriques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <MetricCard label={`Revenus - ${formatMonthDisplay(selectedMonth)}`} value={`${(metrics.totalRevenue || 0).toLocaleString('fr-FR')} FCFA`} icon="ArrowUpRight" onClick={() => onNavigate('transactions')} />
        <MetricCard label={`Dépenses - ${formatMonthDisplay(selectedMonth)}`} value={`${(metrics.totalExpenses || 0).toLocaleString('fr-FR')} FCFA`} icon="ArrowDownRight" onClick={() => onNavigate('transactions')} />
        <MetricCard label="Résultat Net" value={`${(metrics.netResult || 0) >= 0 ? '+' : ''}${(metrics.netResult || 0).toLocaleString('fr-FR')} FCFA`} positive={(metrics.netResult || 0) >= 0} icon="TrendingUp" />
        <MetricCard label="En Attente" value={`${(metrics.pendingExpenses || 0).toLocaleString('fr-FR')} FCFA`} icon="Clock" warning={(metrics.pendingExpenses || 0) > 0} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
        {/* Graphique Répartition par catégorie */}
        <div className="lg:col-span-2 bg-neutral-900/50 rounded-2xl p-4 sm:p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Répartition par Catégorie - {formatMonthDisplay(selectedMonth)}</h3>
            <Icons.PieChart size={16} className="text-neutral-500" />
          </div>
          <CategoryDistributionChart transactions={transactions} />
        </div>

        {/* Cercles de progression */}
        <div className="bg-neutral-900/50 rounded-2xl p-4 sm:p-6 border border-neutral-800/50">
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-6">Vue d'ensemble</h3>
          <div className="flex flex-row justify-center sm:flex-col items-center gap-6">
            <CircularProgress
              value={budgetStats.totalSpent}
              max={budgetStats.totalBudget || 1}
              size={90}
              strokeWidth={8}
              label="Budget"
              sublabel={`${budgetStats.totalSpent.toLocaleString('fr-FR')} / ${budgetStats.totalBudget.toLocaleString('fr-FR')}`}
              color={budgetUsage > 80 ? '#f59e0b' : '#10b981'}
            />
            <CircularProgress
              value={objectivesStats.completed}
              max={objectivesStats.total || 1}
              size={90}
              strokeWidth={8}
              label="Objectifs"
              sublabel={`${objectivesStats.completed} / ${objectivesStats.total} terminés`}
              color="#3b82f6"
            />
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budgets */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Budgets</h3>
            <button onClick={() => onNavigate('budgets')} className="text-xs text-neutral-500 hover:text-white transition-colors">Voir tout →</button>
          </div>
          {budgets.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">Aucun budget pour {formatMonthDisplay(selectedMonth)}</p>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 4).map(budget => {
                const pct = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                const isOver = pct > 100;
                const isWarning = pct >= 80 && pct < 100;
                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white truncate">{budget.name}</span>
                      <span className={`text-xs ${isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-neutral-400'}`}>{pct.toFixed(0)}%</span>
                    </div>
                    <MiniProgressBar value={budget.spent} max={budget.amount} color={isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'} showLabel={false} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Objectifs */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Objectifs</h3>
            <button onClick={() => onNavigate('objectives')} className="text-xs text-neutral-500 hover:text-white transition-colors">Voir tout →</button>
          </div>
          {objectives.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">Aucun objectif défini</p>
          ) : (
            <div className="space-y-4">
              {objectives.slice(0, 4).map(obj => {
                const steps = obj.steps || [];
                const completed = steps.filter(s => s.status === 'done').length;
                const progress = steps.length > 0 ? (completed / steps.length) * 100 : 0;
                return (
                  <div key={obj.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white truncate">{obj.title}</span>
                      <span className={`text-xs ${obj.status === 'completed' ? 'text-emerald-400' : obj.status === 'in_progress' ? 'text-blue-400' : 'text-neutral-400'}`}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <MiniProgressBar 
                      value={completed} 
                      max={steps.length || 1} 
                      color={obj.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'} 
                      showLabel={false} 
                    />
                  </div>
                );
              })}
              {/* Stats résumées */}
              <div className="pt-3 mt-3 border-t border-neutral-800/50 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-lg font-light text-white">{objectivesStats.todo}</p><p className="text-[10px] text-neutral-500">À faire</p></div>
                <div><p className="text-lg font-light text-blue-400">{objectivesStats.inProgress}</p><p className="text-[10px] text-neutral-500">En cours</p></div>
                <div><p className="text-lg font-light text-emerald-400">{objectivesStats.completed}</p><p className="text-[10px] text-neutral-500">Terminés</p></div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions récentes */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Transactions Récentes</h3>
            <button onClick={() => onNavigate('transactions')} className="text-xs text-neutral-500 hover:text-white transition-colors">Voir tout →</button>
          </div>
          {transactions.length === 0 ? (
            <EmptyState icon={Icons.Receipt} title="Aucune transaction" description={`Aucune transaction pour ${formatMonthDisplay(selectedMonth)}`} action={() => onNavigate('transactions')} actionLabel="Ajouter" />
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-neutral-800/30 last:border-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === 'revenue' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      {t.type === 'revenue' ? <Icons.ArrowUpRight size={14} className="text-emerald-400" /> : <Icons.ArrowDownRight size={14} className="text-red-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{t.description || 'Transaction'}</p>
                      <p className="text-xs text-neutral-500">{t.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm ${t.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'} flex-shrink-0 ml-2`}>
                    {t.type === 'revenue' ? '+' : '-'}{(t.amount || 0).toLocaleString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}

// ==================== TRANSACTIONS PAGE ====================
function TransactionsPage({ company, selectedMonth, onMonthChange }) {
  const { userData } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({ type: 'revenue', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const canValidate = userData?.role === 'admin_treasury';

  useEffect(() => { loadTransactions(); }, [company.id, selectedMonth]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await TransactionAPI.getAll(company.id, { month: selectedMonth });
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
      setLoadError(err.response ? `HTTP ${err.response.status} — ${err.response.data?.error || err.message}` : (err.code || err.message || 'erreur réseau inconnue'));
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'revenue', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
    setEditingTransaction(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSubmitting(true);
    try { 
      if (editingTransaction) {
        // Modification
        await TransactionAPI.update(editingTransaction.id, { 
          ...formData, 
          amount: parseFloat(formData.amount) 
        });
      } else {
        // Création
        await TransactionAPI.create({ 
          ...formData, 
          companyId: company.id, 
          amount: parseFloat(formData.amount) 
        });
      }
      setShowModal(false); 
      resetForm();
      loadTransactions(); 
    }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await TransactionAPI.delete(id);
      setShowDeleteConfirm(null);
      loadTransactions();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleValidate = async (id, status) => { 
    try { 
      await TransactionAPI.updateStatus(id, status); 
      loadTransactions(); 
    } catch (err) { 
      console.error('Erreur:', err); 
    } 
  };
  
  const categories = formData.type === 'revenue' ? company.revenueCategories : company.expenseCategories;

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight">Transactions</h2>
          <p className="text-neutral-500 text-sm mt-1">{company.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <MonthSelector selectedMonth={selectedMonth} onChange={onMonthChange} />
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
            <Icons.Plus size={16} />Nouvelle Transaction
          </button>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4 text-red-400 text-sm">
          <Icons.AlertTriangle size={14} className="inline mr-1.5" />
          Échec du chargement ({loadError}) — ceci n'est pas "aucune transaction", le chargement a réellement échoué.
        </div>
      )}
      {transactions.length === 0 ? (
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <EmptyState
            icon={Icons.Receipt}
            title={loadError ? 'Chargement échoué' : 'Aucune transaction'}
            description={loadError ? 'Vérifie ta connexion et recharge la page.' : `Aucune transaction pour ${formatMonthDisplay(selectedMonth)}. Ajoutez votre première transaction.`}
            action={loadError ? null : openCreateModal}
            actionLabel="Ajouter"
          />
        </div>
      ) : (
        <>
        {/* Vue tableau (tablette / desktop) */}
        <div className="hidden md:block bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left p-4 text-xs text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs text-neutral-500 uppercase tracking-wider">Description</th>
                <th className="text-left p-4 text-xs text-neutral-500 uppercase tracking-wider">Catégorie</th>
                <th className="text-right p-4 text-xs text-neutral-500 uppercase tracking-wider">Montant</th>
                <th className="text-center p-4 text-xs text-neutral-500 uppercase tracking-wider">Statut</th>
                <th className="text-center p-4 text-xs text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20">
                  <td className="p-4 text-sm text-neutral-400">{t.date}</td>
                  <td className="p-4 text-sm text-white">{t.description}</td>
                  <td className="p-4 text-sm text-neutral-400">{t.category}</td>
                  <td className={`p-4 text-sm text-right ${t.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'revenue' ? '+' : '-'}{(t.amount || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {t.status === 'validated' ? 'Validé' : t.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Boutons de validation pour admin */}
                      {canValidate && t.status === 'pending' && (
                        <>
                          <button onClick={() => handleValidate(t.id, 'validated')} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors" title="Valider">
                            <Icons.Check size={14} />
                          </button>
                          <button onClick={() => handleValidate(t.id, 'rejected')} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Rejeter">
                            <Icons.X size={14} />
                          </button>
                        </>
                      )}
                      {/* Boutons modifier/supprimer */}
                      {canValidate && (
                        <>
                          <button onClick={() => openEditModal(t)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors" title="Modifier">
                            <Icons.Edit size={14} />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(t)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Supprimer">
                            <Icons.Trash size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Vue cartes (mobile) */}
        <div className="md:hidden space-y-3">
          {transactions.map(t => (
            <div key={t.id} className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{t.description}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{t.date} • {t.category}</p>
                </div>
                <span className={`text-sm font-medium flex-shrink-0 ${t.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.type === 'revenue' ? '+' : '-'}{(t.amount || 0).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800/50">
                <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {t.status === 'validated' ? 'Validé' : t.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </span>
                <div className="flex items-center gap-2">
                  {canValidate && t.status === 'pending' && (
                    <>
                      <button onClick={() => handleValidate(t.id, 'validated')} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors" title="Valider">
                        <Icons.Check size={14} />
                      </button>
                      <button onClick={() => handleValidate(t.id, 'rejected')} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Rejeter">
                        <Icons.X size={14} />
                      </button>
                    </>
                  )}
                  {canValidate && (
                    <>
                      <button onClick={() => openEditModal(t)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors" title="Modifier">
                        <Icons.Edit size={14} />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(t)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Supprimer">
                        <Icons.Trash size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Modal Création/Modification */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingTransaction ? "Modifier la Transaction" : "Nouvelle Transaction"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'revenue', category: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'revenue' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-neutral-700 text-neutral-400'}`}>Revenu</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense', category: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-neutral-700 text-neutral-400'}`}>Dépense</button>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Catégorie</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required>
              <option value="">Sélectionner...</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Montant (FCFA)</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="0" required min="1" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Description..." required />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required />
          </div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting && <Icons.Loader size={18} />}
            {submitting ? (editingTransaction ? 'Modification...' : 'Création...') : (editingTransaction ? 'Modifier' : 'Créer')}
          </button>
        </form>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmer la suppression">
        <div className="space-y-4">
          <p className="text-neutral-400">
            Êtes-vous sûr de vouloir supprimer cette transaction ?
          </p>
          {showDeleteConfirm && (
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <p className="text-white font-medium">{showDeleteConfirm.description}</p>
              <p className="text-sm text-neutral-400 mt-1">
                {showDeleteConfirm.date} • {showDeleteConfirm.category} • 
                <span className={showDeleteConfirm.type === 'revenue' ? ' text-emerald-400' : ' text-red-400'}>
                  {showDeleteConfirm.type === 'revenue' ? ' +' : ' -'}{(showDeleteConfirm.amount || 0).toLocaleString('fr-FR')} FCFA
                </span>
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
              Annuler
            </button>
            <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ==================== BUDGETS PAGE ====================
function BudgetsPage({ company, selectedMonth, onMonthChange }) {
  const { userData } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ type: 'expense', name: '', amount: '', period: 'monthly' });
  const [renewData, setRenewData] = useState({ sourceMonth: '', targetMonth: '' });
  const [submitting, setSubmitting] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const canManage = userData?.role === 'admin_treasury';

  useEffect(() => { loadBudgets(); loadAvailableMonths(); }, [company.id, selectedMonth]);
  
  const loadBudgets = async () => { 
    try { 
      setLoading(true); 
      const res = await BudgetAPI.getAll(company.id, selectedMonth); 
      setBudgets(res.data || []); 
    } catch (err) { 
      console.error('Erreur:', err); 
    } finally { 
      setLoading(false); 
    } 
  };

  const loadAvailableMonths = async () => {
    try {
      const res = await BudgetAPI.getAllMonths(company.id);
      setAvailableMonths(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'expense', name: '', amount: '', period: 'monthly' });
    setEditingBudget(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      type: budget.type,
      name: budget.name,
      amount: budget.amount.toString(),
      period: budget.period || 'monthly'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSubmitting(true);
    try { 
      if (editingBudget) {
        // Modification
        await BudgetAPI.update(editingBudget.id, { 
          ...formData, 
          amount: parseFloat(formData.amount) 
        });
      } else {
        // Création
        await BudgetAPI.create({ 
          ...formData, 
          companyId: company.id, 
          amount: parseFloat(formData.amount), 
          month: selectedMonth 
        });
      }
      setShowModal(false); 
      resetForm();
      loadBudgets();
      loadAvailableMonths();
    }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await BudgetAPI.delete(id);
      setShowDeleteConfirm(null);
      loadBudgets();
      loadAvailableMonths();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await BudgetAPI.renew(company.id, renewData.sourceMonth, renewData.targetMonth);
      setShowRenewModal(false);
      setRenewData({ sourceMonth: '', targetMonth: '' });
      // Naviguer vers le nouveau mois
      onMonthChange(renewData.targetMonth);
      loadAvailableMonths();
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openRenewModal = () => {
    // Pré-remplir avec le mois actuel comme source et le mois suivant comme cible
    const nextMonth = getNextMonth(selectedMonth);
    setRenewData({
      sourceMonth: selectedMonth,
      targetMonth: nextMonth
    });
    setShowRenewModal(true);
  };

  const categories = formData.type === 'revenue' ? company.revenueCategories : company.expenseCategories;
  
  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight">Budgets</h2>
          <p className="text-neutral-500 text-sm mt-1">{company.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <MonthSelector selectedMonth={selectedMonth} onChange={onMonthChange} availableMonths={availableMonths} />
          {canManage && (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={openRenewModal} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 transition-colors" title="Renouveler les budgets pour un nouveau mois">
                <Icons.RefreshCw size={16} />Renouveler
              </button>
              <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
                <Icons.Plus size={16} />Nouveau Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <EmptyState 
            icon={Icons.PiggyBank} 
            title="Aucun budget" 
            description={`Aucun budget pour ${formatMonthDisplay(selectedMonth)}. Créez des budgets pour suivre vos dépenses ou renouvelez ceux d'un mois précédent.`} 
            action={canManage ? openCreateModal : null} 
            actionLabel="Créer" 
          />
          {canManage && availableMonths.length > 0 && (
            <div className="mt-4 text-center">
              <button onClick={openRenewModal} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Icons.RefreshCw size={14} className="inline mr-1" />
                Ou renouveler depuis un mois précédent
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {budgets.map(budget => {
            const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOver = percentage > 100; 
            const isWarning = percentage >= 80 && percentage < 100;
            return (
              <div key={budget.id} className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">{budget.name}</p>
                    <p className="text-xs text-neutral-500">{budget.type === 'revenue' ? 'Revenu' : 'Dépense'} • {budget.period === 'monthly' ? 'Mensuel' : budget.period === 'quarterly' ? 'Trimestriel' : 'Annuel'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(isOver || isWarning) && <Icons.AlertTriangle size={20} className={isOver ? 'text-red-400' : 'text-amber-400'} />}
                    {canManage && (
                      <>
                        <button onClick={() => openEditModal(budget)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors" title="Modifier">
                          <Icons.Edit size={14} />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(budget)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors" title="Supprimer">
                          <Icons.Trash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">Consommé</span>
                    <span className={isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}>
                      {(budget.spent || 0).toLocaleString('fr-FR')} / {(budget.amount || 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                </div>
                <p className={`text-xs ${isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-neutral-500'}`}>{percentage.toFixed(0)}% utilisé</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nouveau/Modifier Budget */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingBudget ? "Modifier le Budget" : "Nouveau Budget"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'revenue', name: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'revenue' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-neutral-700 text-neutral-400'}`}>Revenu</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense', name: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-neutral-700 text-neutral-400'}`}>Dépense</button>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Catégorie</label>
            <select value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required>
              <option value="">Sélectionner...</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Montant (FCFA)</label>
            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="0" required min="1" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Période</label>
            <select value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white">
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>
          {!editingBudget && (
            <div className="bg-neutral-800/30 rounded-lg p-3">
              <p className="text-xs text-neutral-400">
                <Icons.Calendar size={14} className="inline mr-1" />
                Ce budget sera créé pour <span className="text-white">{formatMonthDisplay(selectedMonth)}</span>
              </p>
            </div>
          )}
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting && <Icons.Loader size={18} />}
            {submitting ? (editingBudget ? 'Modification...' : 'Création...') : (editingBudget ? 'Modifier' : 'Créer')}
          </button>
        </form>
      </Modal>

      {/* Modal Renouvellement */}
      <Modal isOpen={showRenewModal} onClose={() => setShowRenewModal(false)} title="Renouveler les Budgets">
        <form onSubmit={handleRenew} className="space-y-4">
          <p className="text-sm text-neutral-400 mb-4">
            Cette action copiera tous les budgets d'un mois source vers un mois cible, avec le montant "dépensé" réinitialisé à 0.
          </p>
          
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Mois Source</label>
            <select 
              value={renewData.sourceMonth} 
              onChange={(e) => setRenewData({ ...renewData, sourceMonth: e.target.value })} 
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" 
              required
            >
              <option value="">Sélectionner...</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{formatMonthDisplay(m)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Mois Cible</label>
            <input 
              type="month" 
              value={renewData.targetMonth} 
              onChange={(e) => setRenewData({ ...renewData, targetMonth: e.target.value })} 
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" 
              required 
            />
          </div>
          
          {renewData.sourceMonth && renewData.targetMonth && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-400">
                <Icons.RefreshCw size={14} className="inline mr-1" />
                Les budgets de <span className="font-medium">{formatMonthDisplay(renewData.sourceMonth)}</span> seront copiés vers <span className="font-medium">{formatMonthDisplay(renewData.targetMonth)}</span>
              </p>
            </div>
          )}
          
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting && <Icons.Loader size={18} />}
            {submitting ? 'Renouvellement...' : 'Renouveler les Budgets'}
          </button>
        </form>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmer la suppression">
        <div className="space-y-4">
          <p className="text-neutral-400">
            Êtes-vous sûr de vouloir supprimer ce budget ?
          </p>
          {showDeleteConfirm && (
            <div className="bg-neutral-800/50 rounded-lg p-4">
              <p className="text-white font-medium">{showDeleteConfirm.name}</p>
              <p className="text-sm text-neutral-400 mt-1">
                {showDeleteConfirm.type === 'revenue' ? 'Revenu' : 'Dépense'} • 
                Budget: {(showDeleteConfirm.amount || 0).toLocaleString('fr-FR')} FCFA • 
                Consommé: {(showDeleteConfirm.spent || 0).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
              Annuler
            </button>
            <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ==================== OBJECTIVES PAGE ====================
function ObjectivesPage({ company }) {
  const { userData } = useAuth();
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [expandedObjectives, setExpandedObjectives] = useState({});
  const [objectiveForm, setObjectiveForm] = useState({ title: '', description: '', deadline: '' });
  const [stepForm, setStepForm] = useState({ title: '', description: '' });
  const [reportForm, setReportForm] = useState({ content: '', newStatus: '' });
  const [submitting, setSubmitting] = useState(false);

  const canCreateObjective = ['admin_treasury', 'project_manager'].includes(userData?.role);

  useEffect(() => { loadObjectives(); }, [company.id]);

  const loadObjectives = async () => {
    try { setLoading(true); const res = await ObjectiveAPI.getAll(company.id); setObjectives(res.data || []); }
    catch (err) { console.error('Erreur:', err); } finally { setLoading(false); }
  };

  const toggleExpand = (id) => setExpandedObjectives(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCreateObjective = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await ObjectiveAPI.create({ ...objectiveForm, companyId: company.id }); setShowObjectiveModal(false); setObjectiveForm({ title: '', description: '', deadline: '' }); loadObjectives(); }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleCreateStep = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await ObjectiveAPI.addStep(selectedObjective.id, stepForm); setShowStepModal(false); setStepForm({ title: '', description: '' }); loadObjectives(); }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleUpdateStepStatus = async (objectiveId, stepId, status) => {
    try { await ObjectiveAPI.updateStepStatus(objectiveId, stepId, status); loadObjectives(); }
    catch (err) { alert('Erreur: ' + err.message); }
  };

  const handleAddReport = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await ObjectiveAPI.addReport(selectedObjective.id, selectedStep.id, reportForm); setShowReportModal(false); setReportForm({ content: '', newStatus: '' }); loadObjectives(); }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const openStepModal = (objective) => { setSelectedObjective(objective); setShowStepModal(true); };
  const openReportModal = (objective, step) => { setSelectedObjective(objective); setSelectedStep(step); setReportForm({ content: '', newStatus: step.status }); setShowReportModal(true); };

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div><h2 className="text-xl sm:text-2xl font-light tracking-tight">Objectifs</h2><p className="text-neutral-500 text-sm mt-1">{company.name}</p></div>
        {canCreateObjective && <button onClick={() => setShowObjectiveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors self-start"><Icons.Plus size={16} />Nouvel Objectif</button>}
      </div>

      {objectives.length === 0 ? (
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <EmptyState icon={Icons.Target} title="Aucun objectif" description="Créez des objectifs pour suivre vos projets." action={canCreateObjective ? () => setShowObjectiveModal(true) : null} actionLabel="Créer" />
        </div>
      ) : (
        <div className="space-y-4">
          {objectives.map(obj => {
            const isExpanded = expandedObjectives[obj.id];
            const steps = obj.steps || [];
            const completedSteps = steps.filter(s => s.status === 'done').length;
            const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;
            return (
              <div key={obj.id} className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
                <div className="p-4 sm:p-6 cursor-pointer" onClick={() => toggleExpand(obj.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-medium text-white">{obj.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${obj.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : obj.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                          {obj.status === 'completed' ? 'Terminé' : obj.status === 'in_progress' ? 'En cours' : 'À faire'}
                        </span>
                      </div>
                      {obj.description && <p className="text-sm text-neutral-400 mb-3">{obj.description}</p>}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex-1 min-w-[80px] max-w-xs">
                          <MiniProgressBar value={completedSteps} max={steps.length || 1} color="bg-blue-500" showLabel={false} />
                        </div>
                        <span className="text-xs text-neutral-400">{completedSteps}/{steps.length} étapes</span>
                        {obj.deadline && <span className="text-xs text-neutral-500">Échéance: {obj.deadline}</span>}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">{isExpanded ? <Icons.ChevronUp size={20} className="text-neutral-400" /> : <Icons.ChevronDown size={20} className="text-neutral-400" />}</div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-neutral-800/50 p-4 sm:p-6 bg-neutral-900/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm text-neutral-400 uppercase tracking-wider">Étapes</h4>
                      <button onClick={() => openStepModal(obj)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"><Icons.Plus size={14} />Ajouter</button>
                    </div>
                    {steps.length === 0 ? (
                      <p className="text-neutral-500 text-sm text-center py-4">Aucune étape définie</p>
                    ) : (
                      <div className="space-y-3">
                        {steps.map(step => {
                          const statusConfig = STEP_STATUSES.find(s => s.id === step.status) || STEP_STATUSES[0];
                          return (
                            <div key={step.id} className="bg-neutral-800/30 rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                                    <span className="text-sm text-white">{step.title}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] ${statusConfig.color}`}>{statusConfig.label}</span>
                                  </div>
                                  {step.description && <p className="text-xs text-neutral-500 ml-4">{step.description}</p>}
                                  {step.reports && step.reports.length > 0 && (
                                    <div className="ml-4 mt-2 space-y-1">
                                      {step.reports.slice(-2).map(r => (
                                        <div key={r.id} className="text-xs text-neutral-400 flex items-start gap-2">
                                          <Icons.MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                                          <div><span className="text-neutral-500">{r.createdByName}:</span> {r.content.substring(0, 100)}{r.content.length > 100 && '...'}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 sm:ml-4">
                                  <select value={step.status} onChange={(e) => handleUpdateStepStatus(obj.id, step.id, e.target.value)} className="text-xs bg-neutral-700/50 border border-neutral-600/50 rounded px-2 py-1 text-white">
                                    {STEP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                  </select>
                                  <button onClick={() => openReportModal(obj, step)} className="p-1.5 bg-neutral-700/50 rounded hover:bg-neutral-600/50 transition-colors" title="Ajouter un compte-rendu"><Icons.FileText size={14} className="text-neutral-400" /></button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nouvel Objectif */}
      <Modal isOpen={showObjectiveModal} onClose={() => setShowObjectiveModal(false)} title="Nouvel Objectif">
        <form onSubmit={handleCreateObjective} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Titre</label><input type="text" value={objectiveForm.title} onChange={(e) => setObjectiveForm({ ...objectiveForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Titre de l'objectif" required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label><textarea value={objectiveForm.description} onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white h-24" placeholder="Description..." /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Échéance</label><input type="date" value={objectiveForm.deadline} onChange={(e) => setObjectiveForm({ ...objectiveForm, deadline: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" /></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Créer'}</button>
        </form>
      </Modal>

      {/* Modal Nouvelle Étape */}
      <Modal isOpen={showStepModal} onClose={() => setShowStepModal(false)} title="Nouvelle Étape">
        <form onSubmit={handleCreateStep} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Titre</label><input type="text" value={stepForm.title} onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Titre de l'étape" required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label><textarea value={stepForm.description} onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white h-24" placeholder="Description..." /></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Créer'}</button>
        </form>
      </Modal>

      {/* Modal Compte-rendu */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Compte-rendu">
        <form onSubmit={handleAddReport} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Contenu</label><textarea value={reportForm.content} onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white h-32" placeholder="Décrivez l'avancement..." required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Nouveau Statut</label><select value={reportForm.newStatus} onChange={(e) => setReportForm({ ...reportForm, newStatus: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white">{STEP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Envoi...' : 'Envoyer'}</button>
        </form>
      </Modal>
    </div>
  );
}

// ==================== PORTFOLIO GLOBAL PAGE ====================
// Vue consolidée d'un parent + ses départements (ex: Abayili Investissement +
// Réseau Cryptos/FCP/RTA/RPP) : trésorerie cumulée depuis le début (toutes
// transactions validées, pas de filtre de mois) pour répondre à "où est le
// cash, tous réseaux confondus".
//
// Réconciliation : en plus du calcul fait depuis les transactions de l'app,
// affiche un chiffre de référence indépendant (lu directement dans les
// fichiers Excel/Drive de l'utilisateur, alimenté manuellement pour l'instant
// via AnalyticsAPI.getReferenceCash) pour repérer un écart entre les deux
// sources plutôt que de vérifier l'app contre elle-même.
const REFERENCE_TOLERANCE_FCFA = 100;

// Vue au niveau du holding entier (pas juste Abayili Investissement) :
// distingue le CASH réel (Abayili Investissement, Consulting, AI for Afrika,
// Gourmandises Africaines - de l'argent disponible) du CAPITAL PLACÉ (les
// départements Réseau Cryptos/FCP/RTA/RPP - de la valeur immobilisée dans des
// actifs/positions, pas du cash mobilisable). Les additionner sans distinction
// donnerait une fausse impression de liquidité disponible.
function PortfolioGlobalPage() {
  const [loading, setLoading] = useState(true);
  const [entityStats, setEntityStats] = useState([]);

  useEffect(() => { loadPortfolio(); }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const allEntities = Object.values(COMPANIES);
      const results = await Promise.all(
        allEntities.map(async (comp) => {
          let txs = [];
          try {
            const res = await TransactionAPI.getAll(comp.id);
            txs = (res.data || []).filter(t => t.status === 'validated' && t.date);
          } catch { /* pas encore de transactions pour cette entité */ }

          const revenue = txs.filter(t => t.type === 'revenue').reduce((s, t) => s + (t.amount || 0), 0);
          const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);

          // Pour le capital placé : sépare le capital (apports/retraits) du
          // gain réel, même logique que RendementWidget - nécessaire pour
          // le Rendement Global du Capital Risque plus bas. "Charges
          // Financières RESERVES" = achat d'actifs (ex: cryptos) avec le
          // capital déjà compté - exclu, sinon ça compte comme une perte un
          // argent juste transformé en une autre forme d'actif (constaté
          // concrètement sur RC Actifs : -100% de rendement affiché alors
          // que le capital était juste investi, pas perdu).
          const isPlacement = (comp.liquidity || 'cash') === 'placé';
          const isCapitalOrReserve = (t) => t.category === 'Apport Capital' || t.category === 'Charges Financières RESERVES';
          const apports = isPlacement ? txs.filter(t => t.type === 'revenue' && t.category === 'Apport Capital').reduce((s, t) => s + (t.amount || 0), 0) : 0;
          const retraits = isPlacement ? txs.filter(t => t.type === 'expense' && t.category === 'Apport Capital').reduce((s, t) => s + (t.amount || 0), 0) : 0;
          const capitalNet = apports - retraits;
          const gainsReels = isPlacement ? txs.filter(t => t.type === 'revenue' && !isCapitalOrReserve(t)).reduce((s, t) => s + (t.amount || 0), 0) : 0;
          const chargesReelles = isPlacement ? txs.filter(t => t.type === 'expense' && !isCapitalOrReserve(t)).reduce((s, t) => s + (t.amount || 0), 0) : 0;
          let gainsCR = gainsReels - chargesReelles;

          // Pour une entité "capital placé", le cash affiché doit être la
          // VALEUR totale (capital + gain), pas juste le résidu de FCFA non
          // encore investi (revenue - expense sous-évalue massivement dès
          // qu'une partie du capital est passée en cryptos, ex: RC Actifs).
          let cash = isPlacement ? capitalNet + gainsCR : revenue - expense;

          // FCP n'a pas de gain "réalisé" (aucune API, aucun retrait
          // profitable pour l'instant) - son relevé manuel de valeur est la
          // seule source fiable de sa performance réelle, donc on l'utilise
          // à la place du calcul par transactions pour ce cas précis.
          if (comp.id === 'abayili_invest_fcp') {
            try {
              const snapRes = await ValuationAPI.getAll(comp.id);
              const snaps = (snapRes.data || []).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
              if (snaps.length > 0) {
                const latestValue = snaps[snaps.length - 1].value;
                gainsCR = latestValue - capitalNet;
                cash = latestValue;
              }
            } catch { /* pas de relevé - reste sur le calcul par transactions */ }
          }

          let reference = null;
          try {
            const refRes = await AnalyticsAPI.getReferenceCash(comp.id);
            reference = refRes.data || null;
          } catch { /* pas de référence renseignée pour cette entité */ }

          const ecart = reference ? cash - reference.cash : null;
          return { id: comp.id, name: comp.name, liquidity: comp.liquidity || 'cash', revenue, expense, cash, capitalNet, gainsCR, reference, ecart, txs };
        })
      );
      setEntityStats(results);
    } catch (err) {
      console.error('Erreur chargement portefeuille global:', err);
    } finally {
      setLoading(false);
    }
  };

  const cashEntities = entityStats.filter(e => e.liquidity === 'cash');
  const placeEntities = entityStats.filter(e => e.liquidity === 'placé');
  const totalCash = cashEntities.reduce((s, e) => s + e.cash, 0);
  const totalPlace = placeEntities.reduce((s, e) => s + e.cash, 0);
  const entitiesWithReference = entityStats.filter(e => e.reference);
  const donutData = entityStats.filter(e => e.cash > 0).map(e => ({ name: e.name, value: e.cash }));

  // --- Bilan Global / Rendement Global du fonds ---
  // Le Capital Risque (RC, RC Trading, FCP, RTA, RPP) a une vraie base de
  // capital investi -> un rendement % a du sens et se calcule en poolant
  // gains et capital de toutes ces entités. Les sociétés opérationnelles
  // (Consulting, AI for Afrika, Gourmandises) n'ont pas cette notion de
  // capital apporté - leur contribution au fonds est leur résultat net,
  // additionné en FCFA plutôt que mélangé dans un pourcentage qui n'aurait
  // pas de sens sans base de comparaison commune.
  const totalCapitalCR = placeEntities.reduce((s, e) => s + (e.capitalNet || 0), 0);
  const totalGainsCR = placeEntities.reduce((s, e) => s + (e.gainsCR || 0), 0);
  const rendementGlobalCRPct = totalCapitalCR > 0 ? (totalGainsCR / totalCapitalCR) * 100 : 0;
  const creationValeurTotale = totalGainsCR + totalCash;

  // Courbe d'évolution globale : cumul mensuel poolé de TOUTES les
  // entités (gain réel du Capital Risque + résultat net des sociétés
  // opérationnelles). Ne peut pas intégrer le relevé manuel du FCP (un
  // seul point dans le temps, pas d'historique) - noté sous la courbe.
  const byMonthGlobal = {};
  entityStats.forEach(e => {
    (e.txs || []).forEach(t => {
      const month = t.date.substring(0, 7);
      if (!byMonthGlobal[month]) byMonthGlobal[month] = 0;
      if (e.liquidity === 'placé' && (t.category === 'Apport Capital' || t.category === 'Charges Financières RESERVES')) return; // mouvement de capital ou achat d'actif, pas une performance
      if (t.type === 'revenue') byMonthGlobal[month] += (t.amount || 0);
      else if (t.type === 'expense') byMonthGlobal[month] -= (t.amount || 0);
    });
  });
  const sortedGlobalMonths = Object.keys(byMonthGlobal).sort();
  let runningGlobal = 0;
  const globalEvolutionPoints = sortedGlobalMonths.map(month => {
    runningGlobal += byMonthGlobal[month];
    const [y, m] = month.split('-').map(Number);
    return { label: `${MONTH_LABELS_FR[m - 1]} ${String(y).slice(2)}`, value: runningGlobal };
  });

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Icons.Loader size={32} className="text-neutral-400" />
    </div>
  );

  const renderSection = (title, icon, entities, total, tint) => {
    const SectionIcon = Icons[icon];
    return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-neutral-800/50">
        <div>
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">{title}</h3>
          <p className={`text-lg font-light mt-1 ${tint}`}>{total >= 0 ? '+' : ''}{total.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <SectionIcon size={18} className="text-neutral-500" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800/50">
              <th className="text-left px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Entité</th>
              <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Calculé (app)</th>
              <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Référence (Excel)</th>
              <th className="text-right px-6 py-3 text-xs text-neutral-500 uppercase tracking-wider font-normal">Écart</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((e, i) => {
              const hasRef = !!e.reference;
              const isOk = hasRef && Math.abs(e.ecart) <= REFERENCE_TOLERANCE_FCFA;
              return (
                <tr key={e.id} className={`border-b border-neutral-800/30 last:border-0 ${i % 2 !== 0 ? 'bg-neutral-900/20' : ''}`}>
                  <td className="px-6 py-4 text-sm text-white">{e.name}</td>
                  <td className={`px-6 py-4 text-sm text-right ${e.cash >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{e.cash >= 0 ? '+' : ''}{e.cash.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">
                    {hasRef ? `${e.reference.cash.toLocaleString('fr-FR')} FCFA` : <span className="text-neutral-600 italic">Non renseigné</span>}
                    {hasRef && e.reference.asOf && <div className="text-[10px] text-neutral-600 mt-0.5">au {e.reference.asOf}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {hasRef ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {e.ecart >= 0 ? '+' : ''}{e.ecart.toLocaleString('fr-FR')} FCFA
                      </span>
                    ) : <span className="text-neutral-600">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-light tracking-tight">Portefeuille Global</h2>
        <p className="text-neutral-500 text-sm mt-1">Bilan consolidé du fonds Abayili Investissement — toutes sociétés et départements confondus</p>
      </div>

      {/* Bilan Global / Rendement Global du fonds - vue "coup d'œil" qui
          répond à "est-ce que le fonds, dans son ensemble, performe ?",
          en plus du détail par entité plus bas. */}
      <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden mb-8">
        <div className="p-6 pb-4">
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Bilan Global du Fonds</h3>
          <p className="text-[11px] text-neutral-600 mt-1">Capital Risque (RC, RC Trading, FCP, RTA, RPP) poolé pour un rendement global, activités opérationnelles en résultat net séparé</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-6">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Capital Risque investi</p>
            <p className="text-sm text-white">{totalCapitalCR.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Rendement Global (Capital Risque)</p>
            <p className={`text-sm font-medium ${totalGainsCR >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{totalGainsCR >= 0 ? '+' : ''}{totalGainsCR.toLocaleString('fr-FR')} FCFA ({totalGainsCR >= 0 ? '+' : ''}{rendementGlobalCRPct.toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Résultat Net Opérationnel</p>
            <p className={`text-sm ${totalCash >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{totalCash >= 0 ? '+' : ''}{totalCash.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Création de Valeur Totale</p>
            <p className={`text-sm font-medium ${creationValeurTotale >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{creationValeurTotale >= 0 ? '+' : ''}{creationValeurTotale.toLocaleString('fr-FR')} FCFA</p>
          </div>
        </div>
        {globalEvolutionPoints.length > 0 && (
          <div className="px-6 pb-6">
            <p className="text-[11px] text-neutral-500 mb-3">Évolution cumulée (gains Capital Risque réalisés + résultat net opérationnel), mois par mois</p>
            <EvolutionChart points={globalEvolutionPoints} formatValue={(v) => `${(v / 1000).toFixed(1)}k`} />
            <p className="text-[10px] text-neutral-600 mt-2">Le gain latent du FCP (relevé manuel, voir sa page dédiée) n'est pas dans cette courbe - un seul relevé ne fait pas d'historique.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MetricCard label="Cash Disponible (Abayili Invest, Consulting, AI for Afrika, Gourmandises)" value={`${totalCash >= 0 ? '+' : ''}${totalCash.toLocaleString('fr-FR')} FCFA`} positive={totalCash >= 0} icon="PiggyBank" />
        <MetricCard label="Capital Placé (Cryptos, FCP, RTA, RPP — immobilisé, pas mobilisable)" value={`${totalPlace >= 0 ? '+' : ''}${totalPlace.toLocaleString('fr-FR')} FCFA`} positive={totalPlace >= 0} icon="TrendingUp" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-neutral-900/50 rounded-2xl p-4 sm:p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Répartition (toutes entités)</h3>
            <Icons.PieChart size={16} className="text-neutral-500" />
          </div>
          <DonutChart data={donutData} title="Par entité" size={160} />
        </div>
        <div className="lg:col-span-2 flex items-center">
          <p className="text-xs text-neutral-500 leading-relaxed">
            <Icons.AlertTriangle size={14} className="inline mr-1.5 text-amber-400" />
            Le cash et le capital placé sont volontairement séparés : le capital placé (crypto détenue, positions de paris en cours) a de la valeur mais n'est pas immédiatement disponible comme le cash en compte. Les additionner donnerait une fausse impression de liquidité.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {renderSection('Cash Disponible', 'PiggyBank', cashEntities, totalCash, 'text-emerald-400')}
        {renderSection('Capital Placé', 'TrendingUp', placeEntities, totalPlace, 'text-amber-400')}
      </div>

      {entitiesWithReference.length > 0 && (
        <div className="mt-4 text-[11px] text-neutral-500">
          Écart ≤ {REFERENCE_TOLERANCE_FCFA} FCFA considéré comme concordant (arrondis). La référence est mise à jour manuellement depuis les fichiers Excel du Drive.
        </div>
      )}
    </div>
  );
}

// ==================== MAIN LAYOUT ====================
function MainLayout() {
  const { userData, userDataError, signOut } = useAuth();
  const getUserRole = () => {
    const roles = { admin_treasury: { name: 'Directeur Trésorerie', color: 'bg-purple-500/10 text-purple-400' }, project_manager: { name: 'Chef de Projet', color: 'bg-blue-500/10 text-blue-400' }, collaborator: { name: 'Collaborateur', color: 'bg-neutral-500/10 text-neutral-400' } };
    return roles[userData?.role] || roles.collaborator;
  };

  const [activeCompany, setActiveCompany] = useState('abayili_invest');
  const [activeView, setActiveView] = useState('portfolio_global');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const company = COMPANIES[activeCompany];
  const userRole = getUserRole();
  const hasCompanyAccess = (id) =>
    userData?.role === 'admin_treasury' ||
    !userData?.companies?.length ||
    userData.companies.includes(id);

  // Seules les sociétés sans parent apparaissent à plat dans la sidebar ;
  // les départements sont rendus en sous-liste sous leur parent (voir aside).
  const accessibleCompanies = Object.values(COMPANIES).filter(c => !c.parentId && hasCompanyAccess(c.id));

  const toggleGroup = (id) => setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));

  // Portefeuille Global est une vue au niveau du holding entier (toutes les
  // sociétés + tous les départements), pas juste Abayili Investissement -
  // donc toujours disponible, quelle que soit la société active.
  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', Icon: Icons.BarChart3 },
    { id: 'transactions', label: 'Transactions', Icon: Icons.Receipt },
    { id: 'budgets', label: 'Budgets', Icon: Icons.PiggyBank },
    { id: 'objectives', label: 'Objectifs', Icon: Icons.Target },
    { id: 'portfolio_global', label: 'Portefeuille Global', Icon: Icons.PieChart }
  ];

  // Réinitialiser le mois lors du changement d'entreprise. Abayili
  // Investissement est le holding/fonds qui chapeaute tout le reste - y
  // arriver doit montrer directement le bilan consolidé (Portefeuille
  // Global), pas juste sa propre activité directe (Commissions).
  const handleCompanyChange = (companyId) => {
    setActiveCompany(companyId);
    setActiveView(companyId === 'abayili_invest' ? 'portfolio_global' : 'dashboard');
    setSelectedMonth(getCurrentMonth());
    setMobileMenuOpen(false);
  };

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-light">
      {userDataError && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-center text-xs text-red-400 sticky top-0 z-[60]">
          <Icons.AlertTriangle size={12} className="inline mr-1.5" />
          Profil non chargé ({userDataError}) — rôle et accès affichés par défaut, pas les vrais. Recharge la page ; si ça persiste, transmets ce message.
        </div>
      )}
      <header className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white lg:hidden" aria-label="Ouvrir le menu">
                <Icons.Menu size={20} />
              </button>
              <h1 className="text-lg sm:text-xl tracking-tight font-normal truncate"><span className="text-neutral-500">Abayili</span><span className="text-white ml-1">Holdings</span></h1>
              <div className="h-6 w-px bg-neutral-800 hidden md:block"></div>
              <span className="text-xs text-neutral-500 tracking-wider uppercase hidden md:inline">Gestion d'Entreprise</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${userRole?.color || 'bg-neutral-500/10 text-neutral-400'}`}>
                <Icons.User size={14} />{userData?.name || 'Utilisateur'} - {userRole?.name || 'Collaborateur'}
              </div>
              <div className={`flex sm:hidden items-center justify-center w-8 h-8 rounded-full ${userRole?.color || 'bg-neutral-500/10 text-neutral-400'}`} title={`${userData?.name || 'Utilisateur'} - ${userRole?.name || 'Collaborateur'}`}>
                <Icons.User size={14} />
              </div>
              <button onClick={signOut} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"><Icons.LogOut size={18} /></button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-neutral-900 overflow-y-auto transform transition-transform duration-300 ease-in-out
          lg:relative lg:z-auto lg:translate-x-0 lg:w-72 lg:min-h-[calc(100vh-73px)] lg:border-r lg:border-neutral-800/50 lg:bg-neutral-900/30
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-neutral-800/50 lg:hidden">
            <span className="text-sm text-white">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white" aria-label="Fermer le menu">
              <Icons.X size={18} />
            </button>
          </div>
          <div className="p-4 border-b border-neutral-800/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Entreprise</p>
            <div className="space-y-1">
              {accessibleCompanies.map(comp => {
                const CompIcon = Icons[comp.icon] || Icons.Building2;
                const isActive = comp.id === activeCompany;
                const hasDepartments = !!comp.departments?.length;
                const isExpanded = expandedGroups[comp.id] ?? (isActive || comp.departments?.includes(activeCompany));
                return (
                  <div key={comp.id}>
                    <div className={`w-full flex items-center gap-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-white/5 text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}>
                      <button onClick={() => handleCompanyChange(comp.id)} className="flex-1 flex items-center gap-3 px-3 py-2.5 min-w-0 text-left">
                        <CompIcon size={18} />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm truncate">{comp.name}</p>
                          <p className="text-[10px] text-neutral-500 truncate">{comp.description}</p>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>}
                      </button>
                      {hasDepartments && (
                        <button onClick={() => toggleGroup(comp.id)} className="p-2 mr-1 hover:bg-white/5 rounded-lg text-neutral-500 hover:text-white flex-shrink-0" title={isExpanded ? 'Réduire les départements' : 'Déplier les départements'}>
                          {isExpanded ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />}
                        </button>
                      )}
                    </div>
                    {hasDepartments && isExpanded && (
                      <div className="ml-4 pl-3 border-l border-neutral-800/50 mt-1 space-y-0.5">
                        {comp.departments.filter(id => hasCompanyAccess(id)).map(deptId => {
                          const dept = COMPANIES[deptId];
                          if (!dept) return null;
                          const DeptIcon = Icons[dept.icon] || Icons.Building2;
                          const isDeptActive = deptId === activeCompany;
                          return (
                            <button key={deptId} onClick={() => handleCompanyChange(deptId)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${isDeptActive ? 'bg-white/5 text-white' : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.02]'}`}>
                              <DeptIcon size={14} />
                              <span className="text-xs truncate flex-1 text-left">{dept.name}</span>
                              {isDeptActive && <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <nav className="p-4">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Navigation</p>
            <div className="space-y-1">
              {navItems.map(item => {
                const isActive = item.id === activeView;
                return (
                  <button key={item.id} onClick={() => handleViewChange(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}>
                    <item.Icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>
        <main className="flex-1 min-w-0 min-h-[calc(100vh-73px)] overflow-auto">
          {activeView === 'dashboard' && <DashboardPage company={company} onNavigate={setActiveView} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />}
          {activeView === 'transactions' && <TransactionsPage company={company} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />}
          {activeView === 'budgets' && <BudgetsPage company={company} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />}
          {activeView === 'objectives' && <ObjectivesPage company={company} />}
          {activeView === 'portfolio_global' && <PortfolioGlobalPage />}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
