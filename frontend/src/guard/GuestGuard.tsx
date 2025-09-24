import { ReactNode, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to dashboard/home if already authenticated
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render children if authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  // Render children if not authenticated (guest user)
  return <>{children}</>;
};

export default GuestGuard;
