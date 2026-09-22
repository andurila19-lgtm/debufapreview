import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import KBar from '@/components/kbar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { RoleSwitcherBanner } from '@/components/role-switcher-banner';
import { AdminGuard } from '@/components/auth/admin-guard';

export const metadata: Metadata = {
  title: 'DEBUFA WORKS — Sistem Operasional Furniture Custom',
  description: 'Sistem Operasional Workshop, Pesanan, Pelanggan, dan Tracking Furniture Custom'
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <a
          href='#main-content'
          className='bg-background ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:ring-2'
        >
          Skip to content
        </a>
        <AppSidebar />
        <SidebarInset
          id='main-content'
          tabIndex={-1}
          className='scroll-mt-16 flex flex-col min-h-screen bg-background/50'
        >
          <Header />
          <AdminGuard>
            <main className='flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6'>{children}</main>
          </AdminGuard>
          <RoleSwitcherBanner />
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
