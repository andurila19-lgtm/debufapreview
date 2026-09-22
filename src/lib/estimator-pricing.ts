/**
 * Konfigurasi Harga Dasar Estimator DEBUFA WORKS
 * Terpisah dari komponen UI agar owner dapat menyesuaikan tarif sewaktu-waktu.
 */

export interface PricingOption {
  id: string;
  name: string;
  description?: string;
  pricePerMeter: number; // Tambahan biaya per meter lari / unit
  multiplier?: number;
}

export interface FurniturePricingRule {
  id: string;
  name: string;
  category: string;
  basePricePerMeter: number; // Harga dasar per meter lari standar
  unitLabel: string; // 'meter lari' atau 'unit'
  defaultDepth: number; // cm
  defaultHeight: number; // cm
}

export const FURNITURE_TYPES_PRICING: FurniturePricingRule[] = [
  {
    id: 'kitchen_bawah',
    name: 'Kitchen Set Kabinet Bawah',
    category: 'Kitchen',
    basePricePerMeter: 2300000,
    unitLabel: 'meter lari',
    defaultDepth: 60,
    defaultHeight: 85
  },
  {
    id: 'kitchen_atas',
    name: 'Kitchen Set Kabinet Atas',
    category: 'Kitchen',
    basePricePerMeter: 2100000,
    unitLabel: 'meter lari',
    defaultDepth: 35,
    defaultHeight: 80
  },
  {
    id: 'wardrobe_full',
    name: 'Wardrobe / Lemari Pakaian Full Plafon',
    category: 'Bedroom',
    basePricePerMeter: 2600000,
    unitLabel: 'meter lari',
    defaultDepth: 60,
    defaultHeight: 280
  },
  {
    id: 'wardrobe_std',
    name: 'Wardrobe Standar (Tinggi 2m)',
    category: 'Bedroom',
    basePricePerMeter: 2200000,
    unitLabel: 'meter lari',
    defaultDepth: 60,
    defaultHeight: 200
  },
  {
    id: 'backdrop_tv',
    name: 'Backdrop TV & Kisi-Kisi Wallpanel',
    category: 'Living Room',
    basePricePerMeter: 1950000,
    unitLabel: 'meter lari / m²',
    defaultDepth: 25,
    defaultHeight: 240
  },
  {
    id: 'credenza',
    name: 'Credenza / Buffet Minimalis',
    category: 'Living Room',
    basePricePerMeter: 1850000,
    unitLabel: 'meter lari',
    defaultDepth: 45,
    defaultHeight: 75
  },
  {
    id: 'meja_kerja',
    name: 'Meja Kerja / Meja Belajar + Rak',
    category: 'Office',
    basePricePerMeter: 1900000,
    unitLabel: 'meter lari',
    defaultDepth: 60,
    defaultHeight: 75
  },
  {
    id: 'dipan_queen',
    name: 'Dipan Tempat Tidur (Include Headboard)',
    category: 'Bedroom',
    basePricePerMeter: 4500000,
    unitLabel: 'unit (Queen 160x200)',
    defaultDepth: 205,
    defaultHeight: 100
  }
];

export const MATERIAL_OPTIONS: PricingOption[] = [
  {
    id: 'multipleks_18mm',
    name: 'Multipleks / Plywood Palm 18mm (Grade A Workshop)',
    description: 'Kuat, padat, anti-lentur, standar furniture interior custom premium',
    pricePerMeter: 0 // Base standard
  },
  {
    id: 'blockboard_18mm',
    name: 'Blockboard Melamin 18mm',
    description: 'Ekonomis, bobot ringan, cocok untuk partisi kering & rak baju',
    pricePerMeter: -150000
  },
  {
    id: 'plywood_maritim',
    name: 'Plywood Maritim / PVC Board Tahan Air 100%',
    description: 'Khusus kabinet bawah sink / area basah anti rayap & anti lembab',
    pricePerMeter: 450000
  }
];

