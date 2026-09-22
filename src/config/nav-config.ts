import { NavGroup } from '@/types';

/**
 * Konfigurasi Navigasi Sidebar DEBUFA WORKS
 * Terintegrasi dengan sistem permission terpusat 3 Role:
 * - OWNER: Melihat seluruh menu termasuk Pengaturan sistem
 * - ADMIN: Operasional harian (Pengaturan sensitif disembunyikan)
 * - TUKANG: Menggunakan portal terpisah /tukang
 */
export const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: 'dashboard',
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: 'OPERASIONAL',
    items: [
      {
        title: 'Pesanan',
        url: '/admin/pesanan',
        icon: 'furniture',
        isActive: false,
        permission: 'orders.read',
        items: []
      },
      {
        title: 'Pelanggan',
        url: '/admin/pelanggan',
        icon: 'users',
        isActive: false,
        permission: 'customers.read',
        items: []
      },
      {
        title: 'Estimasi Harga',
        url: '/admin/estimasi',
        icon: 'calculator',
        isActive: false,
        permission: 'estimator.use',
        items: []
      }
    ]
  },
  {
    label: 'KEUANGAN',
    items: [
      {
        title: 'Pembayaran',
        url: '/admin/pembayaran',
        icon: 'creditCard',
        isActive: false,
        permission: 'payments.read',
        items: []
      },
      {
        title: 'Laporan',
        url: '/admin/laporan',
        icon: 'revenue',
        isActive: false,
        permission: 'reports.read',
        items: []
      }
    ]
  },
  {
    label: 'SDM',
    items: [
      {
        title: 'Tukang',
        url: '/admin/tukang',
        icon: 'hammer',
        isActive: false,
        permission: 'workers.read',
        items: []
      },
      {
        title: 'Absensi',
        url: '/admin/absensi',
        icon: 'attendance',
        isActive: false,
        permission: 'attendance.read',
        items: []
      }
    ]
  },
  {
    label: 'PENGATURAN',
    items: [
      {
        title: 'Pengaturan',
        url: '/admin/pengaturan',
        icon: 'settings',
        isActive: false,
        // Khusus Owner: konfigurasi harga material, hardware, finishing, estimator, manajemen admin
        permission: 'settings.system',
        items: []
      }
    ]
  }
];
