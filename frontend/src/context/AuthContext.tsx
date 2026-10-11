import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  kycStatus?: string;
  balance?: number;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateBalance: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('orderpulse_auth_user');
      if (stored && stored.trim() !== '' && stored !== 'undefined' && stored !== 'null') {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.userId || parsed.email)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse initial auth user session:', e);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronize across tabs and custom events
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('orderpulse_auth_user');
        if (stored && stored.trim() !== '' && stored !== 'undefined' && stored !== 'null') {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.userId || parsed.email)) {
            setUser(parsed);
            return;
          }
        }
        setUser(null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('orderpulse_auth_change', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('orderpulse_auth_change', handleSync);
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('orderpulse_auth_user', JSON.stringify(userData));
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_email', userData.email);
      window.dispatchEvent(new Event('orderpulse_auth_change'));
    } catch (e) {
      console.warn('Failed to persist auth session to localStorage:', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('orderpulse_auth_user');
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('orderpulse_user');
      sessionStorage.removeItem('orderpulse_session');
      window.dispatchEvent(new Event('orderpulse_auth_change'));
    } catch {}
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updated = { ...user, balance: newBalance };
      setUser(updated);
      localStorage.setItem('orderpulse_auth_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
