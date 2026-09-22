// FARMY SMART PROCUREMENT - Firestore data layer.
// Reuses the existing Farmy Firebase project (Auth + Firestore). No second backend.
import type { Query, DocumentData } from 'firebase/firestore';
import {
  db, doc, getDoc, setDoc, collection, query, where, onSnapshot,
  runTransaction, writeBatch, arrayUnion, updateDoc,
} from '../firebase';
import {
  AppNotification, Booking, Centre, ProcProfile, ProcStatus, QtyUnit,
  QueueEntry, SlotDef, SlotDoc,
} from './types';
import { orderQueue, paymentFor, slotDocId, toKg } from './logic';

export const COL = {
  centres: 'procurementCentres',
  slots: 'procurementSlots',
  counters: 'procurementCounters',
  bookings: 'procurementBookings',
  queue: 'procurementQueue',
  notifications: 'procurementNotifications',
  profiles: 'procurementProfiles',
  officers: 'procurementOfficers',
} as const;

type Unsub = () => void;
type ErrCb = (e: Error) => void;

function listen<T>(q: Query<DocumentData>, map: (id: string, d: DocumentData) => T, cb: (v: T[]) => void, onErr?: ErrCb): Unsub {
  return onSnapshot(q, snap => cb(snap.docs.map(d => map(d.id, d.data()))), err => onErr?.(err));
}

// ---------------- realtime subscriptions ----------------

export const subscribeCentres = (cb: (v: Centre[]) => void, onErr?: ErrCb) =>
  listen<Centre>(query(collection(db, COL.centres)), (id, d) => ({ ...(d as Centre), id }),
    list => cb(list.sort((a, b) => a.name.localeCompare(b.name))), onErr);

export const subscribeSlotsForDate = (date: string, cb: (v: SlotDoc[]) => void, onErr?: ErrCb) =>
  listen<SlotDoc>(query(collection(db, COL.slots), where('date', '==', date)), (_id, d) => d as SlotDoc, cb, onErr);

export const subscribeQueueForDate = (date: string, cb: (v: QueueEntry[]) => void, onErr?: ErrCb) =>
  listen<QueueEntry>(query(collection(db, COL.queue), where('date', '==', date)), (_id, d) => d as QueueEntry, cb, onErr);

export const subscribeMyBookings = (uid: string, cb: (v: Booking[]) => void, onErr?: ErrCb) =>
  listen<Booking>(query(collection(db, COL.bookings), where('userId', '==', uid)), (id, d) => ({ ...(d as Booking), id }),
    list => cb(list.sort((a, b) => b.createdAt - a.createdAt)), onErr);

export const subscribeCentreBookings = (centreId: string, date: string, cb: (v: Booking[]) => void, onErr?: ErrCb) =>
  listen<Booking>(
    query(collection(db, COL.bookings), where('centreId', '==', centreId), where('date', '==', date)),
    (id, d) => ({ ...(d as Booking), id }),
    list => cb(list.sort((a, b) => a.slotStart - b.slotStart || a.tokenNumber - b.tokenNumber)), onErr);

export const subscribeNotifications = (uid: string, cb: (v: AppNotification[]) => void, onErr?: ErrCb) =>
  listen<AppNotification>(query(collection(db, COL.notifications), where('userId', '==', uid)), (id, d) => ({ ...(d as AppNotification), id }),
    list => cb(list.sort((a, b) => b.createdAt - a.createdAt)), onErr);

// ---------------- profile / officer ----------------

export async function getProfile(uid: string): Promise<ProcProfile | null> {
  const snap = await getDoc(doc(db, COL.profiles, uid));
  return snap.exists() ? (snap.data() as ProcProfile) : null;
}

export async function saveProfile(uid: string, p: ProcProfile): Promise<void> {
  await setDoc(doc(db, COL.profiles, uid), { ...p, updatedAt: Date.now() });
}

// An "officer" is any signed-in user that has a document at procurementOfficers/{uid}.
// Only an admin can create it (from the Firebase console) - see firestore.rules.
export async function isOfficer(uid: string): Promise<boolean> {
  try {
    return (await getDoc(doc(db, COL.officers, uid))).exists();
  } catch {
    return false;
  }
}

