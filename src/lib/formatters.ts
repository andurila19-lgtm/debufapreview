import { ProjectStatus, ProjectPaymentStatus, InquiryStatus } from '@/types/debufa';

export function formatRupiah(value: number): string {
  const num = Math.round(value || 0);
  return `Rp${num.toLocaleString('id-ID')}`;
}

export function formatCompactRupiah(value: number): string {
  const val = value || 0;
  if (val >= 1000000000) {
    return `Rp ${(val / 1000000000).toFixed(1)} M`;
  }
  if (val >= 1000000) {
    return `Rp ${(val / 1000000).toFixed(1)} Jt`;
  }
  return formatRupiah(val);
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; badgeClass: string; bgSoft: string; border: string; stepIndex: number }
> = {
  lead: {
    label: 'Menunggu DP',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200',
    bgSoft: 'bg-zinc-50 dark:bg-zinc-900/40',
    border: 'border-zinc-300',
    stepIndex: 0
  },
  survey: {
    label: 'Menunggu DP',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300',
    bgSoft: 'bg-sky-50/50 dark:bg-sky-950/20',
    border: 'border-sky-300',
    stepIndex: 0
  },
  quotation: {
    label: 'Menunggu DP',
    badgeClass:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300',
    bgSoft: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    border: 'border-indigo-300',
    stepIndex: 0
  },
  waiting_dp: {
    label: 'Menunggu DP',
    badgeClass:
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
    bgSoft: 'bg-amber-50/50 dark:bg-amber-950/20',
    border: 'border-amber-300',
    stepIndex: 0
  },
  production: {
    label: 'Produksi',
    badgeClass:
      'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300',
    bgSoft: 'bg-orange-50/50 dark:bg-orange-950/20',
    border: 'border-orange-300',
    stepIndex: 1
  },
  produksi: {
    label: 'Produksi',
    badgeClass:
      'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300',
    bgSoft: 'bg-orange-50/50 dark:bg-orange-950/20',
    border: 'border-orange-300',
    stepIndex: 1
  },
  finishing: {
    label: 'Finishing',
    badgeClass:
      'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300',
    bgSoft: 'bg-purple-50/50 dark:bg-purple-950/20',
    border: 'border-purple-300',
    stepIndex: 2
  },
  delivery: {
    label: 'Siap Dikirim',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
    bgSoft: 'bg-blue-50/50 dark:bg-blue-950/20',
    border: 'border-blue-300',
    stepIndex: 3
  },
  completed: {
    label: 'Selesai',
    badgeClass:
      'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    bgSoft: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    border: 'border-emerald-300',
    stepIndex: 4
  },
  selesai: {
    label: 'Selesai',
    badgeClass:
      'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    bgSoft: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    border: 'border-emerald-300',
    stepIndex: 4
  }
};

export const ORDERED_STATUSES: ProjectStatus[] = [
  'waiting_dp',
  'production',
  'finishing',
  'delivery',
  'completed'
];

export const PAYMENT_STATUS_CONFIG: Record<
  ProjectPaymentStatus,
  { label: string; badgeClass: string }
> = {
  belum_bayar: {
    label: 'Belum Bayar',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
  },
  dp: {
    label: 'DP Diterima',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
  },
  sebagian: {
    label: 'Sebagian',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
  },
  lunas: {
    label: 'Lunas',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
  }
};

export const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, { label: string; badgeClass: string }> = {
  NEW: {
    label: 'Baru Masuk',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
  },
  CONTACTED: {
    label: 'Sudah Dihubungi',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
  },
  SURVEY: {
    label: 'Survey Lokasi',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
  },
  QUOTATION: {
    label: 'Quotation Dibuat',
    badgeClass:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
  },
  CONVERTED: {
    label: 'Menjadi Proyek',
    badgeClass:
      'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
  },
  CANCELLED: {
    label: 'Batal',
    badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400'
  }
};
