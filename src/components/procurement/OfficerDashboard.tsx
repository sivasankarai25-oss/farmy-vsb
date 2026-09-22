import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScanLine, Search, Megaphone, Loader2, Settings2, Plus, Save, X, Users, PackageCheck, Wallet, CheckCircle2,
} from 'lucide-react';
import { Booking, Centre, ProcStatus, PROCUREMENT_CROPS, QueueEntry } from '../../procurement/types';
import { formatQty, orderQueue, prettyDate, todayISO, addDays, ACTIVE_STATUSES } from '../../procurement/logic';
import {
  officerCallNext, officerSetStatus, saveCentre, seedSampleCentres, subscribeCentreBookings,
} from '../../procurement/service';
import { useSub } from '../../procurement/hooks';
import type { TFn } from '../../procurement/i18n';
import { BackBar, BookingStatusPill, Card, ErrorBox, inputCls, labelCls, primaryBtn } from './ui';

interface Props {
  t: TFn;
  centres: Centre[];
  onBack: () => void;
}

const toEntry = (b: Booking): QueueEntry => ({
  bookingId: b.id, userId: b.userId, centreId: b.centreId, date: b.date, token: b.token,
  tokenNumber: b.tokenNumber, slotStart: b.slotStart, status: b.status, counter: b.counter,
});

