'use client';

import React from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { formatRupiah, formatDateIndo, STATUS_CONFIG } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function AdminDashboardPage() {
  const { projects, payments } = useDebufaStore();

  // Metrik Utama Sederhana
  const activePesanan = projects.filter((p) => p.status !== 'selesai' && p.status !== 'completed');
  const menungguDP = projects.filter((p) => p.status === 'waiting_dp' || p.status === 'lead');
  const sedangProduksi = projects.filter(
    (p) => p.status === 'produksi' || p.status === 'production'
  );
  const finishing = projects.filter((p) => p.status === 'finishing');
  const siapDikirim = projects.filter((p) => p.status === 'delivery');

  // Pendapatan Bulan Ini
  const pendapatanBulanIni = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);

  // Perlu Perhatian Sesuai Prompt
  const attentionItems = [
    {
      id: 'att-1',
      title: 'Lemari Ibu Sari — deadline 3 hari lagi',
      description:
        'Pesanan Lemari Pakaian 4 Pintu (DBF-00123) menunggu pembayaran DP 50% untuk mulai potong bahan.',
      orderId: 'DBF-00123',
      badge: 'Menunggu DP',
      badgeClass:
        'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'att-2',
      title: 'Kitchen Set Budi — siap masuk tahap finishing',
      description:
        'Kitchen Set Minimalis Modern (DBF-00125) rangka utama telah selesai 60%, masuk tahap pengerjaan pintu.',
      orderId: 'DBF-00125',
      badge: 'Produksi 60%',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
    }
  ];

  const pesananTerbaru = [...projects].slice(0, 8);

  return (
    <div className='space-y-6'>
      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='inline-block h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse'></span>
            <span className='text-xs uppercase font-semibold tracking-wider text-amber-800 dark:text-amber-400'>
              Sistem Operasional Workshop
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-1'>
            Dashboard Debufa Works
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Ringkasan status pengerjaan furniture custom dan perputaran pesanan bengkel
          </p>
        </div>

        <div className='flex items-center gap-2.5'>
          <Button
            size='sm'
            render={<Link href='/admin/pesanan' />}
            className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
          >
            <Icons.add className='mr-1.5 h-4 w-4' />+ Pesanan Baru
          </Button>
        </div>
      </div>

      {/* 6 KARTU METRIK UTAMA */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
        <Card className='border-border/70 bg-card shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-muted-foreground'>Pesanan Aktif</span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-2xl font-bold text-foreground'>{activePesanan.length}</div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Dalam pengerjaan</p>
          </CardContent>
        </Card>

        <Card className='border-border/70 bg-card shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-amber-800 dark:text-amber-400'>
              Menunggu DP
            </span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-2xl font-bold text-amber-800 dark:text-amber-400'>
              {menungguDP.length}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Belum mulai produksi</p>
          </CardContent>
        </Card>

        <Card className='border-border/70 bg-card shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-blue-700 dark:text-blue-400'>
              Sedang Produksi
            </span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-2xl font-bold text-blue-700 dark:text-blue-400'>
              {sedangProduksi.length}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Rangka kayu workshop</p>
          </CardContent>
        </Card>

        <Card className='border-border/70 bg-card shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-purple-700 dark:text-purple-400'>
              Finishing
            </span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-2xl font-bold text-purple-700 dark:text-purple-400'>
              {finishing.length}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>HPL, Duco, Edging</p>
          </CardContent>
        </Card>

        <Card className='border-border/70 bg-card shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-emerald-700 dark:text-emerald-400'>
              Siap Dikirim
            </span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-2xl font-bold text-emerald-700 dark:text-emerald-400'>
              {siapDikirim.length}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Packing & instalasi</p>
          </CardContent>
        </Card>

        <Card className='border-amber-700/40 bg-amber-500/5 shadow-xs'>
          <CardHeader className='p-3.5 pb-1'>
            <span className='text-xs font-medium text-amber-900 dark:text-amber-200'>
              Pendapatan Masuk
            </span>
          </CardHeader>
          <CardContent className='p-3.5 pt-0'>
            <div className='text-lg font-bold text-amber-900 dark:text-amber-200 truncate font-mono'>
              {formatRupiah(pendapatanBulanIni)}
            </div>
            <p className='text-[10px] text-muted-foreground mt-0.5'>Total uang diterima</p>
          </CardContent>
        </Card>
      </div>

      {/* PESANAN TERBARU */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-base font-bold text-foreground font-serif'>Pesanan Terbaru</h2>
            <p className='text-xs text-muted-foreground'>
              Daftar pesanan aktif dan status pengerjaan
            </p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            render={<Link href='/admin/pesanan' />}
            className='text-xs text-muted-foreground hover:text-foreground'
          >
            Kelola Semua Pesanan ({projects.length})
            <Icons.chevronRight className='ml-1 h-3.5 w-3.5' />
          </Button>
        </div>

        <Card className='border-border/60 overflow-hidden shadow-xs'>
          <div className='overflow-x-auto'>
            <table className='w-full text-xs text-left'>
              <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
                <tr>
                  <th className='p-3 font-semibold'>ID</th>
                  <th className='p-3 font-semibold'>Pelanggan</th>
                  <th className='p-3 font-semibold'>Pesanan</th>
                  <th className='p-3 font-semibold'>Total</th>
                  <th className='p-3 font-semibold'>Status</th>
                  <th className='p-3 font-semibold text-right'>Deadline</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {pesananTerbaru.map((proj) => {
                  const statusInfo = STATUS_CONFIG[proj.status] || STATUS_CONFIG['waiting_dp'];
                  return (
                    <tr
                      key={proj.id}
                      className='hover:bg-muted/30 transition-colors group cursor-pointer'
                      onClick={() => (window.location.href = `/admin/pesanan/${proj.id}`)}
                    >
                      <td className='p-3 font-mono font-semibold text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 whitespace-nowrap'>
                        {proj.id}
                      </td>
                      <td className='p-3 font-medium text-foreground whitespace-nowrap'>
                        {proj.customerName}
                      </td>
                      <td className='p-3 text-muted-foreground max-w-[220px] truncate'>
                        {proj.projectName}
                      </td>
                      <td className='p-3 font-semibold text-foreground whitespace-nowrap font-mono'>
                        {formatRupiah(proj.value)}
                      </td>
                      <td className='p-3 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className='p-3 text-right text-muted-foreground whitespace-nowrap font-mono text-[11px]'>
                        {formatDateIndo(proj.deadline)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* PROGRES PESANAN */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-base font-bold text-foreground font-serif'>Progres Pesanan</h2>
            <p className='text-xs text-muted-foreground'>
              Tahap pengerjaan fisik furniture di workshop
            </p>
          </div>
        </div>

        <Card className='border-border/60 p-4 shadow-xs space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {activePesanan.map((proj) => {
              const statusInfo = STATUS_CONFIG[proj.status] || STATUS_CONFIG['waiting_dp'];
              return (
                <Link
                  key={proj.id}
                  href={`/admin/pesanan/${proj.id}`}
                  className='block p-3 rounded-lg border border-border/70 hover:border-amber-700/50 hover:bg-muted/20 transition-all'
                >
                  <div className='flex items-center justify-between mb-1.5'>
                    <div className='truncate max-w-[200px]'>
                      <span className='font-semibold text-xs text-foreground mr-1.5'>
                        {proj.projectName}
                      </span>
                      <span className='text-[10px] text-muted-foreground'>
                        ({proj.customerName})
                      </span>
                    </div>
                    <span className='text-xs font-mono font-bold text-amber-800 dark:text-amber-400'>
                      {proj.progress}%
                    </span>
                  </div>

                  {/* Progress Bar Sederhana */}
                  <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                    <div
                      className='bg-amber-800 dark:bg-amber-600 h-2 rounded-full transition-all'
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  <div className='flex items-center justify-between mt-2 text-[10px] text-muted-foreground'>
                    <span>
                      Status: <strong className='text-foreground'>{statusInfo.label}</strong>
                    </span>
                    <span>Deadline: {formatDateIndo(proj.deadline)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* PERLU PERHATIAN */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Icons.warning className='h-4 w-4 text-amber-700 dark:text-amber-400' />
          <h2 className='text-base font-bold text-foreground font-serif'>Perlu Perhatian</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {attentionItems.map((item) => (
            <Link key={item.id} href={`/admin/pesanan/${item.orderId}`} className='group block'>
              <Card className='h-full border-border/70 hover:border-amber-700/50 hover:shadow-xs transition-all bg-card'>
                <CardHeader className='p-3.5 pb-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-semibold ${item.badgeClass}`}
                    >
                      {item.badge}
                    </Badge>
                    <span className='text-[11px] font-mono text-muted-foreground'>
                      {item.orderId}
                    </span>
                  </div>
                  <CardTitle className='text-sm font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors mt-1'>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-3.5 pt-0'>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
