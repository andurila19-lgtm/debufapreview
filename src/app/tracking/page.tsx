'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { ProjectStatus } from '@/types/debufa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

import { formatDateIndo, STATUS_CONFIG } from '@/lib/formatters';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get('code') || '';

  const { projects } = useDebufaStore();
  const [inputCode, setInputCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode || 'DBF-00125');

  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
      setSearchedCode(initialCode);
    }
  }, [initialCode]);

  const activeProject = projects.find(
    (p) =>
      p.id.toLowerCase() === searchedCode.trim().toLowerCase() ||
      p.customerPhone.includes(searchedCode.trim())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchedCode(inputCode.trim());
    }
  };

  // Status mapping ke 6 langkah visual yang diminta:
  // 1. Pesanan -> 2. DP -> 3. Produksi -> 4. Finishing -> 5. Siap Dikirim -> 6. Selesai
  const getStepState = (stepIndex: number, status: ProjectStatus, paidAmount: number) => {
    // 0: Pesanan
    if (stepIndex === 0) return 'done';

    // 1: DP
    if (stepIndex === 1) {
      if (
        paidAmount > 0 ||
        ['production', 'produksi', 'finishing', 'delivery', 'completed', 'selesai'].includes(status)
      ) {
        return 'done';
      }
      return status === 'waiting_dp' ? 'current' : 'pending';
    }

    // 2: Produksi
    if (stepIndex === 2) {
      if (['finishing', 'delivery', 'completed', 'selesai'].includes(status)) {
        return 'done';
      }
      if (['production', 'produksi'].includes(status)) {
        return 'current';
      }
      return 'pending';
    }

    // 3: Finishing
    if (stepIndex === 3) {
      if (['delivery', 'completed', 'selesai'].includes(status)) {
        return 'done';
      }
      if (status === 'finishing') {
        return 'current';
      }
      return 'pending';
    }

    // 4: Siap Dikirim
    if (stepIndex === 4) {
      if (['completed', 'selesai'].includes(status)) {
        return 'done';
      }
      if (status === 'delivery') {
        return 'current';
      }
      return 'pending';
    }

    // 5: Selesai
    if (stepIndex === 5) {
      if (['completed', 'selesai'].includes(status)) {
        return 'done';
      }
      return 'pending';
    }

    return 'pending';
  };

  const steps = [
    { label: 'Pesanan' },
    { label: 'DP' },
    { label: 'Produksi' },
    { label: 'Finishing' },
    { label: 'Siap Dikirim' },
    { label: 'Selesai' }
  ];

  // Catatan update terakhir
  const latestNote = activeProject?.lastUpdate || 'Sedang dalam pengerjaan workshop Debufa Works.';

  // Foto pengerjaan jika ada
  const progressPhotos = activeProject
    ? activeProject.files.filter(
        (f) => f.category === 'Progress Photo' || f.type === 'foto_progress'
      )
    : [];

  const statusLabel = activeProject
    ? STATUS_CONFIG[activeProject.status]?.label || activeProject.status
    : '';

  return (
    <div className='min-h-screen bg-stone-50/50 dark:bg-background text-foreground flex flex-col'>
      {/* Header */}
      <header className='border-b border-border/60 bg-background/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6'>
        <div className='max-w-4xl mx-auto h-16 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-amber-800 text-amber-50 font-bold'>
              <Icons.hammer className='h-4 w-4' />
            </div>
            <div>
              <span className='font-serif font-bold text-base tracking-tight block'>
                DEBUFA WORKS
              </span>
              <span className='text-[10px] text-muted-foreground block -mt-0.5'>
                Cek Pesanan Online
              </span>
            </div>
          </Link>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              render={<Link href='/estimasi' />}
              className='text-xs'
            >
              Estimasi Harga
            </Button>
            <Button variant='ghost' size='sm' render={<Link href='/' />} className='text-xs'>
              Beranda
            </Button>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className='flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6'>
        {/* Search Bar */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl sm:text-3xl font-bold font-serif tracking-tight'>
            Cek Progres Pesanan Anda
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground max-w-md mx-auto'>
            Pantau status dan tahapan pengerjaan furniture custom Anda secara langsung dari bengkel
            Debufa Works.
          </p>
        </div>

        <form onSubmit={handleSearch} className='flex gap-2 max-w-md mx-auto'>
          <Input
            placeholder='Masukkan kode pesanan (contoh: DBF-00125)'
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className='text-xs font-mono'
          />
          <Button
            type='submit'
            className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold px-5'
          >
            Cek Pesanan
          </Button>
        </form>

        {activeProject ? (
          <Card className='border-border/70 p-6 space-y-6 bg-card shadow-xs'>
            {/* Info Pelanggan & Pesanan */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-border/60 pb-5'>
              <div className='space-y-1'>
                <span className='text-[11px] text-muted-foreground block font-medium'>
                  Pelanggan:
                </span>
                <span className='text-lg font-bold font-serif text-foreground block'>
                  Untuk {activeProject.customerName}
                </span>
                <span className='text-xs text-muted-foreground block font-mono'>
                  Kode Pesanan: <strong className='text-foreground'>{activeProject.id}</strong>
                </span>
              </div>

              <div className='space-y-1 sm:text-right'>
                <span className='text-[11px] text-muted-foreground block font-medium'>
                  Pesanan Furniture:
                </span>
                <span className='text-base font-bold text-foreground block'>
                  {activeProject.projectName}
                </span>
                <div className='text-xs text-muted-foreground mt-0.5'>
                  Status:{' '}
                  <strong className='text-amber-800 dark:text-amber-400 font-semibold'>
                    {statusLabel} ({activeProject.progress}%)
                  </strong>
                </div>
                <div className='text-[11px] text-muted-foreground'>
                  Target Selesai:{' '}
                  <strong className='text-foreground'>
                    {formatDateIndo(activeProject.deadline)}
                  </strong>
                </div>
              </div>
            </div>

            {/* STATUS VISUAL 6 LANGKAH */}
            <div className='space-y-3'>
              <span className='font-semibold text-xs text-foreground block'>
                Tahapan Pengerjaan:
              </span>
              <div className='grid grid-cols-2 sm:grid-cols-6 gap-2'>
                {steps.map((st, idx) => {
                  const state = getStepState(idx, activeProject.status, activeProject.paidAmount);

                  return (
                    <div
                      key={st.label}
                      className={`p-2.5 rounded-lg border text-center space-y-1 transition-all ${
                        state === 'done'
                          ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-300'
                          : state === 'current'
                            ? 'border-amber-800 bg-amber-800/15 text-amber-950 dark:text-amber-200 font-bold ring-1 ring-amber-800'
                            : 'border-border/50 bg-muted/20 text-muted-foreground'
                      }`}
                    >
                      <div className='text-xs font-bold'>
                        {state === 'done' && '✓'}
                        {state === 'current' && '●'}
                        {state === 'pending' && '○'}
                      </div>
                      <div className='text-[11px] leading-tight font-medium'>{st.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UPDATE TERAKHIR CALLOUT */}
            <div className='p-4 rounded-xl bg-amber-500/10 border border-amber-800/30 space-y-1.5'>
              <div className='flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs'>
                <Icons.info className='h-4 w-4 shrink-0' />
                <span>Update Terakhir dari Workshop:</span>
              </div>
              <p className='text-xs sm:text-sm text-foreground font-medium pl-6 leading-relaxed'>
                &ldquo;{latestNote}&rdquo;
              </p>
            </div>

            {/* FOTO PROGRES (JIKA ADA) */}
            {progressPhotos.length > 0 && (
              <div className='space-y-2 pt-2'>
                <span className='font-semibold text-xs text-foreground block'>
                  Dokumentasi Pengerjaan:
                </span>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {progressPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className='rounded-lg border border-border/60 overflow-hidden bg-muted/20'
                    >
                      <img src={photo.url} alt={photo.name} className='w-full h-32 object-cover' />
                      <div className='p-2 text-[10px] text-muted-foreground truncate'>
                        {photo.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPESIFIKASI */}
            <div className='border-t border-border/50 pt-4 space-y-2 text-xs'>
              <span className='font-semibold text-foreground block'>Spesifikasi Singkat:</span>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 text-muted-foreground text-[11px]'>
                <div>
                  Bahan:{' '}
                  <strong className='text-foreground'>
                    {activeProject.specifications?.material || 'Multiplek 18mm'}
                  </strong>
                </div>
                <div>
                  Finishing:{' '}
                  <strong className='text-foreground'>
                    {activeProject.specifications?.finishing || 'HPL'}
                  </strong>
                </div>
                <div>
                  Hardware:{' '}
                  <strong className='text-foreground'>
                    {activeProject.specifications?.hardware || 'Slow-Closing'}
                  </strong>
                </div>
              </div>
            </div>

            {/* BANTUAN WA */}
            <div className='pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/50'>
              <span>Ada pertanyaan mengenai pesanan ini?</span>
              <Button
                variant='outline'
                size='sm'
                render={
                  <a
                    href={`https://wa.me/6281289123456?text=${encodeURIComponent(
                      `Halo Debufa Works, saya ingin bertanya mengenai pesanan ${activeProject.projectName} (${activeProject.id}).`
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }
                className='text-xs border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 gap-1.5'
              >
                <Icons.whatsapp className='h-3.5 w-3.5' />
                Hubungi Admin via WhatsApp
              </Button>
            </div>
          </Card>
        ) : (
          <Card className='border-border/60 p-8 text-center space-y-3 bg-card'>
            <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
              <Icons.search className='h-6 w-6' />
            </div>
            <h3 className='font-bold text-sm text-foreground'>Pesanan Tidak Ditemukan</h3>
            <p className='text-xs text-muted-foreground max-w-sm mx-auto'>
              Kode pesanan &ldquo;{searchedCode}&rdquo; tidak terdaftar. Pastikan kode yang Anda
              masukkan sesuai dengan yang tercantum di surat penawaran atau WhatsApp admin.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center text-xs text-muted-foreground'>Memuat data tracking...</div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
