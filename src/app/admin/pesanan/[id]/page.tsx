'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { ProjectStatus } from '@/types/debufa';
import { formatRupiah, formatDateIndo, STATUS_CONFIG } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function DetailPesananPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { projects, updateProjectProgress, addPayment } = useDebufaStore();

  const project = projects.find((p) => p.id === id);

  // Modal Update Progres
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus>(project?.status || 'waiting_dp');
  const [progressNote, setProgressNote] = useState('');
  const [progressPercent, setProgressPercent] = useState<number>(project?.progress || 35);
  const [progressActor, setProgressActor] = useState('Admin Bengkel');

  // Modal Catat Pembayaran
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payType, setPayType] = useState<'dp' | 'cicilan' | 'pelunasan'>('dp');
  const [payMethod, setPayMethod] = useState('Transfer BCA');
  const [payNotes, setPayNotes] = useState('');

  if (!project) {
    return (
      <div className='p-8 text-center space-y-3'>
        <h2 className='text-lg font-bold text-foreground'>Pesanan Tidak Ditemukan</h2>
        <p className='text-xs text-muted-foreground'>
          Kode pesanan {id} tidak terdaftar di sistem.
        </p>
        <Button size='sm' render={<Link href='/admin/pesanan' />} className='text-xs'>
          Kembali ke Daftar Pesanan
        </Button>
      </div>
    );
  }

  const total = project.totalAmount || project.value;
  const dpAmount = project.dpAmount || Math.round(total * 0.5);
  const sisa =
    project.remainingAmount !== undefined
      ? project.remainingAmount
      : Math.max(0, total - project.paidAmount);

  // 6 Tahapan Visual Sederhana sesuai alur Debufa Works:
  // 1. Pesanan -> 2. DP -> 3. Produksi -> 4. Finishing -> 5. Siap Dikirim -> 6. Selesai
  const progressSteps = [
    { key: 'order', label: 'Pesanan', defaultPercent: 10 },
    { key: 'waiting_dp', label: 'DP', defaultPercent: 20 },
    { key: 'production', label: 'Produksi', defaultPercent: 60 },
    { key: 'finishing', label: 'Finishing', defaultPercent: 80 },
    { key: 'delivery', label: 'Siap Dikirim', defaultPercent: 95 },
    { key: 'completed', label: 'Selesai', defaultPercent: 100 }
  ];

  const getStepStatus = (index: number) => {
    // 0: Pesanan -> Selalu selesai
    if (index === 0) return 'done';

    // 1: DP -> Selesai jika sudah bayar atau status melewati DP
    if (index === 1) {
      if (
        project.paidAmount > 0 ||
        ['production', 'produksi', 'finishing', 'delivery', 'completed', 'selesai'].includes(
          project.status
        )
      ) {
        return 'done';
      }
      return project.status === 'waiting_dp' ? 'current' : 'pending';
    }

    // 2: Produksi
    if (index === 2) {
      if (['finishing', 'delivery', 'completed', 'selesai'].includes(project.status)) return 'done';
      if (['production', 'produksi'].includes(project.status)) return 'current';
      return 'pending';
    }

    // 3: Finishing
    if (index === 3) {
      if (['delivery', 'completed', 'selesai'].includes(project.status)) return 'done';
      if (project.status === 'finishing') return 'current';
      return 'pending';
    }

    // 4: Siap Dikirim
    if (index === 4) {
      if (['completed', 'selesai'].includes(project.status)) return 'done';
      if (project.status === 'delivery') return 'current';
      return 'pending';
    }

    // 5: Selesai
    if (index === 5) {
      if (['completed', 'selesai'].includes(project.status)) return 'done';
      return 'pending';
    }

    return 'pending';
  };

  const handleOpenUpdate = () => {
    setNewStatus(project.status);
    setProgressPercent(project.progress || 60);
    setProgressNote(
      project.id === 'DBF-00125' && !project.lastUpdate
        ? 'Rangka utama sudah selesai dan sedang masuk tahap pengerjaan pintu.'
        : project.lastUpdate || ''
    );
    setIsUpdateOpen(true);
  };

  const handleUpdateProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote) {
      toast.error('Mohon isi catatan progres pengerjaan.');
      return;
    }

    updateProjectProgress(project.id, {
      status: newStatus,
      progress: Number(progressPercent),
      note: progressNote,
      date: new Date().toISOString().split('T')[0],
      actor: progressActor
    });

    toast.success('Progres Pesanan Berhasil Diperbarui!', {
      description: `Status: ${STATUS_CONFIG[newStatus]?.label || newStatus} (${progressPercent}%). Customer tracking otomatis terupdate.`
    });

    setIsUpdateOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      toast.error('Masukkan nominal pembayaran yang valid.');
      return;
    }

    addPayment({
      projectId: project.id,
      customerName: project.customerName,
      amount: Number(payAmount),
      date: new Date().toISOString().split('T')[0],
      type: payType,
      method: payMethod,
      status: 'verified',
      notes: payNotes || `Pembayaran ${payType.toUpperCase()} untuk ${project.projectName}`
    });

    toast.success('Pembayaran Berhasil Dicatat!', {
      description: `Nominal ${formatRupiah(payAmount)} telah ditambahkan dan mengurangi sisa tagihan.`
    });

    setIsPaymentOpen(false);
    setPayAmount(0);
  };

  const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG['waiting_dp'];
  const waUrl = `https://wa.me/${project.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Halo ${project.customerName}, kami dari Debufa Works menginfokan update pesanan ${project.projectName} (${project.id}). Status saat ini: ${statusInfo.label} (${project.progress}%). Catatan: "${project.lastUpdate || 'Sedang dalam pengerjaan'}". Terima kasih.`
  )}`;

  return (
    <div className='space-y-6'>
      {/* Top Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4'>
        <div>
          <Button
            variant='ghost'
            size='sm'
            render={<Link href='/admin/pesanan' />}
            className='text-xs text-muted-foreground p-0 h-auto hover:bg-transparent mb-1'
          >
            <Icons.chevronLeft className='mr-1 h-3.5 w-3.5' />
            Kembali ke Daftar Pesanan
          </Button>
          <div className='flex items-center gap-3 mt-1'>
            <h1 className='text-2xl font-bold font-serif text-foreground'>{project.projectName}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className='text-xs text-muted-foreground mt-0.5'>
            ID Pesanan: <strong className='font-mono text-foreground'>{project.id}</strong> • Target
            Deadline: {formatDateIndo(project.deadline)}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            render={<a href={waUrl} target='_blank' rel='noopener noreferrer' />}
            className='text-xs text-emerald-700 dark:text-emerald-400 border-emerald-600/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5'
          >
            <Icons.whatsapp className='h-3.5 w-3.5 text-emerald-600' />
            Kirim Update WA
          </Button>

          <Button
            variant='outline'
            size='sm'
            render={<Link href={`/tracking?code=${project.id}`} target='_blank' />}
            className='text-xs gap-1.5'
          >
            <Icons.truck className='h-3.5 w-3.5 text-amber-800 dark:text-amber-400' />
            Lihat di Tracking Customer
          </Button>

          <Button
            size='sm'
            onClick={handleOpenUpdate}
            className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold gap-1.5'
          >
            <Icons.edit className='h-3.5 w-3.5' />
            Perbarui Progres
          </Button>
        </div>
      </div>

      {/* PROGRES 6 TAHAP VISUAL */}
      <Card className='border-border/60 p-5 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='font-bold text-sm text-foreground flex items-center gap-2'>
            <Icons.hammer className='h-4 w-4 text-amber-800 dark:text-amber-400' />
            Tahapan Pengerjaan Pesanan
          </div>
          <span className='text-xs font-mono font-semibold text-amber-800 dark:text-amber-300'>
            Progres: {project.progress}%
          </span>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1'>
          {progressSteps.map((step, idx) => {
            const state = getStepStatus(idx);

            return (
              <div
                key={step.key}
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
                <div className='text-[11px] leading-tight font-medium'>{step.label}</div>
              </div>
            );
          })}
        </div>

        {/* Update Terakhir Callout */}
        <div className='p-3.5 rounded-lg bg-amber-500/10 border border-amber-800/30 text-xs flex items-start gap-2.5'>
          <Icons.info className='h-4 w-4 text-amber-800 shrink-0 mt-0.5' />
          <div>
            <span className='font-semibold text-foreground'>Catatan Pengerjaan Terakhir:</span>
            <p className='text-muted-foreground mt-0.5'>
              {project.lastUpdate || 'Belum ada catatan progres.'}
            </p>
          </div>
        </div>
      </Card>

      {/* 3 BAGIAN UTAMA: PELANGGAN, PESANAN, PEMBAYARAN */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* BAGIAN 1: PELANGGAN */}
        <Card className='border-border/60 p-5 space-y-4 text-xs'>
          <CardHeader className='p-0 border-b border-border/50 pb-2.5'>
            <CardTitle className='text-sm font-bold font-serif text-foreground flex items-center justify-between'>
              <span>Pelanggan</span>
              <Icons.user className='h-4 w-4 text-muted-foreground' />
            </CardTitle>
          </CardHeader>

          <CardContent className='p-0 space-y-3'>
            <div>
              <span className='text-[10px] text-muted-foreground uppercase font-semibold block'>
                Nama Lengkap
              </span>
              <span className='text-sm font-semibold text-foreground'>{project.customerName}</span>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground uppercase font-semibold block'>
                Nomor WhatsApp
              </span>
              <div className='flex items-center justify-between mt-0.5'>
                <span className='font-mono font-medium text-foreground'>
                  {project.customerPhone}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  render={<a href={waUrl} target='_blank' rel='noopener noreferrer' />}
                  className='h-6 text-[10px] border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 gap-1'
                >
                  <Icons.whatsapp className='h-3 w-3' /> Chat WA
                </Button>
              </div>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground uppercase font-semibold block'>
                Alamat Pemasangan
              </span>
              <p className='text-xs text-foreground leading-relaxed mt-0.5'>
                {project.customerAddress || 'Lokasi belum diisi'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* BAGIAN 2: PESANAN */}
        <Card className='border-border/60 p-5 space-y-4 text-xs'>
          <CardHeader className='p-0 border-b border-border/50 pb-2.5'>
            <CardTitle className='text-sm font-bold font-serif text-foreground flex items-center justify-between'>
              <span>Rincian Pesanan</span>
              <Icons.furniture className='h-4 w-4 text-muted-foreground' />
            </CardTitle>
          </CardHeader>

          <CardContent className='p-0 space-y-2.5'>
            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Jenis Furniture:</span>
              <span className='font-medium text-foreground text-right'>
                {project.furnitureType}
              </span>
            </div>

            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Ukuran:</span>
              <span className='font-mono font-medium text-foreground text-right'>
                {project.specifications?.dimensions
                  ? `${project.specifications.dimensions.length} x ${project.specifications.dimensions.height} x ${project.specifications.dimensions.depth} ${project.specifications.dimensions.unit || 'm'}`
                  : 'Sesuai Survey Lokasi'}
              </span>
            </div>

            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Bahan Utama:</span>
              <span className='text-foreground text-right max-w-[150px] truncate'>
                {project.specifications?.material || 'Multiplek 18mm'}
              </span>
            </div>

            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Finishing:</span>
              <span className='text-foreground text-right max-w-[150px] truncate'>
                {project.specifications?.finishing || 'HPL Standar'}
              </span>
            </div>

            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Hardware:</span>
              <span className='text-foreground text-right max-w-[150px] truncate'>
                {project.specifications?.hardware || 'Slow-Motion'}
              </span>
            </div>

            <div className='flex justify-between border-b border-border/30 pb-1.5'>
              <span className='text-muted-foreground'>Jumlah Unit:</span>
              <span className='font-mono font-medium'>
                {project.specifications?.quantity || 1} Unit
              </span>
            </div>

            <div className='pt-1'>
              <span className='text-[10px] text-muted-foreground uppercase font-semibold block'>
                Catatan Pesanan
              </span>
              <p className='text-[11px] text-muted-foreground leading-relaxed mt-0.5'>
                {project.specifications?.notes || 'Tidak ada catatan tambahan.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* BAGIAN 3: PEMBAYARAN */}
        <Card className='border-border/60 bg-amber-500/5 p-5 space-y-4 text-xs'>
          <CardHeader className='p-0 border-b border-border/50 pb-2.5'>
            <CardTitle className='text-sm font-bold font-serif text-amber-950 dark:text-amber-200 flex items-center justify-between'>
              <span>Pembayaran</span>
              <Icons.creditCard className='h-4 w-4 text-amber-800' />
            </CardTitle>
          </CardHeader>

          <CardContent className='p-0 space-y-2.5'>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>Total Harga:</span>
              <span className='font-mono font-bold text-sm text-foreground'>
                {formatRupiah(total)}
              </span>
            </div>

            <div className='flex justify-between items-center text-muted-foreground'>
              <span>Target DP 50%:</span>
              <span className='font-mono font-medium'>{formatRupiah(dpAmount)}</span>
            </div>

            <div className='flex justify-between items-center text-emerald-800 dark:text-emerald-400 font-medium'>
              <span>Sudah Dibayar:</span>
              <span className='font-mono font-bold'>{formatRupiah(project.paidAmount)}</span>
            </div>

            <div className='p-2.5 rounded bg-background border border-border/60 flex justify-between items-center'>
              <span className='font-semibold text-foreground'>Sisa Tagihan:</span>
              <span
                className={`font-mono font-bold text-sm ${sisa === 0 ? 'text-emerald-700' : 'text-rose-700'}`}
              >
                {sisa === 0 ? 'LUNAS' : formatRupiah(sisa)}
              </span>
            </div>

            <Button
              onClick={() => setIsPaymentOpen(true)}
              className='w-full bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold gap-1.5 mt-2'
            >
              <Icons.add className='h-3.5 w-3.5' />
              Catat Pembayaran
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RIWAYAT PROGRES */}
      <Card className='border-border/60 p-5 space-y-3'>
        <div className='font-bold text-sm text-foreground'>Riwayat Catatan Pengerjaan Bengkel</div>
        <div className='space-y-3 divide-y divide-border/30 text-xs'>
          {project.statusHistory && project.statusHistory.length > 0 ? (
            project.statusHistory.map((h, i) => (
              <div
                key={h.id || i}
                className='pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1'
              >
                <div>
                  <span className='font-semibold text-foreground'>
                    {STATUS_CONFIG[h.status]?.label || h.status}:{' '}
                  </span>
                  <span className='text-muted-foreground'>{h.note}</span>
                </div>
                <div className='text-[10px] text-muted-foreground whitespace-nowrap font-mono'>
                  {h.date} • {h.author}
                </div>
              </div>
            ))
          ) : (
            <p className='text-xs text-muted-foreground'>Belum ada riwayat pengerjaan tercatat.</p>
          )}
        </div>
      </Card>

      {/* MODAL: PERBARUI PROGRES */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Perbarui Progres Pesanan
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Pilih status pengerjaan saat ini dan masukkan catatan untuk dipantau customer di
              portal tracking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProgressSubmit} className='space-y-3.5 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Status Baru *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-semibold'
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
              >
                <option value='waiting_dp'>Menunggu DP</option>
                <option value='production'>Produksi (Rangka Kayu)</option>
                <option value='finishing'>Finishing (Lapisan HPL/Duco)</option>
                <option value='delivery'>Siap Dikirim</option>
                <option value='completed'>Selesai (Sudah Diterima)</option>
              </select>
            </div>

            <div className='space-y-1'>
              <div className='flex justify-between items-center'>
                <label className='font-semibold text-foreground'>Persentase Progres (%) *</label>
                <span className='font-mono font-bold text-amber-800 dark:text-amber-300'>
                  {progressPercent}%
                </span>
              </div>
              <Input
                type='number'
                min={0}
                max={100}
                step={5}
                required
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className='text-xs font-mono font-semibold'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Catatan Pengerjaan Lapangan *</label>
              <Textarea
                required
                placeholder='Contoh: Rangka utama sudah selesai dan sedang masuk tahap pengerjaan pintu.'
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                className='text-xs min-h-[80px]'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Petugas / Mandor</label>
              <Input
                value={progressActor}
                onChange={(e) => setProgressActor(e.target.value)}
                className='text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsUpdateOpen(false)}
              >
                Batal
              </Button>
              <Button
                type='submit'
                size='sm'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold'
              >
                Simpan & Perbarui Tracking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: CATAT PEMBAYARAN */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>Catat Pembayaran</DialogTitle>
            <DialogDescription className='text-xs'>
              Rekam uang masuk dari pelanggan untuk pesanan ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePaymentSubmit} className='space-y-3.5 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Jenis Pembayaran *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                value={payType}
                onChange={(e) => setPayType(e.target.value as any)}
              >
                <option value='dp'>DP (Uang Muka)</option>
                <option value='cicilan'>Cicilan / Pembayaran Berikutnya</option>
                <option value='pelunasan'>Pelunasan</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nominal Pembayaran (Rp) *</label>
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
              <span className='text-[10px] text-muted-foreground block'>
                Sisa tagihan saat ini: {formatRupiah(sisa)}
              </span>
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
                <option value='Tunai'>Tunai / Cash di Bengkel</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Keterangan Tambahan</label>
              <Input
                placeholder='Contoh: Transfer atas nama Budi'
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                className='text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsPaymentOpen(false)}
              >
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
