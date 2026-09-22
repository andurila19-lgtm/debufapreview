'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { formatRupiah, formatDateIndo, PAYMENT_STATUS_CONFIG } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function PembayaranPage() {
  const { projects, payments, addPayment } = useDebufaStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [payType, setPayType] = useState<'dp' | 'cicilan' | 'pelunasan'>('dp');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('Transfer BCA');
  const [payNotes, setPayNotes] = useState('');

  // Total Finansial Sederhana
  const totalOmset = projects.reduce((sum, p) => sum + (p.totalAmount || p.value || 0), 0);
  const totalDiterima = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const totalSisa = Math.max(0, totalOmset - totalDiterima);
  const totalLunas = projects.filter((p) => p.paymentStatus === 'lunas').length;

  const targetProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProject) {
      toast.error('Pilih pesanan terlebih dahulu.');
      return;
    }
    if (payAmount <= 0) {
      toast.error('Masukkan nominal pembayaran.');
      return;
    }

    addPayment({
      projectId: targetProject.id,
      customerName: targetProject.customerName,
      amount: Number(payAmount),
      date: new Date().toISOString().split('T')[0],
      type: payType,
      method: payMethod,
      status: 'verified',
      notes: payNotes || `Pembayaran ${payType.toUpperCase()} - ${targetProject.projectName}`
    });

    toast.success('Pembayaran Berhasil Dicatat!', {
      description: `Nominal ${formatRupiah(payAmount)} untuk ${targetProject.projectName} telah tersimpan.`
    });

    setIsAddOpen(false);
    setPayAmount(0);
    setPayNotes('');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Keuangan Bengkel
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Pembayaran Pesanan
          </h1>
          <p className='text-sm text-muted-foreground'>
            Pencatatan uang muka (DP), cicilan termin, dan pelunasan pesanan pelanggan
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedProjectId(projects[0]?.id || '');
            setIsAddOpen(true);
          }}
          className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold shadow-xs gap-1.5'
        >
          <Icons.add className='h-4 w-4' />+ Catat Pembayaran
        </Button>
      </div>

      {/* 4 Kartu Ringkasan Sederhana */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='border-border/60 p-4'>
          <span className='text-xs text-muted-foreground font-medium'>Total Nilai Pesanan</span>
          <div className='text-xl font-bold font-mono text-foreground mt-1'>
            {formatRupiah(totalOmset)}
          </div>
          <span className='text-[10px] text-muted-foreground'>{projects.length} total pesanan</span>
        </Card>

        <Card className='border-border/60 p-4'>
          <span className='text-xs text-muted-foreground font-medium'>Total Uang Masuk</span>
          <div className='text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1'>
            {formatRupiah(totalDiterima)}
          </div>
          <span className='text-[10px] text-muted-foreground'>
            {payments.length} transaksi pembayaran
          </span>
        </Card>

        <Card className='border-border/60 p-4'>
          <span className='text-xs text-muted-foreground font-medium'>
            Sisa Tagihan Belum Lunas
          </span>
          <div className='text-xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-1'>
            {formatRupiah(totalSisa)}
          </div>
          <span className='text-[10px] text-muted-foreground'>Perlu pelunasan</span>
        </Card>

        <Card className='border-border/60 p-4'>
          <span className='text-xs text-muted-foreground font-medium'>Pesanan Lunas</span>
          <div className='text-xl font-bold font-mono text-foreground mt-1'>
            {totalLunas}{' '}
            <span className='text-xs text-muted-foreground font-normal'>
              dari {projects.length}
            </span>
          </div>
          <span className='text-[10px] text-muted-foreground'>Telah lunas 100%</span>
        </Card>
      </div>

      {/* Tabel Status Pembayaran Tiap Pesanan */}
      <Card className='border-border/60 overflow-hidden shadow-xs'>
        <div className='p-4 border-b border-border/60 font-bold text-sm text-foreground'>
          Daftar Status Pembayaran per Pesanan
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
              <tr>
                <th className='p-3 font-semibold'>Pesanan & Pelanggan</th>
                <th className='p-3 font-semibold'>Total Harga</th>
                <th className='p-3 font-semibold'>Target DP</th>
                <th className='p-3 font-semibold'>Total Dibayar</th>
                <th className='p-3 font-semibold'>Sisa Tagihan</th>
                <th className='p-3 font-semibold'>Status</th>
                <th className='p-3 font-semibold text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {projects.map((proj) => {
                const total = proj.totalAmount || proj.value;
                const dp = proj.dpAmount || Math.round(total * 0.5);
                const sisa =
                  proj.remainingAmount !== undefined
                    ? proj.remainingAmount
                    : Math.max(0, total - proj.paidAmount);
                const statusInfo =
                  PAYMENT_STATUS_CONFIG[proj.paymentStatus || 'belum_bayar'] ||
                  PAYMENT_STATUS_CONFIG['belum_bayar'];

                return (
                  <tr key={proj.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='p-3'>
                      <Link
                        href={`/admin/pesanan/${proj.id}`}
                        className='font-bold text-foreground hover:text-amber-800 dark:hover:text-amber-300 hover:underline block'
                      >
                        {proj.projectName}
                      </Link>
                      <div className='text-[10px] text-muted-foreground font-mono'>
                        {proj.id} • {proj.customerName}
                      </div>
                    </td>
                    <td className='p-3 whitespace-nowrap font-mono font-semibold text-foreground'>
                      {formatRupiah(total)}
                    </td>
                    <td className='p-3 whitespace-nowrap font-mono text-muted-foreground'>
                      {formatRupiah(dp)}
                    </td>
                    <td className='p-3 whitespace-nowrap font-mono font-bold text-emerald-800 dark:text-emerald-400'>
                      {formatRupiah(proj.paidAmount)}
                    </td>
                    <td className='p-3 whitespace-nowrap font-mono'>
                      {sisa === 0 ? (
                        <span className='text-emerald-700 dark:text-emerald-400 font-semibold'>
                          Lunas (0)
                        </span>
                      ) : (
                        <span className='text-rose-700 dark:text-rose-400 font-bold'>
                          {formatRupiah(sisa)}
                        </span>
                      )}
                    </td>
                    <td className='p-3 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className='p-3 text-right whitespace-nowrap space-x-1.5'>
                      {sisa > 0 && (
                        <Button
                          size='sm'
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            setPayType(proj.paidAmount === 0 ? 'dp' : 'cicilan');
                            setPayAmount(proj.paidAmount === 0 ? dp : sisa);
                            setIsAddOpen(true);
                          }}
                          className='h-7 text-xs bg-amber-800 hover:bg-amber-900 text-amber-50'
                        >
                          + Catat Bayar
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        render={<Link href={`/admin/pesanan/${proj.id}`} />}
                        className='h-7 text-xs'
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Riwayat Pembayaran Masuk */}
      <Card className='border-border/60 overflow-hidden shadow-xs'>
        <div className='p-4 border-b border-border/60 font-bold text-sm text-foreground'>
          Riwayat Transaksi Uang Masuk
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
              <tr>
                <th className='p-3 font-semibold'>Tanggal</th>
                <th className='p-3 font-semibold'>Pelanggan & Pesanan</th>
                <th className='p-3 font-semibold'>Jenis</th>
                <th className='p-3 font-semibold'>Metode</th>
                <th className='p-3 font-semibold'>Nominal</th>
                <th className='p-3 font-semibold'>Catatan</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {payments.map((pay) => (
                <tr key={pay.id} className='hover:bg-muted/30 transition-colors'>
                  <td className='p-3 whitespace-nowrap font-mono text-muted-foreground'>
                    {formatDateIndo(pay.date)}
                  </td>
                  <td className='p-3 whitespace-nowrap'>
                    <span className='font-semibold text-foreground'>{pay.customerName}</span>
                    <span className='text-[10px] text-muted-foreground block font-mono'>
                      {pay.projectId}
                    </span>
                  </td>
                  <td className='p-3 whitespace-nowrap uppercase font-semibold text-[10px] text-amber-900 dark:text-amber-300'>
                    {pay.type}
                  </td>
                  <td className='p-3 whitespace-nowrap text-muted-foreground'>{pay.method}</td>
                  <td className='p-3 whitespace-nowrap font-mono font-bold text-emerald-800 dark:text-emerald-400'>
                    {formatRupiah(pay.amount)}
                  </td>
                  <td className='p-3 text-muted-foreground max-w-[200px] truncate'>{pay.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: CATAT PEMBAYARAN */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Catat Pembayaran Masuk
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Rekam penerimaan uang DP, cicilan, atau pelunasan dari pelanggan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePaymentSubmit} className='space-y-3.5 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Pilih Pesanan *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-semibold'
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((p) => {
                  const sisaTagihan =
                    p.remainingAmount !== undefined
                      ? p.remainingAmount
                      : (p.totalAmount || p.value) - p.paidAmount;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.customerName} ({p.projectName}) — Sisa:{' '}
                      {formatRupiah(sisaTagihan)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Jenis Pembayaran *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-medium'
                value={payType}
                onChange={(e) => setPayType(e.target.value as any)}
              >
                <option value='dp'>DP (Uang Muka 50%)</option>
                <option value='cicilan'>Cicilan / Pembayaran Berikutnya</option>
                <option value='pelunasan'>Pelunasan</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nominal Diterima (Rp) *</label>
              <Input
                type='number'
                min='100000'
                step='50000'
                required
                value={payAmount || ''}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                placeholder='Contoh: 5000000'
                className='text-xs font-mono font-bold'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Metode Pembayaran</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              >
                <option value='Transfer BCA'>Transfer Bank BCA</option>
                <option value='Transfer Mandiri'>Transfer Bank Mandiri</option>
                <option value='Transfer BNI / BRI'>Transfer Bank BNI / BRI</option>
                <option value='Tunai'>Tunai / Cash di Bengkel</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Catatan Transfer / Bukti</label>
              <Input
                placeholder='Contoh: Transfer atas nama Budi via m-BCA'
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                className='text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button type='button' variant='outline' size='sm' onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button
                type='submit'
                size='sm'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold'
              >
                Simpan Pembayaran
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