// ---------------- farmer actions ----------------

export class ProcurementError extends Error {
  constructor(public code: 'SLOT_FULL' | 'NOT_CANCELLABLE' | 'CENTRE_CLOSED') {
    super(code);
  }
}

export interface BookInput {
  uid: string;
  profile: ProcProfile;
  centre: Centre;
  slot: SlotDef;
  date: string;
  crop: string;
  quantity: number;
  unit: QtyUnit;
}

// Books a slot inside ONE Firestore transaction: capacity check + slot counter +
// token number + booking + public queue entry are committed atomically, so two
// farmers can never take the last seat at the same time.
export async function bookSlot(p: BookInput): Promise<Booking> {
  if (p.centre.closed) throw new ProcurementError('CENTRE_CLOSED');
  const now = Date.now();
  const bookingRef = doc(collection(db, COL.bookings));
  const queueRef = doc(db, COL.queue, bookingRef.id);
  const slotRef = doc(db, COL.slots, slotDocId(p.centre.id, p.date, p.slot.id));
  const counterRef = doc(db, COL.counters, p.centre.id);
  const notifRef = doc(collection(db, COL.notifications));

  return runTransaction(db, async tx => {
    const slotSnap = await tx.get(slotRef);
    const counterSnap = await tx.get(counterRef);

    const booked = slotSnap.exists() ? (slotSnap.data().booked as number) : 0;
    if (booked >= p.centre.slotCapacity) throw new ProcurementError('SLOT_FULL');

    const tokenNumber = counterSnap.exists() ? (counterSnap.data().next as number) : 1001;
    const token = `${p.centre.code}-${tokenNumber}`;

    const booking: Booking = {
      id: bookingRef.id,
      userId: p.uid,
      token,
      tokenNumber,
      farmerId: p.profile.farmerId,
      farmerName: p.profile.name,
      mobile: p.profile.mobile,
      village: p.profile.village,
      district: p.profile.district,
      state: p.profile.state,
      crop: p.crop,
      quantity: p.quantity,
      unit: p.unit,
      quantityKg: toKg(p.quantity, p.unit),
      centreId: p.centre.id,
      centreName: p.centre.name,
      centreCode: p.centre.code,
      date: p.date,
      slotId: p.slot.id,
      slotLabel: p.slot.label,
      slotStart: p.slot.start,
      status: 'BOOKED',
      paymentStatus: 'PENDING',
      counter: null,
      amount: null,
      note: null,
      history: [{ status: 'BOOKED', at: now }],
      createdAt: now,
      updatedAt: now,
    };
    const entry: QueueEntry = {
      bookingId: booking.id, userId: p.uid, centreId: p.centre.id, date: p.date, token,
      tokenNumber, slotStart: p.slot.start, status: 'BOOKED', counter: null,
    };

    tx.set(slotRef, { centreId: p.centre.id, date: p.date, slotId: p.slot.id, capacity: p.centre.slotCapacity, booked: booked + 1 });
    tx.set(counterRef, { next: tokenNumber + 1 });
    tx.set(bookingRef, booking);
    tx.set(queueRef, entry);
    tx.set(notifRef, {
      userId: p.uid, bookingId: booking.id, title: 'BOOKING_CONFIRMED', message: token,
      read: false, createdAt: now,
    });
    return booking;
  });
}

export async function cancelBooking(b: Booking): Promise<void> {
  const now = Date.now();
  const bRef = doc(db, COL.bookings, b.id);
  const qRef = doc(db, COL.queue, b.id);
  const sRef = doc(db, COL.slots, slotDocId(b.centreId, b.date, b.slotId));
  await runTransaction(db, async tx => {
    const bs = await tx.get(bRef);
    const ss = await tx.get(sRef);
    if (!bs.exists() || bs.data().status !== 'BOOKED') throw new ProcurementError('NOT_CANCELLABLE');
    tx.update(bRef, { status: 'CANCELLED', updatedAt: now, history: arrayUnion({ status: 'CANCELLED', at: now, note: 'FARMER' }) });
    tx.update(qRef, { status: 'CANCELLED' });
    if (ss.exists()) tx.update(sRef, { booked: Math.max(0, (ss.data().booked as number) - 1) });
  });
}

