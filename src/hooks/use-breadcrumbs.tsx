'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Debufa Admin breadcrumb mapping
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/admin': [{ title: 'Dashboard', link: '/admin' }],
  '/admin/pesanan': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pesanan', link: '/admin/pesanan' }
  ],
  '/admin/pelanggan': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pelanggan', link: '/admin/pelanggan' }
  ],
  '/admin/estimasi': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Estimasi Harga', link: '/admin/estimasi' }
  ],
  '/admin/pembayaran': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pembayaran', link: '/admin/pembayaran' }
  ],
  '/admin/tukang': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Tukang', link: '/admin/tukang' }
  ],
  '/admin/absensi': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Absensi', link: '/admin/absensi' }
  ],
  '/admin/laporan': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Laporan', link: '/admin/laporan' }
  ],
  '/admin/pengaturan': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pengaturan', link: '/admin/pengaturan' }
  ],
  // Backward compatibility
  '/admin/projects': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pesanan', link: '/admin/pesanan' }
  ],
  '/admin/customers': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pelanggan', link: '/admin/pelanggan' }
  ],
  '/admin/workers': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Tukang', link: '/admin/tukang' }
  ],
  '/admin/attendance': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Absensi', link: '/admin/absensi' }
  ],
  '/admin/payments': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pembayaran', link: '/admin/pembayaran' }
  ],
  '/admin/revenue': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Laporan', link: '/admin/laporan' }
  ],
  '/admin/settings': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Pengaturan', link: '/admin/pengaturan' }
  ],
  '/admin/estimator': [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Estimasi Harga', link: '/admin/estimasi' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Dynamic project / order detail: /admin/pesanan/[id] or /admin/projects/[id]
    if (pathname.startsWith('/admin/pesanan/')) {
      const id = pathname.replace('/admin/pesanan/', '');
      return [
        { title: 'Dashboard', link: '/admin' },
        { title: 'Pesanan', link: '/admin/pesanan' },
        { title: id, link: pathname }
      ];
    }

    if (pathname.startsWith('/admin/projects/')) {
      const id = pathname.replace('/admin/projects/', '');
      return [
        { title: 'Dashboard', link: '/admin' },
        { title: 'Pesanan', link: '/admin/pesanan' },
        { title: id, link: `/admin/pesanan/${id}` }
      ];
    }

    // Fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
