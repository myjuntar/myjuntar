'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import Cookies from 'js-cookie';

export function useGuestRedirect() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    const signupInProgress = Cookies.get('signupEmail');
    const isVerifyPage = typeof window !== 'undefined' && window.location.pathname === '/verify';

    if (isVerifyPage && signupInProgress) return;

    if (isAuthenticated && user) {
      const redirectPath =
        user.role === 'super_admin' || user.role === 'venue_owner' || user.role === 'customer_support'
          ? '/dashboard'
          : '/account';

      router.replace(redirectPath);
    }
  }, [hasHydrated, isAuthenticated, user]);
}
