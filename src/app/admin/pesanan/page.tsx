'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { ProjectStatus, FurnitureType } from '@/types/debufa';
import { formatRupiah, formatDateIndo, STATUS_CONFIG, ORDERED_STATUSES } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function PesananPage() {
  const { projects, customers, addProject } = useDebufaStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State untuk Pesanan Baru
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    projectName: '',
    furnitureType: 'Kitchen Set' as FurnitureType,
    length: 3.0,
    height: 2.4,
    depth: 0.6,
    material: 'Multipleks 18mm Palm (Anti-Rayap)',
    hardware: 'Rel Tandem Soft-Closing + Engsel Slow-Motion',
    finishing: 'HPL Taco Woodgrain Premium',
    value: 18500000,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Pesanan baru workshop.'
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        p.furnitureType.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === formData.customerId) || customers[0];
    const dpTarget = Math.round(Number(formData.value) * 0.5);

    const created = addProject({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      projectName: formData.projectName || `${formData.furnitureType} - ${customer.name}`,
      furnitureType: formData.furnitureType,
      specifications: {
        furnitureType: formData.furnitureType,
        dimensions: {
          length: Number(formData.length),
          height: Number(formData.height),
          depth: Number(formData.depth),
          unit: 'meter lari'
        },
        material: formData.material,
        hardware: formData.hardware,
        finishing: formData.finishing,
        quantity: 1,
        notes: formData.notes
      },
      totalAmount: Number(formData.value),
      value: Number(formData.value),
      dpAmount: dpTarget,
      paidAmount: 0,
      status: 'waiting_dp',
      progress: 20,
      deadline: formData.deadline,
      startDate: new Date().toISOString().split('T')[0],
      lastUpdate: 'Pesanan baru dibuat, menunggu pembayaran DP'
    });

    toast.success('Pesanan Baru Berhasil Dibuat!', {
      description: `Nomor pesanan: ${created.id} untuk ${customer.name}.`
    });

    setIsAddOpen(false);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Modul Utama
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Pesanan
          </h1>
          <p className='text-sm text-muted-foreground'>Kelola seluruh pesanan furniture Debufa.</p>
        </div>

        {/* Modal Tambah Pesanan Baru */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button className='bg-amber-800 hover:bg-amber-900 text-amber-50 shadow-xs font-semibold text-xs'>
                <Icons.add className='mr-1.5 h-4 w-4' />+ Pesanan Baru
              </Button>
            }
          />
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-base font-serif font-bold'>
                Buat Pesanan Baru
              </DialogTitle>
              <DialogDescription className='text-xs'>
                Masukkan rincian pesanan furniture custom untuk memulai tracking bengkel.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateProject} className='space-y-3.5 py-2 text-xs'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Pilih Pelanggan *</label>
                  <select
                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground'
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Jenis Furniture *</label>
                  <select
                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground'
                    value={formData.furnitureType}
                    onChange={(e) =>
                      setFormData({ ...formData, furnitureType: e.target.value as FurnitureType })
                    }
                  >
                    <option value='Kitchen Set'>Kitchen Set</option>
                    <option value='Wardrobe / Lemari Pakaian'>Wardrobe / Lemari Pakaian</option>
                    <option value='Backdrop TV & Panel'>Backdrop TV & Panel</option>
                    <option value='Meja Kerja & Rak Buku'>Meja Kerja & Rak Buku</option>
                    <option value='Credenza / Buffet'>Credenza / Buffet</option>
                    <option value='Dipan & Bedside'>Dipan & Bedside</option>
                    <option value='Custom Furniture'>Custom Furniture Lainnya</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1'>
                <label className='font-semibold text-foreground'>
                  Nama Pesanan / Lokasi Ruangan
                </label>
                <Input
                  placeholder='Contoh: Kitchen Set Bawah Ruang Makan'
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className='text-xs'
                />
              </div>

              {/* Ukuran */}
              <div className='grid grid-cols-3 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Panjang (m)</label>
                  <Input
                    type='number'
                    step='0.1'
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                    className='text-xs font-mono'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Tinggi (m)</label>
                  <Input
                    type='number'
                    step='0.1'
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className='text-xs font-mono'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Kedalaman (m)</label>
                  <Input
                    type='number'
                    step='0.05'
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: Number(e.target.value) })}
                    className='text-xs font-mono'
                  />
                </div>
              </div>

              {/* Spesifikasi */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Bahan Utama</label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className='text-xs'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Finishing</label>
                  <Input
                    value={formData.finishing}
                    onChange={(e) => setFormData({ ...formData, finishing: e.target.value })}
                    className='text-xs'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Hardware / Rel</label>
                  <Input
                    value={formData.hardware}
                    onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                    className='text-xs'
                  />
                </div>
              </div>

              {/* Nilai & Deadline */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>
                    Total Harga Pesanan (Rp) *
                  </label>
                  <Input
                    type='number'
                    step='100000'
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className='text-xs font-mono font-bold'
                    required
                  />
                  <span className='text-[10px] text-muted-foreground block'>
                    Target DP 50%: {formatRupiah(Math.round(formData.value * 0.5))}
                  </span>
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-foreground'>Target Deadline Selesai *</label>
                  <Input
                    type='date'
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className='text-xs'
                    required
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <label className='font-semibold text-foreground'>Catatan Khusus</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder='Catatan fitting ruangan, warna HPL, atau permintaan pelanggan'
                  className='text-xs'
                />
              </div>

              <DialogFooter className='pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setIsAddOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  className='bg-amber-800 hover:bg-amber-900 text-amber-50'
                >
                  Simpan Pesanan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter & Pencarian */}
      <Card className='border-border/60 p-4'>
        <div className='flex flex-col md:flex-row gap-3 items-center justify-between'>
          <div className='relative w-full md:w-80'>
            <Icons.search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
            <Input
              placeholder='Cari kode pesanan, pelanggan, furniture...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-9 text-xs'
            />
          </div>

          <div className='flex flex-wrap items-center gap-2 w-full md:w-auto'>
            <span className='text-xs text-muted-foreground font-medium'>Status:</span>
            <select
              className='rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='ALL'>Semua Status ({projects.length})</option>
              {ORDERED_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIG[st].label} ({projects.filter((p) => p.status === st).length})
                </option>
              ))}
            </select>

            {(search || statusFilter !== 'ALL') && (
              <Button
                variant='ghost'
                size='sm'
                className='text-xs text-muted-foreground'
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Tabel Pesanan */}
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
                <th className='p-3 font-semibold'>Deadline</th>
                <th className='p-3 font-semibold text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className='p-8 text-center text-muted-foreground'>
                    Tidak ada data pesanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  const statusInfo = STATUS_CONFIG[proj.status] || STATUS_CONFIG['waiting_dp'];
                  const total = proj.totalAmount || proj.value;

                  return (
                    <tr
                      key={proj.id}
                      className='hover:bg-muted/30 transition-colors group cursor-pointer'
                      onClick={() => (window.location.href = `/admin/pesanan/${proj.id}`)}
                    >
                      <td className='p-3 font-mono font-semibold text-foreground whitespace-nowrap group-hover:text-amber-800 dark:group-hover:text-amber-300'>
                        {proj.id}
                      </td>
                      <td className='p-3 whitespace-nowrap'>
                        <div className='font-semibold text-foreground'>{proj.customerName}</div>
                        <div className='text-[10px] text-muted-foreground font-mono'>
                          {proj.customerPhone}
                        </div>
                      </td>
                      <td className='p-3'>
                        <div className='font-medium text-foreground max-w-[220px] truncate'>
                          {proj.projectName}
                        </div>
                        <div className='text-[10px] text-muted-foreground'>
                          {proj.furnitureType}
                        </div>
                      </td>
                      <td className='p-3 whitespace-nowrap font-mono font-semibold text-foreground'>
                        {formatRupiah(total)}
                      </td>
                      <td className='p-3 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className='p-3 whitespace-nowrap font-mono text-muted-foreground text-[11px]'>
                        {formatDateIndo(proj.deadline)}
                      </td>
                      <td
                        className='p-3 text-right whitespace-nowrap'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant='outline'
                          size='sm'
                          render={<Link href={`/admin/pesanan/${proj.id}`} />}
                          className='h-7 text-xs border-border/70 hover:bg-amber-800/10 hover:text-amber-900'
                        >
                          Detail Pesanan
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
    </div>
  );
}
