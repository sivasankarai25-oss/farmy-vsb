// FARMY SMART PROCUREMENT - pure logic (dates, slots, queue maths). No Firebase here.
import {
  Booking, Centre, CentreLive, CentreStatus, PaymentStatus, ProcStatus, QtyUnit,
  QueueEntry, QueueInfo, SlotDef, SlotDoc,
} from './types';

const pad = (n: number) => String(n).padStart(2, '0');

export function todayISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return todayISO(new Date(y, m - 1, d + n));
}

export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
}

export function weekdayShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short' });
}

export const parseHM = (s: string): number => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + (m || 0);
};
export const fmtHM = (mins: number): string => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
export const nowMinutes = (): number => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

export function buildSlots(c: Pick<Centre, 'openTime' | 'closeTime' | 'slotMinutes'>): SlotDef[] {
  const step = Math.max(15, c.slotMinutes || 60);
  const open = parseHM(c.openTime);
  const close = parseHM(c.closeTime);
  const out: SlotDef[] = [];
  for (let s = open; s + step <= close; s += step) {
    out.push({ id: fmtHM(s).replace(':', ''), start: s, end: s + step, label: `${fmtHM(s)}–${fmtHM(s + step)}` });
  }
  return out;
}

export const slotDocId = (centreId: string, date: string, slotId: string) =>
  `${centreId}_${date}_${slotId}`;

export function slotIsPast(date: string, slot: SlotDef): boolean {
  const today = todayISO();
  return date < today || (date === today && slot.end <= nowMinutes());
}

export function toKg(quantity: number, unit: QtyUnit): number {
  return unit === 'kg' ? quantity : unit === 'quintal' ? quantity * 100 : quantity * 1000;
}

export function formatQty(b: Pick<Booking, 'quantity' | 'unit'>): string {
  return `${b.quantity} ${b.unit}`;
}

export const ACTIVE_STATUSES: ProcStatus[] = ['BOOKED', 'ARRIVED', 'WEIGHING', 'QUALITY_CHECK'];
const FINISHED_STATUSES: ProcStatus[] = ['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED'];

export function capacityPerDay(c: Centre): number {
  return buildSlots(c).length * c.slotCapacity;
}

export function centreLive(c: Centre, date: string, slotDocs: SlotDoc[], queue: QueueEntry[]): CentreLive {
  const slots = buildSlots(c);
  const byId = new Map<string, SlotDoc>();
  slotDocs.forEach(s => { if (s.centreId === c.id && s.date === date) byId.set(s.slotId, s); });

  let capacity = 0, booked = 0, available = 0;
  for (const s of slots) {
    const b = byId.get(s.id)?.booked ?? 0;
    capacity += c.slotCapacity;
    booked += b;
    if (!slotIsPast(date, s)) available += Math.max(0, c.slotCapacity - b);
  }
  const q = queue.filter(e => e.centreId === c.id && e.date === date && ACTIVE_STATUSES.includes(e.status)).length;

  let status: CentreStatus;
  if (c.closed || slots.length === 0 || slots.every(s => slotIsPast(date, s))) status = 'closed';
  else if (available === 0) status = 'full';
  else if (capacity > 0 && booked / capacity >= 0.7) status = 'busy';
  else status = 'available';

  return { capacity, booked, available, queue: q, status };
}

export const orderQueue = (entries: QueueEntry[]): QueueEntry[] =>
  [...entries].sort((a, b) => a.slotStart - b.slotStart || a.tokenNumber - b.tokenNumber);

export function queueInfo(entries: QueueEntry[], b: Booking, centre?: Centre): QueueInfo {
  const active = orderQueue(
    entries.filter(e => e.centreId === b.centreId && e.date === b.date && ACTIVE_STATUSES.includes(e.status)),
  );
  const serving = active.filter(e => e.status === 'WEIGHING' || e.status === 'QUALITY_CHECK');
  const idx = active.findIndex(e => e.bookingId === b.id);
  const counters = Math.max(1, centre?.counters ?? 1);
  const avg = Math.max(1, centre?.avgServiceMinutes ?? 6);

  const base = { serving, position: idx >= 0 ? idx + 1 : null };
  if (b.status === 'CANCELLED') return { ...base, state: 'cancelled', ahead: 0, etaMin: 0 };
  if (FINISHED_STATUSES.includes(b.status)) return { ...base, state: 'done', ahead: 0, etaMin: 0 };
  if (b.status === 'WEIGHING') return { ...base, state: 'turn', ahead: 0, etaMin: 0 };
  if (b.status === 'QUALITY_CHECK') return { ...base, state: 'processing', ahead: 0, etaMin: 0 };
  if (idx < 0) return { ...base, state: 'unknown', ahead: 0, etaMin: 0 };

  const ahead = idx;
  const etaMin = Math.ceil(ahead / counters) * avg;
  const state = ahead === 0 ? 'next' : ahead <= 3 ? 'prepare' : 'waiting';
  return { ...base, state, ahead, etaMin };
}

// The booking a farmer most likely cares about right now.
export function pickActive(bookings: Booking[]): Booking | undefined {
  const open = bookings
    .filter(b => b.status !== 'CANCELLED' && b.status !== 'PAYMENT_COMPLETED' && b.status !== 'REJECTED')
    .sort((a, b) => (a.date + String(a.slotStart).padStart(4, '0')).localeCompare(b.date + String(b.slotStart).padStart(4, '0')));
  return open[0] ?? [...bookings].sort((a, b) => b.createdAt - a.createdAt)[0];
}

export function paymentFor(next: ProcStatus, current: PaymentStatus): PaymentStatus {
  switch (next) {
    case 'PAYMENT_PROCESSING': return 'PROCESSING';
    case 'PAYMENT_COMPLETED': return 'COMPLETED';
    case 'REJECTED':
    case 'CANCELLED': return 'NOT_APPLICABLE';
    default: return current;
  }
}

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const qrPayload = (b: Pick<Booking, 'id' | 'token'>) => `FARMY-PROC|${b.id}|${b.token}`;
