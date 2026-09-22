import { UserRole } from '@/types/auth';
import { AuthUser, findUserByEmailOrPhone, findUserByRole } from './users';

export interface Session {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  workerId?: string;
  title: string;
  avatar?: string;
  loggedInAt: string;
}

const SESSION_STORAGE_KEY = 'debufa_session_v1';
const COOKIE_NAME = 'debufa_session';

export function createSessionFromUser(user: AuthUser): Session {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    workerId: user.workerId,
    title: user.title,
    avatar: user.avatar,
    loggedInAt: new Date().toISOString()
  };
}

/**
 * Mendapatkan session saat ini dari localStorage / Cookie
 */
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch (e) {
    console.error('Gagal membaca session:', e);
    return null;
  }
}

/**
 * Menyimpan session ke localStorage dan cookie
 */
export function saveSession(session: Session): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(session);
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);

    // Set cookie untuk middleware / SSR compatibility
    const maxAge = 60 * 60 * 24 * 7; // 7 hari
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    console.error('Gagal menyimpan session:', e);
  }
}

/**
 * Menghapus session saat logout
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {
    console.error('Gagal menghapus session:', e);
  }
}

/**
 * Login dengan identifier (email atau nomor HP) dan password
 */
export function authenticate(
  identifier: string,
  password: string
): { success: boolean; session?: Session; error?: string } {
  if (!identifier.trim() || !password.trim()) {
    return { success: false, error: 'Email/Nomor HP dan password wajib diisi' };
  }

  const user = findUserByEmailOrPhone(identifier);

  if (!user) {
    return {
      success: false,
      error: 'Pengguna tidak ditemukan. Periksa email atau no HP Anda.'
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      error: 'Password salah. Untuk preview gunakan "demo123".'
    };
  }

  const session = createSessionFromUser(user);
  saveSession(session);

  return { success: true, session };
}

/**
 * Login instan untuk Demo Role
 */
export function authenticateDemo(role: UserRole): Session {
  const user = findUserByRole(role);
  const session = createSessionFromUser(user);
  saveSession(session);
  return session;
}

/**
 * Tentukan redirect URL berdasarkan role pengguna
 */
export function getRedirectPathByRole(role: UserRole): string {
  switch (role) {
    case 'OWNER':
    case 'ADMIN':
      return '/admin';
    case 'WORKER':
      return '/tukang';
    default:
      return '/login';
  }
}
