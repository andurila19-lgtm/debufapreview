import { PriceConfiguration } from '@/types/debufa';

export const DEFAULT_PRICE_CONFIGURATION: PriceConfiguration = {
  furnitureTypes: [
    {
      id: 'furn-kitchen',
      name: 'Kitchen Set',
      description: 'Kabinet atas & bawah, termasuk karkas standar dan jasa setting',
      unit: 'meter lari',
      price: 2400000,
      active: true
    },
    {
      id: 'furn-wardrobe',
      name: 'Wardrobe / Lemari Pakaian',
      description: 'Lemari pakaian full plafon atau standar dengan sekat fungsional',
      unit: 'm²',
      price: 2600000,
      active: true
    },
    {
      id: 'furn-backdrop',
      name: 'Backdrop TV & Panel',
      description: 'Panel dinding aksen TV dengan ambalan gantung atau laci bawah',
      unit: 'm²',
      price: 1950000,
      active: true
    },
    {
      id: 'furn-desk',
      name: 'Meja Kerja & Rak Buku',
      description: 'Meja kerja kokoh dengan drawer kabinet dan rak buku dinding',
      unit: 'unit',
      price: 3200000,
      active: true
    },
    {
      id: 'furn-credenza',
      name: 'Credenza / Buffet',
      description: 'Kabinet penyimpanan rendah dengan pintu dan laci geser',
      unit: 'meter lari',
      price: 1800000,
      active: true
    },
    {
      id: 'furn-dipan',
      name: 'Dipan & Bedside',
      description: 'Rangka tempat tidur custom dengan headboard busa/HPL dan laci',
      unit: 'unit',
      price: 4500000,
      active: true
    }
  ],
  materials: [
    {
      id: 'mat-plywood-18',
      name: 'Multiplek / Plywood 18mm',
      description: 'Kayu lapis meranti solid grade A, kuat, tahan lembab, standar industri custom',
      unit: 'lembar',
      price: 265000,
      active: true
    },
    {
      id: 'mat-blockboard-18',
      name: 'Blockboard 18mm',
      description: 'Kayu olahan inti kayu sengon/falcatta berlapis triplek, ringan & ekonomis',
      unit: 'lembar',
      price: 215000,
      active: true
    },
    {
      id: 'mat-pvc-board',
      name: 'PVC Board 18mm (Waterproof)',
      description: '100% tahan air & rayap, ideal untuk sink area dapur dan kamar mandi',
      unit: 'lembar',
      price: 490000,
      active: true
    },
    {
      id: 'mat-mdf',
      name: 'MDF Board 18mm',
      description: 'Permukaan sangat halus, cocok untuk ukiran profil CNC dan cat duco',
      unit: 'lembar',
      price: 195000,
      active: true
    }
  ],
  hardware: [
    {
      id: 'hw-soft-closing',
      name: 'Engsel & Rel Soft Closing Standard',
      description: 'Sistem peredam menutup perlahan tanpa suara berisik (Slow motion)',
      unit: 'set',
      price: 250000,
      active: true
    },
    {
      id: 'hw-premium-blum',
      name: 'Engsel & Rel Premium (Hafele / Blum)',
      description: 'Hardware kelas dunia dengan garansi seumur hidup dan pergerakan ultra-halus',
      unit: 'set',
      price: 750000,
      active: true
    },
    {
      id: 'hw-standard',
      name: 'Hardware Standard Double Track',
      description: 'Engsel sendok standar dan rel laci double track awet',
      unit: 'set',
      price: 120000,
      active: true
    },
    {
      id: 'hw-push-to-open',
      name: 'Push to Open (Tanpa Handle)',
      description: 'Sistem sentuh buka modern minimalis tanpa tarikan gagang pintu',
      unit: 'set',
      price: 350000,
      active: true
    }
  ],
  finishing: [
    {
      id: 'fin-hpl-matte',
      name: 'HPL Solid / Woodgrain Matte',
      description: 'Lapisan laminasi tahan gores, tahan panas, motif serat kayu alami elegan',
      unit: 'm²',
      price: 280000,
      active: true
    },
    {
      id: 'fin-hpl-glossy',
      name: 'HPL Motif Marmer / Glossy Premium',
      description: 'Tampilan mewah mengkilap atau tekstur batu marmer eksklusif',
      unit: 'm²',
      price: 380000,
      active: true
    },
    {
      id: 'fin-duco',
      name: 'Cat Duco Polyurethane (PU)',
      description: 'Semprot cat mobil halus tanpa sambungan, finish matte atau satin',
      unit: 'm²',
      price: 650000,
      active: true
    },
    {
      id: 'fin-melamik',
      name: 'Melamik Semprot Transparan',
      description:
        'Finishing transparan memperlihatkan urat kayu asli dengan kehangatan warna natural',
      unit: 'm²',
      price: 420000,
      active: true
    }
  ]
};

export const ACCESSORY_RULES = {
  ledStrip: {
    name: 'LED Strip Warm White & Profil Aluminium',
    price: 350000
  },
  cerminBevel: {
    name: 'Cermin Asah Bevel 5mm',
    price: 450000
  },
  stopKontakPopUp: {
    name: 'Stop Kontak Pop-Up Dapur / Meja',
    price: 380000
  },
  rakPiringStainless: {
    name: 'Rak Piring Atas & Bawah Stainless 304',
    price: 650000
  }
};
