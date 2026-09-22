'use client';

import React, { useState } from 'react';
import { useDebufaStore } from '@/lib/debufa-store';
import { Worker, WorkerTransaction, WorkerTransactionStatus } from '@/types/debufa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { formatRupiah, formatDateIndo } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function TukangPage() {
  const {
    workers,
    transactions,
    addWorker,
    updateWorker,
    addTransaction,
    updateWorkerTransactionStatus
  } = useDebufaStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'daftar' | 'kasbon_bonus'>('daftar');

  // Modal State Tukang
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Tukang Kayu Utama');
  const [active, setActive] = useState(true);

  // Modal State Kasbon / Bonus
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
  const [trxWorkerId, setTrxWorkerId] = useState(workers[0]?.id || '');
  const [trxType, setTrxType] = useState<'kasbon' | 'bonus'>('kasbon');
  const [trxAmount, setTrxAmount] = useState('200000');
  const [trxDate, setTrxDate] = useState(new Date().toISOString().split('T')[0]);
  const [trxNotes, setTrxNotes] = useState('');
  const [trxStatus, setTrxStatus] = useState<WorkerTransactionStatus>('pending');

  // Filter State Kasbon & Bonus
  const [trxFilter, setTrxFilter] = useState<'all' | 'pending_kasbon' | 'settled_kasbon' | 'bonus'>(
    'all'
  );

  // Helper kalkulasi kasbon aktif per tukang
  const getPendingKasbonByWorker = (workerId: string) => {
    return transactions
      .filter((t) => t.workerId === workerId && t.type === 'kasbon' && t.status !== 'settled')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  // Ringkasan Finansial Tukang
  const totalPendingKasbon = transactions
    .filter((t) => t.type === 'kasbon' && t.status !== 'settled')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalSettledKasbon = transactions
    .filter((t) => t.type === 'kasbon' && t.status === 'settled')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalBonusGiven = transactions
    .filter((t) => t.type === 'bonus')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Handlers Tukang
  const handleOpenAddWorker = () => {
    setEditingWorker(null);
    setName('');
    setPhone('');
    setRole('Tukang Kayu Utama');
    setActive(true);
    setIsWorkerModalOpen(true);
  };

  const handleOpenEditWorker = (w: Worker) => {
    setEditingWorker(w);
    setName(w.name);
    setPhone(w.phone);
    setRole(w.role);
    setActive(w.status === 'active' || w.status === 'aktif');
    setIsWorkerModalOpen(true);
  };

  const handleToggleWorkerStatus = (w: Worker) => {
    const isCurrentlyActive = w.status === 'active' || w.status === 'aktif';
    const updated: Worker = {
      ...w,
      status: isCurrentlyActive ? 'inactive' : 'active'
    };
    updateWorker(updated);
    toast.success(`Status ${w.name} diubah menjadi ${isCurrentlyActive ? 'Non-aktif' : 'Aktif'}.`);
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (editingWorker) {
      const updated: Worker = {
        ...editingWorker,
        name,
        phone,
        role: role as any,
        status: active ? 'active' : 'inactive'
      };
      updateWorker(updated);
      toast.success('Data tukang berhasil diperbarui.');
    } else {
      const newWorker: Worker = {
        id: `TKG-${String(workers.length + 1).padStart(2, '0')}`,
        name,
        phone,
        role: role as any,
        status: active ? 'active' : 'inactive',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      addWorker(newWorker);
      toast.success('Tukang baru berhasil ditambahkan.');
    }

    setIsWorkerModalOpen(false);
  };

  // Handlers Kasbon & Bonus
  const handleOpenAddTrx = (type: 'kasbon' | 'bonus', workerId?: string) => {
    setTrxType(type);
    if (workerId) setTrxWorkerId(workerId);
    else if (workers.length > 0) setTrxWorkerId(workers[0].id);
    setTrxAmount(type === 'kasbon' ? '250000' : '150000');
    setTrxDate(new Date().toISOString().split('T')[0]);
    setTrxNotes('');
    setTrxStatus(type === 'kasbon' ? 'pending' : 'settled');
    setIsTrxModalOpen(true);
  };

  const handleTrxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find((w) => w.id === trxWorkerId);
    if (!worker) {
      toast.error('Pilih tukang terlebih dahulu.');
      return;
    }

    const numAmount = parseInt(trxAmount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Masukkan nominal valid.');
      return;
    }

    addTransaction({
      workerId: worker.id,
      workerName: worker.name,
      type: trxType,
      amount: numAmount,
      notes: trxNotes || (trxType === 'kasbon' ? 'Pinjaman uang kasbon' : 'Bonus apresiasi kerja'),
      status: trxStatus
    });

    toast.success(
      `${trxType === 'kasbon' ? 'Kasbon' : 'Bonus'} untuk ${worker.name} berhasil dicatat!`
    );
    setIsTrxModalOpen(false);
  };

  const handleSettleKasbon = (trxId: string, workerName: string, amount: number) => {
    updateWorkerTransactionStatus(trxId, 'settled');
    toast.success(
      `Kasbon ${workerName} sebesar ${formatRupiah(amount)} ditandai lunas (sudah dipotong gajian).`
    );
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (trxFilter === 'pending_kasbon') return t.type === 'kasbon' && t.status !== 'settled';
    if (trxFilter === 'settled_kasbon') return t.type === 'kasbon' && t.status === 'settled';
    if (trxFilter === 'bonus') return t.type === 'bonus';
    return true;
  });

  return (
    <div className='space-y-6'>
      {/* Header Halaman */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Tenaga Kerja Bengkel
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Tukang & Catatan Keuangan
          </h1>
          <p className='text-sm text-muted-foreground'>
            Kelola data tukang workshop, tim pasang lapangan, serta catatan kasbon & bonus
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {activeTab === 'daftar' ? (
            <Button
              onClick={handleOpenAddWorker}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold shadow-xs gap-1.5'
            >
              <Icons.add className='h-4 w-4' />+ Tambah Tukang
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenAddTrx('kasbon')}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold shadow-xs gap-1.5'
            >
              <Icons.add className='h-4 w-4' />+ Catat Kasbon / Bonus
            </Button>
          )}
        </div>
      </div>

      {/* TABS UTAMA: DAFTAR TUKANG VS KASBON & BONUS */}
      <div className='flex items-center gap-2 border-b border-border/60'>
        <button
          type='button'
          onClick={() => setActiveTab('daftar')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'daftar'
              ? 'border-amber-800 text-amber-800 dark:text-amber-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>🔨 Daftar Tukang ({workers.length})</span>
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('kasbon_bonus')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'kasbon_bonus'
              ? 'border-amber-800 text-amber-800 dark:text-amber-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>💰 Catatan Kasbon & Bonus</span>
          {totalPendingKasbon > 0 && (
            <Badge className='bg-rose-600 text-white text-[10px] px-1.5 py-0'>
              {formatRupiah(totalPendingKasbon)}
            </Badge>
          )}
        </button>
      </div>

      {/* TAB 1: DAFTAR TUKANG */}
      {activeTab === 'daftar' && (
        <div className='space-y-4'>
          <Card className='border-border/60 overflow-hidden shadow-xs'>
            <div className='overflow-x-auto'>
              <table className='w-full text-xs text-left'>
                <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
                  <tr>
                    <th className='p-3 font-semibold'>Nama Tukang</th>
                    <th className='p-3 font-semibold'>Nomor WhatsApp / HP</th>
                    <th className='p-3 font-semibold'>Peran & Keahlian</th>
                    <th className='p-3 font-semibold text-center'>Sisa Kasbon Aktif</th>
                    <th className='p-3 font-semibold text-center'>Status</th>
                    <th className='p-3 font-semibold text-right'>Aksi</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/40'>
                  {workers.map((w) => {
                    const isActive =
                      w.status === 'active' || w.status === 'aktif' || w.status === 'lapangan';
                    const pendingKasbon = getPendingKasbonByWorker(w.id);
                    const waUrl = `https://wa.me/${w.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Halo ${w.name}, info pekerjaan bengkel Debufa Works.`
                    )}`;

                    return (
                      <tr key={w.id} className='hover:bg-muted/30 transition-colors'>
                        <td className='p-3 whitespace-nowrap font-bold text-foreground'>
                          <div>{w.name}</div>
                          <span className='text-[10px] font-mono text-muted-foreground font-normal'>
                            {w.id}
                          </span>
                        </td>
                        <td className='p-3 whitespace-nowrap'>
                          <a
                            href={waUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-mono text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium'
                          >
                            <Icons.whatsapp className='h-3.5 w-3.5' />
                            {w.phone}
                          </a>
                        </td>
                        <td className='p-3 whitespace-nowrap'>
                          <Badge variant='outline' className='text-[11px] font-medium'>
                            {w.role}
                          </Badge>
                        </td>
                        <td className='p-3 whitespace-nowrap text-center'>
                          {pendingKasbon > 0 ? (
                            <button
                              type='button'
                              onClick={() => {
                                setActiveTab('kasbon_bonus');
                                setTrxFilter('pending_kasbon');
                              }}
                              className='cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 hover:underline'
                              title='Klik untuk melihat rincian kasbon'
                            >
                              <span>{formatRupiah(pendingKasbon)}</span>
                              <span className='text-[9px]'>(Belum Lunas)</span>
                            </button>
                          ) : (
                            <span className='text-muted-foreground text-[11px]'>- Nihil -</span>
                          )}
                        </td>
                        <td className='p-3 whitespace-nowrap text-center'>
                          <button
                            type='button'
                            onClick={() => handleToggleWorkerStatus(w)}
                            className='cursor-pointer'
                            title='Klik untuk mengubah status'
                          >
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                              }`}
                            >
                              {isActive ? 'Aktif' : 'Non-aktif'}
                            </span>
                          </button>
                        </td>
                        <td className='p-3 text-right whitespace-nowrap space-x-1.5'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleOpenAddTrx('kasbon', w.id)}
                            className='h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300'
                          >
                            + Kasbon
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleOpenEditWorker(w)}
                            className='h-7 text-xs border-border/70 hover:bg-amber-800/10'
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: CATATAN KASBON & BONUS */}
      {activeTab === 'kasbon_bonus' && (
        <div className='space-y-6'>
          {/* 3 KPI RINGKASAN */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <Card className='border-rose-500/30 bg-rose-500/5 shadow-xs'>
              <CardContent className='p-4 space-y-1'>
                <div className='text-xs font-semibold text-rose-700 dark:text-rose-400'>
                  Total Kasbon Belum Dipotong
                </div>
                <div className='text-2xl font-bold font-serif text-rose-950 dark:text-rose-200'>
                  {formatRupiah(totalPendingKasbon)}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  Akan dipotong otomatis saat pembagian upah mingguan
                </p>
              </CardContent>
            </Card>

            <Card className='border-border/60 bg-muted/20 shadow-xs'>
              <CardContent className='p-4 space-y-1'>
                <div className='text-xs font-semibold text-muted-foreground'>
                  Kasbon yang Sudah Lunas
                </div>
                <div className='text-2xl font-bold font-serif text-foreground'>
                  {formatRupiah(totalSettledKasbon)}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  Sudah terpotong dari pembagian upah sebelumnya
                </p>
              </CardContent>
            </Card>

            <Card className='border-emerald-500/30 bg-emerald-500/5 shadow-xs'>
              <CardContent className='p-4 space-y-1'>
                <div className='text-xs font-semibold text-emerald-700 dark:text-emerald-400'>
                  Total Bonus Apresiasi Diberikan
                </div>
                <div className='text-2xl font-bold font-serif text-emerald-950 dark:text-emerald-200'>
                  {formatRupiah(totalBonusGiven)}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  Uang kerajinan, lembur, dan kelancaran proyek
                </p>
              </CardContent>
            </Card>
          </div>

          {/* TABEL MUTASI KASBON & BONUS */}
          <Card className='border-border/60 overflow-hidden shadow-xs'>
            <div className='p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div>
                <div className='font-bold text-sm text-foreground'>
                  Riwayat Mutasi Kasbon & Bonus Tukang
                </div>
                <p className='text-xs text-muted-foreground'>
                  Pencatatan pinjaman kasbon dan bonus pengerjaan
                </p>
              </div>

              {/* Filter Buttons */}
              <div className='flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/70 text-xs overflow-x-auto'>
                <button
                  type='button'
                  onClick={() => setTrxFilter('all')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    trxFilter === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  Semua ({transactions.length})
                </button>
                <button
                  type='button'
                  onClick={() => setTrxFilter('pending_kasbon')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    trxFilter === 'pending_kasbon'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  Belum Dipotong
                </button>
                <button
                  type='button'
                  onClick={() => setTrxFilter('settled_kasbon')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    trxFilter === 'settled_kasbon'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  Sudah Lunas
                </button>
                <button
                  type='button'
                  onClick={() => setTrxFilter('bonus')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    trxFilter === 'bonus'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  Bonus
                </button>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-xs text-left'>
                <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
                  <tr>
                    <th className='p-3 font-semibold'>Tanggal</th>
                    <th className='p-3 font-semibold'>Nama Tukang</th>
                    <th className='p-3 font-semibold'>Jenis</th>
                    <th className='p-3 font-semibold text-right'>Nominal (Rp)</th>
                    <th className='p-3 font-semibold'>Catatan / Alasan</th>
                    <th className='p-3 font-semibold text-center'>Status</th>
                    <th className='p-3 font-semibold text-right'>Aksi</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/40'>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className='p-8 text-center text-muted-foreground'>
                        Belum ada data kasbon atau bonus sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => {
                      const isKasbon = t.type === 'kasbon';
                      const isPending = t.status !== 'settled';

                      return (
                        <tr key={t.id} className='hover:bg-muted/30 transition-colors'>
                          <td className='p-3 whitespace-nowrap font-mono text-muted-foreground'>
                            {formatDateIndo(t.date)}
                          </td>
                          <td className='p-3 whitespace-nowrap font-bold text-foreground'>
                            {t.workerName}
                          </td>
                          <td className='p-3 whitespace-nowrap'>
                            <Badge
                              className={`text-[10px] ${
                                isKasbon
                                  ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {isKasbon ? 'Kasbon (Pinjam)' : 'Bonus'}
                            </Badge>
                          </td>
                          <td className='p-3 whitespace-nowrap text-right font-mono font-bold text-foreground'>
                            {formatRupiah(t.amount)}
                          </td>
                          <td className='p-3 text-muted-foreground max-w-xs truncate'>
                            {t.notes || '-'}
                          </td>
                          <td className='p-3 whitespace-nowrap text-center'>
                            {isKasbon ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isPending
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                              >
                                {isPending ? 'Belum Dipotong' : 'Sudah Lunas'}
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'>
                                Selesai
                              </span>
                            )}
                          </td>
                          <td className='p-3 whitespace-nowrap text-right'>
                            {isKasbon && isPending && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleSettleKasbon(t.id, t.workerName, t.amount)}
                                className='h-7 text-xs border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400'
                              >
                                Tandai Lunas (Gajian)
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT TUKANG */}
      <Dialog open={isWorkerModalOpen} onOpenChange={setIsWorkerModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              {editingWorker ? 'Edit Data Tukang' : 'Tambah Tukang Baru'}
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Lengkapi data tukang bengkel atau aplikator lapangan Debufa Works.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWorkerSubmit} className='space-y-3.5 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nama Lengkap Tukang *</label>
              <Input
                placeholder='Contoh: Pak Slamet Riyadi'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nomor WhatsApp / HP *</label>
              <Input
                placeholder='Contoh: 08123456789'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Peran & Keahlian *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs font-semibold'
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value='Tukang Kayu Utama'>
                  Tukang Kayu Utama (Potong Multipleks & Rangka)
                </option>
                <option value='Finisher / Painter'>
                  Finisher / Painter (Lapis HPL & Cat Duco)
                </option>
                <option value='Aplikator Lapangan'>
                  Aplikator Lapangan (Instalasi & Fitting di Rumah Klien)
                </option>
                <option value='Asisten Tukang'>Asisten Tukang / Kenek (Amplas & Persiapan)</option>
              </select>
            </div>

            <div className='flex items-center gap-2 pt-1'>
              <input
                type='checkbox'
                id='worker-active'
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className='rounded border-input text-amber-800'
              />
              <label htmlFor='worker-active' className='font-medium cursor-pointer'>
                Tukang Aktif Bekerja (Tampil di Opsi Absensi)
              </label>
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsWorkerModalOpen(false)}
                className='text-xs'
              >
                Batal
              </Button>
              <Button
                type='submit'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
              >
                {editingWorker ? 'Simpan Perubahan' : 'Tambah Tukang'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: CATAT KASBON / BONUS */}
      <Dialog open={isTrxModalOpen} onOpenChange={setIsTrxModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Catat {trxType === 'kasbon' ? 'Kasbon (Pinjaman)' : 'Bonus Apresiasi'}
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Pencatatan kasbon atau bonus yang langsung terhubung ke profil tukang.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTrxSubmit} className='space-y-3.5 text-xs py-2'>
            {/* Pilihan Jenis */}
            <div className='grid grid-cols-2 gap-2'>
              <button
                type='button'
                onClick={() => {
                  setTrxType('kasbon');
                  setTrxStatus('pending');
                }}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  trxType === 'kasbon'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                    : 'border-border text-muted-foreground'
                }`}
              >
                Kasbon (Pinjaman)
              </button>
              <button
                type='button'
                onClick={() => {
                  setTrxType('bonus');
                  setTrxStatus('settled');
                }}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  trxType === 'bonus'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'border-border text-muted-foreground'
                }`}
              >
                Bonus Apresiasi
              </button>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Pilih Tukang *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs font-semibold'
                value={trxWorkerId}
                onChange={(e) => setTrxWorkerId(e.target.value)}
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.role}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nominal (Rp) *</label>
              <Input
                type='number'
                placeholder='200000'
                value={trxAmount}
                onChange={(e) => setTrxAmount(e.target.value)}
                required
                className='font-mono font-bold'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Tanggal *</label>
              <Input
                type='date'
                value={trxDate}
                onChange={(e) => setTrxDate(e.target.value)}
                required
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Catatan / Alasan *</label>
              <Input
                placeholder={
                  trxType === 'kasbon'
                    ? 'Contoh: Biaya beli obat keluarga (potong Sabtu)'
                    : 'Contoh: Bonus pasang rapi Proyek Kitchen Set BSD'
                }
                value={trxNotes}
                onChange={(e) => setTrxNotes(e.target.value)}
              />
            </div>

            {trxType === 'kasbon' && (
              <div className='space-y-1'>
                <label className='font-semibold text-foreground'>Status Kasbon</label>
                <select
                  className='w-full rounded-md border border-input bg-background p-2 text-xs font-semibold'
                  value={trxStatus}
                  onChange={(e) => setTrxStatus(e.target.value as any)}
                >
                  <option value='pending'>Belum Dipotong (Masih Berhutang)</option>
                  <option value='settled'>Sudah Dipotong (Lunas saat Gajian)</option>
                </select>
              </div>
            )}

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsTrxModalOpen(false)}
                className='text-xs'
              >
                Batal
              </Button>
              <Button
                type='submit'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
              >
                Simpan Catatan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
