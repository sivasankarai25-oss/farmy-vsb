import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays, Ticket, Radio, PackageCheck, Wallet, MapPin, Bell, Store, Pencil, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { User, db, doc, getDoc } from '../../firebase';
import { FarmCrop } from '../../types';
import { Language } from '../../utils/translations';
import {
  AppNotification, Booking, Centre, CentreLive, ProcProfile, QueueEntry, SlotDoc,
} from '../../procurement/types';
import { centreLive, pickActive, prettyDate, queueInfo, todayISO } from '../../procurement/logic';
import {
  getProfile, isOfficer, subscribeCentres, subscribeMyBookings, subscribeNotifications,
  subscribeQueueForDate, subscribeSlotsForDate,
} from '../../procurement/service';
import { useSub } from '../../procurement/hooks';
import { makeT } from '../../procurement/i18n';
import { Card, ErrorBox, Spinner, BookingStatusPill } from './ui';
import { ProfileForm } from './ProfileForm';
import { CentreList } from './CentreList';
import { BookSlot } from './BookSlot';
import { TokenTicket } from './TokenTicket';
import { LiveQueue } from './LiveQueue';
import { StatusTimeline, PaymentStatusView } from './StatusTimeline';
import { Notifications, notificationText } from './Notifications';
import { OfficerDashboard } from './OfficerDashboard';

type View = 'home' | 'book' | 'ticket' | 'queue' | 'status' | 'payment' | 'centres' | 'notifications' | 'profile' | 'officer';

interface Props {
  user: User;
  language: Language;
  selectedLocation: string;
  farmCrops: FarmCrop[];
}

const CROP_KEYWORDS: [string, string][] = [
  ['paddy', 'Paddy'], ['rice', 'Paddy'], ['wheat', 'Wheat'], ['maize', 'Maize'], ['corn', 'Maize'],
  ['cotton', 'Cotton'], ['sugarcane', 'Sugarcane'], ['groundnut', 'Groundnut'], ['peanut', 'Groundnut'],
];

function guessCrop(farmCrops: FarmCrop[]): string {
  for (const fc of farmCrops) {
    const name = `${fc.cropId} ${fc.cropName}`.toLowerCase();
    const hit = CROP_KEYWORDS.find(([k]) => name.includes(k));
    if (hit) return hit[1];
  }
  return '';
}

