import { UserRole } from '@/types/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // Hanya untuk mock preview development
  role: UserRole;
  workerId?: string;
  title: string;
  avatar?: string;
  joinedDate?: string;
  status: 'active' | 'inactive';
}

/**
 * Akun Demo Resmi DEBUFA WORKS (Preview Development)
 * 1. OWNER  : owner@debufa.test / demo123 -> /admin (Seluruh menu & pengaturan sistem)
 * 2. ADMIN  : admin@debufa.test / demo123 -> /admin (Operasional harian)
 * 3. TUKANG : tukang@debufa.test / demo123 -> /tukang (Mobile-first portal)
 */
export const MOCK_USERS: AuthUser[] = [
  {
    id: 'USR-001',
    name: 'Pak Budi Hendrawan',
    email: 'owner@debufa.test',
    phone: '0812-8900-1122',
    password: 'demo123',
    role: 'OWNER',
    title: 'Pemilik Usaha / Owner',
    avatar: 'BO',
    joinedDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 'USR-002',
    name: 'Siti Rahmawati',
    email: 'admin@debufa.test',
    phone: '0813-7766-5544',
    password: 'demo123',
    role: 'ADMIN',
    title: 'Admin Operasional Workshop',
    avatar: 'SR',
    joinedDate: '2024-06-15',
    status: 'active'
  },
  {
    id: 'WRK-001',
    name: 'Pak Slamet Riyadi',
    email: 'tukang@debufa.test',
    phone: '0812-3456-001',
    password: 'demo123',
    role: 'WORKER',
    workerId: 'TKG-01',
    title: 'Tukang Kayu Utama',
    avatar: 'SR',
    joinedDate: '2023-03-10',
    status: 'active'
  }
];

export function findUserByEmailOrPhone(identifier: string): AuthUser | undefined {
  const clean = identifier.trim().toLowerCase();
  return MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      u.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
  );
}

export function findUserById(id: string): AuthUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function findUserByRole(role: UserRole): AuthUser {
  const matched = MOCK_USERS.find((u) => u.role === role);
  return matched || MOCK_USERS[0];
}
