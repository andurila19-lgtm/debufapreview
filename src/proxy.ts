import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati static assets, api, favicon, public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public customer routes - TIDAK MEMERLUKAN LOGIN
  if (
    pathname === '/' ||
    pathname.startsWith('/estimator') ||
    pathname.startsWith('/estimasi') ||
    pathname.startsWith('/tracking')
  ) {
    return NextResponse.next();
  }

  // Ambil session cookie
  const sessionCookie = request.cookies.get('debufa_session')?.value;
  let session: { role?: string; userId?: string } | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      session = null;
    }
  }

  // Jika membuka halaman /login:
  if (pathname === '/login') {
    if (session?.role) {
      const target = session.role === 'WORKER' ? '/tukang' : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Proteksi rute /admin/* (Khusus OWNER dan ADMIN)
  if (pathname.startsWith('/admin')) {
    if (!session?.role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role === 'WORKER') {
      // Worker tidak boleh masuk area admin
      return NextResponse.redirect(new URL('/tukang', request.url));
    }

    return NextResponse.next();
  }

  // Proteksi rute /tukang/* (Khusus WORKER)
  if (pathname.startsWith('/tukang')) {
    if (!session?.role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role === 'ADMIN') {
      // Admin tidak diarahkan ke interface tukang
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
