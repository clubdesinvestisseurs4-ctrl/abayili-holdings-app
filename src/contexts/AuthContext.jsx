// Contexte d'Authentification
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN_TREASURY: {
    id: 'admin_treasury',
    name: 'Administrateur Trésorerie',
    permissions: ['validate_transactions', 'reject_transactions', 'import_reports', 'view_all', 'manage_budgets'],
    color: 'bg-purple-500/10 text-purple-400'
  },
  PROJECT_MANAGER: {
    id: 'project_manager',
    name: 'Gérant des Objectifs',
    permissions: ['create_objectives', 'create_steps', 'validate_reports', 'view_all', 'manage_objectives'],
    color: 'bg-blue-500/10 text-blue-400'
  },
  COLLABORATOR: {
    id: 'collaborator',
    name: 'Collaborateur',
    permissions: ['submit_expense', 'submit_report', 'download_reports', 'view_own'],
    color: 'bg-neutral-500/10 text-neutral-400'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Erreur réelle du chargement du profil (companies/role) - distincte de
  // `error` (erreurs de connexion). Affichée dans l'UI (MainLayout) pour que
  // l'utilisateur puisse la voir/relayer sans avoir besoin de la console
  // navigateur (ex: sur mobile) - avant, l'échec était silencieux, masqué
  // par un repli automatique sur le rôle "collaborator".
  const [userDataError, setUserDataError] = useState(null);

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Récupérer les données utilisateur depuis le backend
          const response = await api.get(`/users/${firebaseUser.uid}`);
          setUserData(response.data);
          setUserDataError(null);
        } catch (err) {
          const detail = err.response
            ? `HTTP ${err.response.status} — ${err.response.data?.detail || err.response.data?.error || err.message}${err.response.data?.code ? ` (${err.response.data.code})` : ''}`
            : (err.code || err.message || 'erreur réseau inconnue');
          console.error('Erreur chargement userData:', detail, err);
          setUserDataError(detail);
          // Mode fallback - données minimales, pour ne pas bloquer l'app,
          // mais userDataError reste affiché pour signaler que ce n'est pas
          // le vrai rôle/les vrais accès de l'utilisateur.
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Utilisateur',
            role: 'collaborator',
            companies: []
          });
        }
      } else {
        setUser(null);
        setUserData(null);
        setUserDataError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Connexion
  const signIn = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      let message = 'Erreur de connexion';
      switch (err.code) {
        case 'auth/user-not-found':
          message = 'Utilisateur non trouvé';
          break;
        case 'auth/wrong-password':
          message = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          message = 'Email invalide';
          break;
        case 'auth/too-many-requests':
          message = 'Trop de tentatives. Réessayez plus tard.';
          break;
        default:
          message = err.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  // Déconnexion
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
  };

  // Réinitialisation mot de passe
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Vérifier si l'utilisateur a une permission
  const hasPermission = (permission) => {
    if (!userData?.role) return false;
    const role = Object.values(USER_ROLES).find(r => r.id === userData.role);
    return role?.permissions.includes(permission) || false;
  };

  // Vérifier si l'utilisateur a accès à une entreprise
  const hasCompanyAccess = (companyId) => {
    if (!userData?.companies) return false;
    return userData.companies.includes(companyId);
  };

  // Obtenir le rôle complet
  const getUserRole = () => {
    if (!userData?.role) return null;
    return Object.values(USER_ROLES).find(r => r.id === userData.role);
  };

  const value = {
    user,
    userData,
    userDataError,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    hasPermission,
    hasCompanyAccess,
    getUserRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

export default AuthContext;
