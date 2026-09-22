'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { Customer } from '@/types/debufa';
import { formatRupiah, formatDateIndo, STATUS_CONFIG } from '@/lib/formatters';
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
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function PelangganPage() {
  const { customers, projects, addCustomer } = useDebufaStore();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  // Form Tambah Pelanggan
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      toast.error('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }

    const created = addCustomer({
      name: newName,
      phone: newPhone,
      address: newAddress || 'Alamat belum diisi',
      notes: newNotes
    });

    toast.success('Pelanggan Berhasil Ditambahkan!', {
      description: `${created.name} (${created.phone}) telah tersimpan.`
    });

    setIsAddOpen(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewNotes('');
  };

  // Daftar pesanan untuk pelanggan terpilih
  const customerOrders = useMemo(() => {
    if (!selectedCust) return [];
    return projects.filter(
      (p) =>
        p.customerId === selectedCust.id ||
        p.customerPhone.replace(/\D/g, '') === selectedCust.phone.replace(/\D/g, '')
    );
  }, [selectedCust, projects]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Data Pelanggan
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Daftar Pelanggan
          </h1>
          <p className='text-sm text-muted-foreground'>
            Data kontak pelanggan dan riwayat pesanan furniture custom
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold shadow-xs gap-1.5'
        >
          <Icons.add className='h-4 w-4' />+ Tambah Pelanggan
        </Button>
      </div>

      {/* Pencarian */}
      <Card className='border-border/60 p-4'>
        <div className='relative w-full md:w-80'>
          <Icons.search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
          <Input
            placeholder='Cari nama, no WhatsApp, alamat...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9 text-xs'
          />
        </div>
      </Card>

      {/* Tabel Pelanggan */}
      <Card className='border-border/60 overflow-hidden shadow-xs'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/60 font-medium'>
              <tr>
                <th className='p-3 font-semibold'>Nama Pelanggan</th>
                <th className='p-3 font-semibold'>WhatsApp</th>
                <th className='p-3 font-semibold'>Alamat</th>
                <th className='p-3 font-semibold text-center'>Jumlah Pesanan</th>
                <th className='p-3 font-semibold'>Pesanan Terakhir</th>
                <th className='p-3 font-semibold text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-muted-foreground'>
                    Tidak ada pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const orders = projects.filter(
                    (p) =>
                      p.customerId === cust.id ||
                      p.customerPhone.replace(/\D/g, '') === cust.phone.replace(/\D/g, '')
                  );
                  const lastOrder = orders[0];
                  const waUrl = `https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Halo ${cust.name}, salam dari Debufa Works.`
                  )}`;

                  return (
                    <tr key={cust.id} className='hover:bg-muted/30 transition-colors'>
                      <td className='p-3 whitespace-nowrap font-medium text-foreground'>
                        <button
                          type='button'
                          onClick={() => setSelectedCust(cust)}
                          className='text-left font-semibold hover:text-amber-800 dark:hover:text-amber-300 hover:underline cursor-pointer'
                        >
                          {cust.name}
                        </button>
                      </td>
                      <td className='p-3 whitespace-nowrap'>
                        <a
                          href={waUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='font-mono text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1'
                        >
                          <Icons.whatsapp className='h-3 w-3' />
                          {cust.phone}
                        </a>
                      </td>
                      <td className='p-3 max-w-[240px] truncate text-muted-foreground'>
                        {cust.address}
                      </td>
                      <td className='p-3 text-center font-mono font-bold text-foreground'>
                        {orders.length}
                      </td>
                      <td className='p-3 whitespace-nowrap text-muted-foreground'>
                        {lastOrder ? (
                          <span>
                            {lastOrder.projectName} (
                            {STATUS_CONFIG[lastOrder.status]?.label || lastOrder.status})
                          </span>
                        ) : (
                          <span className='italic text-muted-foreground/60'>Belum ada pesanan</span>
                        )}
                      </td>
                      <td className='p-3 text-right whitespace-nowrap'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setSelectedCust(cust)}
                          className='h-7 text-xs border-border/70 hover:bg-amber-800/10'
                        >
                          Lihat Pesanan ({orders.length})
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

      {/* MODAL: DETAIL PESANAN PELANGGAN */}
      <Dialog open={!!selectedCust} onOpenChange={(open) => !open && setSelectedCust(null)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Riwayat Pesanan Pelanggan
            </DialogTitle>
            <DialogDescription className='text-xs'>
              {selectedCust?.name} • WhatsApp: {selectedCust?.phone}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3 py-2 text-xs'>
            <div className='p-2.5 rounded bg-muted/40 text-[11px] text-muted-foreground'>
              <strong>Alamat:</strong> {selectedCust?.address || '-'}
              <br />
              {selectedCust?.notes && (
                <span>
                  <strong>Catatan:</strong> {selectedCust.notes}
                </span>
              )}
            </div>

            <div className='space-y-2'>
              <span className='font-semibold text-foreground block'>
                Daftar Pesanan ({customerOrders.length})
              </span>
              {customerOrders.length === 0 ? (
                <p className='text-muted-foreground italic py-3 text-center'>
                  Pelanggan ini belum memiliki pesanan tercatat.
                </p>
              ) : (
                <div className='space-y-2 max-h-60 overflow-y-auto divide-y divide-border/40'>
                  {customerOrders.map((ord) => {
                    const st = STATUS_CONFIG[ord.status] || STATUS_CONFIG['waiting_dp'];
                    return (
                      <div
                        key={ord.id}
                        className='pt-2 first:pt-0 flex items-center justify-between'
                      >
                        <div>
                          <Link
                            href={`/admin/pesanan/${ord.id}`}
                            className='font-bold text-foreground hover:text-amber-800 dark:hover:text-amber-300 hover:underline'
                          >
                            {ord.projectName}
                          </Link>
                          <div className='text-[10px] text-muted-foreground font-mono'>
                            {ord.id} • {formatRupiah(ord.value)}
                          </div>
                        </div>
                        <div className='text-right'>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.badgeClass}`}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='pt-2'>
            <Button variant='outline' size='sm' onClick={() => setSelectedCust(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: TAMBAH PELANGGAN */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Tambah Pelanggan Baru
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Simpan kontak pelanggan untuk ditautkan saat membuat pesanan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className='space-y-3 text-xs py-2'>
            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nama Lengkap *</label>
              <Input
                required
                placeholder='Contoh: Ibu Rina Sasmita'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className='text-xs'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Nomor WhatsApp Aktif *</label>
              <Input
                required
                type='tel'
                placeholder='Contoh: 081289123456'
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className='text-xs font-mono'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Alamat Pemasangan / Rumah</label>
              <Input
                placeholder='Contoh: Pondok Indah, Jakarta Selatan'
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className='text-xs'
              />
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Catatan Pelanggan</label>
              <Input
                placeholder='Contoh: Klien referensi arsitek Dimas'
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
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
                Simpan Pelanggan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
