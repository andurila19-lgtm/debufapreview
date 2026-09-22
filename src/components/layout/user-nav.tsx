'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export function UserNav() {
  const router = useRouter();
  const { currentUser, currentRole, logout } = useDebufaStore();

  const handleLogout = () => {
    toast.info('Anda telah keluar dari sistem.');
    logout();
    router.push('/login');
  };

  const handleGoProfile = () => {
    if (currentRole === 'OWNER') {
      router.push('/admin/pengaturan');
    } else {
      toast.info(`Profil akun: ${currentUser.name} (${currentUser.role})`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='relative flex items-center gap-2 h-9 px-2 rounded-xl hover:bg-muted/80 cursor-pointer outline-none border border-transparent focus-visible:border-ring transition-colors'>
        <Avatar className='h-8 w-8 border border-amber-800/30 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'>
          <AvatarFallback className='text-xs font-bold'>
            {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='hidden lg:flex flex-col items-start leading-tight text-left'>
          <span className='text-xs font-semibold text-foreground truncate max-w-[120px]'>
            {currentUser.name}
          </span>
          <span className='text-[10px] text-muted-foreground uppercase font-mono'>
            {currentRole}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56 p-1.5' align='end'>
        <DropdownMenuLabel className='font-normal p-2'>
          <div className='flex flex-col space-y-1'>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-bold text-foreground leading-none'>{currentUser.name}</p>
              <Badge
                className={`text-[9px] px-1 py-0 h-4 font-bold ${
                  currentRole === 'OWNER' ? 'bg-amber-800 text-amber-50' : 'bg-blue-600 text-white'
                }`}
              >
                {currentRole}
              </Badge>
            </div>
            <p className='text-[11px] leading-none text-muted-foreground truncate'>
              {currentUser.email || 'user@debufaworks.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleGoProfile}
            className='text-xs cursor-pointer gap-2 py-1.5'
          >
            <Icons.user className='h-3.5 w-3.5 text-muted-foreground' />
            <span>
              {currentRole === 'OWNER' ? 'Pengaturan Usaha (Owner)' : 'Profil Akun (Admin)'}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/tukang')}
            className='text-xs cursor-pointer gap-2 py-1.5'
          >
            <Icons.hammer className='h-3.5 w-3.5 text-amber-700 dark:text-amber-400' />
            <span>Buka Portal Tukang (Mobile)</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className='text-xs cursor-pointer gap-2 py-1.5 text-destructive focus:bg-destructive/10 focus:text-destructive'
        >
          <Icons.logout className='h-3.5 w-3.5' />
          <span>Keluar (Logout)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
