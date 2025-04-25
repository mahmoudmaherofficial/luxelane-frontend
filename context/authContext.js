'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAccount } from '@/api/account';
import { refreshToken } from '@/api/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          console.error('Refresh token failed:', refreshErr.response?.data || refreshErr.message);
          Cookies.remove('accessToken');
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
      const pathname = window.location.pathname;
      const isAuthPage = pathname === '/login' || pathname === '/register';

      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        const isAuthenticated = await fetchUser();
        if (isAuthenticated && isAuthPage) {
          // Redirect authenticated users away from login/register
          router.replace('/');
        } else if (!isAuthenticated && !isAuthPage) {
          // Redirect unauthenticated users to login (except on auth pages)
          router.replace('/login');
        }
      } else {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            const isAuthenticated = await fetchUser();
            if (isAuthenticated && isAuthPage) {
              router.replace('/');
            }
          } else if (!isAuthPage) {
            router.replace('/login');
          }
        } catch (err) {
          console.error('Token refresh error:', err.response?.data || err.message);
          setUser(null);
          if (!isAuthPage) {
            router.replace('/login');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleLogout = () => {
      setUser(null);
      setLoading(false);
      router.replace('/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);