'use client';
import { PROTECTED_ROUTES } from '@/constants/protectedRoutes';
import Loader from '@/components/Loader';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentPath = window.location.pathname;
    const matchedKey = Array.from(PROTECTED_ROUTES.keys()).find((route) =>
      currentPath.startsWith(`/${route}`)
    );

    const allowedRoles = PROTECTED_ROUTES.get(matchedKey);

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
      router.push('/403');
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;

  const currentPath = window.location.pathname.split('/').length > 2 ? window.location.pathname.split('/')[2] : window.location.pathname.split('/')[1];
  const matchedKey = Array.from(PROTECTED_ROUTES.keys()).find((route) =>
    currentPath.startsWith(route)
  );
  const allowedRoles = PROTECTED_ROUTES.get(matchedKey);

  const hasAccess = allowedRoles
    ? user && allowedRoles.includes(user.role)
    : true; // غير محمية

  return hasAccess ? children : window.location.replace('/403');
};

export default ProtectedRoute;