export const FINISHING_OPTIONS: PricingOption[] = [
  {
    id: 'hpl_standard',
    name: 'HPL Taco Standar (Solid / Doff / Glossy)',
    description: 'Pilihan warna polos modern & minimalis',
    pricePerMeter: 0
  },
  {
    id: 'hpl_woodgrain',
    name: 'HPL Taco Woodgrain Premium & Tekstur',
    description: 'Serat kayu alami, tekstur serat timbul elegan',
    pricePerMeter: 150000
  },
  {
    id: 'duco_doff',
    name: 'Cat Duco Doff Semprot Oven',
    description: 'Permukaan mulus tanpa sambungan edging, mewah bergaya semi-klasik',
    pricePerMeter: 750000
  },
  {
    id: 'duco_glossy',
    name: 'Cat Duco High Gloss Mirror Polished',
    description: 'Kilau pantul kaca sempurna, tahan gores dengan clear coat automotive',
    pricePerMeter: 950000
  }
];

export const HARDWARE_OPTIONS: PricingOption[] = [
  {
    id: 'slowmotion_standard',
    name: 'Engsel Soft-Closing & Rel Tandem Slow-Motion Standar (Huben/Twin)',
    description: 'Pintu & laci menutup perlahan tanpa suara bantingan',
    pricePerMeter: 0
  },
  {
    id: 'premium_blum',
    name: 'Hardware Premium Heavy-Duty (Hafele / Blum Tip-On Push to Open)',
    description: 'Durabilitas maksimal, tanpa handle tampak luar (clean look)',
    pricePerMeter: 350000
  },
  {
    id: 'rel_double_track',
    name: 'Rel Laci Ball Bearing Double Track Biasa',
    description: 'Opsi ekonomis standar workshop',
    pricePerMeter: -100000
  }
];

export const HANDLE_OPTIONS = [
  { id: 'handle_tanam', name: 'Profile Handle Tanam Aluminium (Finger Groove)' },
  { id: 'push_to_open', name: 'Push to Open (Tanpa Handle Luar)' },
  { id: 'handle_tarik', name: 'Handle Logam Minimalis (Matte Black / Brass Gold)' },
  { id: 'bevel_45', name: 'Potong Bevel 45 Derajat (Handless)' }
];

export interface CalculationInput {
  furnitureId: string;
  lengthMeter: number;
  materialId: string;
  finishingId: string;
  hardwareId: string;
  quantity: number;
}

export function calculateEstimate(input: CalculationInput) {
  const furniture =
    FURNITURE_TYPES_PRICING.find((f) => f.id === input.furnitureId) || FURNITURE_TYPES_PRICING[0];
  const material = MATERIAL_OPTIONS.find((m) => m.id === input.materialId) || MATERIAL_OPTIONS[0];
  const finishing =
    FINISHING_OPTIONS.find((f) => f.id === input.finishingId) || FINISHING_OPTIONS[0];
  const hardware = HARDWARE_OPTIONS.find((h) => h.id === input.hardwareId) || HARDWARE_OPTIONS[0];

  const ratePerMeter =
    furniture.basePricePerMeter +
    material.pricePerMeter +
    finishing.pricePerMeter +
    hardware.pricePerMeter;

  const isUnit = furniture.unitLabel.includes('unit');
  const effectiveMultiplier = isUnit ? 1 : Math.max(1, input.lengthMeter);
  const totalPerItem = ratePerMeter * effectiveMultiplier;
  const grandTotal = totalPerItem * Math.max(1, input.quantity);

  const estimatedDp = Math.round(grandTotal * 0.5);
  const estimatedRemaining = grandTotal - estimatedDp;

  return {
    furniture,
    material,
    finishing,
    hardware,
    ratePerMeter,
    effectiveMultiplier,
    totalPerItem,
    grandTotal,
    estimatedDp,
    estimatedRemaining
  };
}
