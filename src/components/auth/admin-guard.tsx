'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { getSession } from '@/lib/auth/session';
import { AccessDenied } from './access-denied';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole, currentUser } = useDebufaStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsChecking(false);
  }, [pathname, router]);

  // Jika role adalah WORKER, TOLAK akses ke area admin
  if (currentRole === 'WORKER') {
    return (
      <div className='p-6 max-w-4xl mx-auto'>
        <AccessDenied
          title='Akses Admin Ditolak'
          message='Akun Anda terdaftar sebagai Tukang/Worker. Anda tidak diizinkan mengakses Dashboard Admin operasional ataupun data keuangan workshop.'
          requiredRole='OWNER / ADMIN'
        />
      </div>
    );
  }

  return <>{children}</>;
}
