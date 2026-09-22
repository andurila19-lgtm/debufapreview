import {
  Customer,
  Project,
  Quotation,
  Payment,
  Worker,
  Attendance,
  WorkerTransaction,
  Inquiry,
  PriceConfiguration
} from '@/types/debufa';
import { DEFAULT_PRICE_CONFIGURATION } from './estimator/rules';

export const INITIAL_PRICE_CONFIG: PriceConfiguration = DEFAULT_PRICE_CONFIGURATION;

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CST-001',
    name: 'Budi Santoso',
    phone: '6281289123456',
    email: 'budi.santoso@gmail.com',
    address: 'Jl. Senopati No. 28, Kebayoran Baru, Jakarta Selatan',
    notes:
      'Konsumen Kitchen Set & Master Bedroom, mengutamakan finishing rapi dan detail rel tandem.',
    createdAt: '2026-01-10'
  },
  {
    id: 'CST-002',
    name: 'Ibu Sari Rahmawati',
    phone: '6281345678901',
    email: 'sari.rahmawati@gmail.com',
    address: 'Cluster Greenwich Park, Beverly Hills Blok C No. 8, BSD City, Tangerang Selatan',
    notes:
      'Custom wardrobe & lemari pakaian 4 pintu, butuh aksesoris gantungan dasi dan LED sensor.',
    createdAt: '2026-01-18'
  },
  {
    id: 'CST-003',
    name: 'Bpk. Ir. Hendra Gunawan',
    phone: '6281908765432',
    email: 'h.gunawan@ciputra.com',
    address: 'Jl. Kasuari VII Blok HB No. 12, Bintaro Sektor 9, Tangerang Selatan',
    notes: 'Owner Cafe & Commercial Space, order custom bar counter & meja kasir.',
    createdAt: '2026-02-02'
  },
  {
    id: 'CST-004',
    name: 'Ibu Maya Anggraini',
    phone: '6287711223344',
    email: 'maya.anggraini@yahoo.co.id',
    address: 'Apartemen MOI Tower San Francisco Lt. 21, Kelapa Gading, Jakarta Utara',
    notes: 'Backdrop TV fluted wood, akses lift barang terbatas jam kerja apartemen.',
    createdAt: '2026-02-12'
  },
  {
    id: 'CST-005',
    name: 'Ibu Rina Kusuma',
    phone: '628119876543',
    email: 'rina.kusuma@studioarsitek.com',
    address: 'Jl. Bukit Hijau Blok PA No. 14, Pondok Indah, Jakarta Selatan',
    notes: 'Rak display partisi ruang tamu dan ruang keluarga.',
    createdAt: '2026-02-20'
  },
  {
    id: 'CST-006',
    name: 'Bpk. Arif Rahman',
    phone: '6285678901234',
    email: 'arif.rahman@outlook.com',
    address: 'Jl. Teuku Umar No. 18, Menteng, Jakarta Pusat',
    notes: 'Home office desk meja kerja ergonomis minimalis.',
    createdAt: '2026-03-01'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'DBF-00125',
    customerId: 'CST-001',
    customerName: 'Budi Santoso',
    customerPhone: '6281289123456',
    customerAddress: 'Jl. Senopati No. 28, Kebayoran Baru, Jakarta Selatan',
    projectName: 'Kitchen Set Minimalis Modern',
    furnitureType: 'Kitchen Set',
    specifications: {
      furnitureType: 'Kitchen Set',
      dimensions: { length: 4.5, height: 2.8, depth: 0.6, unit: 'meter lari' },
      material: 'Multipleks 18mm Palm (Anti-Rayap)',
      hardware: 'Rel Tandem Blum + Engsel Soft-Closing Hafele',
      finishing: 'HPL Taco Woodgrain TH-882G & Solid White',
      quantity: 1,
      notes: 'Termasuk ambalan bumbu stainless tarik dan rak piring atas hydrolic.'
    },
    totalAmount: 24500000,
    value: 24500000,
    dpAmount: 12250000,
    paidAmount: 12250000,
    remainingAmount: 12250000,
    paymentStatus: 'dp',
    status: 'production',
    progress: 60,
    deadline: '2026-09-30',
    startDate: '2026-09-01',
    lastUpdate: '2026-09-22 10:15',
    notes: [
      {
        id: 'NOT-01',
        date: '2026-09-22 10:15',
        author: 'Owner Debufa',
        text: 'Rangka utama sudah selesai dan sedang masuk tahap pengerjaan pintu.'
      },
      {
        id: 'NOT-02',
        date: '2026-09-12 14:00',
        author: 'Owner Debufa',
        text: 'Multipleks 18mm tiba, pemotongan presisi oleh Pak Slamet.'
      }
    ],
    files: [
      {
        id: 'FIL-01',
        name: '3D-Render-Kitchen-Budi.jpg',
        category: 'Design',
        type: 'desain_3d',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
        date: '2026-09-02',
        size: '2.4 MB',
        author: 'Drafter Debufa',
        caption: 'Render 3D Desain Final Disetujui'
      },
      {
        id: 'FIL-02',
        name: 'Rangka-Workshop.jpg',
        category: 'Progress Photo',
        type: 'foto_progress',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        date: '2026-09-18',
        size: '1.8 MB',
        author: 'Owner Debufa',
        caption: 'Perakitan Rangka Bodi Kabinet'
      }
    ],
    statusHistory: [
      {
        id: 'SH-01',
        status: 'lead',
        date: '2026-09-01 09:00',
        author: 'Admin Debufa',
        note: 'Pesanan dicatat awal dari konsultasi WhatsApp',
        progress: 10
      },
      {
        id: 'SH-02',
        status: 'waiting_dp',
        date: '2026-09-03 11:00',
        author: 'Admin Debufa',
        note: 'Quotation disetujui, invoice DP diterbitkan',
        progress: 25
      },
      {
        id: 'SH-03',
        status: 'production',
        date: '2026-09-05 14:00',
        author: 'Owner Debufa',
        note: 'DP Rp12.250.000 terverifikasi lunas, produksi rangka dimulai',
        progress: 40
      },
      {
        id: 'SH-04',
        status: 'production',
        date: '2026-09-22 10:15',
        author: 'Owner Debufa',
        note: 'Rangka utama sudah selesai dan sedang masuk tahap pengerjaan pintu.',
        progress: 60
      }
    ]
  },
  {
    id: 'DBF-00123',
    customerId: 'CST-002',
    customerName: 'Ibu Sari Rahmawati',
    customerPhone: '6281345678901',
    customerAddress: 'Cluster Greenwich Park Blok C No. 8, BSD City',
    projectName: 'Lemari Pakaian 4 Pintu Master Bedroom',
    furnitureType: 'Lemari Pakaian',
    specifications: {
      furnitureType: 'Lemari Pakaian',
      dimensions: { length: 3.2, height: 2.9, depth: 0.6, unit: 'meter lari' },
      material: 'Multipleks 18mm & Kaca Tinted Bronze',
      hardware: 'Rel Sliding Heavy Duty + LED Sensor Gerak',
      finishing: 'HPL Taco Warm Oak & Frame Aluminium Bronze',
      quantity: 1,
      notes: 'Termasuk laci perhiasan beludru dan gantungan baju hidrolik.'
    },
    totalAmount: 18500000,
    value: 18500000,
    dpAmount: 9250000,
    paidAmount: 0,
    remainingAmount: 18500000,
    paymentStatus: 'belum_bayar',
    status: 'waiting_dp',
    progress: 20,
    deadline: '2026-09-25',
    startDate: '2026-09-10',
    lastUpdate: '2026-09-21 16:00',
    notes: [
      {
        id: 'NOT-03',
        date: '2026-09-21 16:00',
        author: 'Admin Debufa',
        text: 'Quotation dan desain 3D disetujui, menunggu pembayaran DP 50% untuk pembelian material.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-05',
        status: 'lead',
        date: '2026-09-10 10:00',
        author: 'Admin Debufa',
        note: 'Survey lokasi master bedroom BSD',
        progress: 10
      },
      {
        id: 'SH-06',
        status: 'waiting_dp',
        date: '2026-09-18 14:00',
        author: 'Admin Debufa',
        note: 'Quotation dan desain 3D disetujui, menunggu pembayaran DP 50% untuk pembelian material.',
        progress: 20
      }
    ]
  },
  {
    id: 'DBF-00121',
    customerId: 'CST-004',
    customerName: 'Ibu Maya Anggraini',
    customerPhone: '6287711223344',
    customerAddress: 'Apartemen MOI Tower San Francisco Lt. 21, Kelapa Gading, Jakarta Utara',
    projectName: 'TV Cabinet & Backdrop Minimalis',
    furnitureType: 'TV Cabinet',
    specifications: {
      furnitureType: 'TV Cabinet',
      dimensions: { length: 2.8, height: 2.6, depth: 0.4, unit: 'meter lari' },
      material: 'Multipleks 18mm & WPC Fluted Wood Panel',
      hardware: 'Rel Laci Push to Open + Saklar LED Strip',
      finishing: 'HPL Taco Marble Carara & Fluted Oak',
      quantity: 1,
      notes: 'Desain ambalan melayang (floating cabinet) dengan cable ducting rapi.'
    },
    totalAmount: 8500000,
    value: 8500000,
    dpAmount: 4250000,
    paidAmount: 0,
    remainingAmount: 8500000,
    paymentStatus: 'belum_bayar',
    status: 'waiting_dp',
    progress: 15,
    deadline: '2026-10-15',
    startDate: '2026-09-15',
    lastUpdate: '2026-09-20 14:00',
    notes: [
      {
        id: 'NOT-04',
        date: '2026-09-20 14:00',
        author: 'Admin Debufa',
        text: 'Konsultasi spesifikasi selesai, invoice DP terkirim ke WhatsApp konsumen.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-07',
        status: 'lead',
        date: '2026-09-15 11:00',
        author: 'Admin Debufa',
        note: 'Inquiry awal backdrop apartemen',
        progress: 10
      },
      {
        id: 'SH-08',
        status: 'waiting_dp',
        date: '2026-09-20 14:00',
        author: 'Admin Debufa',
        note: 'Invoice DP diterbitkan',
        progress: 15
      }
    ]
  },
  {
    id: 'DBF-00122',
    customerId: 'CST-006',
    customerName: 'Bpk. Arif Rahman',
    customerPhone: '6285678901234',
    customerAddress: 'Jl. Teuku Umar No. 18, Menteng, Jakarta Pusat',
    projectName: 'Meja Kerja Ergonomis & Rak Arsip',
    furnitureType: 'Meja Kerja',
    specifications: {
      furnitureType: 'Meja Kerja',
      dimensions: { length: 2.2, height: 0.75, depth: 0.8, unit: 'meter lari' },
      material: 'Multipleks 18mm & Rangka Kaki Besi Hollow 4x4 Powder Coating',
      hardware: 'Grommet Kabel Aluminium & Rel Laci Soft-Closing',
      finishing: 'HPL Taco Solid Charcoal & Dark Walnut',
      quantity: 1,
      notes: 'Termasuk laci berkas dokumen terkunci sentral.'
    },
    totalAmount: 6200000,
    value: 6200000,
    dpAmount: 3100000,
    paidAmount: 0,
    remainingAmount: 6200000,
    paymentStatus: 'belum_bayar',
    status: 'waiting_dp',
    progress: 15,
    deadline: '2026-10-20',
    startDate: '2026-09-16',
    lastUpdate: '2026-09-21 11:30',
    notes: [
      {
        id: 'NOT-05',
        date: '2026-09-21 11:30',
        author: 'Admin Debufa',
        text: 'Menunggu transfer DP untuk pemotongan bahan.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-09',
        status: 'lead',
        date: '2026-09-16 10:00',
        author: 'Admin Debufa',
        note: 'Permintaan custom meja kerja ruang kerja Menteng',
        progress: 10
      },
      {
        id: 'SH-10',
        status: 'waiting_dp',
        date: '2026-09-21 11:30',
        author: 'Admin Debufa',
        note: 'Penawaran disetujui, menunggu DP 50%',
        progress: 15
      }
    ]
  },
  {
    id: 'DBF-00124',
    customerId: 'CST-003',
    customerName: 'Bpk. Ir. Hendra Gunawan',
    customerPhone: '6281908765432',
    customerAddress: 'Jl. Kasuari VII Blok HB No. 12, Bintaro Sektor 9, Tangerang Selatan',
    projectName: 'Interior Cafe & Bar Counter',
    furnitureType: 'Interior Cafe',
    specifications: {
      furnitureType: 'Interior Cafe',
      dimensions: { length: 5.0, height: 1.1, depth: 0.8, unit: 'meter lari' },
      material: 'Multipleks 18mm & Top Table Solid Surface Carara White',
      hardware: 'Engsel Heavy Duty Blum + Ambalan Gantung Besi',
      finishing: 'Cat Duco Matte Forest Green & Aksen Kayu Jati Belanda',
      quantity: 1,
      notes: 'Instalasi jalur pipa espresso & kabel kelistrikan tersembunyi.'
    },
    totalAmount: 45000000,
    value: 45000000,
    dpAmount: 22500000,
    paidAmount: 22500000,
    remainingAmount: 22500000,
    paymentStatus: 'dp',
    status: 'production',
    progress: 45,
    deadline: '2026-10-10',
    startDate: '2026-09-08',
    lastUpdate: '2026-09-21 17:00',
    notes: [
      {
        id: 'NOT-06',
        date: '2026-09-21 17:00',
        author: 'Owner Debufa',
        text: 'Rangka bodi bar counter dan ambalan display sedang dirakit di workshop.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-11',
        status: 'lead',
        date: '2026-09-08 09:00',
        author: 'Admin Debufa',
        note: 'Meeting desain cafe Bintaro',
        progress: 10
      },
      {
        id: 'SH-12',
        status: 'waiting_dp',
        date: '2026-09-12 11:00',
        author: 'Admin Debufa',
        note: 'Desain approved, invoice DP terbit',
        progress: 25
      },
      {
        id: 'SH-13',
        status: 'production',
        date: '2026-09-15 15:00',
        author: 'Owner Debufa',
        note: 'DP Rp22.500.000 masuk. Perakitan rangka',
        progress: 45
      }
    ]
  },
  {
    id: 'DBF-00126',
    customerId: 'CST-005',
    customerName: 'Ibu Rina Kusuma',
    customerPhone: '628119876543',
    customerAddress: 'Jl. Bukit Hijau Blok PA No. 14, Pondok Indah, Jakarta Selatan',
    projectName: 'Rak Display Buku & Partisi Ruang',
    furnitureType: 'Rak Display',
    specifications: {
      furnitureType: 'Rak Display',
      dimensions: { length: 3.6, height: 2.8, depth: 0.35, unit: 'meter lari' },
      material: 'Multipleks 18mm & Ambalan Kaca 8mm Bevel',
      hardware: 'Bracket Ambalan Concealed & Lampu LED Profile',
      finishing: 'HPL Taco Warm Oak Natural',
      quantity: 1,
      notes: 'Partisi dua muka antara ruang tamu dan ruang keluarga.'
    },
    totalAmount: 12750000,
    value: 12750000,
    dpAmount: 6375000,
    paidAmount: 10000000,
    remainingAmount: 2750000,
    paymentStatus: 'sebagian',
    status: 'finishing',
    progress: 80,
    deadline: '2026-10-05',
    startDate: '2026-08-25',
    lastUpdate: '2026-09-22 09:00',
    notes: [
      {
        id: 'NOT-07',
        date: '2026-09-22 09:00',
        author: 'Mas Joko (Finisher)',
        text: 'Laminasi HPL serat kayu oak dan pemasangan lis edging PVC tuntas.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-14',
        status: 'lead',
        date: '2026-08-25 10:00',
        author: 'Admin Debufa',
        note: 'Order partisi minimalis Pondok Indah',
        progress: 10
      },
      {
        id: 'SH-15',
        status: 'production',
        date: '2026-09-02 11:00',
        author: 'Owner Debufa',
        note: 'DP masuk, rangka dirakit',
        progress: 50
      },
      {
        id: 'SH-16',
        status: 'finishing',
        date: '2026-09-22 09:00',
        author: 'Mas Joko (Finisher)',
        note: 'Laminasi HPL serat kayu oak dan pemasangan lis edging PVC tuntas.',
        progress: 80
      }
    ]
  },
  {
    id: 'DBF-00127',
    customerId: 'CST-002',
    customerName: 'Ibu Sari Rahmawati',
    customerPhone: '6281345678901',
    customerAddress: 'Cluster Greenwich Park Blok C No. 8, BSD City',
    projectName: 'Walk-in Closet & Meja Rias Vanity',
    furnitureType: 'Lemari Pakaian',
    specifications: {
      furnitureType: 'Lemari Pakaian',
      dimensions: { length: 4.8, height: 3.0, depth: 0.6, unit: 'meter lari' },
      material: 'Multipleks 18mm & Cermin Bevel LED Touch',
      hardware: 'Rel Laci Blum Tip-On & Engsel Soft-Close Hafele',
      finishing: 'Cat Duco Cashmere White Doff & Brass Handle',
      quantity: 1,
      notes: 'Meja rias built-in dengan lampu vanity daylight 4000K.'
    },
    totalAmount: 32000000,
    value: 32000000,
    dpAmount: 16000000,
    paidAmount: 32000000,
    remainingAmount: 0,
    paymentStatus: 'lunas',
    status: 'delivery',
    progress: 95,
    deadline: '2026-09-28',
    startDate: '2026-08-10',
    lastUpdate: '2026-09-22 08:30',
    notes: [
      {
        id: 'NOT-08',
        date: '2026-09-22 08:30',
        author: 'Owner Debufa',
        text: 'Furniture telah dipacking kardus pelindung dan siap dimuat ke armada pickup.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-17',
        status: 'production',
        date: '2026-08-20 14:00',
        author: 'Owner Debufa',
        note: 'DP lunas, perakitan lemari walk-in',
        progress: 50
      },
      {
        id: 'SH-18',
        status: 'finishing',
        date: '2026-09-10 11:00',
        author: 'Mas Joko (Finisher)',
        note: 'Pengecatan duco cashmere selesai',
        progress: 85
      },
      {
        id: 'SH-19',
        status: 'delivery',
        date: '2026-09-22 08:30',
        author: 'Owner Debufa',
        note: 'Furniture telah dipacking kardus pelindung dan siap dimuat ke armada pickup.',
        progress: 95
      }
    ]
  },
  {
    id: 'DBF-00128',
    customerId: 'CST-001',
    customerName: 'Budi Santoso',
    customerPhone: '6281289123456',
    customerAddress: 'Jl. Senopati No. 28, Kebayoran Baru, Jakarta Selatan',
    projectName: 'Dipan King Size & 2 Meja Nakas',
    furnitureType: 'Lemari Pakaian',
    specifications: {
      furnitureType: 'Lemari Pakaian',
      dimensions: { length: 2.1, height: 1.1, depth: 1.9, unit: 'unit' },
      material: 'Rangka Multipleks Solid 18mm & Kain Velvet Vienna Grey',
      hardware: 'Hydraulic Bed Lift Storage System',
      finishing: 'HPL Taco Warm Oak & Headboard Busa Rebonded D70',
      quantity: 1,
      notes: 'Storage bawah ranjang dengan sistem hidrolik gas spring.'
    },
    totalAmount: 14000000,
    value: 14000000,
    dpAmount: 7000000,
    paidAmount: 14000000,
    remainingAmount: 0,
    paymentStatus: 'lunas',
    status: 'completed',
    progress: 100,
    deadline: '2026-09-18',
    startDate: '2026-08-15',
    lastUpdate: '2026-09-18 16:30',
    notes: [
      {
        id: 'NOT-09',
        date: '2026-09-18 16:30',
        author: 'Owner Debufa',
        text: 'Pemasangan di lokasi tuntas 100%, serah terima BAST selesai.'
      }
    ],
    files: [],
    statusHistory: [
      {
        id: 'SH-20',
        status: 'production',
        date: '2026-08-25 10:00',
        author: 'Owner Debufa',
        note: 'DP masuk, perakitan dipan',
        progress: 50
      },
      {
        id: 'SH-21',
        status: 'delivery',
        date: '2026-09-15 11:00',
        author: 'Owner Debufa',
        note: 'Pengiriman dan perakitan di rumah Budi Santoso',
        progress: 95
      },
      {
        id: 'SH-22',
        status: 'completed',
        date: '2026-09-18 16:30',
        author: 'Owner Debufa',
        note: 'Pemasangan di lokasi tuntas 100%, serah terima BAST selesai.',
        progress: 100
      }
    ]
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'Q-DBF-2026-001',
    projectId: 'DBF-2026-001',
    customerId: 'CST-001',
    customerName: 'Ibu Rina Sasmita',
    customerPhone: '6281289123456',
    customerAddress: 'Jl. Bukit Hijau No. 14, Pondok Indah, Jakarta Selatan',
    items: [
      {
        id: 'QI-01',
        furnitureType: 'Kitchen Set Kabinet Bawah',
        description: 'Kabinet bawah sink & kompor tanam, multipleks 18mm anti-rayap',
        dimensions: 'P: 3.2m x T: 0.85m x L: 0.6m',
        material: 'Multipleks 18mm Palm Grade A',
        hardware: 'Rel Tandem Blum Slow-Motion',
        finishing: 'HPL Taco Woodgrain TH-882G',
        quantity: 1,
        unitPrice: 14500000,
        total: 14500000
      },
      {
        id: 'QI-02',
        furnitureType: 'Kitchen Set Kabinet Atas',
        description: 'Kabinet atas gantung full plafon dengan ambalan piring hidrolik',
        dimensions: 'P: 3.2m x T: 0.9m x L: 0.35m',
        material: 'Multipleks 18mm Palm Grade A',
        hardware: 'Engsel Soft-Closing Hafele + Gas Spring',
        finishing: 'HPL Taco Solid Off-White Matte',
        quantity: 1,
        unitPrice: 12000000,
        total: 12000000
      },
      {
        id: 'QI-03',
        furnitureType: 'Kitchen Island Meja Bar',
        description: 'Island cabinet dengan laci bumbu & power pop-up outlet',
        dimensions: 'P: 2.2m x T: 0.88m x L: 0.8m',
        material: 'Multipleks 18mm Palm Grade A',
        hardware: 'Rel Tandem Tip-On Push to Open',
        finishing: 'HPL Taco Woodgrain TH-882G',
        quantity: 1,
        unitPrice: 12000000,
        total: 12000000
      }
    ],
    subtotal: 38500000,
    discount: 0,
    total: 38500000,
    dpPercent: 50,
    dpAmount: 19250000,
    remainingAmount: 19250000,
    status: 'approved',
    date: '2026-02-11',
    validUntil: '2026-02-25',
    notes: 'Harga sudah termasuk survey, pengiriman, perakitan, dan instalasi fitting listrik LED.'
  },
  {
    id: 'Q-DBF-2026-002',
    projectId: 'DBF-2026-002',
    customerId: 'CST-002',
    customerName: 'Bpk. Ir. Hendra Gunawan',
    customerPhone: '6281345678901',
    customerAddress: 'Cluster Greenwich Park, BSD City',
    items: [
      {
        id: 'QI-04',
        furnitureType: 'Wardrobe Full Plafon',
        description: 'Lemari pakaian 4 pintu sliding kaca bronze + aksesoris perhiasan',
        dimensions: 'P: 3.8m x T: 3.0m x L: 0.6m',
        material: 'Multipleks 18mm & Kaca Tempered Bronze',
        hardware: 'Rel Sliding Heavy Duty + LED Sensor',
        finishing: 'HPL Charcoal Matte & Frame Aluminium Anodized',
        quantity: 1,
        unitPrice: 29500000,
        total: 29500000
      }
    ],
    subtotal: 29500000,
    discount: 0,
    total: 29500000,
    dpPercent: 50,
    dpAmount: 14750000,
    remainingAmount: 14750000,
    status: 'approved',
    date: '2026-02-26',
    validUntil: '2026-03-12',
    notes: 'Garansi hardware & rel 1 tahun dari Debufa Works.'
  },
  {
    id: 'Q-DBF-2026-005',
    projectId: 'DBF-2026-005',
    customerId: 'CST-005',
    customerName: 'Bpk. Denny Wicaksono',
    customerPhone: '628119876543',
    customerAddress: 'Jl. Kemang Timur Raya No. 42B, Jakarta Selatan',
    items: [
      {
        id: 'QI-05',
        furnitureType: 'Bar Counter Custom Cafe',
        description: 'Counter kasir & espresso bar dengan top table solid surface Carara White',
        dimensions: 'P: 4.2m x T: 1.1m x L: 0.8m',
        material: 'Multipleks 18mm + Solid Surface Top',
        hardware: 'Blum Heavy Duty Hinges',
        finishing: 'Cat Duco Matte Sage Green',
        quantity: 1,
        unitPrice: 45000000,
        total: 45000000
      }
    ],
    subtotal: 45000000,
    discount: 1000000,
    total: 44000000,
    dpPercent: 50,
    dpAmount: 22000000,
    remainingAmount: 22000000,
    status: 'sent',
    date: '2026-03-19',
    validUntil: '2026-04-02',
    notes: 'Termasuk lubang pipa kabel, plumbing sink kecil, dan finishing duco tahan air.'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-001',
    projectId: 'DBF-00125',
    customerName: 'Budi Santoso',
    date: '2026-09-05',
    type: 'dp',
    amount: 12250000,
    method: 'Transfer BCA',
    notes: 'DP 50% Kitchen Set Minimalis Modern (Bpk. Budi Santoso)',
    status: 'verified'
  },
  {
    id: 'PAY-002',
    projectId: 'DBF-00124',
    customerName: 'Bpk. Ir. Hendra Gunawan',
    date: '2026-09-15',
    type: 'dp',
    amount: 22500000,
    method: 'Transfer Mandiri',
    notes: 'DP 50% Interior Cafe & Bar Counter Bintaro',
    status: 'verified'
  },
  {
    id: 'PAY-003',
    projectId: 'DBF-00126',
    customerName: 'Ibu Rina Kusuma',
    date: '2026-09-02',
    type: 'dp',
    amount: 6375000,
    method: 'Transfer BCA',
    notes: 'DP 50% Rak Display Buku & Partisi Ruang',
    status: 'verified'
  },
  {
    id: 'PAY-004',
    projectId: 'DBF-00126',
    customerName: 'Ibu Rina Kusuma',
    date: '2026-09-20',
    type: 'termin',
    amount: 3625000,
    method: 'Transfer BCA',
    notes: 'Termin ke-2 perakitan workshop & finishing',
    status: 'verified'
  },
  {
    id: 'PAY-005',
    projectId: 'DBF-00127',
    customerName: 'Ibu Sari Rahmawati',
    date: '2026-08-20',
    type: 'dp',
    amount: 16000000,
    method: 'Transfer BCA',
    notes: 'DP 50% Walk-in Closet & Meja Rias BSD',
    status: 'verified'
  },
  {
    id: 'PAY-006',
    projectId: 'DBF-00127',
    customerName: 'Ibu Sari Rahmawati',
    date: '2026-09-22',
    type: 'pelunasan',
    amount: 16000000,
    method: 'Transfer BCA',
    notes: 'Pelunasan sisa 50% sebelum pengiriman armada delivery',
    status: 'verified'
  },
  {
    id: 'PAY-007',
    projectId: 'DBF-00128',
    customerName: 'Budi Santoso',
    date: '2026-08-25',
    type: 'dp',
    amount: 7000000,
    method: 'Transfer BCA',
    notes: 'DP 50% Dipan King Size & 2 Meja Nakas',
    status: 'verified'
  },
  {
    id: 'PAY-008',
    projectId: 'DBF-00128',
    customerName: 'Budi Santoso',
    date: '2026-09-18',
    type: 'pelunasan',
    amount: 7000000,
    method: 'Transfer BCA',
    notes: 'Pelunasan 100% setelah serah terima BAST',
    status: 'verified'
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'TKG-01',
    name: 'Pak Slamet Riyadi',
    phone: '628123456001',
    role: 'Tukang Kayu Utama',
    status: 'aktif',
    dailyRate: 180000,
    activeProject: 'DBF-2026-001'
  },
  {
    id: 'TKG-02',
    name: 'Mas Joko Susilo',
    phone: '628123456002',
    role: 'Finisher / Painter',
    status: 'aktif',
    dailyRate: 175000,
    activeProject: 'DBF-2026-001'
  },
  {
    id: 'TKG-03',
    name: 'Pak Bambang Sutrisno',
    phone: '628123456003',
    role: 'Tukang Kayu Utama',
    status: 'aktif',
    dailyRate: 180000,
    activeProject: 'DBF-2026-002'
  },
  {
    id: 'TKG-04',
    name: 'Mas Rudi Hermawan',
    phone: '628123456004',
    role: 'Asisten Tukang',
    status: 'aktif',
    dailyRate: 130000,
    activeProject: 'DBF-2026-002'
  },
  {
    id: 'TKG-05',
    name: 'Pak Dedi Mulyadi',
    phone: '628123456005',
    role: 'Aplikator Lapangan',
    status: 'lapangan',
    dailyRate: 170000,
    activeProject: 'DBF-2026-003'
  },
  {
    id: 'TKG-06',
    name: 'Mas Agus Purnomo',
    phone: '628123456006',
    role: 'Asisten Tukang',
    status: 'libur',
    dailyRate: 130000
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'ATT-2026-001',
    workerId: 'TKG-01',
    workerName: 'Pak Slamet Riyadi',
    date: '2026-03-22',
    checkIn: '07:55',
    checkOut: '17:10',
    status: 'hadir',
    locationType: 'bengkel',
    locationName: 'Workshop Bengkel Debufa',
    notes: 'Fokus pengerjaan edging & engsel DBF-2026-001'
  },
  {
    id: 'ATT-2026-002',
    workerId: 'TKG-02',
    workerName: 'Mas Joko Susilo',
    date: '2026-03-22',
    checkIn: '08:02',
    checkOut: '17:05',
    status: 'hadir',
    locationType: 'bengkel',
    locationName: 'Workshop Bengkel Debufa',
    notes: 'Finishing HPL & perapian lis aluminium'
  },
  {
    id: 'ATT-2026-003',
    workerId: 'TKG-03',
    workerName: 'Pak Bambang Sutrisno',
    date: '2026-03-22',
    checkIn: '07:45',
    checkOut: '19:30',
    status: 'lembur',
    locationType: 'bengkel',
    locationName: 'Workshop Bengkel Debufa',
    notes: 'Lembur 2.5 jam potong multipleks Wardrobe BSD'
  },
  {
    id: 'ATT-2026-004',
    workerId: 'TKG-04',
    workerName: 'Mas Rudi Hermawan',
    date: '2026-03-22',
    checkIn: '08:10',
    checkOut: '17:00',
    status: 'hadir',
    locationType: 'bengkel',
    locationName: 'Workshop Bengkel Debufa',
    notes: 'Amplas permukaan & bantuin Pak Bambang'
  },
  {
    id: 'ATT-2026-005',
    workerId: 'TKG-05',
    workerName: 'Pak Dedi Mulyadi',
    date: '2026-03-22',
    checkIn: '08:30',
    checkOut: '17:00',
    status: 'hadir',
    locationType: 'lapangan',
    locationName: 'Proyek DBF-2026-001 (Rumah Bpk. Hendra - BSD City)',
    gpsCoordinates: {
      latitude: -6.3015,
      longitude: 106.6522,
      accuracy: 12
    },
    photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80',
    notes: 'Langsung fitting kabinet gantung di lokasi konsumen'
  },
  {
    id: 'ATT-2026-006',
    workerId: 'TKG-06',
    workerName: 'Mas Agus Purnomo',
    date: '2026-03-22',
    status: 'izin',
    notes: 'Izin urusan keluarga di kampung'
  }
];

