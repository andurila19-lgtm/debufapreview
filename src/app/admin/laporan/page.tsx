'use client';

import React, { useMemo } from 'react';
import { useDebufaStore } from '@/lib/debufa-store';
import { formatRupiah, formatCompactRupiah, formatDateIndo } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

export default function LaporanPage() {
  const { projects, payments } = useDebufaStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.slice(0, 7); // YYYY-MM

  // 1. PENDAPATAN
  const pendapatanHariIni = useMemo(() => {
    return payments.filter((p) => p.date === todayStr).reduce((sum, p) => sum + p.amount, 0);
  }, [payments, todayStr]);

  const pendapatanBulanIni = useMemo(() => {
    return payments
      .filter((p) => p.date.startsWith(thisMonthStr) || p.date.startsWith('2026-03'))
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments, thisMonthStr]);

  // Pendapatan berdasarkan bulan
  const monthlyRevenue = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    payments.forEach((p) => {
      const month = p.date.slice(0, 7);
      if (!map[month]) map[month] = { count: 0, total: 0 };
      map[month].count += 1;
      map[month].total += p.amount;
    });

    return Object.entries(map)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, data]) => ({
        month,
        ...data
      }));
  }, [payments]);

  // 2. PEMESANAN
  const totalPesanan = projects.length;
  const pesananSelesai = projects.filter(
    (p) => p.status === 'completed' || p.status === 'selesai'
  ).length;
  const pesananBerjalan = projects.filter(
    (p) => p.status !== 'completed' && p.status !== 'selesai'
  ).length;

  const rincianBerjalan = {
    waiting_dp: projects.filter((p) => p.status === 'waiting_dp' || p.status === 'lead').length,
    production: projects.filter((p) => p.status === 'production' || p.status === 'produksi').length,
    finishing: projects.filter((p) => p.status === 'finishing').length,
    delivery: projects.filter((p) => p.status === 'delivery').length
  };

  const formatMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      {/* Header */}
      <div className='border-b border-border/60 pb-5'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
            Laporan Operasional
          </span>
        </div>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
          Laporan Bengkel Debufa Works
        </h1>
        <p className='text-sm text-muted-foreground'>
          Rekapitulasi penerimaan uang masuk dan status kemajuan pemesanan
        </p>
      </div>

      {/* SEKSI 1: LAPORAN PENDAPATAN */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800'>
            <Icons.creditCard className='h-3.5 w-3.5' />
          </div>
          <h2 className='text-base font-bold font-serif text-foreground'>1. Laporan Pendapatan</h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Card className='border-border/60 p-5 space-y-2 bg-card'>
            <span className='text-xs text-muted-foreground font-medium'>Pendapatan Hari Ini</span>
            <div className='text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400'>
              {formatRupiah(pendapatanHariIni)}
            </div>
            <p className='text-[10px] text-muted-foreground'>
              {pendapatanHariIni > 0
                ? 'Ada penerimaan pembayaran masuk hari ini'
                : 'Belum ada transaksi pembayaran masuk hari ini'}
            </p>
          </Card>

          <Card className='border-border/60 p-5 space-y-2 bg-card'>
            <span className='text-xs text-muted-foreground font-medium'>
              Pendapatan Bulan Ini ({formatMonthName(thisMonthStr)})
            </span>
            <div className='text-2xl font-bold font-mono text-foreground'>
              {formatRupiah(pendapatanBulanIni)}
            </div>
            <p className='text-[10px] text-muted-foreground'>
              Total akumulasi DP dan pelunasan masuk
            </p>
          </Card>
        </div>

        {/* Tabel Pendapatan Berdasarkan Bulan */}
        <Card className='border-border/60 overflow-hidden shadow-xs'>
          <div className='p-4 border-b border-border/60 font-semibold text-xs text-foreground'>
            Pendapatan Berdasarkan Bulan
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-xs text-left'>
              <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
                <tr>
                  <th className='p-3 font-semibold'>Periode Bulan</th>
                  <th className='p-3 font-semibold text-center'>Jumlah Transaksi</th>
                  <th className='p-3 font-semibold text-right'>Total Uang Masuk</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {monthlyRevenue.map((item) => (
                  <tr key={item.month} className='hover:bg-muted/30 transition-colors'>
                    <td className='p-3 font-medium text-foreground whitespace-nowrap'>
                      {formatMonthName(item.month)}
                    </td>
                    <td className='p-3 text-center font-mono text-muted-foreground'>
                      {item.count} transaksi
                    </td>
                    <td className='p-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap'>
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* SEKSI 2: LAPORAN PEMESANAN */}
      <div className='space-y-4 pt-2'>
        <div className='flex items-center gap-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800'>
            <Icons.furniture className='h-3.5 w-3.5' />
          </div>
          <h2 className='text-base font-bold font-serif text-foreground'>
            2. Laporan Pemesanan Furniture
          </h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <Card className='border-border/60 p-5 space-y-1.5'>
            <span className='text-xs text-muted-foreground font-medium'>
              Jumlah Seluruh Pesanan
            </span>
            <div className='text-3xl font-bold font-serif text-foreground'>{totalPesanan}</div>
            <p className='text-[10px] text-muted-foreground'>Total pesanan yang masuk ke bengkel</p>
          </Card>

          <Card className='border-border/60 p-5 space-y-1.5'>
            <span className='text-xs text-muted-foreground font-medium'>
              Pesanan Masih Berjalan
            </span>
            <div className='text-3xl font-bold font-serif text-amber-800 dark:text-amber-300'>
              {pesananBerjalan}
            </div>
            <p className='text-[10px] text-muted-foreground'>Sedang dalam proses pengerjaan</p>
          </Card>

          <Card className='border-border/60 p-5 space-y-1.5'>
            <span className='text-xs text-muted-foreground font-medium'>Pesanan Selesai</span>
            <div className='text-3xl font-bold font-serif text-emerald-700 dark:text-emerald-400'>
              {pesananSelesai}
            </div>
            <p className='text-[10px] text-muted-foreground'>Telah terpasang dan serah terima</p>
          </Card>
        </div>

        {/* Rincian Status Pesanan Berjalan */}
        <Card className='border-border/60 p-5 space-y-4'>
          <div className='font-semibold text-xs text-foreground'>
            Rincian Status Pesanan yang Masih Berjalan:
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-center'>
            <div className='p-3 rounded-lg bg-amber-500/10 border border-amber-800/20 space-y-1'>
              <span className='text-[10px] font-semibold text-amber-900 dark:text-amber-300 uppercase block'>
                Menunggu DP
              </span>
              <span className='text-2xl font-bold font-mono text-amber-900 dark:text-amber-200'>
                {rincianBerjalan.waiting_dp}
              </span>
              <span className='text-[10px] text-muted-foreground block'>pesanan</span>
            </div>

            <div className='p-3 rounded-lg bg-orange-500/10 border border-orange-800/20 space-y-1'>
              <span className='text-[10px] font-semibold text-orange-900 dark:text-orange-300 uppercase block'>
                Produksi Rangka
              </span>
              <span className='text-2xl font-bold font-mono text-orange-900 dark:text-orange-200'>
                {rincianBerjalan.production}
              </span>
              <span className='text-[10px] text-muted-foreground block'>pesanan</span>
            </div>

            <div className='p-3 rounded-lg bg-purple-500/10 border border-purple-800/20 space-y-1'>
              <span className='text-[10px] font-semibold text-purple-900 dark:text-purple-300 uppercase block'>
                Finishing HPL/Duco
              </span>
              <span className='text-2xl font-bold font-mono text-purple-900 dark:text-purple-200'>
                {rincianBerjalan.finishing}
              </span>
              <span className='text-[10px] text-muted-foreground block'>pesanan</span>
            </div>

            <div className='p-3 rounded-lg bg-blue-500/10 border border-blue-800/20 space-y-1'>
              <span className='text-[10px] font-semibold text-blue-900 dark:text-blue-300 uppercase block'>
                Siap Dikirim
              </span>
              <span className='text-2xl font-bold font-mono text-blue-900 dark:text-blue-200'>
                {rincianBerjalan.delivery}
              </span>
              <span className='text-[10px] text-muted-foreground block'>pesanan</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
