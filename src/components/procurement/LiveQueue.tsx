import React from 'react';
import { Radio, Ticket, CalendarDays, Clock, Users, Megaphone } from 'lucide-react';
import { Booking, Centre, QueueEntry, QueueInfo } from '../../procurement/types';
import { prettyDate } from '../../procurement/logic';
import type { TFn } from '../../procurement/i18n';
import { BackBar, BookingPicker, Card, EmptyState, ErrorBox, primaryBtn } from './ui';

interface Props {
  t: TFn;
  bookings: Booking[];
  current?: Booking;
  centre?: Centre;
  info: QueueInfo | null;
  queueLoading: boolean;
  queueError: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onBook: () => void;
}

const stateStyle: Record<string, { box: string; emoji: string }> = {
  waiting: { box: 'bg-stone-50 border-stone-200 text-stone-800', emoji: '⚪' },
  prepare: { box: 'bg-amber-50 border-amber-300 text-amber-900', emoji: '🟡' },
  next: { box: 'bg-amber-100 border-amber-400 text-amber-900', emoji: '🟡' },
  turn: { box: 'bg-emerald-100 border-emerald-500 text-emerald-900', emoji: '🟢' },
  processing: { box: 'bg-sky-50 border-sky-300 text-sky-900', emoji: '🔵' },
  done: { box: 'bg-emerald-50 border-emerald-300 text-emerald-900', emoji: '✅' },
  cancelled: { box: 'bg-stone-100 border-stone-300 text-stone-600', emoji: '⚫' },
  unknown: { box: 'bg-stone-50 border-stone-200 text-stone-600', emoji: '⏳' },
};

export const LiveQueue: React.FC<Props> = ({
  t, bookings, current, centre, info, queueLoading, queueError, onSelect, onBack, onBook,
}) => {
  if (!current || !info) {
    return (
      <div className="space-y-4">
        <BackBar title={t('liveQueue')} onBack={onBack} />
        <EmptyState
          icon={<Radio className="w-6 h-6" />} title={t('noBookingYet')} text={t('queueNeedsBooking')}
          action={<button onClick={onBook} className={primaryBtn}><CalendarDays className="w-4 h-4" />{t('bookSlot')}</button>}
        />
      </div>
    );
  }

  const st = stateStyle[info.state];
  const servingText = info.serving.length
    ? info.serving.map(s => (s.counter ? `${s.token} · ${t('counter')} ${s.counter}` : s.token))
    : [];
  // Up to 8 dots: "you" dot at the end, one per person ahead
  const dots = Math.min(info.ahead, 8);

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      <BackBar
        title={t('liveQueue')}
        subtitle={`${current.centreName} · ${prettyDate(current.date)}`}
        onBack={onBack}
        right={
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('live')}
          </span>
        }
      />
      <BookingPicker bookings={bookings} selectedId={current.id} onSelect={onSelect} t={t} />
      {queueError && <ErrorBox error={queueError} t={t} />}

      {/* Status banner */}
      <div className={`rounded-2xl border-2 p-5 text-center ${st.box}`}>
        <div className="text-[11px] font-black uppercase tracking-widest opacity-70">{t('status')}</div>
        <div className="text-xl font-black mt-1">{st.emoji} {t(`qs_${info.state}` as never)}</div>
        {info.state === 'turn' && (
          <p className="text-sm font-bold mt-1">{t('proceedToCounter', { n: current.counter ?? 1 })}</p>
        )}
        {info.state === 'next' && <p className="text-xs font-medium mt-1">{t('qsNextHint')}</p>}
        {info.state === 'prepare' && <p className="text-xs font-medium mt-1">{t('qsPrepareHint')}</p>}
        {current.status === 'BOOKED' && info.state !== 'cancelled' && (
          <p className="text-[11px] mt-2 opacity-80">{t('checkInHint')}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <div className="text-[10px] font-black uppercase tracking-wide text-stone-400 flex items-center justify-center gap-1"><Megaphone className="w-3 h-3" />{t('nowServing')}</div>
          {queueLoading ? <div className="text-stone-400 mt-2">…</div> : servingText.length ? (
            <div className="mt-1 space-y-0.5">
              {servingText.map(s => <div key={s} dir="ltr" className="text-base font-black font-mono text-stone-900">{s}</div>)}
            </div>
          ) : <div className="text-xs font-bold text-stone-500 mt-2">{t('notStarted')}</div>}
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-black uppercase tracking-wide text-stone-400 flex items-center justify-center gap-1"><Ticket className="w-3 h-3" />{t('yourToken')}</div>
          <div dir="ltr" className="text-xl font-black font-mono text-emerald-700 mt-1">{current.token}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-black uppercase tracking-wide text-stone-400 flex items-center justify-center gap-1"><Users className="w-3 h-3" />{t('peopleAhead')}</div>
          <div className="text-3xl font-black text-stone-900 mt-1">{info.state === 'waiting' || info.state === 'prepare' || info.state === 'next' ? info.ahead : '–'}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-black uppercase tracking-wide text-stone-400 flex items-center justify-center gap-1"><Clock className="w-3 h-3" />{t('estWait')}</div>
          <div className="text-3xl font-black text-stone-900 mt-1">
            {info.state === 'waiting' || info.state === 'prepare' || info.state === 'next' ? info.etaMin : '–'}
            <span className="text-xs font-bold text-stone-500 ms-1">{t('minutes')}</span>
          </div>
        </Card>
      </div>

      {(info.state === 'waiting' || info.state === 'prepare' || info.state === 'next') && (
        <Card className="p-4">
          <div className="flex items-center gap-1.5 flex-wrap" dir="ltr">
            {Array.from({ length: dots }).map((_, i) => <span key={i} className="w-5 h-5 rounded-full bg-stone-300" />)}
            {info.ahead > dots && <span className="text-[11px] font-bold text-stone-500">+{info.ahead - dots}</span>}
            <span className="w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">{t('etaDisclaimer', { min: centre?.avgServiceMinutes ?? 6 })}</p>
        </Card>
      )}
    </div>
  );
};