export async function markNotificationsRead(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const batch = writeBatch(db);
  ids.forEach(id => batch.update(doc(db, COL.notifications, id), { read: true }));
  await batch.commit();
}

// ---------------- officer actions ----------------

export interface StatusOpts {
  counter?: number | null;
  amount?: number | null;
  note?: string | null;
}

// Notification titles/messages are stored as machine codes and translated on the
// farmer's device, so each farmer sees them in their own app language.
export async function officerSetStatus(b: Booking, next: ProcStatus, opts: StatusOpts = {}): Promise<void> {
  const now = Date.now();
  const batch = writeBatch(db);
  const counter = opts.counter ?? b.counter ?? null;

  batch.update(doc(db, COL.bookings, b.id), {
    status: next,
    paymentStatus: paymentFor(next, b.paymentStatus),
    counter,
    amount: opts.amount ?? b.amount ?? null,
    note: opts.note ?? b.note ?? null,
    updatedAt: now,
    history: arrayUnion({ status: next, at: now, ...(opts.note ? { note: opts.note } : {}) }),
  });
  batch.update(doc(db, COL.queue, b.id), { status: next, counter });
  batch.set(doc(collection(db, COL.notifications)), {
    userId: b.userId,
    bookingId: b.id,
    title: `STATUS_${next}`,
    message: counter != null ? `${b.token}|${counter}` : b.token,
    read: false,
    createdAt: now,
  });
  await batch.commit();
}

// Calls the next checked-in farmer (in slot-then-token order) to a counter.
export async function officerCallNext(entries: QueueEntry[], bookings: Booking[], counter: number): Promise<Booking | null> {
  const next = orderQueue(entries).find(e => e.status === 'ARRIVED');
  const booking = next && bookings.find(b => b.id === next.bookingId);
  if (!booking) return null;
  await officerSetStatus(booking, 'WEIGHING', { counter });
  return booking;
}

export async function saveCentre(c: Centre): Promise<void> {
  await setDoc(doc(db, COL.centres, c.id), {
    name: c.name, code: c.code.toUpperCase(), address: c.address, district: c.district, state: c.state,
    lat: c.lat ?? null, lon: c.lon ?? null, supportedCrops: c.supportedCrops, slotCapacity: c.slotCapacity,
    openTime: c.openTime, closeTime: c.closeTime, slotMinutes: c.slotMinutes, counters: c.counters,
    avgServiceMinutes: c.avgServiceMinutes, closed: c.closed,
  });
}

export const SAMPLE_CENTRES: Centre[] = [
  { id: 'centre-a', name: 'Centre A', code: 'PDK', address: 'Main Procurement Yard, Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu', lat: 10.787, lon: 79.139, supportedCrops: ['Paddy', 'Groundnut', 'Maize'], slotCapacity: 25, openTime: '08:00', closeTime: '16:00', slotMinutes: 60, counters: 2, avgServiceMinutes: 6, closed: false },
  { id: 'centre-b', name: 'Centre B', code: 'TVR', address: 'Market Road Yard, Tiruvarur', district: 'Tiruvarur', state: 'Tamil Nadu', lat: 10.772, lon: 79.636, supportedCrops: ['Paddy', 'Sugarcane'], slotCapacity: 20, openTime: '08:00', closeTime: '15:00', slotMinutes: 60, counters: 1, avgServiceMinutes: 7, closed: false },
  { id: 'centre-c', name: 'Centre C', code: 'NGP', address: 'Cooperative Godown, Nagapattinam', district: 'Nagapattinam', state: 'Tamil Nadu', lat: 10.766, lon: 79.842, supportedCrops: ['Paddy', 'Wheat', 'Cotton', 'Other'], slotCapacity: 15, openTime: '09:00', closeTime: '17:00', slotMinutes: 60, counters: 1, avgServiceMinutes: 8, closed: false },
];

export async function seedSampleCentres(): Promise<void> {
  await Promise.all(SAMPLE_CENTRES.map(saveCentre));
}

export async function setCentreClosed(c: Centre, closed: boolean): Promise<void> {
  await updateDoc(doc(db, COL.centres, c.id), { closed });
}
