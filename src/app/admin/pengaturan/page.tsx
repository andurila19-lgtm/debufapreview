'use client';

import React, { useState } from 'react';
import { useDebufaStore } from '@/lib/debufa-store';
import { PriceConfigItem, PriceConfiguration } from '@/types/debufa';
import { formatRupiah } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { isOwner } from '@/lib/permissions';
import Link from 'next/link';

export default function PengaturanPage() {
  const { currentUser, priceConfig, updatePriceConfigItem } = useDebufaStore();

  // Profil Usaha
  const [businessName, setBusinessName] = useState('DEBUFA WORKS');
  const [waNumber, setWaNumber] = useState('081289123456');
  const [address, setAddress] = useState('Jl. Workshop Debufa Works, Jabodetabek');

  // Inline edit state untuk tarif
  const [editingCategory, setEditingCategory] = useState<keyof PriceConfiguration | null>(null);
  const [editingItem, setEditingItem] = useState<PriceConfigItem | null>(null);

  // Admin user list state (Khusus Owner)
  const [adminUsers, setAdminUsers] = useState([
    {
      id: '1',
      name: 'Pak Budi Hendrawan',
      email: 'owner@debufaworks.com',
      role: 'OWNER',
      phone: '0812-8900-1122',
      active: true
    },
    {
      id: '2',
      name: 'Siti Rahmawati',
      email: 'admin@debufaworks.com',
      role: 'ADMIN',
      phone: '0813-7766-5544',
      active: true
    },
    {
      id: '3',
      name: 'Ahmad Operasional',
      email: 'ahmad@debufaworks.com',
      role: 'ADMIN',
      phone: '0812-9988-7766',
      active: true
    }
  ]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');

  // KEAMANAN PERMISSION: Cek apakah user adalah OWNER
  if (!isOwner(currentUser)) {
    return (
      <div className='max-w-2xl mx-auto py-12 px-4'>
        <Card className='border-destructive/40 bg-destructive/5 text-center p-8 space-y-4'>
          <div className='h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto'>
            <Icons.warning className='h-6 w-6' />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-lg font-bold text-foreground'>
              Akses Dibatasi — Khusus Pemilik Usaha (Owner)
            </h2>
            <p className='text-sm text-muted-foreground max-w-md mx-auto'>
              Menu Pengaturan sistem, tarif material/hardware/finishing, serta penambahan atau
              pengelolaan akun Admin hanya dapat dikelola oleh <strong>Owner</strong>.
            </p>
          </div>
          <div className='pt-2'>
            <Button
              render={<Link href='/admin' />}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold'
            >
              Kembali ke Dashboard Operasional
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil Usaha Berhasil Disimpan!');
  };

  const handleSavePriceEdit = () => {
    if (!editingCategory || !editingItem) return;
    updatePriceConfigItem(editingCategory, editingItem);
    toast.success(`Tarif ${editingItem.name} berhasil diperbarui.`);
    setEditingItem(null);
    setEditingCategory(null);
  };

  const handleToggleActive = (category: keyof PriceConfiguration, item: PriceConfigItem) => {
    updatePriceConfigItem(category, { ...item, active: !item.active });
    toast.success(`Status ${item.name} diperbarui.`);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      toast.error('Nama dan email admin wajib diisi');
      return;
    }
    const newAdmin = {
      id: String(Date.now()),
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      role: 'ADMIN',
      phone: newAdminPhone.trim() || '0812-0000-0000',
      active: true
    };
    setAdminUsers([...adminUsers, newAdmin]);
    toast.success(`Akun Admin ${newAdminName} berhasil ditambahkan!`);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
  };

  const handleDeleteAdmin = (id: string, role: string) => {
    if (role === 'OWNER') {
      toast.error('Akun Owner terlindungi dan tidak dapat dihapus!');
      return;
    }
    setAdminUsers(adminUsers.filter((u) => u.id !== id));
    toast.success('Akun Admin berhasil dinonaktifkan/dihapus.');
  };

  const renderConfigTable = (category: keyof PriceConfiguration, title: string) => {
    const items = priceConfig[category] || [];

    return (
      <Card className='border-border/60 p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-bold text-sm text-foreground'>{title}</h3>
            <p className='text-[11px] text-muted-foreground'>
              Tarif dasar yang digunakan pada kalkulator estimasi (Hanya dapat diubah oleh Owner)
            </p>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/50 font-medium'>
              <tr>
                <th className='p-2.5 font-semibold'>Nama Item</th>
                <th className='p-2.5 font-semibold'>Satuan</th>
                <th className='p-2.5 font-semibold text-right'>Harga Satuan</th>
                <th className='p-2.5 font-semibold text-center'>Status</th>
                <th className='p-2.5 font-semibold text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/30'>
              {items.map((item) => (
                <tr key={item.id} className='hover:bg-muted/20 transition-colors'>
                  <td className='p-2.5 font-medium text-foreground'>
                    {item.name}
                    <div className='text-[10px] text-muted-foreground'>{item.description}</div>
                  </td>
                  <td className='p-2.5 text-muted-foreground'>{item.unit}</td>
                  <td className='p-2.5 text-right font-mono font-bold text-amber-900 dark:text-amber-300'>
                    {editingItem?.id === item.id ? (
                      <Input
                        type='number'
                        step='10000'
                        value={editingItem.price}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, price: Number(e.target.value) })
                        }
                        className='w-28 h-7 text-xs font-mono ml-auto'
                      />
                    ) : (
                      formatRupiah(item.price)
                    )}
                  </td>
                  <td className='p-2.5 text-center'>
                    <button
                      type='button'
                      onClick={() => handleToggleActive(category, item)}
                      className='cursor-pointer'
                    >
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-semibold ${
                          item.active
                            ? 'border-emerald-600/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'border-muted text-muted-foreground'
                        }`}
                      >
                        {item.active ? 'Aktif' : 'Non-aktif'}
                      </Badge>
                    </button>
                  </td>
                  <td className='p-2.5 text-right'>
                    {editingItem?.id === item.id ? (
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          size='sm'
                          onClick={handleSavePriceEdit}
                          className='h-6 px-2 text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-medium'
                        >
                          Simpan
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            setEditingItem(null);
                            setEditingCategory(null);
                          }}
                          className='h-6 px-2 text-[10px]'
                        >
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setEditingCategory(category);
                          setEditingItem(item);
                        }}
                        className='h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground'
                      >
                        Edit Harga
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <div className='flex items-center justify-between border-b border-border/60 pb-4'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold font-serif text-foreground tracking-tight'>
              Pengaturan Sistem & Bisnis
            </h1>
            <Badge className='bg-amber-800 text-amber-50 text-[10px] font-bold'>KHUSUS OWNER</Badge>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            Kelola konfigurasi usaha, tarif dasar material/hardware/finishing, rumus estimator, dan
            manajemen staf Admin.
          </p>
        </div>
      </div>

      {/* 1. PROFIL USAHA */}
      <Card className='border-border/60 p-5 space-y-4'>
        <div className='border-b border-border/40 pb-3'>
          <h2 className='text-base font-bold font-serif text-foreground'>
            1. Profil Workshop & Dokumen
          </h2>
          <p className='text-xs text-muted-foreground'>
            Identitas yang tertera pada Invoice, Penawaran (Quotation), dan Surat Perjanjian.
          </p>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs'
        >
          <div className='space-y-1.5'>
            <label className='font-semibold text-foreground'>Nama Usaha / Workshop</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className='text-xs'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='font-semibold text-foreground'>Nomor WhatsApp Resmi</label>
            <Input
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className='text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5 sm:col-span-3'>
            <label className='font-semibold text-foreground'>Alamat Workshop / Bengkel</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='text-xs'
            />
          </div>

          <div className='sm:col-span-3 pt-1'>
            <Button
              type='submit'
              size='sm'
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold text-xs'
            >
              Simpan Profil Usaha
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. PENGATURAN TARIF ESTIMATOR */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-base font-bold font-serif text-foreground'>
            2. Pengaturan Tarif Estimator (Bahan, Hardware, Finishing)
          </h2>
          <p className='text-xs text-muted-foreground'>
            Ubah harga dasar bahan, hardware, finishing, dan jenis furniture. Harga ini langsung
            mempengaruhi kalkulator estimasi.
          </p>
        </div>

        <Tabs defaultValue='materials' className='w-full'>
          <TabsList className='bg-muted/60 p-1 border border-border/60'>
            <TabsTrigger value='materials' className='text-xs'>
              Harga Bahan Kayu
            </TabsTrigger>
            <TabsTrigger value='finishing' className='text-xs'>
              Harga Finishing
            </TabsTrigger>
            <TabsTrigger value='hardware' className='text-xs'>
              Harga Hardware & Rel
            </TabsTrigger>
            <TabsTrigger value='furnitureTypes' className='text-xs'>
              Harga Dasar Furniture
            </TabsTrigger>
          </TabsList>

          <TabsContent value='materials' className='pt-3'>
            {renderConfigTable('materials', 'Daftar Tarif Bahan Kayu / Plywood')}
          </TabsContent>

          <TabsContent value='finishing' className='pt-3'>
            {renderConfigTable('finishing', 'Daftar Tarif Lapisan Finishing (HPL & Duco)')}
          </TabsContent>

          <TabsContent value='hardware' className='pt-3'>
            {renderConfigTable('hardware', 'Daftar Tarif Hardware, Engsel & Rel')}
          </TabsContent>

          <TabsContent value='furnitureTypes' className='pt-3'>
            {renderConfigTable('furnitureTypes', 'Tarif Dasar Jenis Furniture (per meter)')}
          </TabsContent>
        </Tabs>
      </div>

      {/* 3. MANAJEMEN AKUN ADMIN (KHUSUS OWNER) */}
      <Card className='border-border/60 p-5 space-y-4'>
        <div className='border-b border-border/40 pb-3 flex items-center justify-between'>
          <div>
            <h2 className='text-base font-bold font-serif text-foreground'>
              3. Manajemen Akun Admin
            </h2>
            <p className='text-xs text-muted-foreground'>
              Hanya Owner yang dapat menambah, mengedit, atau menonaktifkan akun Admin operasional.
            </p>
          </div>
          <Badge
            variant='outline'
            className='text-xs border-amber-700/40 text-amber-700 dark:text-amber-300 font-semibold'
          >
            Owner Privilege
          </Badge>
        </div>

        {/* Form Tambah Admin Baru */}
        <form
          onSubmit={handleAddAdmin}
          className='bg-muted/30 p-4 rounded-xl border border-border/50 space-y-3'
        >
          <h3 className='text-xs font-bold text-foreground'>Tambah Admin Baru:</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs'>
            <div>
              <label className='block text-muted-foreground mb-1'>Nama Lengkap</label>
              <Input
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder='Nama admin'
                className='text-xs'
              />
            </div>
            <div>
              <label className='block text-muted-foreground mb-1'>Email Login</label>
              <Input
                type='email'
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder='email@debufaworks.com'
                className='text-xs'
              />
            </div>
            <div>
              <label className='block text-muted-foreground mb-1'>No. WhatsApp</label>
              <Input
                value={newAdminPhone}
                onChange={(e) => setNewAdminPhone(e.target.value)}
                placeholder='0812...'
                className='text-xs font-mono'
              />
            </div>
          </div>
          <div className='pt-1'>
            <Button
              type='submit'
              size='sm'
              className='h-8 text-xs bg-amber-800 hover:bg-amber-900 text-white font-semibold'
            >
              + Tambah Admin
            </Button>
          </div>
        </form>

        {/* Tabel Daftar Pengguna Admin & Owner */}
        <div className='overflow-x-auto pt-2'>
          <table className='w-full text-xs text-left'>
            <thead className='bg-muted/40 text-muted-foreground border-b border-border/50 font-medium'>
              <tr>
                <th className='p-2.5 font-semibold'>Nama Pengguna</th>
                <th className='p-2.5 font-semibold'>Email</th>
                <th className='p-2.5 font-semibold'>Peran (Role)</th>
                <th className='p-2.5 font-semibold'>WhatsApp</th>
                <th className='p-2.5 font-semibold text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/30'>
              {adminUsers.map((user) => (
                <tr key={user.id} className='hover:bg-muted/20 transition-colors'>
                  <td className='p-2.5 font-medium text-foreground'>{user.name}</td>
                  <td className='p-2.5 text-muted-foreground'>{user.email}</td>
                  <td className='p-2.5'>
                    <Badge
                      className={`text-[10px] font-bold ${
                        user.role === 'OWNER'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className='p-2.5 font-mono text-muted-foreground'>{user.phone}</td>
                  <td className='p-2.5 text-right'>
                    {user.role === 'OWNER' ? (
                      <span className='text-[10px] text-muted-foreground italic'>Terlindungi</span>
                    ) : (
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => handleDeleteAdmin(user.id, user.role)}
                        className='h-6 px-2 text-[10px] text-destructive hover:bg-destructive/10'
                      >
                        Hapus
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
