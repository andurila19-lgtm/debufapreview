'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useDebufaStore } from '@/lib/debufa-store';
import { clearSession, getRedirectPathByRole } from '@/lib/auth/session';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
}

export function AccessDenied({
  title = 'Akses Tidak Diizinkan',
  message = 'Akun Anda tidak memiliki hak akses yang memadai untuk membuka halaman ini.',
  requiredRole
}: AccessDeniedProps) {
  const router = useRouter();
  const { currentRole, currentUser } = useDebufaStore();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const homePath = getRedirectPathByRole(currentRole);

  return (
    <div className='min-h-[70vh] flex items-center justify-center p-4'>
      <Card className='max-w-md w-full border-border/80 bg-background/95 shadow-2xl p-6 text-center space-y-5 rounded-2xl'>
        <div className='h-14 w-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm'>
          <Icons.warning className='h-7 w-7' />
        </div>

        <div className='space-y-2'>
          <div className='inline-flex items-center gap-1.5'>
            <Badge
              variant='outline'
              className='text-[10px] font-mono uppercase border-amber-500/40 text-amber-600 dark:text-amber-400'
            >
              Security Notice
            </Badge>
          </div>
          <h1 className='text-xl font-bold font-serif text-foreground tracking-tight'>{title}</h1>
          <p className='text-xs text-muted-foreground leading-relaxed'>{message}</p>
        </div>

        {/* Info Akun Saat Ini */}
        <div className='bg-muted/40 p-3 rounded-xl border border-border/50 text-left text-xs space-y-1.5'>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground'>Pengguna Aktif:</span>
            <span className='font-semibold text-foreground'>{currentUser.name}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-muted-foreground'>Peran / Role:</span>
            <Badge
              className={`text-[9px] font-bold ${
                currentRole === 'OWNER'
                  ? 'bg-amber-800 text-amber-50'
                  : currentRole === 'ADMIN'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
              }`}
            >
              {currentRole}
            </Badge>
          </div>
          {requiredRole && (
            <div className='flex justify-between items-center pt-1 border-t border-border/40'>
              <span className='text-muted-foreground'>Role Diperlukan:</span>
              <span className='font-bold text-amber-600 dark:text-amber-400'>{requiredRole}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-2 pt-2'>
          <Button
            onClick={() => router.push(homePath)}
            className='flex-1 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold text-xs h-9'
          >
            Kembali ke {currentRole === 'WORKER' ? 'Portal Tukang' : 'Dashboard'}
          </Button>
          <Button
            variant='outline'
            onClick={handleLogout}
            className='flex-1 border-border/80 hover:bg-muted text-xs h-9'
          >
            Ganti Akun / Keluar
          </Button>
        </div>
      </Card>
    </div>
  );
}
