'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAccount } from '@/api/account';
import { refreshToken } from '@/api/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getAccount();
      setUser(res.data);
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            const res = await getAccount();
            setUser(res.data);
            return true;
          }
        } catch (refreshErr) {
          setUser(null);
          return false;
        }
      }
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (window.location.pathname === '/login') {
        setUser(null);
        setLoading(false);
        return;
      }

      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        await fetchUser();
      } else {
        const newToken = await refreshToken();
        if (newToken) {
          await fetchUser();
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

