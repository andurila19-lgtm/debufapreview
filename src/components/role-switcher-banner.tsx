'use client';

import React, { useState } from 'react';
import { useDebufaStore } from '@/lib/debufa-store';
import { UserRole } from '@/types/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export function RoleSwitcherBanner() {
  const { currentRole, currentUser, switchRole } = useDebufaStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSwitch = (role: UserRole) => {
    if (role === currentRole) return;

    switchRole(role);
    toast.info(
      `Beralih peran: ${role} Demo (${role === 'OWNER' ? 'Pak Budi' : role === 'ADMIN' ? 'Siti Rahma' : 'Joko Tukang'})`
    );

    if (role === 'WORKER') {
      router.push('/tukang');
    } else {
      if (pathname.startsWith('/tukang')) {
        router.push('/admin');
      }
    }
  };

  return (
    <div className='fixed bottom-4 right-4 z-50 transition-all duration-300'>
      <div className='bg-background/95 backdrop-blur-md border border-border/80 shadow-2xl rounded-2xl p-2.5 flex items-center gap-2 text-xs'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-2 font-medium px-2 py-1 rounded-lg hover:bg-muted/80 text-foreground transition-colors'
          title='Klik untuk meminimalkan/membuka switcher role'
        >
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse'></span>
          <span className='font-bold text-[11px] uppercase tracking-wider text-muted-foreground'>
            Demo Role
          </span>
          <Badge
            variant='outline'
            className={`text-[10px] font-bold uppercase ${
              currentRole === 'OWNER'
                ? 'border-amber-700 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                : currentRole === 'ADMIN'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                  : 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
            }`}
          >
            {currentRole === 'WORKER' ? 'TUKANG' : currentRole}
          </Badge>
        </button>

        {isExpanded && (
          <div className='flex items-center gap-1.5 border-l border-border/60 pl-2'>
            <Button
              size='sm'
              variant={currentRole === 'OWNER' ? 'default' : 'outline'}
              onClick={() => handleSwitch('OWNER')}
              className={`h-7 px-2.5 text-[11px] gap-1 rounded-lg font-semibold ${
                currentRole === 'OWNER'
                  ? 'bg-amber-800 text-amber-50 hover:bg-amber-900 shadow-xs'
                  : 'hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-amber-950/40'
              }`}
            >
              👑 Owner
            </Button>

            <Button
              size='sm'
              variant={currentRole === 'ADMIN' ? 'default' : 'outline'}
              onClick={() => handleSwitch('ADMIN')}
              className={`h-7 px-2.5 text-[11px] gap-1 rounded-lg font-semibold ${
                currentRole === 'ADMIN'
                  ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-xs'
                  : 'hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-blue-950/40'
              }`}
            >
              📋 Admin
            </Button>

            <Button
              size='sm'
              variant={currentRole === 'WORKER' ? 'default' : 'outline'}
              onClick={() => handleSwitch('WORKER')}
              className={`h-7 px-2.5 text-[11px] gap-1 rounded-lg font-semibold ${
                currentRole === 'WORKER'
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                  : 'hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-950/40'
              }`}
            >
              🔨 Tukang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
