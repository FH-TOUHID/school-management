import { createContext, useContext, useMemo, useState } from 'react';
import { authenticateDemo, clearDemoUser, loadDemoUser, saveDemoUser } from '../auth/demoAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadDemoUser);

  const value = useMemo(() => ({
    user,
    signIn(email, password) {
      const account = authenticateDemo(email, password);
      if (!account) return false;
      saveDemoUser(account);
      setUser(account);
      return true;
    },
    signOut() {
      clearDemoUser();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
