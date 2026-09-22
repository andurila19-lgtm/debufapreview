'use client';

import React, { useState, useMemo } from 'react';
import { useDebufaStore } from '@/lib/debufa-store';
import { Project, ProjectStatus } from '@/types/debufa';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export default function TukangPekerjaanPage() {
  const { currentUser, projects, workers, updateProjectProgress, addProjectNote } =
    useDebufaStore();

  const activeWorkerId = currentUser.workerId || 'TKG-01';
  const workerProfile = workers.find((w) => w.id === activeWorkerId) || workers[0];

  // Filter hanya pekerjaan yang ditugaskan kepada tukang yang sedang login
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
    return list.length > 0 ? list : projects.slice(0, 3);
  }, [projects, workerProfile]);

  // Modal Update Progress State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(60);
  const [progressStatus, setProgressStatus] = useState<ProjectStatus>('production');
  const [progressNote, setProgressNote] = useState('');

  // Modal Foto State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoCaption, setPhotoCaption] = useState('');

  // Modal Catatan State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [quickNote, setQuickNote] = useState('');

  const handleOpenProgress = (project: Project) => {
    setSelectedProject(project);
    setProgressPercent(project.progress || 60);
    setProgressStatus(project.status);
    setProgressNote('');
    setShowProgressModal(true);
  };

  const handleSaveProgress = () => {
    if (!selectedProject) return;

    updateProjectProgress(selectedProject.id, {
      status: progressStatus,
      progress: progressPercent,
      note: progressNote || `Progres diperbarui oleh ${currentUser.name}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      actor: currentUser.name
    });

    toast.success(`Progress ${selectedProject.projectName} diperbarui ke ${progressPercent}%!`);
    setShowProgressModal(false);
  };

  const handleOpenPhoto = (project: Project) => {
    setSelectedProject(project);
    setPhotoCaption('');
    setShowPhotoModal(true);
  };

  const handleSavePhoto = () => {
    if (!selectedProject) return;
    addProjectNote(
      selectedProject.id,
      currentUser.name,
      `📷 [Foto Progres] ${photoCaption || 'Foto pengerjaan lapangan terlampir'}`
    );
    toast.success('Foto progres berhasil dilaporkan ke workshop!');
    setShowPhotoModal(false);
    setPhotoCaption('');
  };

  const handleOpenNote = (project: Project) => {
    setSelectedProject(project);
    setQuickNote('');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (!selectedProject || !quickNote.trim()) {
      toast.error('Tulis catatan pekerjaan terlebih dahulu');
      return;
    }
    addProjectNote(selectedProject.id, currentUser.name, quickNote.trim());
    toast.success('Catatan pekerjaan berhasil ditambahkan!');
    setShowNoteModal(false);
    setQuickNote('');
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between border-b border-neutral-800/80 pb-3'>
        <div>
          <h1 className='text-lg font-bold text-white tracking-tight'>Pekerjaan Saya</h1>
          <p className='text-xs text-neutral-400'>
            Pesanan furniture custom yang ditugaskan kepada Anda
          </p>
        </div>
        <Badge
          variant='outline'
          className='text-[10px] font-mono border-amber-600/40 text-amber-400'
        >
          {assignedProjects.length} Proyek
        </Badge>
      </div>

      <div className='space-y-4'>
        {assignedProjects.map((project) => (
          <Card
            key={project.id}
            className='border border-neutral-800 bg-neutral-900 shadow-md rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors'
          >
            <div className='p-4 space-y-3.5'>
              {/* Header Pekerjaan */}
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <span className='text-[10px] font-mono text-amber-500 font-semibold uppercase'>
                    {project.id}
                  </span>
                  <h2 className='text-sm font-bold text-white leading-tight mt-0.5'>
                    {project.projectName}
                  </h2>
                </div>
                <Badge
                  className={`text-[9px] font-bold uppercase shrink-0 ${
                    project.status === 'production'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                      : project.status === 'finishing'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        : 'bg-blue-950 text-blue-300 border border-blue-800/50'
                  }`}
                >
                  {project.status === 'production'
                    ? 'Produksi'
                    : project.status === 'finishing'
                      ? 'Finishing'
                      : project.status}
                </Badge>
              </div>

              {/* Lokasi & Deadline */}
              <div className='grid grid-cols-1 gap-1.5 text-xs text-neutral-300 bg-neutral-850 p-2.5 rounded-xl border border-neutral-800'>
                <div className='flex items-center gap-2'>
                  <Icons.mapPin className='h-3.5 w-3.5 text-amber-500 shrink-0' />
                  <span className='truncate'>
                    Lokasi:{' '}
                    <strong>{project.customerAddress?.split(',')[0] || 'Workshop Debufa'}</strong>
                  </span>
                </div>
                <div className='flex items-center gap-2 text-neutral-400'>
                  <Icons.clock className='h-3.5 w-3.5 text-neutral-500 shrink-0' />
                  <span>
                    Deadline: <strong className='text-neutral-200'>{project.deadline}</strong>
                  </span>
                </div>
              </div>

              {/* Spesifikasi Dasar (Material & Finishing Tanpa Nilai Uang) */}
              {project.specifications && (
                <div className='text-[11px] text-neutral-400 bg-neutral-850/60 p-2.5 rounded-xl border border-neutral-800/60 space-y-1'>
                  <span className='text-[10px] font-bold text-neutral-500 uppercase tracking-wider block'>
                    Spesifikasi Teknis:
                  </span>
                  <div className='grid grid-cols-2 gap-2 text-neutral-300'>
                    <div>
                      <span className='text-neutral-500 block text-[10px]'>Material:</span>
                      <span className='font-medium truncate block'>
                        {project.specifications.material || 'Multipleks 18mm'}
                      </span>
                    </div>
                    <div>
                      <span className='text-neutral-500 block text-[10px]'>Finishing:</span>
                      <span className='font-medium truncate block'>
                        {project.specifications.finishing || 'HPL Taco'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Progres Bar */}
              <div className='space-y-1'>
                <div className='flex justify-between items-center text-xs'>
                  <span className='text-neutral-400 font-medium'>Progress:</span>
                  <span className='font-mono font-bold text-amber-400'>
                    {project.progress || 60}%
                  </span>
                </div>
                <div className='h-2 w-full bg-neutral-800 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-300'
                    style={{ width: `${project.progress || 60}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='pt-1 flex flex-col gap-2'>
                <Button
                  onClick={() => handleOpenProgress(project)}
                  className='w-full h-10 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-xs gap-1.5'
                >
                  <Icons.check className='h-4 w-4' />
                  Update Progress
                </Button>

                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleOpenPhoto(project)}
                    className='h-8 text-[11px] font-semibold border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-lg gap-1'
                  >
                    <Icons.camera className='h-3.5 w-3.5 text-sky-400' />
                    Tambah Foto
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleOpenNote(project)}
                    className='h-8 text-[11px] font-semibold border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-lg gap-1'
                  >
                    <Icons.pencil className='h-3.5 w-3.5 text-emerald-400' />
                    Tambah Catatan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL UPDATE PROGRESS */}
      {showProgressModal && selectedProject && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-4'>
          <div className='w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 space-y-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200'>
            <div className='flex items-center justify-between border-b border-neutral-800 pb-3'>
              <div>
                <h3 className='font-bold text-sm'>Update Progress Pekerjaan</h3>
                <p className='text-[11px] text-neutral-400 truncate'>
                  {selectedProject.projectName}
                </p>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className='text-neutral-400 hover:text-white'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3.5 text-xs'>
              <div>
                <div className='flex justify-between items-center mb-1'>
                  <label className='text-neutral-400 font-medium'>Progress Saat Ini:</label>
                  <span className='font-bold font-mono text-amber-400 text-base'>
                    {progressPercent}%
                  </span>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  step='5'
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className='w-full accent-amber-500'
                />
                <div className='flex justify-between gap-1 pt-1.5'>
                  {[25, 50, 60, 75, 90, 100].map((val) => (
                    <button
                      key={val}
                      type='button'
                      onClick={() => setProgressPercent(val)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        progressPercent === val
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-neutral-400 mb-1 font-medium'>
                  Status Pengerjaan:
                </label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value as ProjectStatus)}
                  className='w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl p-2 text-xs'
                >
                  <option value='production'>Produksi Rangka</option>
                  <option value='finishing'>Finishing (HPL/Duco)</option>
                  <option value='delivery'>Pemasangan Lapangan</option>
                  <option value='completed'>Selesai Terpasang</option>
                </select>
              </div>

              <div>
                <label className='block text-neutral-400 mb-1 font-medium'>Catatan Progres:</label>
                <Textarea
                  rows={2}
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder='Contoh: Pemotongan bahan selesai, mulai perakitan rangka...'
                  className='bg-neutral-800 border-neutral-700 text-white text-xs'
                />
              </div>
            </div>

            <div className='pt-2 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowProgressModal(false)}
                className='flex-1 border-neutral-700 text-neutral-300 text-xs'
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveProgress}
                className='flex-1 font-bold bg-amber-600 hover:bg-amber-500 text-white text-xs'
              >
                Simpan Progress
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH FOTO */}
      {showPhotoModal && selectedProject && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-4'>
          <div className='w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 space-y-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200'>
            <div className='flex items-center justify-between border-b border-neutral-800 pb-3'>
              <div>
                <h3 className='font-bold text-sm'>Upload Foto Progres</h3>
                <p className='text-[11px] text-neutral-400 truncate'>
                  {selectedProject.projectName}
                </p>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className='text-neutral-400 hover:text-white'
              >
                ✕
              </button>
            </div>

            <div className='space-y-3 text-xs'>
              <div className='border-2 border-dashed border-neutral-700 rounded-2xl p-5 text-center space-y-2 bg-neutral-850 hover:border-amber-500/50 transition-colors'>
                <Icons.camera className='h-8 w-8 mx-auto text-amber-500' />
                <span className='block text-xs font-semibold text-neutral-200'>
                  Ambil Foto Pekerjaan
                </span>
                <input
                  type='file'
                  accept='image/*'
                  id='tukang-foto-input'
                  className='hidden'
                  onChange={() => toast.success('Foto terpilih')}
                />
                <label
                  htmlFor='tukang-foto-input'
                  className='inline-block text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg cursor-pointer border border-neutral-700 font-medium'
                >
                  Pilih Kamera / Galeri
                </label>
              </div>

              <div>
                <label className='block text-neutral-400 mb-1 font-medium'>Keterangan Foto:</label>
                <Input
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder='Contoh: Fitting laci bagian bawah selesai'
                  className='bg-neutral-800 border-neutral-700 text-white text-xs'
                />
              </div>
            </div>

            <div className='pt-2 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowPhotoModal(false)}
                className='flex-1 border-neutral-700 text-neutral-300 text-xs'
              >
                Batal
              </Button>
              <Button
                onClick={handleSavePhoto}
                className='flex-1 font-bold bg-amber-600 hover:bg-amber-500 text-white text-xs'
              >
                Unggah Foto
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH CATATAN */}
      {showNoteModal && selectedProject && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-4'>
          <div className='w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 space-y-4 text-white shadow-2xl animate-in slide-in-from-bottom duration-200'>
            <div className='flex items-center justify-between border-b border-neutral-800 pb-3'>
              <div>
                <h3 className='font-bold text-sm'>Tambah Catatan Lapangan</h3>
                <p className='text-[11px] text-neutral-400 truncate'>
                  {selectedProject.projectName}
                </p>
              </div>
              <button
                onClick={() => setShowNoteModal(false)}
                className='text-neutral-400 hover:text-white'
              >
                ✕
              </button>
            </div>

            <div className='space-y-2 text-xs'>
              <label className='block text-neutral-400 font-medium'>
                Catatan untuk Workshop / Admin:
              </label>
              <Textarea
                rows={3}
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder='Tulis catatan teknis, kebutuhan hardware tambahan, atau kondisi lokasi...'
                className='bg-neutral-800 border-neutral-700 text-white text-xs'
              />
            </div>

            <div className='pt-2 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowNoteModal(false)}
                className='flex-1 border-neutral-700 text-neutral-300 text-xs'
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveNote}
                className='flex-1 font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs'
              >
                Simpan Catatan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
