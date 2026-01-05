// Application Principale - Abayili Holdings
import { useState, useEffect } from 'react';
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
  FileText: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Trash2: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  MessageSquare: ({ size = 24, className = '' }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

// ==================== COMPANIES CONFIG ====================
const COMPANIES = {
  abayili_invest: { id: 'abayili_invest', name: 'Abayili Investissement', shortName: 'AI', description: 'Société de Capital-Risque', icon: 'Building2',
    revenueCategories: [{ id: 'commissions', name: 'Commissions', icon: '💰' }, { id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }],
    expenseCategories: [{ id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_financières_RESERVES', name: 'Charges Financières RESERVES', icon: '🏢' }, { id: 'charges_financières_Apport_capital', name: 'Charges Financières Apport Capital', icon: '🏢' }, { id: 'charges_fixes_donations', name: 'Charges Fixes Donations', icon: '🏢' }, { id: 'charges_fixes_frais_opérationnels', name: 'Charges Fixes Frais Opérationnels', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  },
  abayili_consulting: { id: 'abayili_consulting', name: 'Abayili Consulting', shortName: 'AC', description: 'Consulting, Formation & Conférences', icon: 'GraduationCap',
    revenueCategories: [{ id: 'formations', name: 'Ventes de Formations', icon: '📚' }, { id: 'consulting', name: 'Missions Consulting', icon: '💼' }, { id: 'conferences', name: 'Conférences', icon: '🎤' }, { id: 'produits_financiers', name: 'Produits Financiers', icon: '📈' }],
    expenseCategories: [{ id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  },
  ai_for_afrika: { id: 'ai_for_afrika', name: 'AI for Afrika', shortName: 'AFA', description: 'Intelligence Artificielle & Développement', icon: 'Brain',
    revenueCategories: [{ id: 'contrats_dev', name: 'Contrats de Développement', icon: '💻' }, { id: 'licences', name: 'Licences Logicielles', icon: '📜' }, { id: 'maintenance', name: 'Maintenance & Support', icon: '🔧' }],
    expenseCategories: [{ id: 'charges_fixes_frais_opérationnels', name: 'Charges Fixes Frais Opérationnels', icon: '🏢' }, { id: 'charges_fixes', name: 'Charges Fixes', icon: '🏢' }, { id: 'charges_variables', name: 'Charges Variables', icon: '📊' }, { id: 'charges_financières', name: 'Charges Financières', icon: '🏢' }, { id: 'charges_exceptionnelles', name: 'Charges Exceptionnelles', icon: '⚡' }]
  }
};

const STEP_STATUSES = [
  { id: 'todo', label: 'À faire', color: 'bg-neutral-500/10 text-neutral-400', dot: 'bg-neutral-400' },
  { id: 'in_progress', label: 'En cours', color: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
  { id: 'waiting_validation', label: 'En attente validation', color: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400' },
  { id: 'done', label: 'Terminée', color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' }
];

// ==================== CHART COMPONENTS ====================

// Graphique en barres pour revenus/dépenses
function BarChart({ data, height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-neutral-500 text-sm">
        Aucune donnée disponible
      </div>
    );
  }

  const maxValue = Math.max(...data.flatMap(d => [d.revenue || 0, d.expense || 0]), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 400 ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Lignes de grille */}
        {[0, 25, 50, 75, 100].map(p => (
          <g key={p}>
            <line x1="40" y1={height - 30 - (p / 100) * (height - 50)} x2="390" y2={height - 30 - (p / 100) * (height - 50)} stroke="#333" strokeWidth="1" strokeDasharray="4" />
            <text x="35" y={height - 26 - (p / 100) * (height - 50)} fill="#666" fontSize="10" textAnchor="end">
              {((maxValue * p) / 100 / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        
        {/* Barres */}
        {data.map((item, i) => {
          const x = 50 + i * (340 / data.length);
          const barW = (340 / data.length) * 0.35;
          const revenueH = ((item.revenue || 0) / maxValue) * (height - 50);
          const expenseH = ((item.expense || 0) / maxValue) * (height - 50);
          
          return (
            <g key={i}>
              {/* Barre revenus */}
              <rect x={x} y={height - 30 - revenueH} width={barW} height={revenueH} fill="#10b981" rx="2" className="transition-all duration-300 hover:opacity-80">
                <title>Revenus: {(item.revenue || 0).toLocaleString('fr-FR')} FCFA</title>
              </rect>
              {/* Barre dépenses */}
              <rect x={x + barW + 4} y={height - 30 - expenseH} width={barW} height={expenseH} fill="#ef4444" rx="2" className="transition-all duration-300 hover:opacity-80">
                <title>Dépenses: {(item.expense || 0).toLocaleString('fr-FR')} FCFA</title>
              </rect>
              {/* Label mois */}
              <text x={x + barW + 2} y={height - 10} fill="#888" fontSize="11" textAnchor="middle">{item.month}</text>
            </g>
          );
        })}
      </svg>
      
      {/* Légende */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-xs text-neutral-400">Revenus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-xs text-neutral-400">Dépenses</span>
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-neutral-900 rounded-2xl border border-neutral-800 w-full ${sizeClass} max-h-[90vh] overflow-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"><Icons.X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
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
    e.preventDefault(); setLoading(true); setLocalError('');
    try { await signIn(email, password); } catch (err) { setLocalError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><h1 className="text-3xl font-light tracking-tight"><span className="text-neutral-500">Abayili</span><span className="text-white ml-2">Holdings</span></h1><p className="text-neutral-500 text-sm mt-2">Gestion d'Entreprise</p></div>
        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-8">
          <h2 className="text-xl font-light mb-6">Connexion</h2>
          {(localError || error) && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{localError || error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required /></div>
            <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Mot de passe</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required /></div>
            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{loading && <Icons.Loader size={18} />}{loading ? 'Connexion...' : 'Se connecter'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD PAGE (avec graphiques) ====================
function DashboardPage({ company, onNavigate }) {
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalExpenses: 0, netResult: 0, pendingExpenses: 0 });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [company.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, transactionsRes, budgetsRes, objectivesRes] = await Promise.all([
        AnalyticsAPI.getMetrics(company.id).catch(() => ({ data: {} })),
        TransactionAPI.getAll(company.id).catch(() => ({ data: [] })),
        BudgetAPI.getAll(company.id).catch(() => ({ data: [] })),
        ObjectiveAPI.getAll(company.id).catch(() => ({ data: [] }))
      ]);
      
      setMetrics(metricsRes.data || {});
      setTransactions(transactionsRes.data || []);
      setBudgets(budgetsRes.data || []);
      setObjectives(objectivesRes.data || []);
      
      // Générer les données du graphique à partir des transactions
      const txs = transactionsRes.data || [];
      const monthlyData = generateMonthlyChartData(txs);
      setChartData(monthlyData);
    } catch (err) { console.error('Erreur:', err); } finally { setLoading(false); }
  };

  // Générer données pour le graphique mensuel
  const generateMonthlyChartData = (transactions) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    const data = [];
    
    // 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthTxs = transactions.filter(t => {
        if (!t.date) return false;
        const txDate = new Date(t.date);
        return txDate.getMonth() === monthIndex && t.status === 'validated';
      });
      
      const revenue = monthTxs.filter(t => t.type === 'revenue').reduce((sum, t) => sum + (t.amount || 0), 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
      
      data.push({ month: months[monthIndex], revenue, expense });
    }
    
    return data;
  };

  // Calculs pour les objectifs
  const objectivesStats = {
    total: objectives.length,
    completed: objectives.filter(o => o.status === 'completed').length,
    inProgress: objectives.filter(o => o.status === 'in_progress').length,
    todo: objectives.filter(o => o.status === 'todo').length
  };
  const objectivesProgress = objectivesStats.total > 0 ? (objectivesStats.completed / objectivesStats.total) * 100 : 0;

  // Calculs pour les budgets
  const budgetStats = budgets.reduce((acc, b) => {
    acc.totalBudget += b.amount || 0;
    acc.totalSpent += b.spent || 0;
    return acc;
  }, { totalBudget: 0, totalSpent: 0 });
  const budgetUsage = budgetStats.totalBudget > 0 ? (budgetStats.totalSpent / budgetStats.totalBudget) * 100 : 0;

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-light tracking-tight">{company.name}</h2><p className="text-neutral-500 text-sm mt-1">{company.description}</p></div>
        <button onClick={() => onNavigate('transactions')} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors"><Icons.Plus size={16} />Nouvelle Transaction</button>
      </div>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard label="Revenus du Mois" value={`${(metrics.totalRevenue || 0).toLocaleString('fr-FR')} FCFA`} icon="ArrowUpRight" onClick={() => onNavigate('transactions')} />
        <MetricCard label="Dépenses du Mois" value={`${(metrics.totalExpenses || 0).toLocaleString('fr-FR')} FCFA`} icon="ArrowDownRight" onClick={() => onNavigate('transactions')} />
        <MetricCard label="Résultat Net" value={`${(metrics.netResult || 0) >= 0 ? '+' : ''}${(metrics.netResult || 0).toLocaleString('fr-FR')} FCFA`} positive={(metrics.netResult || 0) >= 0} icon="TrendingUp" />
        <MetricCard label="En Attente" value={`${(metrics.pendingExpenses || 0).toLocaleString('fr-FR')} FCFA`} icon="Clock" warning={(metrics.pendingExpenses || 0) > 0} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Graphique Revenus/Dépenses */}
        <div className="col-span-2 bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Évolution Financière (6 mois)</h3>
            <Icons.BarChart3 size={16} className="text-neutral-500" />
          </div>
          <BarChart data={chartData} height={180} />
        </div>

        {/* Cercles de progression */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-6">Vue d'ensemble</h3>
          <div className="flex flex-col items-center gap-6">
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
      <div className="grid grid-cols-3 gap-6">
        {/* Budgets */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider">Budgets</h3>
            <button onClick={() => onNavigate('budgets')} className="text-xs text-neutral-500 hover:text-white transition-colors">Voir tout →</button>
          </div>
          {budgets.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-6">Aucun budget défini</p>
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
            <EmptyState icon={Icons.Receipt} title="Aucune transaction" description="Ajoutez votre première transaction." action={() => onNavigate('transactions')} actionLabel="Ajouter" />
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
    </div>
  );
}

// ==================== TRANSACTIONS PAGE ====================
function TransactionsPage({ company }) {
  const { userData } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'revenue', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const canValidate = userData?.role === 'admin_treasury';

  useEffect(() => { loadTransactions(); }, [company.id]);
  const loadTransactions = async () => { try { setLoading(true); const res = await TransactionAPI.getAll(company.id); setTransactions(res.data || []); } catch (err) { console.error('Erreur:', err); } finally { setLoading(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await TransactionAPI.create({ ...formData, companyId: company.id, amount: parseFloat(formData.amount) }); setShowModal(false); setFormData({ type: 'revenue', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }); loadTransactions(); }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleValidate = async (id, status) => { try { await TransactionAPI.updateStatus(id, status); loadTransactions(); } catch (err) { console.error('Erreur:', err); } };
  const categories = formData.type === 'revenue' ? company.revenueCategories : company.expenseCategories;

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-light tracking-tight">Transactions</h2><p className="text-neutral-500 text-sm mt-1">{company.name}</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors"><Icons.Plus size={16} />Nouvelle Transaction</button>
      </div>
      {transactions.length === 0 ? <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50"><EmptyState icon={Icons.Receipt} title="Aucune transaction" description="Créez votre première transaction." action={() => setShowModal(true)} actionLabel="Ajouter" /></div> : (
        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-800/30"><tr><th className="px-6 py-4 text-left text-xs text-neutral-500 uppercase">Date</th><th className="px-6 py-4 text-left text-xs text-neutral-500 uppercase">Description</th><th className="px-6 py-4 text-left text-xs text-neutral-500 uppercase">Catégorie</th><th className="px-6 py-4 text-right text-xs text-neutral-500 uppercase">Montant</th><th className="px-6 py-4 text-center text-xs text-neutral-500 uppercase">Statut</th>{canValidate && <th className="px-6 py-4 text-center text-xs text-neutral-500 uppercase">Actions</th>}</tr></thead>
            <tbody>{transactions.map(t => (
              <tr key={t.id} className="border-t border-neutral-800/30 hover:bg-neutral-800/20">
                <td className="px-6 py-4 text-sm text-neutral-300">{t.date}</td>
                <td className="px-6 py-4 text-sm text-white">{t.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-neutral-400">{t.category}</td>
                <td className={`px-6 py-4 text-sm text-right ${t.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'}`}>{t.type === 'revenue' ? '+' : '-'}{(t.amount || 0).toLocaleString('fr-FR')} FCFA</td>
                <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded-full text-xs ${t.status === 'validated' ? 'bg-emerald-500/10 text-emerald-400' : t.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{t.status === 'validated' ? 'Validé' : t.status === 'rejected' ? 'Rejeté' : 'En attente'}</span></td>
                {canValidate && <td className="px-6 py-4 text-center">{t.status === 'pending' && <div className="flex items-center justify-center gap-2"><button onClick={() => handleValidate(t.id, 'validated')} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400"><Icons.Check size={16} /></button><button onClick={() => handleValidate(t.id, 'rejected')} className="p-1 hover:bg-red-500/20 rounded text-red-400"><Icons.X size={16} /></button></div>}</td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'revenue', category: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'revenue' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-neutral-700 text-neutral-400'}`}><Icons.ArrowUpRight size={16} className="inline mr-2" />Revenu</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense', category: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-neutral-700 text-neutral-400'}`}><Icons.ArrowDownRight size={16} className="inline mr-2" />Dépense</button>
          </div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Montant (FCFA)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="0" required min="1" /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Catégorie</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required><option value="">Sélectionner...</option>{categories.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>)}</select></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Description..." /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required /></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Créer'}</button>
        </form>
      </Modal>
    </div>
  );
}

// ==================== BUDGETS PAGE ====================
function BudgetsPage({ company }) {
  const { userData } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: 'expense', name: '', amount: '', period: 'monthly' });
  const [submitting, setSubmitting] = useState(false);
  const canManage = userData?.role === 'admin_treasury';

  useEffect(() => { loadBudgets(); }, [company.id]);
  const loadBudgets = async () => { try { setLoading(true); const res = await BudgetAPI.getAll(company.id); setBudgets(res.data || []); } catch (err) { console.error('Erreur:', err); } finally { setLoading(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await BudgetAPI.create({ ...formData, companyId: company.id, amount: parseFloat(formData.amount) }); setShowModal(false); setFormData({ type: 'expense', name: '', amount: '', period: 'monthly' }); loadBudgets(); }
    catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const categories = formData.type === 'revenue' ? company.revenueCategories : company.expenseCategories;
  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-light tracking-tight">Budgets</h2><p className="text-neutral-500 text-sm mt-1">{company.name}</p></div>
        {canManage && <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors"><Icons.Plus size={16} />Nouveau Budget</button>}
      </div>
      {budgets.length === 0 ? <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50"><EmptyState icon={Icons.PiggyBank} title="Aucun budget" description="Créez des budgets pour suivre vos dépenses." action={canManage ? () => setShowModal(true) : null} actionLabel="Créer" /></div> : (
        <div className="grid grid-cols-2 gap-4">{budgets.map(budget => {
          const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
          const isOver = percentage > 100; const isWarning = percentage >= 80 && percentage < 100;
          return (
            <div key={budget.id} className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6">
              <div className="flex items-start justify-between mb-4"><div><p className="text-white font-medium">{budget.name}</p><p className="text-xs text-neutral-500">{budget.type === 'revenue' ? 'Revenu' : 'Dépense'} • {budget.period === 'monthly' ? 'Mensuel' : budget.period === 'quarterly' ? 'Trimestriel' : 'Annuel'}</p></div>{(isOver || isWarning) && <Icons.AlertTriangle size={20} className={isOver ? 'text-red-400' : 'text-amber-400'} />}</div>
              <div className="mb-2"><div className="flex justify-between text-sm mb-1"><span className="text-neutral-400">Consommé</span><span className={isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}>{(budget.spent || 0).toLocaleString('fr-FR')} / {(budget.amount || 0).toLocaleString('fr-FR')} FCFA</span></div><div className="w-full bg-neutral-800 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(percentage, 100)}%` }} /></div></div>
              <p className={`text-xs ${isOver ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-neutral-500'}`}>{percentage.toFixed(0)}% utilisé</p>
            </div>
          );
        })}</div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau Budget">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'revenue', name: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'revenue' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-neutral-700 text-neutral-400'}`}>Revenu</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense', name: '' })} className={`px-4 py-3 rounded-lg border transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-neutral-700 text-neutral-400'}`}>Dépense</button>
          </div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Catégorie</label><select value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" required><option value="">Sélectionner...</option>{categories.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>)}</select></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Montant (FCFA)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="0" required min="1" /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Période</label><select value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white"><option value="monthly">Mensuel</option><option value="quarterly">Trimestriel</option><option value="yearly">Annuel</option></select></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Créer'}</button>
        </form>
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

  const handleSubmitReport = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await ObjectiveAPI.addReport(selectedObjective.id, selectedStep.id, reportForm.content, reportForm.newStatus || selectedStep.status);
      setShowReportModal(false); setReportForm({ content: '', newStatus: '' }); loadObjectives();
    } catch (err) { alert('Erreur: ' + err.message); } finally { setSubmitting(false); }
  };

  const handleDeleteStep = async (objectiveId, stepId) => {
    if (!confirm('Supprimer cette étape ?')) return;
    try { await ObjectiveAPI.deleteStep(objectiveId, stepId); loadObjectives(); }
    catch (err) { alert('Erreur: ' + err.message); }
  };

  const openStepModal = (objective) => { setSelectedObjective(objective); setShowStepModal(true); };
  const openReportModal = (objective, step) => { setSelectedObjective(objective); setSelectedStep(step); setReportForm({ content: '', newStatus: step.status }); setShowReportModal(true); };
  const getStatusInfo = (status) => STEP_STATUSES.find(s => s.id === status) || STEP_STATUSES[0];

  if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Icons.Loader size={32} className="text-neutral-400" /></div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-light tracking-tight">Objectifs & Étapes</h2><p className="text-neutral-500 text-sm mt-1">{company.name}</p></div>
        {canCreateObjective && <button onClick={() => setShowObjectiveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm hover:bg-neutral-200 transition-colors"><Icons.Plus size={16} />Nouvel Objectif</button>}
      </div>

      {objectives.length === 0 ? (
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50"><EmptyState icon={Icons.Target} title="Aucun objectif" description="Les chefs de projet peuvent créer des objectifs." action={canCreateObjective ? () => setShowObjectiveModal(true) : null} actionLabel="Créer" /></div>
      ) : (
        <div className="space-y-4">
          {objectives.map(obj => {
            const isExpanded = expandedObjectives[obj.id];
            const completedSteps = obj.steps?.filter(s => s.status === 'done').length || 0;
            const totalSteps = obj.steps?.length || 0;
            const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

            return (
              <div key={obj.id} className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-neutral-800/20 transition-colors" onClick={() => toggleExpand(obj.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-white font-medium">{obj.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${obj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : obj.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-neutral-500/10 text-neutral-400'}`}>
                          {obj.status === 'completed' ? 'Terminé' : obj.status === 'in_progress' ? 'En cours' : 'À faire'}
                        </span>
                      </div>
                      {obj.description && <p className="text-neutral-400 text-sm mb-2">{obj.description}</p>}
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        {obj.deadline && <span>Échéance: {obj.deadline}</span>}
                        <span>Créé par: {obj.createdByName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right"><p className="text-2xl font-light text-white">{progress}%</p><p className="text-xs text-neutral-500">{completedSteps}/{totalSteps} étape(s)</p></div>
                      {isExpanded ? <Icons.ChevronUp size={20} className="text-neutral-400" /> : <Icons.ChevronDown size={20} className="text-neutral-400" />}
                    </div>
                  </div>
                  {totalSteps > 0 && <div className="mt-4 w-full bg-neutral-800 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>}
                </div>

                {isExpanded && (
                  <div className="border-t border-neutral-800/50 p-6 bg-neutral-950/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm text-neutral-400 uppercase tracking-wider">Étapes</h4>
                      <button onClick={(e) => { e.stopPropagation(); openStepModal(obj); }} className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-white transition-colors"><Icons.Plus size={14} />Ajouter une étape</button>
                    </div>

                    {(!obj.steps || obj.steps.length === 0) ? (
                      <p className="text-neutral-500 text-sm text-center py-8">Aucune étape. Cliquez sur "Ajouter une étape" pour commencer.</p>
                    ) : (
                      <div className="space-y-3">
                        {obj.steps.map((step, idx) => {
                          const statusInfo = getStatusInfo(step.status);
                          const canDelete = step.createdBy === userData?.uid || ['admin_treasury', 'project_manager'].includes(userData?.role);
                          return (
                            <div key={step.id} className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${statusInfo.color}`}>{idx + 1}</div>
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{step.title}</p>
                                    {step.description && <p className="text-neutral-400 text-sm mt-1">{step.description}</p>}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                                      <span>Par: {step.createdByName || 'N/A'}</span>
                                      {step.reports?.length > 0 && <span className="flex items-center gap-1"><Icons.MessageSquare size={12} />{step.reports.length} compte-rendu(s)</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <select value={step.status} onChange={(e) => handleUpdateStepStatus(obj.id, step.id, e.target.value)} className={`px-2 py-1 rounded-lg text-xs border-0 cursor-pointer ${statusInfo.color}`}>
                                    {STEP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                  </select>
                                  <button onClick={() => openReportModal(obj, step)} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Ajouter un compte-rendu"><Icons.FileText size={16} /></button>
                                  {canDelete && <button onClick={() => handleDeleteStep(obj.id, step.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-neutral-400 hover:text-red-400 transition-colors" title="Supprimer"><Icons.Trash2 size={16} /></button>}
                                </div>
                              </div>
                              {step.reports?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-neutral-800/50">
                                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Compte-rendus</p>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {step.reports.slice().reverse().map(report => (
                                      <div key={report.id} className="bg-neutral-800/30 rounded-lg p-3 text-sm">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-neutral-400 text-xs">{report.createdByName} • {new Date(report.createdAt).toLocaleDateString('fr-FR')} {new Date(report.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                          <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusInfo(report.statusAtTime).color}`}>{getStatusInfo(report.statusAtTime).label}</span>
                                        </div>
                                        <p className="text-neutral-300">{report.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
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

      <Modal isOpen={showObjectiveModal} onClose={() => setShowObjectiveModal(false)} title="Nouvel Objectif">
        <form onSubmit={handleCreateObjective} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Titre</label><input type="text" value={objectiveForm.title} onChange={(e) => setObjectiveForm({ ...objectiveForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Titre de l'objectif" required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label><textarea value={objectiveForm.description} onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white resize-none" placeholder="Description..." rows={3} /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Échéance</label><input type="date" value={objectiveForm.deadline} onChange={(e) => setObjectiveForm({ ...objectiveForm, deadline: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" /></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Créer l\'objectif'}</button>
        </form>
      </Modal>

      <Modal isOpen={showStepModal} onClose={() => setShowStepModal(false)} title={`Nouvelle étape - ${selectedObjective?.title || ''}`}>
        <form onSubmit={handleCreateStep} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Titre de l'étape</label><input type="text" value={stepForm.title} onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white" placeholder="Titre de l'étape" required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Description</label><textarea value={stepForm.description} onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white resize-none" placeholder="Description de l'étape..." rows={3} /></div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Création...' : 'Ajouter l\'étape'}</button>
        </form>
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title={`Compte-rendu - ${selectedStep?.title || ''}`}>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Compte-rendu</label><textarea value={reportForm.content} onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white resize-none" placeholder="Décrivez l'avancement..." rows={5} required /></div>
          <div><label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Nouveau statut (optionnel)</label>
            <select value={reportForm.newStatus} onChange={(e) => setReportForm({ ...reportForm, newStatus: e.target.value })} className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg focus:outline-none focus:border-neutral-600 text-white">
              <option value="">Garder le statut actuel ({getStatusInfo(selectedStep?.status).label})</option>
              {STEP_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={submitting} className="w-full px-4 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Icons.Loader size={18} />}{submitting ? 'Envoi...' : 'Soumettre'}</button>
        </form>
      </Modal>
    </div>
  );
}

// ==================== MAIN LAYOUT ====================
function MainLayout() {
  const { userData, signOut, getUserRole } = useAuth();
  const [activeCompany, setActiveCompany] = useState('abayili_invest');
  const [activeView, setActiveView] = useState('dashboard');

  const company = COMPANIES[activeCompany];
  const userRole = getUserRole();
  const accessibleCompanies = Object.values(COMPANIES).filter(c => !userData?.companies?.length || userData.companies.includes(c.id));

  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', Icon: Icons.BarChart3 },
    { id: 'transactions', label: 'Transactions', Icon: Icons.Receipt },
    { id: 'budgets', label: 'Budgets', Icon: Icons.PiggyBank },
    { id: 'objectives', label: 'Objectifs', Icon: Icons.Target }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-light">
      <header className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6"><h1 className="text-xl tracking-tight font-normal"><span className="text-neutral-500">Abayili</span><span className="text-white ml-1">Holdings</span></h1><div className="h-6 w-px bg-neutral-800"></div><span className="text-xs text-neutral-500 tracking-wider uppercase">Gestion d'Entreprise</span></div>
            <div className="flex items-center gap-4"><div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${userRole?.color || 'bg-neutral-500/10 text-neutral-400'}`}><Icons.User size={14} />{userData?.name || 'Utilisateur'} - {userRole?.name || 'Collaborateur'}</div><button onClick={signOut} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"><Icons.LogOut size={18} /></button></div>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-72 min-h-[calc(100vh-73px)] border-r border-neutral-800/50 bg-neutral-900/30">
          <div className="p-4 border-b border-neutral-800/50">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Entreprise</p>
            <div className="space-y-1">{accessibleCompanies.map(comp => {
              const CompIcon = Icons[comp.icon] || Icons.Building2; const isActive = comp.id === activeCompany;
              return (<button key={comp.id} onClick={() => setActiveCompany(comp.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-white/5 text-white' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}><CompIcon size={18} /><div className="text-left flex-1 min-w-0"><p className="text-sm truncate">{comp.name}</p><p className="text-[10px] text-neutral-500 truncate">{comp.description}</p></div>{isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}</button>);
            })}</div>
          </div>
          <nav className="p-4">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Navigation</p>
            <div className="space-y-1">{navItems.map(item => {
              const isActive = item.id === activeView;
              return (<button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}><item.Icon size={16} /><span className="text-sm">{item.label}</span></button>);
            })}</div>
          </nav>
        </aside>
        <main className="flex-1 min-h-[calc(100vh-73px)] overflow-auto">
          {activeView === 'dashboard' && <DashboardPage company={company} onNavigate={setActiveView} />}
          {activeView === 'transactions' && <TransactionsPage company={company} />}
          {activeView === 'budgets' && <BudgetsPage company={company} />}
          {activeView === 'objectives' && <ObjectivesPage company={company} />}
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
