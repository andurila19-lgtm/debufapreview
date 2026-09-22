'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { formatRupiah } from '@/lib/formatters';

export default function HomePage() {
  const products = [
    {
      title: 'Kitchen Set Modern',
      description:
        'Kabinet atas & bawah, rak piring tarik, laci sendok bumbu, dan rel slow-motion anti-berisik.',
      startPrice: 2200000,
      unit: 'meter lari',
      badge: 'Paling Diminati'
    },
    {
      title: 'Lemari Pakaian (Wardrobe)',
      description:
        'Pintu sliding atau swing full plafon, sekat pakaian gantung, laci pakaian dalam, dan cermin full body.',
      startPrice: 2100000,
      unit: 'meter lari',
      badge: 'Custom Ruangan'
    },
    {
      title: 'Meja Kerja & Rak Buku',
      description:
        'Meja kerja kokoh ergonomis, stop kontak tanam tersembunyi, kabinet arsip, dan ambalan buku melayang.',
      startPrice: 1750000,
      unit: 'meter lari',
      badge: 'Home Office'
    },
    {
      title: 'TV Cabinet & Backdrop',
      description:
        'Panel dinding kisi-kisi modern, hidden cable management, rak audio visual, dan aksen LED warm white.',
      startPrice: 1800000,
      unit: 'm²',
      badge: 'Ruang Keluarga'
    },
    {
      title: 'Interior Cafe & Komersial',
      description:
        'Bar counter display, rak display produk, partisi pembatas ruangan, dan meja kasir profesional.',
      startPrice: 2400000,
      unit: 'meter lari',
      badge: 'Usaha & Retail'
    }
  ];

  const steps = [
    {
      no: '1',
      title: 'Konsultasi',
      desc: 'Diskusikan ide, kebutuhan ruang, model referensi, dan perkiraan budget furniture Anda dengan tim Debufa Works.'
    },
    {
      no: '2',
      title: 'Pengukuran & Desain',
      desc: 'Tim kami melakukan survey pengukuran presisi ke lokasi dan menyusun sketsa 3D beserta rincian penawaran transparan.'
    },
    {
      no: '3',
      title: 'Produksi',
      desc: 'Pengerjaan rangka presisi di bengkel sendiri menggunakan multipleks pilihan oleh tukang kayu berpengalaman.'
    },
    {
      no: '4',
      title: 'Finishing & Pengiriman',
      desc: 'Pelapisan HPL/Duco dengan quality control ketat, dilanjutkan pengiriman dan pemasangan rapi di lokasi Anda.'
    }
  ];

  return (
    <div className='min-h-screen bg-stone-50/50 dark:bg-background text-foreground flex flex-col'>
      {/* NAVBAR */}
      <header className='border-b border-border/60 bg-background/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6'>
        <div className='max-w-6xl mx-auto h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-amber-800 text-amber-50 font-bold'>
              <Icons.hammer className='h-4 w-4' />
            </div>
            <div>
              <span className='font-serif font-bold text-base tracking-tight block'>
                DEBUFA WORKS
              </span>
              <span className='text-[10px] text-muted-foreground block -mt-0.5'>
                Sistem Operasional Furniture Custom
              </span>
            </div>
          </div>

          <nav className='hidden md:flex items-center gap-6 text-xs font-medium'>
            <a
              href='#beranda'
              className='text-foreground hover:text-amber-800 dark:hover:text-amber-300 transition-colors'
            >
              Beranda
            </a>
            <a
              href='#produk'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Produk
            </a>
            <Link
              href='/estimator'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Estimasi Harga
            </Link>
            <Link
              href='/tracking'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Cek Pesanan
            </Link>
            <a
              href='#tentang'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Tentang
            </a>
            <a
              href='#kontak'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Kontak
            </a>
          </nav>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              render={<Link href='/tracking' />}
              className='text-xs hidden sm:inline-flex'
            >
              <Icons.truck className='mr-1.5 h-3.5 w-3.5' />
              Cek Pesanan
            </Button>
            <Button
              size='sm'
              render={<Link href='/admin' />}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold'
            >
              Demo Admin
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id='beranda'
        className='py-16 md:py-24 px-4 sm:px-6 border-b border-border/50 bg-gradient-to-b from-amber-500/5 to-transparent'
      >
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <Badge className='bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold px-3 py-1'>
            Workshop Interior & Custom Furniture
          </Badge>

          <h1 className='text-3xl sm:text-5xl font-bold font-serif tracking-tight text-foreground leading-tight'>
            Custom Furniture, Dibuat Sesuai Ruang dan Kebutuhan.
          </h1>

          <p className='text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            Solusi furniture custom untuk rumah, usaha, dan ruang komersial. Dikerjakan langsung
            oleh pengrajin berpengalaman dengan material pilihan dan transparansi penuh.
          </p>

          <div className='pt-2 flex flex-col sm:flex-row items-center justify-center gap-3'>
            <Button
              size='lg'
              render={<Link href='/estimator' />}
              className='w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold px-6 shadow-sm gap-2'
            >
              <Icons.calculator className='h-4 w-4' />
              Hitung Estimasi Harga
            </Button>

            <Button
              size='lg'
              variant='outline'
              render={<Link href='/tracking' />}
              className='w-full sm:w-auto border-border/80 text-foreground hover:bg-muted/60 px-6 gap-2'
            >
              <Icons.truck className='h-4 w-4 text-amber-800 dark:text-amber-400' />
              Cek Pesanan
            </Button>

            <Button
              size='lg'
              variant='ghost'
              render={
                <a
                  href='https://wa.me/6281289123456?text=Halo%20Debufa%20Works,%20saya%20ingin%20konsultasi%20pembuatan%20furniture%20custom.'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              }
              className='w-full sm:w-auto border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-5 gap-2'
            >
              <Icons.whatsapp className='h-4 w-4' />
              Tanya via WhatsApp
            </Button>
          </div>

          {/* 3 Keunggulan */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-left'>
            <Card className='border-border/60 bg-card/60 p-4 space-y-1.5'>
              <div className='font-bold text-sm text-foreground flex items-center gap-2'>
                <Icons.check className='h-4 w-4 text-amber-800 dark:text-amber-400' />
                Bahan Berkualitas
              </div>
              <p className='text-xs text-muted-foreground'>
                Menggunakan multipleks palm grade A anti-rayap, bukan serbuk kayu atau partikel
                board mudah lapuk.
              </p>
            </Card>

            <Card className='border-border/60 bg-card/60 p-4 space-y-1.5'>
              <div className='font-bold text-sm text-foreground flex items-center gap-2'>
                <Icons.tools className='h-4 w-4 text-amber-800 dark:text-amber-400' />
                Hardware Slow-Motion
              </div>
              <p className='text-xs text-muted-foreground'>
                Engsel dan rel laci sudah menggunakan sistem soft-closing untuk kenyamanan dan
                keawetan jangka panjang.
              </p>
            </Card>

            <Card className='border-border/60 bg-card/60 p-4 space-y-1.5'>
              <div className='font-bold text-sm text-foreground flex items-center gap-2'>
                <Icons.truck className='h-4 w-4 text-amber-800 dark:text-amber-400' />
                Bisa Dipantau Online
              </div>
              <p className='text-xs text-muted-foreground'>
                Customer dapat mengecek progres pengerjaan di workshop kapan saja secara online
                tanpa harus selalu chat admin.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* KATALOG PRODUK */}
      <section id='produk' className='py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-8'>
        <div className='text-center space-y-2 max-w-xl mx-auto'>
          <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
            Portofolio & Katalog Workshop
          </span>
          <h2 className='text-2xl sm:text-3xl font-bold font-serif'>
            Pilihan Furniture Custom Debufa Works
          </h2>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Setiap pesanan diproduksi presisi sesuai ukuran ruangan dan preferensi material Anda.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {products.map((p, i) => (
            <Card
              key={i}
              className='border-border/60 overflow-hidden hover:border-amber-800/40 transition-colors flex flex-col justify-between'
            >
              <CardContent className='p-5 space-y-3'>
                <div className='flex items-center justify-between'>
                  <Badge
                    variant='outline'
                    className='text-[10px] border-amber-800/30 text-amber-900 dark:text-amber-300'
                  >
                    {p.badge}
                  </Badge>
                  <span className='text-[11px] text-muted-foreground'>
                    Mulai {formatRupiah(p.startPrice)}/{p.unit}
                  </span>
                </div>
                <h3 className='font-bold text-base font-serif text-foreground'>{p.title}</h3>
                <p className='text-xs text-muted-foreground leading-relaxed'>{p.description}</p>
              </CardContent>
              <div className='p-4 pt-0 border-t border-border/40 mt-2 bg-muted/20 flex items-center justify-between text-xs'>
                <span className='font-semibold text-amber-900 dark:text-amber-300'>
                  {formatRupiah(p.startPrice)}{' '}
                  <span className='text-[10px] text-muted-foreground font-normal'>/{p.unit}</span>
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  render={<Link href='/estimator' />}
                  className='text-xs h-7 text-amber-800 dark:text-amber-400'
                >
                  Hitung Biaya
                  <Icons.arrowRight className='ml-1 h-3 w-3' />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CARA KERJA 4 LANGKAH */}
      <section
        id='tentang'
        className='py-16 px-4 sm:px-6 border-y border-border/50 bg-stone-100/60 dark:bg-muted/20'
      >
        <div className='max-w-5xl mx-auto space-y-10'>
          <div className='text-center space-y-2 max-w-xl mx-auto'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Alur Transparan
            </span>
            <h2 className='text-2xl sm:text-3xl font-bold font-serif'>
              Cara Kerja Pemesanan di Debufa Works
            </h2>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              Alur 4 tahap sederhana dari konsultasi awal hingga instalasi rapi di lokasi Anda.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {steps.map((st) => (
              <Card key={st.no} className='border-border/60 p-4 space-y-2 relative bg-card'>
                <div className='flex h-7 w-7 rounded-full bg-amber-800 text-amber-50 font-bold text-xs items-center justify-center'>
                  {st.no}
                </div>
                <h4 className='font-bold text-sm text-foreground'>{st.title}</h4>
                <p className='text-[11px] text-muted-foreground leading-relaxed'>{st.desc}</p>
              </Card>
            ))}
          </div>

          <div className='text-center pt-2'>
            <Button
              size='lg'
              render={<Link href='/estimator' />}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold px-6'
            >
              Coba Simulasi Estimasi Biaya Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* CTA TRACKING */}
      <section className='py-16 px-4 sm:px-6 max-w-4xl mx-auto w-full'>
        <Card className='border-amber-800/40 bg-amber-500/5 p-6 sm:p-10 text-center space-y-4'>
          <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-800/10 text-amber-800 dark:text-amber-400'>
            <Icons.truck className='h-6 w-6' />
          </div>
          <h3 className='text-2xl font-bold font-serif text-foreground'>
            Sudah Memiliki Pesanan di Debufa Works?
          </h3>
          <p className='text-xs sm:text-sm text-muted-foreground max-w-md mx-auto'>
            Cek progres pembuatan rangka, pelapisan finishing, atau status jadwal pengiriman
            furniture Anda tanpa perlu login.
          </p>
          <div className='pt-2'>
            <Button
              size='lg'
              render={<Link href='/tracking' />}
              className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold px-6 gap-2'
            >
              <Icons.search className='h-4 w-4' />
              Cek Status Pesanan Saya
            </Button>
          </div>
        </Card>
      </section>

      {/* KONTAK & FOOTER */}
      <footer
        id='kontak'
        className='border-t border-border/60 bg-background py-10 px-4 sm:px-6 text-xs text-muted-foreground'
      >
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-foreground font-bold font-serif text-sm'>
              <Icons.hammer className='h-4 w-4 text-amber-800 dark:text-amber-400' />
              DEBUFA WORKS
            </div>
            <p className='text-[11px] leading-relaxed'>
              Bengkel spesialis custom interior furniture, kitchen set, wardrobe, dan backdrop.
              Kerapian, presisi, dan keterbukaan adalah komitmen kami.
            </p>
          </div>

          <div className='space-y-1.5'>
            <span className='font-semibold text-foreground block mb-1'>Workshop & Kontak</span>
            <p className='text-[11px]'>Jl. Workshop Debufa Works, Jabodetabek</p>
            <p className='text-[11px]'>
              WhatsApp:{' '}
              <a
                href='https://wa.me/6281289123456'
                target='_blank'
                rel='noopener noreferrer'
                className='text-amber-800 dark:text-amber-400 hover:underline'
              >
                +62 812-8912-3456
              </a>
            </p>
            <p className='text-[11px]'>Jam Kerja: Senin – Sabtu, 08.00 – 17.00 WIB</p>
          </div>

          <div className='space-y-1.5'>
            <span className='font-semibold text-foreground block mb-1'>Tautan Cepat</span>
            <div className='flex flex-col gap-1 text-[11px]'>
              <Link href='/estimasi' className='hover:text-foreground'>
                Estimasi Harga Online
              </Link>
              <Link href='/tracking' className='hover:text-foreground'>
                Lacak Pesanan (Tracking)
              </Link>
              <Link href='/admin' className='hover:text-foreground'>
                Admin Panel Bengkel
              </Link>
            </div>
          </div>
        </div>

        <div className='max-w-6xl mx-auto border-t border-border/50 mt-8 pt-4 text-center text-[10px]'>
          © {new Date().getFullYear()} DEBUFA WORKS. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
