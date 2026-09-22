'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { Attendance } from '@/types/debufa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export default function TukangBerandaPage() {
  const { currentUser, projects, attendance, workers, addAttendanceRecord, updateAttendance } =
    useDebufaStore();

  const activeWorkerId = currentUser.workerId || 'TKG-01';
  const workerProfile = workers.find((w) => w.id === activeWorkerId) || workers[0];

  // Tanggal Hari Ini
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Cek absensi hari ini
  const todayAttendance = useMemo(() => {
    return attendance.find((a) => a.workerId === activeWorkerId && a.date === todayStr);
  }, [attendance, activeWorkerId, todayStr]);

  // Modal State Absensi
  const [showAbsenModal, setShowAbsenModal] = useState(false);
  const [absenType, setAbsenType] = useState<'masuk' | 'pulang'>('masuk');
  const [absenLocation, setAbsenLocation] = useState<'bengkel' | 'lapangan'>('bengkel');
  const [absenNotes, setAbsenNotes] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);

  // Pekerjaan aktif yang ditugaskan
  const assignedProjects = useMemo(() => {
    const list = projects.filter((p) => {
      if (workerProfile?.activeProject) {
        return (
          p.id === workerProfile.activeProject ||
          p.status === 'production' ||
          p.status === 'finishing'
        );
      }
      return p.status !== 'completed';
    });
    return list.slice(0, 2);
  }, [projects, workerProfile]);

  const handleOpenAbsen = (type: 'masuk' | 'pulang') => {
    setAbsenType(type);
    setShowAbsenModal(true);
    setGpsLocation(null);
  };

  const handleDetectGps = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLoading(false);
          setGpsLocation(
            `Lat: ${pos.coords.latitude.toFixed(5)}, Long: ${pos.coords.longitude.toFixed(5)}`
          );
          toast.success('Lokasi GPS berhasil dideteksi');
        },
        () => {
          setGpsLoading(false);
          setGpsLocation('Workshop Debufa Works (Pondok Pinang)');
          toast.info('Menggunakan koordinat Workshop Debufa');
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLoading(false);
      setGpsLocation('Workshop Debufa Works');
    }
  };

  const handleSubmitAbsen = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (absenType === 'masuk') {
      if (todayAttendance) {
        toast.error('Anda sudah absen masuk hari ini!');
        setShowAbsenModal(false);
        return;
      }

      const newRecord: Attendance = {
        id: `ATT-${Date.now()}`,
        workerId: activeWorkerId,
        workerName: currentUser.name,
        date: todayStr,
        checkIn: timeStr,
        status: 'hadir',
        locationType: absenLocation,
        locationName:
          absenLocation === 'bengkel' ? 'Workshop Bengkel Debufa' : 'Lokasi Proyek Klien',
        notes: absenNotes || (gpsLocation ? `GPS: ${gpsLocation}` : 'Absen masuk mandiri')
      };

      addAttendanceRecord(newRecord);
      toast.success(`Absen MASUK berhasil tercatat pukul ${timeStr} WIB!`);
    } else {
      // Absen Pulang
      if (!todayAttendance) {
        const newRecord: Attendance = {
          id: `ATT-${Date.now()}`,
          workerId: activeWorkerId,
          workerName: currentUser.name,
          date: todayStr,
          checkIn: '08:00',
          checkOut: timeStr,
          status: 'hadir',
          locationType: absenLocation,
          locationName:
            absenLocation === 'bengkel' ? 'Workshop Bengkel Debufa' : 'Lokasi Proyek Klien',
          notes: absenNotes || 'Absen pulang mandiri'
        };
        addAttendanceRecord(newRecord);
      } else {
        updateAttendance(todayAttendance.id, {
          checkOut: timeStr,
          notes: todayAttendance.notes
            ? `${todayAttendance.notes} | Pulang: ${timeStr}`
            : `Pulang: ${timeStr}`
        });
      }
      toast.success(`Absen PULANG berhasil tercatat pukul ${timeStr} WIB!`);
    }

    setShowAbsenModal(false);
    setAbsenNotes('');
  };

  return (
    <div className='space-y-5'>
      {/* Greeting Card */}
      <div className='space-y-1 bg-gradient-to-br from-neutral-900 to-neutral-850 p-4 rounded-2xl border border-neutral-800 shadow-md'>
        <div className='flex items-center justify-between'>
          <span className='text-[11px] font-semibold text-amber-500 uppercase tracking-wider'>
            Selamat Datang
          </span>
          <span className='text-[10px] text-neutral-400 font-mono'>Hari ini: {todayFormatted}</span>
        </div>
        <h1 className='text-xl font-bold text-white tracking-tight'>Halo, {currentUser.name}</h1>
        <p className='text-xs text-neutral-400'>
          {currentUser.title || 'Tukang Kayu Utama'} • Shift Lapangan & Workshop
        </p>
      </div>

      {/* ABSENSI HARI INI */}
      <section className='space-y-2.5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <Icons.attendance className='h-4 w-4 text-emerald-500' />
            <h2 className='text-xs font-bold uppercase tracking-wider text-neutral-300'>
              ABSENSI HARI INI
            </h2>
          </div>
          <span className='text-[11px] text-neutral-400 font-mono'>{todayFormatted}</span>
        </div>

        <Card className='border border-neutral-800 bg-neutral-900 shadow-lg rounded-2xl overflow-hidden'>
          <CardContent className='p-4 space-y-4'>
            {/* Keadaan 1: Belum Absen Masuk */}
            {!todayAttendance?.checkIn && (
              <div className='space-y-3 text-center'>
                <div className='p-3 bg-neutral-850 rounded-xl border border-neutral-800 text-xs text-neutral-400'>
                  Anda belum melakukan absensi masuk hari ini.
                </div>
                <Button
                  onClick={() => handleOpenAbsen('masuk')}
                  className='w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md gap-2 active:scale-98 transition-all'
                >
                  <Icons.check className='h-4 w-4' />
                  Absen Masuk
                </Button>
              </div>
            )}

            {/* Keadaan 2: Sudah Absen Masuk, Belum Pulang */}
            {todayAttendance?.checkIn && !todayAttendance?.checkOut && (
              <div className='space-y-3.5'>
                <div className='p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs'>
                      ✓
                    </div>
                    <div>
                      <span className='text-xs font-bold text-emerald-300 block'>
                        Sudah Absen Masuk
                      </span>
                      <span className='text-[10px] text-neutral-400'>
                        {todayAttendance.locationName || 'Workshop Bengkel'}
                      </span>
                    </div>
                  </div>
                  <span className='text-base font-bold font-mono text-emerald-400'>
                    {todayAttendance.checkIn} WIB
                  </span>
                </div>

                <Button
                  onClick={() => handleOpenAbsen('pulang')}
                  className='w-full h-12 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md gap-2 active:scale-98 transition-all'
                >
                  <Icons.logout className='h-4 w-4' />
                  Absen Pulang
                </Button>
              </div>
            )}

            {/* Keadaan 3: Sudah Absen Pulang (Lengkap) */}
            {todayAttendance?.checkIn && todayAttendance?.checkOut && (
              <div className='space-y-2 p-3.5 rounded-xl bg-neutral-850 border border-neutral-800 text-center'>
                <div className='inline-flex items-center gap-1 text-emerald-400 font-bold text-xs'>
                  <span>✓</span>
                  <span>Absensi Selesai</span>
                </div>
                <div className='text-sm font-mono font-bold text-neutral-200'>
                  {todayAttendance.checkIn} WIB — {todayAttendance.checkOut} WIB
                </div>
                <p className='text-[10px] text-neutral-400 pt-1'>
                  Terima kasih atas kerja keras Anda hari ini. Selamat beristirahat!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* QUICK ACCESS: PEKERJAAN SAYA */}
      <section className='space-y-2.5 pt-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <Icons.hammer className='h-4 w-4 text-amber-500' />
            <h2 className='text-xs font-bold uppercase tracking-wider text-neutral-300'>
              Pekerjaan yang Ditugaskan
            </h2>
          </div>
          <Link
            href='/tukang/pekerjaan'
            className='text-xs font-medium text-amber-400 hover:underline flex items-center gap-0.5'
          >
            Lihat Semua →
          </Link>
        </div>

        <div className='space-y-2.5'>
          {assignedProjects.map((p) => (
            <Card
              key={p.id}
              className='border border-neutral-800 bg-neutral-900 p-3.5 rounded-2xl space-y-2.5 hover:border-neutral-700 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div>
                  <span className='text-[10px] font-mono text-amber-500 font-semibold'>{p.id}</span>
                  <h3 className='text-xs font-bold text-white'>{p.projectName}</h3>
                </div>
                <Badge className='text-[9px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800/40'>
                  {p.status}
                </Badge>
              </div>

              <div className='flex items-center justify-between text-[11px] text-neutral-400'>
                <span>Lokasi: {p.customerAddress?.split(',')[0] || 'Workshop'}</span>
                <span>
                  Deadline: <strong className='text-neutral-200'>{p.deadline}</strong>
                </span>
              </div>

              <div className='space-y-1'>
                <div className='flex justify-between text-[10px]'>
                  <span className='text-neutral-400'>Progress:</span>
                  <span className='font-mono font-bold text-amber-400'>{p.progress}%</span>
                </div>
                <div className='h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-amber-600 rounded-full'
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* MODAL DIALOG ABSENSI */}
      {showAbsenModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-4'>
          <div className='w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 space-y-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200'>
            <div className='flex items-center justify-between border-b border-neutral-800 pb-3'>
              <h3 className='font-bold text-sm'>Konfirmasi Absen {absenType.toUpperCase()}</h3>
              <button
                onClick={() => setShowAbsenModal(false)}
                className='text-neutral-400 hover:text-white'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3 text-xs'>
              <div>
                <label className='block text-neutral-400 mb-1 font-medium'>Lokasi Kehadiran:</label>
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant={absenLocation === 'bengkel' ? 'default' : 'outline'}
                    onClick={() => setAbsenLocation('bengkel')}
                    className={`h-9 font-semibold ${
                      absenLocation === 'bengkel'
                        ? 'bg-amber-600 text-white'
                        : 'border-neutral-700 text-neutral-300'
                    }`}
                  >
                    🏠 Bengkel Workshop
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant={absenLocation === 'lapangan' ? 'default' : 'outline'}
                    onClick={() => setAbsenLocation('lapangan')}
                    className={`h-9 font-semibold ${
                      absenLocation === 'lapangan'
                        ? 'bg-amber-600 text-white'
                        : 'border-neutral-700 text-neutral-300'
                    }`}
                  >
                    📍 Proyek Lapangan
                  </Button>
                </div>
              </div>

              <div className='bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/60 space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-neutral-300 font-medium'>GPS Otomatis:</span>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={gpsLoading}
                    onClick={handleDetectGps}
                    className='h-6 text-[10px] border-neutral-600 text-amber-400'
                  >
                    {gpsLoading ? 'Mencari...' : '📍 Deteksi GPS'}
                  </Button>
                </div>
                {gpsLocation && (
                  <p className='text-[10px] font-mono text-emerald-400 break-all'>{gpsLocation}</p>
                )}
              </div>

              <div>
                <label className='block text-neutral-400 mb-1 font-medium'>
                  Catatan Kehadiran (Opsional):
                </label>
                <Input
                  value={absenNotes}
                  onChange={(e) => setAbsenNotes(e.target.value)}
                  placeholder='Contoh: Lembur perakitan kabinet'
                  className='bg-neutral-800 border-neutral-700 text-white text-xs'
                />
              </div>
            </div>

            <div className='pt-2 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowAbsenModal(false)}
                className='flex-1 border-neutral-700 text-neutral-300 text-xs'
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitAbsen}
                className='flex-1 font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs'
              >
                Kirim Absen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
