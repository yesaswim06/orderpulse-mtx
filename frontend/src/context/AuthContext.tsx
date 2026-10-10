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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check stored auth session on mount. NO auto sign in if no valid stored session!
  useEffect(() => {
    try {
      const stored = localStorage.getItem('orderpulse_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.userId) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth user session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('orderpulse_auth_user', JSON.stringify(userData));
    localStorage.setItem('user_authenticated', 'true');
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_email', userData.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orderpulse_auth_user');
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
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
