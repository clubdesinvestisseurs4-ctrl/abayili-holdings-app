// Application Principale - Abayili Holdings
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionAPI, BudgetAPI, ObjectiveAPI, AnalyticsAPI } from './services/api';

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
  Trash2: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  ArrowUpRight: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  ArrowDownRight: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" x2="17" y1="7" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>,
  Clock: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  CheckCircle2: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  AlertTriangle: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  TrendingUp: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  ChevronDown: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  User: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Loader: ({ size = 24, className = '' }) => <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
};

// ==================== COMPANIES CONFIG ====================
const COMPANIES = {
  abayili_invest: {
    id: 'abayili_invest',
    name: 'Abayili Investissement',
    shortName: 'AI',
    description: 'Société de Capital-Risque',
    icon: 'Building2',
    revenueCategories: [
      { id: 'commissions', name: 'Commissions', icon: '💰' },
      { id: 'dividendes', name: 'Dividendes', icon: '📈' },
      { id: 'trading', name: 'Trading Algorithmique', icon: '🤖' },
      { id: 'paris_sportifs', name: 'Paris Sportifs (RPP)', icon: '⚽' },
      { id: 'crypto', name: 'Stratégies Crypto (RSC)', icon: '₿' }
    ],
    expenseCategories: [
      { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' },
      { id: 'charges_variables', name: 'Charges Variables', icon: '📊' },
      { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }
    ]
  },
  abayili_consulting: {
    id: 'abayili_consulting',
    name: 'Abayili Consulting',
    shortName: 'AC',
    description: 'Consulting, Formation & Conférences',
    icon: 'GraduationCap',
    revenueCategories: [
      { id: 'formations', name: 'Ventes de Formations', icon: '📚' },
      { id: 'consulting', name: 'Missions Consulting', icon: '💼' },
      { id: 'conferences', name: 'Conférences', icon: '🎤' }
    ],
    expenseCategories: [
      { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' },
      { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }
    ]
  },
  ai_for_afrika: {
    id: 'ai_for_afrika',
    name: 'AI for Afrika',
    shortName: 'AFA',
    description: 'Intelligence Artificielle & Développement',
    icon: 'Brain',
    revenueCategories: [
      { id: 'contrats_dev', name: 'Contrats de Développement', icon: '💻' },
      { id: 'licences', name: 'Licences Logicielles', icon: '📜' },
      { id: 'maintenance', name: 'Maintenance & Support', icon: '🔧' }
    ],
    expenseCategories: [
      { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' },
      { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }
    ]
  }
};

// ==================== COMPONENTS ====================

// Metric Card
function MetricCard({ label, value, trend, trendUp, positive, subtitle, icon, warning }) {
  const IconComponent = icon ? Icons[icon] : null;
  return (
    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
        {IconComponent && <IconComponent size={16} className={warning ? 'text-amber-400' : 'text-neutral-500'} />}
      </div>
      <p className={`text-2xl font-light ${positive !== undefined ? (positive ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
        {value}
      </p>
      {trend && <p className={`text-xs mt-2 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</p>}
      {subtitle && <p className="text-xs text-neutral-500 mt-2">{subtitle}</p>}
    </div>
  );
}

// Progress Bar
function ProgressBar({ value, max, showLabel = true }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOverBudget = value > max;
  const isNearLimit = percentage >= 80 && percentage < 100;
  const barColor = isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="w-full">
      <div className="w-full bg-neutral-800 rounded-full overflow-hidden h-2">
        <div className={`${barColor} rounded-full transition-all duration-500 h-2`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs">
          <span className={isOverBudget ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-neutral-400'}>
            {value.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="text-neutral-500">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

// Loading Spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950">
      <div className="text-center">
        <Icons.Loader size={48} className="text-white mx-auto mb-4" />
        <p className="text-neutral-400">Chargement...</p>
      </div>
    </div>
  );
}

// ==================== PAGES ====================

// Login Page
function LoginPage() {
  const { signIn, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    try {
      await signIn(email, password);
      // La redirection se fera automatiquement via le check isAuthenticated
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight">
            <span className="text-neutral-500">Abayili</span>
            <span className="text-white ml-2">Holdings</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Gestion d'Entreprise</p>
        </div>

        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-8">
          <h2 className="text-xl font-light mb-6">Connexion</h2>

          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Icons.Loader size={18} />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Dashboard Page
function DashboardPage({ company, onNavigate }) {
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalExpenses: 0, netResult: 0, pendingExpenses: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [company.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, transactionsRes] = await Promise.all([
        AnalyticsAPI.getMetrics(company.id),
        TransactionAPI.getAll(company.id)
      ]);
      setMetrics(metricsRes.data);
      setTransactions(transactionsRes.data || []);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Icons.Loader size={32} className="mx-auto text-neutral-400" /></div>;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light tracking-tight">{company.name}</h2>
          <p className="text-neutral-500 text-sm mt-1">{company.description}</p>
        </div>
        <button onClick={() => onNavigate('transactions')} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
          <Icons.Plus size={16} />
          Nouvelle Transaction
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Revenus du Mois" value={`${metrics.totalRevenue?.toLocaleString('fr-FR') || 0} FCFA`} icon="ArrowUpRight" />
        <MetricCard label="Dépenses du Mois" value={`${metrics.totalExpenses?.toLocaleString('fr-FR') || 0} FCFA`} icon="ArrowDownRight" />
        <MetricCard label="Résultat Net" value={`${metrics.netResult >= 0 ? '+' : ''}${metrics.netResult?.toLocaleString('fr-FR') || 0} FCFA`} positive={metrics.netResult >= 0} icon="TrendingUp" />
        <MetricCard label="En Attente" value={`${metrics.pendingExpenses?.toLocaleString('fr-FR') || 0} FCFA`} icon="Clock" warning={metrics.pendingExpenses > 0} />
      </div>

      <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-neutral-400">Transactions Récentes</h3>
          <Icons.Receipt size={16} className="text-neutral-500" />
        </div>
        {recentTransactions.length === 0 ? (
          <p className="text-neutral-500 text-sm">Aucune transaction</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-neutral-800/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'revenue' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {t.type === 'revenue' ? <Icons.ArrowUpRight size={14} className="text-emerald-400" /> : <Icons.ArrowDownRight size={14} className="text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm text-white">{t.description}</p>
                    <p className="text-xs text-neutral-500">{t.category}</p>
                  </div>
                </div>
                <span className={`text-sm ${t.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.type === 'revenue' ? '+' : '-'}{t.amount?.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main Layout with Navigation
function MainLayout() {
  const { userData, signOut, getUserRole } = useAuth();
  const [activeCompany, setActiveCompany] = useState('abayili_invest');
  const [activeView, setActiveView] = useState('dashboard');

  const company = COMPANIES[activeCompany];
  const userRole = getUserRole();
  const IconComponent = Icons[company?.icon] || Icons.Building2;

  const accessibleCompanies = Object.values(COMPANIES).filter(c => 
    !userData?.companies?.length || userData.companies.includes(c.id)
  );

  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', Icon: Icons.BarChart3 },
    { id: 'transactions', label: 'Transactions', Icon: Icons.Receipt },
    { id: 'budgets', label: 'Budgets', Icon: Icons.PiggyBank },
    { id: 'objectives', label: 'Objectifs', Icon: Icons.Target }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-light">
      {/* Header */}
      <header className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl tracking-tight font-normal">
                <span className="text-neutral-500">Abayili</span>
                <span className="text-white ml-1">Holdings</span>
              </h1>
              <div className="h-6 w-px bg-neutral-800"></div>
              <span className="text-xs text-neutral-500 tracking-wider uppercase">Gestion d'Entreprise</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${userRole?.color || 'bg-neutral-500/10 text-neutral-400'}`}>
                <Icons.User size={14} />
                {userData?.name || 'Utilisateur'} - {userRole?.name || 'N/A'}
              </div>
              <button onClick={signOut} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white">
                <Icons.LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-73px)] border-r border-neutral-800/50 bg-neutral-900/30">
          <div className="p-4 border-b border-neutral-800/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Entreprise</p>
            <div className="space-y-1">
              {accessibleCompanies.map(comp => {
                const CompIcon = Icons[comp.icon] || Icons.Building2;
                const isActive = comp.id === activeCompany;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setActiveCompany(comp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-white/5 text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}
                  >
                    <CompIcon size={18} />
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm truncate">{comp.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{comp.description}</p>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </button>
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
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}
                  >
                    <item.Icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)] overflow-auto">
          {activeView === 'dashboard' && <DashboardPage company={company} onNavigate={setActiveView} />}
          {activeView === 'transactions' && <div className="p-8"><h2 className="text-2xl">Transactions - {company.name}</h2><p className="text-neutral-500 mt-2">Page en cours de chargement...</p></div>}
          {activeView === 'budgets' && <div className="p-8"><h2 className="text-2xl">Budgets - {company.name}</h2><p className="text-neutral-500 mt-2">Page en cours de chargement...</p></div>}
          {activeView === 'objectives' && <div className="p-8"><h2 className="text-2xl">Objectifs - {company.name}</h2><p className="text-neutral-500 mt-2">Page en cours de chargement...</p></div>}
        </main>
      </div>
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ==================== APP ====================
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
