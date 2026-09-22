'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebufaStore } from '@/lib/debufa-store';
import { calculateFurnitureEstimate } from '@/lib/estimator/calculator';
import { formatRupiah } from '@/lib/formatters';
import { FurnitureType } from '@/types/debufa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminEstimasiPage() {
  const router = useRouter();
  const { priceConfig, customers, addProject } = useDebufaStore();

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

  // Form selections
  const [furnitureId, setFurnitureId] = useState(activeFurniture[0]?.id || 'furn-kitchen');
  const [lengthCm, setLengthCm] = useState<number>(300);
  const [heightCm, setHeightCm] = useState<number>(240);
  const [depthCm, setDepthCm] = useState<number>(60);
  const [materialId, setMaterialId] = useState(activeMaterials[0]?.id || 'mat-plywood-18');
  const [finishingId, setFinishingId] = useState(activeFinishing[0]?.id || 'fin-hpl-matte');
  const [hardwareId, setHardwareId] = useState(activeHardware[0]?.id || 'hw-soft-closing');
  const [relType, setRelType] = useState('Rel Tandem Slow-Motion');
  const [quantity, setQuantity] = useState<number>(1);

  // Modal Konversi ke Pesanan
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [orderDeadline, setOrderDeadline] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

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
        quantity
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
    priceConfig
  ]);

  const selectedFurn = activeFurniture.find((f) => f.id === furnitureId) || activeFurniture[0];
  const selectedMat = activeMaterials.find((m) => m.id === materialId) || activeMaterials[0];
  const selectedFin = activeFinishing.find((f) => f.id === finishingId) || activeFinishing[0];
  const selectedHw = activeHardware.find((h) => h.id === hardwareId) || activeHardware[0];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId) || customers[0];
    if (!cust) {
      toast.error('Pilih pelanggan terlebih dahulu.');
      return;
    }

    const dpTarget = Math.round(calculation.totalPrice * 0.5);

    const created = addProject({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      projectName: `${selectedFurn?.name || 'Custom Furniture'} - ${cust.name}`,
      furnitureType: (selectedFurn?.name as FurnitureType) || 'Custom Furniture',
      specifications: {
        furnitureType: (selectedFurn?.name as FurnitureType) || 'Custom Furniture',
        dimensions: {
          length: lengthCm / 100,
          height: heightCm / 100,
          depth: depthCm / 100,
          unit: 'meter lari'
        },
        material: selectedMat?.name || 'Multiplek 18mm',
        hardware: `${selectedHw?.name || 'Slow-Closing'} (${relType})`,
        finishing: selectedFin?.name || 'HPL',
        quantity,
        notes: `Dihasilkan langsung dari Estimasi Harga Bengkel. Estimasi pengerjaan ~${calculation.estimatedDays} hari kerja.`
      },
      totalAmount: calculation.totalPrice,
      value: calculation.totalPrice,
      dpAmount: dpTarget,
      paidAmount: 0,
      status: 'waiting_dp',
      progress: 20,
      deadline: orderDeadline,
      startDate: new Date().toISOString().split('T')[0],
      lastUpdate: 'Pesanan baru dibuat dari Estimasi Harga'
    });

    toast.success('Pesanan Baru Berhasil Dibuat!', {
      description: `Nomor pesanan ${created.id} untuk ${cust.name} siap diproses.`
    });

    setIsOrderModalOpen(false);
    router.push(`/admin/pesanan/${created.id}`);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
              Kalkulator Biaya
            </span>
          </div>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif mt-0.5'>
            Estimasi Harga Furniture
          </h1>
          <p className='text-sm text-muted-foreground'>
            Hitung perkiraan biaya pesanan secara instan dan buat pesanan langsung
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            render={<Link href='/admin/pengaturan' />}
            className='text-xs gap-1.5'
          >
            <Icons.settings className='h-3.5 w-3.5 text-amber-800 dark:text-amber-400' />
            Ubah Tarif di Pengaturan
          </Button>
          <Button
            variant='outline'
            size='sm'
            render={<Link href='/estimasi' target='_blank' />}
            className='text-xs gap-1.5'
          >
            <Icons.externalLink className='h-3.5 w-3.5' />
            Estimator Publik
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
        {/* Form Pilihan (2 Kolom) */}
        <div className='lg:col-span-2 space-y-4'>
          <Card className='border-border/60 p-5 space-y-4 text-xs'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='font-semibold text-foreground'>Jenis Furniture</label>
                <select
                  className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-semibold'
                  value={furnitureId}
                  onChange={(e) => setFurnitureId(e.target.value)}
                >
                  {activeFurniture.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({formatRupiah(f.price)}/{f.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='font-semibold text-foreground'>Jumlah Unit</label>
                <Input
                  type='number'
                  min='1'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className='text-xs font-mono'
                />
              </div>
            </div>

            {/* Ukuran cm */}
            <div className='space-y-1.5'>
              <label className='font-semibold text-foreground'>Ukuran Dimensi (cm)</label>
              <div className='grid grid-cols-3 gap-3'>
                <div>
                  <span className='text-[10px] text-muted-foreground block mb-0.5'>Panjang</span>
                  <div className='relative'>
                    <Input
                      type='number'
                      step='10'
                      value={lengthCm}
                      onChange={(e) => setLengthCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(lengthCm / 100).toFixed(2)} meter
                  </span>
                </div>

                <div>
                  <span className='text-[10px] text-muted-foreground block mb-0.5'>Tinggi</span>
                  <div className='relative'>
                    <Input
                      type='number'
                      step='5'
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(heightCm / 100).toFixed(2)} meter
                  </span>
                </div>

                <div>
                  <span className='text-[10px] text-muted-foreground block mb-0.5'>Kedalaman</span>
                  <div className='relative'>
                    <Input
                      type='number'
                      step='5'
                      value={depthCm}
                      onChange={(e) => setDepthCm(Number(e.target.value))}
                      className='text-xs pr-7 font-mono'
                    />
                    <span className='absolute right-2 top-2 text-[10px] text-muted-foreground'>
                      cm
                    </span>
                  </div>
                  <span className='text-[10px] text-muted-foreground mt-0.5 block'>
                    {(depthCm / 100).toFixed(2)} meter
                  </span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1'>
              <div className='space-y-1.5'>
                <label className='font-semibold text-foreground'>Bahan Utama</label>
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

              <div className='space-y-1.5'>
                <label className='font-semibold text-foreground'>Finishing</label>
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

              <div className='space-y-1.5'>
                <label className='font-semibold text-foreground'>Hardware / Engsel</label>
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
            </div>

            <div className='space-y-1.5 pt-1'>
              <label className='font-semibold text-foreground'>Jenis Rel Laci</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground'
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
              >
                <option value='Rel Tandem Slow-Motion'>Rel Tandem Slow-Motion (Bawah Laci)</option>
                <option value='Rel Double Track Full Extension'>
                  Rel Double Track Full Extension (Samping)
                </option>
                <option value='Rel Standar Slow-Closing'>Rel Standar Slow-Closing</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Hasil Perkiraan Harga (1 Kolom) */}
        <Card className='border-amber-800/40 bg-amber-500/5 p-5 space-y-4 text-xs shadow-xs'>
          <CardHeader className='p-0'>
            <CardTitle className='text-base font-serif text-amber-950 dark:text-amber-200'>
              Perkiraan Harga
            </CardTitle>
            <CardDescription className='text-xs'>
              Hasil formula estimasi cepat bengkel
            </CardDescription>
          </CardHeader>

          <CardContent className='p-0 space-y-3.5'>
            <div className='space-y-1.5 border-b border-border/40 pb-2.5 text-[11px]'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Tarif Dasar ({selectedFurn?.unit}):</span>
                <span className='font-mono'>{formatRupiah(calculation.baseRatePerUnit)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Ukuran / Multiplier:</span>
                <span className='font-mono font-bold'>{calculation.meterEquivalent} m</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Bahan:</span>
                <span className='truncate max-w-[130px]'>{selectedMat?.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Finishing:</span>
                <span className='truncate max-w-[130px]'>{selectedFin?.name}</span>
              </div>
            </div>

            <div>
              <span className='text-muted-foreground text-[11px] block'>Perkiraan Harga:</span>
              <div className='text-2xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-0.5'>
                {formatRupiah(calculation.totalPrice)}
              </div>
            </div>

            <div className='p-2.5 rounded bg-amber-800/10 border border-amber-800/20 text-[11px] text-amber-950 dark:text-amber-200 space-y-1'>
              <div className='flex justify-between'>
                <span>Target DP 50%:</span>
                <span className='font-bold font-mono'>
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
              &ldquo;Harga ini merupakan perkiraan awal. Harga final mengikuti hasil konsultasi dan
              pengukuran.&rdquo;
            </div>

            <Button
              onClick={() => setIsOrderModalOpen(true)}
              className='w-full bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-semibold py-4 gap-1.5'
            >
              <Icons.add className='h-4 w-4' />
              Jadikan Pesanan Baru
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* MODAL: JADIKAN PESANAN */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-base font-serif font-bold'>
              Jadikan Pesanan Baru
            </DialogTitle>
            <DialogDescription className='text-xs'>
              Simpan hasil estimasi ini langsung sebagai pesanan aktif di sistem.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateOrder} className='space-y-3 text-xs py-2'>
            <div className='p-2.5 rounded bg-amber-500/10 border border-amber-800/20 space-y-1 text-[11px]'>
              <div className='flex justify-between font-bold'>
                <span>{selectedFurn?.name}</span>
                <span className='font-mono text-amber-900 dark:text-amber-300'>
                  {formatRupiah(calculation.totalPrice)}
                </span>
              </div>
              <div className='text-muted-foreground'>
                Ukuran: {(lengthCm / 100).toFixed(1)} x {(heightCm / 100).toFixed(1)} x{' '}
                {(depthCm / 100).toFixed(1)} m • {selectedMat?.name}
              </div>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Pilih Pelanggan *</label>
              <select
                className='w-full rounded-md border border-input bg-background p-2 text-xs text-foreground font-semibold'
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='font-semibold text-foreground'>Target Deadline *</label>
              <Input
                type='date'
                required
                value={orderDeadline}
                onChange={(e) => setOrderDeadline(e.target.value)}
                className='text-xs'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsOrderModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type='submit'
                size='sm'
                className='bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold'
              >
                Buat Pesanan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
