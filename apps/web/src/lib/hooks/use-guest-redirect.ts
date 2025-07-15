'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export function useGuestRedirect() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated && user) {
      const redirectPath =
        user.role === 'super_admin' || user.role === 'venue_owner' || user.role === 'customer_support'
          ? '/dashboard'
          : '/account';

      router.replace(redirectPath);
    }
  }, [hasHydrated, isAuthenticated, user]);
}