// ---------------- one row of the officer worklist ----------------
const Row: React.FC<{
  t: TFn; b: Booking; counter: number; highlight?: boolean;
  act: (b: Booking, next: ProcStatus, o?: { counter?: number; amount?: number; note?: string }) => Promise<void>;
}> = ({ t, b, counter, highlight, act }) => {
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('');
  const run = async (next: ProcStatus, o?: { counter?: number; amount?: number; note?: string }) => {
    setBusy(true);
    try { await act(b, next, o); } finally { setBusy(false); }
  };
  const btn = (label: string, next: ProcStatus, cls = 'bg-emerald-600 text-white', o?: { counter?: number; amount?: number; note?: string }) => (
    <button key={next + label} disabled={busy} onClick={() => run(next, o)} className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold disabled:opacity-50 ${cls}`}>{label}</button>
  );
  const amt = parseFloat(amount);

  return (
    <div className={`p-3 rounded-xl border ${highlight ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/50' : 'border-stone-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span dir="ltr" className="text-sm font-black font-mono">{b.token}</span>
            <BookingStatusPill status={b.status} t={t} />
            {b.counter != null && ACTIVE_STATUSES.includes(b.status) && b.status !== 'BOOKED' && b.status !== 'ARRIVED' && (
              <span className="text-[10px] font-bold text-stone-500">{t('counter')} {b.counter}</span>
            )}
          </div>
          <p className="text-xs font-bold text-stone-800 mt-0.5">{b.farmerName} · <span dir="ltr">{b.mobile}</span></p>
          <p className="text-[11px] text-stone-500">
            {t(`crop_${b.crop}` as never) || b.crop} · <span dir="ltr">{formatQty(b)}</span> · <span dir="ltr">{b.slotLabel}</span> · {b.village}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        {busy && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
        {b.status === 'BOOKED' && <>
          {btn(t('opCheckIn'), 'ARRIVED')}
          {btn(t('opNoShow'), 'CANCELLED', 'bg-stone-200 text-stone-700', { note: t('opNoShow') })}
        </>}
        {b.status === 'ARRIVED' && btn(`${t('opCall')} ${counter}`, 'WEIGHING', 'bg-emerald-600 text-white', { counter })}
        {b.status === 'WEIGHING' && btn(t('opWeighDone'), 'QUALITY_CHECK')}
        {b.status === 'QUALITY_CHECK' && <>
          {btn(t('opAccept'), 'ACCEPTED')}
          {btn(t('opReject'), 'REJECTED', 'bg-red-600 text-white', { note: t('opRejectNote') })}
        </>}
        {b.status === 'ACCEPTED' && (
          <div className="flex items-center gap-1.5 w-full">
            <input dir="ltr" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder={t('opAmount')} className="w-32 px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg" />
            <button disabled={busy || !(amt > 0)} onClick={() => run('PAYMENT_PROCESSING', { amount: amt })}
              className="px-3 py-1.5 rounded-lg text-[11px] font-extrabold bg-emerald-600 text-white disabled:opacity-40">{t('opStartPayment')}</button>
          </div>
        )}
        {b.status === 'PAYMENT_PROCESSING' && btn(t('opMarkPaid'), 'PAYMENT_COMPLETED')}
      </div>
    </div>
  );
};

// ---------------- centre editor ----------------
const blank = (): Centre => ({
  id: '', name: '', code: '', address: '', district: '', state: '', lat: null, lon: null, supportedCrops: ['Paddy'],
  slotCapacity: 20, openTime: '08:00', closeTime: '16:00', slotMinutes: 60, counters: 1, avgServiceMinutes: 6, closed: false,
});

const CentreEditor: React.FC<{ t: TFn; centres: Centre[] }> = ({ t, centres }) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Centre | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!edit) return;
    const id = edit.id || edit.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!id || !edit.code.trim() || !edit.name.trim() || edit.supportedCrops.length === 0) { setErr(t('errCentreForm')); return; }
    setBusy(true); setErr(null);
    try { await saveCentre({ ...edit, id }); setEdit(null); }
    catch { setErr('GENERIC'); }
    finally { setBusy(false); }
  };
  const num = (k: keyof Centre, v: string) => setEdit(e => e && ({ ...e, [k]: v === '' ? 0 : Number(v) }));
  const txt = (k: keyof Centre, v: string) => setEdit(e => e && ({ ...e, [k]: v }));

  return (
    <Card className="p-4 space-y-3">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between text-sm font-extrabold text-stone-900">
        <span className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-emerald-700" />{t('manageCentres')}</span>
        <span className="text-xs text-stone-400">{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div className="space-y-3">
          {centres.length === 0 && (
            <button onClick={() => seedSampleCentres().catch(() => setErr('GENERIC'))} className={`${primaryBtn} w-full`}>{t('loadSample')}</button>
          )}
          {centres.map(c => (
            <div key={c.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50">
              <div className="min-w-0"><div className="text-xs font-black">{c.name} <span dir="ltr" className="font-mono text-stone-500">({c.code})</span></div>
                <div className="text-[11px] text-stone-500 truncate">{c.address}</div></div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => saveCentre({ ...c, closed: !c.closed }).catch(() => setErr('GENERIC'))}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold ${c.closed ? 'bg-stone-800 text-white' : 'bg-white border border-stone-300'}`}>
                  {c.closed ? t('reopen') : t('closeToday')}
                </button>
                <button onClick={() => setEdit(c)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold bg-white border border-stone-300">{t('edit')}</button>
              </div>
            </div>
          ))}
          {!edit && <button onClick={() => setEdit(blank())} className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-300 text-xs font-extrabold text-stone-600 flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" />{t('addCentre')}</button>}

          {edit && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div><label className={labelCls}>{t('centreName')}</label><input className={inputCls} value={edit.name} onChange={e => txt('name', e.target.value)} /></div>
                <div><label className={labelCls}>{t('tokenPrefix')}</label><input className={inputCls} dir="ltr" maxLength={5} value={edit.code} onChange={e => txt('code', e.target.value.toUpperCase())} /></div>
              </div>
              <div><label className={labelCls}>{t('address')}</label><input className={inputCls} value={edit.address} onChange={e => txt('address', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className={labelCls}>{t('district')}</label><input className={inputCls} value={edit.district} onChange={e => txt('district', e.target.value)} /></div>
                <div><label className={labelCls}>{t('state')}</label><input className={inputCls} value={edit.state} onChange={e => txt('state', e.target.value)} /></div>
                <div><label className={labelCls}>{t('latitude')}</label><input className={inputCls} dir="ltr" inputMode="decimal" value={edit.lat ?? ''} onChange={e => setEdit({ ...edit, lat: e.target.value === '' ? null : Number(e.target.value) })} /></div>
                <div><label className={labelCls}>{t('longitude')}</label><input className={inputCls} dir="ltr" inputMode="decimal" value={edit.lon ?? ''} onChange={e => setEdit({ ...edit, lon: e.target.value === '' ? null : Number(e.target.value) })} /></div>
                <div><label className={labelCls}>{t('opens')}</label><input type="time" className={inputCls} value={edit.openTime} onChange={e => txt('openTime', e.target.value)} /></div>
                <div><label className={labelCls}>{t('closes')}</label><input type="time" className={inputCls} value={edit.closeTime} onChange={e => txt('closeTime', e.target.value)} /></div>
                <div><label className={labelCls}>{t('perSlotCapacity')}</label><input className={inputCls} dir="ltr" inputMode="numeric" value={edit.slotCapacity} onChange={e => num('slotCapacity', e.target.value)} /></div>
                <div><label className={labelCls}>{t('counters')}</label><input className={inputCls} dir="ltr" inputMode="numeric" value={edit.counters} onChange={e => num('counters', e.target.value)} /></div>
                <div className="col-span-2"><label className={labelCls}>{t('avgMinutes')}</label><input className={inputCls} dir="ltr" inputMode="numeric" value={edit.avgServiceMinutes} onChange={e => num('avgServiceMinutes', e.target.value)} /></div>
              </div>
              <div>
                <label className={labelCls}>{t('supportedCrops')}</label>
                <div className="flex flex-wrap gap-1.5">
                  {PROCUREMENT_CROPS.map(c => {
                    const on = edit.supportedCrops.includes(c);
                    return <button key={c} onClick={() => setEdit({ ...edit, supportedCrops: on ? edit.supportedCrops.filter(x => x !== c) : [...edit.supportedCrops, c] })}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border ${on ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-stone-300 text-stone-600'}`}>{t(`crop_${c}` as never)}</button>;
                  })}
                </div>
              </div>
              {err && <ErrorBox error={err} t={t} />}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setEdit(null); setErr(null); }} className="py-2.5 rounded-xl border border-stone-300 text-xs font-black flex items-center justify-center gap-1"><X className="w-3.5 h-3.5" />{t('cancel')}</button>
                <button onClick={save} disabled={busy} className="py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1">{busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}{t('save')}</button>
              </div>
            </div>
          )}
          {!edit && err && <ErrorBox error={err} t={t} />}
        </div>
      )}
    </Card>
  );
};

