'use client';

import { authApi, tokenStorage } from '@/lib/api';
import { User } from '@/types';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    // ✅ Token না থাকলে API call করবো না
    const token = tokenStorage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      // Token invalid - clear করো
      tokenStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);

    // ✅ Token localStorage এ save করো
    tokenStorage.set(res.access, res.refresh);

    setUser(res.user);
  };

  const logout = async () => {
    try {
      // ✅ Backend এ blacklist করো
      await authApi.logout();
    } catch {
      // Error হলেও local clear করবো
      console.error('Logout API failed, clearing local tokens');
    } finally {
      // ✅ Local token সরাও
      tokenStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}