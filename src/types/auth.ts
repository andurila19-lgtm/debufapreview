export type UserRole = 'OWNER' | 'ADMIN' | 'WORKER';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  workerId?: string; // Tautan ke ID tukang jika role adalah WORKER
  active: boolean;
  avatar?: string;
  title?: string;
  email?: string;
}

export type Permission =
  | '*'
  // Pesanan / Orders
  | 'orders.read'
  | 'orders.create'
  | 'orders.update'
  | 'orders.delete'
  // Pelanggan / Customers
  | 'customers.read'
  | 'customers.create'
  | 'customers.update'
  | 'customers.delete'
  // Estimator
  | 'estimator.use'
  | 'estimator.config'
  // Harga / Pricing
  | 'pricing.read'
  | 'pricing.manage'
  // Pembayaran / Payments
  | 'payments.read'
  | 'payments.create'
  | 'payments.delete'
  // Laporan / Reports
  | 'reports.read'
  | 'reports.financial'
  // SDM / Workers
  | 'workers.read'
  | 'workers.manage'
  // Absensi
  | 'attendance.read'
  | 'attendance.manage'
  | 'attendance.self'
  // Pengaturan & User Management
  | 'settings.read'
  | 'settings.system'
  | 'users.manage'
  // Tukang / Assigned Jobs
  | 'assigned_orders.read'
  | 'assigned_orders.update'
  | 'progress.create'
  | 'progress.read'
  | 'progress.update'
  | 'profile.self';

/**
 * Pengguna demo resmi untuk preview sistem 3 role:
 * 1. Owner (Pak Budi) -> Akses penuh
 * 2. Admin (Siti Rahma) -> Operasional harian
 * 3. Tukang (Joko Prasetyo) -> Mobile-first portal /tukang
 */
export const DEMO_USERS: Record<UserRole, User> = {
  OWNER: {
    id: 'usr-owner-01',
    name: 'Pak Budi Hendrawan',
    phone: '0812-8900-1122',
    email: 'owner@debufaworks.com',
    role: 'OWNER',
    title: 'Owner & Pemilik Usaha',
    active: true,
    avatar: 'BO'
  },
  ADMIN: {
    id: 'usr-admin-01',
    name: 'Siti Rahmawati',
    phone: '0813-7766-5544',
    email: 'admin@debufaworks.com',
    role: 'ADMIN',
    title: 'Admin Operasional Workshop',
    active: true,
    avatar: 'SR'
  },
  WORKER: {
    id: 'usr-worker-01',
    name: 'Pak Slamet Riyadi',
    phone: '0812-3456-001',
    email: 'slamet.tukang@debufaworks.com',
    role: 'WORKER',
    workerId: 'TKG-01',
    title: 'Tukang Kayu Utama',
    active: true,
    avatar: 'SR'
  }
};
