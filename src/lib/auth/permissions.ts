import { UserRole, Permission } from '@/types/auth';
import { Session } from './session';

export type AuthPermission = Permission;

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  OWNER: ['*'],
  ADMIN: [
    'orders.read',
    'orders.create',
    'orders.update',
    'customers.read',
    'customers.create',
    'customers.update',
    'estimator.use',
    'payments.read',
    'payments.create',
    'reports.read',
    'workers.read',
    'attendance.read'
  ],
  WORKER: [
    'attendance.self',
    'assigned_orders.read',
    'progress.read',
    'progress.update',
    'profile.self'
  ]
} as const;

export type PermissionSubject = Session | UserRole | { role: UserRole } | null | undefined;

/**
 * Pengecekan permission terpusat
 */
export function hasPermission(subject: PermissionSubject, permission: AuthPermission): boolean {
  if (!subject) return false;

  const role: UserRole =
    typeof subject === 'string' ? subject : 'role' in subject ? subject.role : 'ADMIN';

  // OWNER selalu memiliki akses penuh (*)
  if (role === 'OWNER') return true;

  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  if (allowedPermissions.includes('*')) return true;

  return allowedPermissions.includes(permission);
}

export const can = hasPermission;

export function isOwner(subject: PermissionSubject): boolean {
  if (!subject) return false;
  const role = typeof subject === 'string' ? subject : 'role' in subject ? subject.role : '';
  return role === 'OWNER';
}

export function isAdmin(subject: PermissionSubject): boolean {
  if (!subject) return false;
  const role = typeof subject === 'string' ? subject : 'role' in subject ? subject.role : '';
  return role === 'ADMIN';
}

export function isWorker(subject: PermissionSubject): boolean {
  if (!subject) return false;
  const role = typeof subject === 'string' ? subject : 'role' in subject ? subject.role : '';
  return role === 'WORKER';
}