export const INITIAL_TRANSACTIONS: WorkerTransaction[] = [
  {
    id: 'TRX-001',
    workerId: 'TKG-01',
    workerName: 'Pak Slamet Riyadi',
    type: 'kasbon',
    amount: 300000,
    date: '2026-03-10',
    notes: 'Keperluan biaya sekolah anak (potong saat gajian Sabtu)',
    status: 'pending'
  },
  {
    id: 'TRX-002',
    workerId: 'TKG-03',
    workerName: 'Pak Bambang Sutrisno',
    type: 'bonus',
    amount: 250000,
    date: '2026-03-15',
    notes: 'Bonus pengerjaan cepat dan presisi BAST Dipan King',
    status: 'settled'
  },
  {
    id: 'TRX-003',
    workerId: 'TKG-02',
    workerName: 'Mas Joko Susilo',
    type: 'kasbon',
    amount: 200000,
    date: '2026-03-18',
    notes: 'Beli obat dan vitamin keluarga',
    status: 'pending'
  },
  {
    id: 'TRX-004',
    workerId: 'TKG-05',
    workerName: 'Pak Dedi Mulyadi',
    type: 'bonus',
    amount: 150000,
    date: '2026-03-20',
    notes: 'Bonus lembur QC instalasi lapangan',
    status: 'settled'
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: 'ACT-01',
    time: 'Hari ini, 14:30',
    title: 'Pelunasan Diterima',
    description: 'Ibu Maya Anggraini melunasi Rp 8.400.000 untuk Backdrop TV (DBF-2026-003).',
    type: 'payment'
  },
  {
    id: 'ACT-02',
    time: 'Hari ini, 11:15',
    title: 'Update Progress Finishing',
    description:
      'Project Kitchen Set Ibu Rina (DBF-2026-001) mencapai 75% pengerjaan edging & fitting.',
    type: 'progress'
  },
  {
    id: 'ACT-03',
    time: 'Kemarin, 16:45',
    title: 'Quotation Terkirim',
    description: 'Penawaran Q-DBF-2026-005 dikirimkan ke Bpk. Denny Wicaksono (Bar Counter Cafe).',
    type: 'quotation'
  },
  {
    id: 'ACT-04',
    time: '20 Mar 2026',
    title: 'Lead Baru Masuk',
    description: 'Ibu Kartika Sari mengajukan konsultasi Walk-in Closet & Vanity Menteng.',
    type: 'lead'
  },
  {
    id: 'ACT-05',
    time: '18 Mar 2026',
    title: 'Pembayaran Termin',
    description: 'Termin ke-2 diterima Rp 10.750.000 untuk Kitchen Set DBF-2026-001 via BCA.',
    type: 'payment'
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-2026-001',
    customer: {
      name: 'Ibu Sarah Permata',
      phone: '6281234567890',
      email: 'sarah.permata@gmail.com',
      address: 'Cluster Foresta, BSD City, Tangerang'
    },
    source: 'Customer Estimator',
    furniture: 'Kitchen Set',
    specification: {
      dimensions: { length: 450, height: 260, depth: 60, unit: 'cm' },
      material: 'Multiplek / Plywood 18mm',
      hardware: 'Engsel & Rel Soft Closing Standard',
      finishing: 'HPL Solid / Woodgrain Matte',
      quantity: 1,
      notes: 'Ingin nuansa Scandinavian dengan lampu LED bawah kabinet gantung.'
    },
    estimated_price: 24500000,
    status: 'NEW',
    created_at: '2026-03-22 09:15'
  },
  {
    id: 'INQ-2026-002',
    customer: {
      name: 'Bpk. Dimas Pratama',
      phone: '6281809876543',
      email: 'dimas.pratama@gmail.com',
      address: 'Jl. Radio Dalam No. 45, Kebayoran Baru, Jakarta Selatan'
    },
    source: 'Customer Estimator',
    furniture: 'Wardrobe / Lemari Pakaian',
    specification: {
      dimensions: { length: 320, height: 290, depth: 60, unit: 'cm' },
      material: 'Multiplek / Plywood 18mm',
      hardware: 'Engsel & Rel Premium (Hafele / Blum)',
      finishing: 'HPL Motif Marmer / Glossy Premium',
      quantity: 1,
      notes: 'Pintu sliding full cermin bevel dan laci aksesoris perhiasan.'
    },
    estimated_price: 28200000,
    status: 'CONTACTED',
    created_at: '2026-03-21 14:20'
  },
  {
    id: 'INQ-2026-003',
    customer: {
      name: 'Ibu Dian Safitri',
      phone: '6285712344321',
      email: 'dian.safitri@corporate.co.id',
      address: 'Apartemen Casa Domaine Tower 1, Karet Tengsin, Jakarta Pusat'
    },
    source: 'Customer Estimator',
    furniture: 'Backdrop TV & Panel',
    specification: {
      dimensions: { length: 300, height: 270, depth: 40, unit: 'cm' },
      material: 'Multiplek / Plywood 18mm',
      hardware: 'Push to Open (Tanpa Handle)',
      finishing: 'Cat Duco Polyurethane (PU)',
      quantity: 1,
      notes: 'Aksen kisi-kisi kayu di sisi kanan dan ambalan melayang LED warm white.'
    },
    estimated_price: 18900000,
    status: 'QUOTATION',
    created_at: '2026-03-19 11:30'
  }
];
