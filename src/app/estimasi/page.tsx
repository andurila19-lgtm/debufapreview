'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDebufaStore } from '@/lib/debufa-store';
import { calculateFurnitureEstimate } from '@/lib/estimator/calculator';
import { formatRupiah } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

export default function EstimasiPublikPage() {
  const { priceConfig } = useDebufaStore();

  const activeFurniture = useMemo(
    () => priceConfig.furnitureTypes.filter((f) => f.active),
    [priceConfig.furnitureTypes]
  );
  const activeMaterials = useMemo(
    () => priceConfig.materials.filter((m) => m.active),
    [priceConfig.materials]
  );
  const activeFinishing = useMemo(
    () => priceConfig.finishing.filter((f) => f.active),
    [priceConfig.finishing]
  );
  const activeHardware = useMemo(
    () => priceConfig.hardware.filter((h) => h.active),
    [priceConfig.hardware]
  );

  // Pilihan Pengguna
  const [furnitureId, setFurnitureId] = useState(activeFurniture[0]?.id || 'furn-kitchen');
  const [lengthCm, setLengthCm] = useState<number>(300);
  const [heightCm, setHeightCm] = useState<number>(240);
  const [depthCm, setDepthCm] = useState<number>(60);
  const [materialId, setMaterialId] = useState(activeMaterials[0]?.id || 'mat-plywood-18');
  const [finishingId, setFinishingId] = useState(activeFinishing[0]?.id || 'fin-hpl-matte');
  const [hardwareId, setHardwareId] = useState(activeHardware[0]?.id || 'hw-soft-closing');
  const [relType, setRelType] = useState('Rel Tandem Slow-Motion');
  const [quantity, setQuantity] = useState<number>(1);

  // Aksesoris opsional
  const [ledStrip, setLedStrip] = useState(false);
  const [stopKontak, setStopKontak] = useState(false);

  // Kalkulasi
  const calculation = useMemo(() => {
    return calculateFurnitureEstimate(
      {
        furnitureTypeId: furnitureId,
        dimensions: {
          length: lengthCm,
          height: heightCm,
          depth: depthCm,
          unit: 'cm'
        },
        materialId,
        finishingId,
        hardwareId,
        quantity,
        additionalAccessories: {
          ledStrip,
          stopKontakPopUp: stopKontak
        }
      },
      priceConfig
    );
  }, [
    furnitureId,
    lengthCm,
    heightCm,
    depthCm,
    materialId,
    finishingId,
    hardwareId,
    quantity,
    ledStrip,
    stopKontak,
    priceConfig
  ]);

  const selectedFurn = activeFurniture.find((f) => f.id === furnitureId) || activeFurniture[0];
  const selectedMat = activeMaterials.find((m) => m.id === materialId) || activeMaterials[0];
  const selectedFin = activeFinishing.find((f) => f.id === finishingId) || activeFinishing[0];
  const selectedHw = activeHardware.find((h) => h.id === hardwareId) || activeHardware[0];

  const waText = `Halo DEBUFA WORKS, saya ingin menanyakan estimasi custom furniture:
- *Jenis Furniture:* ${selectedFurn?.name}
- *Ukuran:* P: ${lengthCm}cm x T: ${heightCm}cm x L: ${depthCm}cm
- *Bahan Utama:* ${selectedMat?.name}
- *Finishing:* ${selectedFin?.name}
- *Hardware & Rel:* ${selectedHw?.name} (${relType})
- *Jumlah:* ${quantity} unit
- *Perkiraan Harga:* ~${formatRupiah(calculation.totalPrice)}

Apakah bisa dijadwalkan konsultasi dan pengukuran lokasi? Terima kasih.`;

  const waUrl = `https://wa.me/6281289123456?text=${encodeURIComponent(waText)}`;

  return (
    <div className='min-h-screen bg-stone-50/50 dark:bg-background text-foreground flex flex-col'>
      {/* Header */}
      <header className='border-b border-border/60 bg-background/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6'>
        <div className='max-w-5xl mx-auto h-16 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-amber-800 text-amber-50 font-bold'>
              <Icons.hammer className='h-4 w-4' />
            </div>
            <div>
              <span className='font-serif font-bold text-base tracking-tight block'>
                DEBUFA WORKS
              </span>
              <span className='text-[10px] text-muted-foreground block -mt-0.5'>
                Estimator Furniture Custom
              </span>
            </div>
          </Link>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              render={<Link href='/tracking' />}
              className='text-xs'
            >
              <Icons.truck className='mr-1.5 h-3.5 w-3.5' />
              Cek Pesanan
            </Button>
            <Button variant='ghost' size='sm' render={<Link href='/' />} className='text-xs'>
              Beranda
            </Button>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6'>
        <div className='text-center space-y-2 max-w-2xl mx-auto'>
          <Badge className='bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold'>
            Kalkulator Transparan
          </Badge>
          <h1 className='text-2xl sm:text-3xl font-bold font-serif tracking-tight'>
            Simulasi Estimasi Harga Furniture
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            Pilih jenis furniture, ukuran ruangan, dan material untuk melihat perkiraan biaya
            pembuatan di workshop kami.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          {/* Formulir Pilihan (2 Kolom) */}
          <div className='lg:col-span-2 space-y-4'>
            {/* 1. Jenis Furniture */}
            <Card className='border-border/60 p-4 space-y-3'>
              <div className='font-bold text-xs text-foreground'>1. Pilih Jenis Furniture</div>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {activeFurniture.map((f) => (
                  <button
                    key={f.id}
                    type='button'
                    onClick={() => setFurnitureId(f.id)}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      furnitureId === f.id
                        ? 'border-amber-800 bg-amber-800/10 text-amber-950 dark:text-amber-200 font-bold ring-1 ring-amber-800'
                        : 'border-border/60 hover:bg-muted/30'
                    }`}
                  >
                    <div>{f.name}</div>
                    <div className='text-[10px] text-muted-foreground mt-0.5'>
                      Mulai {formatRupiah(f.price)}/{f.unit}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* 2. Ukuran Ruangan */}
            <Card className='border-border/60 p-4 space-y-3 text-xs'>
              <div className='font-bold text-xs text-foreground'>2. Ukuran Ruangan (cm)</div>
              <div className='grid grid-cols-3 gap-3'>
                <div>
                  <label className='font-medium text-muted-foreground block mb-1'>Panjang</label>
                  <div className='relative'>
                    <Input
                      type='number'
                      min={50}
                      max={1200}
                      step={10}
                      value={lengthCm}
                      onChange={(e) => setLengthCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground font-mono'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(lengthCm / 100).toFixed(2)} m
                  </span>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground block mb-1'>Tinggi</label>
                  <div className='relative'>
                    <Input
                      type='number'
                      min={50}
                      max={400}
                      step={5}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground font-mono'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(heightCm / 100).toFixed(2)} m
                  </span>
                </div>

                <div>
                  <label className='font-medium text-muted-foreground block mb-1'>Kedalaman</label>
                  <div className='relative'>
                    <Input
                      type='number'
                      min={30}
                      max={150}
                      step={5}
                      value={depthCm}
                      onChange={(e) => setDepthCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground font-mono'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(depthCm / 100).toFixed(2)} m
                  </span>
                </div>
              </div>
            </Card>

            {/* 3. Bahan, Finishing, Hardware */}
            <Card className='border-border/60 p-4 space-y-3.5 text-xs'>
              <div className='font-bold text-xs text-foreground'>
                3. Bahan Utama, Finishing & Hardware
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <label className='font-semibold text-muted-foreground'>Bahan Utama Kayu</label>
                  <select
                    className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                  >
                    {activeMaterials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-muted-foreground'>Lapisan Finishing</label>
                  <select
                    className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                    value={finishingId}
                    onChange={(e) => setFinishingId(e.target.value)}
                  >
                    {activeFinishing.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
                <div className='space-y-1'>
                  <label className='font-semibold text-muted-foreground'>
                    Pilihan Hardware & Engsel
                  </label>
                  <select
                    className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                    value={hardwareId}
                    onChange={(e) => setHardwareId(e.target.value)}
                  >
                    {activeHardware.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-1'>
                  <label className='font-semibold text-muted-foreground'>Jenis Rel Laci</label>
                  <select
                    className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                    value={relType}
                    onChange={(e) => setRelType(e.target.value)}
                  >
                    <option value='Rel Tandem Slow-Motion'>
                      Rel Tandem Slow-Motion (Bawah Laci)
                    </option>
                    <option value='Rel Double Track Full Extension'>
                      Rel Double Track Full Extension (Samping)
                    </option>
                    <option value='Rel Standar Slow-Closing'>Rel Standar Slow-Closing</option>
                  </select>
                </div>
              </div>

              <div className='pt-2 flex items-center justify-between border-t border-border/40'>
                <label className='font-semibold text-foreground'>Jumlah Unit Pesanan:</label>
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-7 w-7 p-0'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className='font-mono font-bold w-6 text-center'>{quantity}</span>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-7 w-7 p-0'
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Kotak Hasil Perkiraan Harga (1 Kolom) */}
          <div className='lg:sticky lg:top-20 space-y-4'>
            <Card className='border-amber-800/40 bg-amber-500/5 p-5 space-y-4 text-xs shadow-xs'>
              <CardHeader className='p-0'>
                <CardTitle className='text-base font-serif text-amber-950 dark:text-amber-200'>
                  Perkiraan Harga
                </CardTitle>
                <CardDescription className='text-xs'>
                  Simulasi biaya pengerjaan workshop Debufa Works
                </CardDescription>
              </CardHeader>

              <CardContent className='p-0 space-y-3.5'>
                <div className='space-y-1.5 border-b border-border/40 pb-3 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Item:</span>
                    <span className='font-semibold text-foreground'>{selectedFurn?.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Ukuran:</span>
                    <span className='font-mono'>
                      {(lengthCm / 100).toFixed(1)} x {(heightCm / 100).toFixed(1)} x{' '}
                      {(depthCm / 100).toFixed(1)} m
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Bahan:</span>
                    <span className='truncate max-w-[140px] text-right'>{selectedMat?.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Finishing:</span>
                    <span className='truncate max-w-[140px] text-right'>{selectedFin?.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Rel:</span>
                    <span className='truncate max-w-[140px] text-right'>{relType}</span>
                  </div>
                </div>

                <div>
                  <span className='text-[11px] text-muted-foreground block'>Estimasi Total:</span>
                  <div className='text-2xl font-bold font-mono text-amber-900 dark:text-amber-300 mt-0.5'>
                    {formatRupiah(calculation.totalPrice)}
                  </div>
                </div>

                <div className='p-2.5 rounded bg-amber-800/10 border border-amber-800/20 text-[11px] text-amber-950 dark:text-amber-200 space-y-1'>
                  <div className='flex justify-between'>
                    <span>Target DP 50%:</span>
                    <span className='font-mono font-bold'>
                      {formatRupiah(Math.round(calculation.totalPrice * 0.5))}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Sisa Pelunasan:</span>
                    <span className='font-mono'>
                      {formatRupiah(Math.round(calculation.totalPrice * 0.5))}
                    </span>
                  </div>
                </div>

                <div className='p-2.5 bg-muted/40 border border-border/50 rounded text-[10px] text-muted-foreground leading-relaxed italic'>
                  &ldquo;Harga ini merupakan perkiraan awal. Harga final mengikuti hasil konsultasi
                  dan pengukuran.&rdquo;
                </div>

                <div className='pt-1'>
                  <Button
                    size='lg'
                    render={<a href={waUrl} target='_blank' rel='noopener noreferrer' />}
                    className='w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-5 gap-2 text-xs shadow-xs'
                  >
                    <Icons.whatsapp className='h-4 w-4' />
                    Tanyakan ke Debufa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