// ---------------- dashboard ----------------
export const OfficerDashboard: React.FC<Props> = ({ t, centres, onBack }) => {
  const [centreId, setCentreId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [counter, setCounter] = useState(1);
  const [lookup, setLookup] = useState('');
  const [lookupMsg, setLookupMsg] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [actErr, setActErr] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (!centreId && centres.length) setCentreId(centres[0].id); }, [centres, centreId]);
  const centre = centres.find(c => c.id === centreId);

  const sub = useSub<Booking[]>((cb, er) => (centreId ? subscribeCentreBookings(centreId, date, cb, er) : null), [], [centreId, date]);
  const bookings = sub.data;
  const entries = useMemo(() => bookings.map(toEntry), [bookings]);

  const stats = useMemo(() => {
    const n = (f: (b: Booking) => boolean) => bookings.filter(f).length;
    return {
      total: n(b => b.status !== 'CANCELLED'),
      waiting: n(b => b.status === 'BOOKED' || b.status === 'ARRIVED'),
      serving: n(b => b.status === 'WEIGHING' || b.status === 'QUALITY_CHECK'),
      accepted: n(b => ['ACCEPTED', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED'].includes(b.status)),
      paid: n(b => b.status === 'PAYMENT_COMPLETED'),
    };
  }, [bookings]);

  const worklist = useMemo(() => {
    const byId = new Map(bookings.map(b => [b.id, b]));
    return orderQueue(entries).map(e => byId.get(e.bookingId)!).filter(Boolean);
  }, [bookings, entries]);
  const open = worklist.filter(b => b.status !== 'CANCELLED' && b.status !== 'PAYMENT_COMPLETED' && b.status !== 'REJECTED');
  const closed = worklist.filter(b => !open.includes(b));

  const act = async (b: Booking, next: ProcStatus, o?: { counter?: number; amount?: number; note?: string }) => {
    setActErr(null);
    try { await officerSetStatus(b, next, o); }
    catch (e: any) { setActErr(e?.code === 'permission-denied' ? 'PERMISSION' : 'GENERIC'); }
  };

  const callNext = async () => {
    setActErr(null);
    try {
      const b = await officerCallNext(entries, bookings, counter);
      if (!b) setActErr(t('errNoOneChecked'));
    } catch (e: any) { setActErr(e?.code === 'permission-denied' ? 'PERMISSION' : 'GENERIC'); }
  };

  const find = (raw: string) => {
    const v = raw.trim();
    if (!v) { setFocusId(null); setLookupMsg(null); return; }
    let id = '', token = v.toUpperCase();
    if (v.startsWith('FARMY-PROC|')) { const p = v.split('|'); id = p[1]; token = (p[2] || '').toUpperCase(); }
    const hit = bookings.find(b => b.id === id || b.token.toUpperCase() === token || String(b.tokenNumber) === v);
    setFocusId(hit?.id ?? null);
    setLookupMsg(hit ? null : t('lookupNotFound'));
  };

  // Camera QR scan (uses the browser's built-in BarcodeDetector where available).
  useEffect(() => {
    if (!scanning) return;
    const BD = (window as any).BarcodeDetector;
    let stream: MediaStream | null = null;
    let timer: number | undefined;
    let stopped = false;
    (async () => {
      if (!BD || !navigator.mediaDevices?.getUserMedia) { setLookupMsg(t('scanUnsupported')); setScanning(false); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
        const det = new BD({ formats: ['qr_code'] });
        timer = window.setInterval(async () => {
          if (stopped || !videoRef.current) return;
          try {
            const codes = await det.detect(videoRef.current);
            if (codes[0]?.rawValue) { setLookup(codes[0].rawValue); find(codes[0].rawValue); setScanning(false); }
          } catch { /* ignore frame errors */ }
        }, 500);
      } catch { setLookupMsg(t('scanUnsupported')); setScanning(false); }
    })();
    return () => { stopped = true; if (timer) clearInterval(timer); stream?.getTracks().forEach(tr => tr.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const focused = focusId ? bookings.find(b => b.id === focusId) : undefined;
  const dates = [addDays(todayISO(), -1), todayISO(), addDays(todayISO(), 1), addDays(todayISO(), 2)];

  return (
    <div className="space-y-4 pb-24">
      <BackBar title={t('officerTitle')} subtitle={t('officerSub')} onBack={onBack} />

      <Card className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select className={inputCls} value={centreId} onChange={e => setCentreId(e.target.value)}>
          {centres.length === 0 && <option value="">{t('noCentres')}</option>}
          {centres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={inputCls} value={date} onChange={e => setDate(e.target.value)}>
          {dates.map(d => <option key={d} value={d}>{prettyDate(d)}{d === todayISO() ? ` (${t('today')})` : ''}</option>)}
        </select>
        <select className={inputCls} value={counter} onChange={e => setCounter(Number(e.target.value))}>
          {Array.from({ length: Math.max(1, centre?.counters ?? 1) }, (_, i) => i + 1).map(n => <option key={n} value={n}>{t('counter')} {n}</option>)}
        </select>
      </Card>

      <div className="grid grid-cols-5 gap-2 text-center">
        {[
          { icon: <Users className="w-3.5 h-3.5" />, k: 'statTotal', v: stats.total },
          { icon: <Search className="w-3.5 h-3.5" />, k: 'statWaiting', v: stats.waiting },
          { icon: <Megaphone className="w-3.5 h-3.5" />, k: 'statServing', v: stats.serving },
          { icon: <PackageCheck className="w-3.5 h-3.5" />, k: 'statAccepted', v: stats.accepted },
          { icon: <Wallet className="w-3.5 h-3.5" />, k: 'statPaid', v: stats.paid },
        ].map(s => (
          <div key={s.k} className="bg-white border border-stone-200 rounded-xl py-2 px-1">
            <div className="flex justify-center text-emerald-700">{s.icon}</div>
            <div className="text-lg font-black text-stone-900 leading-tight">{s.v}</div>
            <div className="text-[9px] font-bold text-stone-500 leading-tight">{t(s.k as never)}</div>
          </div>
        ))}
      </div>

      <button onClick={callNext} disabled={!centre} className={`${primaryBtn} w-full`}>
        <Megaphone className="w-4 h-4" /> {t('callNext')} → {t('counter')} {counter}
      </button>

      {/* Token / QR lookup */}
      <Card className="p-3 space-y-2">
        <div className="flex gap-2">
          <input className={inputCls} dir="ltr" placeholder={t('lookupPlaceholder')} value={lookup}
            onChange={e => { setLookup(e.target.value); find(e.target.value); }} />
          <button onClick={() => setScanning(s => !s)} className="px-3 rounded-xl border border-stone-300 bg-white text-emerald-800 shrink-0" aria-label={t('scanQr')}>
            <ScanLine className="w-5 h-5" />
          </button>
        </div>
        {scanning && <video ref={videoRef} className="w-full rounded-xl bg-black max-h-64 object-cover" muted playsInline />}
        {lookupMsg && <p className="text-[11px] font-medium text-amber-700">{lookupMsg}</p>}
        {focused && <Row t={t} b={focused} counter={counter} act={act} highlight />}
      </Card>

      {sub.error && <ErrorBox error={sub.error} t={t} />}
      {actErr && <ErrorBox error={actErr} t={t} />}

      {sub.loading && centreId ? (
        <div className="py-8 text-center text-stone-400"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
      ) : (
        <>
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-stone-500">{t('worklist')} ({open.length})</h3>
            {open.length === 0 && <p className="text-xs text-stone-400 py-2">{t('noBookingsForDay')}</p>}
            {open.map(b => <Row key={b.id} t={t} b={b} counter={counter} act={act} highlight={b.id === focusId} />)}
          </div>
          {closed.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-stone-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t('finished')} ({closed.length})</h3>
              {closed.map(b => (
                <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <span dir="ltr" className="font-mono font-bold">{b.token}</span>
                  <span className="text-stone-600 truncate mx-2">{b.farmerName}</span>
                  <BookingStatusPill status={b.status} t={t} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <CentreEditor t={t} centres={centres} />
    </div>
  );
};
