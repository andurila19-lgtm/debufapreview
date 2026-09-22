'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Customer,
  Project,
  ProjectStatus,
  Quotation,
  Payment,
  Worker,
  Attendance,
  WorkerTransaction,
  WorkerTransactionStatus,
  Inquiry,
  InquiryStatus,
  PriceConfiguration,
  PriceConfigItem,
  ProjectFile,
  InternalNote,
  UserRole,
  ProjectPaymentStatus,
  FurnitureType
} from '@/types/debufa';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PROJECTS,
  INITIAL_QUOTATIONS,
  INITIAL_PAYMENTS,
  INITIAL_WORKERS,
  INITIAL_ATTENDANCE,
  INITIAL_TRANSACTIONS,
  INITIAL_INQUIRIES,
  INITIAL_PRICE_CONFIG
} from './debufa-data';

import { User, DEMO_USERS } from '@/types/auth';
import { getSession, saveSession, clearSession, authenticateDemo } from '@/lib/auth/session';

interface UpdateProgressParams {
  status: ProjectStatus;
  progress: number;
  note: string;
  date: string;
  photoUrl?: string;
  actor: string;
}

interface DebufaStoreContextType {
  customers: Customer[];
  projects: Project[];
  quotations: Quotation[];
  payments: Payment[];
  workers: Worker[];
  attendance: Attendance[];
  transactions: WorkerTransaction[];
  inquiries: Inquiry[];
  priceConfig: PriceConfiguration;
  currentRole: UserRole;
  currentUser: User;
  setCurrentRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;

  // Actions
  updateProjectProgress: (projectId: string, update: UpdateProgressParams) => void;
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus, note?: string) => void;
  addInternalNote: (projectId: string, author: string, text: string) => void;
  addProjectNote: (projectId: string, author: string, text: string) => void; // alias
  addProjectFile: (projectId: string, file: Omit<ProjectFile, 'id' | 'date'>) => void;
  addProject: (
    project: Omit<
      Project,
      'id' | 'notes' | 'files' | 'statusHistory' | 'remainingAmount' | 'paymentStatus'
    >
  ) => Project;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addQuotation: (quotation: Omit<Quotation, 'id' | 'date'>) => Quotation;
  addPayment: (payment: Omit<Payment, 'id'>) => Payment;
  convertQuotationToProject: (quotationId: string) => Project;
  createInquiry: (inquiry: Omit<Inquiry, 'id' | 'created_at'>) => Inquiry;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => void;
  convertInquiryToQuotation: (inquiryId: string) => Quotation;
  updatePriceConfigItem: (category: keyof PriceConfiguration, item: PriceConfigItem) => void;
  addPriceConfigItem: (
    category: keyof PriceConfiguration,
    item: Omit<PriceConfigItem, 'id'>
  ) => PriceConfigItem;
  updateAttendance: (
    attendanceId: string,
    updates: Partial<Pick<Attendance, 'status' | 'checkIn' | 'checkOut' | 'notes'>>
  ) => void;
  addAttendanceRecord: (record: Attendance) => void;
  addTransaction: (transaction: Omit<WorkerTransaction, 'id' | 'date'>) => WorkerTransaction;
  updateWorkerTransactionStatus: (transactionId: string, status: WorkerTransactionStatus) => void;
  addWorker: (worker: Worker) => void;
  updateWorker: (worker: Worker) => void;
  resetToDefault: () => void;
}

const DebufaStoreContext = createContext<DebufaStoreContextType | null>(null);

const STORAGE_KEY_PREFIX = 'debufa_store_v3_final_';

