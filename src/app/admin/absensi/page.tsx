'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { Attendance } from '@/types/debufa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { formatDateIndo } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AbsensiPage() {
  const { workers, attendance, addAttendanceRecord } = useDebufaStore();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterLocation, setFilterLocation] = useState<'all' | 'bengkel' | 'lapangan'>('all');

  // Modal Absen Cepat Manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenAction, setAbsenAction] = useState<'masuk' | 'pulang'>('masuk');
  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || '');
  const [customTime, setCustomTime] = useState(
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  );

  // Modal Preview Foto & GPS
  const [previewAttendance, setPreviewAttendance] = useState<Attendance | null>(null);

  const activeWorkers = workers.filter(
    (w) => w.status === 'active' || w.status === 'aktif' || w.status === 'lapangan'
  );

  // Filter attendance by date and location
  const filteredAttendance = attendance
    .filter((a) => a.date === selectedDate)
    .filter((a) => {
      if (filterLocation === 'all') return true;
      return a.locationType === filterLocation;
    });

  const handleOpenAbsen = (action: 'masuk' | 'pulang') => {
    setAbsenAction(action);
    const now = new Date()
      .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      .replace('.', ':');
    setCustomTime(now);
    setIsModalOpen(true);
  };

  const handleAbsenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find((w) => w.id === selectedWorkerId);
    if (!worker) {
      toast.error('Pilih tukang terlebih dahulu.');
      return;
    }

    const existingIndex = attendance.findIndex(
      (a) => a.workerId === worker.id && a.date === selectedDate
    );

    if (absenAction === 'masuk') {
      if (existingIndex >= 0 && attendance[existingIndex].checkIn) {
        toast.error(
          `${worker.name} sudah tercatat absen masuk hari ini (${attendance[existingIndex].checkIn}).`
        );
        return;
      }

      const newRecord: Attendance = {
        id: `ATT-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        date: selectedDate,
        checkIn: customTime,
        status: 'hadir',
        locationType: 'bengkel',
        locationName: 'Workshop Bengkel Debufa (Manual Admin)'
      };
      addAttendanceRecord(newRecord);
      toast.success(`Absen Masuk Tercatat!`, {
        description: `${worker.name} masuk pukul ${customTime} WIB.`
      });
    } else {
      if (existingIndex >= 0) {
        const updated: Attendance = {
          ...attendance[existingIndex],
          checkOut: customTime
        };
        addAttendanceRecord(updated);
        toast.success(`Absen Pulang Tercatat!`, {
          description: `${worker.name} pulang pukul ${customTime} WIB.`
        });
      } else {
        const newRecord: Attendance = {
          id: `ATT-${Date.now()}`,
          workerId: worker.id,
          workerName: worker.name,
          date: selectedDate,
          checkOut: customTime,
          status: 'hadir',
          locationType: 'bengkel',
          locationName: 'Workshop Bengkel Debufa (Manual Admin)'
        };
        addAttendanceRecord(newRecord);
        toast.success(`Absen Pulang Tercatat!`);
      }
    }

    setIsModalOpen(false);
  };

  const copyOnlineLink = () => {
    const url = `${window.location.origin}/absen`;
    navigator.clipboard.writeText(url);
    toast.success('Tautan absensi online berhasil disalin!', {
      description: 'Kirimkan tautan ini ke grup WhatsApp tukang bengkel.'
    });
  };

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Halo rekan tukang DEBUFA WORKS. Untuk absensi kehadiran hari ini (terutama yang langsung di lapangan), silakan klik tautan: ${
      typeof window !== 'undefined' ? window.location.origin : ''
    }/absen`
  )}`;

  return (
    <div className='space-y-6'>
      {/* Header Halaman */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Kehadiran & Lokasi Tugas
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Absensi Tukang
          </h1>
          <p className='text-sm text-muted-foreground'>
            Pantau kehadiran harian tukang di workshop bengkel dan lokasi proyek pemasangan
          </p>
        </div>

        {/* Input Tanggal */}
        <div className='flex items-center gap-2'>
          <Input
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='w-40 text-xs font-mono bg-card border-border/70 shadow-xs'
          />
        </div>
      </div>

      {/* BANNER TAUTAN ABSENSI ONLINE (Kamera + GPS) */}
      <Card className='border-amber-800/30 bg-gradient-to-r from-amber-500/10 via-amber-700/5 to-transparent shadow-xs'>
        <CardContent className='p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <Badge className='bg-amber-800 text-amber-50 text-[10px] font-bold'>
                📱 Fitur Absen Online Lapangan
              </Badge>
              <span className='text-xs font-semibold text-foreground'>
                Presensi Mandiri via HP (Kamera Selfie + GPS)
              </span>
            </div>
            <p className='text-xs text-muted-foreground max-w-xl'>
              Tukang yang langsung berangkat ke rumah konsumen tidak perlu ke bengkel. Cukup buka
              link di HP, jepret foto selfie, dan titik lokasi GPS langsung terekam di sistem.
            </p>
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto shrink-0'>
            <Button
              variant='outline'
              size='sm'
              onClick={copyOnlineLink}
              className='text-xs border-amber-800/40 hover:bg-amber-800/10 flex-1 sm:flex-initial gap-1.5'
            >
              <Icons.copy className='h-3.5 w-3.5' />
              Salin Link HP
            </Button>
            <a
              href={waShareUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 text-xs font-semibold shadow-xs transition-colors'
            >
              <Icons.whatsapp className='h-3.5 w-3.5' />
              Kirim ke WA Tukang
            </a>
            <Link
              href='/absen'
              target='_blank'
              className='inline-flex items-center gap-1 rounded-md border border-border/80 px-2.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              title='Buka Tampilan Tukang di Tab Baru'
            >
              <Icons.externalLink className='h-3.5 w-3.5' />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* DUA TOMBOL AKSI CEPAT MANUAL (OFFICE/BENGKEL) */}
      <div className='grid grid-cols-2 gap-4'>
        <Card
          onClick={() => handleOpenAbsen('masuk')}
          className='border-emerald-600/40 bg-emerald-500/10 hover:bg-emerald-500/15 cursor-pointer transition-all p-4 text-center space-y-1 shadow-xs'
        >
          <div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white'>
            <Icons.login className='h-5 w-5' />
          </div>
          <div className='font-bold text-sm text-emerald-950 dark:text-emerald-200'>
            + Catat Masuk Manual
          </div>
          <p className='text-[11px] text-emerald-800/80 dark:text-emerald-300'>
            Input absen masuk oleh admin workshop
          </p>
        </Card>

        <Card
          onClick={() => handleOpenAbsen('pulang')}
          className='border-amber-700/40 bg-amber-500/10 hover:bg-amber-500/15 cursor-pointer transition-all p-4 text-center space-y-1 shadow-xs'
        >
          <div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-800 text-white'>
            <Icons.logout className='h-5 w-5' />
          </div>
          <div className='font-bold text-sm text-amber-950 dark:text-amber-200'>
            + Catat Pulang Manual
          </div>
          <p className='text-[11px] text-amber-800/80 dark:text-amber-300'>
            Input absen selesai kerja oleh admin workshop
          </p>
        </Card>
      </div>

      {/* DAFTAR ABSENSI HARI INI DENGAN FOTO & LOKASI */}
      <Card className='border-border/60 overflow-hidden shadow-xs'>
        <div className='p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div>
            <div className='font-bold text-sm text-foreground'>
              Catatan Kehadiran ({formatDateIndo(selectedDate)})
            </div>
            <p className='text-xs text-muted-foreground'>
              Memverifikasi foto kehadiran dan lokasi pengerjaan tukang
            </p>
          </div>

          {/* Filter Lokasi */}
          <div className='flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/70 text-xs'>
            <button
              type='button'
              onClick={() => setFilterLocation('all')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterLocation === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground'
              }`}
            >
              Semua ({attendance.filter((a) => a.date === selectedDate).length})
            </button>
            <button
              type='button'
              onClick={() => setFilterLocation('bengkel')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterLocation === 'bengkel'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground'
              }`}
            >
              🏢 Bengkel
            </button>
            <button
              type='button'
              onClick={() => setFilterLocation('lapangan')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filterLocation === 'lapangan'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground'
              }`}
            >
              🏡 Lapangan
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
              <tr>
                <th className='p-3 font-semibold'>Foto</th>
                <th className='p-3 font-semibold'>Nama Tukang</th>
                <th className='p-3 font-semibold'>Lokasi & Tugas</th>
                <th className='p-3 font-semibold text-center'>Jam Masuk</th>
                <th className='p-3 font-semibold text-center'>Jam Pulang</th>
                <th className='p-3 font-semibold text-center'>Titik GPS</th>
                <th className='p-3 font-semibold text-right'>Detail</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={7} className='p-8 text-center text-muted-foreground'>
                    Belum ada data absensi untuk tanggal {formatDateIndo(selectedDate)}.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((att) => {
                  const isLapangan = att.locationType === 'lapangan';
                  const hasGps = Boolean(att.gpsCoordinates?.latitude);
                  const gmapsUrl = hasGps
                    ? `https://www.google.com/maps?q=${att.gpsCoordinates?.latitude},${att.gpsCoordinates?.longitude}`
                    : null;

                  return (
                    <tr key={att.id} className='hover:bg-muted/30 transition-colors'>
                      {/* Foto Thumbnail */}
                      <td className='p-3 whitespace-nowrap'>
                        {att.photoUrl ? (
                          <button
                            type='button'
                            onClick={() => setPreviewAttendance(att)}
                            className='relative h-10 w-10 rounded-lg overflow-hidden border border-border/80 shadow-xs hover:scale-105 transition-transform cursor-pointer'
                          >
                            <img
                              src={att.photoUrl}
                              alt={att.workerName}
                              className='h-full w-full object-cover'
                            />
                          </button>
                        ) : (
                          <div className='h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-mono'>
                            No Foto
                          </div>
                        )}
                      </td>

                      {/* Nama Tukang */}
                      <td className='p-3 whitespace-nowrap font-bold text-foreground'>
                        <div>{att.workerName}</div>
                        <span className='text-[10px] font-normal text-muted-foreground'>
                          {att.notes || 'Hadir'}
                        </span>
                      </td>

                      {/* Lokasi & Tugas */}
                      <td className='p-3 whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <Badge
                            variant='outline'
                            className={`text-[10px] ${
                              isLapangan
                                ? 'bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-500/40'
                                : 'bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-500/40'
                            }`}
                          >
                            {isLapangan ? '🏡 Lapangan' : '🏢 Workshop Bengkel'}
                          </Badge>
                        </div>
                        <div className='text-[11px] text-muted-foreground mt-0.5 truncate max-w-[220px]'>
                          {att.locationName || 'Bengkel Debufa Works'}
                        </div>
                      </td>

                      {/* Jam Masuk */}
                      <td className='p-3 whitespace-nowrap text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400'>
                        {att.checkIn || '-'}
                      </td>

                      {/* Jam Pulang */}
                      <td className='p-3 whitespace-nowrap text-center font-mono font-semibold text-amber-800 dark:text-amber-400'>
                        {att.checkOut || '-'}
                      </td>

                      {/* GPS & Maps */}
                      <td className='p-3 whitespace-nowrap text-center'>
                        {hasGps && gmapsUrl ? (
                          <a
                            href={gmapsUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-mono'
                          >
                            <Icons.mapPin className='h-3 w-3' />
                            Lihat Peta
                          </a>
                        ) : (
                          <span className='text-muted-foreground text-[11px]'>-</span>
                        )}
                      </td>

                      {/* Detail Tombol */}
                      <td className='p-3 text-right whitespace-nowrap'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setPreviewAttendance(att)}
                          className='h-7 text-xs hover:bg-muted'
                        >
                          Lihat Bukti
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: PREVIEW FOTO BUKTI & LOKASI GPS */}
      <Dialog
        open={Boolean(previewAttendance)}
        onOpenChange={(open) => !open && setPreviewAttendance(null)}
      >
        {previewAttendance && (
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-base font-serif font-bold flex items-center justify-between'>
                <span>Bukti Presensi: {previewAttendance.workerName}</span>
              </DialogTitle>
              <DialogDescription className='text-xs'>
                Dokumentasi foto dan titik koordinat satelit saat tukang melakukan absensi.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-3.5 py-2 text-xs'>
              {previewAttendance.photoUrl ? (
                <div className='relative rounded-xl overflow-hidden border border-border/80 aspect-4/3 bg-black flex items-center justify-center'>
                  <img
                    src={previewAttendance.photoUrl}
                    alt='Bukti Selfie'
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute top-2 left-2 bg-black/70 px-2.5 py-1 rounded text-[11px] text-amber-300'>
                    {previewAttendance.date} •{' '}
                    {previewAttendance.checkIn || previewAttendance.checkOut} WIB
                  </div>
                </div>
              ) : (
                <div className='p-8 text-center bg-muted/40 rounded-xl text-muted-foreground'>
                  Tidak ada foto selfie terlampir (absen dicatat manual oleh admin).
                </div>
              )}

              <div className='bg-muted/40 p-3 rounded-lg space-y-2 border border-border/60'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Tipe Tugas:</span>
                  <span className='font-semibold text-foreground'>
                    {previewAttendance.locationType === 'lapangan'
                      ? '🏡 Proyek Lapangan'
                      : '🏢 Workshop Bengkel'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Lokasi Detail:</span>
                  <span className='font-medium text-foreground text-right max-w-[200px]'>
                    {previewAttendance.locationName || 'Workshop Debufa Works'}
                  </span>
                </div>
                {previewAttendance.gpsCoordinates && (
                  <div className='flex justify-between items-center pt-1 border-t border-border/60'>
                    <span className='text-muted-foreground'>Koordinat GPS:</span>
                    <a
                      href={`https://www.google.com/maps?q=${previewAttendance.gpsCoordinates.latitude},${previewAttendance.gpsCoordinates.longitude}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-emerald-700 dark:text-emerald-400 font-mono hover:underline inline-flex items-center gap-1 font-semibold'
                    >
                      <Icons.mapPin className='h-3 w-3' />
                      {previewAttendance.gpsCoordinates.latitude.toFixed(4)},{' '}
                      {previewAttendance.gpsCoordinates.longitude.toFixed(4)}
                    </a>
                  </div>
                )}
                {previewAttendance.notes && (
                  <div className='pt-1 border-t border-border/60 text-muted-foreground'>
                    <span className='font-semibold text-foreground'>Catatan: </span>
                    {previewAttendance.notes}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setPreviewAttendance(null)}
                className='text-xs w-full sm:w-auto'
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* MODAL: INPUT ABSEN MANUAL ADMIN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Catat {absenAction === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'} Manual
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Pilih nama tukang dan konfirmasi waktu kehadiran.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAbsenSubmit} className='space-y-3.5 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Pilih Tukang *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-semibold'
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
              >
                {activeWorkers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.role})
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Waktu Kehadiran (WIB) *</label>
              <Input
                type='text'
                placeholder='08:00'
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className='font-mono font-bold text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
                className='text-xs'
              >
                Batal
              </Button>
              <Button
                type='submit'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
              >
                Simpan Kehadiran
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
