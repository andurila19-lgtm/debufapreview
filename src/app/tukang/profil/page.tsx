'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export default function TukangProfilPage() {
  const router = useRouter();
  const { currentUser, workers, logout } = useDebufaStore();

  const workerData = workers.find((w) => w.id === (currentUser.workerId || 'TKG-01')) || workers[0];

  const handleLogout = () => {
    toast.info('Anda telah keluar dari Portal Tukang.');
    logout();
    router.push('/login');
  };

  return (
    <div className='space-y-5'>
      <div className='border-b border-neutral-800/80 pb-3'>
        <h1 className='text-lg font-bold text-white tracking-tight'>Profil Saya</h1>
        <p className='text-xs text-neutral-400'>
          Informasi akun tukang dan status kepegawaian workshop
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className='border border-neutral-800 bg-neutral-900 rounded-3xl p-5 shadow-lg space-y-4'>
        <div className='flex items-center gap-3.5'>
          <Avatar className='h-14 w-14 border-2 border-amber-600/40 bg-amber-950 text-amber-200'>
            <AvatarFallback className='text-base font-bold'>
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h2 className='text-base font-bold text-white leading-tight'>{currentUser.name}</h2>
            <div className='flex items-center gap-1.5'>
              <Badge className='text-[10px] bg-amber-800 text-amber-100 font-semibold px-2 py-0'>
                {currentUser.title || workerData?.role || 'Tukang Kayu Utama'}
              </Badge>
              <Badge
                variant='outline'
                className='text-[10px] border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              >
                ● Aktif
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Detail List */}
        <div className='bg-neutral-850 p-4 rounded-2xl border border-neutral-800/80 divide-y divide-neutral-800 text-xs space-y-2.5'>
          <div className='flex justify-between items-center pt-1'>
            <span className='text-neutral-400'>Nama Lengkap:</span>
            <span className='font-semibold text-neutral-200'>{currentUser.name}</span>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-neutral-400'>Nomor WhatsApp / HP:</span>
            <span className='font-mono font-semibold text-neutral-200'>
              {currentUser.phone || '0812-3456-001'}
            </span>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-neutral-400'>Peran Pekerjaan:</span>
            <span className='font-semibold text-amber-400'>
              {currentUser.title || 'Tukang Kayu Utama'}
            </span>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-neutral-400'>Status Kepegawaian:</span>
            <span className='font-semibold text-emerald-400'>Aktif Bekerja</span>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-neutral-400'>ID Tukang:</span>
            <span className='font-mono text-neutral-400'>{currentUser.workerId || 'TKG-01'}</span>
          </div>

          <div className='flex justify-between items-center pt-2'>
            <span className='text-neutral-400'>Home Workshop:</span>
            <span className='font-medium text-neutral-300'>Debufa Works (Pondok Pinang)</span>
          </div>
        </div>
      </Card>

      {/* Keamanan & Logout */}
      <Card className='border border-neutral-800 bg-neutral-900 rounded-2xl p-4 space-y-3'>
        <div className='flex items-center gap-2 text-xs font-semibold text-neutral-300'>
          <Icons.lock className='h-4 w-4 text-amber-500' />
          <span>Keamanan Sesi</span>
        </div>
        <p className='text-[11px] text-neutral-400 leading-relaxed'>
          Akun ini khusus untuk absensi harian dan pelaporan progres pekerjaan lapangan. Untuk
          mengganti akun, silakan klik tombol keluar di bawah.
        </p>
        <Button
          variant='outline'
          onClick={handleLogout}
          className='w-full h-10 text-xs font-bold border-neutral-700 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl gap-2 transition-colors'
        >
          <Icons.logout className='h-4 w-4' />
          Keluar dari Sistem (Logout)
        </Button>
      </Card>
    </div>
  );
}