export const ProcurementSection: React.FC<Props> = ({ user, language, selectedLocation, farmCrops }) => {
  const uid = user.uid;
  const t = useMemo(() => makeT(language), [language]);
  const today = todayISO();

  const [view, setView] = useState<View>('home');
  const [bookCentreId, setBookCentreId] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [profile, setProfile] = useState<ProcProfile | null | undefined>(undefined);
  const [prefill, setPrefill] = useState<ProcProfile | null>(null);
  const [officer, setOfficer] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  // ---- profile: reuse what Farmy already knows about the farmer ----
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [p, o] = await Promise.all([getProfile(uid), isOfficer(uid)]);
        if (off) return;
        setOfficer(o);
        if (p) { setProfile(p); return; }
        let phone = user.phoneNumber || '';
        try {
          const u = await getDoc(doc(db, 'users', uid));
          if (u.exists() && u.data().phoneNumber) phone = u.data().phoneNumber;
        } catch { /* optional */ }
        const [district = '', state = ''] = selectedLocation.split(',').map(s => s.trim());
        if (off) return;
        setPrefill({
          farmerId: `FRM-${uid.slice(0, 6).toUpperCase()}`,
          name: user.displayName || user.email?.split('@')[0] || '',
          mobile: phone, village: '', district, state, language,
          primaryCrop: guessCrop(farmCrops), updatedAt: Date.now(),
        });
        setProfile(null);
      } catch (e: any) {
        if (!off) { setLoadErr(e?.code === 'permission-denied' ? 'PERMISSION' : 'GENERIC'); setProfile(null); }
      }
    })();
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // ---- realtime data ----
  const centresSub = useSub<Centre[]>((cb, er) => subscribeCentres(cb, er), [], []);
  const bookingsSub = useSub<Booking[]>((cb, er) => subscribeMyBookings(uid, cb, er), [], [uid]);
  const notifSub = useSub<AppNotification[]>((cb, er) => subscribeNotifications(uid, cb, er), [], [uid]);
  const slotsToday = useSub<SlotDoc[]>((cb, er) => subscribeSlotsForDate(today, cb, er), [], [today]);
  const queueToday = useSub<QueueEntry[]>((cb, er) => subscribeQueueForDate(today, cb, er), [], [today]);

  const centres = centresSub.data;
  const bookings = bookingsSub.data;
  const current = bookings.find(b => b.id === selectedId) ?? pickActive(bookings);
  const currentCentre = centres.find(c => c.id === current?.centreId);

  // queue for the selected booking's own date (may differ from today)
  const queueSub = useSub<QueueEntry[]>(
    (cb, er) => (current ? subscribeQueueForDate(current.date, cb, er) : null), [], [current?.date],
  );
  const info = current ? queueInfo(queueSub.data, current, currentCentre) : null;

  const live = useMemo(() => {
    const m: Record<string, CentreLive> = {};
    centres.forEach(c => { m[c.id] = centreLive(c, today, slotsToday.data, queueToday.data); });
    return m;
  }, [centres, slotsToday.data, queueToday.data, today]);

  const unread = notifSub.data.filter(n => !n.read).length;

  // ---- device alert when the turn is approaching (only while Farmy is open) ----
  const prev = useRef<{ id?: string; state?: string }>({});
  useEffect(() => {
    if (!current || !info) return;
    const p = prev.current;
    if (
      p.id === current.id && p.state && p.state !== 'unknown' && p.state !== info.state &&
      ['prepare', 'next', 'turn'].includes(info.state) &&
      typeof Notification !== 'undefined' && Notification.permission === 'granted'
    ) {
      try {
        new Notification(`FARMY · ${current.token}`, {
          body: info.state === 'turn' ? t('proceedToCounter', { n: current.counter ?? 1 }) : t(`qs_${info.state}` as never),
        });
      } catch { /* some browsers block constructor use */ }
    }
    prev.current = { id: current.id, state: info.state };
  }, [info?.state, current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (v: View) => { setView(v); window.scrollTo({ top: 0 }); };
  const home = () => go('home');

  // ---- gates ----
  if (profile === undefined) return <Spinner label={t('loading')} />;
  if (profile === null || view === 'profile') {
    const base = profile ?? prefill;
    if (!base) return <Spinner label={t('loading')} />;
    return (
      <div className="space-y-3">
        {loadErr && <ErrorBox error={loadErr} t={t} />}
        <ProfileForm
          uid={uid} initial={base} isEdit={!!profile} t={t}
          onSaved={p => { setProfile(p); go('home'); }}
          onBack={home}
        />
      </div>
    );
  }

  // ---- views ----
  switch (view) {
    case 'centres':
      return <CentreList t={t} centres={centres} live={live} onBack={home} onBook={id => { setBookCentreId(id); go('book'); }} />;
    case 'book':
      return (
        <BookSlot
          t={t} uid={uid} profile={profile} centres={centres} bookings={bookings} initialCentreId={bookCentreId}
          onBack={home} onBooked={b => { setSelectedId(b.id); go('ticket'); }}
        />
      );
    case 'ticket':
      return (
        <TokenTicket
          t={t} bookings={bookings} current={current} centres={centres} queue={queueSub.data}
          onSelect={setSelectedId} onBack={home} onBook={() => { setBookCentreId(undefined); go('book'); }} onOpenQueue={() => go('queue')}
        />
      );
    case 'queue':
      return (
        <LiveQueue
          t={t} bookings={bookings} current={current} centre={currentCentre} info={info}
          queueLoading={queueSub.loading} queueError={queueSub.error}
          onSelect={setSelectedId} onBack={home} onBook={() => { setBookCentreId(undefined); go('book'); }}
        />
      );
    case 'status':
      return <StatusTimeline t={t} bookings={bookings} current={current} onSelect={setSelectedId} onBack={home} onBook={() => go('book')} />;
    case 'payment':
      return <PaymentStatusView t={t} bookings={bookings} current={current} onSelect={setSelectedId} onBack={home} onBook={() => go('book')} />;
    case 'notifications':
      return <Notifications t={t} items={notifSub.data} onBack={home} />;
    case 'officer':
      return <OfficerDashboard t={t} centres={centres} onBack={home} />;
  }

  // ---- home: procurement dashboard ----
  const cards: { view: View; icon: React.ReactNode; tint: string; title: string; sub: string; badge?: number }[] = [
    { view: 'book', icon: <CalendarDays className="w-5 h-5" />, tint: 'bg-emerald-50 text-emerald-700', title: t('bookSlot'), sub: t('cardBookSub') },
    { view: 'ticket', icon: <Ticket className="w-5 h-5" />, tint: 'bg-amber-50 text-amber-700', title: t('myToken'), sub: t('cardTokenSub') },
    { view: 'queue', icon: <Radio className="w-5 h-5" />, tint: 'bg-red-50 text-red-600', title: t('liveQueue'), sub: t('cardQueueSub') },
    { view: 'status', icon: <PackageCheck className="w-5 h-5" />, tint: 'bg-sky-50 text-sky-700', title: t('procStatus'), sub: t('cardStatusSub') },
    { view: 'payment', icon: <Wallet className="w-5 h-5" />, tint: 'bg-violet-50 text-violet-700', title: t('payStatus'), sub: t('cardPaySub') },
    { view: 'centres', icon: <MapPin className="w-5 h-5" />, tint: 'bg-orange-50 text-orange-700', title: t('findCentre'), sub: t('cardCentreSub') },
    { view: 'notifications', icon: <Bell className="w-5 h-5" />, tint: 'bg-rose-50 text-rose-600', title: t('notifications'), sub: t('cardNotifSub'), badge: unread },
  ];

  const err = centresSub.error || bookingsSub.error || notifSub.error;
  const latestNotif = notifSub.data[0];

  return (
    <div className="space-y-5 pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white p-5 sm:p-7 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -end-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <div className="inline-flex items-center gap-1.5 bg-emerald-700/80 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-100 border border-emerald-500/30">
              <Store className="w-3.5 h-3.5 text-emerald-300" /> {t('appTag')}
            </div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">{t('procTitle')}</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">{t('procSub')}</p>
            <p className="text-[11px] text-emerald-200/80">
              {profile.name} · <span dir="ltr" className="font-mono">{profile.farmerId}</span>
            </p>
          </div>
          <button onClick={() => go('profile')} aria-label={t('profileTitle')} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {err && <ErrorBox error={err} t={t} />}

      {/* Active token */}
      {current && (
        <button onClick={() => go(current.status === 'BOOKED' || current.status === 'ARRIVED' || current.status === 'WEIGHING' || current.status === 'QUALITY_CHECK' ? 'queue' : 'status')} className="w-full text-start">
          <Card className={`p-4 flex items-center justify-between gap-3 ${info?.state === 'turn' ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50' : ''}`}>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t('yourToken')}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span dir="ltr" className="text-xl font-black font-mono text-stone-900">{current.token}</span>
                <BookingStatusPill status={current.status} t={t} />
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                {current.centreName} · {prettyDate(current.date)} · <span dir="ltr">{current.slotLabel}</span>
              </div>
            </div>
            <div className="text-end shrink-0">
              {info && ['waiting', 'prepare', 'next'].includes(info.state) ? (
                <>
                  <div className="text-2xl font-black text-emerald-700 leading-none">{info.ahead}</div>
                  <div className="text-[10px] font-bold text-stone-500">{t('peopleAhead')}</div>
                </>
              ) : info?.state === 'turn' ? (
                <div className="text-sm font-black text-emerald-700">🟢 {t('qs_turn')}</div>
              ) : (
                <ChevronRight className="w-5 h-5 text-stone-400 rtl-flip" />
              )}
            </div>
          </Card>
        </button>
      )}

      {latestNotif && !latestNotif.read && (
        <button onClick={() => go('notifications')} className="w-full text-start">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Bell className="w-4 h-4 shrink-0" />
            <span className="truncate">{notificationText(latestNotif, t).message}</span>
          </div>
        </button>
      )}

      {/* Feature cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map(c => (
          <button
            key={c.view}
            onClick={() => { if (c.view === 'book') setBookCentreId(undefined); go(c.view); }}
            className="relative p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200 text-start shadow-xs hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${c.tint}`}>{c.icon}</div>
            <h4 className="text-sm font-extrabold text-stone-900 leading-tight">{c.title}</h4>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{c.sub}</p>
            {!!c.badge && (
              <span className="absolute top-3 end-3 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{c.badge}</span>
            )}
          </button>
        ))}

        {officer && (
          <button onClick={() => go('officer')} className="p-4 bg-emerald-900 hover:bg-emerald-800 rounded-2xl text-start shadow-xs transition-all col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-emerald-200 flex items-center justify-center mb-3"><ShieldCheck className="w-5 h-5" /></div>
            <h4 className="text-sm font-extrabold text-white leading-tight">{t('officerTitle')}</h4>
            <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-snug">{t('officerSub')}</p>
          </button>
        )}
      </div>
    </div>
  );
};
