export type ProjectStatus =
  | 'lead'
  | 'survey'
  | 'quotation'
  | 'waiting_dp'
  | 'production'
  | 'finishing'
  | 'delivery'
  | 'completed'
  // Aliases for compatibility
  | 'produksi'
  | 'selesai';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export type FurnitureType =
  | 'Kitchen Set'
  | 'Wardrobe / Lemari Pakaian'
  | 'Lemari Pakaian'
  | 'Backdrop TV & Panel'
  | 'TV Cabinet'
  | 'Meja Kerja & Rak Buku'
  | 'Meja Kerja'
  | 'Credenza / Buffet'
  | 'Dipan & Bedside'
  | 'Partisi Kisi-Kisi'
  | 'Vanity / Meja Rias'
  | 'Interior Cafe'
  | 'Rak Display'
  | 'Custom Furniture'
  | (string & {});

export interface ProjectSpecification {
  furnitureType: FurnitureType;
  dimensions: {
    length: number; // cm atau meter lari
    height: number;
    depth: number;
    unit: 'cm' | 'meter lari' | 'unit';
  };
  material: string;
  hardware: string;
  finishing: string;
  quantity: number;
  notes?: string;
}

export interface InternalNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export type ProjectNote = InternalNote;

export type ProjectFileCategory = 'Design' | 'Reference' | 'Progress Photo' | 'Quotation' | 'Other';

export interface ProjectFile {
  id: string;
  name: string;
  category: ProjectFileCategory;
  url: string;
  date: string;
  size?: string;
  author?: string;
  caption?: string;
  type?: 'foto_progress' | 'desain_3d' | 'dokumen'; // backward compat
}

export interface ProjectStatusHistory {
  id: string;
  status: ProjectStatus;
  date: string;
  author: string; // e.g. "Admin", "Owner"
  note: string;
  progress: number; // 0 - 100
  photoUrl?: string;
}

export type StatusHistoryItem = ProjectStatusHistory;

export type ProjectPaymentStatus = 'belum_bayar' | 'dp' | 'sebagian' | 'lunas';

export type PaymentType = 'dp' | 'termin' | 'cicilan' | 'pelunasan';
export type PaymentMethod =
  | 'Transfer BCA'
  | 'Transfer Mandiri'
  | 'Transfer BRI'
  | 'Transfer BNI / BRI'
  | 'Cash / Tunai'
  | 'Tunai'
  | string;

export interface Payment {
  id: string;
  projectId: string;
  customerName: string;
  date: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  notes?: string;
  status: 'verified' | 'pending';
}

export interface Project {
  id: string; // e.g. "DBF-2026-001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  projectName: string;
  furnitureType: FurnitureType;
  specifications: ProjectSpecification;
  totalAmount: number; // Total nilai kontrak (Rp)
  value: number; // Total nilai kontrak (Rp) - backward compat alias
  dpAmount: number; // Nilai target DP (Rp)
  paidAmount: number; // Total yang sudah dibayarkan (Rp)
  remainingAmount: number; // totalAmount - paidAmount
  paymentStatus: ProjectPaymentStatus;
  status: ProjectStatus;
  progress: number; // 0 - 100%
  deadline: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  lastUpdate: string; // Format: "24 Sep 2026 14:30"
  notes: InternalNote[];
  files: ProjectFile[];
  statusHistory: ProjectStatusHistory[];
}

export interface QuotationItem {
  id: string;
  furnitureType: string;
  description: string;
  dimensions: string;
  material: string;
  hardware: string;
  finishing: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string; // e.g. "Q-DBF-2026-001"
  projectId?: string;
  inquiryId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  total: number;
  dpPercent: number; // default 50
  dpAmount: number;
  remainingAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
  date: string;
  validUntil: string;
  notes?: string;
}

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'SURVEY'
  | 'QUOTATION'
  | 'CONVERTED'
  | 'CANCELLED';

export interface Inquiry {
  id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  source: string; // 'Customer Estimator' | 'WhatsApp' | 'Instagram' | 'Walk-in'
  furniture: FurnitureType;
  specification: {
    dimensions: {
      length: number; // panjang / lebar (cm)
      height: number; // tinggi (cm)
      depth: number; // kedalaman (cm)
      unit: string;
    };
    material: string;
    hardware: string;
    finishing: string;
    quantity: number;
    notes?: string;
  };
  estimated_price: number;
  status: InquiryStatus;
  created_at: string;
  quotationId?: string;
}

export interface PriceConfigItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  active: boolean;
}

export interface PriceConfiguration {
  materials: PriceConfigItem[];
  hardware: PriceConfigItem[];
  finishing: PriceConfigItem[];
  furnitureTypes: PriceConfigItem[];
}

export type WorkerRole =
  | 'Tukang Kayu Utama'
  | 'Asisten Tukang'
  | 'Finisher / Painter'
  | 'Aplikator Lapangan';

export type WorkerStatus = 'aktif' | 'libur' | 'lapangan' | 'active' | 'inactive';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  role: WorkerRole;
  status: WorkerStatus;
  dailyRate?: number; // Rp / hari
  dailyWage?: number;
  activeProject?: string;
  skillLevel?: string;
  joinedDate?: string;
}

export type AttendanceStatus =
  | 'hadir'
  | 'setengah_hari'
  | 'izin'
  | 'lembur'
  | 'alpha'
  | 'present'
  | 'absent';

export interface Attendance {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
  locationType?: 'bengkel' | 'lapangan';
  locationName?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  photoUrl?: string;
}

export type WorkerTransactionType = 'kasbon' | 'bonus';
export type WorkerTransactionStatus = 'pending' | 'settled' | 'approved';

export interface WorkerTransaction {
  id: string;
  workerId: string;
  workerName: string;
  type: WorkerTransactionType;
  amount: number;
  date: string;
  notes?: string;
  status?: WorkerTransactionStatus;
  settledDate?: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'WORKER';

export interface RolePermissions {
  canViewFinancials: boolean;
  canEditSettings: boolean;
  canManageProjects: boolean;
  canManageQuotations: boolean;
  canManagePayments: boolean;
  canManageWorkers: boolean;
  canUpdateAssignedProgressOnly: boolean;
}