export function DebufaStoreProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [transactions, setTransactions] = useState<WorkerTransaction[]>(INITIAL_TRANSACTIONS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [priceConfig, setPriceConfig] = useState<PriceConfiguration>(INITIAL_PRICE_CONFIG);
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.OWNER);
  const [hydrated, setHydrated] = useState(false);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const session = authenticateDemo(role);
    setCurrentUser({
      id: session.userId,
      name: session.name,
      phone: session.phone || '',
      email: session.email,
      role: session.role,
      workerId: session.workerId,
      title: session.title,
      active: true,
      avatar: session.avatar
    });
  };

  const logout = () => {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Load from localStorage & session on mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
      if (storedProjects) setProjects(JSON.parse(storedProjects));

      const storedCustomers = localStorage.getItem(`${STORAGE_KEY_PREFIX}customers`);
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));

      const storedQuotations = localStorage.getItem(`${STORAGE_KEY_PREFIX}quotations`);
      if (storedQuotations) setQuotations(JSON.parse(storedQuotations));

      const storedPayments = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
      if (storedPayments) setPayments(JSON.parse(storedPayments));

      const storedWorkers = localStorage.getItem(`${STORAGE_KEY_PREFIX}workers`);
      if (storedWorkers) setWorkers(JSON.parse(storedWorkers));

      const storedAttendance = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));

      const storedTransactions = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions`);
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));

      const storedInquiries = localStorage.getItem(`${STORAGE_KEY_PREFIX}inquiries`);
      if (storedInquiries) setInquiries(JSON.parse(storedInquiries));

      const storedPriceConfig = localStorage.getItem(`${STORAGE_KEY_PREFIX}priceConfig`);
      if (storedPriceConfig) setPriceConfig(JSON.parse(storedPriceConfig));

      const activeSession = getSession();
      if (activeSession) {
        setCurrentRole(activeSession.role);
        setCurrentUser({
          id: activeSession.userId,
          name: activeSession.name,
          phone: activeSession.phone || '',
          email: activeSession.email,
          role: activeSession.role,
          workerId: activeSession.workerId,
          title: activeSession.title,
          active: true,
          avatar: activeSession.avatar
        });
      } else {
        const storedRole = localStorage.getItem(
          `${STORAGE_KEY_PREFIX}currentRole`
        ) as UserRole | null;
        if (storedRole && DEMO_USERS[storedRole]) {
          setCurrentRole(storedRole);
          setCurrentUser(DEMO_USERS[storedRole]);
          authenticateDemo(storedRole);
        } else {
          authenticateDemo('OWNER');
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}quotations`, JSON.stringify(quotations));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}workers`, JSON.stringify(workers));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}inquiries`, JSON.stringify(inquiries));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}priceConfig`, JSON.stringify(priceConfig));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}currentRole`, currentRole);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser`, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [
    hydrated,
    projects,
    customers,
    quotations,
    payments,
    workers,
    attendance,
    transactions,
    inquiries,
    priceConfig,
    currentRole,
    currentUser
  ]);

  // Update Project Progress (Status, %, Catatan, Tanggal, Foto, PIC)
  const updateProjectProgress = (projectId: string, update: UpdateProgressParams) => {
    const historyId = `SH-${Date.now()}`;
    const newHistoryItem = {
      id: historyId,
      status: update.status,
      date: update.date,
      author: update.actor,
      note: update.note,
      progress: update.progress,
      photoUrl: update.photoUrl
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const newFiles = [...proj.files];
        if (update.photoUrl) {
          newFiles.unshift({
            id: `FIL-${Date.now()}`,
            name: `Progress-${update.status.toUpperCase()}-${update.date.replace(/[\s:]/g, '-')}.jpg`,
            category: 'Progress Photo',
            type: 'foto_progress',
            url: update.photoUrl,
            date: update.date.split(' ')[0] || new Date().toISOString().split('T')[0],
            size: '2.0 MB',
            author: update.actor,
            caption: update.note
          });
        }

        return {
          ...proj,
          status: update.status,
          progress: update.progress,
          lastUpdate: update.date,
          files: newFiles,
          statusHistory: [...proj.statusHistory, newHistoryItem]
        };
      })
    );
  };

  // Update status shortcut
  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus, note?: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    const fullDate = `${dateStr} ${timeStr}`;

    const progressMap: Record<ProjectStatus, number> = {
      lead: 5,
      survey: 15,
      quotation: 25,
      waiting_dp: 35,
      production: 55,
      produksi: 55,
      finishing: 75,
      delivery: 90,
      completed: 100,
      selesai: 100
    };

    updateProjectProgress(projectId, {
      status: newStatus,
      progress: progressMap[newStatus] ?? 50,
      note: note || `Status proyek diubah ke ${newStatus.toUpperCase()}`,
      date: fullDate,
      actor:
        currentRole === 'OWNER'
          ? 'Owner Debufa'
          : currentRole === 'WORKER'
            ? 'Kepala Tukang'
            : 'Admin Debufa'
    });
  };

  // Add internal note
  const addInternalNote = (projectId: string, author: string, text: string) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const newNote: InternalNote = {
      id: `NOT-${Date.now()}`,
      date: dateStr,
      author,
      text
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          lastUpdate: dateStr,
          notes: [newNote, ...proj.notes]
        };
      })
    );
  };

  const addProjectNote = addInternalNote;

  // Add project file
  const addProjectFile = (projectId: string, fileData: Omit<ProjectFile, 'id' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newFile: ProjectFile = {
      ...fileData,
      id: `FIL-${Date.now()}`,
      date: dateStr
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          files: [newFile, ...proj.files]
        };
      })
    );
  };

  // Add Project
  const addProject = (
    projectData: Omit<
      Project,
      'id' | 'notes' | 'files' | 'statusHistory' | 'remainingAmount' | 'paymentStatus'
    >
  ): Project => {
    const year = new Date().getFullYear();
    const count = projects.length + 1;
    const newId = `DBF-${year}-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().slice(0, 5);

    const total = projectData.totalAmount || projectData.value || 0;
    const paid = projectData.paidAmount || 0;
    const remaining = Math.max(0, total - paid);
    let paymentStatus: ProjectPaymentStatus = 'belum_bayar';
    if (paid >= total && total > 0) paymentStatus = 'lunas';
    else if (paid >= projectData.dpAmount && projectData.dpAmount > 0) paymentStatus = 'dp';
    else if (paid > 0) paymentStatus = 'sebagian';

    const newProject: Project = {
      ...projectData,
      id: newId,
      totalAmount: total,
      value: total,
      remainingAmount: remaining,
      paymentStatus,
      notes: [
        {
          id: `NOT-${Date.now()}`,
          date: `${dateStr} ${timeStr}`,
          author: currentRole === 'OWNER' ? 'Owner Debufa' : 'Admin Debufa',
          text: 'Project baru berhasil dibuat dalam sistem.'
        }
      ],
      files: [],
      statusHistory: [
        {
          id: `SH-${Date.now()}`,
          status: projectData.status,
          date: `${dateStr} ${timeStr}`,
          author: currentRole === 'OWNER' ? 'Owner Debufa' : 'Admin Debufa',
          note: 'Project diinisiasi',
          progress: projectData.progress || 5
        }
      ]
    };

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  // Add Customer
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const count = customers.length + 1;
    const newId = `CST-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      createdAt: dateStr
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  // Add Quotation
  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'date'>): Quotation => {
    const year = new Date().getFullYear();
    const count = quotations.length + 1;
    const newId = `Q-DBF-${year}-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const newQuote: Quotation = {
      ...quotationData,
      id: newId,
      date: dateStr
    };

    setQuotations((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  // Add Payment & recalculate Project Balance & Payment Status
  const addPayment = (paymentData: Omit<Payment, 'id'>): Payment => {
    const count = payments.length + 1;
    const year = new Date().getFullYear();
    const newId = `PAY-${year}-${String(count).padStart(3, '0')}`;

    const newPayment: Payment = {
      ...paymentData,
      id: newId
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Recalculate project financials without modifying project status!
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== paymentData.projectId) return proj;

        const total = proj.totalAmount || proj.value || 0;
        const newPaid = proj.paidAmount + paymentData.amount;
        const newRemaining = Math.max(0, total - newPaid);

        let newPaymentStatus: ProjectPaymentStatus = 'belum_bayar';
        if (newPaid >= total && total > 0) {
          newPaymentStatus = 'lunas';
        } else if (newPaid >= proj.dpAmount && proj.dpAmount > 0) {
          newPaymentStatus = newPaid > proj.dpAmount ? 'sebagian' : 'dp';
        } else if (newPaid > 0) {
          newPaymentStatus = 'sebagian';
        }

        return {
          ...proj,
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          paymentStatus: newPaymentStatus,
          // CRITICAL: Maintain project status separate from payment status!
          status: proj.status
        };
      })
    );

    return newPayment;
  };

  // Convert Quotation to Project (No re-entry required!)
  const convertQuotationToProject = (quotationId: string): Project => {
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error('Quotation tidak ditemukan');

    const year = new Date().getFullYear();
    const count = projects.length + 1;
    const newProjectId = `DBF-${year}-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().slice(0, 5);

    const primaryItem = quote.items[0];
    const furnitureType = (primaryItem?.furnitureType as FurnitureType) || 'Custom Furniture';

    const newProject: Project = {
      id: newProjectId,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      customerAddress: quote.customerAddress,
      projectName: primaryItem?.description || `${furnitureType} - ${quote.customerName}`,
      furnitureType,
      specifications: {
        furnitureType,
        dimensions: { length: 3.5, height: 2.5, depth: 0.6, unit: 'meter lari' },
        material: primaryItem?.material || 'Multiplek 18mm',
        hardware: primaryItem?.hardware || 'Engsel & Rel Soft Closing',
        finishing: primaryItem?.finishing || 'HPL Taco Woodgrain',
        quantity: primaryItem?.quantity || 1,
        notes: quote.notes
      },
      totalAmount: quote.total,
      value: quote.total,
      dpAmount: quote.dpAmount,
      paidAmount: 0,
      remainingAmount: quote.total,
      paymentStatus: 'belum_bayar',
      status: 'waiting_dp',
      progress: 35,
      startDate: dateStr,
      deadline:
        quote.validUntil ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUpdate: `${dateStr} ${timeStr}`,
      notes: [
        {
          id: `NOT-${Date.now()}`,
          date: `${dateStr} ${timeStr}`,
          author: currentRole === 'OWNER' ? 'Owner Debufa' : 'Admin Debufa',
          text: `Proyek otomatis dibuat dari konversi Quotation ${quote.id}. Menunggu pembayaran DP untuk mulai produksi.`
        }
      ],
      files: [],
      statusHistory: [
        {
          id: `SH-${Date.now()}`,
          status: 'waiting_dp',
          date: `${dateStr} ${timeStr}`,
          author: currentRole === 'OWNER' ? 'Owner Debufa' : 'Admin Debufa',
          note: `Quotation ${quote.id} disetujui konsumen, status proyek: WAITING DP`,
          progress: 35
        }
      ]
    };

    // Update quotation status
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotationId ? { ...q, status: 'converted', projectId: newProjectId } : q
      )
    );

    // Append new project
    setProjects((prev) => [newProject, ...prev]);

    return newProject;
  };

  // Customer Inquiries
  const createInquiry = (inquiryData: Omit<Inquiry, 'id' | 'created_at'>): Inquiry => {
    const year = new Date().getFullYear();
    const count = inquiries.length + 1;
    const newId = `INQ-${year}-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().slice(0, 5);

    const newInquiry: Inquiry = {
      ...inquiryData,
      id: newId,
      created_at: `${dateStr} ${timeStr}`
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    // Also auto-create customer if phone doesn't exist
    const existingCust = customers.find(
      (c) => c.phone.replace(/\D/g, '') === inquiryData.customer.phone.replace(/\D/g, '')
    );
    if (!existingCust) {
      addCustomer({
        name: inquiryData.customer.name,
        phone: inquiryData.customer.phone,
        email: inquiryData.customer.email,
        address: inquiryData.customer.address,
        notes: `Inquiry via ${inquiryData.source} untuk ${inquiryData.furniture}`
      });
    }

    return newInquiry;
  };

  const updateInquiryStatus = (inquiryId: string, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq)));
  };

  // Convert Inquiry to Draft Quotation
  const convertInquiryToQuotation = (inquiryId: string): Quotation => {
    const inq = inquiries.find((i) => i.id === inquiryId);
    if (!inq) throw new Error('Inquiry tidak ditemukan');

    // Find customer id
    const cust =
      customers.find((c) => c.phone.replace(/\D/g, '') === inq.customer.phone.replace(/\D/g, '')) ||
      customers[0];

    const year = new Date().getFullYear();
    const count = quotations.length + 1;
    const newQuoteId = `Q-DBF-${year}-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const unitPrice = inq.estimated_price / Math.max(1, inq.specification.quantity);
    const total = inq.estimated_price;
    const dpAmount = Math.round(total * 0.5);

    const newQuotation: Quotation = {
      id: newQuoteId,
      inquiryId: inq.id,
      customerId: cust.id,
      customerName: inq.customer.name,
      customerPhone: inq.customer.phone,
      customerAddress: inq.customer.address,
      items: [
        {
          id: `QI-${Date.now()}`,
          furnitureType: inq.furniture,
          description: `${inq.furniture} Custom (${inq.specification.dimensions.length}x${inq.specification.dimensions.height}x${inq.specification.dimensions.depth} ${inq.specification.dimensions.unit})`,
          dimensions: `${inq.specification.dimensions.length} x ${inq.specification.dimensions.height} x ${inq.specification.dimensions.depth} ${inq.specification.dimensions.unit}`,
          material: inq.specification.material,
          hardware: inq.specification.hardware,
          finishing: inq.specification.finishing,
          quantity: inq.specification.quantity,
          unitPrice,
          total
        }
      ],
      subtotal: total,
      discount: 0,
      total,
      dpPercent: 50,
      dpAmount,
      remainingAmount: total - dpAmount,
      status: 'draft',
      date: dateStr,
      validUntil,
      notes: inq.specification.notes || `Dibuat dari Inquiry ${inq.id}`
    };

    // Update inquiry status
    updateInquiryStatus(inquiryId, 'QUOTATION');
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiryId ? { ...i, quotationId: newQuoteId } : i))
    );

    setQuotations((prev) => [newQuotation, ...prev]);
    return newQuotation;
  };

  // Price Configuration
  const updatePriceConfigItem = (category: keyof PriceConfiguration, item: PriceConfigItem) => {
    setPriceConfig((prev) => ({
      ...prev,
      [category]: prev[category].map((it) => (it.id === item.id ? item : it))
    }));
  };

  const addPriceConfigItem = (
    category: keyof PriceConfiguration,
    itemData: Omit<PriceConfigItem, 'id'>
  ): PriceConfigItem => {
    const prefix = category.slice(0, 3);
    const newId = `${prefix}-${Date.now()}`;
    const newItem: PriceConfigItem = { ...itemData, id: newId };

    setPriceConfig((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));

    return newItem;
  };

  // Attendance
  const updateAttendance = (
    attendanceId: string,
    updates: Partial<Pick<Attendance, 'status' | 'checkIn' | 'checkOut' | 'notes'>>
  ) => {
    setAttendance((prev) =>
      prev.map((att) => (att.id === attendanceId ? { ...att, ...updates } : att))
    );
  };

  const addAttendanceRecord = (record: Attendance) => {
    setAttendance((prev) => [record, ...prev]);
  };

  // Transactions
  const addTransaction = (
    transactionData: Omit<WorkerTransaction, 'id' | 'date'>
  ): WorkerTransaction => {
    const count = transactions.length + 1;
    const newId = `TRX-${String(count).padStart(3, '0')}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const newTrx: WorkerTransaction = {
      ...transactionData,
      id: newId,
      date: dateStr,
      status: transactionData.status || (transactionData.type === 'kasbon' ? 'pending' : 'settled')
    };

    setTransactions((prev) => [newTrx, ...prev]);
    return newTrx;
  };

  const updateWorkerTransactionStatus = (
    transactionId: string,
    status: WorkerTransactionStatus
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status,
              settledDate: status === 'settled' ? new Date().toISOString().split('T')[0] : undefined
            }
          : t
      )
    );
  };

  const addWorker = (worker: Worker) => {
    setWorkers((prev) => [worker, ...prev]);
  };

  const updateWorker = (worker: Worker) => {
    setWorkers((prev) => prev.map((w) => (w.id === worker.id ? worker : w)));
  };

  // Reset to default
  const resetToDefault = () => {
    localStorage.clear();
    setCustomers(INITIAL_CUSTOMERS);
    setProjects(INITIAL_PROJECTS);
    setQuotations(INITIAL_QUOTATIONS);
    setPayments(INITIAL_PAYMENTS);
    setWorkers(INITIAL_WORKERS);
    setAttendance(INITIAL_ATTENDANCE);
    setTransactions(INITIAL_TRANSACTIONS);
    setInquiries(INITIAL_INQUIRIES);
    setPriceConfig(INITIAL_PRICE_CONFIG);
    setCurrentRole('OWNER');
    setCurrentUser(DEMO_USERS.OWNER);
  };

  return (
    <DebufaStoreContext.Provider
      value={{
        customers,
        projects,
        quotations,
        payments,
        workers,
        attendance,
        transactions,
        inquiries,
        priceConfig,
        currentRole,
        currentUser,
        setCurrentRole,
        setCurrentUser,
        switchRole,
        logout,
        updateProjectProgress,
        updateProjectStatus,
        addInternalNote,
        addProjectNote,
        addProjectFile,
        addProject,
        addCustomer,
        addQuotation,
        addPayment,
        convertQuotationToProject,
        createInquiry,
        updateInquiryStatus,
        convertInquiryToQuotation,
        updatePriceConfigItem,
        addPriceConfigItem,
        updateAttendance,
        addAttendanceRecord,
        addTransaction,
        updateWorkerTransactionStatus,
        addWorker,
        updateWorker,
        resetToDefault
      }}
    >
      {children}
    </DebufaStoreContext.Provider>
  );
}

export function useDebufaStore() {
  const context = useContext(DebufaStoreContext);
  if (!context) {
    throw new Error('useDebufaStore must be used within a DebufaStoreProvider');
  }
  return context;
}
