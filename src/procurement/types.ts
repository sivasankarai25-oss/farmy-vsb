// FARMY SMART PROCUREMENT - shared types & constants

export type ProcStatus =
  | 'BOOKED'
  | 'ARRIVED'
  | 'WEIGHING'
  | 'QUALITY_CHECK'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'NOT_APPLICABLE';
export type CentreStatus = 'available' | 'busy' | 'full' | 'closed';
export type QtyUnit = 'kg' | 'quintal' | 'tonne';

export const PROCUREMENT_CROPS = [
  'Paddy', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut', 'Other',
] as const;

export const QTY_UNITS: QtyUnit[] = ['kg', 'quintal', 'tonne'];

export interface Centre {
  id: string;
  name: string;
  code: string; // token prefix, e.g. PDK -> PDK-1024
  address: string;
  district: string;
  state: string;
  lat: number | null;
  lon: number | null;
  supportedCrops: string[];
  slotCapacity: number; // farmers per time slot
  openTime: string; // "08:00"
  closeTime: string; // "16:00"
  slotMinutes: number; // usually 60
  counters: number; // number of service counters
  avgServiceMinutes: number; // avg minutes per farmer per counter (used for ETA)
  closed: boolean;
}

export interface SlotDef {
  id: string; // "0800"
  start: number; // minutes since midnight
  end: number;
  label: string; // "08:00–09:00"
}

export interface SlotDoc {
  centreId: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  capacity: number;
  booked: number;
}

export interface ProcProfile {
  farmerId: string;
  name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  language: string;
  primaryCrop: string;
  updatedAt: number;
}

export interface HistoryItem {
  status: ProcStatus;
  at: number;
  note?: string;
}

export interface Booking {
  id: string;
  userId: string;
  token: string; // PDK-1024
  tokenNumber: number;
  farmerId: string;
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  crop: string;
  quantity: number;
  unit: QtyUnit;
  quantityKg: number;
  centreId: string;
  centreName: string;
  centreCode: string;
  date: string;
  slotId: string;
  slotLabel: string;
  slotStart: number;
  status: ProcStatus;
  paymentStatus: PaymentStatus;
  counter: number | null;
  amount: number | null;
  note: string | null;
  history: HistoryItem[];
  createdAt: number;
  updatedAt: number;
}

// Minimal public projection used for queue maths (contains no personal details)
export interface QueueEntry {
  bookingId: string;
  userId: string;
  centreId: string;
  date: string;
  token: string;
  tokenNumber: number;
  slotStart: number;
  status: ProcStatus;
  counter: number | null;
}

export interface AppNotification {
  id: string;
  userId: string;
  bookingId: string | null;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface CentreLive {
  capacity: number;
  booked: number;
  available: number;
  queue: number;
  status: CentreStatus;
}

export type QueueState =
  | 'unknown' | 'waiting' | 'prepare' | 'next' | 'turn' | 'processing' | 'done' | 'cancelled';

export interface QueueInfo {
  state: QueueState;
  position: number | null; // 1-based
  ahead: number;
  serving: QueueEntry[];
  etaMin: number;
}

export const STATUS_LABEL: Record<ProcStatus, string> = {
  BOOKED: 'Slot Booked',
  ARRIVED: 'Farmer Arrived',
  WEIGHING: 'Weighing',
  QUALITY_CHECK: 'Quality Check',
  ACCEPTED: 'Produce Accepted',
  REJECTED: 'Produce Rejected',
  PAYMENT_PROCESSING: 'Payment Processing',
  PAYMENT_COMPLETED: 'Payment Completed',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  NOT_APPLICABLE: 'Not applicable',
};

export const CENTRE_STATUS_META: Record<CentreStatus, { emoji: string; label: string; cls: string }> = {
  available: { emoji: '🟢', label: 'Available', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  busy: { emoji: '🟡', label: 'Busy', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  full: { emoji: '🔴', label: 'Full', cls: 'bg-red-50 text-red-800 border-red-200' },
  closed: { emoji: '⚫', label: 'Closed', cls: 'bg-stone-100 text-stone-700 border-stone-300' },
};
