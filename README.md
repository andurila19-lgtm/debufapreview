# Debufa Works

**Sistem Operasional Furniture Custom**

Aplikasi manajemen operasional workshop furniture custom. Membantu mengelola pesanan, pelanggan, pembayaran, estimasi harga, dan tenaga kerja melalui satu platform terpadu.

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Bahasa | TypeScript |
| Styling | TailwindCSS v4 |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Build | Turbopack |
| Icons | Tabler Icons |
| Charts | Recharts |

---

## Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) v18+
- npm atau pnpm

### Instalasi

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Akun Demo

| Peran | Email | Password |
|-------|-------|----------|
| Owner | `owner@debufa.test` | `demo123` |
| Admin | `admin@debufa.test` | `demo123` |
| Tukang | `tukang@debufa.test` | `demo123` |

---

## Struktur Aplikasi

```
src/
├── app/
│   ├── admin/           # Halaman panel Admin & Owner
│   │   ├── pesanan/     # Manajemen pesanan
│   │   ├── pelanggan/   # Manajemen pelanggan
│   │   ├── estimasi/    # Kalkulator estimasi
│   │   ├── pembayaran/  # Pembayaran & cicilan
│   │   ├── laporan/     # Laporan bisnis
│   │   ├── tukang/      # Manajemen tukang
│   │   ├── absensi/     # Rekap absensi
│   │   └── pengaturan/  # Pengaturan (Owner only)
│   ├── tukang/          # Halaman khusus Tukang (mobile-first)
│   │   ├── pekerjaan/   # Daftar tugas
│   │   └── profil/      # Profil tukang
│   ├── login/           # Halaman login
│   ├── estimator/       # Estimator harga publik (alias)
│   └── tracking/        # Tracking pesanan publik
├── components/
│   ├── auth/            # Komponen autentikasi & guard
│   ├── layout/          # Layout sidebar, header, navigasi
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── auth/            # Session, users, permissions (RBAC)
│   ├── debufa-store.tsx # State management utama (Zustand)
│   ├── debufa-data.ts   # Data demo realistis
│   └── formatters.ts    # Rupiah, tanggal, status formatter
└── proxy.ts             # Middleware route protection
```

---

## Role & Hak Akses

### Owner
Akses penuh ke seluruh fitur termasuk Pengaturan, manajemen akun admin, dan tarif.

### Admin
Operasional harian: pesanan, pelanggan, estimasi, pembayaran, laporan, tukang, absensi. Tidak dapat mengakses Pengaturan.

### Tukang
Halaman mobile-first: absensi, pekerjaan, update progres, foto, catatan.

---

## Halaman Publik

| Route | Fungsi |
|-------|--------|
| `/` | Landing page Debufa Works |
| `/estimator` | Kalkulator estimasi harga furniture |
| `/tracking` | Tracking status pesanan pelanggan |

---

## Skrip Tersedia

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run typecheck    # TypeScript type check
npm run lint         # Linting dengan oxlint
npm run format       # Format kode dengan oxfmt
```

---

## Catatan Penting

- **Autentikasi** saat ini menggunakan mock session (cookie `debufa_session`). Untuk production, integrasikan dengan backend authentication (Clerk, NextAuth, dll.).
- **Data** saat ini menggunakan state management in-memory (Zustand). Untuk production, hubungkan dengan database (PostgreSQL, MySQL, dll.).
- Sistem WhatsApp button pada estimator menggunakan `wa.me` link otomatis.

---

## Dokumentasi

- [Panduan Pengguna](./PANDUAN-PENGGUNA.md) — Panduan lengkap untuk Owner, Admin, Tukang, dan Pelanggan.

---

*Debufa Works — Sistem Operasional Furniture Custom*
