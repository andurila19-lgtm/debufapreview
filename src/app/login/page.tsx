'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { authenticate, authenticateDemo, getRedirectPathByRole } from '@/lib/auth/session';
import { UserRole } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const { switchRole } = useDebufaStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle standard credential submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticate(identifier, password);

      if (!result.success || !result.session) {
        setIsLoading(false);
        setErrorMessage(result.error || 'Autentikasi gagal.');
        toast.error(result.error || 'Login gagal');
        return;
      }

      setIsLoading(false);
      switchRole(result.session.role);
      toast.success(`Selamat datang, ${result.session.name}!`);

      // Determine redirect path
      const defaultPath = getRedirectPathByRole(result.session.role);
      const destination =
        redirectTarget && redirectTarget.startsWith('/') ? redirectTarget : defaultPath;

      router.push(destination);
    }, 400);
  };

  // Handle quick demo login
  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const session = authenticateDemo(role);
      switchRole(role);
      setIsLoading(false);
      toast.success(`Masuk sebagai ${role} Demo (${session.name})`);

      const destination = getRedirectPathByRole(role);
      router.push(destination);
    }, 250);
  };

  return (
    <div className='w-full max-w-md space-y-6'>
      {/* Brand Header */}
      <div className='text-center space-y-2'>
        <div className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-800 text-amber-50 shadow-lg ring-1 ring-amber-700/50 mb-1'>
          <Icons.hammer className='h-7 w-7' />
        </div>
        <h1 className='text-2xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50'>
          DEBUFA WORKS
        </h1>
        <p className='text-xs text-neutral-500 dark:text-neutral-400 font-medium tracking-wide uppercase'>
          Sistem Operasional Furniture Custom
        </p>
      </div>

      {/* Main Login Card */}
      <Card className='border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 shadow-xl rounded-3xl p-6 sm:p-7 backdrop-blur-md space-y-5'>
        {errorMessage && (
          <div className='p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2'>
            <Icons.warning className='h-4 w-4 shrink-0' />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-1.5'>
            <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
              Email / Nomor HP
            </label>
            <div className='relative'>
              <Input
                type='text'
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder='owner@debufa.test atau 0812...'
                className='h-10 text-xs pl-9 bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-750 focus-visible:ring-amber-800'
              />
              <Icons.user className='absolute left-3 top-3 h-4 w-4 text-neutral-400' />
            </div>
          </div>

          <div className='space-y-1.5'>
            <div className='flex justify-between items-center'>
              <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
                Password
              </label>
              <span className='text-[10px] text-neutral-400 font-mono'>Demo: demo123</span>
            </div>
            <div className='relative'>
              <Input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='h-10 text-xs pl-9 bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-750 focus-visible:ring-amber-800'
              />
              <Icons.lock className='absolute left-3 top-3 h-4 w-4 text-neutral-400' />
            </div>
          </div>

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full h-11 text-xs font-bold bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl shadow-md transition-all active:scale-98'
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
          </Button>
        </form>

        {/* Demo Login (Akses Cepat Preview) */}
        <div className='pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5'>
          <div className='text-center'>
            <span className='text-[11px] font-semibold text-neutral-400 uppercase tracking-wider'>
              Akses Cepat Demo (Pilih Peran)
            </span>
          </div>

          <div className='grid grid-cols-1 gap-1.5'>
            <Button
              type='button'
              variant='outline'
              disabled={isLoading}
              onClick={() => handleDemoLogin('OWNER')}
              className='h-9 text-xs justify-start px-3 rounded-xl border-amber-800/30 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-neutral-800 dark:text-neutral-200 font-medium group cursor-pointer'
            >
              <span className='mr-2 text-sm'>👑</span>
              <span>
                Masuk sebagai <strong>Owner</strong>
              </span>
              <span className='ml-auto text-[10px] font-mono text-neutral-400 group-hover:text-amber-800 dark:group-hover:text-amber-300'>
                Akses Penuh
              </span>
            </Button>

            <Button
              type='button'
              variant='outline'
              disabled={isLoading}
              onClick={() => handleDemoLogin('ADMIN')}
              className='h-9 text-xs justify-start px-3 rounded-xl border-blue-600/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-800 dark:text-neutral-200 font-medium group cursor-pointer'
            >
              <span className='mr-2 text-sm'>📋</span>
              <span>
                Masuk sebagai <strong>Admin</strong>
              </span>
              <span className='ml-auto text-[10px] font-mono text-neutral-400 group-hover:text-blue-700 dark:group-hover:text-blue-300'>
                Operasional
              </span>
            </Button>

            <Button
              type='button'
              variant='outline'
              disabled={isLoading}
              onClick={() => handleDemoLogin('WORKER')}
              className='h-9 text-xs justify-start px-3 rounded-xl border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-800 dark:text-neutral-200 font-medium group cursor-pointer'
            >
              <span className='mr-2 text-sm'>🔨</span>
              <span>
                Masuk sebagai <strong>Tukang</strong>
              </span>
              <span className='ml-auto text-[10px] font-mono text-neutral-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'>
                Portal Mobile
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Info Links */}
      <div className='text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-1'>
        <p>Pelanggan tidak perlu login ke akun internal.</p>
        <div className='flex items-center justify-center gap-3 font-medium text-amber-800 dark:text-amber-400'>
          <a href='/estimator' className='hover:underline'>
            Kalkulator Estimasi Publik
          </a>
          <span>•</span>
          <a href='/tracking' className='hover:underline'>
            Cek Status Proyek (Tracking)
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50/40 via-neutral-100/50 to-neutral-200/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-amber-800 selection:text-white'>
      <Suspense
        fallback={<div className='text-xs text-muted-foreground'>Memuat halaman login...</div>}
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
