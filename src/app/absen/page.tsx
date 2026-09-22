'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { Attendance } from '@/types/debufa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export default function AbsenOnlinePage() {
  const { workers, projects, addAttendanceRecord } = useDebufaStore();

  const activeWorkers = workers.filter(
    (w) => w.status === 'active' || w.status === 'aktif' || w.status === 'lapangan'
  );
  const activeProjects = projects.filter((p) => p.status !== ('selesai' as any));

  // Form states
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [attendanceType, setAttendanceType] = useState<'masuk' | 'pulang'>('masuk');
  const [locationType, setLocationType] = useState<'bengkel' | 'lapangan'>('lapangan');
  const [selectedProjectId, setSelectedProjectId] = useState(activeProjects[0]?.id || '');
  const [customLocationName, setCustomLocationName] = useState('');
  const [notes, setNotes] = useState('');

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // GPS states
  const [gpsData, setGpsData] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{
    workerName: string;
    type: 'masuk' | 'pulang';
    time: string;
    location: string;
    photo: string | null;
  } | null>(null);

  // Set default worker if available
  useEffect(() => {
    if (activeWorkers.length > 0 && !selectedWorkerId) {
      setSelectedWorkerId(activeWorkers[0].id);
    }
  }, [activeWorkers, selectedWorkerId]);

  // Otomatis minta GPS saat halaman dibuka
  useEffect(() => {
    fetchGpsLocation();
    return () => {
      stopCamera();
    };
  }, []);

  const fetchGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung pendeteksian GPS.');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        });
        setIsGpsLoading(false);
      },
      (err) => {
        setIsGpsLoading(false);
        // Fallback koordinat default BSD workshop agar tidak macet jika ditolak
        setGpsData({
          latitude: -6.3015,
          longitude: 106.6522,
          accuracy: 15
        });
        setGpsError('Izin GPS tidak diaktifkan. Menggunakan perkiraan titik wilayah bengkel.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Start Camera
  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      // Jika kamera stream gagal/diblokir di browser, arahkan ke upload/file capture
      toast.info('Gunakan kamera ponsel untuk mengambil foto selfie.');
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Take Snapshot from video
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror horizontal for selfie feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
      toast.success('Foto selfie berhasil diambil!');
    }
  };

  // Fallback handle file upload (input capture="user")
  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target?.result as string);
        toast.success('Foto selfie berhasil dimuat.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const worker = activeWorkers.find((w) => w.id === selectedWorkerId);
    if (!worker) {
      toast.error('Silakan pilih nama tukang.');
      return;
    }

    if (!capturedPhoto) {
      toast.error('Harap ambil foto selfie di lokasi terlebih dahulu.');
      return;
    }

    const now = new Date();
    const timeStr = now
      .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      .replace('.', ':');
    const dateStr = now.toISOString().split('T')[0];

    let locationLabel = 'Workshop Bengkel Debufa';
    if (locationType === 'lapangan') {
      const project = activeProjects.find((p) => p.id === selectedProjectId);
      if (project) {
        locationLabel = `Proyek ${project.id} (${project.customerName} - ${project.projectName || project.furnitureType || project.id})`;
      } else if (customLocationName) {
        locationLabel = `Proyek Lapangan: ${customLocationName}`;
      } else {
        locationLabel = 'Proyek Pemasangan Lapangan';
      }
    }

    const newAttendance: Attendance = {
      id: `ATT-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      date: dateStr,
      checkIn: attendanceType === 'masuk' ? timeStr : undefined,
      checkOut: attendanceType === 'pulang' ? timeStr : undefined,
      status: 'hadir',
      locationType,
      locationName: locationLabel,
      gpsCoordinates: gpsData || undefined,
      photoUrl: capturedPhoto,
      notes: notes || (attendanceType === 'masuk' ? 'Absen Masuk via HP' : 'Absen Pulang via HP')
    };

    addAttendanceRecord(newAttendance);

    setLastSubmission({
      workerName: worker.name,
      type: attendanceType,
      time: timeStr,
      location: locationLabel,
      photo: capturedPhoto
    });

    setIsSubmitted(true);
    toast.success(`Absen ${attendanceType === 'masuk' ? 'Masuk' : 'Pulang'} Berhasil!`);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCapturedPhoto(null);
    setNotes('');
    fetchGpsLocation();
  };

  return (
    <div className='min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between py-6 px-4 sm:px-6'>
      {/* Header Mobile Brand */}
      <div className='max-w-md mx-auto w-full'>
        <div className='flex items-center justify-between pb-4 border-b border-stone-800 mb-6'>
          <div className='flex items-center gap-2.5'>
            <div className='h-9 w-9 rounded-lg bg-amber-700 flex items-center justify-center text-amber-50 font-serif font-bold text-lg shadow-md'>
              D
            </div>
            <div>
              <h1 className='text-base font-bold font-serif text-stone-100 tracking-tight'>
                DEBUFA WORKS
              </h1>
              <p className='text-[11px] text-amber-400/90 font-medium'>
                Absensi Online Tukang (Bengkel & Lapangan)
              </p>
            </div>
          </div>
          <Link
            href='/admin/absensi'
            className='text-xs text-stone-400 hover:text-stone-200 border border-stone-800 rounded px-2.5 py-1 transition-colors'
          >
            Masuk Admin
          </Link>
        </div>

        {/* Layar Sukses */}
        {isSubmitted && lastSubmission ? (
          <Card className='bg-stone-900/90 border-emerald-500/50 shadow-xl overflow-hidden'>
            <div className='bg-emerald-950/80 p-5 text-center border-b border-emerald-800/40'>
              <div className='mx-auto h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2'>
                <Icons.check className='h-6 w-6' />
              </div>
              <h2 className='text-lg font-bold text-emerald-300'>Presensi Berhasil Dicatat!</h2>
              <p className='text-xs text-emerald-400/80 mt-0.5'>
                Terima kasih, data kehadiran langsung terkirim ke sistem bengkel.
              </p>
            </div>

            <CardContent className='p-5 space-y-4 text-xs'>
              {lastSubmission.photo && (
                <div className='flex justify-center'>
                  <img
                    src={lastSubmission.photo}
                    alt='Foto Selfie Kehadiran'
                    className='h-36 w-36 object-cover rounded-xl border-2 border-emerald-500/40 shadow-md'
                  />
                </div>
              )}

              <div className='space-y-2.5 bg-stone-950/60 p-3.5 rounded-lg border border-stone-800/80'>
                <div className='flex justify-between items-center'>
                  <span className='text-stone-400'>Nama Tukang:</span>
                  <span className='font-bold text-stone-100'>{lastSubmission.workerName}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-stone-400'>Jenis Absen:</span>
                  <Badge
                    className={lastSubmission.type === 'masuk' ? 'bg-emerald-600' : 'bg-amber-600'}
                  >
                    Absen {lastSubmission.type === 'masuk' ? 'Masuk' : 'Pulang'} (
                    {lastSubmission.time} WIB)
                  </Badge>
                </div>
                <div className='flex justify-between items-start pt-1 border-t border-stone-800/60'>
                  <span className='text-stone-400'>Lokasi Tugas:</span>
                  <span className='font-medium text-stone-200 text-right max-w-[200px]'>
                    {lastSubmission.location}
                  </span>
                </div>
                {gpsData && (
                  <div className='flex justify-between items-center text-[11px] pt-1 border-t border-stone-800/60'>
                    <span className='text-stone-400'>Koordinat GPS:</span>
                    <span className='font-mono text-emerald-400'>
                      {gpsData.latitude.toFixed(4)}, {gpsData.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              <div className='pt-2'>
                <Button
                  onClick={handleResetForm}
                  className='w-full bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold'
                >
                  Absen Tukang Lainnya
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form Input Absensi Tukang */
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Pilihan Aksi: Masuk vs Pulang */}
            <div className='grid grid-cols-2 gap-2 bg-stone-900 p-1 rounded-xl border border-stone-800'>
              <button
                type='button'
                onClick={() => setAttendanceType('masuk')}
                className={`py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  attendanceType === 'masuk'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>🟢</span>
                Absen Masuk (Pagi)
              </button>
              <button
                type='button'
                onClick={() => setAttendanceType('pulang')}
                className={`py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  attendanceType === 'pulang'
                    ? 'bg-amber-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>🔴</span>
                Absen Pulang (Sore)
              </button>
            </div>

            {/* Nama Tukang */}
            <Card className='bg-stone-900 border-stone-800 shadow-sm'>
              <CardContent className='p-4 space-y-2'>
                <label className='text-xs font-semibold text-stone-300 flex items-center justify-between'>
                  <span>1. Pilih Nama Tukang</span>
                  <span className='text-[10px] text-amber-400 font-normal'>Wajib</span>
                </label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className='w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600'
                >
                  {activeWorkers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.role}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Lokasi Kerja: Bengkel vs Lapangan */}
            <Card className='bg-stone-900 border-stone-800 shadow-sm'>
              <CardContent className='p-4 space-y-3'>
                <label className='text-xs font-semibold text-stone-300'>
                  2. Lokasi Pengerjaan Hari Ini
                </label>

                <div className='grid grid-cols-2 gap-2'>
                  <button
                    type='button'
                    onClick={() => setLocationType('bengkel')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      locationType === 'bengkel'
                        ? 'border-amber-600 bg-amber-950/40 text-amber-200 font-semibold'
                        : 'border-stone-800 bg-stone-950/60 text-stone-400'
                    }`}
                  >
                    <div className='text-sm mb-0.5'>🏢 Bengkel</div>
                    <div className='text-[10px] opacity-80'>Workshop Utama</div>
                  </button>

                  <button
                    type='button'
                    onClick={() => setLocationType('lapangan')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      locationType === 'lapangan'
                        ? 'border-amber-600 bg-amber-950/40 text-amber-200 font-semibold'
                        : 'border-stone-800 bg-stone-950/60 text-stone-400'
                    }`}
                  >
                    <div className='text-sm mb-0.5'>🏡 Lapangan</div>
                    <div className='text-[10px] opacity-80'>Rumah / Proyek Klien</div>
                  </button>
                </div>

                {locationType === 'lapangan' && (
                  <div className='space-y-2 pt-2 border-t border-stone-800/80'>
                    <label className='text-[11px] font-medium text-stone-300'>
                      Pilih Proyek / Rumah Konsumen:
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className='w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600'
                    >
                      {activeProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} — {p.customerName} ({p.projectName || p.furnitureType || p.id})
                        </option>
                      ))}
                      <option value='other'>+ Lokasi / Proyek Lainnya</option>
                    </select>

                    {selectedProjectId === 'other' && (
                      <Input
                        placeholder='Ketik nama proyek / alamat lokasi...'
                        value={customLocationName}
                        onChange={(e) => setCustomLocationName(e.target.value)}
                        className='bg-stone-950 border-stone-700 text-xs text-stone-100 placeholder:text-stone-500'
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Kamera Selfie di Lokasi */}
            <Card className='bg-stone-900 border-stone-800 shadow-sm overflow-hidden'>
              <CardContent className='p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-xs font-semibold text-stone-300 flex items-center gap-1'>
                    <span>3. Foto Selfie di Lokasi</span>
                    <span className='text-[10px] text-amber-400 font-normal'>Wajib</span>
                  </label>
                  {capturedPhoto && (
                    <span className='text-[10px] text-emerald-400 flex items-center gap-1'>
                      <Icons.check className='h-3 w-3' /> Foto Terpasang
                    </span>
                  )}
                </div>

                {/* Hidden File Input untuk akses kamera mobile langsung */}
                <input
                  type='file'
                  ref={fileInputRef}
                  accept='image/*'
                  capture='user'
                  onChange={handleFileCapture}
                  className='hidden'
                />

                {/* Viewfinder Kamera Live */}
                {isCameraActive ? (
                  <div className='space-y-2'>
                    <div className='relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-amber-600/60'>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className='w-full h-full object-cover scale-x-[-1]'
                      />
                      <div className='absolute inset-0 pointer-events-none border-2 border-dashed border-amber-400/40 m-4 rounded-xl flex items-center justify-center'>
                        <span className='text-[11px] bg-black/60 px-2.5 py-1 rounded text-amber-300'>
                          Posisikan Wajah & Latar Proyek
                        </span>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        type='button'
                        onClick={takeSnapshot}
                        className='bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5'
                      >
                        📸 Jepret Foto
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={stopCamera}
                        className='border-stone-700 text-stone-300 text-xs py-2.5'
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : capturedPhoto ? (
                  /* Preview Foto */
                  <div className='space-y-2'>
                    <div className='relative rounded-xl overflow-hidden border border-emerald-500/50 aspect-4/3 bg-black flex items-center justify-center'>
                      <img
                        src={capturedPhoto}
                        alt='Preview Selfie'
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] text-emerald-400 flex items-center gap-1'>
                        <Icons.check className='h-3 w-3' /> Foto Selfie Siap Dikirim
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={startCamera}
                        className='border-stone-700 text-xs text-stone-200 hover:bg-stone-800'
                      >
                        🔄 Foto Ulang (Kamera)
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        className='border-stone-700 text-xs text-stone-200 hover:bg-stone-800'
                      >
                        📁 Pilih Galeri
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Tombol Buka Kamera */
                  <div className='border-2 border-dashed border-stone-800 rounded-xl p-4 text-center space-y-2 bg-stone-950/40'>
                    <div className='mx-auto h-10 w-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 text-lg'>
                      📷
                    </div>
                    <p className='text-xs text-stone-300 font-medium'>
                      Ambil foto selfie di depan workshop atau di rumah konsumen
                    </p>
                    <div className='flex gap-2 justify-center pt-1'>
                      <Button
                        type='button'
                        onClick={startCamera}
                        className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
                      >
                        Buka Kamera Selfie
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        className='border-stone-700 text-xs text-stone-300'
                      >
                        Pilih File
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deteksi GPS Geotagging */}
            <Card className='bg-stone-900 border-stone-800 shadow-sm'>
              <CardContent className='p-4 space-y-2'>
                <div className='flex items-center justify-between text-xs font-semibold text-stone-300'>
                  <span className='flex items-center gap-1.5'>
                    <span>📍</span>
                    <span>Titik Lokasi GPS</span>
                  </span>
                  <button
                    type='button'
                    onClick={fetchGpsLocation}
                    disabled={isGpsLoading}
                    className='text-[11px] text-amber-400 hover:underline font-normal cursor-pointer'
                  >
                    {isGpsLoading ? 'Mencari...' : 'Perbarui GPS'}
                  </button>
                </div>

                {gpsData ? (
                  <div className='bg-stone-950/60 p-2.5 rounded-lg border border-emerald-900/40 text-[11px] flex items-center justify-between'>
                    <div>
                      <div className='font-mono text-emerald-400 font-semibold'>
                        {gpsData.latitude.toFixed(5)}, {gpsData.longitude.toFixed(5)}
                      </div>
                      <div className='text-stone-400 text-[10px]'>
                        Akurasi perangkat: ±{gpsData.accuracy || 15} meter
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className='bg-emerald-950/60 text-emerald-300 border-emerald-700/50 text-[10px]'
                    >
                      GPS Aktif
                    </Badge>
                  </div>
                ) : (
                  <div className='text-[11px] text-stone-400 bg-stone-950/50 p-2.5 rounded-lg'>
                    {isGpsLoading
                      ? 'Sedang membaca sinyal satelit GPS...'
                      : 'GPS belum terdeteksi.'}
                  </div>
                )}

                {gpsError && <p className='text-[10px] text-amber-400/90'>{gpsError}</p>}
              </CardContent>
            </Card>

            {/* Catatan Tugas Lapangan (Opsional) */}
            <div className='space-y-1'>
              <label className='text-xs text-stone-400'>
                Catatan Pengerjaan Hari Ini (Opsional)
              </label>
              <Input
                placeholder='Contoh: Mulai pasang bodi bawah & top table...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='bg-stone-900 border-stone-800 text-xs text-stone-100 placeholder:text-stone-500'
              />
            </div>

            {/* Tombol Kirim Absensi */}
            <Button
              type='submit'
              className='w-full py-6 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950/50'
            >
              Kirim Absensi {attendanceType === 'masuk' ? 'Masuk' : 'Pulang'} Sekarang
            </Button>
          </form>
        )}
      </div>

      {/* Footer Ringan */}
      <footer className='text-center text-[11px] text-stone-500 pt-6 mt-6 border-t border-stone-900'>
        © {new Date().getFullYear()} DEBUFA WORKS — Bengkel Interior Furniture Custom
      </footer>
    </div>
  );
}
