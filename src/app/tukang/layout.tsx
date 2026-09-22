'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { getSession } from '@/lib/auth/session';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { AccessDenied } from '@/components/auth/access-denied';
import { RoleSwitcherBanner } from '@/components/role-switcher-banner';

export default function TukangLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, currentUser, logout } = useDebufaStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getSession();
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  // Route Protection: Admin tidak boleh masuk interface tukang
  if (mounted && currentRole === 'ADMIN') {
    return (
      <div className='min-h-screen bg-neutral-900 flex items-center justify-center p-4'>
        <AccessDenied
          title='Akses Khusus Tukang Lapangan'
          message='Akun Anda terdaftar sebagai Admin Operasional. Silakan kembali ke Dashboard Admin untuk mengelola pesanan, pelanggan, dan pembayaran.'
          requiredRole='WORKER (TUKANG)'
        />
        <RoleSwitcherBanner />
      </div>
    );
  }

  const navItems = [
    {
      label: 'Beranda',
      href: '/tukang',
      icon: Icons.dashboard,
      exact: true
    },
    {
      label: 'Pekerjaan Saya',
      href: '/tukang/pekerjaan',
      icon: Icons.hammer,
      exact: false
    },
    {
      label: 'Profil',
      href: '/tukang/profil',
      icon: Icons.user,
      exact: false
    }
  ];

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center pb-20 font-sans selection:bg-amber-600 selection:text-white'>
      {/* Mobile Frame Container */}
      <div className='w-full max-w-md px-4 pt-5 pb-8 space-y-5'>
        {/* Top Header Bar */}
        <header className='flex items-center justify-between border-b border-neutral-800/80 pb-3'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 shadow-md ring-1 ring-amber-500/30'>
              <Icons.hammer className='h-5 w-5' />
            </div>
            <div>
              <span className='font-black text-xs tracking-wider uppercase text-amber-400 font-mono block leading-none'>
                DEBUFA WORKS
              </span>
              <span className='text-[10px] text-neutral-400 font-medium'>
                Portal Tukang Lapangan
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className='text-[9px] font-bold border-amber-600/40 bg-amber-950/40 text-amber-300'
            >
              TUKANG
            </Badge>
            <button
              onClick={logout}
              title='Keluar dari sistem'
              className='p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors'
            >
              <Icons.logout className='h-4 w-4' />
            </button>
          </div>
        </header>

        {/* Child Content */}
        <main>{children}</main>
      </div>

      {/* Fixed Bottom Navigation for Tukang (Mobile-First) */}
      <nav className='fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 flex justify-center'>
        <div className='w-full max-w-md grid grid-cols-3 py-2 px-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl text-center transition-colors ${
                  isActive
                    ? 'text-amber-400 font-bold bg-neutral-800/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon
                  className={`h-5 w-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}
                />
                <span className='text-[11px] leading-none'>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Demo Switcher for development/preview */}
      <RoleSwitcherBanner />
    </div>
  );
}
