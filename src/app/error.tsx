'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error caught by boundary:', error);
  }, [error]);

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Card className='max-w-md w-full p-6 text-center space-y-4 border-border/80 shadow-md'>
        <div className='h-12 w-12 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto'>
          <Icons.warning className='h-6 w-6' />
        </div>
        <div className='space-y-1.5'>
          <h2 className='text-lg font-bold text-foreground font-serif'>
            Terjadi Kendala pada Halaman
          </h2>
          <p className='text-xs text-muted-foreground'>
            {error?.message || 'Sistem mendeteksi kendala pada antarmuka. Silakan coba muat ulang.'}
          </p>
        </div>
        <div className='flex items-center justify-center gap-2 pt-2'>
          <Button
            size='sm'
            onClick={() => reset()}
            className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
          >
            Muat Ulang
          </Button>
          <Button size='sm' variant='outline' render={<Link href='/admin' />} className='text-xs'>
            Kembali ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
