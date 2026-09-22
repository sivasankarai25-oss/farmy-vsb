import React, { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';
import {
  Booking, Centre, ProcProfile, PROCUREMENT_CROPS, QTY_UNITS, QtyUnit, SlotDoc,
} from '../../procurement/types';
import { addDays, buildSlots, prettyDate, slotIsPast, todayISO, weekdayShort, centreLive } from '../../procurement/logic';
import { bookSlot, ProcurementError } from '../../procurement/service';
import { useSub } from '../../procurement/hooks';
import { subscribeSlotsForDate } from '../../procurement/service';
import type { TFn } from '../../procurement/i18n';
import { BackBar, Card, CentrePill, EmptyState, ErrorBox, inputCls, labelCls, primaryBtn } from './ui';

interface Props {
  t: TFn;
  uid: string;
  profile: ProcProfile;
  centres: Centre[];
  bookings: Booking[];
  initialCentreId?: string;
  onBack: () => void;
  onBooked: (b: Booking) => void;
}

const StepTitle: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">{n}</span>
    <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">{text}</h3>
  </div>
);

export const BookSlot: React.FC<Props> = ({ t, uid, profile, centres, bookings, initialCentreId, onBack, onBooked }) => {
  const today = todayISO();
  const [centreId, setCentreId] = useState(initialCentreId ?? '');
  const [crop, setCrop] = useState(profile.primaryCrop || '');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState<QtyUnit>('quintal');
  const [date, setDate] = useState(today);
  const [slotId, setSlotId] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const centre = centres.find(c => c.id === centreId);
  const slots = useMemo(() => (centre ? buildSlots(centre) : []), [centre]);
  const slotsSub = useSub<SlotDoc[]>((cb, er) => subscribeSlotsForDate(date, cb, er), [], [date]);

  const bookedFor = (slotKey: string) =>
    slotsSub.data.find(s => s.centreId === centreId && s.slotId === slotKey && s.date === date)?.booked ?? 0;

  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)), [today]);
  const supported = (c: Centre) => !crop || c.supportedCrops.includes(crop);
  const qtyNum = parseFloat(qty);
  const qtyOk = Number.isFinite(qtyNum) && qtyNum > 0 && qtyNum <= 100000;
  const selectedSlot = slots.find(s => s.id === slotId);
  const dup = bookings.some(b => b.date === date && b.status !== 'CANCELLED' && b.status !== 'REJECTED' && b.centreId === centreId);
  const ready = !!(centre && crop && qtyOk && selectedSlot && !dup && !busy);

  const pickCentre = (id: string) => { setCentreId(id); setSlotId(''); setErr(null); };
  const pickDate = (d: string) => { setDate(d); setSlotId(''); setErr(null); };

  const submit = async () => {
    if (!ready || !centre || !selectedSlot) return;
    setBusy(true);
    setErr(null);
    try {
      const b = await bookSlot({ uid, profile, centre, slot: selectedSlot, date, crop, quantity: qtyNum, unit });
      onBooked(b);
    } catch (e: any) {
      if (e instanceof ProcurementError) setErr(e.code === 'SLOT_FULL' ? t('errSlotFull') : t('errCentreClosed'));
      else setErr(e?.code === 'permission-denied' ? 'PERMISSION' : 'GENERIC');
      setSlotId('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      <BackBar title={t('bookSlot')} subtitle={t('bookSlotSub')} onBack={onBack} />

      {centres.length === 0 ? (
        <EmptyState icon={<Lock className="w-6 h-6" />} title={t('noCentres')} text={t('noCentresHint')} />
      ) : (
        <>
          {/* 1. Centre */}
          <Card className="p-4">
            <StepTitle n={1} text={t('stepCentre')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {centres.map(c => {
                const l = centreLive(c, date, slotsSub.data, []);
                const active = c.id === centreId;
                const ok = supported(c);
                return (
                  <button
                    key={c.id}
                    disabled={!ok}
                    onClick={() => pickCentre(c.id)}
                    className={`text-start p-3 rounded-xl border transition-colors ${
                      active ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-stone-200 bg-white hover:bg-stone-50'
                    } ${ok ? '' : 'opacity-40 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-stone-900">{c.name}</span>
                      <CentrePill status={l.status} t={t} />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5 truncate">{c.address}</p>
                    {!ok && <p className="text-[10px] font-bold text-amber-700 mt-1">{t('cropNotSupported')}</p>}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2 + 3. Crop & quantity */}
          <Card className="p-4">
            <StepTitle n={2} text={t('stepCrop')} />
            <div className="flex flex-wrap gap-2 mb-4">
              {PROCUREMENT_CROPS.map(c => {
                const ok = !centre || centre.supportedCrops.includes(c);
                return (
                  <button
                    key={c}
                    disabled={!ok}
                    onClick={() => setCrop(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold border ${
                      crop === c ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-200'
                    } ${ok ? '' : 'opacity-40 cursor-not-allowed'}`}
                  >
                    {t(`crop_${c}` as never)}
                  </button>
                );
              })}
            </div>
            <StepTitle n={3} text={t('stepQuantity')} />
            <div className="grid grid-cols-5 gap-2">
              <input
                className={`${inputCls} col-span-3`} dir="ltr" inputMode="decimal" placeholder="850"
                value={qty} onChange={e => setQty(e.target.value.replace(/[^\d.]/g, ''))}
              />
              <select className={`${inputCls} col-span-2`} value={unit} onChange={e => setUnit(e.target.value as QtyUnit)}>
                {QTY_UNITS.map(u => <option key={u} value={u}>{t(`unit_${u}` as never)}</option>)}
              </select>
            </div>
            {qty && !qtyOk && <p className="text-[11px] text-red-600 font-medium mt-1">{t('errQuantity')}</p>}
          </Card>

          {/* 4. Date */}
          <Card className="p-4">
            <StepTitle n={4} text={t('stepDate')} />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dates.map(d => (
                <button
                  key={d}
                  onClick={() => pickDate(d)}
                  className={`shrink-0 w-16 py-2 rounded-xl border text-center ${
                    d === date ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-80">{d === today ? t('today') : weekdayShort(d)}</div>
                  <div className="text-sm font-black">{d.slice(8)}</div>
                  <div className="text-[10px] opacity-80">{prettyDate(d).split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* 5. Slots */}
          <Card className="p-4">
            <StepTitle n={5} text={t('stepSlot')} />
            {!centre ? (
              <p className="text-xs text-stone-500">{t('pickCentreFirst')}</p>
            ) : slots.length === 0 ? (
              <p className="text-xs text-stone-500">{t('noSlots')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slots.map(s => {
                  const left = Math.max(0, centre.slotCapacity - bookedFor(s.id));
                  const past = slotIsPast(date, s);
                  const full = left === 0;
                  const disabled = past || full || centre.closed;
                  return (
                    <button
                      key={s.id}
                      disabled={disabled}
                      onClick={() => setSlotId(s.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                        slotId === s.id ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                          : disabled ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed' : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span dir="ltr" className="font-black">{s.label}</span>
                      <span className={`text-xs font-extrabold ${full ? 'text-red-600' : past ? 'text-stone-400' : 'text-emerald-700'}`}>
                        {past ? t('slotPassed') : full ? t('full') : t('slotsLeft', { n: left })}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {slotsSub.error && <div className="mt-3"><ErrorBox error={slotsSub.error} t={t} /></div>}
          </Card>

          {dup && <ErrorBox error={t('errDuplicate')} t={t} />}
          {err && <ErrorBox error={err} t={t} />}

          {/* Sticky confirm bar (sits above the bottom navigation on mobile) */}
          <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 px-4 pb-3 pt-2 bg-gradient-to-t from-stone-100 via-stone-100/95 to-transparent">
            <div className="max-w-xl mx-auto">
              <button onClick={submit} disabled={!ready} className={`${primaryBtn} w-full`}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {selectedSlot ? t('confirmBooking') : t('chooseSlotToContinue')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
