'use client';

import * as React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface DebufaNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'payment' | 'production' | 'delivery' | 'worker';
  unread: boolean;
  link: string;
}

const initialNotifications: DebufaNotification[] = [
  {
    id: 'n-1',
    title: 'DP Proyek Dikonfirmasi',
    description:
      'DP Rp 18.000.000 untuk Kitchen Set Modern Minimalis (Budi Santoso) telah masuk ke Rekening BCA.',
    time: '10 menit yang lalu',
    type: 'payment',
    unread: true,
    link: '/admin/payments'
  },
  {
    id: 'n-2',
    title: 'Tahap Produksi Berlanjut',
    description:
      'Walk-in Closet Mewah (Siti Rahma) telah selesai Perakitan Karkas, lanjut ke Finishing.',
    time: '1 jam yang lalu',
    type: 'production',
    unread: true,
    link: '/admin/projects/PRJ-2026-002'
  },
  {
    id: 'n-3',
    title: 'Jadwal Pengiriman Besok',
    description:
      'Meeting Table 3.2m (PT Sinar Mandiri) dijadwalkan pasang onsite besok pukul 09.00 WIB.',
    time: '3 jam yang lalu',
    type: 'delivery',
    unread: true,
    link: '/admin/projects/PRJ-2026-003'
  },
  {
    id: 'n-4',
    title: 'Pengajuan Kasbon Baru',
    description: 'Pak Joko Santoso mengajukan kasbon Rp 300.000 (Keperluan Keluarga).',
    time: 'Kemarin',
    type: 'worker',
    unread: false,
    link: '/admin/transactions'
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] =
    React.useState<DebufaNotification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const getTypeIcon = (type: DebufaNotification['type']) => {
    switch (type) {
      case 'payment':
        return <Icons.creditCard className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />;
      case 'production':
        return <Icons.hammer className='h-4 w-4 text-amber-600 dark:text-amber-400' />;
      case 'delivery':
        return <Icons.truck className='h-4 w-4 text-blue-600 dark:text-blue-400' />;
      case 'worker':
        return <Icons.users className='h-4 w-4 text-purple-600 dark:text-purple-400' />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant='ghost' size='icon' className='relative h-8 w-8 text-foreground' />}
      >
        <Icons.notification className='h-4 w-4' />
        {unreadCount > 0 && (
          <span className='bg-amber-600 text-white absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ring-2 ring-background'>
            {unreadCount}
          </span>
        )}
        <span className='sr-only'>Notifikasi Operasional</span>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[calc(100vw-2rem)] p-0 sm:w-[380px]' sideOffset={8}>
        <div className='flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/30'>
          <div className='flex items-center gap-2'>
            <h4 className='text-sm font-bold text-foreground'>Notifikasi Workshop</h4>
            {unreadCount > 0 && (
              <Badge
                variant='secondary'
                className='text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold'
              >
                {unreadCount} baru
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className='text-xs text-amber-800 dark:text-amber-400 hover:underline font-medium'
            >
              Tandai dibaca
            </button>
          )}
        </div>

        <ScrollArea className='h-[320px]'>
          <div className='divide-y divide-border/40'>
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => markAsRead(n.id)}
                className={`flex gap-3 p-3.5 transition-colors hover:bg-muted/50 ${
                  n.unread ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                }`}
              >
                <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 border border-border/50'>
                  {getTypeIcon(n.type)}
                </div>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <p
                      className={`text-xs font-semibold ${n.unread ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {n.title}
                    </p>
                    {n.unread && <span className='h-2 w-2 rounded-full bg-amber-600 shrink-0' />}
                  </div>
                  <p className='text-xs text-muted-foreground leading-snug line-clamp-2'>
                    {n.description}
                  </p>
                  <span className='text-[10px] text-muted-foreground/70 font-medium block pt-0.5'>
                    {n.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className='border-t border-border/50 p-2 text-center bg-muted/20'>
          <Link
            href='/admin/projects'
            className='text-xs text-muted-foreground hover:text-foreground font-medium'
          >
            Lihat semua aktivitas proyek &rarr;
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
